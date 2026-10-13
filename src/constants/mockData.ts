import type { MenuItem, Order, Table, Feedback, WasteEntry, Reservation, User } from '@/types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Rivera', email: 'admin@smartserve.com', role: 'admin', createdAt: '2024-01-01' },
  { id: 'u2', name: 'Maria Chen', email: 'staff@smartserve.com', role: 'staff', createdAt: '2024-02-01' },
  { id: 'u3', name: 'James Wilson', email: 'customer@smartserve.com', role: 'customer', createdAt: '2024-03-01' },
];

export const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1', name: 'Bruschetta al Pomodoro', description: 'Toasted sourdough with heirloom tomatoes, fresh basil, and aged balsamic glaze', price: 12.99,
    category: 'starters', image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop',
    available: true, preparationTime: 8, calories: 210, tags: ['vegetarian', 'vegan'], rating: 4.8
  },
  {
    id: 'm2', name: 'Crispy Calamari', description: 'Lightly breaded squid rings with lemon aioli and marinara dipping sauce', price: 15.99,
    category: 'starters', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
    available: true, preparationTime: 12, calories: 380, tags: ['seafood'], rating: 4.6
  },
  {
    id: 'm3', name: 'Wild Mushroom Soup', description: 'Velvety blend of forest mushrooms, truffle oil, and cream with herb croutons', price: 11.99,
    category: 'starters', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
    available: true, preparationTime: 10, calories: 295, tags: ['vegetarian'], rating: 4.7
  },
  {
    id: 'm4', name: 'Grilled Ribeye Steak', description: '12oz USDA prime ribeye, herb butter, roasted garlic mashed potatoes, seasonal vegetables', price: 58.99,
    category: 'mains', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
    available: true, preparationTime: 25, calories: 820, tags: ['gluten-free'], rating: 4.9
  },
  {
    id: 'm5', name: 'Pan-Seared Salmon', description: 'Atlantic salmon with lemon-caper beurre blanc, asparagus, and wild rice pilaf', price: 38.99,
    category: 'mains', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    available: true, preparationTime: 20, calories: 560, tags: ['seafood', 'gluten-free'], rating: 4.7
  },
  {
    id: 'm6', name: 'Truffle Pasta', description: 'Fresh tagliatelle, black truffle, parmesan, brown butter, toasted pine nuts', price: 32.99,
    category: 'mains', image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=300&fit=crop',
    available: true, preparationTime: 18, calories: 680, tags: ['vegetarian'], rating: 4.8
  },
  {
    id: 'm7', name: 'Chicken Piccata', description: 'Lemon-caper pan sauce, roasted fingerling potatoes, broccolini', price: 28.99,
    category: 'mains', image: 'https://images.unsplash.com/photo-1532636875304-0c89119d9b4d?w=400&h=300&fit=crop',
    available: false, preparationTime: 22, calories: 490, tags: [], rating: 4.5
  },
  {
    id: 'm8', name: 'Chocolate Lava Cake', description: 'Warm dark chocolate fondant with vanilla bean ice cream and raspberry coulis', price: 13.99,
    category: 'desserts', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    available: true, preparationTime: 15, calories: 540, tags: ['vegetarian'], rating: 4.9
  },
  {
    id: 'm9', name: 'Crème Brûlée', description: 'Classic vanilla custard with caramelized sugar crust and fresh berries', price: 11.99,
    category: 'desserts', image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&h=300&fit=crop',
    available: true, preparationTime: 5, calories: 390, tags: ['vegetarian', 'gluten-free'], rating: 4.7
  },
  {
    id: 'm10', name: 'Tiramisu', description: 'Traditional Italian dessert with espresso-soaked ladyfingers and mascarpone cream', price: 12.99,
    category: 'desserts', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
    available: true, preparationTime: 5, calories: 450, tags: ['vegetarian'], rating: 4.8
  },
  {
    id: 'm11', name: 'Signature Cocktail', description: 'House blend with aged whiskey, blood orange, rosemary syrup, and smoked bitters', price: 16.99,
    category: 'beverages', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop',
    available: true, preparationTime: 5, calories: 180, tags: [], rating: 4.6
  },
  {
    id: 'm12', name: 'Artisan Coffee', description: 'Single-origin pour over, cold brew, or espresso from our curated selection', price: 7.99,
    category: 'beverages', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
    available: true, preparationTime: 5, calories: 10, tags: ['vegan'], rating: 4.5
  },
  {
    id: 'm13', name: 'Chef\'s Tasting Menu', description: '7-course seasonal tasting experience with optional wine pairing – ask your server for tonight\'s menu', price: 110.00,
    category: 'specials', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    available: true, preparationTime: 90, calories: 1800, tags: ['special'], rating: 5.0
  },
  {
    id: 'm14', name: 'Weekend Brunch Special', description: 'Eggs benedict, smoked salmon, seasonal fruit, mimosa included', price: 34.99,
    category: 'specials', image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&h=300&fit=crop',
    available: true, preparationTime: 20, calories: 720, tags: ['special'], rating: 4.8
  },
];

