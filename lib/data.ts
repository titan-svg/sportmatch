// Mock data for SportMatch

export type UserRole = 'admin' | 'coordinator' | 'player';
export type EventStatus = 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
export type RegistrationStatus = 'pending' | 'approved' | 'rejected' | 'paid';
export type MatchStatus = 'scheduled' | 'in_progress' | 'completed';
export type SportType = 'tennis' | 'padel' | 'soccer' | 'basketball' | 'volleyball';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  rating: number;
  wins: number;
  losses: number;
  points: number;
  sport: SportType;
  joinedAt: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  sport: SportType;
  date: string;
  time: string;
  location: string;
  address: string;
  maxParticipants: number;
  currentParticipants: number;
  entryFee: number;
  prize: string;
  status: EventStatus;
  image: string;
  organizerId: string;
  format: 'single' | 'doubles' | 'team';
  rules: string[];
}

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  partnerId?: string;
  status: RegistrationStatus;
  paidAt?: string;
  registeredAt: string;
}

export interface Match {
  id: string;
  eventId: string;
  round: number;
  position: number;
  player1Id: string;
  player2Id: string;
  player1Score?: number;
  player2Score?: number;
  winnerId?: string;
  status: MatchStatus;
  scheduledTime?: string;
  court?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  eventId?: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'event' | 'match' | 'result' | 'payment' | 'general';
  read: boolean;
  createdAt: string;
  link?: string;
}

// Mock Users
export const users: User[] = [
  {
    id: 'u1',
    name: 'Carlos Rodríguez',
    email: 'carlos@email.com',
    phone: '+54 11 5555-1234',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    role: 'admin',
    rating: 1850,
    wins: 45,
    losses: 12,
    points: 2340,
    sport: 'tennis',
    joinedAt: '2023-01-15',
  },
  {
    id: 'u2',
    name: 'María García',
    email: 'maria@email.com',
    phone: '+54 11 5555-2345',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    role: 'player',
    rating: 1720,
    wins: 38,
    losses: 15,
    points: 1980,
    sport: 'tennis',
    joinedAt: '2023-02-20',
  },
  {
    id: 'u3',
    name: 'Juan Martínez',
    email: 'juan@email.com',
    phone: '+54 11 5555-3456',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    role: 'player',
    rating: 1680,
    wins: 32,
    losses: 18,
    points: 1750,
    sport: 'padel',
    joinedAt: '2023-03-10',
  },
  {
    id: 'u4',
    name: 'Ana López',
    email: 'ana@email.com',
    phone: '+54 11 5555-4567',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    role: 'coordinator',
    rating: 1590,
    wins: 28,
    losses: 22,
    points: 1520,
    sport: 'tennis',
    joinedAt: '2023-04-05',
  },
  {
    id: 'u5',
    name: 'Diego Fernández',
    email: 'diego@email.com',
    phone: '+54 11 5555-5678',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    role: 'player',
    rating: 1920,
    wins: 52,
    losses: 8,
    points: 2580,
    sport: 'padel',
    joinedAt: '2023-01-08',
  },
  {
    id: 'u6',
    name: 'Laura Sánchez',
    email: 'laura@email.com',
    phone: '+54 11 5555-6789',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    role: 'player',
    rating: 1780,
    wins: 40,
    losses: 14,
    points: 2100,
    sport: 'tennis',
    joinedAt: '2023-02-01',
  },
  {
    id: 'u7',
    name: 'Pablo Torres',
    email: 'pablo@email.com',
    phone: '+54 11 5555-7890',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
    role: 'player',
    rating: 1650,
    wins: 30,
    losses: 20,
    points: 1680,
    sport: 'padel',
    joinedAt: '2023-05-15',
  },
  {
    id: 'u8',
    name: 'Sofía Ruiz',
    email: 'sofia@email.com',
    phone: '+54 11 5555-8901',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
    role: 'player',
    rating: 1540,
    wins: 25,
    losses: 25,
    points: 1400,
    sport: 'tennis',
    joinedAt: '2023-06-20',
  },
];

