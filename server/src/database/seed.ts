import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

// Schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  fullName: { type: String, required: true },
  avatar: { type: String },
  googleId: { type: String },
  role: { type: String, enum: ['admin', 'owner', 'user'], default: 'user' },
  phone: { type: String },
  refreshTokens: [String],
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
}, { timestamps: true });

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    city: { type: String, required: true },
    neighborhood: { type: String },
    region: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number],
    },
  },
  capacity: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  price: {
    amount: { type: Number, required: true },
    type: { type: String, enum: ['perPerson', 'fixed', 'hourly'], default: 'perPerson' },
    currency: { type: String, default: 'ILS' },
  },
  features: {
    kosher: { type: Boolean, default: false },
    accessibility: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    accommodation: { type: Boolean, default: false },
    outdoorArea: { type: Boolean, default: false },
    indoorArea: { type: Boolean, default: true },
    djEquipment: { type: Boolean, default: false },
    catering: { type: Boolean, default: false },
    types: [{ type: String, enum: ['hall', 'garden', 'beach', 'restaurant', 'rooftop', 'villa', 'hotel', 'other'] }],
  },
  gallery: [String],
  mainImage: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  contactEmail: { type: String },
  contactPhone: { type: String },
  website: { type: String },
}, { timestamps: true });

const leadSchema = new mongoose.Schema({
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  phone: { type: String, required: true },
  eventDate: { type: Date, required: true },
  guestsCount: { type: Number, required: true },
  eventType: { 
    type: String, 
    enum: ['wedding', 'barMitzvah', 'batMitzvah', 'birthday', 'corporate', 'engagement', 'anniversary', 'other'],
    default: 'other'
  },
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'negotiating', 'confirmed', 'cancelled', 'completed'],
    default: 'new'
  },
  message: String,
  budget: String,
  preferredSlot: String,
  internalNotes: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastContactDate: Date,
  emailSent: { type: Boolean, default: false },
}, { timestamps: true });

const availabilitySchema = new mongoose.Schema({
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
  date: { type: Date, required: true },
  isAvailable: { type: Boolean, default: true },
  slot: { 
    type: String, 
    enum: ['morning', 'evening', 'fullDay'],
    required: true 
  },
  specialPrice: Number,
  notes: String,
  bookingRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
}, { timestamps: true });

// Create indexes
availabilitySchema.index({ venueId: 1, date: 1, slot: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
const Venue = mongoose.model('Venue', venueSchema);
const Lead = mongoose.model('Lead', leadSchema);
const Availability = mongoose.model('Availability', availabilitySchema);

// USER CREDENTIALS - SAVE THIS!
const USERS = [
  {
    email: 'admin@eventfinder.com',
    password: 'Admin123!',
    fullName: 'מנהל המערכת',
    role: 'admin',
    phone: '050-1111111',
  },
  {
    email: 'david@heichal.com',
    password: 'Owner123!',
    fullName: 'דוד כהן',
    role: 'owner',
    phone: '052-2222222',
  },
  {
    email: 'sarah@gan.com',
    password: 'Owner123!',
    fullName: 'שרה לוי',
    role: 'owner',
    phone: '054-3333333',
  },
  {
    email: 'moshe@malka.com',
    password: 'Owner123!',
    fullName: 'משה אבוטבול',
    role: 'owner',
    phone: '053-4444444',
  },
  {
    email: 'user@example.com',
    password: 'User123!',
    fullName: 'יעקב ישראלי',
    role: 'user',
    phone: '050-5555555',
  },
];

// Venue images
const venueImages = {
  hall: [
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
  ],
  garden: [
    'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800',
    'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800',
    'https://images.unsplash.com/photo-1529543544277-82f4307d4dc0?w=800',
  ],
  beach: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    'https://images.unsplash.com/photo-1520942702018-0862200e6873?w=800',
  ],
  villa: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  ],
  rooftop: [
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800',
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800',
  ],
};

