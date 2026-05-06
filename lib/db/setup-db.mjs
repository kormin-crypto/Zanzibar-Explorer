import pg from "pg";

const { Client } = pg;

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const sql = `
CREATE TABLE IF NOT EXISTS accommodations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  price_per_night REAL NOT NULL,
  image_url TEXT NOT NULL,
  amenities TEXT[] NOT NULL DEFAULT '{}',
  stars INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  duration_hours REAL NOT NULL,
  price_per_person REAL NOT NULL,
  image_url TEXT NOT NULL,
  is_popular BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS packages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  min_days INTEGER NOT NULL,
  max_days INTEGER NOT NULL,
  base_price_per_person_per_day REAL NOT NULL,
  image_url TEXT NOT NULL,
  gallery_images TEXT[] NOT NULL DEFAULT '{}',
  accommodation_id INTEGER NOT NULL,
  highlights TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  rating REAL NOT NULL DEFAULT 4.5,
  review_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS package_activities (
  package_id INTEGER NOT NULL,
  activity_id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  package_id INTEGER,
  number_of_visitors INTEGER NOT NULL,
  number_of_days INTEGER NOT NULL,
  preferred_start_date TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  activity_ids INTEGER[] NOT NULL DEFAULT '{}',
  accommodation_id INTEGER,
  estimated_total REAL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`;

await client.query(sql);
console.log("Tables created.");

// Seed data
const { rows: existingAccommodations } = await client.query("SELECT COUNT(*) FROM accommodations");
if (existingAccommodations[0].count === "0") {
  await client.query(`
    INSERT INTO accommodations (name, type, description, location, price_per_night, image_url, amenities, stars) VALUES
    ('Zanzibar Pearl Boutique Hotel', 'boutique', 'Luxury boutique hotel steps from the beach with traditional Swahili architecture.', 'Nungwi Beach', 280, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', ARRAY['Pool','Spa','Restaurant','WiFi','Beach Access'], 5),
    ('Stone Town Heritage Lodge', 'heritage', 'Restored 19th-century mansion in the heart of Stone Town UNESCO World Heritage Site.', 'Stone Town', 160, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', ARRAY['Rooftop Terrace','Restaurant','WiFi','Bar'], 4),
    ('Kendwa Eco Resort', 'eco-resort', 'Sustainable beachfront resort with solar power and local community partnerships.', 'Kendwa Beach', 195, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', ARRAY['Pool','Beach Bar','Diving Center','WiFi'], 4),
    ('Matemwe Luxury Villas', 'villa', 'Private villas with personal pools and butler service on the quiet northeast coast.', 'Matemwe', 450, 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800', ARRAY['Private Pool','Butler','Chef','WiFi','Beach Access'], 5),
    ('Paje Beach Hostel', 'budget', 'Friendly budget accommodation popular with kitesurfers and backpackers.', 'Paje Beach', 45, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800', ARRAY['WiFi','Shared Kitchen','Surfboard Rental'], 2)
  `);
  console.log("Accommodations seeded.");
}

const { rows: existingActivities } = await client.query("SELECT COUNT(*) FROM activities");
if (existingActivities[0].count === "0") {
  await client.query(`
    INSERT INTO activities (name, description, category, duration_hours, price_per_person, image_url, is_popular) VALUES
    ('Snorkeling at Mnemba Atoll', 'Swim with dolphins and explore vibrant coral reefs at this protected marine reserve.', 'water', 4, 65, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', true),
    ('Spice Farm Tour', 'Explore a working spice plantation and learn about cloves, vanilla, and cinnamon.', 'cultural', 3, 35, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800', true),
    ('Stone Town Walking Tour', 'Discover the labyrinthine alleys, historic mosques, and vibrant markets of UNESCO-listed Stone Town.', 'cultural', 3, 25, 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800', true),
    ('Sunset Dhow Cruise', 'Sail on a traditional wooden dhow while watching the sun set over the Indian Ocean.', 'leisure', 2.5, 55, 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800', true),
    ('Scuba Diving', 'Explore underwater walls and diverse marine life with PADI-certified instructors.', 'water', 5, 95, 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800', false),
    ('Prison Island Visit', 'Visit the giant tortoise sanctuary and colonial ruins on Changuu Island.', 'cultural', 3, 40, 'https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?w=800', false),
    ('Jozani Forest Safari', 'Spot endemic red colobus monkeys in the only national park on Zanzibar.', 'nature', 3, 30, 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800', false),
    ('Deep Sea Fishing', 'Head out into the open ocean to fish for marlin, tuna, and barracuda.', 'water', 6, 120, 'https://images.unsplash.com/photo-1544551763-8dd44758c2dd?w=800', false),
    ('Cooking Class', 'Learn to prepare traditional Zanzibari dishes with aromatic local spices.', 'cultural', 3, 45, 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=800', false),
    ('Kite Surfing Lesson', 'Take a beginner lesson or improve your skills on Paje Beach, one of East Africa best kite spots.', 'water', 3, 80, 'https://images.unsplash.com/photo-1529928520614-7a4f56661a45?w=800', false),
    ('Dolphin Swimming Tour', 'Swim with wild spinner dolphins in the turquoise waters off Kizimkazi.', 'water', 4, 50, 'https://images.unsplash.com/photo-1540202404-a2f29d3f9a90?w=800', true),
    ('Night Market Food Tour', 'Sample street food at Forodhani Gardens night market — urojo soup, Zanzibar pizza, and more.', 'cultural', 2, 20, 'https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=800', false)
  `);
  console.log("Activities seeded.");
}

