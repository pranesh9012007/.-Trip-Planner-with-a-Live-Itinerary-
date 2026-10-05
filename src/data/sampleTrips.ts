import { TripPlan } from '../types/trip';

export const KYOTO_SAMPLE_TRIP: TripPlan = {
  id: 'trip-kyoto-sample',
  destination: 'Kyoto, Japan',
  tagline: 'Ancient Pagodas, Zen Moss Gardens & Culinary Back-Alleys',
  overview: 'A meticulously balanced 4-day journey through Japan’s cultural capital, weaving tranquil bamboo forests, golden temples, secret matcha tearooms, and lantern-lit culinary alleys.',
  country: 'Japan',
  currency: 'JPY (¥)',
  bestSeason: 'Spring (Cherry Blossoms) or Autumn (Fiery Maples)',
  budgetLevel: 'Moderate ($$)',
  vibe: 'Cultural & Foodie',
  coordinates: {
    lat: 34.9949,
    lng: 135.7850,
    zoom: 13
  },
  budgetBreakdown: {
    totalEstimated: '$780 - $950 USD',
    accommodation: '$110/night (Traditional Machiya or Modern Boutique)',
    foodAndDrinks: '$45/day (Depachika lunches, ramen & Kaiseki dinner)',
    activities: '$20/day (Temple entry permits & tea ceremony)',
    transport: '$12/day (IC card bus/subway passes & occasional taxi)'
  },
  days: [
    {
      dayNumber: 1,
      title: 'Spiritual South: Torii Gates & Sake Breweries',
      theme: 'Spiritual Awakening & Fushimi Sake',
      estimatedDailyCost: '$65 USD',
      weatherTip: 'Crisp morning air; comfortable walking shoes essential for stone steps.',
      places: [
        {
          id: 'k1-1',
          name: 'Fushimi Inari Taisha Shrine',
          timeOfDay: 'Morning',
          timeSlot: '07:30 - 10:00',
          lat: 34.9671,
          lng: 135.7727,
          category: 'sightseeing',
          description: 'Hike through thousands of vermilion torii gates winding up sacred Mount Inari under cedar canopy.',
          insiderTip: 'Start early before 8:00 AM; the crowds disappear past the Yotsutsuji intersection lookout.',
          costEstimate: 'Free admission',
          duration: '2.5 hours'
        },
        {
          id: 'k1-2',
          name: 'Tofuku-ji Zen Temple & Hojo Gardens',
          timeOfDay: 'Afternoon',
          timeSlot: '11:00 - 13:00',
          lat: 34.9811,
          lng: 135.7744,
          category: 'culture',
          description: 'Marvel at the checkerboard moss garden designed by Mirei Shigemori and the iconic wooden Tsutenkyo bridge.',
          insiderTip: 'Quiet garden sanctuary just 15 mins walk north of Inari; far fewer tour groups.',
          costEstimate: '¥1,000 (~$7)',
          duration: '2 hours'
        },
        {
          id: 'k1-3',
          name: 'Fushimi Sake Brewing District & Kizakura Kappa CC',
          timeOfDay: 'Sunset',
          timeSlot: '15:30 - 18:00',
          lat: 34.9304,
          lng: 135.7599,
          category: 'food',
          description: 'Stroll along willow-lined canals with historic wooden sake cellars and sample fresh unpasteurized ginjo sake.',
          insiderTip: 'Taste 3 artisanal sakes at Aburacho shoten for only ¥500 with seasonal pickled vegetables.',
          costEstimate: '¥1,500 (~$10)',
          duration: '2.5 hours'
        },
        {
          id: 'k1-4',
          name: 'Pontocho Alley & Kamo River Night Walk',
          timeOfDay: 'Evening',
          timeSlot: '19:30 - 22:00',
          lat: 35.0053,
          lng: 135.7709,
          category: 'nightlife',
          description: 'Atmospheric stone-paved corridor illuminated by red paper lanterns, packed with intimate yakitori joints and craft cocktail bars.',
          insiderTip: 'Reserve a counter seat at a modest Izakaya or sit along the riverbanks with a can of local craft beer.',
          costEstimate: '¥3,500 (~$24)',
          duration: '2.5 hours'
        }
      ]
    },
    {
      dayNumber: 2,
      title: 'Higashiyama Heritage & The Philosopher’s Path',
      theme: 'Ancient Kyoto & Teahouse Intimacy',
      estimatedDailyCost: '$80 USD',
      weatherTip: 'Gentle afternoon sun; pack an umbrella for sudden passing showers.',
      places: [
        {
          id: 'k2-1',
          name: 'Kiyomizu-dera Wooden Stage & Otowa Waterfall',
          timeOfDay: 'Morning',
          timeSlot: '08:00 - 10:30',
          lat: 34.9949,
          lng: 135.7850,
          category: 'sightseeing',
          description: 'Perched cliffside temple offering breathtaking panoramic views of Kyoto; built entirely without nails.',
          insiderTip: 'Drink from one of the three streams of Otowa waterfall for health, longevity, or success in studies.',
          costEstimate: '¥400 (~$3)',
          duration: '2.5 hours'
        },
        {
          id: 'k2-2',
          name: 'Ninenzaka & Sannenzaka Preserved Historic Streets',
          timeOfDay: 'Afternoon',
          timeSlot: '11:00 - 13:30',
          lat: 34.9992,
          lng: 135.7818,
          category: 'culture',
          description: 'Wander stone flagstones lined with traditional wooden machiya, heritage craft shops, and matcha soft-serve stands.',
          insiderTip: 'Visit the tatami-floored Starbucks housed inside an authentic 100-year-old traditional townhouse.',
          costEstimate: '¥1,200 lunch (~$8)',
          duration: '2.5 hours'
        },
        {
          id: 'k2-3',
          name: 'Ginkaku-ji (Silver Pavilion) & Sand Sculptures',
          timeOfDay: 'Sunset',
          timeSlot: '15:00 - 17:00',
          lat: 35.0272,
          lng: 135.7982,
          category: 'nature',
          description: 'Zen Buddhist temple surrounded by a dry sand garden known as the Sea of Silver Sand and moss paths.',
          insiderTip: 'Walk the southern Philosopher’s Path canal walkway under cherry boughs right after exiting.',
          costEstimate: '¥500 (~$3.50)',
          duration: '2 hours'
        },
        {
          id: 'k2-4',
          name: 'Gion District Geisha Quarter & Shirakawa Canal',
          timeOfDay: 'Evening',
          timeSlot: '18:30 - 21:00',
          lat: 35.0037,
          lng: 135.7770,
          category: 'sightseeing',
          description: 'The historic heart of Japanese performing arts. Stone bridges, wooden teahouses (ochaya), and willow reflections.',
          insiderTip: 'Remember to respect geiko and maiko; taking photos without consent on private lanes is strictly prohibited.',
          costEstimate: '¥3,000 dinner (~$20)',
          duration: '2.5 hours'
        }
      ]
    },
    {
      dayNumber: 3,
      title: 'Arashiyama Wilderness & Bamboo Whispers',
      theme: 'Nature, Monkeys & River Boats',
      estimatedDailyCost: '$70 USD',
      weatherTip: 'Cool river breeze; bring a light cardigan or windbreaker.',
      places: [
        {
          id: 'k3-1',
          name: 'Arashiyama Bamboo Grove & Tenryu-ji Temple',
          timeOfDay: 'Morning',
          timeSlot: '07:30 - 10:30',
          lat: 35.0169,
          lng: 135.6712,
          category: 'nature',
          description: 'Towering emerald green bamboo stalks swaying with the wind, followed by UNESCO-listed Sogenchi garden ponds.',
          insiderTip: 'Enter through the north gate at sunrise for an ethereal, quiet experience before tourist rickshaws arrive.',
          costEstimate: '¥500 (~$3.50)',
          duration: '3 hours'
        },
        {
          id: 'k3-2',
          name: 'Iwatayama Monkey Park & Mountain Vista',
          timeOfDay: 'Afternoon',
          timeSlot: '11:30 - 13:30',
          lat: 35.0102,
          lng: 135.6775,
          category: 'activity',
          description: 'A brisk 20-minute uphill forest hike leading to wild Japanese macaques roaming freely with views of the entire Kyoto basin.',
          insiderTip: 'Feed apple slices to the monkeys from inside the secure observation shelter.',
          costEstimate: '¥600 (~$4)',
          duration: '2 hours'
        },
        {
          id: 'k3-3',
          name: 'Togetsukyo Bridge & Traditional Hozugawa Boat River',
          timeOfDay: 'Sunset',
          timeSlot: '15:00 - 17:30',
          lat: 35.0129,
          lng: 135.6777,
          category: 'nature',
          description: 'The famous "Moon Crossing Bridge" framing Mount Arashiyama with traditional wooden punting boats drifting past.',
          insiderTip: 'Grab a roasted sweet potato or yuba (tofu skin) croquette from the riverside stalls.',
          costEstimate: '¥800 (~$5.50)',
          duration: '2 hours'
        },
        {
          id: 'k3-4',
          name: 'Ramen Sen-no-Kaze & Kawaramachi Neon Walk',
          timeOfDay: 'Evening',
          timeSlot: '19:00 - 21:30',
          lat: 35.0040,
          lng: 135.7690,
          category: 'food',
          description: 'Award-winning rich pork tonkotsu and seafood broth ramen followed by an evening browse through Shinkyogoku shopping arcades.',
          insiderTip: 'Grab a ticket number upon arrival at the restaurant; waiting times average 25 minutes but it is well worth it.',
          costEstimate: '¥1,400 (~$10)',
          duration: '2 hours'
        }
      ]
    },
    {
      dayNumber: 4,
      title: 'Golden Zen & The Kitchen of Kyoto',
      theme: 'Gilded Aesthetics & Market Tasting',
      estimatedDailyCost: '$75 USD',
      weatherTip: 'Sunny and clear; wear slip-on shoes for frequent temple entry shoe removal.',
      places: [
        {
          id: 'k4-1',
          name: 'Kinkaku-ji (The Golden Pavilion)',
          timeOfDay: 'Morning',
          timeSlot: '09:00 - 11:00',
          lat: 35.0394,
          lng: 135.7292,
          category: 'sightseeing',
          description: 'Spectacular Zen temple covered in pure gold leaf reflecting brilliantly across Kyoko-chi (Mirror Pond).',
          insiderTip: 'Morning sunlight illuminates the golden facade directly; arrive right at opening gate time.',
          costEstimate: '¥500 (~$3.50)',
          duration: '2 hours'
        },
        {
          id: 'k4-2',
          name: 'Ryoan-ji Rock Garden',
          timeOfDay: 'Afternoon',
          timeSlot: '11:30 - 13:00',
          lat: 35.0345,
          lng: 135.7182,
          category: 'culture',
          description: 'The pinnacle of Japanese kare-sansui dry landscape design: 15 mysterious stones arranged on raked white gravel.',
          insiderTip: 'Sit on the wooden veranda and count the rocks; from any angle, at least one rock is hidden from view.',
          costEstimate: '¥600 (~$4)',
          duration: '1.5 hours'
        },
        {
          id: 'k4-3',
          name: 'Nishiki Market Street Food Safari',
          timeOfDay: 'Sunset',
          timeSlot: '14:30 - 17:00',
          lat: 35.0050,
          lng: 135.7649,
          category: 'food',
          description: 'A five-block culinary bazaar operating for over 400 years, packed with skewers, pickled vegetables, and dashi omelets.',
          insiderTip: 'Must-try bites: Tako Tamago (baby octopus stuffed with quail egg) and piping hot soy milk donuts.',
          costEstimate: '¥2,500 (~$17)',
          duration: '2.5 hours'
        },
        {
          id: 'k4-4',
          name: 'Kyoto Tower Observation Deck & Craft Beer Farewell',
          timeOfDay: 'Evening',
          timeSlot: '18:30 - 21:00',
          lat: 34.9875,
          lng: 135.7592,
          category: 'sightseeing',
          description: 'Panoramic 360-degree night views over the illuminated Kyoto grid and surrounding mountain rings.',
          insiderTip: 'Head down to the basement food hall (Kyoto Tower Sando) for local craft beers from Kyoto Brewing Co.',
          costEstimate: '¥900 ticket + ¥1,200 beer (~$15)',
          duration: '2.5 hours'
        }
      ]
    }
  ],
  packingList: [
    {
      category: 'Footwear & Clothing',
      items: [
        { id: 'p1', name: 'Slip-on walking sneakers (easy off for temple tatami)', packed: true, reason: 'You will remove shoes at temples 5-10 times daily' },
        { id: 'p2', name: 'Dark, clean socks without holes', packed: true, reason: 'Visible at all traditional shrines and restaurants' },
        { id: 'p3', name: 'Breathable lightweight layers & cardigan', packed: false, reason: 'Morning coolness transitions to afternoon warmth' },
        { id: 'p4', name: 'Modest temple-appropriate attire (covered shoulders)', packed: true, reason: 'Respectful attire at sacred Zen sanctuaries' }
      ]
    },
    {
      category: 'Electronics & Connectivity',
      items: [
        { id: 'p5', name: 'Pocket Wi-Fi or Japan eSIM QR code', packed: true, reason: 'Crucial for navigating bus routes and translation apps' },
        { id: 'p6', name: 'Compact power bank (10,000mAh+)', packed: true, reason: 'Intensive GPS mapping and photo taking burns battery' },
        { id: 'p7', name: 'Type A two-prong plug adapter (100V, ungrounded)', packed: false, reason: 'Standard Japanese outlet standard' }
      ]
    },
    {
      category: 'Money & Travel Essentials',
      items: [
        { id: 'p8', name: 'Physical Japanese Yen cash (¥10,000 - ¥20,000)', packed: true, reason: 'Many shrines, bus fare boxes & street food stalls are cash only' },
        { id: 'p9', name: 'IC Card (Suica/Pasmo/ICOCA on Apple/Google Wallet)', packed: true, reason: 'Tap-and-go convenience for buses, trains & vending machines' },
        { id: 'p10', name: 'Small coin pouch', packed: false, reason: 'Japan uses ¥1, ¥5, ¥10, ¥50, ¥100, and ¥500 coins frequently' },
        { id: 'p11', name: 'Small hand towel / tenugui handkerchief', packed: false, reason: 'Public restrooms rarely have paper hand dryers or towels' }
      ]
    },
    {
      category: 'Health & Weather Protection',
      items: [
        { id: 'p12', name: 'Ultra-compact folding umbrella', packed: false, reason: 'Kyoto weather can shift quickly from hills' },
        { id: 'p13', name: 'Blister protection bandages & foot cooling pads (Kyusoku Jikan)', packed: true, reason: 'Expect 18,000+ daily steps across stone steps' }
      ]
    }
  ],
  localPhrases: [
    {
      id: 'ph1',
      phrase: 'Sumimasen',
      pronunciation: 'soo-mee-mah-SEN',
      english: 'Excuse me / Sorry / Thank you',
      context: 'Essential Swiss army knife phrase: calling waitstaff, apologizing, or getting past someone.'
    },
    {
      id: 'ph2',
      phrase: 'Arigatou gozaimasu',
      pronunciation: 'ah-ree-gah-TOH go-zeye-moss',
      english: 'Thank you very much (polite)',
      context: 'Use when receiving food, paying, or after assistance.'
    },
    {
      id: 'ph3',
      phrase: 'Kore o kudasai',
      pronunciation: 'KOH-reh oh koo-dah-seye',
      english: 'This one, please',
      context: 'Point to any menu item or market snack to order with confidence.'
    },
    {
      id: 'ph4',
      phrase: 'O-kaikei o onegaishimasu',
      pronunciation: 'oh-kye-kay oh oh-nay-guy-she-moss',
      english: 'Check/bill, please',
      context: 'Say this to request the bill at restaurants and izakayas.'
    },
    {
      id: 'ph5',
      phrase: 'Oishii desu!',
      pronunciation: 'oy-SHEE dess',
      english: 'It is delicious!',
      context: 'Delights chefs and street food vendors.'
    },
    {
      id: 'ph6',
      phrase: 'Toire wa doko desu ka?',
      pronunciation: 'toy-reh wah DOH-koh dess kah?',
      english: 'Where is the restroom?',
      context: 'Handy in train stations, large temples, and shopping malls.'
    }
  ],
  practicalTips: [
    {
      category: 'Transit',
      title: 'Master the Kyoto Bus & Subway Combo',
      description: 'While Tokyo relies on subways, Kyoto is a bus-first city. Use Google Maps with real-time bus arrival counters. Enter through the rear door and pay at the front upon exit.'
    },
    {
      category: 'Etiquette',
      title: 'Temple Decorum & Quiet Hours',
      description: 'Keep voices down inside temple halls. Never step on the black cloth borders of tatami mats. When taking photos, look out for "No Photography" signs near sacred Buddha statues.'
    },
    {
      category: 'Trash Culture',
      title: 'Bring a Small Trash Bag',
      description: 'Public trash cans are virtually nonexistent on Japanese streets. Locals carry their personal trash until finding a convenience store (7-Eleven/Lawson) or returning to their hotel.'
    },
    {
      category: 'Tipping',
      title: 'Zero Tipping Culture',
      description: 'Tipping is not practiced in Japan and can even cause confusion or embarrassment. Outstanding service is considered the baseline standard.'
    }
  ],
  createdAt: new Date().toISOString()
};

export const QUICK_DESTINATIONS = [
  { name: 'Kyoto, Japan', vibe: 'Cultural & Zen', budget: 'moderate', duration: 4, emoji: '⛩️' },
  { name: 'Amalfi Coast, Italy', vibe: 'Romantic & Scenic', budget: 'luxury', duration: 5, emoji: '🍋' },
  { name: 'Reykjavik, Iceland', vibe: 'Adventure & Nature', budget: 'moderate', duration: 4, emoji: '🌋' },
  { name: 'Oaxaca, Mexico', vibe: 'Foodie & Heritage', budget: 'budget', duration: 5, emoji: '🌮' },
  { name: 'Barcelona, Spain', vibe: 'Architecture & Beach', budget: 'moderate', duration: 4, emoji: '🎨' },
  { name: 'Queenstown, New Zealand', vibe: 'Thrills & Alpine', budget: 'luxury', duration: 5, emoji: '🏔️' },
];
