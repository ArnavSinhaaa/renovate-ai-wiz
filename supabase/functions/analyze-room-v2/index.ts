import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// AI Provider configurations
const AI_PROVIDERS = {
  GOOGLE: {
    name: 'Google Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/',
    models: ['gemini-1.5-flash', 'gemini-1.5-pro'],
    keyName: 'GOOGLE_AI_KEY',
    freeLimit: 1500, // requests per day
    rateLimit: 15 // requests per minute
  },
  OPENAI: {
    name: 'OpenAI GPT-4',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    models: ['gpt-4o-mini', 'gpt-4o'],
    keyName: 'OPENAI_API_KEY',
    freeLimit: 200, // depends on account
    rateLimit: 10 // requests per minute
  },
  GROQ: {
    name: 'Groq',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    models: ['llama-3.2-90b-vision-preview', 'llava-v1.5-7b-4096-preview'],
    keyName: 'GROQ_API_KEY',
    freeLimit: 100, // requests per day
    rateLimit: 30 // requests per minute
  },
  LOVABLE: {
    name: 'Lovable AI',
    endpoint: 'https://ai.gateway.lovable.dev/v1/chat/completions',
    models: ['google/gemini-2.5-flash', 'google/gemini-2.5-pro'],
    keyName: 'LOVABLE_API_KEY',
    freeLimit: 50, // requests per day
    rateLimit: 5 // requests per minute
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, selectedProvider = 'GROQ', selectedModel } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Image is required for analysis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting analysis with ${selectedProvider}...`);
    
    const provider = AI_PROVIDERS[selectedProvider as keyof typeof AI_PROVIDERS];
    if (!provider) {
      return new Response(
        JSON.stringify({ error: 'Invalid AI provider selected' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get(provider.keyName);
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          error: `${provider.name} API key not configured`,
          provider: provider.name,
          status: 'out_of_service'
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const model = selectedModel || provider.models[0];
    
    const analysisPrompt = `Analyze this room image and provide a detailed JSON response with detected objects and renovation suggestions. Focus on identifying furniture, lighting, flooring, walls, and potential improvements.

Return ONLY a valid JSON object in this exact format:
{
  "detectedObjects": [
    {
      "name": "object_name",
      "confidence": 0.95,
      "location": "location_in_room",
      "projectTitle": "specific_renovation_project",
      "roomArea": "area_type",
      "projectType": "DIY|Professional",
      "issueSolved": "what_problem_this_solves",
      "estimatedCost": 15000,
      "timelineDays": 3,
      "shoppingLinks": [
        {
          "store": "store_name",
          "url": "product_url",
          "price": "₹X,XXX"
        }
      ]
    }
  ]
}

Provide 3-7 realistic objects with Indian pricing in Rupees. Make suggestions practical and cost-effective.`;

    let response;
    
    if (selectedProvider === 'GROQ') {
      response = await analyzeWithGroq(apiKey, model, analysisPrompt, imageBase64);
    } else if (selectedProvider === 'GOOGLE') {
      response = await analyzeWithGoogle(apiKey, model, analysisPrompt, imageBase64);
    } else if (selectedProvider === 'OPENAI') {
      response = await analyzeWithOpenAI(apiKey, model, analysisPrompt, imageBase64);
    } else if (selectedProvider === 'LOVABLE') {
      response = await analyzeWithLovable(apiKey, model, analysisPrompt, imageBase64);
    } else {
      throw new Error(`Provider ${selectedProvider} not implemented yet`);
    }

    if (response.error) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: `${provider.name} rate limit exceeded. Try again later.`,
            provider: provider.name,
            status: 'rate_limited'
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({
          error: response.error,
          provider: provider.name,
          status: 'error'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = response.data;
    console.log('Analysis completed successfully');

    return new Response(
      JSON.stringify({
        detectedObjects: result.detectedObjects || [],
        provider: provider.name,
        model: model,
        status: 'success'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze room',
        details: error.message,
        status: 'error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function analyzeWithGroq(apiKey: string, model: string, prompt: string, imageBase64: string) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { 
                type: 'image_url', 
                image_url: { url: imageBase64 }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { error: `Groq API error: ${response.status} - ${errorText}`, status: response.status };
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      return { error: 'No content received from Groq' };
    }

    // Clean and parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { error: 'No valid JSON found in response' };
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    return { data: parsedData };

  } catch (error) {
    return { error: `Groq analysis failed: ${error.message}` };
  }
}

async function analyzeWithGoogle(apiKey: string, model: string, prompt: string, imageBase64: string) {
  try {
    const imageData = imageBase64.split(',')[1] || imageBase64;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: imageData
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { error: `Google AI error: ${response.status} - ${errorText}`, status: response.status };
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      return { error: 'No content received from Google AI' };
    }

    // Clean and parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { error: 'No valid JSON found in response' };
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    return { data: parsedData };

  } catch (error) {
    return { error: `Google AI analysis failed: ${error.message}` };
  }
}

async function analyzeWithOpenAI(apiKey: string, model: string, prompt: string, imageBase64: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { 
                type: 'image_url', 
                image_url: { url: imageBase64 }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { error: `OpenAI API error: ${response.status} - ${errorText}`, status: response.status };
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      return { error: 'No content received from OpenAI' };
    }

    // Clean and parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { error: 'No valid JSON found in response' };
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    return { data: parsedData };

  } catch (error) {
    return { error: `OpenAI analysis failed: ${error.message}` };
  }
}

async function analyzeWithLovable(apiKey: string, model: string, prompt: string, imageBase64: string) {
  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { 
                type: 'image_url', 
                image_url: { url: imageBase64 }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { error: `Lovable AI error: ${response.status} - ${errorText}`, status: response.status };
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      return { error: 'No content received from Lovable AI' };
    }

    // Clean and parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { error: 'No valid JSON found in response' };
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    return { data: parsedData };

  } catch (error) {
    return { error: `Lovable AI analysis failed: ${error.message}` };
  }
}