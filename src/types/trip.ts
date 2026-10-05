export type BudgetTier = 'budget' | 'moderate' | 'luxury';

export type TravelVibe = 
  | 'cultural' 
  | 'foodie' 
  | 'adventure' 
  | 'relaxed' 
  | 'nightlife' 
  | 'hidden-gems'
  | 'romantic';

export interface Place {
  id: string;
  name: string;
  timeOfDay: 'Morning' | 'Afternoon' | 'Sunset' | 'Evening';
  timeSlot: string;
  lat: number;
  lng: number;
  category: 'sightseeing' | 'food' | 'culture' | 'nature' | 'nightlife' | 'activity';
  description: string;
  insiderTip: string;
  costEstimate: string;
  duration: string;
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  theme: string;
  estimatedDailyCost: string;
  weatherTip: string;
  places: Place[];
}

export interface PackingItem {
  id: string;
  name: string;
  packed: boolean;
  reason?: string;
}

export interface PackingCategory {
  category: string;
  items: PackingItem[];
}

export interface LocalPhrase {
  id: string;
  phrase: string;
  pronunciation: string;
  english: string;
  context: string;
}

export interface PracticalTip {
  category: string;
  title: string;
  description: string;
}

export interface TripPlan {
  id: string;
  destination: string;
  tagline: string;
  overview: string;
  country: string;
  currency: string;
  bestSeason: string;
  budgetLevel: string;
  vibe: string;
  coordinates: {
    lat: number;
    lng: number;
    zoom: number;
  };
  budgetBreakdown: {
    totalEstimated: string;
    accommodation: string;
    foodAndDrinks: string;
    activities: string;
    transport: string;
  };
  days: DayPlan[];
  packingList: PackingCategory[];
  localPhrases: LocalPhrase[];
  practicalTips: PracticalTip[];
  createdAt: string;
}

export interface GenerateTripParams {
  destination: string;
  durationDays: number;
  budget: BudgetTier;
  vibe: string;
  preferences?: string;
}

export interface RegenerateDayParams {
  destination: string;
  budget: string;
  vibe: string;
  dayNumber: number;
  currentDay: DayPlan;
  otherDaysTitles: string[];
  userDirective?: string;
}
