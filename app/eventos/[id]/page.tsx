'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  LocationIcon,
  UsersIcon,
  TrophyIcon,
  CreditCardIcon,
  CheckIcon,
  BracketIcon,
} from '@/components/Icons';
import {
  Event,
  Registration,
  User,
  getEventById,
  getEventRegistrations,
  getUserById,
  getSportLabel,
  getStatusLabel,
  formatDate,
  formatCurrency,
  EventStatus,
} from '@/lib/data';

const statusColors: Record<EventStatus, { bg: string; text: string; border: string }> = {
  upcoming: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  in_progress: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  completed: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
};

const formatLabels: Record<string, string> = {
  single: 'Individual',
  doubles: 'Dobles',
  team: 'Equipos',
};

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [participants, setParticipants] = useState<(User | undefined)[]>([]);

  const eventId = params.id as string;

  useEffect(() => {
    if (eventId) {
      const foundEvent = getEventById(eventId);
      if (foundEvent) {
        setEvent(foundEvent);
        const eventRegistrations = getEventRegistrations(eventId);
        setRegistrations(eventRegistrations);

        // Get participant users
        const participantUsers = eventRegistrations
          .filter((r) => r.status === 'paid' || r.status === 'approved')
          .map((r) => getUserById(r.userId));
        setParticipants(participantUsers);
      }
    }
  }, [eventId]);

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

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="pt-20 pb-24 lg:pb-8">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Evento no encontrado
              </h3>
              <p className="text-slate-600 mb-6">
                El evento que buscas no existe o fue eliminado
              </p>
              <Link
                href="/eventos"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Volver a eventos
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const statusStyle = statusColors[event.status];
  const spotsLeft = event.maxParticipants - event.currentParticipants;
  const isFull = spotsLeft === 0;
  const isUserRegistered = registrations.some(
    (r) => r.userId === user.id || r.partnerId === user.id
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Main Content */}
      <main className="pt-16 pb-24 lg:pb-8">
        {/* Event Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-64 md:h-80 lg:h-96"
        >
          <Image
            src={event.image}
            alt={event.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <Link
              href="/eventos"
              className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl text-slate-700 font-medium hover:bg-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Volver
            </Link>
          </div>

          {/* Event Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <div className="container mx-auto">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                >
                  {getStatusLabel(event.status)}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/90 text-slate-700">
                  {getSportLabel(event.sport)}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/90 text-slate-700">
                  {formatLabels[event.format]}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {event.name}
              </h1>
            </div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 lg:px-6 -mt-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Event Info Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Informacion del Evento
                </h2>
                <p className="text-slate-600 mb-6">{event.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CalendarIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Fecha</p>
                      <p className="font-semibold text-slate-900">
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ClockIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Hora</p>
                      <p className="font-semibold text-slate-900">
                        {event.time} hs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <LocationIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Ubicacion</p>
                      <p className="font-semibold text-slate-900">
                        {event.location}
                      </p>
                      <p className="text-sm text-slate-500">{event.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <UsersIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Participantes</p>
                      <p className="font-semibold text-slate-900">
                        {event.currentParticipants} / {event.maxParticipants}
                      </p>
                      {!isFull && event.status === 'upcoming' && (
                        <p className="text-sm text-green-600">
                          {spotsLeft} lugares disponibles
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rules Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Reglas del Torneo
                </h2>
                <ul className="space-y-3">
                  {event.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-slate-600">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Participants Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Participantes Confirmados
                </h2>
                {participants.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">
                    Aun no hay participantes confirmados
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {participants.map(
                      (participant) =>
                        participant && (
                          <motion.div
                            key={participant.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center p-3 bg-slate-50 rounded-xl"
                          >
                            <Image
                              src={participant.avatar}
                              alt={participant.name}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full object-cover mb-2"
                            />
                            <p className="text-sm font-medium text-slate-900 text-center line-clamp-1">
                              {participant.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              Rating: {participant.rating}
                            </p>
                          </motion.div>
                        )
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Price Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-600">Inscripcion</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(event.entryFee)}
                  </span>
                </div>

                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl mb-6">
                  <TrophyIcon className="w-6 h-6 text-orange-600" />
                  <div>
                    <p className="text-sm text-orange-600">Premio</p>
                    <p className="font-semibold text-orange-700">
                      {event.prize}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {event.status === 'upcoming' && !isUserRegistered && !isFull && (
                    <Link
                      href={`/eventos/${event.id}/inscripcion`}
                      className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold text-center hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CreditCardIcon className="w-5 h-5" />
                      Inscribirse ahora
                    </Link>
                  )}

                  {isUserRegistered && (
                    <div className="w-full py-3 px-4 bg-green-100 text-green-700 rounded-xl font-semibold text-center flex items-center justify-center gap-2">
                      <CheckIcon className="w-5 h-5" />
                      Ya estas inscrito
                    </div>
                  )}

                  {event.status === 'upcoming' && isFull && !isUserRegistered && (
                    <div className="w-full py-3 px-4 bg-slate-100 text-slate-600 rounded-xl font-semibold text-center">
                      Evento completo
                    </div>
                  )}

                  {(event.status === 'in_progress' ||
                    event.status === 'completed') && (
                    <Link
                      href={`/eventos/${event.id}/brackets`}
                      className="w-full py-3 px-4 bg-orange-500 text-white rounded-xl font-semibold text-center hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <BracketIcon className="w-5 h-5" />
                      Ver brackets
                    </Link>
                  )}

                  <Link
                    href="/eventos"
                    className="w-full py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-semibold text-center hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeftIcon className="w-5 h-5" />
                    Volver a eventos
                  </Link>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-4">
                  Informacion Rapida
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Formato</span>
                    <span className="font-medium text-slate-900">
                      {formatLabels[event.format]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Deporte</span>
                    <span className="font-medium text-slate-900">
                      {getSportLabel(event.sport)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Estado</span>
                    <span
                      className={`px-2 py-1 rounded-lg text-sm font-medium ${statusStyle.bg} ${statusStyle.text}`}
                    >
                      {getStatusLabel(event.status)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-500">Cupos</span>
                    <span className="font-medium text-slate-900">
                      {spotsLeft > 0 ? `${spotsLeft} disponibles` : 'Completo'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