// Mock Events
export const events: Event[] = [
  {
    id: 'e1',
    name: 'Torneo de Verano 2024',
    description: 'El torneo más esperado del año. Compite con los mejores jugadores de la región en un formato eliminatorio emocionante.',
    sport: 'tennis',
    date: '2024-03-25',
    time: '09:00',
    location: 'Club Deportivo Central',
    address: 'Av. Libertador 1234, Buenos Aires',
    maxParticipants: 32,
    currentParticipants: 24,
    entryFee: 5000,
    prize: '$50,000 + Trofeo',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=400&fit=crop',
    organizerId: 'u1',
    format: 'single',
    rules: ['Formato eliminatorio', 'Sets a 6 juegos', 'Tie-break a 7 puntos'],
  },
  {
    id: 'e2',
    name: 'Copa Pádel Masters',
    description: 'Torneo de pádel en parejas con los mejores jugadores. Inscríbete con tu compañero y demuestra tu nivel.',
    sport: 'padel',
    date: '2024-03-20',
    time: '10:00',
    location: 'Pádel Arena Norte',
    address: 'Calle San Martín 567, Buenos Aires',
    maxParticipants: 16,
    currentParticipants: 14,
    entryFee: 8000,
    prize: '$80,000 + Medallas',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1612534847738-b3af9bc31f0a?w=800&h=400&fit=crop',
    organizerId: 'u1',
    format: 'doubles',
    rules: ['Parejas mixtas permitidas', 'Sets a 6 juegos', 'Golden point en deuce'],
  },
  {
    id: 'e3',
    name: 'Liga Amateur de Tenis',
    description: 'Liga regular con partidos semanales. Acumula puntos y escala en el ranking durante toda la temporada.',
    sport: 'tennis',
    date: '2024-03-15',
    time: '14:00',
    location: 'Tennis Club Sur',
    address: 'Av. Corrientes 890, Buenos Aires',
    maxParticipants: 24,
    currentParticipants: 24,
    entryFee: 3000,
    prize: 'Puntos ranking + Premios',
    status: 'in_progress',
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&h=400&fit=crop',
    organizerId: 'u4',
    format: 'single',
    rules: ['Formato liga', 'Todos contra todos', 'Partidos a 2 sets'],
  },
  {
    id: 'e4',
    name: 'Torneo Nocturno',
    description: 'Competencia especial bajo las luces. Experiencia única de juego nocturno con ambiente festivo.',
    sport: 'padel',
    date: '2024-03-30',
    time: '20:00',
    location: 'Pádel Night Club',
    address: 'Av. del Puerto 234, Buenos Aires',
    maxParticipants: 12,
    currentParticipants: 8,
    entryFee: 6000,
    prize: '$40,000',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
    organizerId: 'u1',
    format: 'doubles',
    rules: ['Horario nocturno', 'Iluminación especial', 'Música ambiente'],
  },
  {
    id: 'e5',
    name: 'Campeonato Regional',
    description: 'El campeonato oficial de la región. Los mejores jugadores clasificados compiten por el título regional.',
    sport: 'tennis',
    date: '2024-02-28',
    time: '09:00',
    location: 'Estadio Municipal',
    address: 'Plaza Central 100, Buenos Aires',
    maxParticipants: 64,
    currentParticipants: 64,
    entryFee: 10000,
    prize: '$150,000 + Copa',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=800&h=400&fit=crop',
    organizerId: 'u1',
    format: 'single',
    rules: ['Solo clasificados', 'Best of 3 sets', 'Final a 5 sets'],
  },
];

