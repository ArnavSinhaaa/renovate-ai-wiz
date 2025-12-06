import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Clock, Palette, Target, Lightbulb, CheckCircle2, XCircle,
  Coins, Sparkles, ShoppingCart, Wrench, Shield, Zap, DollarSign,
  Star, TrendingUp, Package, AlertTriangle, Eye
} from 'lucide-react';

interface RoomTipsGuideProps {
  theme: string;
  detectedObjects?: { name: string }[];
}

const themeTips: Record<string, {
  title: string;
  icon: string;
  colorScheme: string;
  priorityItems: { step: number; task: string; difficulty: 'easy' | 'medium' | 'hard'; estimatedCost: string; diy: boolean }[];
  proTips: string[];
  dosDonts: { dos: string[]; donts: string[] };
  budgetTip: string;
  timeline: string;
  shoppingList: { item: string; priority: 'must-have' | 'nice-to-have' | 'luxury'; priceRange: string }[];
  safetyChecklist: string[];
  maintenanceSchedule: { task: string; frequency: string }[];
  lightingTips: string[];
  storageSolutions: string[];
}> = {
  general: {
    title: 'General Room',
    icon: '🏠',
    colorScheme: 'Neutral tones with accent colors - beige, gray, soft whites',
    priorityItems: [
      { step: 1, task: 'Declutter and organize existing items', difficulty: 'easy', estimatedCost: '$0-50', diy: true },
      { step: 2, task: 'Deep clean all surfaces and floors', difficulty: 'easy', estimatedCost: '$20-100', diy: true },
      { step: 3, task: 'Paint walls with fresh neutral color', difficulty: 'medium', estimatedCost: '$100-300', diy: true },
      { step: 4, task: 'Update lighting fixtures', difficulty: 'medium', estimatedCost: '$50-200', diy: false },
      { step: 5, task: 'Add new textiles (curtains, rugs, pillows)', difficulty: 'easy', estimatedCost: '$100-400', diy: true },
      { step: 6, task: 'Arrange furniture for optimal flow', difficulty: 'easy', estimatedCost: '$0', diy: true },
    ],
    proTips: [
      'Use the 60-30-10 color rule: 60% dominant, 30% secondary, 10% accent',
      'Layer lighting with ambient, task, and accent lights',
      'Create focal points to draw the eye',
      'Mix textures for visual interest',
    ],
    dosDonts: {
      dos: ['Measure twice before buying furniture', 'Consider traffic flow', 'Add plants for freshness'],
      donts: ['Overcrowd the space', 'Ignore natural light sources', 'Rush the planning phase'],
    },
    budgetTip: 'Start with paint and textiles - they give the biggest impact for the lowest cost',
    timeline: '2-3 weeks',
    shoppingList: [
      { item: 'Paint (2-3 gallons)', priority: 'must-have', priceRange: '$80-150' },
      { item: 'Painter\'s tape & supplies', priority: 'must-have', priceRange: '$20-40' },
      { item: 'New throw pillows', priority: 'nice-to-have', priceRange: '$40-100' },
      { item: 'Area rug', priority: 'nice-to-have', priceRange: '$100-500' },
      { item: 'Statement light fixture', priority: 'luxury', priceRange: '$150-400' },
    ],
    safetyChecklist: [
      'Check electrical outlets before painting',
      'Ensure proper ventilation when painting',
      'Secure heavy furniture to walls',
      'Check smoke detector batteries',
    ],
    maintenanceSchedule: [
      { task: 'Dust surfaces', frequency: 'Weekly' },
      { task: 'Deep clean floors', frequency: 'Monthly' },
      { task: 'Wash curtains/textiles', frequency: 'Quarterly' },
      { task: 'Touch up paint', frequency: 'Yearly' },
    ],
    lightingTips: [
      'Use warm white (2700K-3000K) for living spaces',
      'Install dimmer switches for flexibility',
      'Layer 3 types: ambient, task, accent',
    ],
    storageSolutions: [
      'Floating shelves for display and storage',
      'Ottoman with hidden storage',
      'Behind-door organizers',
    ],
  },
  girls: {
    title: 'Girls Room',
    icon: '🎀',
    colorScheme: 'Soft pinks, lavender, mint green, rose gold accents',
    priorityItems: [
      { step: 1, task: 'Choose a theme (princess, bohemian, modern)', difficulty: 'easy', estimatedCost: '$0', diy: true },
      { step: 2, task: 'Paint accent wall in signature color', difficulty: 'medium', estimatedCost: '$50-100', diy: true },
      { step: 3, task: 'Install fairy lights or chandelier', difficulty: 'easy', estimatedCost: '$30-150', diy: true },
      { step: 4, task: 'Set up vanity/desk area', difficulty: 'medium', estimatedCost: '$100-300', diy: false },
      { step: 5, task: 'Add canopy or decorative headboard', difficulty: 'medium', estimatedCost: '$50-200', diy: true },
      { step: 6, task: 'Create reading nook with cushions', difficulty: 'easy', estimatedCost: '$50-150', diy: true },
    ],
    proTips: [
      'Use peel-and-stick wallpaper for easy pattern changes',
      'Install a pegboard for customizable wall organization',
      'Choose furniture that grows with them',
      'Add a full-length mirror for outfit checks',
    ],
    dosDonts: {
      dos: ['Include their hobbies in decor', 'Choose durable materials', 'Add a whiteboard/corkboard'],
      donts: ['Go too theme-heavy (they grow out of it)', 'Use fragile items', 'Forget about growth room'],
    },
    budgetTip: 'Invest in a good desk and chair - impacts study habits significantly',
    timeline: '1-2 weeks',
    shoppingList: [
      { item: 'Fairy string lights', priority: 'must-have', priceRange: '$15-40' },
      { item: 'Decorative pillows', priority: 'must-have', priceRange: '$30-80' },
      { item: 'Vanity mirror with lights', priority: 'nice-to-have', priceRange: '$50-150' },
      { item: 'Canopy/bed curtains', priority: 'nice-to-have', priceRange: '$30-100' },
      { item: 'Accent wallpaper', priority: 'luxury', priceRange: '$50-200' },
    ],
    safetyChecklist: [
      'Secure tall furniture to walls',
      'Use LED lights (no heat risk)',
      'Ensure all cords are hidden/secured',
      'Check window locks work properly',
    ],
    maintenanceSchedule: [
      { task: 'Organize toys/items', frequency: 'Weekly' },
      { task: 'Wash bedding', frequency: 'Bi-weekly' },
      { task: 'Rotate seasonal decor', frequency: 'Quarterly' },
      { task: 'Review and declutter', frequency: 'Bi-annually' },
    ],
    lightingTips: [
      'Fairy lights create magical ambiance',
      'Desk lamp essential for homework',
      'Nightlight for comfort',
    ],
    storageSolutions: [
      'Under-bed storage boxes',
      'Hanging organizers for accessories',
      'Cube storage with cute baskets',
    ],
  },
  boys: {
    title: 'Boys Room',
    icon: '🚀',
    colorScheme: 'Navy blue, gray, orange accents, white highlights',
    priorityItems: [
      { step: 1, task: 'Select theme (sports, space, adventure, gaming)', difficulty: 'easy', estimatedCost: '$0', diy: true },
      { step: 2, task: 'Paint walls in bold base color', difficulty: 'medium', estimatedCost: '$80-150', diy: true },
      { step: 3, task: 'Install shelving for display/trophies', difficulty: 'medium', estimatedCost: '$50-150', diy: true },
      { step: 4, task: 'Set up study/gaming desk area', difficulty: 'medium', estimatedCost: '$150-400', diy: false },
      { step: 5, task: 'Add themed wall art/decals', difficulty: 'easy', estimatedCost: '$30-100', diy: true },
      { step: 6, task: 'Create activity zone (reading/play)', difficulty: 'easy', estimatedCost: '$50-200', diy: true },
    ],
    proTips: [
      'Use chalkboard or whiteboard paint for creativity',
      'Install a basketball hoop on the door',
      'Add glow-in-the-dark elements for fun',
      'Use industrial-style metal accents',
    ],
    dosDonts: {
      dos: ['Include storage for collections', 'Use durable, washable surfaces', 'Add sports equipment storage'],
      donts: ['Forget charging stations for devices', 'Use light-colored carpets', 'Overcomplicate the theme'],
    },
    budgetTip: 'Wall decals are cheaper than custom paint jobs and easy to change',
    timeline: '1-2 weeks',
    shoppingList: [
      { item: 'Wall decals/posters', priority: 'must-have', priceRange: '$20-60' },
      { item: 'Desk organizers', priority: 'must-have', priceRange: '$20-50' },
      { item: 'LED strip lights', priority: 'nice-to-have', priceRange: '$15-40' },
      { item: 'Bean bag chair', priority: 'nice-to-have', priceRange: '$50-150' },
      { item: 'Gaming chair', priority: 'luxury', priceRange: '$150-400' },
    ],
    safetyChecklist: [
      'Anchor shelving securely',
      'Use cord management for electronics',
      'Non-slip rug pads',
      'Rounded corners on furniture',
    ],
    maintenanceSchedule: [
      { task: 'Organize desk/study area', frequency: 'Weekly' },
      { task: 'Vacuum/clean floors', frequency: 'Weekly' },
      { task: 'Clean sports equipment', frequency: 'Monthly' },
      { task: 'Declutter outgrown items', frequency: 'Quarterly' },
    ],
    lightingTips: [
      'Bright task light for homework',
      'RGB strips for gaming ambiance',
      'Dimmer for movie watching',
    ],
    storageSolutions: [
      'Sports equipment rack',
      'Pegboard for accessories',
      'Rolling storage cart',
    ],
  },
  coder: {
    title: 'Coder/Tech Room',
    icon: '💻',
    colorScheme: 'Dark grays, electric blue, neon green accents, matte black',
    priorityItems: [
      { step: 1, task: 'Plan optimal desk layout for monitors', difficulty: 'easy', estimatedCost: '$0', diy: true },
      { step: 2, task: 'Install proper cable management system', difficulty: 'medium', estimatedCost: '$50-150', diy: true },
      { step: 3, task: 'Set up ergonomic chair and desk height', difficulty: 'medium', estimatedCost: '$200-600', diy: false },
      { step: 4, task: 'Add ambient RGB lighting setup', difficulty: 'easy', estimatedCost: '$50-200', diy: true },
      { step: 5, task: 'Install acoustic panels for calls', difficulty: 'medium', estimatedCost: '$100-300', diy: true },
      { step: 6, task: 'Create whiteboard/brainstorm wall', difficulty: 'easy', estimatedCost: '$50-150', diy: true },
    ],
    proTips: [
      'Position monitors to reduce neck strain (eye level)',
      'Use bias lighting behind screens to reduce eye fatigue',
      'Keep reference materials within arm\'s reach',
      'Add plants for air quality and focus',
    ],
    dosDonts: {
      dos: ['Invest in quality peripherals', 'Plan for future equipment', 'Include backup power (UPS)'],
      donts: ['Neglect ergonomics', 'Create cable chaos', 'Forget about ventilation'],
    },
    budgetTip: 'A good chair is the best investment - saves your back and productivity',
    timeline: '1-2 weeks',
    shoppingList: [
      { item: 'Cable management kit', priority: 'must-have', priceRange: '$30-80' },
      { item: 'Monitor arm/stand', priority: 'must-have', priceRange: '$40-150' },
      { item: 'LED strip lights', priority: 'nice-to-have', priceRange: '$20-60' },
      { item: 'Acoustic panels', priority: 'nice-to-have', priceRange: '$80-200' },
      { item: 'Ergonomic chair', priority: 'luxury', priceRange: '$300-800' },
    ],
    safetyChecklist: [
      'Ensure proper electrical capacity',
      'Use surge protectors',
      'Check ventilation for equipment',
      'Ergonomic assessment of setup',
    ],
    maintenanceSchedule: [
      { task: 'Dust equipment/clean screens', frequency: 'Weekly' },
      { task: 'Check cable connections', frequency: 'Monthly' },
      { task: 'Clean keyboard/peripherals', frequency: 'Weekly' },
      { task: 'Review and backup data', frequency: 'Weekly' },
    ],
    lightingTips: [
      'Bias lighting (6500K) behind monitors',
      'Avoid glare on screens',
      'Smart bulbs for mood/focus modes',
    ],
    storageSolutions: [
      'Under-desk cable tray',
      'Pegboard for headphones/accessories',
      'Drawer organizers for small items',
    ],
  },
  gamer: {
    title: 'Gamer Room',
    icon: '🎮',
    colorScheme: 'Black, purple, RGB everything, neon accents',
    priorityItems: [
      { step: 1, task: 'Design the ultimate gaming station layout', difficulty: 'easy', estimatedCost: '$0', diy: true },
      { step: 2, task: 'Install RGB lighting throughout', difficulty: 'easy', estimatedCost: '$100-300', diy: true },
      { step: 3, task: 'Set up gaming desk with monitor mounts', difficulty: 'medium', estimatedCost: '$200-500', diy: false },
      { step: 4, task: 'Add soundproofing/acoustic treatment', difficulty: 'medium', estimatedCost: '$150-400', diy: true },
      { step: 5, task: 'Create console/game display shelving', difficulty: 'medium', estimatedCost: '$100-250', diy: true },
      { step: 6, task: 'Add comfort seating for long sessions', difficulty: 'easy', estimatedCost: '$200-600', diy: true },
    ],
    proTips: [
      'Sync RGB lighting with games using smart hubs',
      'Position speakers for optimal surround sound',
      'Add a mini fridge for snacks/drinks',
      'Use blackout curtains for better screen visibility',
    ],
    dosDonts: {
      dos: ['Invest in cooling for PC', 'Add display for collectibles', 'Create streaming-ready background'],
      donts: ['Ignore acoustics', 'Skimp on seating comfort', 'Forget about ventilation'],
    },
    budgetTip: 'RGB strips are cheaper than RGB furniture and more customizable',
    timeline: '2-3 weeks',
    shoppingList: [
      { item: 'RGB LED strip kit', priority: 'must-have', priceRange: '$30-100' },
      { item: 'Gaming headset stand', priority: 'must-have', priceRange: '$20-50' },
      { item: 'Nanoleaf/smart panels', priority: 'nice-to-have', priceRange: '$100-300' },
      { item: 'Gaming chair', priority: 'nice-to-have', priceRange: '$200-500' },
      { item: 'Full RGB desk setup', priority: 'luxury', priceRange: '$400-1000' },
    ],
    safetyChecklist: [
      'Adequate electrical circuits',
      'Proper equipment ventilation',
      'Fire safety with electronics',
      'Eye strain prevention setup',
    ],
    maintenanceSchedule: [
      { task: 'Dust PC/consoles', frequency: 'Weekly' },
      { task: 'Clean peripherals', frequency: 'Weekly' },
      { task: 'Check cooling systems', frequency: 'Monthly' },
      { task: 'Organize game library', frequency: 'Monthly' },
    ],
    lightingTips: [
      'Sync RGB with games/music',
      'Bias lighting reduces eye strain',
      'Different profiles for gaming vs relaxing',
    ],
    storageSolutions: [
      'Wall-mounted controller holders',
      'Display case for collectibles',
      'Headphone hooks on desk',
    ],
  },
  minimalist: {
    title: 'Minimalist Room',
    icon: '✨',
    colorScheme: 'White, off-white, light gray, single accent color',
    priorityItems: [
      { step: 1, task: 'Ruthlessly declutter everything', difficulty: 'hard', estimatedCost: '$0', diy: true },
      { step: 2, task: 'Paint walls clean white or soft gray', difficulty: 'medium', estimatedCost: '$80-150', diy: true },
      { step: 3, task: 'Select few high-quality furniture pieces', difficulty: 'hard', estimatedCost: '$500-2000', diy: false },
      { step: 4, task: 'Install hidden storage solutions', difficulty: 'medium', estimatedCost: '$200-500', diy: true },
      { step: 5, task: 'Add one statement art piece', difficulty: 'easy', estimatedCost: '$50-300', diy: true },
      { step: 6, task: 'Choose simple, quality textiles', difficulty: 'easy', estimatedCost: '$100-300', diy: true },
    ],
    proTips: [
      'Every item should have a purpose or bring joy',
      'Use built-in storage to hide clutter',
      'Quality over quantity always',
      'Negative space is a design element',
    ],
    dosDonts: {
      dos: ['Invest in timeless pieces', 'Keep surfaces clear', 'Use natural materials'],
      donts: ['Add decorative clutter', 'Buy cheap filler items', 'Forget about functionality'],
    },
    budgetTip: 'Spend more on fewer, better quality pieces that last',
    timeline: '2-4 weeks',
    shoppingList: [
      { item: 'Quality storage boxes (matching)', priority: 'must-have', priceRange: '$50-150' },
      { item: 'Simple white bedding', priority: 'must-have', priceRange: '$80-200' },
      { item: 'Single statement plant', priority: 'nice-to-have', priceRange: '$30-100' },
      { item: 'Minimalist clock/art', priority: 'nice-to-have', priceRange: '$40-150' },
      { item: 'Designer furniture piece', priority: 'luxury', priceRange: '$500-2000' },
    ],
    safetyChecklist: [
      'Ensure hidden storage is accessible',
      'Secure minimalist shelving properly',
      'Check electrical behind clean walls',
      'Maintain clear pathways',
    ],
    maintenanceSchedule: [
      { task: 'Return items to places', frequency: 'Daily' },
      { task: 'Dust all surfaces', frequency: 'Weekly' },
      { task: 'Reassess belongings', frequency: 'Monthly' },
      { task: 'Deep clean hidden storage', frequency: 'Quarterly' },
    ],
    lightingTips: [
      'Maximize natural light',
      'Simple pendant or recessed lights',
      'Avoid decorative lamp clutter',
    ],
    storageSolutions: [
      'Under-bed drawers',
      'Built-in closet systems',
      'Hidden wall compartments',
    ],
  },
  bohemian: {
    title: 'Bohemian Room',
    icon: '🌿',
    colorScheme: 'Earthy tones, terracotta, mustard, sage green, warm neutrals',
    priorityItems: [
      { step: 1, task: 'Gather eclectic textile collection', difficulty: 'easy', estimatedCost: '$100-300', diy: true },
      { step: 2, task: 'Paint accent wall in warm earth tone', difficulty: 'medium', estimatedCost: '$60-120', diy: true },
      { step: 3, task: 'Add lots of plants (10+ recommended)', difficulty: 'easy', estimatedCost: '$100-400', diy: true },
      { step: 4, task: 'Layer rugs and textiles', difficulty: 'easy', estimatedCost: '$150-400', diy: true },
      { step: 5, task: 'Hang macrame and wall tapestries', difficulty: 'easy', estimatedCost: '$50-200', diy: true },
      { step: 6, task: 'Add vintage/thrifted furniture', difficulty: 'medium', estimatedCost: '$100-500', diy: true },
    ],
    proTips: [
      'Mix patterns fearlessly but keep a color thread',
      'Thrift stores are your best friend',
      'Layer, layer, layer textures',
      'Plants are essential - more is more',
    ],
    dosDonts: {
      dos: ['Mix vintage and new', 'Add personal travel finds', 'Include natural materials'],
      donts: ['Match everything perfectly', 'Buy all from one store', 'Forget about comfort'],
    },
    budgetTip: 'Thrift stores, flea markets, and DIY macrame save hundreds',
    timeline: '2-3 weeks',
    shoppingList: [
      { item: 'Throw blankets (2-3)', priority: 'must-have', priceRange: '$40-100' },
      { item: 'Assorted plants', priority: 'must-have', priceRange: '$50-150' },
      { item: 'Macrame wall hanging', priority: 'nice-to-have', priceRange: '$30-80' },
      { item: 'Vintage mirror', priority: 'nice-to-have', priceRange: '$40-150' },
      { item: 'Moroccan pouf/ottoman', priority: 'luxury', priceRange: '$100-300' },
    ],
    safetyChecklist: [
      'Check vintage furniture stability',
      'Secure wall hangings properly',
      'Pet-safe plant selection',
      'Candle safety precautions',
    ],
    maintenanceSchedule: [
      { task: 'Water plants', frequency: 'Weekly' },
      { task: 'Shake out/vacuum textiles', frequency: 'Weekly' },
      { task: 'Rotate decor items', frequency: 'Monthly' },
      { task: 'Deep clean layered rugs', frequency: 'Quarterly' },
    ],
    lightingTips: [
      'String lights everywhere',
      'Moroccan lanterns',
      'Warm Edison bulbs',
    ],
    storageSolutions: [
      'Woven baskets',
      'Vintage trunks',
      'Hanging plant holders double as storage',
    ],
  },
  luxury: {
    title: 'Luxury Room',
    icon: '👑',
    colorScheme: 'Deep jewel tones, gold accents, marble, velvet textures',
    priorityItems: [
      { step: 1, task: 'Plan a cohesive luxury color palette', difficulty: 'easy', estimatedCost: '$0', diy: true },
      { step: 2, task: 'Install statement wallpaper or molding', difficulty: 'hard', estimatedCost: '$300-800', diy: false },
      { step: 3, task: 'Invest in one hero furniture piece', difficulty: 'hard', estimatedCost: '$1000-5000', diy: false },
      { step: 4, task: 'Add velvet/silk textiles throughout', difficulty: 'easy', estimatedCost: '$300-800', diy: true },
      { step: 5, task: 'Install chandelier or statement lighting', difficulty: 'medium', estimatedCost: '$300-1500', diy: false },
      { step: 6, task: 'Add gold/brass accent pieces', difficulty: 'easy', estimatedCost: '$200-600', diy: true },
    ],
    proTips: [
      'Invest in one statement piece, save elsewhere',
      'Velvet adds instant luxury on any budget',
      'Mirrors make spaces feel larger and more luxe',
      'Fresh flowers elevate any room instantly',
    ],
    dosDonts: {
      dos: ['Focus on quality materials', 'Layer textures thoughtfully', 'Add fresh flowers regularly'],
      donts: ['Overdo gold accents', 'Mix too many patterns', 'Forget about comfort for style'],
    },
    budgetTip: 'Velvet throw pillows and gold frames achieve the look for less',
    timeline: '3-6 weeks',
    shoppingList: [
      { item: 'Velvet throw pillows', priority: 'must-have', priceRange: '$60-150' },
      { item: 'Gold accent mirror', priority: 'must-have', priceRange: '$100-300' },
      { item: 'Statement vase', priority: 'nice-to-have', priceRange: '$50-200' },
      { item: 'Silk curtains', priority: 'nice-to-have', priceRange: '$200-500' },
      { item: 'Chandelier', priority: 'luxury', priceRange: '$400-2000' },
    ],
    safetyChecklist: [
      'Professional chandelier installation',
      'Check wall strength for heavy mirrors',
      'Secure tall furniture pieces',
      'Fire-safe candle placement',
    ],
    maintenanceSchedule: [
      { task: 'Dust delicate surfaces', frequency: 'Weekly' },
      { task: 'Refresh flowers', frequency: 'Weekly' },
      { task: 'Clean velvet properly', frequency: 'Monthly' },
      { task: 'Polish metal accents', frequency: 'Monthly' },
    ],
    lightingTips: [
      'Statement chandelier as focal point',
      'Dimmer switches for ambiance',
      'Table lamps with silk shades',
    ],
    storageSolutions: [
      'Elegant armoires',
      'Mirrored side tables with drawers',
      'Decorative boxes',
    ],
  },
};