export const MOCK_TABLES: Table[] = [
  { id: 't1', number: 1, capacity: 2, status: 'available' },
  { id: 't2', number: 2, capacity: 4, status: 'occupied', currentOrderId: 'o1' },
  { id: 't3', number: 3, capacity: 4, status: 'reserved', reservedBy: 'Sarah Johnson', reservedAt: '2026-04-05T19:00:00' },
  { id: 't4', number: 4, capacity: 6, status: 'available' },
  { id: 't5', number: 5, capacity: 2, status: 'occupied', currentOrderId: 'o2' },
  { id: 't6', number: 6, capacity: 8, status: 'available' },
  { id: 't7', number: 7, capacity: 4, status: 'cleaning' },
  { id: 't8', number: 8, capacity: 2, status: 'reserved', reservedBy: 'Michael Brown', reservedAt: '2026-04-05T20:30:00' },
  { id: 't9', number: 9, capacity: 6, status: 'occupied', currentOrderId: 'o3' },
  { id: 't10', number: 10, capacity: 4, status: 'available' },
  { id: 't11', number: 11, capacity: 10, status: 'available' },
  { id: 't12', number: 12, capacity: 2, status: 'occupied', currentOrderId: 'o4' },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1', tableId: 't2', tableNumber: 2, customerName: 'Emily Foster',
    items: [
      { menuItemId: 'm4', name: 'Grilled Ribeye Steak', quantity: 1, price: 58.99 },
      { menuItemId: 'm1', name: 'Bruschetta al Pomodoro', quantity: 2, price: 12.99 },
      { menuItemId: 'm11', name: 'Signature Cocktail', quantity: 2, price: 16.99 },
    ],
    status: 'preparing', total: 118.95, createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(), estimatedTime: 10,
  },
  {
    id: 'o2', tableId: 't5', tableNumber: 5, customerName: 'Robert Kim',
    items: [
      { menuItemId: 'm5', name: 'Pan-Seared Salmon', quantity: 1, price: 38.99 },
      { menuItemId: 'm9', name: 'Crème Brûlée', quantity: 1, price: 11.99 },
      { menuItemId: 'm12', name: 'Artisan Coffee', quantity: 2, price: 7.99 },
    ],
    status: 'ready', total: 66.96, createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60000).toISOString(), estimatedTime: 0,
  },
  {
    id: 'o3', tableId: 't9', tableNumber: 9, customerName: 'Lisa Martinez',
    items: [
      { menuItemId: 'm6', name: 'Truffle Pasta', quantity: 2, price: 32.99 },
      { menuItemId: 'm3', name: 'Wild Mushroom Soup', quantity: 2, price: 11.99 },
      { menuItemId: 'm8', name: 'Chocolate Lava Cake', quantity: 1, price: 13.99 },
    ],
    status: 'served', total: 103.95, createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60000).toISOString(),
  },
  {
    id: 'o4', tableId: 't12', tableNumber: 12, customerName: 'David Chen',
    items: [
      { menuItemId: 'm2', name: 'Crispy Calamari', quantity: 1, price: 15.99 },
      { menuItemId: 'm5', name: 'Pan-Seared Salmon', quantity: 1, price: 38.99 },
    ],
    status: 'pending', total: 54.98, createdAt: new Date(Date.now() - 3 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60000).toISOString(), estimatedTime: 20,
  },
  {
    id: 'o5', tableId: 't3', tableNumber: 3, customerName: 'Nina Patel',
    items: [
      { menuItemId: 'm13', name: 'Chef\'s Tasting Menu', quantity: 2, price: 110.00 },
      { menuItemId: 'm11', name: 'Signature Cocktail', quantity: 2, price: 16.99 },
    ],
    status: 'pending', total: 253.98, createdAt: new Date(Date.now() - 1 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60000).toISOString(), estimatedTime: 25,
  },
];

