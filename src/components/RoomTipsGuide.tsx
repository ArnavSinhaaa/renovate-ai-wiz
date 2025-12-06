/**
 * RoomTipsGuide Component
 * Displays personalized renovation tips and step-by-step guide based on room theme
 */

import React from 'react';
import { Lightbulb, CheckCircle2, ArrowRight, Palette, Sparkles, Target, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface RoomTipsGuideProps {
  theme: string;
  detectedObjects: { name: string }[];
}

// Theme-specific tips data
const themeTips: Record<string, {
  title: string;
  icon: string;
  colorScheme: string;
  priorityItems: string[];
  proTips: string[];
  dosDonts: { do: string[]; dont: string[] };
  budgetTip: string;
  timeline: string;
}> = {
  general: {
    title: 'Modern Home',
    icon: '🏠',
    colorScheme: 'Neutral tones with bold accents - grays, whites, warm wood',
    priorityItems: ['Upgrade lighting first - instant transformation', 'Focus on key furniture pieces', 'Add plants for life'],
    proTips: [
      'Paint walls before moving furniture - saves 50% time',
      'Buy furniture with hidden storage to reduce clutter',
      'Use mirrors to make spaces look larger',
      'LED strip lights add instant ambiance'
    ],
    dosDonts: {
      do: ['Mix textures for depth', 'Invest in quality basics', 'Layer your lighting'],
      dont: ['Overcrowd the space', 'Match everything exactly', 'Ignore natural light']
    },
    budgetTip: 'Start with paint and lighting - 80% of visual impact for 20% of budget',
    timeline: '2-4 weeks for complete transformation'
  },
  girls: {
    title: 'Girls Room',
    icon: '🎀',
    colorScheme: 'Soft pinks, lavender, rose gold, cream whites',
    priorityItems: ['Vanity/dressing area', 'Cozy bedding upgrade', 'String lights or fairy lights', 'Decorative storage'],
    proTips: [
      'Use peel-and-stick wallpaper for accent walls - easy to remove later',
      'LED vanity mirror is a game-changer under ₹2000',
      'Floating shelves save floor space for display items',
      'Add a cozy reading nook with floor cushions'
    ],
    dosDonts: {
      do: ['Layer different pink shades', 'Add gold/rose gold accents', 'Include a full-length mirror'],
      dont: ['Use only one shade of pink', 'Forget functional storage', 'Skip good lighting near mirror']
    },
    budgetTip: 'Focus on bedding and lighting first - creates 70% of the aesthetic',
    timeline: '1-2 weeks for bedroom transformation'
  },
  boys: {
    title: 'Boys Room',
    icon: '🚀',
    colorScheme: 'Navy blue, gray, orange accents, white highlights',
    priorityItems: ['Study desk setup', 'Sports/hobby display area', 'Good task lighting', 'Durable flooring'],
    proTips: [
      'Use pegboards for displaying collections - customizable and cheap',
      'Bean bags are more durable than they look - great for gaming',
      'Magnetic paint on one wall for displaying achievements',
      'Under-bed storage is essential for sports equipment'
    ],
    dosDonts: {
      do: ['Include their hobbies in decor', 'Choose durable materials', 'Add a whiteboard/corkboard'],
      dont: ['Go too theme-heavy (they grow out of it)', 'Use fragile items', 'Forget about growth room']
    },
    budgetTip: 'Invest in a good desk and chair - impacts study habits significantly',
    timeline: '1-2 weeks for complete setup'
  },
  coder: {
    title: 'Coder / Tech Room',
    icon: '💻',
    colorScheme: 'Dark grays, black, RGB accents, cool whites',
    priorityItems: ['Ergonomic desk setup', 'Multiple monitor support', 'Cable management', 'Ambient lighting'],
    proTips: [
      'Cable raceways cost ₹500 but transform the look instantly',
      'Desk pad/mat protects surface and looks professional',
      'Get a monitor arm - frees desk space and improves ergonomics',
      'Smart LED strips behind monitors reduce eye strain'
    ],
    dosDonts: {
      do: ['Prioritize ergonomics', 'Hide cables obsessively', 'Add plants (they help focus)'],
      dont: ['Forget about ventilation', 'Skip the chair investment', 'Use harsh overhead lighting only']
    },
    budgetTip: 'Ergonomic chair > fancy monitors. Invest ₹15-25k in seating',
    timeline: '1 week for desk setup, 2-3 weeks for full room'
  },
  gamer: {
    title: 'Gamer Room',
    icon: '🎮',
    colorScheme: 'Black base, RGB everything, neon accents',
    priorityItems: ['Gaming chair/desk', 'RGB lighting setup', 'Sound system/acoustic panels', 'Display shelving'],
    proTips: [
      'Acoustic foam panels double as cool wall decor',
      'Nanoleaf alternatives on Amazon work great for ₹3-5k',
      'Dedicated headphone stand keeps setup clean',
      'Blackout curtains essential for daytime gaming'
    ],
    dosDonts: {
      do: ['Sync RGB with games/music', 'Add personality with posters/figures', 'Consider streaming setup'],
      dont: ['Go overboard with RGB (taste matters)', 'Neglect comfort for aesthetics', 'Forget ventilation for PC']
    },
    budgetTip: 'Govee LED strips + basic acoustic panels = 80% of the vibe for ₹5k',
    timeline: '2-3 weeks for ultimate setup'
  },
  minimalist: {
    title: 'Minimalist Space',
    icon: '🪴',
    colorScheme: 'White, beige, light wood, single accent color',
    priorityItems: ['Quality over quantity furniture', 'Hidden storage solutions', 'Statement plants', 'Clean lines everywhere'],
    proTips: [
      'One statement piece per room - let it breathe',
      'Floating furniture creates visual space',
      'Use the same wood tone throughout for cohesion',
      'Invest in one expensive piece, rest can be basic'
    ],
    dosDonts: {
      do: ['Declutter ruthlessly', 'Use negative space intentionally', 'Choose timeless designs'],
      dont: ['Add decorative clutter', 'Mix too many materials', 'Forget about hidden storage']
    },
    budgetTip: 'Spend on the sofa and bed - visible 80% of the time',
    timeline: '2-4 weeks (includes decluttering time)'
  },
  bohemian: {
    title: 'Bohemian Space',
    icon: '🌸',
    colorScheme: 'Warm earth tones, terracotta, mustard, teal accents',
    priorityItems: ['Layered textiles', 'Macrame and wall hangings', 'Mixed patterns', 'Vintage finds'],
    proTips: [
      'Thrift stores are your best friend - unique pieces for cheap',
      'Layer rugs for that boho look - even inexpensive ones work',
      'Indoor plants are essential - get easy ones like pothos',
      'Mix and match cushions - at least 5 different patterns'
    ],
    dosDonts: {
      do: ['Mix textures freely', 'Add personal travel finds', 'Include handmade items'],
      dont: ['Buy matching sets', 'Use only cool colors', 'Forget about comfort']
    },
    budgetTip: 'Textiles transform a room instantly - shop local markets for deals',
    timeline: '3-4 weeks (allow time for thrifting)'
  },
  luxury: {
    title: 'Luxury Space',
    icon: '👑',
    colorScheme: 'Deep jewel tones, gold/brass, marble, rich textures',
    priorityItems: ['Statement lighting (chandelier)', 'Quality upholstery', 'Marble accents', 'Art pieces'],
    proTips: [
      'Marble-look tiles are 90% cheaper than real marble',
      'One luxury item per room elevates everything around it',
      'Metallic accents should be consistent (all gold or all silver)',
      'Invest in curtains - floor to ceiling makes rooms look taller'
    ],
    dosDonts: {
      do: ['Layer lighting (ambient, task, accent)', 'Use rich fabrics (velvet, silk)', 'Add mirrors strategically'],
      dont: ['Use too much gold (tacky fast)', 'Skip the details', 'Mix metal finishes randomly']
    },
    budgetTip: 'Focus on entry/living room first - where guests see',
    timeline: '4-6 weeks for proper luxury transformation'
  }
};

export const RoomTipsGuide: React.FC<RoomTipsGuideProps> = ({ theme, detectedObjects }) => {
  const tips = themeTips[theme] || themeTips.general;
  
  return (
    <Card className="shadow-lg border-2 border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <span className="text-3xl">{tips.icon}</span>
          <div>
            <span className="bg-gradient-primary bg-clip-text text-transparent">{tips.title}</span>
            <span className="text-foreground"> Renovation Guide</span>
          </div>
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <Clock className="w-4 h-4" />
          <span>Estimated: {tips.timeline}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Color Scheme */}
        <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-5 h-5 text-primary" />
            <span className="font-semibold">Recommended Color Scheme</span>
          </div>
          <p className="text-muted-foreground">{tips.colorScheme}</p>
        </div>

        {/* Step by Step Guide */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="steps" className="border-none">
            <AccordionTrigger className="py-3 px-4 bg-primary/10 rounded-lg hover:bg-primary/15 hover:no-underline">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="font-semibold">Step-by-Step Renovation Guide</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="space-y-3">
                {tips.priorityItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tips" className="border-none mt-2">
            <AccordionTrigger className="py-3 px-4 bg-amber-500/10 rounded-lg hover:bg-amber-500/15 hover:no-underline">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span className="font-semibold">Pro Tips & Tricks</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="space-y-2">
                {tips.proTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-amber-500/5 rounded-lg border border-amber-500/20">
                    <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="dosdont" className="border-none mt-2">
            <AccordionTrigger className="py-3 px-4 bg-muted/30 rounded-lg hover:bg-muted/40 hover:no-underline">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="font-semibold">Do's & Don'ts</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30 mb-2">
                    ✓ DO
                  </Badge>
                  {tips.dosDonts.do.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 mb-2">
                    ✗ DON'T
                  </Badge>
                  {tips.dosDonts.dont.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="w-4 h-4 flex items-center justify-center text-destructive">✗</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Budget Tip */}
        <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              💰
            </div>
            <div>
              <span className="font-semibold text-green-600 dark:text-green-400">Budget Hack</span>
              <p className="text-sm text-muted-foreground mt-1">{tips.budgetTip}</p>
            </div>
          </div>
        </div>

        {/* Detected Objects Quick Tips */}
        {detectedObjects.length > 0 && (
          <div className="p-4 bg-muted/20 rounded-xl border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-semibold">Quick Tips for Your Items</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {detectedObjects.slice(0, 5).map((obj, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {obj.name}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Check the upgrade options above for personalized suggestions for each item!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
