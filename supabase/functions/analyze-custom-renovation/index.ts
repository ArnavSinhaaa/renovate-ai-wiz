import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, provider = 'LOVABLE' } = await req.json();
    
    console.log(`[analyze-custom-renovation] Request:`, { prompt, provider });
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Renovation description is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const analysisPrompt = `You are an expert Indian home renovation cost estimator. Analyze the following renovation request and provide detailed cost estimates in Indian Rupees (₹).

Renovation Request: "${prompt}"

Provide a JSON response with:
1. estimatedCost: Total estimated cost in INR
2. estimatedTime: Number of days needed
3. materials: Array of materials with name, quantity, and estimatedPrice
4. breakdown: Brief explanation of the cost breakdown

Consider:
- Indian market prices for materials
- Labor costs in India
- Quality materials at reasonable prices
- Typical contractor rates

Return ONLY valid JSON in this format:
{
  "estimatedCost": 15000,
  "estimatedTime": 3,
  "materials": [
    {"name": "LED Strip Lights", "quantity": "5 meters", "estimatedPrice": 2500},
    {"name": "Power Adapter", "quantity": "1 unit", "estimatedPrice": 500}
  ],
  "breakdown": "Materials: ₹3,000 + Labor: ₹2,000 + Installation: ₹10,000"
}`;

    let response;
    
    // Use Lovable AI Gateway (Fixfy AI)
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('[analyze-custom-renovation] LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[analyze-custom-renovation] Calling Lovable AI Gateway...');
    
    response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'You are an expert Indian home renovation cost estimator. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[analyze-custom-renovation] AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from AI');
    }

    console.log('[analyze-custom-renovation] Raw AI response:', content.substring(0, 500));

    // Clean and parse JSON response
    let jsonText = content;
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    
    // Validate required fields
    if (!parsedData.estimatedCost || !parsedData.estimatedTime) {
      throw new Error('Invalid response structure');
    }

    console.log('[analyze-custom-renovation] Analysis complete:', {
      cost: parsedData.estimatedCost,
      time: parsedData.estimatedTime,
      materialsCount: parsedData.materials?.length || 0
    });

    return new Response(
      JSON.stringify(parsedData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const err = error as Error;
    console.error('[analyze-custom-renovation] Error:', err.message);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze renovation',
        details: err.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