export const MOCK_FEEDBACK: Feedback[] = [
  {
    id: 'f1', tableNumber: 5, customerName: 'Sarah Johnson', rating: 5, foodRating: 5, serviceRating: 5,
    ambianceRating: 4, comment: 'Absolutely exceptional dining experience! The ribeye was cooked to perfection and the staff was incredibly attentive.',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'f2', tableNumber: 2, customerName: 'Michael Brown', rating: 4, foodRating: 4, serviceRating: 5,
    ambianceRating: 4, comment: 'Great food and wonderful atmosphere. The truffle pasta was divine. Will definitely return!',
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: 'f3', tableNumber: 8, customerName: 'Jessica Lee', rating: 5, foodRating: 5, serviceRating: 4,
    ambianceRating: 5, comment: 'The tasting menu was a journey through flavors. Each course was better than the last.',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: 'f4', tableNumber: 3, customerName: 'Tom Williams', rating: 3, foodRating: 3, serviceRating: 4,
    ambianceRating: 4, comment: 'Food was good but the wait was longer than expected. Ambiance is lovely.',
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
  {
    id: 'f5', tableNumber: 7, customerName: 'Amy Rodriguez', rating: 5, foodRating: 5, serviceRating: 5,
    ambianceRating: 5, comment: 'Perfect anniversary dinner! The chocolate lava cake was absolutely divine. 10/10!',
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
];

export const MOCK_WASTE: WasteEntry[] = [
  { id: 'w1', date: '2026-04-04', item: 'Mixed Salad Greens', quantity: 2.5, unit: 'kg', reason: 'Expired', cost: 12.50 },
  { id: 'w2', date: '2026-04-04', item: 'Atlantic Salmon', quantity: 0.8, unit: 'kg', reason: 'Overcooked (kitchen error)', cost: 28.00 },
  { id: 'w3', date: '2026-04-03', item: 'Bread Rolls', quantity: 24, unit: 'pcs', reason: 'End of day surplus', cost: 9.60 },
  { id: 'w4', date: '2026-04-03', item: 'Cream Sauce', quantity: 1.2, unit: 'L', reason: 'Preparation excess', cost: 6.80 },
  { id: 'w5', date: '2026-04-02', item: 'Fresh Herbs', quantity: 0.3, unit: 'kg', reason: 'Wilted', cost: 4.50 },
  { id: 'w6', date: '2026-04-02', item: 'Ribeye Steak', quantity: 1, unit: 'pc', reason: 'Customer return', cost: 35.00 },
];

export const MOCK_RESERVATIONS: Reservation[] = [
  { id: 'r1', tableId: 't3', tableNumber: 3, customerName: 'Sarah Johnson', customerEmail: 'sarah@email.com', customerPhone: '+1 555 0101', partySize: 3, date: '2026-04-05', time: '19:00', status: 'confirmed', notes: 'Anniversary dinner' },
  { id: 'r2', tableId: 't8', tableNumber: 8, customerName: 'Michael Brown', customerEmail: 'michael@email.com', customerPhone: '+1 555 0102', partySize: 2, date: '2026-04-05', time: '20:30', status: 'confirmed' },
  { id: 'r3', tableId: 't6', tableNumber: 6, customerName: 'Corporate Event', customerEmail: 'corp@email.com', customerPhone: '+1 555 0103', partySize: 8, date: '2026-04-06', time: '18:00', status: 'pending', notes: 'Birthday celebration' },
];

export const ANALYTICS_WEEKLY = [
  { day: 'Mon', revenue: 2840, orders: 42, covers: 78 },
  { day: 'Tue', revenue: 3120, orders: 48, covers: 92 },
  { day: 'Wed', revenue: 2680, orders: 38, covers: 65 },
  { day: 'Thu', revenue: 3890, orders: 56, covers: 110 },
  { day: 'Fri', revenue: 5620, orders: 84, covers: 168 },
  { day: 'Sat', revenue: 6240, orders: 96, covers: 192 },
  { day: 'Sun', revenue: 4380, orders: 64, covers: 128 },
];

export const CATEGORY_REVENUE = [
  { category: 'Mains', value: 8420, color: '#f59e0b' },
  { category: 'Beverages', value: 3240, color: '#d97706' },
  { category: 'Starters', value: 2180, color: '#b45309' },
  { category: 'Desserts', value: 1860, color: '#92400e' },
  { category: 'Specials', value: 4320, color: '#78350f' },
];