export const RoomTipsGuide: React.FC<RoomTipsGuideProps> = ({ theme, detectedObjects }) => {
  const tips = themeTips[theme] || themeTips.general;
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [checkedSafety, setCheckedSafety] = useState<number[]>([]);

  const toggleStep = (step: number) => {
    setCompletedSteps(prev => 
      prev.includes(step) ? prev.filter(s => s !== step) : [...prev, step]
    );
  };

  const toggleSafety = (index: number) => {
    setCheckedSafety(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const progressPercentage = (completedSteps.length / tips.priorityItems.length) * 100;
  const safetyPercentage = (checkedSafety.length / tips.safetyChecklist.length) * 100;

  const calculateTotalBudget = () => {
    let total = { min: 0, max: 0 };
    tips.priorityItems.forEach(item => {
      const [min, max] = item.estimatedCost.replace('$', '').split('-').map(n => parseInt(n) || 0);
      total.min += min;
      total.max += max || min;
    });
    return `$${total.min.toLocaleString()} - $${total.max.toLocaleString()}`;
  };

  const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  const getPriorityColor = (priority: 'must-have' | 'nice-to-have' | 'luxury') => {
    switch (priority) {
      case 'must-have': return 'bg-primary/20 text-primary border-primary/30';
      case 'nice-to-have': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'luxury': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{tips.icon}</span>
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                  {tips.title}
                </Badge>
                Renovation Guide
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Clock className="h-4 w-4" />
                Estimated: {tips.timeline} for complete setup
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Total Budget: {calculateTotalBudget()}</span>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mt-4 p-4 rounded-lg bg-background/50 border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Your Progress
            </span>
            <span className="text-sm text-muted-foreground">
              {completedSteps.length}/{tips.priorityItems.length} tasks complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          {progressPercentage === 100 && (
            <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
              <Sparkles className="h-4 w-4" />
              Congratulations! All tasks completed!
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Color Scheme */}
        <div className="p-4 rounded-lg bg-background/50 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="h-5 w-5 text-primary" />
            <span className="font-semibold">Recommended Color Scheme</span>
          </div>
          <p className="text-muted-foreground">{tips.colorScheme}</p>
        </div>

        <Accordion type="multiple" className="space-y-2">
          {/* Step-by-Step Guide with Checkboxes */}
          <AccordionItem value="steps" className="border border-border/50 rounded-lg px-4 bg-background/30">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <span>Step-by-Step Renovation Guide</span>
                <Badge variant="outline" className="ml-2">{completedSteps.length}/{tips.priorityItems.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="space-y-3">
                {tips.priorityItems.map((item) => (
                  <div 
                    key={item.step}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                      completedSteps.includes(item.step) 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-background/50 border-border/50'
                    }`}
                  >
                    <Checkbox 
                      checked={completedSteps.includes(item.step)}
                      onCheckedChange={() => toggleStep(item.step)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-medium ${completedSteps.includes(item.step) ? 'line-through text-muted-foreground' : ''}`}>
                          Step {item.step}: {item.task}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="outline" className={getDifficultyColor(item.difficulty)}>
                          {item.difficulty}
                        </Badge>
                        <Badge variant="outline" className="bg-background/50">
                          {item.estimatedCost}
                        </Badge>
                        <Badge variant="outline" className={item.diy ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}>
                          {item.diy ? '✓ DIY Friendly' : '⚠ Pro Recommended'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Shopping List */}
          <AccordionItem value="shopping" className="border border-border/50 rounded-lg px-4 bg-background/30">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <span>Shopping List</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="must-have">Must Have</TabsTrigger>
                  <TabsTrigger value="nice-to-have">Nice to Have</TabsTrigger>
                  <TabsTrigger value="luxury">Luxury</TabsTrigger>
                </TabsList>
                {['all', 'must-have', 'nice-to-have', 'luxury'].map(filter => (
                  <TabsContent key={filter} value={filter} className="space-y-2">
                    {tips.shoppingList
                      .filter(item => filter === 'all' || item.priority === filter)
                      .map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                          <div className="flex items-center gap-3">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span>{item.item}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                            <span className="text-sm font-medium text-primary">{item.priceRange}</span>
                          </div>
                        </div>
                      ))}
                  </TabsContent>
                ))}
              </Tabs>
            </AccordionContent>
          </AccordionItem>

          {/* Pro Tips */}
          <AccordionItem value="tips" className="border border-border/50 rounded-lg px-4 bg-background/30">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
                <span>Pro Tips & Tricks</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="grid gap-2">
                {tips.proTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <Star className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Lighting Tips */}
          <AccordionItem value="lighting" className="border border-border/50 rounded-lg px-4 bg-background/30">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-400" />
                <span>Lighting Recommendations</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="grid gap-2">
                {tips.lightingTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <Zap className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Storage Solutions */}
          <AccordionItem value="storage" className="border border-border/50 rounded-lg px-4 bg-background/30">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-400" />
                <span>Storage Solutions</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="grid gap-2">
                {tips.storageSolutions.map((solution, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Package className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                    <span className="text-sm">{solution}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Do's & Don'ts */}
          <AccordionItem value="dosdont" className="border border-border/50 rounded-lg px-4 bg-background/30">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span>Do's & Don'ts</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <Tabs defaultValue="dos" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="dos" className="data-[state=active]:bg-green-500/20">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    DO
                  </TabsTrigger>
                  <TabsTrigger value="donts" className="data-[state=active]:bg-red-500/20">
                    <XCircle className="h-4 w-4 mr-2" />
                    DON'T
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="dos" className="space-y-2">
                  {tips.dosDonts.dos.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="donts" className="space-y-2">
                  {tips.dosDonts.donts.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>

          {/* Safety Checklist */}
          <AccordionItem value="safety" className="border border-border/50 rounded-lg px-4 bg-background/30">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-400" />
                <span>Safety Checklist</span>
                <Badge variant="outline" className="ml-2">{checkedSafety.length}/{tips.safetyChecklist.length}</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="mb-3">
                <Progress value={safetyPercentage} className="h-2" />
              </div>
              <div className="space-y-2">
                {tips.safetyChecklist.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      checkedSafety.includes(index)
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-orange-500/10 border-orange-500/20'
                    }`}
                    onClick={() => toggleSafety(index)}
                  >
                    <Checkbox 
                      checked={checkedSafety.includes(index)}
                      onCheckedChange={() => toggleSafety(index)}
                    />
                    <AlertTriangle className={`h-4 w-4 shrink-0 ${checkedSafety.includes(index) ? 'text-green-400' : 'text-orange-400'}`} />
                    <span className={`text-sm ${checkedSafety.includes(index) ? 'line-through text-muted-foreground' : ''}`}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Maintenance Schedule */}
          <AccordionItem value="maintenance" className="border border-border/50 rounded-lg px-4 bg-background/30">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-purple-400" />
                <span>Maintenance Schedule</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <div className="grid gap-2">
                {tips.maintenanceSchedule.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <div className="flex items-center gap-3">
                      <Wrench className="h-4 w-4 text-purple-400 shrink-0" />
                      <span className="text-sm">{item.task}</span>
                    </div>
                    <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {item.frequency}
                    </Badge>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Budget Hack */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/20">
              <Coins className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-primary">Budget Hack</h4>
              <p className="text-sm text-muted-foreground">{tips.budgetTip}</p>
            </div>
          </div>
        </div>

        {/* Quick Tips for Detected Objects */}
        {detectedObjects && detectedObjects.length > 0 && (
          <div className="p-4 rounded-lg bg-background/50 border border-border/50">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="h-5 w-5 text-primary" />
              <span className="font-semibold">Quick Tips for Your Items</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {detectedObjects.slice(0, 6).map((obj, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-primary/10 border-primary/30"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Upgrade: {obj.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