// Helper functions
function getRandomFutureDate(minDays = 30, maxDays = 365) {
  const today = new Date();
  const randomDays = Math.floor(Math.random() * (maxDays - minDays)) + minDays;
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + randomDays);
  return futureDate;
}

function getRandomPastDate(maxDaysAgo = 30) {
  const today = new Date();
  const randomDays = Math.floor(Math.random() * maxDaysAgo);
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - randomDays);
  return pastDate;
}

// Customer data
const customers = [
  { name: 'דוד כהן', email: 'david.cohen@example.com', phone: '050-1234567' },
  { name: 'שרה לוי', email: 'sarah.levi@example.com', phone: '052-9876543' },
  { name: 'יוסף מזרחי', email: 'yosef.m@example.com', phone: '054-1112233' },
  { name: 'רחל אברהם', email: 'rachel.a@example.com', phone: '053-4445566' },
  { name: 'משה ישראלי', email: 'moshe.i@example.com', phone: '050-7778899' },
  { name: 'תמר אהרון', email: 'tamar.a@example.com', phone: '052-3334455' },
  { name: 'אבי דוד', email: 'avi.d@example.com', phone: '054-6667788' },
  { name: 'נועה שמעון', email: 'noa.s@example.com', phone: '053-9990011' },
  { name: 'אריאל בן דוד', email: 'ariel.bd@example.com', phone: '050-2223344' },
  { name: 'מיכל הרוש', email: 'michal.h@example.com', phone: '052-5556677' },
];

