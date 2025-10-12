/**
 * Renovation Suggestions Data
 * Contains a comprehensive database of renovation suggestions for Indian homes
 * Includes costs, timelines, shopping links, and impact assessments
 */

/**
 * Interface for renovation suggestion objects
 * @interface RenovationSuggestion
 */
export interface RenovationSuggestion {
  /** Unique identifier for the suggestion */
  id: string;
  /** What triggers this suggestion (e.g., 'sofa', 'lighting') */
  trigger: string;
  /** Current condition that needs improvement */
  condition: string;
  /** The renovation suggestion description */
  suggestion: string;
  /** Optional description of the problem this solves */
  issueSolved?: string;
  /** Cost in Indian Rupees */
  cost: number;
  /** Time required in days */
  time: number;
  /** Impact level of the renovation */
  impact: 'High' | 'Medium' | 'Low';
  /** Whether it's a DIY or professional project */
  type: 'DIY' | 'Professional';
  /** Room type this applies to */
  room: 'Living Room' | 'Bedroom' | 'Kitchen' | 'Bathroom' | 'Balcony' | 'Outdoor';
  /** Shopping links for purchasing items */
  buyLinks: Array<{
    store: string;
    url: string;
    price: string;
  }>;
}

/**
 * Comprehensive database of renovation suggestions for Indian homes
 * Organized by room type with realistic costs and timelines
 * Includes shopping links to popular Indian retailers
 */
