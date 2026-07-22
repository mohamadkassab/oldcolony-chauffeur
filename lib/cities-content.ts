// Data for the /car-service/[city] local-SEO landing pages. Each town carries
// genuinely local facts (Logan drive time, recognizable pickup spots, a unique
// intro) so the pages read as real local content, not doorway templates.
//
// The Old Colony corridor: the 10 towns south and west of Boston where we
// publish flat rates. Trips beyond the corridor are quoted by phone.

export interface CityPage {
  slug: string;
  name: string;
  state: 'MA' | 'RI';
  /** Approximate driving distance to Logan Airport in miles. */
  loganMiles: number;
  /** Typical drive-time range to Logan, e.g. '15–25'. */
  loganMinutes: string;
  /** Published one-way flat rate to/from Logan — sedan (USD, tolls included). */
  sedanRate: number;
  /** Published one-way flat rate to/from Logan — SUV (USD, tolls included). */
  suvRate: number;
  /** Unique English intro — 2–3 sentences, town-specific. */
  blurb: string;
  /** Recognizable local pickup spots. */
  landmarks: string[];
}

export const CITY_PAGES: CityPage[] = [
  {
    slug: 'canton',
    name: 'Canton',
    state: 'MA',
    loganMiles: 18,
    loganMinutes: '25–35',
    sedanRate: 95,
    suvRate: 120,
    blurb: 'Canton is home turf for Old Colony Chauffeur, which means Canton pickups get the fastest response times anywhere in our service area. Early-morning Logan runs from Canton Center or the Route 138 corridor are our bread and butter — a flat $95 by sedan, confirmed in writing before the car moves.',
    landmarks: ['Canton Center', 'Canton Junction station', 'Blue Hills Reservation', 'Village Shoppes of Canton'],
  },
  {
    slug: 'dedham',
    name: 'Dedham',
    state: 'MA',
    loganMiles: 14,
    loganMinutes: '20–30',
    sedanRate: 85,
    suvRate: 110,
    blurb: 'Dedham is one of our busiest pickup areas — our chauffeurs are based minutes away, so cars are rarely far. From Legacy Place to Dedham Square, we run daily flat-rate transfers to Logan at $85 by sedan, plus point-to-point rides into downtown Boston.',
    landmarks: ['Legacy Place', 'Dedham Square', 'Endicott Estate', 'Dedham Corporate Center station'],
  },
  {
    slug: 'westwood',
    name: 'Westwood',
    state: 'MA',
    loganMiles: 15,
    loganMinutes: '22–32',
    sedanRate: 89,
    suvRate: 114,
    blurb: 'Westwood is minutes from our base, so pickups here are quick to schedule even same-day. We serve University Station, Islington and every residential street in between — Logan transfers at a flat $89 by sedan, Amtrak connections at Route 128 station, and rides into Boston.',
    landmarks: ['University Station', 'Route 128 station (Amtrak)', 'Islington', 'Westwood High School'],
  },
  {
    slug: 'norwood',
    name: 'Norwood',
    state: 'MA',
    loganMiles: 17,
    loganMinutes: '25–35',
    sedanRate: 95,
    suvRate: 120,
    blurb: 'Norwood sits on the Automile, and half our Norwood rides start or end at a dealership, an office park, or the Norwood Central commuter rail. The other half are flat-rate Logan transfers — $95 by sedan, about 25–35 minutes door to terminal, booked in advance so the price never moves.',
    landmarks: ['Norwood Center', 'Norwood Central station', 'The Automile (Route 1)', 'Norwood Memorial Airport'],
  },
  {
    slug: 'milton',
    name: 'Milton',
    state: 'MA',
    loganMiles: 10,
    loganMinutes: '18–28',
    sedanRate: 79,
    suvRate: 104,
    blurb: 'Milton riders get one of the shortest Logan runs on the South Shore — about 10 miles up I-93, and our lowest published flat rate at $79 by sedan. We handle daily airport transfers from Milton Village and East Milton Square, campus rides to Curry College, and evening trips into the city.',
    landmarks: ['Milton Village', 'East Milton Square', 'Curry College', 'Blue Hills Reservation'],
  },
  {
    slug: 'sharon',
    name: 'Sharon',
    state: 'MA',
    loganMiles: 22,
    loganMinutes: '30–40',
    sedanRate: 105,
    suvRate: 130,
    blurb: "Sharon commuters know the drill: the train works until it doesn't. Our scheduled Logan transfers from Sharon run at a fixed $105 by sedan around the clock, and we cover everything from Lake Massapoag to Sharon Heights — including the 4 AM pickups the night owls dread.",
    landmarks: ['Sharon Center', 'Lake Massapoag', 'Sharon station', 'Sharon Heights'],
  },
  {
    slug: 'stoughton',
    name: 'Stoughton',
    state: 'MA',
    loganMiles: 19,
    loganMinutes: '28–38',
    sedanRate: 99,
    suvRate: 124,
    blurb: 'Stoughton is a ten-minute hop from our home base, which makes it one of the easiest towns for us to serve on short notice. Flat-rate Logan transfers at $99 by sedan, IKEA and shopping runs, and daily point-to-point rides across the South Shore all start here.',
    landmarks: ['Stoughton Center', 'Stoughton station', 'IKEA Stoughton', 'Cobbs Corner'],
  },
  {
    slug: 'walpole',
    name: 'Walpole',
    state: 'MA',
    loganMiles: 22,
    loganMinutes: '32–42',
    sedanRate: 105,
    suvRate: 130,
    blurb: 'From Walpole, Logan is a solid 30–45 minute run — exactly the kind of trip where a $105 flat rate beats watching a meter through traffic. We cover Walpole Center, East Walpole and South Walpole, plus event rides to nearby Patriot Place and Gillette Stadium.',
    landmarks: ['Walpole Center', 'East Walpole', 'Bird Park', 'Walpole station'],
  },
  {
    slug: 'needham',
    name: 'Needham',
    state: 'MA',
    loganMiles: 16,
    loganMinutes: '24–34',
    sedanRate: 89,
    suvRate: 114,
    blurb: "Needham's corporate corridor along Highland Avenue keeps our chauffeurs busy with executive pickups and client transfers, while Needham Center families book us for Logan runs at a flat $89 by sedan and college drop-offs. Every ride is a fixed price agreed before the car arrives.",
    landmarks: ['Needham Center', 'Needham Heights station', 'Olin College', 'N Squared Innovation District'],
  },
  {
    slug: 'quincy',
    name: 'Quincy',
    state: 'MA',
    loganMiles: 10,
    loganMinutes: '15–25',
    sedanRate: 79,
    suvRate: 104,
    blurb: 'Quincy sits just 10 miles from Logan, but the Southeast Expressway makes that distance unpredictable — our chauffeurs build in the buffer so you never sweat a departure, and the $79 sedan flat rate never moves with traffic. We cover all of Quincy, from Marina Bay and North Quincy to Quincy Center and Houghs Neck.',
    landmarks: ['Quincy Center', 'Marina Bay', 'Adams National Historical Park', 'North Quincy station'],
  },
];

export function getCityPage(slug: string): CityPage | undefined {
  return CITY_PAGES.find((c) => c.slug === slug);
}

/** Lowest published sedan rate — the "from $X" figure used in marketing copy. */
export const LOWEST_SEDAN_RATE = Math.min(...CITY_PAGES.map((c) => c.sedanRate));
