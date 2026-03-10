'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import {
  UserIcon,
  EditIcon,
  TrophyIcon,
  CalendarIcon,
  StarIcon,
  FireIcon,
  ClockIcon,
  CheckIcon,
  XIcon,
  ArrowRightIcon,
} from '@/components/Icons';
import {
  getUserMatches,
  getUserRegistrations,
  getEventById,
  getUserById,
  getSportLabel,
  formatDate,
  getRegistrationStatusLabel,
  Match,
  Registration,
} from '@/lib/data';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const userMatches = getUserMatches(user.id);
  const userRegistrations = getUserRegistrations(user.id);
  const winRate = user.wins + user.losses > 0
    ? Math.round((user.wins / (user.wins + user.losses)) * 100)
    : 0;

  const getMatchResult = (match: Match) => {
    if (match.status !== 'completed') return null;
    return match.winnerId === user.id ? 'win' : 'loss';
  };

  const getOpponent = (match: Match) => {
    const opponentId = match.player1Id === user.id ? match.player2Id : match.player1Id;
    return getUserById(opponentId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'approved':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-20 pb-24 lg:pb-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6"
          >
            {/* Cover */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800" />

            {/* Profile Info */}
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16">
                <div className="relative">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={128}
                    height={128}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex-1 pt-2 sm:pt-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{user.name}</h1>
                      <p className="text-slate-500">{user.email}</p>
                    </div>
                    <Link
                      href="/perfil/editar"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <EditIcon className="w-4 h-4" />
                      Editar Perfil
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <TrophyIcon className="w-5 h-5 text-yellow-500" />
                    <span className="text-2xl font-bold text-slate-900">{user.wins}</span>
                  </div>
                  <p className="text-sm text-slate-500">Victorias</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <XIcon className="w-5 h-5 text-red-500" />
                    <span className="text-2xl font-bold text-slate-900">{user.losses}</span>
                  </div>
                  <p className="text-sm text-slate-500">Derrotas</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <StarIcon className="w-5 h-5 text-blue-500" />
                    <span className="text-2xl font-bold text-slate-900">{user.rating}</span>
                  </div>
                  <p className="text-sm text-slate-500">Rating</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <FireIcon className="w-5 h-5 text-orange-500" />
                    <span className="text-2xl font-bold text-slate-900">{user.points}</span>
                  </div>
                  <p className="text-sm text-slate-500">Puntos</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Match History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrophyIcon className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-slate-900">Historial de Partidos</h2>
                  </div>
                  <span className="text-sm text-slate-500">{userMatches.length} partidos</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {userMatches.length === 0 ? (
                    <div className="px-6 py-12 text-center text-slate-500">
                      <TrophyIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p>No tienes partidos registrados</p>
                    </div>
                  ) : (
                    userMatches.map((match) => {
                      const result = getMatchResult(match);
                      const opponent = getOpponent(match);
                      const event = getEventById(match.eventId);

                      return (
                        <div key={match.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            {/* Result Badge */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              result === 'win'
                                ? 'bg-green-100'
                                : result === 'loss'
                                ? 'bg-red-100'
                                : 'bg-slate-100'
                            }`}>
                              {result === 'win' ? (
                                <CheckIcon className="w-6 h-6 text-green-600" />
                              ) : result === 'loss' ? (
                                <XIcon className="w-6 h-6 text-red-600" />
                              ) : (
                                <ClockIcon className="w-6 h-6 text-slate-400" />
                              )}
                            </div>

                            {/* Match Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`font-semibold ${
                                  result === 'win' ? 'text-green-600' : result === 'loss' ? 'text-red-600' : 'text-slate-900'
                                }`}>
                                  {result === 'win' ? 'Victoria' : result === 'loss' ? 'Derrota' : 'Programado'}
                                </span>
                                {match.status === 'completed' && (
                                  <span className="text-slate-400">
                                    {match.player1Id === user.id
                                      ? `${match.player1Score} - ${match.player2Score}`
                                      : `${match.player2Score} - ${match.player1Score}`}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-600">
                                vs {opponent?.name || 'TBD'}
                              </p>
                              <p className="text-xs text-slate-400 mt-1">{event?.name}</p>
                            </div>

                            {/* Opponent Avatar */}
                            {opponent && (
                              <Image
                                src={opponent.avatar}
                                alt={opponent.name}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>

              {/* Registered Events */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-slate-900">Eventos Registrados</h2>
                  </div>
                  <span className="text-sm text-slate-500">{userRegistrations.length} eventos</span>
                </div>

                <div className="divide-y divide-slate-100">
                  {userRegistrations.length === 0 ? (
                    <div className="px-6 py-12 text-center text-slate-500">
                      <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p>No estas inscrito en ningun evento</p>
                      <Link
                        href="/eventos"
                        className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700"
                      >
                        Ver eventos disponibles
                        <ArrowRightIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : (
                    userRegistrations.map((registration) => {
                      const event = getEventById(registration.eventId);
                      if (!event) return null;

                      return (
                        <Link
                          key={registration.id}
                          href={`/eventos/${event.id}`}
                          className="block px-6 py-4 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <Image
                              src={event.image}
                              alt={event.name}
                              width={64}
                              height={64}
                              className="w-16 h-16 rounded-xl object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-slate-900 truncate">{event.name}</h3>
                              <p className="text-sm text-slate-500">{formatDate(event.date)}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(registration.status)}`}>
                                  {getRegistrationStatusLabel(registration.status)}
                                </span>
                                <span className="text-xs text-slate-400">{getSportLabel(event.sport)}</span>
                              </div>
                            </div>
                            <ArrowRightIcon className="w-5 h-5 text-slate-400" />
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Points & Ranking Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <TrophyIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">Tu Ranking</p>
                    <p className="text-2xl font-bold">#{user.points > 0 ? '1' : '-'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Puntos Totales</span>
                    <span className="text-xl font-bold">{user.points}</span>
                  </div>
                  <div className="h-px bg-white/20" />
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Win Rate</span>
                    <span className="text-xl font-bold">{winRate}%</span>
                  </div>
                  <div className="h-px bg-white/20" />
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Rating ELO</span>
                    <span className="text-xl font-bold">{user.rating}</span>
                  </div>
                </div>

                <Link
                  href="/ranking"
                  className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors"
                >
                  Ver Ranking Completo
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Profile Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
              >
                <h3 className="font-semibold text-slate-900 mb-4">Informacion del Perfil</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Deporte Principal</p>
                    <p className="font-medium text-slate-900">{getSportLabel(user.sport)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Telefono</p>
                    <p className="font-medium text-slate-900">{user.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Miembro desde</p>
                    <p className="font-medium text-slate-900">{formatDate(user.joinedAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Rol</p>
                    <p className="font-medium text-slate-900 capitalize">{user.role}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
