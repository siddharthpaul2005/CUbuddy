export interface EventCardData {
  id: string;
  categoryTag: string;
  categoryIcon: string;
  badgeTag?: string;
  badgeType?: 'spots' | 'elimination' | 'cypher' | 'countdown' | 'status';
  image: any;
  altText: string;
  guildSub: string;
  tierTag: string;
  title: string;
  time: string;
  venue: string;
  prizeText: string;
  prizeSub?: string;
  registeredCount?: string;
  actionText: string;
  actionIcon: string;
  isRegistered?: boolean;
  isSaved?: boolean;
}

export interface PastEventCardData {
  id: string;
  categoryTag: string;
  categoryIcon: string;
  badgeTag: string;
  statusBadge: string;
  image: any;
  altText: string;
  winnerBanner: string;
  winnerAccent: string;
  guildSub: string;
  matchId: string;
  title: string;
  time: string;
  venue: string;
  leaderboardSnippet?: {
    first: string;
    runnerUp: string;
    specialAward: string;
  };
  headToHead?: {
    teamA: string;
    teamAScore: string;
    teamB: string;
    teamBScore: string;
    symbolA: string;
    symbolB: string;
  };
  tags?: string[];
  actionType: 'scoreboard' | 'leaderboard' | 'winning_entries';
}

export interface UpcomingEventCardData {
  id: string;
  timeframeSection: string;
  timeframeLock: string;
  timeframeTag?: string;
  categoryTag: string;
  countdownPill: string;
  image: any;
  altText: string;
  guildSub: string;
  tierTag: string;
  slotsWarning?: string;
  title: string;
  time: string;
  venue: string;
  prizePool: string;
  actionText: string;
  actionIcon: string;
  isPreRegistered?: boolean;
  hasReminder?: boolean;
  isSaved?: boolean;
}

const BuildSprintImg = require('../../assets/posters/media_1791148575265.jpg');
const SpaceWeekImg = require('../../assets/posters/media_1791148575284.jpg');
const GdgImg = require('../../assets/posters/media_1791148575320.jpg');
const TangemImg = require('../../assets/posters/media_1791148575335.jpg');
const IsbaImg = require('../../assets/posters/media_1791148923484.jpg');
const BuildBharatImg = require('../../assets/posters/media_1791148923522.jpg');
const SotyImg = require('../../assets/posters/media_1791148923562.jpg');
const CatalystImg = require('../../assets/posters/media_1791148923573.jpg');
const ZinnovatioImg = require('../../assets/posters/media_1791149006408.jpg');
const CodeYudhImg = require('../../assets/posters/media_1791149006448.jpg');

export const TODAY_DROPS: EventCardData[] = [
  {
    id: 'drop-1',
    categoryTag: 'TECH // MEETUP',
    categoryIcon: 'code',
    badgeTag: 'LIVE TODAY',
    badgeType: 'status',
    image: GdgImg,
    altText: 'GDG Orientation event poster',
    guildSub: 'GDG CHANDIGARH UNIVERSITY',
    tierTag: 'ORIENTATION',
    title: 'GDG ORIENTATION',
    time: 'TODAY • 2:00 PM ONWARDS',
    venue: 'A2 SEMINAR HALL',
    prizeText: 'CONNECT & BUILD',
    registeredCount: '+250 registered',
    actionText: 'RSVP NOW',
    actionIcon: 'bolt',
    isSaved: false,
    isRegistered: false,
  },
  {
    id: 'drop-2',
    categoryTag: 'SPACE // TECH',
    categoryIcon: 'rocket',
    badgeTag: 'ONGOING',
    badgeType: 'countdown',
    image: SpaceWeekImg,
    altText: 'World Space Week 2026 poster',
    guildSub: 'KALPANA CHAWLA CENTRE',
    tierTag: 'EXHIBITION',
    title: 'WORLD SPACE WEEK 2026: ROCKET REVOLUTION',
    time: '5th - 10th OCT • ALL DAY',
    venue: 'CHANDIGARH UNIVERSITY',
    prizeText: 'CAN-7U-SAT UNVEILING',
    registeredCount: '+500 registered',
    actionText: 'REGISTER NOW',
    actionIcon: 'rocket',
    isSaved: true,
    isRegistered: false,
  },
];

export const PAST_EVENTS: PastEventCardData[] = [
  {
    id: 'past-1',
    categoryTag: 'CODE // HACKATHON',
    categoryIcon: 'code',
    badgeTag: 'COMPLETED',
    statusBadge: 'FRONTEND CHALLENGE',
    image: BuildSprintImg,
    altText: 'BuildSprint Frontend Product Challenge',
    winnerBanner: 'WINNERS ANNOUNCED',
    winnerAccent: 'JUJUTSU KAISEN THEME',
    guildSub: 'NEXASOUL PRESENTS',
    matchId: 'TEAM COLLAB',
    title: 'BUILD SPRINT',
    time: '30 SEPTEMBER 2026',
    venue: 'B1 AND B2 SEMINAR HALL',
    leaderboardSnippet: {
      first: 'Team Sukuna (1000 pts)',
      runnerUp: 'Team Gojo (980 pts)',
      specialAward: 'Best UI/UX',
    },
    actionType: 'winning_entries',
  }
];

