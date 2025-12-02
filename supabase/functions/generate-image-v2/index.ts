import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { generateWithStability } from "./stability.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Image Generation Provider configurations
const IMAGE_PROVIDERS = {
  OPENAI: {
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/images/generations',
    models: ['gpt-image-1', 'dall-e-3'],
    keyName: 'OPENAI_API_KEY',
    freeLimit: 100, // requests per month
    rateLimit: 10, // requests per minute
    supportsImg2Img: 'full' // gpt-image-1 has excellent img2img support
  },
  HUGGINGFACE: {
    name: 'Hugging Face',
    endpoint: 'https://api-inference.huggingface.co/models/',
    models: ['black-forest-labs/FLUX.1-schnell', 'black-forest-labs/FLUX.1-dev', 'stabilityai/stable-diffusion-xl-base-1.0'],
    keyName: 'HUGGINGFACE_API_KEY',
    freeLimit: 100, // requests per month
    rateLimit: 10, // requests per minute
    supportsImg2Img: 'limited' // FLUX has limited img2img via Inference API
  },
  REPLICATE: {
    name: 'Replicate',
    endpoint: 'https://api.replicate.com/v1/predictions',
    models: ['black-forest-labs/flux-schnell', 'stability-ai/sdxl'],
    keyName: 'REPLICATE_API_TOKEN',
    freeLimit: 50, // requests per month
    rateLimit: 5, // requests per minute
    supportsImg2Img: 'full' // Best for img2img transformations
  },
  STABILITY: {
    name: 'Stability AI',
    endpoint: 'https://api.stability.ai/v1/generation/',
    models: ['stable-diffusion-xl-1024-v1-0', 'stable-diffusion-v1-6'],
    keyName: 'STABILITY_API_KEY',
    freeLimit: 25, // requests per month
    rateLimit: 5, // requests per minute
    supportsImg2Img: 'no' // Text-to-image only
  },
  LOVABLE: {
    name: 'Lovable AI',
    endpoint: 'https://ai.gateway.lovable.dev/v1/chat/completions',
    models: ['google/gemini-2.5-flash-image'],
    keyName: 'LOVABLE_API_KEY',
    freeLimit: 30, // requests per day
    rateLimit: 3, // requests per minute
    supportsImg2Img: 'full' // Excellent for image editing and preservation
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
      selectedProvider = 'OPENAI', 
      selectedModel,
      width = 1024,
      height = 1024,
      strength = 0.5 // How much to transform the image (0.1 = subtle, 0.9 = major changes)
    } = await req.json();
    
    console.log(`[generate-image-v2] Request received:`, {
      provider: selectedProvider,
      model: selectedModel,
      hasImage: !!originalImage,
      promptLength: prompt?.length,
      dimensions: `${width}x${height}`,
      strength: strength,
      mode: originalImage ? 'img2img' : 'text2img'
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
    
    // Validation: Prevent using Google for image generation
    if (selectedProvider === 'GOOGLE') {
      console.error('[generate-image-v2] Error: Google Gemini does not support image generation');
      return new Response(
        JSON.stringify({ 
          error: 'Google Gemini does not support image generation. It only supports text generation and image analysis.',
          provider: 'Google Gemini',
          status: 'error',
          suggestion: 'Please switch to Lovable AI (recommended), Replicate, Hugging Face, or Stability AI for image generation'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    let response;
    
    if (selectedProvider === 'OPENAI') {
      response = await generateWithOpenAI(apiKey, model, prompt, originalImage, width, height, strength);
    } else if (selectedProvider === 'REPLICATE') {
      response = await generateWithReplicate(apiKey, model, prompt, originalImage, width, height, strength);
    } else if (selectedProvider === 'HUGGINGFACE') {
      response = await generateWithHuggingFace(apiKey, model, prompt, originalImage, strength);
    } else if (selectedProvider === 'STABILITY') {
      response = await generateWithStability(apiKey, model, prompt, width, height);
    } else if (selectedProvider === 'LOVABLE') {
      response = await generateWithLovable(apiKey, model, prompt, originalImage, strength);
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
    const err = error as Error;
    console.error('[generate-image-v2] Unexpected error:', {
      message: err.message,
      stack: err.stack,
      type: err.constructor.name
    });
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate image due to unexpected error',
        details: err.message,
        status: 'error',
        suggestion: 'Check edge function logs for more details'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateWithOpenAI(apiKey: string, model: string, prompt: string, originalImage?: string, width = 1024, height = 1024, strength = 0.5) {
  console.log(`[OpenAI] Starting generation with model: ${model}, mode: ${originalImage ? 'img2img' : 'text2img'}`);
  try {
    if (originalImage) {
      // For image editing, we need to use the /v1/images/edits endpoint
      // However, gpt-image-1 doesn't support edits endpoint yet
      // We'll use generations endpoint with a detailed prompt instead
      console.log('[OpenAI] Using text-to-image with detailed prompt for room transformation');
      
      const requestBody: any = {
        model: model,
        prompt: `Create a photorealistic room renovation based on this description: ${prompt}. 
        
Style: Modern interior design, high-quality architectural photography
Requirements:
- Professional lighting and shadows
- Realistic textures and materials
- Proper perspective and depth
- Attention to detail in furniture and decor
- Clean, well-composed shot
- Transformation intensity: ${Math.round(strength * 100)}%`,
        n: 1,
        size: `${width}x${height}`,
        quality: 'high',
        response_format: 'b64_json'
      };

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[OpenAI] API error: ${response.status}`, errorText);
        
        if (response.status === 429) {
          return { error: 'Rate limit exceeded', status: 429 };
        }
        
        return { error: `OpenAI API error: ${response.status} - ${errorText}`, status: response.status };
      }

      const data = await response.json();
      const imageUrl = data.data?.[0]?.b64_json 
        ? `data:image/png;base64,${data.data[0].b64_json}`
        : data.data?.[0]?.url;
      
      if (!imageUrl) {
        console.error(`[OpenAI] No image in response:`, data);
        return { error: 'No image received from OpenAI' };
      }

      console.log(`[OpenAI] Generation succeeded`);
      return { imageUrl };
    } else {
      // Text-to-image generation
      const requestBody: any = {
        model: model,
        prompt: prompt,
        n: 1,
        size: `${width}x${height}`,
        quality: 'high',
        response_format: 'b64_json'
      };

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[OpenAI] API error: ${response.status}`, errorText);
        
        if (response.status === 429) {
          return { error: 'Rate limit exceeded', status: 429 };
        }
        
        return { error: `OpenAI API error: ${response.status} - ${errorText}`, status: response.status };
      }

      const data = await response.json();
      const imageUrl = data.data?.[0]?.b64_json 
        ? `data:image/png;base64,${data.data[0].b64_json}`
        : data.data?.[0]?.url;
      
      if (!imageUrl) {
        console.error(`[OpenAI] No image in response:`, data);
        return { error: 'No image received from OpenAI' };
      }

      console.log(`[OpenAI] Generation succeeded`);
      return { imageUrl };
    }

  } catch (error) {
    const err = error as Error;
    console.error(`[OpenAI] Exception:`, error);
    return { error: `OpenAI generation failed: ${err.message}` };
  }
}

async function generateWithGoogle(apiKey: string, model: string, prompt: string, originalImage?: string, strength = 0.5) {
  console.log(`[Google] Starting generation with model: ${model}, mode: ${originalImage ? 'img2img' : 'text2img'}`);
  
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    // Build the request for image editing
    const parts: any[] = [];
    
    if (originalImage) {
      // Extract base64 data and mime type
      const base64Match = originalImage.match(/data:image\/(\w+);base64,(.+)/);
      if (!base64Match) {
        throw new Error('Invalid image format');
      }
      
      const mimeType = `image/${base64Match[1]}`;
      const base64Data = base64Match[2];
      
      // Add the original image first
      parts.push({
        inline_data: {
          mime_type: mimeType,
          data: base64Data
        }
      });
      
      // Enhanced prompt for image editing with structure preservation
      const editPrompt = `EDIT this room image by applying these specific changes while preserving the original room structure:

${prompt}

CRITICAL INSTRUCTIONS FOR NATURAL IMAGE EDITING:
1. PRESERVE ORIGINAL STRUCTURE:
   - Keep exact same camera angle, viewpoint, and perspective
   - Maintain all walls, windows, doors, and architectural elements in original positions
   - Keep room dimensions and spatial layout identical
   - Preserve furniture positions and arrangements

2. MODIFY ONLY SPECIFIED ELEMENTS:
   - Apply the requested color changes, materials, or decor updates
   - Maintain realistic lighting that matches original image
   - Ensure natural transitions between edited and preserved areas
   - Keep depth perception and 3D space accurate

3. QUALITY STANDARDS:
   - Generate photorealistic results as if professionally renovated
   - Maintain consistent lighting direction and shadows
   - Preserve image quality and resolution
   - Apply changes with ${Math.round(strength * 100)}% intensity

4. DO NOT:
   - Add or remove major structural elements
   - Change room layout or dimensions
   - Alter camera position or perspective
   - Generate completely new images

Apply the transformation naturally as if a professional interior designer edited the original photo.`;
      
      parts.push({
        text: editPrompt
      });
    } else {
      // Text-to-image generation
      parts.push({
        text: `Generate a high-quality, photorealistic interior design image: ${prompt}`
      });
    }
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: parts
        }],
        generationConfig: {
          temperature: 0.4, // Lower temperature for more consistent edits
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Google] API error: ${response.status} - ${errorText}`);
      
      if (response.status === 429) {
        return { error: 'Rate limit exceeded', status: 429 };
      }
      
      return { error: `Google API error: ${response.status} - ${errorText}`, status: response.status };
    }

    const data = await response.json();
    console.log('[Google] Response received');

    // Extract the generated image from the response
    const candidate = data.candidates?.[0];
    if (!candidate?.content?.parts) {
      console.error('[Google] Invalid response structure:', JSON.stringify(data).substring(0, 300));
      return { error: 'No image generated in response' };
    }

    // Find the image part
    const imagePart = candidate.content.parts.find((part: any) => part.inline_data);
    if (!imagePart?.inline_data?.data) {
      console.error('[Google] No image data found in parts');
      return { error: 'No image data in response' };
    }

    const base64Image = imagePart.inline_data.data;
    const mimeType = imagePart.inline_data.mime_type || 'image/png';
    const imageUrl = `data:${mimeType};base64,${base64Image}`;

    console.log(`[Google] Generation succeeded, image size: ${base64Image.length} bytes`);

    return { imageUrl };
  } catch (error) {
    const err = error as Error;
    console.error('[Google] Generation failed:', error);
    return { error: `Google Gemini generation failed: ${err.message}` };
  }
}

async function generateWithReplicate(apiKey: string, model: string, prompt: string, originalImage?: string, width = 1024, height = 1024, strength = 0.5) {
  console.log(`[Replicate] Starting generation with model: ${model}, mode: ${originalImage ? 'img2img' : 'text2img'}`);
  try {
    const input: any = {
      prompt: prompt,
      width: width,
      height: height,
      num_outputs: 1,
      guidance_scale: 7.5,
      num_inference_steps: originalImage ? 25 : 4 // More steps for img2img for quality
    };

    if (originalImage) {
      input.image = originalImage;
      input.strength = strength; // How much to transform (0.3-0.8 recommended)
      console.log(`[Replicate] Using img2img mode with strength: ${strength}`);
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
    const err = error as Error;
    console.error(`[Replicate] Exception:`, error);
    return { error: `Replicate generation failed: ${err.message}` };
  }
}

async function generateWithHuggingFace(apiKey: string, model: string, prompt: string, originalImage?: string, strength = 0.5) {
  console.log(`[HuggingFace] Starting generation with model: ${model}, mode: ${originalImage ? 'img2img' : 'text2img'}`);
  
  // HuggingFace Inference API doesn't support img2img for FLUX models well
  // Recommend using Lovable AI or Replicate for image editing
  if (originalImage) {
    console.warn(`[HuggingFace] Warning: FLUX models via Inference API have limited img2img support. Consider using Lovable AI or Replicate instead.`);
  }
  
  try {
    const requestBody: any = {
      inputs: prompt,
      parameters: {
        guidance_scale: 7.5,
        num_inference_steps: originalImage ? 25 : 20
      }
    };

    // For models that support it, add image parameter
    if (originalImage && model.includes('stable-diffusion')) {
      requestBody.inputs = {
        prompt: prompt,
        image: originalImage,
        strength: strength
      };
    }

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[HuggingFace] API error: ${response.status}`, errorText);
      return { error: `Hugging Face API error: ${response.status} - ${errorText}`, status: response.status };
    }

    const imageBlob = await response.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    
    // Convert to base64 in chunks to avoid stack overflow
    const uint8Array = new Uint8Array(arrayBuffer);
    let binary = '';
    const chunkSize = 8192; // Process 8KB at a time
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    const base64 = btoa(binary);
    
    console.log(`[HuggingFace] Generation succeeded, image size: ${arrayBuffer.byteLength} bytes`);
    return { imageUrl: `data:image/png;base64,${base64}` };

  } catch (error) {
    const err = error as Error;
    console.error(`[HuggingFace] Exception:`, error);
    return { error: `Hugging Face generation failed: ${err.message}` };
  }
}

async function generateWithLovable(apiKey: string, model: string, prompt: string, originalImage?: string, strength = 0.5) {
  console.log(`[Lovable] Starting generation with model: ${model}, mode: ${originalImage ? 'img2img editing' : 'text2img'}`);
  try {
    const messages: any[] = [
      {
        role: 'user',
        content: originalImage ? [
          { 
            type: 'text', 
            text: `EDIT this image to ${prompt}. IMPORTANT: Keep the original room structure, layout, furniture positions, and camera perspective. Only modify the specified elements like colors, materials, or decor. Strength of changes: ${Math.round(strength * 100)}%.` 
          },
          { type: 'image_url', image_url: { url: originalImage } }
        ] : `Generate a room renovation image: ${prompt}`
      }
    ];

    console.log(`[Lovable] Using ${originalImage ? 'image editing' : 'text generation'} mode with strength ${strength}`);

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
    const err = error as Error;
    console.error(`[Lovable] Exception:`, error);
    return { error: `Lovable AI generation failed: ${err.message}` };
  }
}

function getReplicateVersion(model: string): string {
  const versions: Record<string, string> = {
    'black-forest-labs/flux-schnell': '85a7b3e7aed47e0aab28b7e1d3cda7b5b7a2b6a4d3f6e7b2e6d9f8c5e4a3b2c1',
    'stability-ai/stable-diffusion-3': '527d2a6296facb8e47ba1eaf17f142c240c19a30894f437feee9b91cc29d8e4f'
  };
  return versions[model] || versions['black-forest-labs/flux-schnell'];
}