// Mock Registrations
export const registrations: Registration[] = [
  { id: 'r1', eventId: 'e1', userId: 'u2', status: 'paid', paidAt: '2024-03-01', registeredAt: '2024-02-28' },
  { id: 'r2', eventId: 'e1', userId: 'u3', status: 'paid', paidAt: '2024-03-02', registeredAt: '2024-03-01' },
  { id: 'r3', eventId: 'e1', userId: 'u5', status: 'approved', registeredAt: '2024-03-05' },
  { id: 'r4', eventId: 'e1', userId: 'u6', status: 'pending', registeredAt: '2024-03-08' },
  { id: 'r5', eventId: 'e2', userId: 'u3', partnerId: 'u7', status: 'paid', paidAt: '2024-03-03', registeredAt: '2024-03-02' },
  { id: 'r6', eventId: 'e2', userId: 'u5', partnerId: 'u2', status: 'pending', registeredAt: '2024-03-06' },
  { id: 'r7', eventId: 'e3', userId: 'u2', status: 'paid', paidAt: '2024-02-20', registeredAt: '2024-02-18' },
  { id: 'r8', eventId: 'e3', userId: 'u6', status: 'paid', paidAt: '2024-02-22', registeredAt: '2024-02-20' },
];

// Mock Matches
export const matches: Match[] = [
  // Event e3 - Liga Amateur (in progress)
  { id: 'm1', eventId: 'e3', round: 1, position: 1, player1Id: 'u2', player2Id: 'u6', player1Score: 6, player2Score: 4, winnerId: 'u2', status: 'completed', court: 'Cancha 1' },
  { id: 'm2', eventId: 'e3', round: 1, position: 2, player1Id: 'u8', player2Id: 'u3', player1Score: 3, player2Score: 6, winnerId: 'u3', status: 'completed', court: 'Cancha 2' },
  { id: 'm3', eventId: 'e3', round: 2, position: 1, player1Id: 'u2', player2Id: 'u3', status: 'scheduled', scheduledTime: '2024-03-18T15:00:00', court: 'Cancha 1' },
  // Event e5 - Completed
  { id: 'm4', eventId: 'e5', round: 1, position: 1, player1Id: 'u5', player2Id: 'u2', player1Score: 6, player2Score: 3, winnerId: 'u5', status: 'completed', court: 'Central' },
  { id: 'm5', eventId: 'e5', round: 1, position: 2, player1Id: 'u6', player2Id: 'u3', player1Score: 7, player2Score: 5, winnerId: 'u6', status: 'completed', court: 'Cancha 1' },
  { id: 'm6', eventId: 'e5', round: 2, position: 1, player1Id: 'u5', player2Id: 'u6', player1Score: 6, player2Score: 4, winnerId: 'u5', status: 'completed', court: 'Central' },
];

// Mock Messages
export const messages: Message[] = [
  { id: 'msg1', senderId: 'u1', receiverId: 'u2', eventId: 'e1', content: '¡Bienvenida al torneo! Tu inscripción ha sido confirmada.', read: true, createdAt: '2024-03-01T10:30:00' },
  { id: 'msg2', senderId: 'u2', receiverId: 'u1', eventId: 'e1', content: '¡Gracias! ¿A qué hora debo presentarme?', read: true, createdAt: '2024-03-01T11:00:00' },
  { id: 'msg3', senderId: 'u1', receiverId: 'u2', eventId: 'e1', content: 'Debes estar 30 minutos antes del inicio.', read: false, createdAt: '2024-03-01T11:15:00' },
  { id: 'msg4', senderId: 'u4', receiverId: 'u3', eventId: 'e3', content: 'Tu próximo partido es el viernes a las 15:00.', read: true, createdAt: '2024-03-15T09:00:00' },
  { id: 'msg5', senderId: 'u3', receiverId: 'u7', content: '¿Te gustaría ser mi compañero para el torneo de pádel?', read: true, createdAt: '2024-03-02T14:00:00' },
  { id: 'msg6', senderId: 'u7', receiverId: 'u3', content: '¡Claro! Me encantaría. ¿Cuándo es?', read: true, createdAt: '2024-03-02T14:30:00' },
];