const { rows: existingPackages } = await client.query("SELECT COUNT(*) FROM packages");
if (existingPackages[0].count === "0") {
  await client.query(`
    INSERT INTO packages (name, slug, tagline, description, category, min_days, max_days, base_price_per_person_per_day, image_url, gallery_images, accommodation_id, highlights, is_featured, rating, review_count) VALUES
    ('Beach Paradise Escape', 'beach-paradise', 'Sun, sand and turquoise waters', 'Immerse yourself in Zanzibar''s legendary beaches with luxury beachfront accommodation, water sports, and sunset dhow cruises.', 'beach', 5, 10, 120, 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800', ARRAY['https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800','https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800'], 1, ARRAY['Beachfront luxury accommodation','Daily snorkeling excursions','Sunset dhow cruise included','Fresh seafood dining'], true, 4.8, 124),
    ('Cultural Heritage Journey', 'cultural-heritage', 'Discover the soul of Zanzibar', 'Walk through centuries of history in Stone Town, visit spice farms, and connect with the vibrant local culture.', 'cultural', 4, 7, 95, 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=800', ARRAY['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800','https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?w=800'], 2, ARRAY['UNESCO Stone Town guided tour','Spice farm experience','Prison Island visit','Traditional cooking class'], true, 4.7, 89),
    ('Adventure Seekers Package', 'adventure-seekers', 'Thrill and discovery awaits', 'From deep sea fishing to scuba diving and kite surfing, this action-packed package is for those who crave excitement.', 'adventure', 6, 12, 150, 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800', ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800','https://images.unsplash.com/photo-1529928520614-7a4f56661a45?w=800'], 3, ARRAY['PADI scuba diving certification option','Deep sea fishing expedition','Kite surfing lessons','Jozani Forest red colobus monkey safari'], true, 4.6, 67),
    ('Luxury Honeymoon Retreat', 'luxury-honeymoon', 'Romance in paradise', 'An intimate and exclusive escape for couples with private villa, personal butler, and curated romantic experiences.', 'luxury', 7, 14, 250, 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800', ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800','https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800'], 4, ARRAY['Private villa with infinity pool','Personal butler service','Couples spa treatment','Romantic dhow sunset dinner'], false, 4.9, 43),
    ('Family Fun Adventure', 'family-fun', 'Memories for the whole family', 'A perfectly balanced holiday with kid-friendly activities, safe beaches, and educational cultural experiences for all ages.', 'family', 7, 10, 110, 'https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?w=800', ARRAY['https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800','https://images.unsplash.com/photo-1540202404-a2f29d3f9a90?w=800'], 1, ARRAY['Giant tortoise sanctuary visit','Dolphin swimming tour','Jozani Forest monkey safari','Family snorkeling at Mnemba Atoll'], false, 4.7, 56)
  `);

  await client.query(`
    INSERT INTO package_activities (package_id, activity_id) VALUES
    (1, 1), (1, 4), (1, 8),
    (2, 2), (2, 3), (2, 6), (2, 9),
    (3, 5), (3, 7), (3, 8), (3, 10),
    (4, 4), (4, 1), (4, 5),
    (5, 6), (5, 7), (5, 11), (5, 1)
  `);
  console.log("Packages and activities seeded.");
}

await client.end();
console.log("Done.");
