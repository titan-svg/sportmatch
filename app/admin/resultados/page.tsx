'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import {
  TrophyIcon,
  CheckIcon,
  CalendarIcon,
  FilterIcon,
} from '@/components/Icons';
import {
  events,
  Match,
  Event,
  getEventMatches,
  getUserById,
  getStatusLabel,
} from '@/lib/data';

export default function AdminResultadosPage() {
  const { user, isLoading, isAdmin, isCoordinator } = useAuth();
  const router = useRouter();
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [savedMatches, setSavedMatches] = useState<Set<string>>(new Set());

  const eventsWithMatches = events.filter(e =>
    e.status === 'in_progress' || e.status === 'completed'
  );

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && user && !isAdmin && !isCoordinator) {
      router.push('/dashboard');
    }
  }, [user, isLoading, isAdmin, isCoordinator, router]);

  useEffect(() => {
    if (selectedEventId) {
      const eventMatches = getEventMatches(selectedEventId);
      setMatches(eventMatches);
    } else {
      setMatches([]);
    }
  }, [selectedEventId]);

  const handleScoreChange = (matchId: string, player: 'player1' | 'player2', score: string) => {
    const numScore = parseInt(score) || 0;
    setMatches(matches.map(m => {
      if (m.id !== matchId) return m;

      const updatedMatch = {
        ...m,
        [player === 'player1' ? 'player1Score' : 'player2Score']: numScore,
      };

      // Auto-select winner based on score
      if (updatedMatch.player1Score !== undefined && updatedMatch.player2Score !== undefined) {
        if (updatedMatch.player1Score > updatedMatch.player2Score) {
          updatedMatch.winnerId = updatedMatch.player1Id;
        } else if (updatedMatch.player2Score > updatedMatch.player1Score) {
          updatedMatch.winnerId = updatedMatch.player2Id;
        } else {
          updatedMatch.winnerId = undefined;
        }
      }

      return updatedMatch;
    }));

    // Remove from saved when edited
    setSavedMatches(prev => {
      const next = new Set(prev);
      next.delete(matchId);
      return next;
    });
  };

  const handleSaveResult = (matchId: string) => {
    setMatches(matches.map(m =>
      m.id === matchId ? { ...m, status: 'completed' as const } : m
    ));
    setSavedMatches(prev => new Set(prev).add(matchId));
  };

  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'in_progress':
        return 'bg-orange-100 text-orange-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getMatchStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Programado';
      case 'in_progress':
        return 'En curso';
      case 'completed':
        return 'Finalizado';
      default:
        return status;
    }
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || (!isAdmin && !isCoordinator)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-20 pb-24 lg:pb-8 px-4 lg:px-6">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              Ingresar Resultados
            </h1>
            <p className="text-slate-600 mt-1">
              Registra los resultados de los partidos de cada evento
            </p>
          </motion.div>

          {/* Event Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-slate-200 p-6 mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <FilterIcon className="w-5 h-5 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Seleccionar evento:</span>
            </div>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            >
              <option value="">-- Selecciona un evento --</option>
              {eventsWithMatches.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name} - {getStatusLabel(event.status)}
                </option>
              ))}
            </select>

            {selectedEvent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-blue-50 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${selectedEvent.image})` }}
                  />
                  <div>
                    <h3 className="font-semibold text-slate-900">{selectedEvent.name}</h3>
                    <p className="text-sm text-slate-600">{selectedEvent.location}</p>
                    <p className="text-sm text-blue-600 font-medium">
                      {matches.length} partidos - {matches.filter(m => m.status === 'completed').length} completados
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Matches List */}
          {selectedEventId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {matches.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                  <TrophyIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No hay partidos para este evento</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Partidos del Evento
                    </h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {matches.length} partidos
                    </span>
                  </div>

                  <AnimatePresence>
                    {matches.map((match, index) => {
                      const player1 = getUserById(match.player1Id);
                      const player2 = getUserById(match.player2Id);
                      const winner = match.winnerId ? getUserById(match.winnerId) : null;
                      const isSaved = savedMatches.has(match.id);

                      if (!player1 || !player2) return null;

                      return (
                        <motion.div
                          key={match.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className={`bg-white rounded-xl border ${
                            isSaved ? 'border-green-300' : 'border-slate-200'
                          } p-6`}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-4">
                              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                                Ronda {match.round} - Partido {match.position}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMatchStatusColor(match.status)}`}>
                                {getMatchStatusLabel(match.status)}
                              </span>
                              {match.court && (
                                <span className="text-sm text-slate-500">
                                  {match.court}
                                </span>
                              )}
                            </div>
                            {isSaved && (
                              <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-1 text-green-600 text-sm font-medium"
                              >
                                <CheckIcon className="w-4 h-4" />
                                Guardado
                              </motion.span>
                            )}
                          </div>

                          <div className="grid lg:grid-cols-[1fr_auto_1fr_auto] gap-4 items-center">
                            {/* Player 1 */}
                            <div className={`flex items-center gap-4 p-4 rounded-xl ${
                              match.winnerId === player1.id
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-slate-50'
                            }`}>
                              <Image
                                src={player1.avatar}
                                alt={player1.name}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <p className="font-semibold text-slate-900">{player1.name}</p>
                                <p className="text-sm text-slate-500">Rating: {player1.rating}</p>
                              </div>
                              {match.winnerId === player1.id && (
                                <TrophyIcon className="w-6 h-6 text-orange-500" />
                              )}
                            </div>

                            {/* Score Input Player 1 */}
                            <div className="flex items-center justify-center">
                              <input
                                type="number"
                                min="0"
                                max="99"
                                value={match.player1Score ?? ''}
                                onChange={(e) => handleScoreChange(match.id, 'player1', e.target.value)}
                                className="w-16 h-16 text-center text-2xl font-bold bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                                placeholder="0"
                              />
                            </div>

                            {/* Score Input Player 2 */}
                            <div className="flex items-center justify-center lg:order-4">
                              <input
                                type="number"
                                min="0"
                                max="99"
                                value={match.player2Score ?? ''}
                                onChange={(e) => handleScoreChange(match.id, 'player2', e.target.value)}
                                className="w-16 h-16 text-center text-2xl font-bold bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                                placeholder="0"
                              />
                            </div>

                            {/* Player 2 */}
                            <div className={`flex items-center gap-4 p-4 rounded-xl lg:order-3 ${
                              match.winnerId === player2.id
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-slate-50'
                            }`}>
                              <Image
                                src={player2.avatar}
                                alt={player2.name}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <p className="font-semibold text-slate-900">{player2.name}</p>
                                <p className="text-sm text-slate-500">Rating: {player2.rating}</p>
                              </div>
                              {match.winnerId === player2.id && (
                                <TrophyIcon className="w-6 h-6 text-orange-500" />
                              )}
                            </div>
                          </div>

                          {/* Winner Display & Save Button */}
                          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-100">
                            <div>
                              {winner ? (
                                <p className="text-sm text-slate-600">
                                  Ganador: <span className="font-semibold text-green-600">{winner.name}</span>
                                </p>
                              ) : (
                                <p className="text-sm text-slate-400">
                                  Ingresa los puntajes para determinar el ganador
                                </p>
                              )}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSaveResult(match.id)}
                              disabled={!winner || isSaved}
                              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
                                !winner
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                  : isSaved
                                  ? 'bg-green-100 text-green-700 cursor-default'
                                  : 'bg-orange-500 text-white hover:bg-orange-600'
                              }`}
                            >
                              {isSaved ? (
                                <>
                                  <CheckIcon className="w-5 h-5" />
                                  Resultado Guardado
                                </>
                              ) : (
                                <>
                                  <CheckIcon className="w-5 h-5" />
                                  Guardar Resultado
                                </>
                              )}
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          )}

          {/* No Event Selected */}
          {!selectedEventId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-slate-200 p-12 text-center"
            >
              <CalendarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Selecciona un evento
              </h3>
              <p className="text-slate-500">
                Elige un evento del selector para ver y registrar los resultados de los partidos
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