const eventTypes = ['wedding', 'barMitzvah', 'batMitzvah', 'birthday', 'corporate', 'engagement', 'anniversary'];
const leadStatuses = ['new', 'contacted', 'negotiating', 'confirmed'];
const messages = [
  'מעוניינים לקבל פרטים נוספים על האולם',
  'האם יש אפשרות לסיור באולם?',
  'רוצים לדעת על חבילות מיוחדות',
  'מעוניינים בתאריכים אלטרנטיביים',
  'האם כולל קייטרינג?',
  'מחפשים אולם כשר למהדרין',
  'מעוניינים לקבוע פגישה',
  'רוצים לדעת על אפשרויות תשלום',
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/event-finder';
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // CLEAR ALL COLLECTIONS
    console.log('🗑️  Clearing all collections...');
    await User.deleteMany({});
    await Venue.deleteMany({});
    await Lead.deleteMany({});
    await Availability.deleteMany({});
    console.log('✅ All collections cleared');

    // CREATE USERS
    console.log('👥 Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const usersToInsert = await Promise.all(
      USERS.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
        isActive: true,
      }))
    );
    
    const insertedUsers = await User.insertMany(usersToInsert);
    console.log(`✅ Created ${insertedUsers.length} users`);

    // Get venue owners
    const owners = insertedUsers.filter(u => u.role === 'owner');

    // CREATE VENUES
    console.log('🏛️  Creating venues...');
    const venues = [
      {
        name: 'היכל האירועים הגדול',
        description: 'אולם אירועים מפואר בלב תל אביב, מושלם לחתונות וארועים גדולים. האולם כולל תאורה מרהיבה, מערכת סאונד מקצועית, וצוות שירות מסור.',
        location: {
          city: 'תל אביב',
          neighborhood: 'רמת החייל',
          region: 'מרכז',
          address: 'רחוב הברזל 15',
          coordinates: { type: 'Point', coordinates: [34.8113, 32.1133] },
        },
        capacity: { min: 150, max: 500 },
        price: { amount: 250, type: 'perPerson', currency: 'ILS' },
        features: {
          kosher: true,
          accessibility: true,
          parking: true,
          accommodation: false,
          outdoorArea: true,
          indoorArea: true,
          djEquipment: true,
          catering: true,
          types: ['hall'],
        },
        gallery: venueImages.hall,
        mainImage: venueImages.hall[0],
        owner: owners[0]._id,
        rating: 4.8,
        reviewCount: 127,
        isFeatured: true,
        contactEmail: 'events@heichal-hagadol.co.il',
        contactPhone: '03-5551234',
      },
      {
        name: 'גן האירועים הנצחי',
        description: 'גן אירועים קסום בפתח תקווה עם נוף ירוק מרהיב. מקום אידיאלי לחתונות בטבע עם גג נשלף לכל מזג אויר.',
        location: {
          city: 'פתח תקווה',
          neighborhood: 'קריית אריה',
          region: 'מרכז',
          address: 'דרך הפרחים 42',
          coordinates: { type: 'Point', coordinates: [34.8674, 32.0922] },
        },
        capacity: { min: 100, max: 350 },
        price: { amount: 150, type: 'perPerson', currency: 'ILS' },
        features: {
          kosher: true,
          accessibility: true,
          parking: true,
          accommodation: false,
          outdoorArea: true,
          indoorArea: true,
          djEquipment: false,
          catering: true,
          types: ['garden'],
        },
        gallery: venueImages.garden,
        mainImage: venueImages.garden[0],
        owner: owners[1]._id,
        rating: 4.6,
        reviewCount: 89,
        isFeatured: true,
        contactEmail: 'info@gan-nitzchi.co.il',
        contactPhone: '03-9331234',
      },
      {
        name: 'היכל המלכה',
        description: 'אולם יוקרתי בסגנון קלאסי בתל אביב. עיצוב פנים מרהיב עם נברשות קריסטל, רצפות שיש, ותקרות גבוהות.',
        location: {
          city: 'תל אביב',
          neighborhood: 'צפון תל אביב',
          region: 'מרכז',
          address: 'שדרות רוטשילד 88',
          coordinates: { type: 'Point', coordinates: [34.7722, 32.0636] },
        },
        capacity: { min: 200, max: 600 },
        price: { amount: 180, type: 'perPerson', currency: 'ILS' },
        features: {
          kosher: false,
          accessibility: true,
          parking: true,
          accommodation: false,
          outdoorArea: false,
          indoorArea: true,
          djEquipment: true,
          catering: true,
          types: ['hall'],
        },
        gallery: venueImages.hall,
        mainImage: venueImages.hall[1],
        owner: owners[2]._id,
        rating: 4.7,
        reviewCount: 156,
        isFeatured: true,
        contactEmail: 'info@heichal-hamalka.co.il',
        contactPhone: '03-5234567',
      },
      {
        name: 'וילה בשכונה',
        description: 'וילה אינטימית בהרצליה פיתוח, מושלמת לאירועים קטנים ומיוחדים. כוללת גינה מטופחת, בריכה, וחללים פנימיים מעוצבים.',
        location: {
          city: 'הרצליה',
          neighborhood: 'הרצליה פיתוח',
          region: 'השרון',
          address: 'רחוב הגפן 12',
          coordinates: { type: 'Point', coordinates: [34.7962, 32.1614] },
        },
        capacity: { min: 30, max: 120 },
        price: { amount: 135, type: 'perPerson', currency: 'ILS' },
        features: {
          kosher: false,
          accessibility: true,
          parking: true,
          accommodation: true,
          outdoorArea: true,
          indoorArea: true,
          djEquipment: false,
          catering: false,
          types: ['villa'],
        },
        gallery: venueImages.villa,
        mainImage: venueImages.villa[0],
        owner: owners[0]._id,
        rating: 4.9,
        reviewCount: 45,
        isFeatured: true,
        contactEmail: 'villa@shchuna.co.il',
        contactPhone: '09-9541234',
      },
      {
        name: 'אחוזת הספיר',
        description: 'אחוזה מפוארת בראשון לציון עם נוף פנורמי. משלבת אלגנטיות קלאסית עם נוחות מודרנית.',
        location: {
          city: 'ראשון לציון',
          neighborhood: 'נחלת יהודה',
          region: 'מרכז',
          address: 'רחוב הספיר 5',
          coordinates: { type: 'Point', coordinates: [34.7525, 31.9646] },
        },
        capacity: { min: 80, max: 300 },
        price: { amount: 120, type: 'perPerson', currency: 'ILS' },
        features: {
          kosher: true,
          accessibility: true,
          parking: true,
          accommodation: false,
          outdoorArea: true,
          indoorArea: true,
          djEquipment: true,
          catering: true,
          types: ['hall', 'garden'],
        },
        gallery: [...venueImages.hall, ...venueImages.garden],
        mainImage: venueImages.hall[2],
        owner: owners[1]._id,
        rating: 4.5,
        reviewCount: 78,
        isFeatured: true,
        contactEmail: 'events@sapir-estate.co.il',
        contactPhone: '03-9671234',
      },
      {
        name: 'קלאב הים',
        description: 'מועדון על חוף הים בנתניה עם נוף מרהיב לים התיכון. אידיאלי לאירועי שקיעה ומסיבות חוף.',
        location: {
          city: 'נתניה',
          neighborhood: 'חוף הים',
          region: 'השרון',
          address: 'טיילת נתניה 1',
          coordinates: { type: 'Point', coordinates: [34.8516, 32.3286] },
        },
        capacity: { min: 50, max: 200 },
        price: { amount: 160, type: 'perPerson', currency: 'ILS' },
        features: {
          kosher: false,
          accessibility: true,
          parking: true,
          accommodation: false,
          outdoorArea: true,
          indoorArea: true,
          djEquipment: true,
          catering: true,
          types: ['beach'],
        },
        gallery: venueImages.beach,
        mainImage: venueImages.beach[0],
        owner: owners[2]._id,
        rating: 4.4,
        reviewCount: 62,
        isFeatured: false,
        contactEmail: 'info@sea-club.co.il',
        contactPhone: '09-8821234',
      },
    ];

    const insertedVenues = await Venue.insertMany(venues);
    console.log(`✅ Created ${insertedVenues.length} venues`);

    // CREATE LEADS
    console.log('📝 Creating leads...');
    const leads = [];
    
    for (const venue of insertedVenues) {
      const numLeads = Math.floor(Math.random() * 4) + 2; // 2-5 leads per venue
      
      for (let i = 0; i < numLeads; i++) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const eventDate = getRandomFutureDate();
        const status = leadStatuses[Math.floor(Math.random() * leadStatuses.length)];
        
        leads.push({
          venueId: venue._id,
          customerName: customer.name,
          customerEmail: customer.email,
          phone: customer.phone,
          eventDate,
          guestsCount: Math.floor(Math.random() * 400) + 50,
          eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          status,
          message: messages[Math.floor(Math.random() * messages.length)],
          budget: `₪${Math.floor(Math.random() * 200000) + 50000}`,
          preferredSlot: ['morning', 'evening', 'fullDay'][Math.floor(Math.random() * 3)],
          emailSent: Math.random() > 0.3,
          lastContactDate: status !== 'new' ? getRandomPastDate() : null,
          internalNotes: status === 'confirmed' ? 'אושר - נשלח חוזה' : 
                        status === 'negotiating' ? 'מחכים להחלטה סופית' : 
                        status === 'contacted' ? 'שוחחנו, מעוניינים לשמוע עוד' : '',
        });
      }
    }

    const insertedLeads = await Lead.insertMany(leads);
    console.log(`✅ Created ${insertedLeads.length} leads`);

    // CREATE AVAILABILITY
    console.log('📅 Creating availability records...');
    const availabilities = [];
    
    for (const venue of insertedVenues) {
      const today = new Date();
      const sixMonthsFromNow = new Date(today);
      sixMonthsFromNow.setMonth(today.getMonth() + 6);
      
      const uniqueDates = new Set<string>();
      const numDates = Math.floor(Math.random() * 40) + 30; // 30-70 dates per venue
      let attempts = 0;
      const maxAttempts = numDates * 3;
      
      while (availabilities.filter(a => a.venueId.equals(venue._id)).length < numDates && attempts < maxAttempts) {
        attempts++;
        
        const randomDate = new Date(today.getTime() + Math.random() * (sixMonthsFromNow.getTime() - today.getTime()));
        randomDate.setHours(0, 0, 0, 0);
        
        const slots = ['morning', 'evening', 'fullDay'];
        const slot = slots[Math.floor(Math.random() * slots.length)];
        
        const uniqueKey = `${venue._id}_${randomDate.toISOString()}_${slot}`;
        
        if (uniqueDates.has(uniqueKey)) {
          continue;
        }
        
        uniqueDates.add(uniqueKey);
        
        const isAvailable = Math.random() > 0.3;
        
        availabilities.push({
          venueId: venue._id,
          date: randomDate,
          slot,
          isAvailable,
          notes: isAvailable ? '' : ['אירוע פרטי', 'שמור ללקוח VIP', 'אירוע חברה'][Math.floor(Math.random() * 3)],
          specialPrice: Math.random() > 0.8 ? Math.floor(Math.random() * 500) + 200 : null,
        });
      }
    }

    const insertedAvailabilities = await Availability.insertMany(availabilities);
    console.log(`✅ Created ${insertedAvailabilities.length} availability records`);

    // LINK CONFIRMED LEADS TO AVAILABILITY
    console.log('🔗 Linking confirmed leads to availability...');
    const confirmedLeads = insertedLeads.filter(lead => lead.status === 'confirmed');
    let linkedCount = 0;
    
    for (const lead of confirmedLeads) {
      const leadDate = new Date(lead.eventDate);
      leadDate.setHours(0, 0, 0, 0);
      
      let availability = await Availability.findOne({
        venueId: lead.venueId,
        date: leadDate,
      });
      
      if (!availability) {
        availability = await Availability.create({
          venueId: lead.venueId,
          date: leadDate,
          slot: 'fullDay',
          isAvailable: false,
          bookingRef: lead._id,
          notes: `הוזמן על ידי ${lead.customerName}`,
        });
      } else {
        availability.isAvailable = false;
        availability.bookingRef = lead._id;
        availability.notes = `הוזמן על ידי ${lead.customerName}`;
        await availability.save();
      }
      
      linkedCount++;
    }

    // PRINT SUMMARY
    console.log('\n' + '='.repeat(60));
    console.log('✨ DATABASE SEEDED SUCCESSFULLY!');
    console.log('='.repeat(60));
    
    console.log('\n📊 SUMMARY:');
    console.log(`   • Users: ${insertedUsers.length}`);
    console.log(`   • Venues: ${insertedVenues.length}`);
    console.log(`   • Leads: ${insertedLeads.length}`);
    console.log(`     - New: ${insertedLeads.filter(l => l.status === 'new').length}`);
    console.log(`     - Contacted: ${insertedLeads.filter(l => l.status === 'contacted').length}`);
    console.log(`     - Negotiating: ${insertedLeads.filter(l => l.status === 'negotiating').length}`);
    console.log(`     - Confirmed: ${insertedLeads.filter(l => l.status === 'confirmed').length}`);
    console.log(`   • Availability: ${insertedAvailabilities.length}`);
    console.log(`     - Available: ${insertedAvailabilities.filter(a => a.isAvailable).length}`);
    console.log(`     - Booked: ${insertedAvailabilities.filter(a => !a.isAvailable).length}`);
    console.log(`   • Linked Bookings: ${linkedCount}`);
    
    console.log('\n🔐 LOGIN CREDENTIALS:');
    console.log('='.repeat(60));
    USERS.forEach(user => {
      console.log(`\n${user.role.toUpperCase()}:`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Name: ${user.fullName}`);
    });
    console.log('\n' + '='.repeat(60));
    
    console.log('\n✅ All done! You can now login with any of the above credentials.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