export const UPCOMING_FIXTURES: UpcomingEventCardData[] = [
  {
    id: 'upcoming-1',
    timeframeSection: 'TOMORROW // WORKSHOP',
    timeframeLock: 'SECURE WEB3',
    categoryTag: 'WEB3 // SEMINAR',
    countdownPill: 'IN 1 DAY',
    image: TangemImg,
    altText: 'Tangem Campus Seminar Web3 Workshop poster',
    guildSub: 'ROTARACT CU & C2C',
    tierTag: 'WORKSHOP',
    slotsWarning: 'DL PROVIDED',
    title: 'TANGEM CAMPUS SEMINAR',
    time: 'TOMORROW • 1:30 PM - 4:25 PM',
    venue: 'C3 SEMINAR HALL',
    prizePool: 'GOODIES FOR TOP PERFORMERS',
    actionText: 'PRE-REGISTER',
    actionIcon: 'wallet',
    isPreRegistered: false,
    hasReminder: true,
    isSaved: false,
  },
  {
    id: 'upcoming-2',
    timeframeSection: 'THIS WEEK // SUMMIT',
    timeframeLock: 'INCUBATION & CAPITAL',
    categoryTag: 'BUSINESS // INVESTORS',
    countdownPill: 'IN 2 DAYS',
    image: IsbaImg,
    altText: 'ISBA CON 2026 Incubator & Capital Summit',
    guildSub: 'TECHNOLOGY BUSINESS INCUBATOR',
    tierTag: 'SUMMIT',
    slotsWarning: '18TH ANNUAL CONF',
    title: 'ISBA CON 26: INCUBATOR & CAPITAL SUMMIT',
    time: 'OCT 8th - 10th 2026',
    venue: 'CHANDIGARH UNIVERSITY, MOHALI',
    prizePool: 'LARGEST INVESTOR GATHERING',
    actionText: 'PRE-REGISTER',
    actionIcon: 'briefcase',
    isPreRegistered: false,
    hasReminder: false,
    isSaved: false,
  },
  {
    id: 'upcoming-3',
    timeframeSection: 'THIS WEEK // HACKATHON',
    timeframeLock: '36-HOUR SPRINT',
    categoryTag: 'CODE // INNOVATE',
    countdownPill: 'IN 2 DAYS',
    image: BuildBharatImg,
    altText: 'Build for Bharat 2.0 Hackathon',
    guildSub: 'APEX INSTITUTE OF TECHNOLOGY - CSE',
    tierTag: 'TIER 1 MAJOR',
    slotsWarning: '3-5 PER TEAM',
    title: 'BUILD FOR BHARAT 2.0',
    time: '7th - 8th OCTOBER 2026',
    venue: 'D7 OPEN AREA & D1 AUDITORIUM',
    prizePool: '₹20.00 LAKHS POOL',
    actionText: 'PRE-REGISTER',
    actionIcon: 'bolt',
    isPreRegistered: false,
    hasReminder: false,
    isSaved: true,
  },
  {
    id: 'upcoming-4',
    timeframeSection: 'TOMORROW // AUDITIONS',
    timeframeLock: 'SHATRANJ THEME',
    categoryTag: 'CULTURE // PAGEANT',
    countdownPill: 'IN 1 DAY',
    image: SotyImg,
    altText: 'Student of the Year Season 2',
    guildSub: 'DEPT OF ART AND CULTURAL AFFAIRS',
    tierTag: 'SEASON 2',
    slotsWarning: 'AUDITION ROUND',
    title: 'STUDENT OF THE YEAR',
    time: '6th & 7th OCT • 10:00 AM ONWARDS',
    venue: 'SEMINAR HALL B, BLOCK B5',
    prizePool: 'THE ULTIMATE CROWN',
    actionText: 'PRE-REGISTER',
    actionIcon: 'star',
    isPreRegistered: true,
    hasReminder: true,
    isSaved: true,
  },
  {
    id: 'upcoming-5',
    timeframeSection: 'THIS WEEK // SPRINT',
    timeframeLock: 'IDEAS TO IMPACT',
    categoryTag: 'TECH // INNOVATION',
    countdownPill: 'IN 3 DAYS',
    image: CatalystImg,
    altText: 'Catalyst Innovation Sprint',
    guildSub: 'ISTE PRESENTS',
    tierTag: 'INNOVATION',
    slotsWarning: 'TEAM SIZE: 2-4',
    title: 'CATALYST INNOVATION SPRINT',
    time: '8 OCTOBER 2026',
    venue: 'B3 SEMINAR HALL',
    prizePool: 'EXCITING PRIZES',
    actionText: 'PRE-REGISTER',
    actionIcon: 'rocket',
    isPreRegistered: false,
    hasReminder: false,
    isSaved: false,
  },
  {
    id: 'upcoming-6',
    timeframeSection: 'LATER THIS MONTH // HACKATHON',
    timeframeLock: 'GEN Z INNOVATIONS',
    categoryTag: 'CODE // HACKATHON',
    countdownPill: 'OCT 30-31',
    image: ZinnovatioImg,
    altText: 'Zinnovatio 4.0 Hackathon',
    guildSub: 'DEPARTMENT OF CSE',
    tierTag: 'FLAGSHIP EVENT',
    slotsWarning: '3-5 MEMBERS / TEAM',
    title: 'ZINNOVATIO 4.0',
    time: '30-31 OCTOBER 2026',
    venue: 'CHANDIGARH UNIVERSITY, MOHALI',
    prizePool: '₹1,00,000 CASH POOL',
    actionText: 'REGISTER ON UNSTOP',
    actionIcon: 'bolt',
    isPreRegistered: false,
    hasReminder: true,
    isSaved: true,
  },
  {
    id: 'upcoming-7',
    timeframeSection: 'LATER THIS MONTH // COMPETE',
    timeframeLock: 'CODE BATTLE',
    categoryTag: 'CODE // HACKATHON',
    countdownPill: 'OCT 27-28',
    image: CodeYudhImg,
    altText: 'Code Yudh Hackathon',
    guildSub: 'COMPUTER SCIENCE & ENGINEERING',
    tierTag: 'MAJOR HACK',
    slotsWarning: 'REGISTRATIONS OPEN',
    title: 'CODE YUDH HACKATHON',
    time: '27-28th OCTOBER 2026',
    venue: 'CHANDIGARH UNIVERSITY, MOHALI',
    prizePool: 'EXCLUSIVE PERKS & SWAG',
    actionText: 'PRE-REGISTER',
    actionIcon: 'bolt',
    isPreRegistered: false,
    hasReminder: false,
    isSaved: false,
  }
];