// Mock Notifications
export const notifications: Notification[] = [
  { id: 'n1', userId: 'u2', title: 'Inscripción confirmada', message: 'Tu inscripción al Torneo de Verano 2024 ha sido confirmada.', type: 'event', read: false, createdAt: '2024-03-08T10:00:00', link: '/eventos/e1' },
  { id: 'n2', userId: 'u2', title: 'Próximo partido', message: 'Tu partido contra Juan Martínez es mañana a las 15:00.', type: 'match', read: false, createdAt: '2024-03-17T18:00:00', link: '/eventos/e3/brackets' },
  { id: 'n3', userId: 'u3', title: 'Resultado registrado', message: 'El resultado de tu partido ha sido registrado. ¡Ganaste!', type: 'result', read: true, createdAt: '2024-03-15T16:00:00' },
  { id: 'n4', userId: 'u5', title: 'Pago pendiente', message: 'Tienes un pago pendiente para el Torneo de Verano 2024.', type: 'payment', read: false, createdAt: '2024-03-06T12:00:00', link: '/pagos' },
  { id: 'n5', userId: 'u6', title: 'Nueva invitación', message: 'Diego te ha invitado a ser su compañero en Copa Pádel Masters.', type: 'event', read: false, createdAt: '2024-03-07T09:00:00' },
];

// Current logged-in user (for demo)
export const currentUser: User = users[0];

// Helper functions
export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}

export function getEventById(id: string): Event | undefined {
  return events.find(e => e.id === id);
}

export function getEventRegistrations(eventId: string): Registration[] {
  return registrations.filter(r => r.eventId === eventId);
}

export function getUserRegistrations(userId: string): Registration[] {
  return registrations.filter(r => r.userId === userId || r.partnerId === userId);
}

export function getEventMatches(eventId: string): Match[] {
  return matches.filter(m => m.eventId === eventId);
}

export function getUserMatches(userId: string): Match[] {
  return matches.filter(m => m.player1Id === userId || m.player2Id === userId);
}

export function getUserMessages(userId: string): Message[] {
  return messages.filter(m => m.senderId === userId || m.receiverId === userId);
}

export function getUserNotifications(userId: string): Notification[] {
  return notifications.filter(n => n.userId === userId);
}

export function getUnreadNotificationsCount(userId: string): number {
  return notifications.filter(n => n.userId === userId && !n.read).length;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getSportLabel(sport: SportType): string {
  const labels: Record<SportType, string> = {
    tennis: 'Tenis',
    padel: 'Pádel',
    soccer: 'Fútbol',
    basketball: 'Básquet',
    volleyball: 'Vóley',
  };
  return labels[sport];
}

export function getStatusLabel(status: EventStatus): string {
  const labels: Record<EventStatus, string> = {
    upcoming: 'Próximo',
    in_progress: 'En curso',
    completed: 'Finalizado',
    cancelled: 'Cancelado',
  };
  return labels[status];
}

export function getRegistrationStatusLabel(status: RegistrationStatus): string {
  const labels: Record<RegistrationStatus, string> = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    paid: 'Pagado',
  };
  return labels[status];
}

export function getRankings(sport?: SportType): User[] {
  let filtered = [...users].filter(u => u.role === 'player' || u.role === 'admin');
  if (sport) {
    filtered = filtered.filter(u => u.sport === sport);
  }
  return filtered.sort((a, b) => b.points - a.points);
}

export function generateBracket(eventId: string, participants: string[]): Match[] {
  const shuffled = [...participants].sort(() => Math.random() - 0.5);
  const newMatches: Match[] = [];
  const rounds = Math.ceil(Math.log2(shuffled.length));

  for (let i = 0; i < shuffled.length; i += 2) {
    if (shuffled[i + 1]) {
      newMatches.push({
        id: `m-${eventId}-${i}`,
        eventId,
        round: 1,
        position: Math.floor(i / 2) + 1,
        player1Id: shuffled[i],
        player2Id: shuffled[i + 1],
        status: 'scheduled',
      });
    }
  }

  return newMatches;
}
