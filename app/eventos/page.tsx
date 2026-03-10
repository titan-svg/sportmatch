'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import {
  SearchIcon,
  FilterIcon,
  CalendarIcon,
  LocationIcon,
  UsersIcon,
  ArrowRightIcon,
} from '@/components/Icons';
import {
  events,
  Event,
  SportType,
  EventStatus,
  getSportLabel,
  getStatusLabel,
  formatDate,
  formatCurrency,
} from '@/lib/data';

const sportFilters: { value: SportType | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'tennis', label: 'Tenis' },
  { value: 'padel', label: 'Padel' },
  { value: 'soccer', label: 'Futbol' },
  { value: 'basketball', label: 'Basquet' },
  { value: 'volleyball', label: 'Voley' },
];

const statusColors: Record<EventStatus, { bg: string; text: string }> = {
  upcoming: { bg: 'bg-blue-100', text: 'text-blue-700' },
  in_progress: { bg: 'bg-orange-100', text: 'text-orange-700' },
  completed: { bg: 'bg-slate-100', text: 'text-slate-600' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-600' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

export default function EventosPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sportFilter, setSportFilter] = useState<SportType | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSport = sportFilter === 'all' || event.sport === sportFilter;

      return matchesSearch && matchesSport;
    });
  }, [searchQuery, sportFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Main Content */}
      <main className="pt-20 pb-24 lg:pb-8">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Eventos</h1>
            <p className="text-slate-600">
              Encuentra y participa en los mejores torneos deportivos
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-3 rounded-xl border transition-colors flex items-center gap-2 ${
                  showFilters
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <FilterIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Filtros</span>
              </button>
            </div>

            {/* Sport Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2"
              >
                {sportFilters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setSportFilter(filter.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      sportFilter === filter.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No se encontraron eventos
              </h3>
              <p className="text-slate-600">
                Intenta ajustar los filtros de busqueda
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const statusStyle = statusColors[event.status];
  const spotsLeft = event.maxParticipants - event.currentParticipants;
  const isFull = spotsLeft === 0;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-shadow"
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={event.image}
          alt={event.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
          >
            {getStatusLabel(event.status)}
          </span>
        </div>

        {/* Sport Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-700">
            {getSportLabel(event.sport)}
          </span>
        </div>

        {/* Event Title on Image */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-bold text-white line-clamp-2">
            {event.name}
          </h3>
        </div>
      </div>

      {/* Event Info */}
      <div className="p-4 space-y-3">
        {/* Date and Location */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-600">
            <CalendarIcon className="w-4 h-4 text-blue-600" />
            <span className="text-sm">
              {formatDate(event.date)} - {event.time}hs
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <LocationIcon className="w-4 h-4 text-orange-500" />
            <span className="text-sm line-clamp-1">{event.location}</span>
          </div>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">
              {event.currentParticipants}/{event.maxParticipants} participantes
            </span>
          </div>
          {!isFull && event.status === 'upcoming' && (
            <span className="text-xs font-medium text-green-600">
              {spotsLeft} lugares
            </span>
          )}
          {isFull && (
            <span className="text-xs font-medium text-red-600">Completo</span>
          )}
        </div>

        {/* Entry Fee */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-sm text-slate-500">Inscripcion</span>
          <span className="font-semibold text-blue-600">
            {formatCurrency(event.entryFee)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link
            href={`/eventos/${event.id}`}
            className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium text-center hover:bg-slate-200 transition-colors"
          >
            Ver detalles
          </Link>
          {event.status === 'upcoming' && !isFull && (
            <Link
              href={`/eventos/${event.id}/inscripcion`}
              className="flex-1 py-2.5 px-4 bg-blue-600 text-white rounded-xl text-sm font-medium text-center hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
            >
              Inscribirse
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          )}
          {event.status === 'in_progress' && (
            <Link
              href={`/eventos/${event.id}/brackets`}
              className="flex-1 py-2.5 px-4 bg-orange-500 text-white rounded-xl text-sm font-medium text-center hover:bg-orange-600 transition-colors"
            >
              Ver brackets
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