export const HOSTEL_LADDER = [
  { rank: 1, name: 'Delta East', points: '4,890 ELO', winRate: '78%', badge: 'Apex Tier', color: '#c7f32c' },
  { rank: 2, name: 'Omega West', points: '4,420 ELO', winRate: '69%', badge: 'Challenger', color: '#d0bcff' },
  { rank: 3, name: 'Sigma Quad', points: '3,950 ELO', winRate: '61%', badge: 'Contender', color: '#acedff' },
  { rank: 4, name: 'Phoenix Hall', points: '3,610 ELO', winRate: '54%', badge: 'Division 1', color: '#8e937a' },
];

export const LIVE_SCRIMS = [
  { id: 'scrim-1', game: 'Valorant 5v5', host: 'Delta Prime', map: 'Ascent', spots: '1 Slot open', ping: '12ms' },
];

export const USER_PROFILE = {
  gamerTag: 'Valkyrie_99',
  realName: 'Kira Vance',
  hostel: 'Delta East Wing',
  guild: 'Byte Society',
  rank: 'TIER 1 APEX',
  elo: 2140,
  seasonRank: '#4 Campus Wide',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyI4CSbEJ3WZOsNDBPkeu6gyyL8xEenMHZkrzyJ-1LudIHF26m4dYgsC2ACZDlidN4VhGeJPrcl74FukHCUx4lkzwVuxeXLZmJfh8mK0tZTl6x0S3iFVk52xdeYSjexsdJbvnkmEp5emSBhYZrkUsBk6HcKqh4_tJkdsi3YE2FDLt61GiCkx2hBY01OqVRiU-0OxoYWzR3gevujfLsmQR_raxy9drEvvEXBgFMCEg',
  brandLogoUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1WtpiAJ7B5BPJrEEa2SmNWVsKtkogqpYeAlED6IztFVWUTuyJ6a5MMf_rYnBRtzAPJCA6UNjII6c8L16jmt1BG0LjuJ7V-5IrDFwClziba1_8kL13wwDr60g7owjKXg03W1DyccbO8qDO620PaGsu0ZiZlzl58T-EVFmpY23TZbO1HZThkQgDtYO_DKvePY8612HNG2oU24w3HYvzYRKsTQagIW_fJkT8ItmVB7gxo',
  stats: {
    showdownsJoined: 18,
    victories: 14,
    podiums: 16,
    bountiesClaimed: '₹134,500',
  },
  registeredTickets: [
    {
      eventId: 'drop-1',
      eventName: 'GDG ORIENTATION',
      date: 'Today • 2:00 PM ONWARDS',
      seatCode: 'ROW-B-STATION-14',
      qrCode: 'CP-PASS-LAN-2025-09-24',
      status: 'CONFIRMED PASS',
    }
  ]
};

export const NOTIFICATIONS = [
  { id: 'notif-1', title: 'Check-in Gate Open', desc: 'GDG Orientation check-in desk is active at A2.', time: '10m ago', unread: true },
];
