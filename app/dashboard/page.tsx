'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import {
  events,
  getUserMatches,
  getUserNotifications,
  getRankings,
  formatDate,
  getSportLabel,
  getUserById,
  Event,
  Match,
  Notification,
} from '@/lib/data';
import {
  CalendarIcon,
  TrophyIcon,
  StarIcon,
  BellIcon,
  ChartIcon,
  ArrowRightIcon,
  ClockIcon,
  LocationIcon,
} from '@/components/Icons';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const upcomingEvents = events.filter((e) => e.status === 'upcoming').slice(0, 3);
  const userMatches = getUserMatches(user.id);
  const recentMatches = userMatches.filter((m) => m.status === 'completed').slice(0, 3);
  const userNotifications = getUserNotifications(user.id).slice(0, 5);
  const rankings = getRankings(user.sport);
  const userRankPosition = rankings.findIndex((u) => u.id === user.id) + 1;

  const stats = [
    {
      label: 'Proximos Eventos',
      value: upcomingEvents.length,
      icon: CalendarIcon,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      label: 'Mis Partidos',
      value: userMatches.length,
      icon: TrophyIcon,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
    {
      label: 'Ranking Position',
      value: `#${userRankPosition}`,
      icon: ChartIcon,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      label: 'Puntos',
      value: user.points,
      icon: StarIcon,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-20 lg:pt-16 pb-20 lg:pb-8">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              Bienvenido, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-slate-600 mt-1">
              Aqui tienes un resumen de tu actividad deportiva
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-slate-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 ${stat.lightColor} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                  </div>
                </div>
                <p className="text-2xl lg:text-3xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Upcoming Events Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-[#1e40af]" />
                  Proximos Eventos
                </h2>
                <Link
                  href="/eventos"
                  className="text-sm font-medium text-[#1e40af] hover:text-blue-700 flex items-center gap-1"
                >
                  Ver todos
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>

              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No hay eventos proximos</p>
                </div>
              )}
            </motion.div>

            {/* Notifications Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <BellIcon className="w-5 h-5 text-[#f97316]" />
                  Notificaciones
                </h2>
                {userNotifications.filter((n) => !n.read).length > 0 && (
                  <span className="bg-[#f97316] text-white text-xs font-bold px-2 py-1 rounded-full">
                    {userNotifications.filter((n) => !n.read).length} nuevas
                  </span>
                )}
              </div>

              {userNotifications.length > 0 ? (
                <div className="space-y-3">
                  {userNotifications.map((notification, index) => (
                    <NotificationItem key={notification.id} notification={notification} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BellIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No tienes notificaciones</p>
                </div>
              )}
            </motion.div>

            {/* Recent Matches Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <TrophyIcon className="w-5 h-5 text-[#1e40af]" />
                  Partidos Recientes
                </h2>
              </div>

              {recentMatches.length > 0 ? (
                <div className="space-y-4">
                  {recentMatches.map((match, index) => (
                    <MatchCard key={match.id} match={match} userId={user.id} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrophyIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No tienes partidos recientes</p>
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gradient-to-br from-[#1e40af] to-blue-700 rounded-2xl p-6 text-white"
            >
              <h2 className="text-lg font-semibold mb-4">Acciones Rapidas</h2>
              <div className="space-y-3">
                <Link
                  href="/eventos"
                  className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <CalendarIcon className="w-5 h-5" />
                  <span className="font-medium">Explorar Eventos</span>
                </Link>
                <Link
                  href="/ranking"
                  className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <ChartIcon className="w-5 h-5" />
                  <span className="font-medium">Ver Ranking</span>
                </Link>
                <Link
                  href="/perfil"
                  className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <StarIcon className="w-5 h-5" />
                  <span className="font-medium">Mi Perfil</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

function EventCard({ event, index }: { event: Event; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link
        href={`/eventos/${event.id}`}
        className="flex gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors group"
      >
        <div className="relative w-20 h-20 flex-shrink-0">
          <Image
            src={event.image}
            alt={event.name}
            fill
            className="object-cover rounded-xl"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 group-hover:text-[#1e40af] transition-colors truncate">
            {event.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
            <span className="px-2 py-0.5 bg-slate-100 rounded-full text-xs font-medium">
              {getSportLabel(event.sport)}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1 truncate">
              <LocationIcon className="w-4 h-4" />
              {event.location}
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <ArrowRightIcon className="w-5 h-5 text-slate-400 group-hover:text-[#1e40af] transition-colors" />
        </div>
      </Link>
    </motion.div>
  );
}

function MatchCard({ match, userId, index }: { match: Match; userId: string; index: number }) {
  const player1 = getUserById(match.player1Id);
  const player2 = getUserById(match.player2Id);
  const isWinner = match.winnerId === userId;
  const opponent = match.player1Id === userId ? player2 : player1;
  const userScore = match.player1Id === userId ? match.player1Score : match.player2Score;
  const opponentScore = match.player1Id === userId ? match.player2Score : match.player1Score;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl"
    >
      <div className="relative">
        {opponent && (
          <Image
            src={opponent.avatar}
            alt={opponent.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium text-slate-900">vs {opponent?.name || 'Jugador'}</p>
        <p className="text-sm text-slate-500">{match.court}</p>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${isWinner ? 'text-green-600' : 'text-slate-400'}`}>
            {userScore}
          </span>
          <span className="text-slate-400">-</span>
          <span className={`text-lg font-bold ${!isWinner ? 'text-green-600' : 'text-slate-400'}`}>
            {opponentScore}
          </span>
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            isWinner ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {isWinner ? 'Victoria' : 'Derrota'}
        </span>
      </div>
    </motion.div>
  );
}

function NotificationItem({ notification, index }: { notification: Notification; index: number }) {
  const typeColors: Record<string, string> = {
    event: 'bg-blue-100 text-blue-700',
    match: 'bg-green-100 text-green-700',
    result: 'bg-purple-100 text-purple-700',
    payment: 'bg-orange-100 text-orange-700',
    general: 'bg-slate-100 text-slate-700',
  };

  const typeLabels: Record<string, string> = {
    event: 'Evento',
    match: 'Partido',
    result: 'Resultado',
    payment: 'Pago',
    general: 'General',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`p-3 rounded-xl ${notification.read ? 'bg-slate-50' : 'bg-orange-50 border border-orange-100'}`}
    >
      {notification.link ? (
        <Link href={notification.link} className="block">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[notification.type]}`}>
              {typeLabels[notification.type]}
            </span>
            {!notification.read && (
              <span className="w-2 h-2 bg-[#f97316] rounded-full flex-shrink-0 mt-1" />
            )}
          </div>
          <p className="text-sm font-medium text-slate-900">{notification.title}</p>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notification.message}</p>
        </Link>
      ) : (
        <>
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[notification.type]}`}>
              {typeLabels[notification.type]}
            </span>
            {!notification.read && (
              <span className="w-2 h-2 bg-[#f97316] rounded-full flex-shrink-0 mt-1" />
            )}
          </div>
          <p className="text-sm font-medium text-slate-900">{notification.title}</p>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notification.message}</p>
        </>
      )}
    </motion.div>
  );
}
