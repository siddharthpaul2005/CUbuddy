export interface EventCardData {
  id: string;
  categoryTag: string;
  categoryIcon: string;
  badgeTag?: string;
  badgeType?: 'spots' | 'elimination' | 'cypher' | 'countdown' | 'status';
  image: string;
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
  image: string;
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
  image: string;
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

export const TODAY_DROPS: EventCardData[] = [
  {
    id: 'drop-1',
    categoryTag: 'CODE // HACKATHON',
    categoryIcon: 'code',
    badgeTag: '24 SPOTS LEFT',
    badgeType: 'spots',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4ks8BNCRhIsv58VmvCxUxxhK2kSIiKt5ySqmki-DYO9FUTPT-nYZcYRCj9J5q8VqpXA1MkWMdoGTadOMBF2zV1iJvgSjoaJ3JNoYvT6sCtLwWQovmPzo9_ZnJo1vdUrL6IPObsDTXhwqvYa88muATVwSLvK8QRTYotXXQT0WWR9BLA2--vtmFTyi8nYf76Q5KbzVWhutp3EE5DLrPXVSsFr8-RsWrjNATjIW42RFfv-qm6Nti4gOC',
    altText: 'Intense college hackathon arena with students coding under neon lighting',
    guildSub: 'BYTE SOCIETY • DIV 1',
    tierTag: 'TIER 1 MAJOR',
    title: 'ANNUAL AI LAN HACKFEST 2025',
    time: 'TODAY • 6:00 PM IST • Duration: 12H Overnighter',
    venue: 'Student Union Auditorium B (Main Hall)',
    prizeText: '₹5,000 POOL',
    registeredCount: '+142 registered',
    actionText: 'REGISTER',
    actionIcon: 'bolt',
    isSaved: false,
    isRegistered: false,
  },
  {
    id: 'drop-2',
    categoryTag: 'ESPORTS // BATTLEGROUNDS',
    categoryIcon: 'sports_esports',
    badgeTag: '5V5 ELIMINATION',
    badgeType: 'elimination',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf5eVniX1Rl5SIOyz2WIuUy-0oj_s4tgvuFfmu0xg24iWoMcyEbXy6oQ4zFVqOJe0ki_aXAKtkYQfvwXFvbgDiaBHeM_pG7P-T82cEhdQu2nNuZgRCOdobwfHkRz3fo3byKhsxDFXjeP2tWgf4RZ6XMBjAUmiLI3-IvqIDXftG_pSHGGwBb9vMKKB000JcacNMZk5wHzaRd-rbEg_q8JYNHuRFu8NLyApHMjnMTd98f3vVTdu3yh2a',
    altText: 'Valorant collegiate esports stadium stage with row of players',
    guildSub: 'VALORANT GUILD • TIER 0',
    tierTag: 'INTER-HOSTEL RIVALRY',
    title: 'CAMPUS CLASH: HOSTEL DERBY',
    time: 'TODAY • 8:30 PM IST • Spectators Welcome',
    venue: 'Gaming Lounge Hub 4 (Block C Basement)',
    prizeText: '₹8,000 + TROPHY',
    registeredCount: '+88 registered',
    actionText: 'REGISTER',
    actionIcon: 'sports_kabaddi',
    isSaved: true,
    isRegistered: false,
  },
  {
    id: 'drop-3',
    categoryTag: 'SOUND // RAP BATTLE',
    categoryIcon: 'mic',
    badgeTag: 'OPEN MIC CYPHER',
    badgeType: 'cypher',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCx5xU0i884ic5YAWfbke99DWccHF9ayUG-j35ykg_qfPZX87A_8_taDWsl-R5Sh495SuQDSO1YYgT_ecPPIRhQ5x8cmgs1B2b1e3PeT5c2mYWmUz4caIl9i4GzEgfkBQdm01QSvKRvlWzkh36AiQcAQrzrHw87xQIsSpDw_NfJUwH_uKhekbQpw-LoJR7L36S0___g6YYu9xkWSc36NkAaw6ftmctwzrBNABrw33NSV-dUyMTHWTz',
    altText: 'Campus underground cypher stage with performer in spotlight',
    guildSub: 'PULSE AUDIO COLLECTIVE',
    tierTag: 'UNDERGROUND BEAT MATCH',
    title: 'NEON CYPHER: UNDERGROUND BEAT BATTLE',
    time: 'TONIGHT • 10:00 PM IST • Crowd Vote Ranked',
    venue: 'Open Amphitheatre (North Quad)',
    prizeText: '₹3,000 PRIZE',
    registeredCount: '+64 registered',
    actionText: 'REGISTER',
    actionIcon: 'music_note',
    isSaved: false,
    isRegistered: false,
  },
];

export const PAST_EVENTS: PastEventCardData[] = [
  {
    id: 'past-1',
    categoryTag: 'CYBER // CTF SHOWDOWN',
    categoryIcon: 'terminal',
    badgeTag: 'TIER 1',
    statusBadge: 'CONCLUDED',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADu7RyCGIQPlGqEZQVeadSO3PDry_-ev6mzExTAZV9dXFIEKmhAljdoWKIhsRGYiEPZXgTszpcO6tw3OFGcJQCNmrpQoni91KH3iyFHMqhPx1yQMLiFxOXt_vi03NK7p9qZ5kPA9OMWeCQ-h7SCWT4a48KkpvwfsaBwkjl7Tw66ihVj6bKMD5MqMgPkQ4B4bn_9CtkDfTDoaHp7vxLddmbNfR-2TZ3YMAEVyx4dzjMQ1Ja-oNOhrYU',
    altText: 'Cybersecurity hacking setups with terminal codes',
    winnerBanner: 'WINNER: TEAM ZERO-DAY',
    winnerAccent: '₹7,000 POOL',
    guildSub: 'NULL SEC GUILD • BLOCK FINALS',
    matchId: 'MATCH ID #9042',
    title: 'INTER-COLLEGE CTF ARENA 2025',
    time: 'Yesterday • 4:00 PM - 11:30 PM',
    venue: 'CS Lab Block 2',
    leaderboardSnippet: {
      first: 'Zero-Day (2450 pts)',
      runnerUp: 'SudoKu (2120 pts)',
      specialAward: 'KernelPnk',
    },
    actionType: 'scoreboard',
  },
  {
    id: 'past-2',
    categoryTag: 'ESPORTS // VALORANT',
    categoryIcon: 'sports_esports',
    badgeTag: 'RIVALRY DERBY',
    statusBadge: 'FINAL: 3 - 1',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDf5eVniX1Rl5SIOyz2WIuUy-0oj_s4tgvuFfmu0xg24iWoMcyEbXy6oQ4zFVqOJe0ki_aXAKtkYQfvwXFvbgDiaBHeM_pG7P-T82cEhdQu2nNuZgRCOdobwfHkRz3fo3byKhsxDFXjeP2tWgf4RZ6XMBjAUmiLI3-IvqIDXftG_pSHGGwBb9vMKKB000JcacNMZk5wHzaRd-rbEg_q8JYNHuRFu8NLyApHMjnMTd98f3vVTdu3yh2a',
    altText: 'Spectacular Valorant stadium stage in crimson lighting',
    winnerBanner: 'CHAMPION: DELTA HOSTEL',
    winnerAccent: 'MVP: REAPER_99',
    guildSub: 'VALORANT GUILD • HOSTEL DERBY SEMIS',
    matchId: 'MATCH ID #7781',
    title: 'EAST WING VS WEST BATTLEGROUND',
    time: 'Yesterday • 7:00 PM - 10:45 PM',
    venue: 'Gaming Lounge Arena',
    headToHead: {
      teamA: 'Delta East',
      teamAScore: '3 MAPS WON',
      teamB: 'Omega West',
      teamBScore: '1 MAP',
      symbolA: 'D',
      symbolB: 'Ω',
    },
    actionType: 'leaderboard',
  },
  {
    id: 'past-3',
    categoryTag: 'DESIGN // UI-ATHON',
    categoryIcon: 'palette',
    badgeTag: 'SPRINT 04',
    statusBadge: 'RATED 4.9★',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4ks8BNCRhIsv58VmvCxUxxhK2kSIiKt5ySqmki-DYO9FUTPT-nYZcYRCj9J5q8VqpXA1MkWMdoGTadOMBF2zV1iJvgSjoaJ3JNoYvT6sCtLwWQovmPzo9_ZnJo1vdUrL6IPObsDTXhwqvYa88muATVwSLvK8QRTYotXXQT0WWR9BLA2--vtmFTyi8nYf76Q5KbzVWhutp3EE5DLrPXVSsFr8-RsWrjNATjIW42RFfv-qm6Nti4gOC',
    altText: 'High-stakes design sprint with UI wireframes on monitors',
    winnerBanner: 'WINNER: PIXELPULSE SQUAD',
    winnerAccent: 'FIGMA VAULT',
    guildSub: 'DESIGN FOUNDRY • SPEED SPRINT',
    matchId: 'SHOWDOWN #5502',
    title: '4-HOUR TURBO WIREFRAME CRUSH',
    time: 'Yesterday • 2:00 PM - 6:00 PM',
    venue: 'Design Studio Hall A',
    tags: ['Prototype Speed: 9.8', 'Visual Polish: 9.6', 'Audience Vote: #1'],
    actionType: 'winning_entries',
  },
];

export const UPCOMING_FIXTURES: UpcomingEventCardData[] = [
  {
    id: 'upcoming-1',
    timeframeSection: 'TOMORROW // IMMINENT LOCK',
    timeframeLock: 'T-MINUS 18H',
    categoryTag: 'TECH // HARDWARE',
    countdownPill: 'IN 18 HOURS',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9Z-5gHUbQX_-4OkcTuo-jbOylGzRoZ9umI4uizbqvZSigAXyJjFAUc6mxznGU8tPFHduDzsO6k7T8LfxJ5n2cCIdmihi7QjXFYdjM0e3_TrrbJCr4jxPk2hjhDPjRHL_RaxnT5DFUyqT-eiKe9wsmcnzQuSXHjJyYu9iQXykhgmhDAjYWfaxEI3QLEKm8Nf4RHdvihnMDYDcH7EOt0UG3bg9KA2X1yHHv89Al0e7QEF3XtPGuhust',
    altText: 'Combat robot tournament arena with sparking bots',
    guildSub: 'Engineering Guild',
    tierTag: 'Tier 1 Major',
    slotsWarning: '12 SLOTS LEFT',
    title: 'ROBO-WARS: MECHA ARENA 2025',
    time: 'Tomorrow • 5:00 PM IST',
    venue: 'Tech Arena North',
    prizePool: '₹15,000 POOL',
    actionText: 'PRE-REGISTER',
    actionIcon: 'bolt',
    isPreRegistered: false,
    hasReminder: false,
    isSaved: false,
  },
  {
    id: 'upcoming-2',
    timeframeSection: 'THIS WEEK // MIDWEEK CLASH',
    timeframeLock: 'RANKED SHOWDOWN',
    categoryTag: 'ESPORTS // FIGHTING',
    countdownPill: 'IN 3 DAYS',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCx5xU0i884ic5YAWfbke99DWccHF9ayUG-j35ykg_qfPZX87A_8_taDWsl-R5Sh495SuQDSO1YYgT_ecPPIRhQ5x8cmgs1B2b1e3PeT5c2mYWmUz4caIl9i4GzEgfkBQdm01QSvKRvlWzkh36AiQcAQrzrHw87xQIsSpDw_NfJUwH_uKhekbQpw-LoJR7L36S0___g6YYu9xkWSc36NkAaw6ftmctwzrBNABrw33NSV-dUyMTHWTz',
    altText: 'Tekken 8 tournament arena on LED screens with stadium crowd',
    guildSub: 'Esports Club',
    tierTag: 'FGC League',
    slotsWarning: '+250 ELO POOL',
    title: 'CAMPUS BEATDOWN: TEKKEN 8 ROYALE',
    time: 'Friday • 6:30 PM IST',
    venue: 'Student Activity Center (SAC)',
    prizePool: '₹10,000 CASH + ELO',
    actionText: 'PRE-REGISTER',
    actionIcon: 'sports_mma',
    isPreRegistered: false,
    hasReminder: true,
    isSaved: false,
  },
  {
    id: 'upcoming-3',
    timeframeSection: 'NEXT WEEK // MARATHON CIRCUIT',
    timeframeLock: 'MAJOR SPRINT',
    categoryTag: 'HACK // SPRINT',
    countdownPill: 'IN 8 DAYS',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9Fc511c7CPvjaxA3qB6eXLq-xmJMJPuyMo4pEeZLTfSUR9nZyK1giwojaSiwv6YVMjk9VzxIjw6ja04TUO0TylnGH7MPEvA7DXl_yxwenbKOFcJJzZw__FdsblIcSbTP5FckqnVISmOC4DiR0P3Jv9ggl0B1r_lLqDueCmPB0viqWZLdQH2V90GxV03naZRs8UPvNoEGymBrUmbUUfyePMpw7EJJp3fR_2RS8bRPnKJfw_T-OAJix',
    altText: 'Hacker sprint auditorium with glowing laptop terminals',
    guildSub: 'ACM Chapter',
    tierTag: '36H Hackathon',
    slotsWarning: 'HYBRID • 4/TEAM',
    title: 'SYNAPSE: NATIONAL HACK SPRINT',
    time: 'Next Sat • 9:00 AM IST',
    venue: 'Main Auditorium Complex',
    prizePool: '₹50,000 GRAND POOL',
    actionText: 'NOTIFY ME',
    actionIcon: 'notifications',
    isPreRegistered: false,
    hasReminder: false,
    isSaved: false,
  },
];

export const HOSTEL_LADDER = [
  { rank: 1, name: 'Delta East', points: '4,890 ELO', winRate: '78%', badge: 'Apex Tier', color: '#c7f32c' },
  { rank: 2, name: 'Omega West', points: '4,420 ELO', winRate: '69%', badge: 'Challenger', color: '#d0bcff' },
  { rank: 3, name: 'Sigma Quad', points: '3,950 ELO', winRate: '61%', badge: 'Contender', color: '#acedff' },
  { rank: 4, name: 'Phoenix Hall', points: '3,610 ELO', winRate: '54%', badge: 'Division 1', color: '#8e937a' },
];

export const LIVE_SCRIMS = [
  { id: 'scrim-1', game: 'Valorant 5v5', host: 'Delta Prime', map: 'Ascent', spots: '1 Slot open', ping: '12ms' },
  { id: 'scrim-2', game: 'Speed Python Algo', host: 'ByteBards', map: 'LeetCode Hard', spots: '2 Slots open', ping: '18ms' },
  { id: 'scrim-3', game: 'Mecha Battle Bot 1v1', host: 'RoboGuild', map: 'Arena Pit 3', spots: 'Ready to duel', ping: '14ms' },
  { id: 'scrim-4', game: 'Rocket League 3v3', host: 'SpeedFreaks', map: 'Champions Field', spots: 'Final match', ping: '22ms' },
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
    bountiesClaimed: '₹34,500',
  },
  registeredTickets: [
    {
      eventId: 'drop-1',
      eventName: 'ANNUAL AI LAN HACKFEST 2025',
      date: 'Today • 6:00 PM IST',
      seatCode: 'ROW-B-STATION-14',
      qrCode: 'CP-PASS-LAN-2025-09-24',
      status: 'CONFIRMED PASS',
    }
  ]
};

export const NOTIFICATIONS = [
  { id: 'notif-1', title: 'Check-in Gate Open', desc: 'ANNUAL AI LAN HACKFEST check-in desk is active at Auditorium B.', time: '10m ago', unread: true },
  { id: 'notif-2', title: 'Bounty Dispatched', desc: '₹7,000 CTF prize disbursed to Team Zero-Day wallet.', time: '1h ago', unread: true },
  { id: 'notif-3', title: 'Scrim Challenge Received', desc: 'Omega West sent a 5v5 Valorant scrim challenge.', time: '3h ago', unread: false },
  { id: 'notif-4', title: 'Hostel ELO Updated', desc: 'Delta East secured +240 ELO after Finals triumph.', time: 'Yesterday', unread: false },
];
