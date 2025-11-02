import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateWithStability } from "./stability.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Image Generation Provider configurations
const IMAGE_PROVIDERS = {
  HUGGINGFACE: {
    name: 'Hugging Face',
    endpoint: 'https://api-inference.huggingface.co/models/',
    models: ['black-forest-labs/FLUX.1-schnell', 'black-forest-labs/FLUX.1-dev', 'stabilityai/stable-diffusion-xl-base-1.0'],
    keyName: 'HUGGINGFACE_API_KEY',
    freeLimit: 100, // requests per month
    rateLimit: 10 // requests per minute
  },
  REPLICATE: {
    name: 'Replicate',
    endpoint: 'https://api.replicate.com/v1/predictions',
    models: ['black-forest-labs/flux-schnell', 'stability-ai/sdxl'],
    keyName: 'REPLICATE_API_TOKEN',
    freeLimit: 50, // requests per month
    rateLimit: 5 // requests per minute
  },
  STABILITY: {
    name: 'Stability AI',
    endpoint: 'https://api.stability.ai/v1/generation/',
    models: ['stable-diffusion-xl-1024-v1-0', 'stable-diffusion-v1-6'],
    keyName: 'STABILITY_API_KEY',
    freeLimit: 25, // requests per month
    rateLimit: 5 // requests per minute
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
    
    console.log(`[generate-image-v2] Request received:`, {
      provider: selectedProvider,
      model: selectedModel,
      hasImage: !!originalImage,
      promptLength: prompt?.length,
      dimensions: `${width}x${height}`
    });
    
    if (!prompt) {
      console.error('[generate-image-v2] Error: Missing prompt');
      return new Response(
        JSON.stringify({ error: 'Prompt is required for image generation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[generate-image-v2] Starting generation with ${selectedProvider}...`);
    
    const provider = IMAGE_PROVIDERS[selectedProvider as keyof typeof IMAGE_PROVIDERS];
    if (!provider) {
      console.error(`[generate-image-v2] Error: Invalid provider "${selectedProvider}"`);
      return new Response(
        JSON.stringify({ 
          error: `Invalid image provider selected: ${selectedProvider}`,
          availableProviders: Object.keys(IMAGE_PROVIDERS)
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get(provider.keyName);
    if (!apiKey) {
      console.error(`[generate-image-v2] Error: API key not found for ${provider.name} (${provider.keyName})`);
      return new Response(
        JSON.stringify({ 
          error: `${provider.name} API key not configured. Please add ${provider.keyName} to your Supabase secrets.`,
          provider: provider.name,
          keyName: provider.keyName,
          status: 'out_of_service'
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[generate-image-v2] Using ${provider.name} with model: ${selectedModel || provider.models[0]}`);

    const model = selectedModel || provider.models[0];
    
    let response;
    
    if (selectedProvider === 'REPLICATE') {
      response = await generateWithReplicate(apiKey, model, prompt, originalImage, width, height);
    } else if (selectedProvider === 'HUGGINGFACE') {
      response = await generateWithHuggingFace(apiKey, model, prompt, originalImage);
    } else if (selectedProvider === 'STABILITY') {
      response = await generateWithStability(apiKey, model, prompt, width, height);
    } else if (selectedProvider === 'LOVABLE') {
      response = await generateWithLovable(apiKey, model, prompt, originalImage);
    } else {
      throw new Error(`Provider ${selectedProvider} not implemented yet`);
    }

    if (response.error) {
      console.error(`[generate-image-v2] Generation failed:`, {
        provider: provider.name,
        error: response.error,
        status: response.status
      });
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: `${provider.name} rate limit exceeded. Please wait and try again, or switch to a different provider.`,
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
          suggestion: 'Try switching to a different provider or check API key configuration'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[generate-image-v2] Generation completed successfully with ${provider.name}`);

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
    console.error('[generate-image-v2] Unexpected error:', {
      message: error.message,
      stack: error.stack,
      type: error.constructor.name
    });
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate image due to unexpected error',
        details: error.message,
        status: 'error',
        suggestion: 'Check edge function logs for more details'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateWithReplicate(apiKey: string, model: string, prompt: string, originalImage?: string, width = 1024, height = 1024) {
  console.log(`[Replicate] Starting generation with model: ${model}`);
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
      console.error(`[Replicate] API error: ${response.status}`, errorText);
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
      console.log(`[Replicate] Generation succeeded`);
      return { imageUrl: result.output[0] };
    } else {
      console.error(`[Replicate] Generation failed:`, result.error);
      return { error: `Generation failed: ${result.error}` };
    }

  } catch (error) {
    console.error(`[Replicate] Exception:`, error);
    return { error: `Replicate generation failed: ${error.message}` };
  }
}

async function generateWithHuggingFace(apiKey: string, model: string, prompt: string, originalImage?: string) {
  console.log(`[HuggingFace] Starting generation with model: ${model}`);
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
      console.error(`[HuggingFace] API error: ${response.status}`, errorText);
      return { error: `Hugging Face API error: ${response.status} - ${errorText}`, status: response.status };
    }

    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    console.log(`[HuggingFace] Generation succeeded, image size: ${arrayBuffer.byteLength} bytes`);
    return { imageUrl: `data:image/png;base64,${base64}` };

  } catch (error) {
    console.error(`[HuggingFace] Exception:`, error);
    return { error: `Hugging Face generation failed: ${error.message}` };
  }
}

async function generateWithLovable(apiKey: string, model: string, prompt: string, originalImage?: string) {
  console.log(`[Lovable] Starting generation with model: ${model}`);
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
      console.error(`[Lovable] API error: ${response.status}`, errorText);
      return { error: `Lovable AI error: ${response.status} - ${errorText}`, status: response.status };
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error(`[Lovable] No image in response:`, data);
      return { error: 'No image received from Lovable AI' };
    }

    console.log(`[Lovable] Generation succeeded`);
    return { imageUrl };

  } catch (error) {
    console.error(`[Lovable] Exception:`, error);
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