'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import {
  TrophyIcon,
  SearchIcon,
  FilterIcon,
  StarIcon,
  FireIcon,
} from '@/components/Icons';
import { getRankings, User, SportType, getSportLabel } from '@/lib/data';

type SportFilter = 'all' | 'tennis' | 'padel';

export default function RankingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [sportFilter, setSportFilter] = useState<SportFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const rankings = useMemo(() => {
    let result = getRankings(sportFilter === 'all' ? undefined : sportFilter as SportType);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(player =>
        player.name.toLowerCase().includes(query) ||
        player.email.toLowerCase().includes(query)
      );
    }

    return result;
  }, [sportFilter, searchQuery]);

  const getMedalColor = (position: number) => {
    switch (position) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-slate-300 to-slate-500';
      case 3:
        return 'from-amber-600 to-amber-800';
      default:
        return 'from-slate-100 to-slate-200';
    }
  };

  const getMedalBgColor = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-yellow-50 border-yellow-200';
      case 2:
        return 'bg-slate-50 border-slate-200';
      case 3:
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-white border-slate-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const sportFilters: { value: SportFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'tennis', label: 'Tenis' },
    { value: 'padel', label: 'Padel' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-20 pb-24 lg:pb-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Ranking de Jugadores</h1>
                <p className="text-slate-600">Clasificacion general por puntos</p>
              </div>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 mb-6"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar jugador..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Sport Filter */}
              <div className="flex items-center gap-2">
                <FilterIcon className="w-5 h-5 text-slate-400 hidden sm:block" />
                <div className="flex bg-slate-100 rounded-xl p-1 w-full sm:w-auto">
                  {sportFilters.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setSportFilter(filter.value)}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        sportFilter === filter.value
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Top 3 Podium - Desktop */}
          {rankings.length >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:grid grid-cols-3 gap-4 mb-8"
            >
              {/* Second Place */}
              <div className="order-1">
                <PodiumCard player={rankings[1]} position={2} currentUserId={user.id} />
              </div>
              {/* First Place */}
              <div className="order-2">
                <PodiumCard player={rankings[0]} position={1} currentUserId={user.id} />
              </div>
              {/* Third Place */}
              <div className="order-3">
                <PodiumCard player={rankings[2]} position={3} currentUserId={user.id} />
              </div>
            </motion.div>
          )}

          {/* Rankings Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            {/* Table Header - Desktop */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100 text-sm font-semibold text-slate-600">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-4">Jugador</div>
              <div className="col-span-2 text-center">Deporte</div>
              <div className="col-span-2 text-center">Rating</div>
              <div className="col-span-2 text-center">V/D</div>
              <div className="col-span-1 text-center">Pts</div>
            </div>

            {/* Rankings List */}
            <div className="divide-y divide-slate-100">
              {rankings.length === 0 ? (
                <div className="px-6 py-12 text-center text-slate-500">
                  No se encontraron jugadores
                </div>
              ) : (
                rankings.map((player, index) => {
                  const position = index + 1;
                  const isCurrentUser = player.id === user.id;
                  const isTopThree = position <= 3;

                  return (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className={`grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center transition-colors ${
                        isCurrentUser
                          ? 'bg-blue-50 border-l-4 border-l-blue-600'
                          : isTopThree
                          ? getMedalBgColor(position)
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Position */}
                      <div className="col-span-2 sm:col-span-1 flex justify-center">
                        {isTopThree ? (
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getMedalColor(position)} flex items-center justify-center`}>
                            <span className="text-white font-bold text-sm">{position}</span>
                          </div>
                        ) : (
                          <span className="text-slate-600 font-semibold">{position}</span>
                        )}
                      </div>

                      {/* Player Info */}
                      <div className="col-span-7 sm:col-span-4 flex items-center gap-3">
                        <div className="relative">
                          <Image
                            src={player.avatar}
                            alt={player.name}
                            width={44}
                            height={44}
                            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover"
                          />
                          {isTopThree && (
                            <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br ${getMedalColor(position)} flex items-center justify-center`}>
                              <TrophyIcon className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className={`font-semibold truncate ${isCurrentUser ? 'text-blue-700' : 'text-slate-900'}`}>
                            {player.name}
                            {isCurrentUser && <span className="text-blue-500 text-xs ml-1">(Tu)</span>}
                          </p>
                          <p className="text-sm text-slate-500 hidden sm:block">{player.email}</p>
                        </div>
                      </div>

                      {/* Sport - Hidden on mobile, shown in player card */}
                      <div className="hidden sm:flex col-span-2 justify-center">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                          {getSportLabel(player.sport)}
                        </span>
                      </div>

                      {/* Rating - Hidden on mobile */}
                      <div className="hidden sm:flex col-span-2 justify-center items-center gap-1">
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold text-slate-700">{player.rating}</span>
                      </div>

                      {/* W/L - Hidden on mobile */}
                      <div className="hidden sm:flex col-span-2 justify-center items-center gap-2">
                        <span className="text-green-600 font-medium">{player.wins}W</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-red-500 font-medium">{player.losses}L</span>
                      </div>

                      {/* Points */}
                      <div className="col-span-3 sm:col-span-1 flex justify-end sm:justify-center items-center gap-1">
                        <FireIcon className="w-4 h-4 text-orange-500" />
                        <span className="font-bold text-slate-900">{player.points}</span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6"
          >
            <div className="bg-white rounded-xl p-4 border border-slate-100">
              <p className="text-slate-500 text-sm">Total Jugadores</p>
              <p className="text-2xl font-bold text-slate-900">{rankings.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-100">
              <p className="text-slate-500 text-sm">Promedio Rating</p>
              <p className="text-2xl font-bold text-slate-900">
                {rankings.length > 0
                  ? Math.round(rankings.reduce((acc, p) => acc + p.rating, 0) / rankings.length)
                  : 0}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-100">
              <p className="text-slate-500 text-sm">Total Partidos</p>
              <p className="text-2xl font-bold text-slate-900">
                {rankings.reduce((acc, p) => acc + p.wins + p.losses, 0)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-100">
              <p className="text-slate-500 text-sm">Tu Posicion</p>
              <p className="text-2xl font-bold text-blue-600">
                #{rankings.findIndex(p => p.id === user.id) + 1 || '-'}
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function PodiumCard({ player, position, currentUserId }: { player: User; position: number; currentUserId: string }) {
  const isCurrentUser = player.id === currentUserId;

  const getMedalGradient = () => {
    switch (position) {
      case 1:
        return 'from-yellow-400 via-yellow-500 to-yellow-600';
      case 2:
        return 'from-slate-300 via-slate-400 to-slate-500';
      case 3:
        return 'from-amber-500 via-amber-600 to-amber-700';
      default:
        return 'from-slate-200 to-slate-300';
    }
  };

  const getHeight = () => {
    switch (position) {
      case 1:
        return 'h-32';
      case 2:
        return 'h-24';
      case 3:
        return 'h-20';
      default:
        return 'h-16';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-2xl p-6 border-2 transition-all ${
        isCurrentUser ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-slate-100'
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <Image
            src={player.avatar}
            alt={player.name}
            width={80}
            height={80}
            className={`w-20 h-20 rounded-full object-cover ring-4 ${
              position === 1 ? 'ring-yellow-400' : position === 2 ? 'ring-slate-300' : 'ring-amber-500'
            }`}
          />
          <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br ${getMedalGradient()} flex items-center justify-center shadow-lg`}>
            <span className="text-white font-bold">{position}</span>
          </div>
        </div>

        <h3 className={`font-semibold text-lg ${isCurrentUser ? 'text-blue-700' : 'text-slate-900'}`}>
          {player.name}
          {isCurrentUser && <span className="text-blue-500 text-xs ml-1">(Tu)</span>}
        </h3>
        <p className="text-sm text-slate-500 mb-4">{getSportLabel(player.sport)}</p>

        <div className="flex items-center gap-4 text-sm mb-4">
          <div className="flex items-center gap-1">
            <StarIcon className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">{player.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-600">{player.wins}W</span>
            <span className="text-slate-300">/</span>
            <span className="text-red-500">{player.losses}L</span>
          </div>
        </div>

        {/* Podium Bar */}
        <div className={`w-full ${getHeight()} bg-gradient-to-t ${getMedalGradient()} rounded-t-lg flex items-center justify-center`}>
          <div className="text-center">
            <FireIcon className="w-5 h-5 text-white mx-auto mb-1" />
            <span className="text-white font-bold text-lg">{player.points}</span>
            <span className="text-white/80 text-xs block">pts</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
