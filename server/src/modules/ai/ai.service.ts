import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { VenuesService } from '../venues/venues.service';
import { VenueDocument } from '../venues/schemas/venue.schema';

interface ParsedFilters {
  city?: string;
  region?: string;
  minCapacity?: number;
  maxCapacity?: number;
  minPrice?: number;
  maxPrice?: number;
  kosher?: boolean;
  accessibility?: boolean;
  types?: string[];
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI | null = null;

  constructor(
    private configService: ConfigService,
    private venuesService: VenuesService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'your-openai-api-key') {
      this.openai = new OpenAI({ apiKey });
      this.logger.log('OpenAI service configured');
    } else {
      this.logger.warn('OpenAI API key not configured - using fallback parser');
    }
  }

  async searchByNaturalLanguage(query: string): Promise<VenueDocument[]> {
    const filters = await this.parseQuery(query);
    this.logger.log(`Parsed filters: ${JSON.stringify(filters)}`);
    return this.venuesService.searchByFilters(filters as unknown as Record<string, unknown>);
  }

  private async parseQuery(query: string): Promise<ParsedFilters> {
    if (this.openai) {
      return this.parseWithOpenAI(query);
    }
    return this.parseWithRegex(query);
  }

  private async parseWithOpenAI(query: string): Promise<ParsedFilters> {
    try {
      const systemPrompt = `You are a query parser for an Israeli event venue booking system.
Parse the user's natural language query into structured filters.
Return a JSON object with these optional fields:
- city: string (Israeli city in Hebrew, e.g., "תל אביב", "ירושלים", "חיפה")
- region: string (Israeli region: "צפון", "דרום", "מרכז", "ירושלים והסביבה", "השפלה")
- minCapacity: number (minimum guests)
- maxCapacity: number (maximum guests)
- minPrice: number (minimum price per person in ILS)
- maxPrice: number (maximum price per person in ILS)
- kosher: boolean (true if kosher required)
- accessibility: boolean (true if wheelchair access required)
- types: array of strings (venue types: "hall", "garden", "beach", "restaurant", "rooftop", "villa", "hotel")

Examples:
- "אולם כשר ל-200 איש בירושלים מתחת ל-40 אלף" → {"city": "ירושלים", "maxCapacity": 200, "maxPrice": 200, "kosher": true, "types": ["hall"]}
- "גן אירועים בצפון עד 150 אורחים" → {"region": "צפון", "maxCapacity": 150, "types": ["garden"]}

Return only valid JSON, no explanations.`;

      const response = await this.openai!.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query },
        ],
        temperature: 0.1,
        max_tokens: 200,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return JSON.parse(content);
      }
    } catch (error) {
      this.logger.error('OpenAI parsing failed, falling back to regex:', error);
    }

    return this.parseWithRegex(query);
  }

  private parseWithRegex(query: string): ParsedFilters {
    const filters: ParsedFilters = {};
    const queryLower = query.toLowerCase();

    // City detection
    const cities = [
      'תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'נתניה', 'אשדוד', 'ראשון לציון',
      'פתח תקווה', 'הרצליה', 'רמת גן', 'בני ברק', 'רעננה', 'כפר סבא', 'הוד השרון',
      'רחובות', 'אילת', 'טבריה', 'עכו', 'נהריה', 'קריית שמונה'
    ];
    for (const city of cities) {
      if (query.includes(city)) {
        filters.city = city;
        break;
      }
    }

    // Region detection
    const regions: Record<string, string> = {
      'צפון': 'צפון',
      'דרום': 'דרום',
      'מרכז': 'מרכז',
      'שפלה': 'השפלה',
      'השפלה': 'השפלה',
      'השרון': 'השרון',
    };
    for (const [key, value] of Object.entries(regions)) {
      if (query.includes(key)) {
        filters.region = value;
        break;
      }
    }

    // Capacity detection
    const capacityMatch = query.match(/(\d+)\s*(אורחים|איש|אנשים|מוזמנים)/);
    if (capacityMatch) {
      const num = parseInt(capacityMatch[1]);
      if (query.includes('עד') || query.includes('מקסימום')) {
        filters.maxCapacity = num;
      } else if (query.includes('לפחות') || query.includes('מינימום')) {
        filters.minCapacity = num;
      } else {
        filters.maxCapacity = num;
        filters.minCapacity = Math.floor(num * 0.7);
      }
    }

    // Price detection (in thousands or per person)
    const priceMatch = query.match(/(\d+)\s*(אלף|ש"ח|שקל)/);
    if (priceMatch) {
      let price = parseInt(priceMatch[1]);
      if (query.includes('אלף') || price < 1000) {
        price = price < 1000 ? price * 1000 : price;
        // Assuming average 150 guests, convert to per-person
        const perPerson = Math.round(price / 150);
        if (query.includes('מתחת') || query.includes('עד') || query.includes('פחות')) {
          filters.maxPrice = perPerson;
        } else {
          filters.minPrice = perPerson;
        }
      }
    }

    // Kosher detection
    if (query.includes('כשר') || query.includes('כשרות')) {
      filters.kosher = true;
    }

    // Accessibility detection
    if (query.includes('נגיש') || query.includes('נגישות') || query.includes('כסא גלגלים')) {
      filters.accessibility = true;
    }

    // Venue type detection
    const typeMap: Record<string, string> = {
      'אולם': 'hall',
      'גן אירועים': 'garden',
      'גן': 'garden',
      'חוף': 'beach',
      'ים': 'beach',
      'מסעדה': 'restaurant',
      'גג': 'rooftop',
      'וילה': 'villa',
      'מלון': 'hotel',
    };

    const types: string[] = [];
    for (const [key, value] of Object.entries(typeMap)) {
      if (query.includes(key)) {
        types.push(value);
      }
    }
    if (types.length > 0) {
      filters.types = types;
    }

    return filters;
  }
}
