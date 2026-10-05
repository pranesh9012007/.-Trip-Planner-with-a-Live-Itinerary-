import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Trip Schema for Gemini JSON mode
const tripSchema = {
  type: Type.OBJECT,
  properties: {
    destination: { type: Type.STRING },
    tagline: { type: Type.STRING },
    overview: { type: Type.STRING },
    country: { type: Type.STRING },
    currency: { type: Type.STRING },
    bestSeason: { type: Type.STRING },
    budgetLevel: { type: Type.STRING },
    vibe: { type: Type.STRING },
    coordinates: {
      type: Type.OBJECT,
      properties: {
        lat: { type: Type.NUMBER, description: 'Latitude coordinate of the destination center' },
        lng: { type: Type.NUMBER, description: 'Longitude coordinate of the destination center' },
        zoom: { type: Type.INTEGER, description: 'Recommended map zoom level, typically 12-14' }
      },
      required: ['lat', 'lng', 'zoom']
    },
    budgetBreakdown: {
      type: Type.OBJECT,
      properties: {
        totalEstimated: { type: Type.STRING },
        accommodation: { type: Type.STRING },
        foodAndDrinks: { type: Type.STRING },
        activities: { type: Type.STRING },
        transport: { type: Type.STRING }
      },
      required: ['totalEstimated', 'accommodation', 'foodAndDrinks', 'activities', 'transport']
    },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayNumber: { type: Type.INTEGER },
          title: { type: Type.STRING },
          theme: { type: Type.STRING },
          estimatedDailyCost: { type: Type.STRING },
          weatherTip: { type: Type.STRING },
          places: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                timeOfDay: { type: Type.STRING, description: 'Morning, Afternoon, Sunset, or Evening' },
                timeSlot: { type: Type.STRING, description: 'e.g. 09:00 - 11:30' },
                lat: { type: Type.NUMBER, description: 'Real approximate latitude GPS coordinate' },
                lng: { type: Type.NUMBER, description: 'Real approximate longitude GPS coordinate' },
                category: { type: Type.STRING, description: 'sightseeing, food, culture, nature, nightlife, or activity' },
                description: { type: Type.STRING },
                insiderTip: { type: Type.STRING },
                costEstimate: { type: Type.STRING },
                duration: { type: Type.STRING }
              },
              required: ['id', 'name', 'timeOfDay', 'timeSlot', 'lat', 'lng', 'category', 'description', 'insiderTip', 'costEstimate', 'duration']
            }
          }
        },
        required: ['dayNumber', 'title', 'theme', 'estimatedDailyCost', 'weatherTip', 'places']
      }
    },
    packingList: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                packed: { type: Type.BOOLEAN },
                reason: { type: Type.STRING }
              },
              required: ['id', 'name', 'packed']
            }
          }
        },
        required: ['category', 'items']
      }
    },
    localPhrases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          phrase: { type: Type.STRING },
          pronunciation: { type: Type.STRING },
          english: { type: Type.STRING },
          context: { type: Type.STRING }
        },
        required: ['id', 'phrase', 'pronunciation', 'english', 'context']
      }
    },
    practicalTips: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ['category', 'title', 'description']
      }
    }
  },
  required: ['destination', 'tagline', 'overview', 'country', 'currency', 'bestSeason', 'budgetLevel', 'vibe', 'coordinates', 'budgetBreakdown', 'days', 'packingList', 'localPhrases', 'practicalTips']
};

// Single Day Schema for Iterative Day Regeneration
const singleDaySchema = {
  type: Type.OBJECT,
  properties: {
    dayNumber: { type: Type.INTEGER },
    title: { type: Type.STRING },
    theme: { type: Type.STRING },
    estimatedDailyCost: { type: Type.STRING },
    weatherTip: { type: Type.STRING },
    places: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          timeOfDay: { type: Type.STRING },
          timeSlot: { type: Type.STRING },
          lat: { type: Type.NUMBER },
          lng: { type: Type.NUMBER },
          category: { type: Type.STRING },
          description: { type: Type.STRING },
          insiderTip: { type: Type.STRING },
          costEstimate: { type: Type.STRING },
          duration: { type: Type.STRING }
        },
        required: ['id', 'name', 'timeOfDay', 'timeSlot', 'lat', 'lng', 'category', 'description', 'insiderTip', 'costEstimate', 'duration']
      }
    }
  },
  required: ['dayNumber', 'title', 'theme', 'estimatedDailyCost', 'weatherTip', 'places']
};

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY
  });
});

