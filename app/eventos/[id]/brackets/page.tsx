'use client';

import { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import {
  getEventById,
  getEventMatches,
  getUserById,
  formatDateTime,
  getSportLabel,
  Match,
  User,
} from '@/lib/data';
import {
  ArrowLeftIcon,
  TrophyIcon,
  ClockIcon,
  CalendarIcon,
  LocationIcon,
} from '@/components/Icons';

interface MatchCardProps {
  match: Match;
  player1: User | undefined;
  player2: User | undefined;
}

function MatchCard({ match, player1, player2 }: MatchCardProps) {
  const isCompleted = match.status === 'completed';
  const isScheduled = match.status === 'scheduled';
  const isInProgress = match.status === 'in_progress';

  const player1Won = match.winnerId === match.player1Id;
  const player2Won = match.winnerId === match.player2Id;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-w-[240px] sm:min-w-[280px]"
    >
      {/* Match Header */}
      <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">
          {match.court && `Cancha: ${match.court}`}
        </span>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            isCompleted
              ? 'bg-green-100 text-green-700'
              : isInProgress
              ? 'bg-orange-100 text-orange-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {isCompleted ? 'Finalizado' : isInProgress ? 'En juego' : 'Programado'}
        </span>
      </div>

      {/* Player 1 */}
      <div
        className={`flex items-center justify-between p-3 border-b border-slate-100 ${
          player1Won ? 'bg-green-50' : ''
        }`}
      >
        <div className="flex items-center gap-2">
          {player1 ? (
            <>
              <Image
                src={player1.avatar}
                alt={player1.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span
                className={`text-sm font-medium ${
                  player1Won ? 'text-green-700' : 'text-slate-700'
                }`}
              >
                {player1.name}
              </span>
            </>
          ) : (
            <span className="text-sm text-slate-400 italic">Por definir</span>
          )}
        </div>
        {isCompleted && match.player1Score !== undefined && (
          <span
            className={`text-lg font-bold ${
              player1Won ? 'text-green-600' : 'text-slate-400'
            }`}
          >
            {match.player1Score}
          </span>
        )}
        {player1Won && (
          <TrophyIcon className="w-4 h-4 text-yellow-500 ml-1" />
        )}
      </div>

      {/* VS Divider */}
      <div className="flex items-center justify-center py-1 bg-slate-50">
        <span className="text-xs font-medium text-slate-400">VS</span>
      </div>

      {/* Player 2 */}
      <div
        className={`flex items-center justify-between p-3 ${
          player2Won ? 'bg-green-50' : ''
        }`}
      >
        <div className="flex items-center gap-2">
          {player2 ? (
            <>
              <Image
                src={player2.avatar}
                alt={player2.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span
                className={`text-sm font-medium ${
                  player2Won ? 'text-green-700' : 'text-slate-700'
                }`}
              >
                {player2.name}
              </span>
            </>
          ) : (
            <span className="text-sm text-slate-400 italic">Por definir</span>
          )}
        </div>
        {isCompleted && match.player2Score !== undefined && (
          <span
            className={`text-lg font-bold ${
              player2Won ? 'text-green-600' : 'text-slate-400'
            }`}
          >
            {match.player2Score}
          </span>
        )}
        {player2Won && (
          <TrophyIcon className="w-4 h-4 text-yellow-500 ml-1" />
        )}
      </div>

      {/* Scheduled Time */}
      {isScheduled && match.scheduledTime && (
        <div className="px-3 py-2 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <ClockIcon className="w-4 h-4" />
            <span>{formatDateTime(match.scheduledTime)}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function BracketsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const eventId = params.id as string;
  const event = getEventById(eventId);
  const matches = getEventMatches(eventId);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Organize matches by rounds
  const matchesByRound = useMemo(() => {
    const grouped: { [key: number]: Match[] } = {};
    matches.forEach((match) => {
      if (!grouped[match.round]) {
        grouped[match.round] = [];
      }
      grouped[match.round].push(match);
    });
    // Sort matches within each round by position
    Object.keys(grouped).forEach((round) => {
      grouped[Number(round)].sort((a, b) => a.position - b.position);
    });
    return grouped;
  }, [matches]);

  const totalRounds = Math.max(...Object.keys(matchesByRound).map(Number), 0);

  const getRoundName = (round: number): string => {
    if (totalRounds === 0) return '';
    const roundsFromFinal = totalRounds - round + 1;
    switch (roundsFromFinal) {
      case 1:
        return 'Final';
      case 2:
        return 'Semifinal';
      case 3:
        return 'Cuartos de Final';
      case 4:
        return 'Octavos de Final';
      default:
        return `Ronda ${round}`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="pt-20 lg:pt-24 pb-24 lg:pb-8 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">
              Evento no encontrado
            </h1>
            <Link href="/eventos" className="text-blue-600 hover:underline">
              Volver a eventos
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-20 lg:pt-24 pb-24 lg:pb-8 px-4">
        <div className="container mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              href={`/eventos/${eventId}`}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Volver al evento
            </Link>
          </motion.div>

          {/* Event Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 sm:p-8 mb-8 text-white"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-3">
                  {getSportLabel(event.sport)}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{event.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-blue-100">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LocationIcon className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-xl p-4 text-center">
                  <TrophyIcon className="w-8 h-8 mx-auto mb-1 text-orange-300" />
                  <p className="text-sm font-medium">{event.prize}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Brackets Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrophyIcon className="w-6 h-6 text-orange-500" />
              Brackets del Torneo
            </h2>

            {matches.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrophyIcon className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Brackets no disponibles
                </h3>
                <p className="text-slate-500">
                  Los brackets se generaran una vez que se complete el registro de
                  participantes.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
                {/* Responsive horizontal scroll container */}
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-6 sm:gap-8 min-w-max">
                    {Object.keys(matchesByRound)
                      .map(Number)
                      .sort((a, b) => a - b)
                      .map((round, roundIndex) => (
                        <motion.div
                          key={round}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: roundIndex * 0.1 }}
                          className="flex flex-col"
                        >
                          {/* Round Header */}
                          <div className="text-center mb-4">
                            <h3 className="text-sm font-semibold text-slate-900 bg-slate-100 px-4 py-2 rounded-lg">
                              {getRoundName(round)}
                            </h3>
                          </div>

                          {/* Matches in this round */}
                          <div className="flex flex-col gap-4 justify-around flex-1">
                            {matchesByRound[round].map((match, matchIndex) => {
                              const player1 = getUserById(match.player1Id);
                              const player2 = getUserById(match.player2Id);

                              return (
                                <motion.div
                                  key={match.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    delay: roundIndex * 0.1 + matchIndex * 0.05,
                                  }}
                                >
                                  <MatchCard
                                    match={match}
                                    player1={player1}
                                    player2={player2}
                                  />
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      ))}

                    {/* Champion Column (if final is completed) */}
                    {totalRounds > 0 &&
                      matchesByRound[totalRounds]?.[0]?.winnerId && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 }}
                          className="flex flex-col items-center justify-center"
                        >
                          <div className="text-center mb-4">
                            <h3 className="text-sm font-semibold text-orange-600 bg-orange-100 px-4 py-2 rounded-lg">
                              Campeon
                            </h3>
                          </div>
                          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-center shadow-lg min-w-[200px]">
                            {(() => {
                              const winner = getUserById(
                                matchesByRound[totalRounds][0].winnerId!
                              );
                              if (!winner) return null;
                              return (
                                <>
                                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                                    <TrophyIcon className="w-10 h-10 text-yellow-500" />
                                  </div>
                                  <Image
                                    src={winner.avatar}
                                    alt={winner.name}
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-4 border-white shadow-md"
                                  />
                                  <h4 className="text-lg font-bold text-white">
                                    {winner.name}
                                  </h4>
                                  <p className="text-sm text-yellow-100">
                                    Rating: {winner.rating}
                                  </p>
                                </>
                              );
                            })()}
                          </div>
                        </motion.div>
                      )}
                  </div>
                </div>

                {/* Mobile scroll hint */}
                <div className="sm:hidden text-center mt-2">
                  <p className="text-xs text-slate-400">
                    Desliza para ver mas rondas
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Match List (Alternative View) */}
          {matches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Lista de Partidos
              </h2>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">
                          Ronda
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">
                          Jugador 1
                        </th>
                        <th className="text-center px-4 py-3 text-sm font-semibold text-slate-600">
                          Resultado
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">
                          Jugador 2
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">
                          Estado
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">
                          Cancha
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {matches
                        .sort((a, b) => a.round - b.round || a.position - b.position)
                        .map((match) => {
                          const player1 = getUserById(match.player1Id);
                          const player2 = getUserById(match.player2Id);
                          const player1Won = match.winnerId === match.player1Id;
                          const player2Won = match.winnerId === match.player2Id;

                          return (
                            <tr
                              key={match.id}
                              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                            >
                              <td className="px-4 py-3 text-sm text-slate-600">
                                {getRoundName(match.round)}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  {player1 && (
                                    <>
                                      <Image
                                        src={player1.avatar}
                                        alt={player1.name}
                                        width={28}
                                        height={28}
                                        className="w-7 h-7 rounded-full object-cover"
                                      />
                                      <span
                                        className={`text-sm font-medium ${
                                          player1Won
                                            ? 'text-green-600'
                                            : 'text-slate-700'
                                        }`}
                                      >
                                        {player1.name}
                                      </span>
                                      {player1Won && (
                                        <TrophyIcon className="w-4 h-4 text-yellow-500" />
                                      )}
                                    </>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {match.status === 'completed' ? (
                                  <span className="font-mono font-bold text-slate-900">
                                    {match.player1Score} - {match.player2Score}
                                  </span>
                                ) : (
                                  <span className="text-slate-400">vs</span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  {player2 && (
                                    <>
                                      <Image
                                        src={player2.avatar}
                                        alt={player2.name}
                                        width={28}
                                        height={28}
                                        className="w-7 h-7 rounded-full object-cover"
                                      />
                                      <span
                                        className={`text-sm font-medium ${
                                          player2Won
                                            ? 'text-green-600'
                                            : 'text-slate-700'
                                        }`}
                                      >
                                        {player2.name}
                                      </span>
                                      {player2Won && (
                                        <TrophyIcon className="w-4 h-4 text-yellow-500" />
                                      )}
                                    </>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                    match.status === 'completed'
                                      ? 'bg-green-100 text-green-700'
                                      : match.status === 'in_progress'
                                      ? 'bg-orange-100 text-orange-700'
                                      : 'bg-blue-100 text-blue-700'
                                  }`}
                                >
                                  {match.status === 'completed'
                                    ? 'Finalizado'
                                    : match.status === 'in_progress'
                                    ? 'En juego'
                                    : 'Programado'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-600">
                                {match.court || '-'}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <Link
              href={`/eventos/${eventId}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Volver al Evento
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
