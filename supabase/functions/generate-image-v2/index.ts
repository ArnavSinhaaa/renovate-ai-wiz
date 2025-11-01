import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Image Generation Provider configurations
const IMAGE_PROVIDERS = {
  REPLICATE: {
    name: 'Replicate',
    endpoint: 'https://api.replicate.com/v1/predictions',
    models: ['black-forest-labs/flux-schnell', 'stability-ai/stable-diffusion-3'],
    keyName: 'REPLICATE_API_TOKEN',
    freeLimit: 50, // requests per month
    rateLimit: 5 // requests per minute
  },
  HUGGINGFACE: {
    name: 'Hugging Face',
    endpoint: 'https://api-inference.huggingface.co/models/',
    models: ['black-forest-labs/FLUX.1-schnell', 'stabilityai/stable-diffusion-xl-base-1.0'],
    keyName: 'HUGGINGFACE_API_KEY',
    freeLimit: 100, // requests per month
    rateLimit: 10 // requests per minute
  },
  LOVABLE: {
    name: 'Lovable AI',
    endpoint: 'https://ai.gateway.lovable.dev/v1/chat/completions',
    models: ['google/gemini-2.5-flash-image'],
    keyName: 'LOVABLE_API_KEY',
    freeLimit: 30, // requests per day
    rateLimit: 3 // requests per minute
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      prompt, 
      originalImage,
      selectedProvider = 'HUGGINGFACE', 
      selectedModel,
      width = 1024,
      height = 1024
    } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required for image generation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting image generation with ${selectedProvider}...`);
    
    const provider = IMAGE_PROVIDERS[selectedProvider as keyof typeof IMAGE_PROVIDERS];
    if (!provider) {
      return new Response(
        JSON.stringify({ error: 'Invalid image provider selected' }),
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
    
    let response;
    
    if (selectedProvider === 'REPLICATE') {
      response = await generateWithReplicate(apiKey, model, prompt, originalImage, width, height);
    } else if (selectedProvider === 'HUGGINGFACE') {
      response = await generateWithHuggingFace(apiKey, model, prompt, originalImage);
    } else if (selectedProvider === 'LOVABLE') {
      response = await generateWithLovable(apiKey, model, prompt, originalImage);
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

    console.log('Image generation completed successfully');

    return new Response(
      JSON.stringify({
        imageUrl: response.imageUrl,
        prompt: prompt,
        provider: provider.name,
        model: model,
        status: 'success'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Image generation error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate image',
        details: error.message,
        status: 'error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateWithReplicate(apiKey: string, model: string, prompt: string, originalImage?: string, width = 1024, height = 1024) {
  try {
    const input: any = {
      prompt: prompt,
      width: width,
      height: height,
      num_outputs: 1,
      guidance_scale: 7.5,
      num_inference_steps: 4
    };

    if (originalImage) {
      input.image = originalImage;
      input.strength = 0.8;
    }

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: getReplicateVersion(model),
        input: input
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { error: `Replicate API error: ${response.status} - ${errorText}`, status: response.status };
    }

    const prediction = await response.json();
    
    // Wait for completion
    let result = prediction;
    while (result.status === 'starting' || result.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { 'Authorization': `Token ${apiKey}` }
      });
      result = await statusResponse.json();
    }

    if (result.status === 'succeeded') {
      return { imageUrl: result.output[0] };
    } else {
      return { error: `Generation failed: ${result.error}` };
    }

  } catch (error) {
    return { error: `Replicate generation failed: ${error.message}` };
  }
}

async function generateWithHuggingFace(apiKey: string, model: string, prompt: string, originalImage?: string) {
  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          guidance_scale: 7.5,
          num_inference_steps: 20
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { error: `Hugging Face API error: ${response.status} - ${errorText}`, status: response.status };
    }

    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    return { imageUrl: `data:image/png;base64,${base64}` };

  } catch (error) {
    return { error: `Hugging Face generation failed: ${error.message}` };
  }
}

async function generateWithLovable(apiKey: string, model: string, prompt: string, originalImage?: string) {
  try {
    const messages: any[] = [
      {
        role: 'user',
        content: originalImage ? [
          { type: 'text', text: `Transform this room image: ${prompt}` },
          { type: 'image_url', image_url: { url: originalImage } }
        ] : `Generate a room renovation image: ${prompt}`
      }
    ];

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        modalities: ['image', 'text']
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { error: `Lovable AI error: ${response.status} - ${errorText}`, status: response.status };
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      return { error: 'No image received from Lovable AI' };
    }

    return { imageUrl };

  } catch (error) {
    return { error: `Lovable AI generation failed: ${error.message}` };
  }
}

function getReplicateVersion(model: string): string {
  const versions = {
    'black-forest-labs/flux-schnell': '85a7b3e7aed47e0aab28b7e1d3cda7b5b7a2b6a4d3f6e7b2e6d9f8c5e4a3b2c1',
    'stability-ai/stable-diffusion-3': '527d2a6296facb8e47ba1eaf17f142c240c19a30894f437feee9b91cc29d8e4f'
  };
  return versions[model] || versions['black-forest-labs/flux-schnell'];
}