// Generate Full Trip
app.post('/api/trip/generate', async (req: Request, res: Response) => {
  try {
    const { destination, durationDays = 4, budget = 'moderate', vibe = 'cultural', preferences = '' } = req.body;

    if (!destination || typeof destination !== 'string') {
      res.status(400).json({ error: 'Destination is required' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check the Secrets settings.'
      });
      return;
    }

    const safeDuration = Math.min(Math.max(Number(durationDays) || 4, 1), 7);

    const prompt = `
Plan a comprehensive, captivating ${safeDuration}-day travel itinerary for "${destination}".
Budget Level: ${budget} (budget = backpacker/frugal, moderate = balanced boutique/curated, luxury = top-tier/high-end).
Primary Vibe & Style: ${vibe}.
Additional Preferences or Notes: ${preferences || 'None specified'}.

Requirements:
1. Provide accurate real-world latitude and longitude coordinates for every landmark/place so they map accurately on a Leaflet map.
2. Group each day's places into geographically clustered stops (Morning, Afternoon, Sunset, Evening) to minimize unnecessary transit.
3. Include practical insider tips (e.g. secret view spots, skip-the-line advice, booking timing).
4. Provide a customized packing checklist (4-5 key categories with 3-4 specific items each, including destination-specific essentials like adapter types, cultural attire, weather prep).
5. Provide 6-8 essential local phrases in the native language, with phonetic pronunciation, English translation, and context.
6. Provide essential practical local tips (transit cards, etiquette, tipping, safety).
Return strictly JSON matching the response schema.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an award-winning travel curator and cartography expert. Create realistic, engaging, and geographically coherent travel itineraries with real coordinates, insightful local secrets, and cultural etiquette.',
        responseMimeType: 'application/json',
        responseSchema: tripSchema,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini did not return text content.');
    }

    const tripData = JSON.parse(text);
    tripData.id = `trip-${Date.now()}`;
    tripData.createdAt = new Date().toISOString();

    res.json(tripData);
  } catch (error: any) {
    console.error('Error generating trip itinerary:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate itinerary. Please try again.'
    });
  }
});

// Iterative Prompting: Regenerate a Specific Day
app.post('/api/trip/regenerate-day', async (req: Request, res: Response) => {
  try {
    const {
      destination,
      budget,
      vibe,
      dayNumber,
      currentDay,
      otherDaysTitles = [],
      userDirective = ''
    } = req.body;

    if (!destination || dayNumber === undefined) {
      res.status(400).json({ error: 'Destination and dayNumber are required' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server.'
      });
      return;
    }

    const prompt = `
ITERATIVE RE-PROMPTING TASK:
The user is planning a trip to "${destination}" (Budget: ${budget}, Overall Vibe: ${vibe}).
They want to REGENERATE Day ${dayNumber} specifically.

Previous Day ${dayNumber} was: "${currentDay?.title || 'Unknown'}" with theme "${currentDay?.theme || ''}".
Places previously visited on other days of the trip include: ${JSON.stringify(otherDaysTitles)}.

Traveler's Iterative Request / Directive for this day:
"${userDirective || 'Generate a fresh, exciting alternative day with completely different hidden gems, scenic stops, and unique culinary highlights that still fit the destination beautifully.'}"

Requirements:
1. Regenerate Day ${dayNumber} with 3 to 4 sequential, geographically clustered stops (Morning, Afternoon, Sunset, Evening).
2. Ensure realistic GPS latitude and longitude coordinates for map plotting.
3. Follow the traveler's directive closely (e.g. if they asked for foodie, rainy day alternatives, relaxation, or adventure).
4. Do NOT duplicate major attractions already covered on other days.
Return strictly a single DayPlan object matching the response schema.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an adaptive travel itinerary designer. You specialize in iterative modifications, adjusting day plans to traveler feedback while keeping geographic coherence.',
        responseMimeType: 'application/json',
        responseSchema: singleDaySchema,
        temperature: 0.8,
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Gemini did not return content for day regeneration.');
    }

    const updatedDay = JSON.parse(text);
    updatedDay.dayNumber = Number(dayNumber);
    // Ensure all places have unique IDs
    if (Array.isArray(updatedDay.places)) {
      updatedDay.places = updatedDay.places.map((place: any, index: number) => ({
        ...place,
        id: `regen-d${dayNumber}-${Date.now()}-${index}`
      }));
    }

    res.json(updatedDay);
  } catch (error: any) {
    console.error('Error regenerating day:', error);
    res.status(500).json({
      error: error.message || 'Failed to regenerate day. Please try again.'
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`VoyageCraft server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
