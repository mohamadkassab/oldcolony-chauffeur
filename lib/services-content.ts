import { Locale, ServiceType } from '@/types';

// Long-form copy for the dedicated /services/[slug] landing pages. Kept out of
// the messages JSON on purpose — these are full SEO pages, not UI strings.

export interface ServiceCopy {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
  features: string[];
}

export interface ServicePage {
  slug: string;
  serviceType: ServiceType;
  copy: Record<Locale, ServiceCopy>;
}

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: 'airport-transfer',
    serviceType: ServiceType.AIRPORT,
    copy: {
      en: {
        metaTitle: 'Logan Airport Car Service | Flat-Rate Airport Transfers | Old Colony Chauffeur',
        metaDescription: 'Flat-rate car service to Logan Airport (BOS), Manchester (MHT) & T.F. Green (PVD). Free flight tracking, curbside pickup at every terminal, 24/7. Book online or call (781) 234-5451.',
        eyebrow: 'Airport Transfer',
        title: 'Car Service to Logan Airport — Flat Rate, Every Time',
        intro: 'Skip the surge pricing and the parking-garage maze. Old Colony Chauffeur runs flat-rate airport transfers between Greater Boston and Logan International (BOS), Manchester–Boston Regional (MHT) and Rhode Island T.F. Green (PVD) — with your chauffeur tracking the flight so the car is at the curb when you are.',
        sections: [
          {
            heading: 'How airport pickup works',
            body: 'Give us your flight number when you book and we monitor it in real time. If your flight lands early, we are early; if it is delayed, the car adjusts — no waiting fees, no frantic phone calls from the terminal. Your chauffeur meets you curbside at your terminal door, helps with luggage, and gets you home or to your hotel in a spotless vehicle.',
          },
          {
            heading: 'One fixed price, booked in advance',
            body: 'Airport rides are quoted as a flat rate before you confirm — the price you see is the price you pay, at 5 AM or in Friday rush hour. We serve every terminal at Logan and cover the whole Greater Boston area, from Cambridge and Somerville to Quincy, Newton, Dedham, Canton and beyond.',
          },
        ],
        features: [
          'Free real-time flight tracking',
          'Curbside pickup at every Logan terminal',
          'Flat rates — no surge pricing, ever',
          'Available 24/7, including holidays',
          'Child seats on request',
          'Sedans and SUVs for any group or luggage size',
        ],
      },
      fr: {
        metaTitle: "Service de voiture aéroport Logan | Transferts à prix fixe | Old Colony Chauffeur",
        metaDescription: "Service de voiture à prix fixe vers l'aéroport Logan (BOS), Manchester (MHT) et T.F. Green (PVD). Suivi de vol gratuit, prise en charge au terminal, 24h/24. Appelez le (781) 234-5451.",
        eyebrow: 'Transfert aéroport',
        title: "Voiture vers l'aéroport Logan — prix fixe, à chaque trajet",
        intro: "Oubliez les tarifs dynamiques et le labyrinthe des parkings. Old Colony Chauffeur assure des transferts à prix fixe entre le Grand Boston et Logan International (BOS), Manchester (MHT) et T.F. Green (PVD) — votre chauffeur suit votre vol pour que la voiture soit au trottoir quand vous y êtes.",
        sections: [
          {
            heading: 'Comment se passe la prise en charge',
            body: "Indiquez votre numéro de vol lors de la réservation et nous le suivons en temps réel. Vol en avance ? Nous sommes en avance. Vol retardé ? La voiture s'adapte — sans frais d'attente. Votre chauffeur vous accueille à la porte du terminal, s'occupe des bagages et vous conduit à destination dans un véhicule impeccable.",
          },
          {
            heading: "Un prix fixe, réservé à l'avance",
            body: "Chaque course aéroport est facturée à prix fixe, confirmé avant la réservation — le prix affiché est le prix payé, à 5h du matin comme en heure de pointe. Nous desservons tous les terminaux de Logan et tout le Grand Boston : Cambridge, Somerville, Quincy, Newton, Dedham, Canton et au-delà.",
          },
        ],
        features: [
          'Suivi de vol gratuit en temps réel',
          'Prise en charge au trottoir à chaque terminal',
          'Prix fixes — jamais de tarifs dynamiques',
          'Disponible 24h/24, 7j/7, jours fériés inclus',
          'Sièges enfants sur demande',
          'Berlines et SUV pour tout groupe et bagages',
        ],
      },
    },
  },
  {
    slug: 'black-car',
    serviceType: ServiceType.CITY,
    copy: {
      en: {
        metaTitle: 'Black Car Service Boston | Point-to-Point City Rides | Old Colony Chauffeur',
        metaDescription: 'Professional black car service across Boston & Greater Boston. Fixed prices, immaculate vehicles, professional chauffeurs — corporate rides, dinners, appointments. Call (781) 234-5451.',
        eyebrow: 'Black Car & City Rides',
        title: 'Black Car Service Across Boston',
        intro: 'Point-to-point rides across Boston and Greater Boston in an immaculate black car — for the business meeting you cannot be late to, the dinner reservation worth arriving well for, or simply a ride that does not depend on which drivers happen to be nearby.',
        sections: [
          {
            heading: 'A ride you can plan around',
            body: 'Every ride is scheduled in advance with a professional chauffeur and a fixed price. No surge multipliers, no cancelled pickups, no guessing what the fare will be when it rains. Your chauffeur arrives early, tracks Boston traffic, and takes the route that gets you there on time.',
          },
          {
            heading: 'Corporate and personal',
            body: 'We handle daily commutes, client pickups, medical appointments, dinners and nights out across the whole metro area — Boston, Cambridge, Brookline, Newton, Quincy and 30+ surrounding towns. Ride in a Mercedes sedan or a full-size SUV, always spotless inside and out.',
          },
        ],
        features: [
          'Fixed, pre-agreed pricing',
          'Professional, background-checked chauffeurs',
          'Mercedes sedans & premium SUVs',
          'Serving Boston + 30 surrounding towns',
          'Corporate accounts welcome',
          'Book by phone or online in under a minute',
        ],
      },
      fr: {
        metaTitle: 'Service de berline noire à Boston | Trajets en ville | Old Colony Chauffeur',
        metaDescription: 'Service de berline noire professionnel dans tout le Grand Boston. Prix fixes, véhicules impeccables, chauffeurs professionnels. Appelez le (781) 234-5451.',
        eyebrow: 'Berline & trajets en ville',
        title: 'Service de berline noire dans tout Boston',
        intro: "Des trajets de point à point dans Boston et le Grand Boston, en berline noire impeccable — pour le rendez-vous d'affaires où le retard n'est pas permis, le dîner qui mérite une belle arrivée, ou simplement un trajet fiable.",
        sections: [
          {
            heading: 'Un trajet sur lequel compter',
            body: "Chaque course est planifiée à l'avance avec un chauffeur professionnel et un prix fixe. Pas de majorations, pas d'annulations, pas de tarif surprise quand il pleut. Votre chauffeur arrive en avance, suit le trafic de Boston et choisit le meilleur itinéraire.",
          },
          {
            heading: 'Professionnel et personnel',
            body: "Trajets quotidiens, accueil de clients, rendez-vous médicaux, dîners et sorties dans toute la métropole — Boston, Cambridge, Brookline, Newton, Quincy et plus de 30 villes voisines. Berline Mercedes ou grand SUV, toujours impeccables.",
          },
        ],
        features: [
          'Prix fixes convenus à l’avance',
          'Chauffeurs professionnels vérifiés',
          'Berlines Mercedes et SUV haut de gamme',
          'Boston + 30 villes desservies',
          'Comptes entreprises bienvenus',
          'Réservation en ligne ou par téléphone en une minute',
        ],
      },
    },
  },
  {
    slug: 'hourly',
    serviceType: ServiceType.HOURLY,
    copy: {
      en: {
        metaTitle: 'Hourly Chauffeur Service Boston | Car & Driver by the Hour | Old Colony Chauffeur',
        metaDescription: 'Hire a private chauffeur and vehicle by the hour in Boston — meetings, roadshows, shopping, nights out, multi-stop days. One car, one driver, your schedule. Call (781) 234-5451.',
        eyebrow: 'Hourly Hire',
        title: 'Your Chauffeur, By the Hour',
        intro: 'Some days do not fit into a single pickup and drop-off. With hourly hire, the car and chauffeur stay with you — through back-to-back meetings, a multi-stop roadshow, an afternoon of appointments, or a night out where nobody wants to think about the ride home.',
        sections: [
          {
            heading: 'One car, your whole schedule',
            body: 'Your chauffeur waits between every stop, so there is no re-booking, no waiting for a new driver, and nowhere to leave your bags but safely in the car. Change the plan mid-day and the car changes with you — the schedule is yours, not ours.',
          },
          {
            heading: 'Built for business — great for everything else',
            body: 'Hourly hire is the standard for investor roadshows, executive visits and client tours across Boston and Cambridge. It works just as well for wedding-day errands, campus visits, medical days and celebrations. Simple hourly billing, agreed up front.',
          },
        ],
        features: [
          'Car + chauffeur dedicated to you',
          'Unlimited stops, zero re-booking',
          'Luggage and purchases stay safe in the car',
          'Ideal for roadshows and executive visits',
          'Transparent hourly billing, agreed up front',
          'Sedans and SUVs available',
        ],
      },
      fr: {
        metaTitle: "Chauffeur à l'heure à Boston | Voiture avec chauffeur | Old Colony Chauffeur",
        metaDescription: "Louez une voiture avec chauffeur privé à l'heure à Boston — réunions, roadshows, shopping, sorties, journées multi-arrêts. Appelez le (781) 234-5451.",
        eyebrow: "Location à l'heure",
        title: "Votre chauffeur, à l'heure",
        intro: "Certaines journées ne tiennent pas dans un simple aller-retour. Avec la location à l'heure, la voiture et le chauffeur restent à votre disposition — réunions enchaînées, roadshow multi-arrêts, après-midi de rendez-vous ou soirée sans souci de retour.",
        sections: [
          {
            heading: 'Une voiture, tout votre planning',
            body: "Votre chauffeur attend entre chaque arrêt : pas de nouvelle réservation, pas d'attente, et vos affaires restent en sécurité dans la voiture. Le programme change en cours de journée ? La voiture s'adapte — l'horaire, c'est le vôtre.",
          },
          {
            heading: "Conçu pour les affaires — parfait pour tout le reste",
            body: "La location à l'heure est la norme pour les roadshows, visites de dirigeants et tournées clients à Boston et Cambridge. Elle convient tout autant aux préparatifs de mariage, visites de campus, journées médicales et célébrations. Facturation horaire simple, convenue d'avance.",
          },
        ],
        features: [
          'Voiture + chauffeur dédiés',
          'Arrêts illimités, aucune re-réservation',
          'Bagages et achats en sécurité dans la voiture',
          'Idéal pour roadshows et visites de direction',
          "Facturation horaire transparente, convenue d'avance",
          'Berlines et SUV disponibles',
        ],
      },
    },
  },
  {
    slug: 'wedding-events',
    serviceType: ServiceType.EVENT,
    copy: {
      en: {
        metaTitle: 'Wedding & Event Transportation Boston | Old Colony Chauffeur',
        metaDescription: 'Wedding, prom & special-event car service across Greater Boston. Immaculate vehicles, on-schedule chauffeurs, Gillette Stadium & TD Garden event rides. Call (781) 234-5451.',
        eyebrow: 'Wedding & Events',
        title: 'Transportation for the Days That Matter',
        intro: 'A wedding runs on a timeline; so do we. Old Colony Chauffeur provides chauffeured transportation for weddings, proms, anniversaries and special events across Greater Boston — immaculate vehicles, drivers who arrive early, and a schedule that holds even when the day runs long.',
        sections: [
          {
            heading: 'Weddings, handled properly',
            body: 'We coordinate with your planner or venue in advance: pickup times, photo stops, guest shuttling between ceremony and reception. Your chauffeur is dressed for the occasion, helps with the dress and the details, and keeps the whole party moving on schedule.',
          },
          {
            heading: 'Game days, concerts and nights out',
            body: 'Gillette Stadium on game day, a show at TD Garden, graduation, prom — event traffic in Boston is its own sport. We plan the route and timing around the event, drop you at the door, and are waiting when it ends. No parking, no post-event rideshare chaos.',
          },
        ],
        features: [
          'Wedding-day coordination with your planner or venue',
          'Immaculate, decorated-on-request vehicles',
          'Gillette Stadium & TD Garden event service',
          'Proms, graduations & anniversaries',
          'Multiple-vehicle bookings for guest shuttles',
          'Fixed event pricing, agreed in advance',
        ],
      },
      fr: {
        metaTitle: 'Transport mariage & événements à Boston | Old Colony Chauffeur',
        metaDescription: 'Service de voiture pour mariages, bals et événements dans le Grand Boston. Véhicules impeccables, chauffeurs ponctuels, trajets Gillette Stadium et TD Garden. Appelez le (781) 234-5451.',
        eyebrow: 'Mariages & événements',
        title: 'Le transport des jours qui comptent',
        intro: "Un mariage suit un horaire précis ; nous aussi. Old Colony Chauffeur assure le transport avec chauffeur pour mariages, bals, anniversaires et événements dans tout le Grand Boston — véhicules impeccables, chauffeurs en avance, et un planning qui tient même quand la journée s'allonge.",
        sections: [
          {
            heading: 'Des mariages bien orchestrés',
            body: "Nous coordonnons tout à l'avance avec votre organisateur ou votre lieu de réception : horaires, arrêts photos, navettes pour les invités entre la cérémonie et la réception. Votre chauffeur est à la hauteur de l'occasion et garde tout le cortège à l'heure.",
          },
          {
            heading: 'Matchs, concerts et soirées',
            body: "Gillette Stadium un jour de match, un concert au TD Garden, une remise de diplômes, un bal — la circulation événementielle à Boston est un sport en soi. Nous planifions l'itinéraire autour de l'événement, vous déposons à la porte et vous attendons à la sortie.",
          },
        ],
        features: [
          "Coordination avec votre organisateur ou lieu de réception",
          'Véhicules impeccables, décorés sur demande',
          'Service événements Gillette Stadium & TD Garden',
          'Bals, remises de diplômes & anniversaires',
          'Réservations multi-véhicules pour les invités',
          "Prix fixe événementiel convenu à l'avance",
        ],
      },
    },
  },
];

export function getServicePage(slug: string) {
  return SERVICE_PAGES.find((s) => s.slug === slug);
}
