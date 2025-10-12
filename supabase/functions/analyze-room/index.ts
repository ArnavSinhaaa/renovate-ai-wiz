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
    const { imageData } = await req.json();
    
    if (!imageData) {
      throw new Error('No image data provided');
    }

    console.log('Starting room analysis with Lovable AI (Gemini Vision)...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You are an expert interior designer specializing in Indian home improvement trends for 2025. Analyze this room photo and generate realistic renovation suggestions for middle-class and urban Indian homes.

CRITICAL: You MUST return valid JSON only, with NO markdown formatting, NO code blocks, NO explanations.

Return this exact JSON structure:
{
  "detectedObjects": [
    {
      "name": "lighting", 
      "confidence": 0.95, 
      "location": "Ceiling/walls",
      "projectTitle": "Install Smart LED Panel Lights",
      "roomArea": "Living Room",
      "projectType": "DIY",
      "issueSolved": "Poor lighting makes room look dull and uninviting",
      "estimatedCost": 4500,
      "timelineDays": 1,
      "shoppingLinks": [
        {"store": "Amazon India", "url": "https://amazon.in", "price": "₹4,200"},
        {"store": "Flipkart", "url": "https://flipkart.com", "price": "₹4,500"}
      ]
    }
  ]
}

Analyze and suggest improvements for:
- Lighting: LED panels, smart bulbs, ambient lighting, Havells/Philips/Syska products
- Wall color/texture: Asian Paints/Berger colors, wallpaper, textures
- Flooring: tiles, vinyl, laminate (Kajaria/Somany brands)
- Indoor plants: money plant, snake plant, areca palm for Indian climate
- Storage: modular wardrobes, shelving (Godrej/Nilkamal)
- Modular furniture: TV units, sofa sets (Urban Ladder/Pepperfry/IKEA)
- Decorative elements: wall art, mirrors, curtains
- Bathroom upgrades: Jaquar/Hindware fixtures
- Kitchen: modular kitchen, chimney (Faber/Elica), storage
- Security: smart locks, CCTV (CP Plus/Hikvision)
- Workspace: study table, ergonomic chairs
- Balcony: planters, seating, waterproofing
- Technology: smart home devices, WiFi extenders

For EACH suggestion provide:
- Specific project title (actionable, clear)
- Room/Area identification
- Project type (DIY or Professional)
- Issue being solved (practical benefit)
- Cost in ₹ (realistic 2025 Indian market rates)
- Timeline in days
- Shopping links (Amazon India, Flipkart, Pepperfry, Urban Ladder, IKEA, etc.)

Generate 8-12 diverse suggestions covering different aspects. Use motivational, actionable language.

Return ONLY the JSON object, nothing else.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.4
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI Gateway error:', errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (response.status === 402) {
        throw new Error('AI credits depleted. Please add credits to your workspace.');
      }
      
      throw new Error(`AI Gateway error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('AI analysis response received');
    
    let content = data.choices[0].message.content;
    console.log('Raw AI response:', content);
    
    // Clean up response - remove markdown code blocks if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const parsedContent = JSON.parse(content);
      console.log('Successfully parsed analysis:', parsedContent);
      
      // Validate the response structure
      if (!parsedContent.detectedObjects || !Array.isArray(parsedContent.detectedObjects)) {
        throw new Error('Invalid response structure');
      }
      
      return new Response(JSON.stringify(parsedContent), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, 'Content:', content);
      
      // Enhanced fallback with common room elements
      const fallbackResponse = {
        detectedObjects: [
          {
            name: 'furniture',
            confidence: 0.85,
            location: 'Central area',
            condition: 'Could benefit from modern updates and fresh styling'
          },
          {
            name: 'lighting',
            confidence: 0.80,
            location: 'Ceiling and ambient',
            condition: 'Consider adding layered lighting for better ambiance'
          },
          {
            name: 'walls',
            confidence: 0.90,
            location: 'Surrounding space',
            condition: 'Fresh paint or accent wall could enhance the space'
          }
        ]
      };
      
      return new Response(JSON.stringify(fallbackResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in analyze-room function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      detectedObjects: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});