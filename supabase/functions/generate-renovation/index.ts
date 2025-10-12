import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, selectedSuggestions, roomType, budget, imageBase64, wallColors, flooring, tile } = await req.json();
    
    if (!prompt || !imageBase64) {
      throw new Error('No prompt or image provided');
    }

    console.log('Starting image editing with Lovable AI (Gemini)...');
    console.log('Prompt:', prompt);

    // Build the renovation prompt with wall color instructions
    let wallColorInstruction = '';
    if (wallColors) {
      const hasCustomColors = wallColors.left.color !== '#FFFFFF' || 
                              wallColors.right.color !== '#FFFFFF' || 
                              wallColors.front.color !== '#FFFFFF';
      
      if (hasCustomColors) {
        wallColorInstruction = `\n\nWALL COLOR CUSTOMIZATION (HIGHEST PRIORITY):
- Left wall: Paint in ${wallColors.left.name} (${wallColors.left.color})
- Right wall: Paint in ${wallColors.right.name} (${wallColors.right.color})
- Front/Back wall: Paint in ${wallColors.front.name} (${wallColors.front.color})
- Apply these EXACT colors to their respective walls with realistic paint finish
- Make wall colors the MOST PROMINENT and VISIBLE change in the image
- Use proper lighting, shadows, and texture to show realistic painted walls`;
      }
    }

    // Build flooring instructions
    let flooringInstruction = '';
    if (flooring && flooring.type !== 'none') {
      flooringInstruction = `\n\nFLOORING CUSTOMIZATION (HIGH PRIORITY):
- Replace existing flooring with: ${flooring.name} (${flooring.type} type)
- Apply realistic ${flooring.type} texture and finish throughout the floor
- Maintain proper reflections, shadows, and lighting on the new flooring
- Ensure the flooring complements the room's overall aesthetic`;
    }

    // Build tile instructions
    let tileInstruction = '';
    if (tile && tile.type !== 'none') {
      tileInstruction = `\n\nTILE CUSTOMIZATION (HIGH PRIORITY):
- Replace wall/bathroom tiles with: ${tile.name} (${tile.type} type)
- Apply realistic ${tile.type} tile pattern, grout lines, and finish
- Use appropriate lighting and reflections for tile surfaces
- Ensure tiles blend naturally with the room design`;
    }
    
    const renovationPrompt = `Transform this ${roomType || 'room'} image by applying ONLY these specific renovation changes: ${selectedSuggestions.join(', ')}.
${wallColorInstruction}${flooringInstruction}${tileInstruction}
    
CRITICAL PRESERVATION RULES (MOST IMPORTANT):
- PRESERVE the exact position, layout, and arrangement of ALL furniture and objects
- PRESERVE the room dimensions, floor plan, and architectural elements
- PRESERVE the perspective, camera angle, and viewing position
- PRESERVE any furniture, decor, or objects NOT mentioned in the suggestions
- DO NOT move, remove, or relocate any existing items unless explicitly stated
- DO NOT change the overall room layout or spatial arrangement

WHAT TO CHANGE (ONLY THESE):
${wallColorInstruction ? '- Wall colors: Apply the specified colors to respective walls with realistic paint finish' : ''}
${flooringInstruction ? `- Flooring: Replace with ${flooring.name} (${flooring.type})` : ''}
${tileInstruction ? `- Tiles: Replace with ${tile.name} (${tile.type})` : ''}
- Apply ONLY the specific changes mentioned in the suggestions list above
- For lighting changes: Update fixtures and light quality without moving them
- For furniture changes: Only modify/replace the specific items mentioned
- For decor changes: Add or update only what's specified in the suggestions

REALISM REQUIREMENTS:
- Make changes look professionally completed and realistic
- Use proper lighting, shadows, and textures
- Ensure new elements match the room's existing style and scale
- Budget context: ₹${budget || 'flexible'} - adjust quality and scope accordingly

Remember: Transform ONLY what's mentioned in the suggestions. Keep everything else EXACTLY as it is in the original image.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: renovationPrompt },
              { 
                type: 'image_url', 
                image_url: { url: imageBase64 }
              }
            ]
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('Credits depleted. Please add credits to your Lovable workspace.');
      }
      
      throw new Error(`AI Gateway error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Image edited successfully with Gemini');
    
    const imageBase64Result = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    return new Response(JSON.stringify({ 
      imageUrl: imageBase64Result,
      prompt: renovationPrompt
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-renovation function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});