export const renovationSuggestions: RenovationSuggestion[] = [
  // ===== LIVING ROOM SUGGESTIONS =====
  {
    id: 'lr-001',
    trigger: 'Lighting',
    condition: 'Poor overhead lighting',
    suggestion: 'Install LED smart bulbs and add table lamps for ambient lighting',
    cost: 8000,
    time: 1,
    impact: 'High',
    type: 'DIY',
    room: 'Living Room',
    buyLinks: [
      { store: 'Amazon', url: '#', price: '₹3,500' },
      { store: 'Flipkart', url: '#', price: '₹3,200' }
    ]
  },
  {
    id: 'lr-002',
    trigger: 'Sofa',
    condition: 'Worn out or outdated',
    suggestion: 'Replace with modern sectional sofa in neutral tones',
    cost: 45000,
    time: 3,
    impact: 'High',
    type: 'Professional',
    room: 'Living Room',
    buyLinks: [
      { store: 'IKEA', url: '#', price: '₹42,000' },
      { store: 'Urban Ladder', url: '#', price: '₹48,000' }
    ]
  },
  {
    id: 'lr-003',
    trigger: 'Wall Paint',
    condition: 'Faded or dated colors',
    suggestion: 'Paint accent wall with warm terracotta or sage green',
    cost: 5000,
    time: 2,
    impact: 'Medium',
    type: 'DIY',
    room: 'Living Room',
    buyLinks: [
      { store: 'Asian Paints', url: '#', price: '₹4,500' },
      { store: 'Berger', url: '#', price: '₹4,800' }
    ]
  },
  {
    id: 'lr-004',
    trigger: 'Curtains',
    condition: 'Heavy or outdated fabric',
    suggestion: 'Install light-filtering smart blinds or linen curtains',
    cost: 12000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Living Room',
    buyLinks: [
      { store: 'Amazon', url: '#', price: '₹11,500' },
      { store: 'Pepperfry', url: '#', price: '₹13,000' }
    ]
  },
  {
    id: 'lr-005',
    trigger: 'Floor',
    condition: 'Worn carpet or tiles',
    suggestion: 'Install luxury vinyl plank flooring',
    cost: 35000,
    time: 5,
    impact: 'High',
    type: 'Professional',
    room: 'Living Room',
    buyLinks: [
      { store: 'Kajaria', url: '#', price: '₹32,000' },
      { store: 'Orientbell', url: '#', price: '₹36,000' }
    ]
  },

  // Additional Living Room Ideas
  {
    id: 'lr-006',
    trigger: 'Coffee Table',
    condition: 'Too small or outdated',
    suggestion: 'Replace with storage ottoman or glass coffee table',
    cost: 18000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Living Room',
    buyLinks: [
      { store: 'Pepperfry', url: '#', price: '₹16,000' },
      { store: 'Urban Ladder', url: '#', price: '₹19,500' }
    ]
  },
  {
    id: 'lr-007',
    trigger: 'Wall Shelves',
    condition: 'Empty walls or lack of storage',
    suggestion: 'Install floating shelves for books and decor',
    cost: 6000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Living Room',
    buyLinks: [
      { store: 'IKEA', url: '#', price: '₹5,500' },
      { store: 'Amazon', url: '#', price: '₹6,200' }
    ]
  },
  {
    id: 'lr-008',
    trigger: 'Rug',
    condition: 'Hard flooring needs warmth',
    suggestion: 'Add large area rug to define seating area',
    cost: 12000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Living Room',
    buyLinks: [
      { store: 'Carpet Couture', url: '#', price: '₹11,000' },
      { store: 'The Rug Republic', url: '#', price: '₹13,000' }
    ]
  },
  {
    id: 'lr-009',
    trigger: 'TV Wall',
    condition: 'TV mounted on plain wall',
    suggestion: 'Create TV accent wall with wood paneling',
    cost: 22000,
    time: 3,
    impact: 'High',
    type: 'Professional',
    room: 'Living Room',
    buyLinks: [
      { store: 'WoodCraft', url: '#', price: '₹20,000' },
      { store: 'HomeLane', url: '#', price: '₹24,000' }
    ]
  },
  {
    id: 'lr-010',
    trigger: 'Throw Pillows',
    condition: 'Plain or worn cushions',
    suggestion: 'Add colorful throw pillows and blankets',
    cost: 4000,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Living Room',
    buyLinks: [
      { store: 'FabFurnish', url: '#', price: '₹3,500' },
      { store: 'Home Centre', url: '#', price: '₹4,200' }
    ]
  },

  // ===== KITCHEN SUGGESTIONS =====
  {
    id: 'k-001',
    trigger: 'Cabinets',
    condition: 'Old or damaged doors',
    suggestion: 'Replace cabinet doors with modern shaker-style fronts',
    cost: 25000,
    time: 4,
    impact: 'High',
    type: 'Professional',
    room: 'Kitchen',
    buyLinks: [
      { store: 'IKEA', url: '#', price: '₹23,000' },
      { store: 'Godrej Interio', url: '#', price: '₹27,000' }
    ]
  },
  {
    id: 'k-002',
    trigger: 'Backsplash',
    condition: 'Plain or stained tiles',
    suggestion: 'Install subway tile or mosaic backsplash',
    cost: 8000,
    time: 2,
    impact: 'Medium',
    type: 'DIY',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Kajaria', url: '#', price: '₹7,500' },
      { store: 'Johnson Tiles', url: '#', price: '₹8,200' }
    ]
  },
  {
    id: 'k-003',
    trigger: 'Countertop',
    condition: 'Scratched or outdated',
    suggestion: 'Install quartz or granite countertops',
    cost: 40000,
    time: 3,
    impact: 'High',
    type: 'Professional',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Pokarna', url: '#', price: '₹38,000' },
      { store: 'Granite World', url: '#', price: '₹42,000' }
    ]
  },
  {
    id: 'k-004',
    trigger: 'Lighting',
    condition: 'Single overhead light',
    suggestion: 'Add under-cabinet LED strips and pendant lights',
    cost: 15000,
    time: 2,
    impact: 'High',
    type: 'Professional',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Philips', url: '#', price: '₹14,500' },
      { store: 'Havells', url: '#', price: '₹15,800' }
    ]
  },

  // Additional Kitchen Ideas
  {
    id: 'k-005',
    trigger: 'Storage',
    condition: 'Cluttered counters or cabinets',
    suggestion: 'Add pull-out drawers and organizers',
    cost: 12000,
    time: 2,
    impact: 'Medium',
    type: 'DIY',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Hettich', url: '#', price: '₹11,000' },
      { store: 'Godrej Interio', url: '#', price: '₹13,000' }
    ]
  },
  {
    id: 'k-006',
    trigger: 'Faucet',
    condition: 'Old or leaking tap',
    suggestion: 'Install modern pull-down kitchen faucet',
    cost: 8000,
    time: 1,
    impact: 'Medium',
    type: 'Professional',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Kohler', url: '#', price: '₹7,500' },
      { store: 'Delta', url: '#', price: '₹8,500' }
    ]
  },
  {
    id: 'k-007',
    trigger: 'Window Treatment',
    condition: 'No window covering or outdated',
    suggestion: 'Install cafe curtains or roller blinds',
    cost: 5000,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Kitchen',
    buyLinks: [
      { store: 'IKEA', url: '#', price: '₹4,500' },
      { store: 'D\'Decor', url: '#', price: '₹5,500' }
    ]
  },
  {
    id: 'k-008',
    trigger: 'Appliances',
    condition: 'Mismatched or old appliances',
    suggestion: 'Upgrade to stainless steel appliance suite',
    cost: 85000,
    time: 2,
    impact: 'High',
    type: 'Professional',
    room: 'Kitchen',
    buyLinks: [
      { store: 'LG', url: '#', price: '₹80,000' },
      { store: 'Samsung', url: '#', price: '₹90,000' }
    ]
  },

  // ===== BEDROOM SUGGESTIONS =====
  {
    id: 'br-001',
    trigger: 'Bed',
    condition: 'Old or uncomfortable',
    suggestion: 'Upgrade to upholstered platform bed with storage',
    cost: 30000,
    time: 3,
    impact: 'High',
    type: 'Professional',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Wakefit', url: '#', price: '₹28,000' },
      { store: 'Urban Ladder', url: '#', price: '₹32,000' }
    ]
  },
  {
    id: 'br-002',
    trigger: 'Wardrobe',
    condition: 'Insufficient storage',
    suggestion: 'Install built-in wardrobe with sliding doors',
    cost: 55000,
    time: 7,
    impact: 'High',
    type: 'Professional',
    room: 'Bedroom',
    buyLinks: [
      { store: 'IKEA', url: '#', price: '₹52,000' },
      { store: 'Livspace', url: '#', price: '₹58,000' }
    ]
  },
  {
    id: 'br-003',
    trigger: 'Lighting',
    condition: 'Harsh overhead lighting',
    suggestion: 'Add bedside sconces and dimmable ceiling lights',
    cost: 12000,
    time: 2,
    impact: 'Medium',
    type: 'Professional',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Crompton', url: '#', price: '₹11,500' },
      { store: 'Orient Electric', url: '#', price: '₹12,800' }
    ]
  },
  {
    id: 'br-004',
    trigger: 'Wall Decor',
    condition: 'Plain white walls',
    suggestion: 'Create accent wall with textured wallpaper or paint',
    cost: 8000,
    time: 2,
    impact: 'Medium',
    type: 'DIY',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Asian Paints', url: '#', price: '₹7,500' },
      { store: 'Nilaya', url: '#', price: '₹8,500' }
    ]
  },

  // Additional Bedroom Ideas
  {
    id: 'br-005',
    trigger: 'Curtains',
    condition: 'Thin or no blackout capability',
    suggestion: 'Install blackout curtains for better sleep',
    cost: 8000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Bedroom',
    buyLinks: [
      { store: 'IKEA', url: '#', price: '₹7,000' },
      { store: 'Amazon', url: '#', price: '₹8,500' }
    ]
  },
  {
    id: 'br-006',
    trigger: 'Headboard',
    condition: 'No headboard or damaged',
    suggestion: 'Create upholstered headboard or wall panel',
    cost: 15000,
    time: 2,
    impact: 'Medium',
    type: 'DIY',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Urban Ladder', url: '#', price: '₹14,000' },
      { store: 'Pepperfry', url: '#', price: '₹16,000' }
    ]
  },
  {
    id: 'br-007',
    trigger: 'Mirror',
    condition: 'Small or no mirror',
    suggestion: 'Add full-length mirror or mirrored wardrobe doors',
    cost: 10000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Bedroom',
    buyLinks: [
      { store: 'IKEA', url: '#', price: '₹9,000' },
      { store: 'Home Centre', url: '#', price: '₹11,000' }
    ]
  },
  {
    id: 'br-008',
    trigger: 'Ceiling Fan',
    condition: 'Old or noisy fan',
    suggestion: 'Replace with modern LED ceiling fan',
    cost: 12000,
    time: 1,
    impact: 'Medium',
    type: 'Professional',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Havells', url: '#', price: '₹11,000' },
      { store: 'Orient Electric', url: '#', price: '₹13,000' }
    ]
  },

  // ===== BATHROOM SUGGESTIONS =====
  {
    id: 'bt-001',
    trigger: 'Tiles',
    condition: 'Old or cracked',
    suggestion: 'Install large format porcelain tiles',
    cost: 25000,
    time: 5,
    impact: 'High',
    type: 'Professional',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Kajaria', url: '#', price: '₹23,000' },
      { store: 'Nitco', url: '#', price: '₹26,000' }
    ]
  },
  {
    id: 'bt-002',
    trigger: 'Fixtures',
    condition: 'Outdated or leaking',
    suggestion: 'Replace with modern chrome fixtures and rain shower',
    cost: 18000,
    time: 3,
    impact: 'High',
    type: 'Professional',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Kohler', url: '#', price: '₹17,000' },
      { store: 'Grohe', url: '#', price: '₹19,000' }
    ]
  },
  {
    id: 'bt-003',
    trigger: 'Vanity',
    condition: 'Small or damaged',
    suggestion: 'Install floating vanity with LED mirror',
    cost: 22000,
    time: 3,
    impact: 'Medium',
    type: 'Professional',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Hindware', url: '#', price: '₹21,000' },
      { store: 'Cera', url: '#', price: '₹23,500' }
    ]
  },

  // Additional Bathroom Ideas
  {
    id: 'bt-004',
    trigger: 'Storage',
    condition: 'Lack of storage space',
    suggestion: 'Add over-toilet storage cabinet and corner shelves',
    cost: 8000,
    time: 2,
    impact: 'Medium',
    type: 'DIY',
    room: 'Bathroom',
    buyLinks: [
      { store: 'IKEA', url: '#', price: '₹7,500' },
      { store: 'Pepperfry', url: '#', price: '₹8,500' }
    ]
  },
  {
    id: 'bt-005',
    trigger: 'Exhaust Fan',
    condition: 'Poor ventilation or old fan',
    suggestion: 'Install powerful exhaust fan with humidity sensor',
    cost: 6000,
    time: 1,
    impact: 'Medium',
    type: 'Professional',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Havells', url: '#', price: '₹5,500' },
      { store: 'Panasonic', url: '#', price: '₹6,500' }
    ]
  },
  {
    id: 'bt-006',
    trigger: 'Accessories',
    condition: 'Mismatched or old accessories',
    suggestion: 'Coordinate towel bars, soap dispensers, and hooks',
    cost: 4000,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Kohler', url: '#', price: '₹3,800' },
      { store: 'Hindware', url: '#', price: '₹4,200' }
    ]
  },

  // ===== BALCONY SUGGESTIONS =====
  {
    id: 'bl-001',
    trigger: 'Flooring',
    condition: 'Concrete or damaged tiles',
    suggestion: 'Install weather-resistant deck tiles',
    cost: 15000,
    time: 2,
    impact: 'Medium',
    type: 'DIY',
    room: 'Balcony',
    buyLinks: [
      { store: 'IKEA', url: '#', price: '₹14,000' },
      { store: 'Urban Ladder', url: '#', price: '₹16,000' }
    ]
  },
  {
    id: 'bl-002',
    trigger: 'Plants',
    condition: 'Empty or unused space',
    suggestion: 'Create vertical garden with planters',
    cost: 8000,
    time: 1,
    impact: 'High',
    type: 'DIY',
    room: 'Balcony',
    buyLinks: [
      { store: 'Ugaoo', url: '#', price: '₹7,500' },
      { store: 'Nurserylive', url: '#', price: '₹8,500' }
    ]
  },
  {
    id: 'bl-003',
    trigger: 'Seating',
    condition: 'No outdoor furniture',
    suggestion: 'Add weather-proof outdoor seating set',
    cost: 20000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Balcony',
    buyLinks: [
      { store: 'Pepperfry', url: '#', price: '₹19,000' },
      { store: 'Urban Ladder', url: '#', price: '₹21,000' }
    ]
  },

  // Additional Balcony & Outdoor Ideas
  {
    id: 'bl-004',
    trigger: 'Lighting',
    condition: 'No outdoor lighting',
    suggestion: 'Add string lights or solar lanterns',
    cost: 3000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Balcony',
    buyLinks: [
      { store: 'Amazon', url: '#', price: '₹2,500' },
      { store: 'IKEA', url: '#', price: '₹3,200' }
    ]
  },
  {
    id: 'bl-005',
    trigger: 'Privacy Screen',
    condition: 'Overlooked by neighbors',
    suggestion: 'Install bamboo privacy screen or outdoor curtains',
    cost: 7000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Balcony',
    buyLinks: [
      { store: 'Urban Ladder', url: '#', price: '₹6,500' },
      { store: 'Pepperfry', url: '#', price: '₹7,500' }
    ]
  },
  {
    id: 'od-001',
    trigger: 'Garden Area',
    condition: 'Unused outdoor space',
    suggestion: 'Create raised bed vegetable garden',
    cost: 15000,
    time: 2,
    impact: 'High',
    type: 'DIY',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Ugaoo', url: '#', price: '₹14,000' },
      { store: 'Green Paradise', url: '#', price: '₹16,000' }
    ]
  },
  {
    id: 'od-002',
    trigger: 'Pathway',
    condition: 'Plain concrete or dirt path',
    suggestion: 'Install decorative stepping stones or brick pathway',
    cost: 12000,
    time: 3,
    impact: 'Medium',
    type: 'DIY',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Kajaria', url: '#', price: '₹11,000' },
      { store: 'Orientbell', url: '#', price: '₹13,000' }
    ]
  },
  {
    id: 'od-003',
    trigger: 'Outdoor Furniture',
    condition: 'No seating in garden/patio',
    suggestion: 'Add weather-resistant dining set or lounge chairs',
    cost: 35000,
    time: 1,
    impact: 'High',
    type: 'DIY',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Urban Ladder', url: '#', price: '₹33,000' },
      { store: 'Pepperfry', url: '#', price: '₹37,000' }
    ]
  },
  {
    id: 'lr-010',
    trigger: 'Window',
    condition: 'Plain windows without treatments',
    suggestion: 'Install motorized smart blinds with light sensors',
    cost: 28000,
    time: 2,
    impact: 'High',
    type: 'Professional',
    room: 'Living Room',
    buyLinks: [
      { store: 'IKEA', url: '#', price: '₹26,000' },
      { store: 'Urban Ladder', url: '#', price: '₹30,000' }
    ]
  },
  {
    id: 'br-009',
    trigger: 'Bed',
    condition: 'Standard bed frame',
    suggestion: 'Upgrade to storage bed with hydraulic lift mechanism',
    cost: 45000,
    time: 3,
    impact: 'High',
    type: 'Professional',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Pepperfry', url: '#', price: '₹43,000' },
      { store: 'Urban Ladder', url: '#', price: '₹47,000' }
    ]
  },
  {
    id: 'br-010',
    trigger: 'Mirror',
    condition: 'Small or outdated mirror',
    suggestion: 'Install full-length LED backlit mirror',
    cost: 18000,
    time: 2,
    impact: 'Medium',
    type: 'Professional',
    room: 'Bedroom',
    buyLinks: [
      { store: 'HomeTown', url: '#', price: '₹17,000' },
      { store: 'Urban Ladder', url: '#', price: '₹19,000' }
    ]
  },
  {
    id: 'kt-011',
    trigger: 'Sink',
    condition: 'Standard sink without modern features',
    suggestion: 'Install undermount sink with pull-down faucet',
    cost: 22000,
    time: 2,
    impact: 'Medium',
    type: 'Professional',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Jaquar', url: '#', price: '₹21,000' },
      { store: 'Hindware', url: '#', price: '₹23,000' }
    ]
  },
  {
    id: 'kt-012',
    trigger: 'Backsplash',
    condition: 'Plain or tile backsplash',
    suggestion: 'Install glass or metallic accent backsplash',
    cost: 15000,
    time: 2,
    impact: 'High',
    type: 'Professional',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Kajaria', url: '#', price: '₹14,000' },
      { store: 'Somany', url: '#', price: '₹16,000' }
    ]
  },
  {
    id: 'bt-007',
    trigger: 'Shower',
    condition: 'Basic shower setup',
    suggestion: 'Install rainfall shower head with hand shower combo',
    cost: 12000,
    time: 1,
    impact: 'High',
    type: 'Professional',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Jaquar', url: '#', price: '₹11,500' },
      { store: 'Grohe', url: '#', price: '₹12,500' }
    ]
  },
  {
    id: 'bt-008',
    trigger: 'Cabinet',
    condition: 'Limited storage',
    suggestion: 'Add wall-mounted mirrored medicine cabinet',
    cost: 8500,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Bathroom',
    buyLinks: [
      { store: 'IKEA', url: '#', price: '₹8,000' },
      { store: 'Pepperfry', url: '#', price: '₹9,000' }
    ]
  },
  {
    id: 'bl-004',
    trigger: 'Railing',
    condition: 'Standard metal railing',
    suggestion: 'Install frameless glass railing system',
    cost: 35000,
    time: 4,
    impact: 'High',
    type: 'Professional',
    room: 'Balcony',
    buyLinks: [
      { store: 'Saint-Gobain', url: '#', price: '₹33,000' },
      { store: 'AIS Glass', url: '#', price: '₹37,000' }
    ]
  },
  {
    id: 'bl-005',
    trigger: 'Plants',
    condition: 'Limited greenery',
    suggestion: 'Create vertical garden wall with planters',
    cost: 18000,
    time: 3,
    impact: 'High',
    type: 'DIY',
    room: 'Balcony',
    buyLinks: [
      { store: 'Ugaoo', url: '#', price: '₹17,000' },
      { store: 'Green Paradise', url: '#', price: '₹19,000' }
    ]
  },
  {
    id: 'lr-011',
    trigger: 'Ceiling',
    condition: 'Plain white ceiling',
    suggestion: 'Add decorative coffered ceiling design',
    cost: 55000,
    time: 7,
    impact: 'High',
    type: 'Professional',
    room: 'Living Room',
    buyLinks: [
      { store: 'Gyproc', url: '#', price: '₹52,000' },
      { store: 'Saint-Gobain', url: '#', price: '₹58,000' }
    ]
  },
  {
    id: 'kt-013',
    trigger: 'Appliance',
    condition: 'Visible appliances',
    suggestion: 'Install built-in appliance garage cabinet',
    cost: 32000,
    time: 3,
    impact: 'Medium',
    type: 'Professional',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Godrej Interio', url: '#', price: '₹30,000' },
      { store: 'Sleek', url: '#', price: '₹34,000' }
    ]
  },
  {
    id: 'br-011',
    trigger: 'Closet',
    condition: 'Standard wardrobe',
    suggestion: 'Create custom walk-in closet system',
    cost: 75000,
    time: 10,
    impact: 'High',
    type: 'Professional',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Livspace', url: '#', price: '₹72,000' },
      { store: 'HomeLane', url: '#', price: '₹78,000' }
    ]
  },
  {
    id: 'od-004',
    trigger: 'Deck',
    condition: 'No outdoor deck',
    suggestion: 'Build composite decking with built-in seating',
    cost: 85000,
    time: 12,
    impact: 'High',
    type: 'Professional',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Timbertech', url: '#', price: '₹82,000' },
      { store: 'Deckorators', url: '#', price: '₹88,000' }
    ]
  },
  {
    id: 'lr-012',
    trigger: 'Entertainment',
    condition: 'Cables and devices visible',
    suggestion: 'Install floating entertainment center with cable management',
    cost: 42000,
    time: 4,
    impact: 'High',
    type: 'Professional',
    room: 'Living Room',
    buyLinks: [
      { store: 'Urban Ladder', url: '#', price: '₹40,000' },
      { store: 'Pepperfry', url: '#', price: '₹44,000' }
    ]
  },
  {
    id: 'bt-009',
    trigger: 'Toilet',
    condition: 'Standard toilet',
    suggestion: 'Upgrade to smart toilet with bidet function',
    issueSolved: 'Enhanced hygiene and water-saving features for modern Indian homes',
    cost: 48000,
    time: 3,
    impact: 'High',
    type: 'Professional',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Kohler', url: '#', price: '₹46,000' },
      { store: 'TOTO', url: '#', price: '₹50,000' }
    ]
  },
  // ===== INDIAN HOME SPECIFIC UPGRADES =====
  {
    id: 'in-001',
    trigger: 'Pooja',
    condition: 'No dedicated prayer space',
    suggestion: 'Create modern wall-mounted pooja unit with LED lighting',
    issueSolved: 'Dedicated spiritual space with elegant design for daily worship',
    cost: 12000,
    time: 2,
    impact: 'High',
    type: 'Professional',
    room: 'Living Room',
    buyLinks: [
      { store: 'Pepperfry', url: '#', price: '₹11,500' },
      { store: 'Amazon India', url: '#', price: '₹12,800' }
    ]
  },
  {
    id: 'in-002',
    trigger: 'Balcony',
    condition: 'Unused balcony space',
    suggestion: 'Install weatherproof flooring and add vertical garden',
    issueSolved: 'Transform unused space into relaxing green retreat suitable for Indian climate',
    cost: 18000,
    time: 3,
    impact: 'High',
    type: 'Professional',
    room: 'Balcony',
    buyLinks: [
      { store: 'Urban Ladder', url: '#', price: '₹8,500' },
      { store: 'Flipkart', url: '#', price: '₹9,200' },
      { store: 'Ugaoo', url: '#', price: '₹4,500' }
    ]
  },
  {
    id: 'in-003',
    trigger: 'Kitchen',
    condition: 'Limited storage',
    suggestion: 'Add modular pull-out drawers and corner carousel units',
    issueSolved: 'Maximize storage for Indian spices, utensils, and cooking equipment',
    cost: 25000,
    time: 4,
    impact: 'High',
    type: 'Professional',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Godrej Interio', url: '#', price: '₹24,000' },
      { store: 'Hafele India', url: '#', price: '₹27,000' }
    ]
  },
  {
    id: 'in-004',
    trigger: 'Window',
    condition: 'Excessive heat and light',
    suggestion: 'Install UV-blocking roller blinds or heat-reflective curtains',
    issueSolved: 'Block harsh sunlight and reduce AC costs during Indian summers',
    cost: 8500,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Amazon India', url: '#', price: '₹8,000' },
      { store: 'HomeTown', url: '#', price: '₹9,200' }
    ]
  },
  {
    id: 'in-005',
    trigger: 'Ceiling',
    condition: 'Plain ceiling',
    suggestion: 'Install false ceiling with recessed LED lights and fan box',
    issueSolved: 'Modern aesthetic with better temperature control and ambient lighting',
    cost: 35000,
    time: 5,
    impact: 'High',
    type: 'Professional',
    room: 'Living Room',
    buyLinks: [
      { store: 'GypsumCeiling.in', url: '#', price: '₹32,000' },
      { store: 'Local Contractor', url: '#', price: '₹38,000' }
    ]
  },
  {
    id: 'in-006',
    trigger: 'Bathroom',
    condition: 'Poor ventilation',
    suggestion: 'Install exhaust fan with humidity sensor and deodorizer',
    issueSolved: 'Prevent mold growth and maintain freshness in humid Indian climate',
    cost: 4500,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Havells', url: '#', price: '₹4,200' },
      { store: 'Usha', url: '#', price: '₹4,800' }
    ]
  },
  {
    id: 'in-007',
    trigger: 'Entrance',
    condition: 'Plain entrance',
    suggestion: 'Add decorative nameplate and motion sensor LED lighting',
    issueSolved: 'Enhanced curb appeal and security with automatic lighting',
    cost: 3500,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Flipkart', url: '#', price: '₹2,800' },
      { store: 'Amazon India', url: '#', price: '₹3,200' }
    ]
  },
  {
    id: 'in-008',
    trigger: 'Kitchen',
    condition: 'Old platform',
    suggestion: 'Replace with quartz/granite countertop and undermount sink',
    issueSolved: 'Durable, heat-resistant surface perfect for Indian cooking',
    cost: 42000,
    time: 4,
    impact: 'High',
    type: 'Professional',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Kajaria', url: '#', price: '₹40,000' },
      { store: 'Johnson', url: '#', price: '₹45,000' }
    ]
  },
  {
    id: 'in-009',
    trigger: 'Bedroom',
    condition: 'Insufficient storage',
    suggestion: 'Install floor-to-ceiling wardrobe with mirror shutters',
    issueSolved: 'Maximize vertical space and make room appear larger',
    cost: 55000,
    time: 5,
    impact: 'High',
    type: 'Professional',
    room: 'Bedroom',
    buyLinks: [
      { store: 'IKEA India', url: '#', price: '₹52,000' },
      { store: 'Urban Ladder', url: '#', price: '₹58,000' }
    ]
  },
  {
    id: 'in-010',
    trigger: 'Living',
    condition: 'No air circulation',
    suggestion: 'Install BLDC ceiling fan with remote and LED light',
    issueSolved: 'Energy-efficient cooling with 50% less power consumption',
    cost: 7500,
    time: 1,
    impact: 'High',
    type: 'DIY',
    room: 'Living Room',
    buyLinks: [
      { store: 'Atomberg', url: 'https://www.amazon.in/atomberg-fans', price: '₹6,999' },
      { store: 'Havells', url: 'https://www.flipkart.com/havells-fans', price: '₹7,800' }
    ]
  },
  {
    id: 'in-011',
    trigger: 'Wall',
    condition: 'Plain white walls',
    suggestion: 'Add textured 3D wall panels in living room accent wall',
    issueSolved: 'Creates stunning focal point and adds depth to interior',
    cost: 9500,
    time: 2,
    impact: 'Medium',
    type: 'Professional',
    room: 'Living Room',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/3d-wall-panels', price: '₹8,999' },
      { store: 'Pepperfry', url: 'https://www.pepperfry.com/wall-panels', price: '₹10,200' },
      { store: 'Urban Ladder', url: 'https://www.urbanladder.com', price: '₹9,800' }
    ]
  },
  {
    id: 'in-012',
    trigger: 'Kitchen',
    condition: 'Outdated chimney',
    suggestion: 'Install auto-clean chimney with filterless technology',
    issueSolved: 'Powerful suction for Indian cooking, easy maintenance',
    cost: 18500,
    time: 1,
    impact: 'High',
    type: 'Professional',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Faber India', url: 'https://www.amazon.in/faber-chimney', price: '₹17,999' },
      { store: 'Elica', url: 'https://www.flipkart.com/elica', price: '₹19,500' },
      { store: 'Glen', url: 'https://www.amazon.in/glen', price: '₹18,200' }
    ]
  },
  {
    id: 'in-013',
    trigger: 'Bedroom',
    condition: 'Lack of study area',
    suggestion: 'Add wall-mounted study table with shelving unit',
    issueSolved: 'Space-saving work from home setup for Indian apartments',
    cost: 14000,
    time: 2,
    impact: 'High',
    type: 'Professional',
    room: 'Bedroom',
    buyLinks: [
      { store: 'IKEA India', url: 'https://www.ikea.com/in', price: '₹13,500' },
      { store: 'Wakefit', url: 'https://www.wakefit.co', price: '₹14,800' },
      { store: 'Pepperfry', url: 'https://www.pepperfry.com/study-tables', price: '₹14,200' }
    ]
  },
  {
    id: 'in-014',
    trigger: 'Bathroom',
    condition: 'Old geyser',
    suggestion: 'Replace with instant electric geyser with digital display',
    issueSolved: 'Energy efficient hot water with precise temperature control',
    cost: 8500,
    time: 1,
    impact: 'Medium',
    type: 'Professional',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Bajaj', url: 'https://www.amazon.in/bajaj-geyser', price: '₹7,999' },
      { store: 'Racold', url: 'https://www.flipkart.com/racold', price: '₹8,800' },
      { store: 'AO Smith', url: 'https://www.amazon.in/ao-smith', price: '₹9,200' }
    ]
  },
  {
    id: 'in-015',
    trigger: 'Balcony',
    condition: 'No seating area',
    suggestion: 'Install foldable outdoor furniture set with cushions',
    issueSolved: 'Compact seating solution perfect for Indian balconies',
    cost: 11500,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Balcony',
    buyLinks: [
      { store: 'IKEA India', url: 'https://www.ikea.com/in/outdoor', price: '₹10,999' },
      { store: 'Urban Ladder', url: 'https://www.urbanladder.com/outdoor', price: '₹12,200' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/furniture/outdoor', price: '₹11,800' }
    ]
  },
  {
    id: 'in-016',
    trigger: 'Living',
    condition: 'No entertainment center',
    suggestion: 'Install TV unit with cable management and LED backlighting',
    issueSolved: 'Organized entertainment area with cinema-like ambiance',
    cost: 22000,
    time: 2,
    impact: 'High',
    type: 'Professional',
    room: 'Living Room',
    buyLinks: [
      { store: 'Urban Ladder', url: 'https://www.urbanladder.com/tv-units', price: '₹21,500' },
      { store: 'Pepperfry', url: 'https://www.pepperfry.com/tv-units', price: '₹23,000' },
      { store: 'HomeTown', url: 'https://www.homecentre.in', price: '₹22,800' }
    ]
  },
  {
    id: 'in-017',
    trigger: 'Kitchen',
    condition: 'Poor lighting',
    suggestion: 'Add under-cabinet LED strip lights for kitchen counter',
    issueSolved: 'Better visibility for food prep and modern aesthetic',
    cost: 3500,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Philips', url: 'https://www.amazon.in/philips-led-strip', price: '₹3,299' },
      { store: 'Syska', url: 'https://www.flipkart.com/syska-led', price: '₹3,699' },
      { store: 'Amazon India', url: 'https://www.amazon.in/led-strips', price: '₹3,500' }
    ]
  },
  {
    id: 'in-018',
    trigger: 'Entrance',
    condition: 'Basic door lock',
    suggestion: 'Upgrade to smart digital door lock with fingerprint sensor',
    issueSolved: 'Enhanced security with keyless entry for modern homes',
    cost: 15500,
    time: 1,
    impact: 'High',
    type: 'Professional',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Yale India', url: 'https://www.amazon.in/yale-smart-lock', price: '₹14,999' },
      { store: 'Godrej', url: 'https://www.flipkart.com/godrej-locks', price: '₹16,200' },
      { store: 'Oakter', url: 'https://www.amazon.in/oakter', price: '₹15,800' }
    ]
  },
  {
    id: 'in-019',
    trigger: 'Bedroom',
    condition: 'Poor air quality',
    suggestion: 'Install HEPA air purifier suitable for Indian pollution levels',
    issueSolved: 'Removes PM2.5, allergens, and improves sleep quality',
    cost: 12500,
    time: 1,
    impact: 'High',
    type: 'DIY',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Mi', url: 'https://www.amazon.in/mi-air-purifier', price: '₹11,999' },
      { store: 'Philips', url: 'https://www.flipkart.com/philips-purifier', price: '₹13,500' },
      { store: 'Honeywell', url: 'https://www.amazon.in/honeywell', price: '₹12,800' }
    ]
  },
  {
    id: 'in-020',
    trigger: 'Bathroom',
    condition: 'Slippery floor',
    suggestion: 'Install anti-slip ceramic tiles with matte finish',
    issueSolved: 'Prevents accidents and adds safety for families',
    cost: 28000,
    time: 4,
    impact: 'High',
    type: 'Professional',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Kajaria', url: 'https://www.kajaria.com', price: '₹26,500' },
      { store: 'Somany', url: 'https://www.flipkart.com/somany-tiles', price: '₹29,000' },
      { store: 'Orientbell', url: 'https://www.orientbell.com', price: '₹28,500' }
    ]
  },

  // Additional Living Room Suggestions
  {
    id: 'lr-013',
    trigger: 'Fireplace',
    condition: 'No focal point or warmth',
    suggestion: 'Install electric fireplace with realistic flame effect',
    cost: 35000,
    time: 2,
    impact: 'High',
    type: 'Professional',
    room: 'Living Room',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/electric-fireplace', price: '₹33,500' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/fireplace', price: '₹36,200' }
    ]
  },
  {
    id: 'lr-014',
    trigger: 'Bookshelf',
    condition: 'No storage for books or decor',
    suggestion: 'Add modular bookshelf with LED accent lighting',
    cost: 18000,
    time: 2,
    impact: 'Medium',
    type: 'DIY',
    room: 'Living Room',
    buyLinks: [
      { store: 'IKEA', url: 'https://www.ikea.com/in/bookcases', price: '₹17,500' },
      { store: 'Urban Ladder', url: 'https://www.urbanladder.com/bookshelves', price: '₹19,000' }
    ]
  },
  {
    id: 'lr-015',
    trigger: 'Accent Chair',
    condition: 'Seating feels incomplete',
    suggestion: 'Add velvet accent chair with footrest',
    cost: 22000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Living Room',
    buyLinks: [
      { store: 'Pepperfry', url: 'https://www.pepperfry.com/accent-chairs', price: '₹21,000' },
      { store: 'Urban Ladder', url: 'https://www.urbanladder.com/chairs', price: '₹23,500' }
    ]
  },
  {
    id: 'lr-016',
    trigger: 'Art',
    condition: 'Blank walls need character',
    suggestion: 'Hang large canvas art or gallery wall collection',
    cost: 12000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Living Room',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/wall-art', price: '₹11,500' },
      { store: 'FabFurnish', url: 'https://www.fabfurnish.com/art', price: '₹12,800' }
    ]
  },
  {
    id: 'lr-017',
    trigger: 'Side Table',
    condition: 'No surface for lamps or drinks',
    suggestion: 'Add nesting side tables with metallic finish',
    cost: 8500,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Living Room',
    buyLinks: [
      { store: 'IKEA', url: 'https://www.ikea.com/in/side-tables', price: '₹8,000' },
      { store: 'Home Centre', url: 'https://www.homecentre.in', price: '₹9,200' }
    ]
  },
  {
    id: 'lr-018',
    trigger: 'Bar Cart',
    condition: 'No entertaining area',
    suggestion: 'Install rolling bar cart with glass shelves',
    cost: 15000,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Living Room',
    buyLinks: [
      { store: 'Urban Ladder', url: 'https://www.urbanladder.com/bar-carts', price: '₹14,500' },
      { store: 'Pepperfry', url: 'https://www.pepperfry.com/bar-furniture', price: '₹16,000' }
    ]
  },
  {
    id: 'lr-019',
    trigger: 'Console Table',
    condition: 'Entry area lacks definition',
    suggestion: 'Add slim console table with decorative mirror above',
    cost: 16000,
    time: 2,
    impact: 'Medium',
    type: 'DIY',
    room: 'Living Room',
    buyLinks: [
      { store: 'Pepperfry', url: 'https://www.pepperfry.com/console-tables', price: '₹15,500' },
      { store: 'Urban Ladder', url: 'https://www.urbanladder.com', price: '₹17,000' }
    ]
  },
  {
    id: 'lr-020',
    trigger: 'Plant Stand',
    condition: 'Lack of greenery',
    suggestion: 'Add tiered plant stand with indoor plants',
    cost: 6000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Living Room',
    buyLinks: [
      { store: 'Ugaoo', url: 'https://www.ugaoo.com/plant-stands', price: '₹5,500' },
      { store: 'Amazon India', url: 'https://www.amazon.in/plant-stands', price: '₹6,500' }
    ]
  },
  {
    id: 'lr-021',
    trigger: 'Ottoman',
    condition: 'Need extra seating and storage',
    suggestion: 'Add large storage ottoman as coffee table alternative',
    cost: 14000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Living Room',
    buyLinks: [
      { store: 'Urban Ladder', url: 'https://www.urbanladder.com/ottomans', price: '₹13,500' },
      { store: 'Pepperfry', url: 'https://www.pepperfry.com/ottomans', price: '₹14,800' }
    ]
  },
  {
    id: 'lr-022',
    trigger: 'Wall Sconces',
    condition: 'Need ambient lighting',
    suggestion: 'Install decorative wall sconces on either side of TV',
    cost: 9000,
    time: 2,
    impact: 'Medium',
    type: 'Professional',
    room: 'Living Room',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/wall-sconces', price: '₹8,500' },
      { store: 'Havells', url: 'https://www.flipkart.com/havells-lights', price: '₹9,500' }
    ]
  },
  {
    id: 'lr-023',
    trigger: 'Piano',
    condition: 'Empty corner space',
    suggestion: 'Add digital piano or keyboard with stand',
    cost: 45000,
    time: 1,
    impact: 'High',
    type: 'DIY',
    room: 'Living Room',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/digital-piano', price: '₹43,000' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/musical-instruments', price: '₹47,000' }
    ]
  },
  {
    id: 'lr-024',
    trigger: 'Throw Blankets',
    condition: 'Sofa looks bare',
    suggestion: 'Layer chunky knit throws and textured blankets',
    cost: 4500,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Living Room',
    buyLinks: [
      { store: 'H&M Home', url: 'https://www.amazon.in/hm-home', price: '₹4,200' },
      { store: 'Zara Home', url: 'https://www.flipkart.com/home-decor', price: '₹4,800' }
    ]
  },
  {
    id: 'lr-025',
    trigger: 'Media Storage',
    condition: 'DVDs, games, books scattered',
    suggestion: 'Install media storage cabinet with glass doors',
    cost: 19000,
    time: 2,
    impact: 'Medium',
    type: 'DIY',
    room: 'Living Room',
    buyLinks: [
      { store: 'IKEA', url: 'https://www.ikea.com/in/storage', price: '₹18,000' },
      { store: 'Urban Ladder', url: 'https://www.urbanladder.com/storage', price: '₹20,000' }
    ]
  },
  {
    id: 'lr-026',
    trigger: 'Window Seat',
    condition: 'Unused window area',
    suggestion: 'Build window seat with storage underneath',
    cost: 28000,
    time: 5,
    impact: 'High',
    type: 'Professional',
    room: 'Living Room',
    buyLinks: [
      { store: 'Livspace', url: 'https://www.livspace.com', price: '₹26,500' },
      { store: 'HomeLane', url: 'https://www.homelane.com', price: '₹29,500' }
    ]
  },
  {
    id: 'lr-027',
    trigger: 'Desk',
    condition: 'No work from home space',
    suggestion: 'Add compact writing desk with cable management',
    cost: 16000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Living Room',
    buyLinks: [
      { store: 'IKEA', url: 'https://www.ikea.com/in/desks', price: '₹15,000' },
      { store: 'Wakefit', url: 'https://www.wakefit.co/desks', price: '₹17,000' }
    ]
  },

  // Additional Kitchen Suggestions
  {
    id: 'k-009',
    trigger: 'Spice Rack',
    condition: 'Cluttered spice storage',
    suggestion: 'Install wall-mounted magnetic spice rack system',
    cost: 5000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/spice-rack', price: '₹4,500' },
      { store: 'IKEA', url: 'https://www.ikea.com/in/kitchen-storage', price: '₹5,500' }
    ]
  },
  {
    id: 'k-010',
    trigger: 'Pantry',
    condition: 'No organized storage',
    suggestion: 'Create pull-out pantry system with labeled containers',
    cost: 18000,
    time: 3,
    impact: 'High',
    type: 'Professional',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Hettich', url: 'https://www.amazon.in/hettich-hardware', price: '₹17,000' },
      { store: 'Godrej Interio', url: 'https://www.godrejinterio.com', price: '₹19,000' }
    ]
  },
  {
    id: 'k-011',
    trigger: 'Trash',
    condition: 'Visible garbage bins',
    suggestion: 'Install pull-out dual waste bin system',
    cost: 8000,
    time: 2,
    impact: 'Medium',
    type: 'Professional',
    room: 'Kitchen',
    buyLinks: [
      { store: 'IKEA', url: 'https://www.ikea.com/in/waste-sorting', price: '₹7,500' },
      { store: 'Hafele', url: 'https://www.amazon.in/hafele', price: '₹8,500' }
    ]
  },
  {
    id: 'k-012',
    trigger: 'Dish Rack',
    condition: 'Counter space for drying dishes',
    suggestion: 'Add over-sink dish drying rack with cutlery holder',
    cost: 4500,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/dish-rack', price: '₹4,200' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/kitchen-organizers', price: '₹4,800' }
    ]
  },
  {
    id: 'k-013',
    trigger: 'Pot Rack',
    condition: 'Pots and pans cluttering cabinets',
    suggestion: 'Install hanging pot rack with hooks',
    cost: 7000,
    time: 2,
    impact: 'Medium',
    type: 'DIY',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/pot-rack', price: '₹6,500' },
      { store: 'Urban Ladder', url: 'https://www.urbanladder.com/kitchen', price: '₹7,500' }
    ]
  },
  {
    id: 'k-014',
    trigger: 'Wine Rack',
    condition: 'No bottle storage',
    suggestion: 'Add wall-mounted wine rack with glass holder',
    cost: 6500,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/wine-rack', price: '₹6,000' },
      { store: 'Pepperfry', url: 'https://www.pepperfry.com/bar-accessories', price: '₹7,000' }
    ]
  },
  {
    id: 'k-015',
    trigger: 'Microwave',
    condition: 'Countertop is cluttered',
    suggestion: 'Install built-in microwave oven shelf',
    cost: 12000,
    time: 2,
    impact: 'Medium',
    type: 'Professional',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Godrej Interio', url: 'https://www.godrejinterio.com', price: '₹11,500' },
      { store: 'Sleek', url: 'https://www.flipkart.com/kitchen-furniture', price: '₹12,800' }
    ]
  },
  {
    id: 'k-016',
    trigger: 'Kitchen Island',
    condition: 'Need more workspace',
    suggestion: 'Add movable kitchen island with storage and seating',
    cost: 38000,
    time: 1,
    impact: 'High',
    type: 'DIY',
    room: 'Kitchen',
    buyLinks: [
      { store: 'IKEA', url: 'https://www.ikea.com/in/kitchen-islands', price: '₹36,000' },
      { store: 'Urban Ladder', url: 'https://www.urbanladder.com/kitchen', price: '₹40,000' }
    ]
  },
  {
    id: 'k-017',
    trigger: 'Cutting Board',
    condition: 'Limited prep space',
    suggestion: 'Install over-sink cutting board with colander',
    cost: 3500,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/cutting-board', price: '₹3,200' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/kitchen-tools', price: '₹3,800' }
    ]
  },
  {
    id: 'k-018',
    trigger: 'Utensil Holder',
    condition: 'Utensils scattered in drawers',
    suggestion: 'Add rotating utensil carousel on countertop',
    cost: 2500,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/utensil-holder', price: '₹2,200' },
      { store: 'Home Centre', url: 'https://www.homecentre.in', price: '₹2,800' }
    ]
  },
  {
    id: 'k-019',
    trigger: 'Kitchen Mat',
    condition: 'Hard floor for long standing',
    suggestion: 'Add anti-fatigue kitchen mat with non-slip base',
    cost: 3000,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/kitchen-mat', price: '₹2,800' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/home-furnishing', price: '₹3,200' }
    ]
  },
  {
    id: 'k-020',
    trigger: 'Water Filter',
    condition: 'No purified water access',
    suggestion: 'Install under-sink RO water purification system',
    cost: 15000,
    time: 2,
    impact: 'High',
    type: 'Professional',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Kent', url: 'https://www.amazon.in/kent-ro', price: '₹14,500' },
      { store: 'Aquaguard', url: 'https://www.flipkart.com/water-purifiers', price: '₹16,000' }
    ]
  },
  {
    id: 'k-021',
    trigger: 'Soap Dispenser',
    condition: 'Plastic bottles on counter',
    suggestion: 'Install built-in soap dispenser into countertop',
    cost: 2500,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/soap-dispenser', price: '₹2,200' },
      { store: 'Kohler', url: 'https://www.flipkart.com/kohler', price: '₹2,800' }
    ]
  },
  {
    id: 'k-022',
    trigger: 'Herb Garden',
    condition: 'No fresh herbs available',
    suggestion: 'Create indoor windowsill herb garden with grow lights',
    cost: 5500,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Ugaoo', url: 'https://www.ugaoo.com/herb-garden', price: '₹5,000' },
      { store: 'Amazon India', url: 'https://www.amazon.in/indoor-garden', price: '₹6,000' }
    ]
  },
  {
    id: 'k-023',
    trigger: 'Range Hood',
    condition: 'Old or inefficient exhaust',
    suggestion: 'Upgrade to designer range hood with auto-clean',
    cost: 25000,
    time: 2,
    impact: 'High',
    type: 'Professional',
    room: 'Kitchen',
    buyLinks: [
      { store: 'Faber', url: 'https://www.amazon.in/faber', price: '₹24,000' },
      { store: 'Elica', url: 'https://www.flipkart.com/elica', price: '₹26,500' }
    ]
  },

  // Additional Bedroom Suggestions
  {
    id: 'br-012',
    trigger: 'Nightstand',
    condition: 'No bedside storage',
    suggestion: 'Add floating nightstands with built-in USB charging',
    cost: 12000,
    time: 2,
    impact: 'Medium',
    type: 'DIY',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Urban Ladder', url: 'https://www.urbanladder.com/bedside-tables', price: '₹11,500' },
      { store: 'Pepperfry', url: 'https://www.pepperfry.com/nightstands', price: '₹12,800' }
    ]
  },
  {
    id: 'br-013',
    trigger: 'Dresser',
    condition: 'Insufficient clothing storage',
    suggestion: 'Add tall dresser with jewelry drawer organizers',
    cost: 28000,
    time: 2,
    impact: 'High',
    type: 'DIY',
    room: 'Bedroom',
    buyLinks: [
      { store: 'IKEA', url: 'https://www.ikea.com/in/dressers', price: '₹26,500' },
      { store: 'Urban Ladder', url: 'https://www.urbanladder.com/dressers', price: '₹29,500' }
    ]
  },
  {
    id: 'br-014',
    trigger: 'Reading Nook',
    condition: 'No cozy reading space',
    suggestion: 'Create reading corner with lounge chair and floor lamp',
    cost: 22000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Pepperfry', url: 'https://www.pepperfry.com/lounge-chairs', price: '₹21,000' },
      { store: 'Urban Ladder', url: 'https://www.urbanladder.com/chairs', price: '₹23,500' }
    ]
  },
  {
    id: 'br-015',
    trigger: 'Bench',
    condition: 'Foot of bed empty',
    suggestion: 'Add upholstered storage bench at foot of bed',
    cost: 15000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Urban Ladder', url: 'https://www.urbanladder.com/benches', price: '₹14,000' },
      { store: 'Pepperfry', url: 'https://www.pepperfry.com/benches', price: '₹16,000' }
    ]
  },
  {
    id: 'br-016',
    trigger: 'Vanity',
    condition: 'No makeup area',
    suggestion: 'Install vanity table with LED mirror and drawers',
    cost: 18000,
    time: 2,
    impact: 'Medium',
    type: 'DIY',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Urban Ladder', url: 'https://www.urbanladder.com/vanity', price: '₹17,000' },
      { store: 'Pepperfry', url: 'https://www.pepperfry.com/vanity-tables', price: '₹19,000' }
    ]
  },
  {
    id: 'br-017',
    trigger: 'Rug',
    condition: 'Cold floor in winter',
    suggestion: 'Add plush area rug beside bed',
    cost: 8000,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Carpet Couture', url: 'https://www.amazon.in/rugs', price: '₹7,500' },
      { store: 'The Rug Republic', url: 'https://www.flipkart.com/rugs', price: '₹8,500' }
    ]
  },
  {
    id: 'br-018',
    trigger: 'Jewelry Storage',
    condition: 'Tangled accessories',
    suggestion: 'Add wall-mounted jewelry organizer with mirror',
    cost: 6000,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/jewelry-organizer', price: '₹5,500' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/storage', price: '₹6,500' }
    ]
  },
  {
    id: 'br-019',
    trigger: 'Shoe Rack',
    condition: 'Shoes scattered on floor',
    suggestion: 'Install space-saving rotating shoe rack',
    cost: 9000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/shoe-rack', price: '₹8,500' },
      { store: 'IKEA', url: 'https://www.ikea.com/in/shoe-storage', price: '₹9,500' }
    ]
  },
  {
    id: 'br-020',
    trigger: 'Laundry Hamper',
    condition: 'Clothes pile on chair',
    suggestion: 'Add stylish laundry hamper with lid',
    cost: 3500,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/laundry-hamper', price: '₹3,200' },
      { store: 'Home Centre', url: 'https://www.homecentre.in', price: '₹3,800' }
    ]
  },
  {
    id: 'br-021',
    trigger: 'Smart Speaker',
    condition: 'No voice-controlled devices',
    suggestion: 'Add smart speaker with ambient sounds for sleep',
    cost: 8000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/alexa-devices', price: '₹7,500' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/smart-speakers', price: '₹8,500' }
    ]
  },
  {
    id: 'br-022',
    trigger: 'Bedding',
    condition: 'Old or mismatched linens',
    suggestion: 'Upgrade to luxury cotton bedding set with throw pillows',
    cost: 12000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/bedding', price: '₹11,000' },
      { store: 'Spaces', url: 'https://www.flipkart.com/spaces-bedding', price: '₹13,000' }
    ]
  },
  {
    id: 'br-023',
    trigger: 'Task Lighting',
    condition: 'Poor lighting for reading',
    suggestion: 'Install adjustable reading lights on both sides of bed',
    cost: 7000,
    time: 1,
    impact: 'Medium',
    type: 'Professional',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/reading-lights', price: '₹6,500' },
      { store: 'Philips', url: 'https://www.flipkart.com/philips-lights', price: '₹7,500' }
    ]
  },
  {
    id: 'br-024',
    trigger: 'Closet Organizer',
    condition: 'Messy wardrobe interior',
    suggestion: 'Add modular closet organizer system with dividers',
    cost: 10000,
    time: 2,
    impact: 'High',
    type: 'DIY',
    room: 'Bedroom',
    buyLinks: [
      { store: 'IKEA', url: 'https://www.ikea.com/in/closet-organizers', price: '₹9,500' },
      { store: 'Amazon India', url: 'https://www.amazon.in/closet-storage', price: '₹10,500' }
    ]
  },
  {
    id: 'br-025',
    trigger: 'Window Treatment',
    condition: 'Privacy concerns',
    suggestion: 'Install motorized blackout roller shades',
    cost: 16000,
    time: 2,
    impact: 'High',
    type: 'Professional',
    room: 'Bedroom',
    buyLinks: [
      { store: 'IKEA', url: 'https://www.ikea.com/in/smart-blinds', price: '₹15,000' },
      { store: 'Amazon India', url: 'https://www.amazon.in/smart-blinds', price: '₹17,000' }
    ]
  },
  {
    id: 'br-026',
    trigger: 'Artwork',
    condition: 'Walls need personality',
    suggestion: 'Hang framed art collection above bed',
    cost: 9000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Bedroom',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/wall-art', price: '₹8,500' },
      { store: 'FabFurnish', url: 'https://www.fabfurnish.com/art', price: '₹9,500' }
    ]
  },

  // Additional Bathroom Suggestions
  {
    id: 'bt-010',
    trigger: 'Towel Warmer',
    condition: 'Cold towels in winter',
    suggestion: 'Install electric towel warmer rack',
    cost: 12000,
    time: 2,
    impact: 'Medium',
    type: 'Professional',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/towel-warmer', price: '₹11,500' },
      { store: 'Jaquar', url: 'https://www.flipkart.com/jaquar', price: '₹12,800' }
    ]
  },
  {
    id: 'bt-011',
    trigger: 'Shower Caddy',
    condition: 'Toiletries on floor',
    suggestion: 'Add corner shower caddy with rust-proof coating',
    cost: 3500,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/shower-caddy', price: '₹3,200' },
      { store: 'Home Centre', url: 'https://www.homecentre.in', price: '₹3,800' }
    ]
  },
  {
    id: 'bt-012',
    trigger: 'Bathroom Scale',
    condition: 'No health monitoring',
    suggestion: 'Add smart bathroom scale with body composition',
    cost: 4500,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/smart-scale', price: '₹4,200' },
      { store: 'Mi', url: 'https://www.flipkart.com/mi-scale', price: '₹4,800' }
    ]
  },
  {
    id: 'bt-013',
    trigger: 'Toilet Paper Holder',
    condition: 'Basic holder',
    suggestion: 'Install decorative toilet paper holder with phone shelf',
    cost: 2500,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/toilet-paper-holder', price: '₹2,200' },
      { store: 'Kohler', url: 'https://www.flipkart.com/kohler-accessories', price: '₹2,800' }
    ]
  },
  {
    id: 'bt-014',
    trigger: 'Bath Mat',
    condition: 'Wet floor after shower',
    suggestion: 'Add quick-dry diatomaceous earth bath mat',
    cost: 2000,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/bath-mat', price: '₹1,800' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/bath-mats', price: '₹2,200' }
    ]
  },
  {
    id: 'bt-015',
    trigger: 'Shower Curtain',
    condition: 'Old or moldy curtain',
    suggestion: 'Replace with waterproof fabric shower curtain',
    cost: 1500,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/shower-curtain', price: '₹1,300' },
      { store: 'Home Centre', url: 'https://www.homecentre.in', price: '₹1,700' }
    ]
  },
  {
    id: 'bt-016',
    trigger: 'Mirror Defogger',
    condition: 'Foggy mirror after shower',
    suggestion: 'Install heated mirror defogger pad',
    cost: 3500,
    time: 1,
    impact: 'Low',
    type: 'Professional',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/mirror-defogger', price: '₹3,200' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/bathroom-accessories', price: '₹3,800' }
    ]
  },
  {
    id: 'bt-017',
    trigger: 'Soap Dish',
    condition: 'Soap on counter',
    suggestion: 'Add wall-mounted soap dish with drainage',
    cost: 1500,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/soap-dish', price: '₹1,300' },
      { store: 'Kohler', url: 'https://www.flipkart.com/kohler', price: '₹1,700' }
    ]
  },
  {
    id: 'bt-018',
    trigger: 'Toothbrush Holder',
    condition: 'Toothbrushes on counter',
    suggestion: 'Install UV sanitizing toothbrush holder',
    cost: 3000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/toothbrush-holder', price: '₹2,800' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/bathroom-accessories', price: '₹3,200' }
    ]
  },
  {
    id: 'bt-019',
    trigger: 'Laundry Basket',
    condition: 'Wet towels pile up',
    suggestion: 'Add ventilated laundry basket for damp clothes',
    cost: 2500,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/laundry-basket', price: '₹2,200' },
      { store: 'IKEA', url: 'https://www.ikea.com/in/laundry-storage', price: '₹2,800' }
    ]
  },
  {
    id: 'bt-020',
    trigger: 'Waterproofing',
    condition: 'Leaking or damp walls',
    suggestion: 'Apply waterproof coating and seal joints',
    cost: 15000,
    time: 3,
    impact: 'High',
    type: 'Professional',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Dr. Fixit', url: 'https://www.amazon.in/dr-fixit', price: '₹14,000' },
      { store: 'Local Contractor', url: '#', price: '₹16,000' }
    ]
  },
  {
    id: 'bt-021',
    trigger: 'Robe Hook',
    condition: 'No place to hang clothes',
    suggestion: 'Install decorative robe hooks on wall',
    cost: 1500,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/robe-hook', price: '₹1,300' },
      { store: 'Kohler', url: 'https://www.flipkart.com/kohler', price: '₹1,700' }
    ]
  },
  {
    id: 'bt-022',
    trigger: 'Plants',
    condition: 'Sterile atmosphere',
    suggestion: 'Add humidity-loving plants like ferns',
    cost: 2000,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Ugaoo', url: 'https://www.ugaoo.com/bathroom-plants', price: '₹1,800' },
      { store: 'Nurserylive', url: 'https://www.nurserylive.com', price: '₹2,200' }
    ]
  },
  {
    id: 'bt-023',
    trigger: 'Toilet Seat',
    condition: 'Basic toilet seat',
    suggestion: 'Upgrade to soft-close toilet seat with antibacterial coating',
    cost: 4000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Kohler', url: 'https://www.amazon.in/kohler-toilet-seat', price: '₹3,800' },
      { store: 'Hindware', url: 'https://www.flipkart.com/hindware', price: '₹4,200' }
    ]
  },
  {
    id: 'bt-024',
    trigger: 'Lighting',
    condition: 'Poor vanity lighting',
    suggestion: 'Install vanity light bar with adjustable brightness',
    cost: 8000,
    time: 2,
    impact: 'High',
    type: 'Professional',
    room: 'Bathroom',
    buyLinks: [
      { store: 'Philips', url: 'https://www.amazon.in/vanity-lights', price: '₹7,500' },
      { store: 'Havells', url: 'https://www.flipkart.com/havells-lights', price: '₹8,500' }
    ]
  },

  // Additional Balcony Suggestions
  {
    id: 'bl-006',
    trigger: 'Awning',
    condition: 'Too much sun exposure',
    suggestion: 'Install retractable awning for shade',
    cost: 18000,
    time: 2,
    impact: 'High',
    type: 'Professional',
    room: 'Balcony',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/awning', price: '₹17,000' },
      { store: 'Urban Ladder', url: 'https://www.urbanladder.com/outdoor', price: '₹19,000' }
    ]
  },
  {
    id: 'bl-007',
    trigger: 'Hammock',
    condition: 'Want relaxation spot',
    suggestion: 'Hang weather-resistant hammock chair',
    cost: 5000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Balcony',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/hammock', price: '₹4,500' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/outdoor-furniture', price: '₹5,500' }
    ]
  },
  {
    id: 'bl-008',
    trigger: 'Outdoor Rug',
    condition: 'Hard concrete floor',
    suggestion: 'Add outdoor rug with drainage backing',
    cost: 4000,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Balcony',
    buyLinks: [
      { store: 'IKEA', url: 'https://www.ikea.com/in/outdoor-rugs', price: '₹3,800' },
      { store: 'Amazon India', url: 'https://www.amazon.in/outdoor-rug', price: '₹4,200' }
    ]
  },
  {
    id: 'bl-009',
    trigger: 'Outdoor Cushions',
    condition: 'Hard seating',
    suggestion: 'Add weather-resistant cushions and pillows',
    cost: 6000,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Balcony',
    buyLinks: [
      { store: 'IKEA', url: 'https://www.ikea.com/in/outdoor-cushions', price: '₹5,500' },
      { store: 'Home Centre', url: 'https://www.homecentre.in', price: '₹6,500' }
    ]
  },
  {
    id: 'bl-010',
    trigger: 'Side Table',
    condition: 'No surface for drinks',
    suggestion: 'Add foldable outdoor side table',
    cost: 3500,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Balcony',
    buyLinks: [
      { store: 'IKEA', url: 'https://www.ikea.com/in/outdoor-tables', price: '₹3,200' },
      { store: 'Amazon India', url: 'https://www.amazon.in/outdoor-furniture', price: '₹3,800' }
    ]
  },
  {
    id: 'bl-011',
    trigger: 'Bird Feeder',
    condition: 'Want to attract birds',
    suggestion: 'Install decorative bird feeder and bath',
    cost: 2500,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Balcony',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/bird-feeder', price: '₹2,200' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/garden-decor', price: '₹2,800' }
    ]
  },
  {
    id: 'bl-012',
    trigger: 'Storage Box',
    condition: 'Gardening tools scattered',
    suggestion: 'Add waterproof storage box for outdoor items',
    cost: 5000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Balcony',
    buyLinks: [
      { store: 'IKEA', url: 'https://www.ikea.com/in/outdoor-storage', price: '₹4,500' },
      { store: 'Amazon India', url: 'https://www.amazon.in/storage-box', price: '₹5,500' }
    ]
  },
  {
    id: 'bl-013',
    trigger: 'Wind Chimes',
    condition: 'Lacks ambiance',
    suggestion: 'Hang decorative wind chimes',
    cost: 1500,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Balcony',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/wind-chimes', price: '₹1,300' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/home-decor', price: '₹1,700' }
    ]
  },
  {
    id: 'bl-014',
    trigger: 'Outdoor Heater',
    condition: 'Cold in winter evenings',
    suggestion: 'Install electric patio heater',
    cost: 12000,
    time: 1,
    impact: 'Medium',
    type: 'Professional',
    room: 'Balcony',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/patio-heater', price: '₹11,500' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/outdoor-heating', price: '₹12,800' }
    ]
  },
  {
    id: 'bl-015',
    trigger: 'Mosquito Net',
    condition: 'Insect problems',
    suggestion: 'Install retractable mosquito netting',
    cost: 8000,
    time: 2,
    impact: 'High',
    type: 'Professional',
    room: 'Balcony',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/mosquito-net', price: '₹7,500' },
      { store: 'Local Contractor', url: '#', price: '₹8,500' }
    ]
  },
  {
    id: 'bl-016',
    trigger: 'Grill',
    condition: 'Want outdoor cooking',
    suggestion: 'Add compact electric grill for balcony',
    cost: 9000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Balcony',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/electric-grill', price: '₹8,500' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/kitchen-appliances', price: '₹9,500' }
    ]
  },
  {
    id: 'bl-017',
    trigger: 'Outdoor Curtains',
    condition: 'Need privacy or shade',
    suggestion: 'Install outdoor fabric curtains on rods',
    cost: 7000,
    time: 2,
    impact: 'Medium',
    type: 'DIY',
    room: 'Balcony',
    buyLinks: [
      { store: 'IKEA', url: 'https://www.ikea.com/in/outdoor-curtains', price: '₹6,500' },
      { store: 'Amazon India', url: 'https://www.amazon.in/outdoor-curtains', price: '₹7,500' }
    ]
  },
  {
    id: 'bl-018',
    trigger: 'Water Feature',
    condition: 'Want calming sounds',
    suggestion: 'Add small tabletop water fountain',
    cost: 4500,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Balcony',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/water-fountain', price: '₹4,200' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/home-decor', price: '₹4,800' }
    ]
  },
  {
    id: 'bl-019',
    trigger: 'Compost Bin',
    condition: 'Want sustainable gardening',
    suggestion: 'Install compact composting bin',
    cost: 3000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Balcony',
    buyLinks: [
      { store: 'Ugaoo', url: 'https://www.ugaoo.com/compost-bin', price: '₹2,800' },
      { store: 'Amazon India', url: 'https://www.amazon.in/compost-bin', price: '₹3,200' }
    ]
  },
  {
    id: 'bl-020',
    trigger: 'Mirror',
    condition: 'Small space feels cramped',
    suggestion: 'Add outdoor mirror to create illusion of space',
    cost: 5500,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Balcony',
    buyLinks: [
      { store: 'IKEA', url: 'https://www.ikea.com/in/mirrors', price: '₹5,000' },
      { store: 'Amazon India', url: 'https://www.amazon.in/outdoor-mirror', price: '₹6,000' }
    ]
  },

  // Additional Outdoor Suggestions
  {
    id: 'od-005',
    trigger: 'Pergola',
    condition: 'No covered outdoor area',
    suggestion: 'Build wooden pergola with climbing plants',
    cost: 65000,
    time: 10,
    impact: 'High',
    type: 'Professional',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Local Contractor', url: '#', price: '₹62,000' },
      { store: 'HomeLane', url: 'https://www.homelane.com', price: '₹68,000' }
    ]
  },
  {
    id: 'od-006',
    trigger: 'Fire Pit',
    condition: 'Want gathering space',
    suggestion: 'Install gas or wood-burning fire pit with seating',
    cost: 35000,
    time: 3,
    impact: 'High',
    type: 'Professional',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/fire-pit', price: '₹33,000' },
      { store: 'Pepperfry', url: 'https://www.pepperfry.com/outdoor', price: '₹37,000' }
    ]
  },
  {
    id: 'od-007',
    trigger: 'Outdoor Lighting',
    condition: 'Dark garden at night',
    suggestion: 'Install solar pathway lights and spotlights',
    cost: 8000,
    time: 1,
    impact: 'High',
    type: 'DIY',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/solar-lights', price: '₹7,500' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/outdoor-lighting', price: '₹8,500' }
    ]
  },
  {
    id: 'od-008',
    trigger: 'Water Fountain',
    condition: 'Want focal point',
    suggestion: 'Install decorative water fountain in garden',
    cost: 25000,
    time: 3,
    impact: 'High',
    type: 'Professional',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/garden-fountain', price: '₹24,000' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/garden-decor', price: '₹26,500' }
    ]
  },
  {
    id: 'od-009',
    trigger: 'Outdoor Kitchen',
    condition: 'Want to cook outside',
    suggestion: 'Build outdoor kitchen with countertop and sink',
    cost: 95000,
    time: 15,
    impact: 'High',
    type: 'Professional',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Local Contractor', url: '#', price: '₹90,000' },
      { store: 'HomeLane', url: 'https://www.homelane.com', price: '₹100,000' }
    ]
  },
  {
    id: 'od-010',
    trigger: 'Gazebo',
    condition: 'Need sheltered sitting area',
    suggestion: 'Install metal or wooden gazebo with curtains',
    cost: 55000,
    time: 5,
    impact: 'High',
    type: 'Professional',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/gazebo', price: '₹52,000' },
      { store: 'Pepperfry', url: 'https://www.pepperfry.com/outdoor', price: '₹58,000' }
    ]
  },
  {
    id: 'od-011',
    trigger: 'Swing',
    condition: 'Want relaxation spot',
    suggestion: 'Install garden swing or hammock with stand',
    cost: 18000,
    time: 2,
    impact: 'Medium',
    type: 'DIY',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/garden-swing', price: '₹17,000' },
      { store: 'Urban Ladder', url: 'https://www.urbanladder.com/outdoor', price: '₹19,000' }
    ]
  },
  {
    id: 'od-012',
    trigger: 'Irrigation',
    condition: 'Manual watering is tedious',
    suggestion: 'Install automatic drip irrigation system',
    cost: 12000,
    time: 2,
    impact: 'High',
    type: 'Professional',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/drip-irrigation', price: '₹11,500' },
      { store: 'Ugaoo', url: 'https://www.ugaoo.com/irrigation', price: '₹12,800' }
    ]
  },
  {
    id: 'od-013',
    trigger: 'Outdoor Dining',
    condition: 'Want alfresco dining',
    suggestion: 'Add weather-resistant dining table with umbrella',
    cost: 42000,
    time: 1,
    impact: 'High',
    type: 'DIY',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Urban Ladder', url: 'https://www.urbanladder.com/outdoor-dining', price: '₹40,000' },
      { store: 'Pepperfry', url: 'https://www.pepperfry.com/outdoor-furniture', price: '₹44,000' }
    ]
  },
  {
    id: 'od-014',
    trigger: 'Planters',
    condition: 'Want decorative greenery',
    suggestion: 'Add decorative large planters with seasonal flowers',
    cost: 8000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Ugaoo', url: 'https://www.ugaoo.com/planters', price: '₹7,500' },
      { store: 'Amazon India', url: 'https://www.amazon.in/planters', price: '₹8,500' }
    ]
  },
  {
    id: 'od-015',
    trigger: 'Outdoor Storage',
    condition: 'Garden tools exposed',
    suggestion: 'Install weather-proof storage shed',
    cost: 28000,
    time: 3,
    impact: 'Medium',
    type: 'Professional',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/storage-shed', price: '₹26,500' },
      { store: 'Local Contractor', url: '#', price: '₹29,500' }
    ]
  },
  {
    id: 'od-016',
    trigger: 'Mailbox',
    condition: 'No designated mail area',
    suggestion: 'Install decorative mailbox at entrance',
    cost: 4000,
    time: 1,
    impact: 'Low',
    type: 'DIY',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/mailbox', price: '₹3,800' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/home-improvement', price: '₹4,200' }
    ]
  },
  {
    id: 'od-017',
    trigger: 'Outdoor Rug',
    condition: 'Hard patio surface',
    suggestion: 'Add large outdoor rug for patio area',
    cost: 9000,
    time: 1,
    impact: 'Medium',
    type: 'DIY',
    room: 'Outdoor',
    buyLinks: [
      { store: 'IKEA', url: 'https://www.ikea.com/in/outdoor-rugs', price: '₹8,500' },
      { store: 'Amazon India', url: 'https://www.amazon.in/outdoor-rug', price: '₹9,500' }
    ]
  },
  {
    id: 'od-018',
    trigger: 'Security Camera',
    condition: 'Need outdoor monitoring',
    suggestion: 'Install weatherproof security camera system',
    cost: 18000,
    time: 2,
    impact: 'High',
    type: 'Professional',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/security-camera', price: '₹17,000' },
      { store: 'Flipkart', url: 'https://www.flipkart.com/security-systems', price: '₹19,000' }
    ]
  },
  {
    id: 'od-019',
    trigger: 'Lawn',
    condition: 'Patchy or dead grass',
    suggestion: 'Install artificial turf or reseed lawn',
    cost: 45000,
    time: 5,
    impact: 'High',
    type: 'Professional',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Amazon India', url: 'https://www.amazon.in/artificial-turf', price: '₹43,000' },
      { store: 'Local Contractor', url: '#', price: '₹47,000' }
    ]
  },
  {
    id: 'od-020',
    trigger: 'Fence',
    condition: 'Need privacy or boundary',
    suggestion: 'Install decorative wooden or vinyl fence',
    cost: 55000,
    time: 7,
    impact: 'High',
    type: 'Professional',
    room: 'Outdoor',
    buyLinks: [
      { store: 'Local Contractor', url: '#', price: '₹52,000' },
      { store: 'HomeLane', url: 'https://www.homelane.com', price: '₹58,000' }
    ]
  }
];

