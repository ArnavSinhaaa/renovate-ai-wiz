import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// AI Provider configurations
const AI_PROVIDERS = {
  GOOGLE: {
    name: 'Google Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1/models/',
    models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-3-pro-preview'],
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
    const { imageBase64, selectedProvider = 'LOVABLE', selectedModel } = await req.json();
    
    console.log(`[analyze-room-v2] Request received:`, {
      provider: selectedProvider,
      model: selectedModel,
      hasImage: !!imageBase64,
      imageSize: imageBase64?.length
    });
    
    if (!imageBase64) {
      console.error('[analyze-room-v2] Error: Missing image');
      return new Response(
        JSON.stringify({ error: 'Image is required for analysis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[analyze-room-v2] Starting analysis with ${selectedProvider}...`);
    
    const provider = AI_PROVIDERS[selectedProvider as keyof typeof AI_PROVIDERS];
    if (!provider) {
      console.error(`[analyze-room-v2] Error: Invalid provider "${selectedProvider}"`);
      return new Response(
        JSON.stringify({ 
          error: `Invalid AI provider selected: ${selectedProvider}`,
          availableProviders: Object.keys(AI_PROVIDERS)
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get(provider.keyName);
    if (!apiKey) {
      console.error(`[analyze-room-v2] Error: API key not found for ${provider.name} (${provider.keyName})`);
      return new Response(
        JSON.stringify({ 
          error: `${provider.name} API key not configured. Please add ${provider.keyName} to Supabase secrets.`,
          provider: provider.name,
          keyName: provider.keyName,
          status: 'out_of_service'
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const model = selectedModel || provider.models[0];
    console.log(`[analyze-room-v2] Using ${provider.name} with model: ${model}`);
    
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
      console.error(`[analyze-room-v2] Analysis failed:`, {
        provider: provider.name,
        model: model,
        error: response.error,
        status: response.status
      });
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: `${provider.name} rate limit exceeded. Please wait and try again.`,
            provider: provider.name,
            status: 'rate_limited',
            details: response.error
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({
          error: response.error,
          provider: provider.name,
          model: model,
          status: 'error',
          suggestion: 'Try switching to Lovable AI provider or check API key configuration'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = response.data;
    console.log(`[analyze-room-v2] Analysis completed successfully with ${provider.name}`);

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
    const err = error as Error;
    console.error('[analyze-room-v2] Unexpected error:', {
      message: err.message,
      stack: err.stack,
      type: err.constructor.name
    });
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze room due to unexpected error',
        details: err.message,
        status: 'error',
        suggestion: 'Check edge function logs for more details'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function analyzeWithGroq(apiKey: string, model: string, prompt: string, imageBase64: string) {
  console.log(`[Groq] Starting analysis with model: ${model}`);
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
      console.error(`[Groq] API error: ${response.status}`, errorText);
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
    console.log(`[Groq] Analysis succeeded, found ${parsedData.detectedObjects?.length || 0} objects`);
    return { data: parsedData };

  } catch (error) {
    const err = error as Error;
    console.error(`[Groq] Exception:`, error);
    return { error: `Groq analysis failed: ${err.message}` };
  }
}

async function analyzeWithGoogle(apiKey: string, model: string, prompt: string, imageBase64: string) {
  console.log(`[Google] Starting analysis with model: ${model}`);
  try {
    const imageData = imageBase64.split(',')[1] || imageBase64;
    
    // Use v1 API endpoint for latest models
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`, {
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
          temperature: 0.4,
          maxOutputTokens: 8000,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Google] API error: ${response.status}`, errorText);
      return { error: `Google AI error: ${response.status} - ${errorText}`, status: response.status };
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      console.error('[Google] No content in response:', JSON.stringify(data));
      return { error: 'No content received from Google AI' };
    }

    console.log('[Google] Raw response content:', content.substring(0, 500));

    // Clean and parse JSON response - handle markdown code blocks
    let jsonText = content;
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Find JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[Google] No JSON found in content:', content.substring(0, 200));
      return { error: 'No valid JSON found in response' };
    }

    try {
      const parsedData = JSON.parse(jsonMatch[0]);
      console.log(`[Google] Analysis succeeded, found ${parsedData.detectedObjects?.length || 0} objects`);
      return { data: parsedData };
    } catch (parseError) {
      console.error('[Google] JSON parse error:', parseError, 'Content:', jsonMatch[0].substring(0, 200));
      return { error: `Failed to parse JSON: ${parseError.message}` };
    }

  } catch (error) {
    const err = error as Error;
    console.error(`[Google] Exception:`, error);
    return { error: `Google AI analysis failed: ${err.message}` };
  }
}

async function analyzeWithOpenAI(apiKey: string, model: string, prompt: string, imageBase64: string) {
  console.log(`[OpenAI] Starting analysis with model: ${model}`);
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
      console.error(`[OpenAI] API error: ${response.status}`, errorText);
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
    console.log(`[OpenAI] Analysis succeeded, found ${parsedData.detectedObjects?.length || 0} objects`);
    return { data: parsedData };

  } catch (error) {
    const err = error as Error;
    console.error(`[OpenAI] Exception:`, error);
    return { error: `OpenAI analysis failed: ${err.message}` };
  }
}

async function analyzeWithLovable(apiKey: string, model: string, prompt: string, imageBase64: string) {
  console.log(`[Lovable] Starting analysis with model: ${model}`);
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
      console.error(`[Lovable] API error: ${response.status}`, errorText);
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
    console.log(`[Lovable] Analysis succeeded, found ${parsedData.detectedObjects?.length || 0} objects`);
    return { data: parsedData };

  } catch (error) {
    const err = error as Error;
    console.error(`[Lovable] Exception:`, error);
    return { error: `Lovable AI analysis failed: ${err.message}` };
  }
}