/**
 * Filters and sorts renovation suggestions based on detected objects, budget, and room type
 * @param detectedObjects - Array of object names detected by AI
 * @param budget - User's budget in rupees
 * @param room - Optional room type filter
 * @returns Filtered and sorted array of renovation suggestions
 */
export const getFilteredSuggestions = (
  detectedObjects: string[],
  budget: number,
  room?: string
): RenovationSuggestion[] => {
  // Initial filtering by room type and budget
  let filtered = renovationSuggestions.filter(suggestion => {
    // Filter by room if specified
    if (room && suggestion.room !== room) return false;
    
    // Filter by budget - only show suggestions within budget
    if (suggestion.cost > budget) return false;
    
    return true;
  });
  
  // If we have detected objects, prioritize matching suggestions but still show others
  if (detectedObjects.length > 0) {
    filtered = filtered.map(suggestion => {
      // Check for matches with detected objects using fuzzy matching
      const hasMatch = detectedObjects.some(obj => {
        const objLower = obj.toLowerCase();
        const triggerLower = suggestion.trigger.toLowerCase();
        const conditionLower = suggestion.condition.toLowerCase();
        const suggestionLower = suggestion.suggestion.toLowerCase();
        
        return objLower.includes(triggerLower) ||
               triggerLower.includes(objLower) ||
               conditionLower.includes(objLower) ||
               suggestionLower.includes(objLower);
      });
      
      // Add match score for sorting (2 for matches, 1 for non-matches)
      return { ...suggestion, matchScore: hasMatch ? 2 : 1 };
    }).sort((a, b) => {
      // Sort by match score first (matching suggestions appear first)
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      // Then by impact level (High > Medium > Low)
      const impactOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      const impactDiff = impactOrder[b.impact] - impactOrder[a.impact];
      if (impactDiff !== 0) return impactDiff;
      // Finally by cost (cheaper first)
      return a.cost - b.cost;
    });
  } else {
    // No detected objects, sort by impact and cost only
    filtered = filtered.sort((a, b) => {
      const impactOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      const impactDiff = impactOrder[b.impact] - impactOrder[a.impact];
      return impactDiff !== 0 ? impactDiff : a.cost - b.cost;
    });
  }
  
  // Limit to top 20 suggestions to avoid overwhelming the UI
  return filtered.slice(0, 20);
};