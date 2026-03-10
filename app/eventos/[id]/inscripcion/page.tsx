'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import {
  getEventById,
  formatCurrency,
  formatDate,
  getSportLabel,
  users,
  User,
} from '@/lib/data';
import {
  ArrowLeftIcon,
  CalendarIcon,
  LocationIcon,
  ClockIcon,
  UsersIcon,
  TrophyIcon,
  CreditCardIcon,
  CheckIcon,
  SearchIcon,
  MailIcon,
  XIcon,
} from '@/components/Icons';

export default function EventRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const eventId = params.id as string;
  const event = getEventById(eventId);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  // Partner fields for doubles
  const [partnerSearchMode, setPartnerSearchMode] = useState<'email' | 'search'>('email');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerSearch, setPartnerSearch] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<User | null>(null);
  const [showPartnerDropdown, setShowPartnerDropdown] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

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
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Evento no encontrado</h1>
            <Link href="/eventos" className="text-blue-600 hover:underline">
              Volver a eventos
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isDoubles = event.format === 'doubles';
  const availablePlayers = users.filter(
    (u) => u.id !== user.id && u.role === 'player'
  );
  const filteredPlayers = availablePlayers.filter(
    (u) =>
      u.name.toLowerCase().includes(partnerSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(partnerSearch.toLowerCase())
  );

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsPaid(true);
    setIsProcessingPayment(false);
  };

  const handleSubmitRegistration = async () => {
    if (!termsAccepted || !isPaid) return;
    if (isDoubles && !selectedPartner && !partnerEmail) return;

    setIsSubmitting(true);
    // Simulate registration submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRegistrationComplete(true);
    setIsSubmitting(false);
  };

  const canSubmit =
    termsAccepted &&
    isPaid &&
    (!isDoubles || selectedPartner || partnerEmail);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-20 lg:pt-24 pb-24 lg:pb-8 px-4">
        <div className="container mx-auto max-w-3xl">
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

          {/* Success Modal */}
          <AnimatePresence>
            {registrationComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckIcon className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Inscripcion Exitosa
                  </h2>
                  <p className="text-slate-600 mb-6">
                    Te has inscrito correctamente al {event.name}.
                    {isDoubles && selectedPartner && (
                      <span> Se ha enviado una invitacion a {selectedPartner.name}.</span>
                    )}
                    {isDoubles && partnerEmail && !selectedPartner && (
                      <span> Se ha enviado una invitacion a {partnerEmail}.</span>
                    )}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/eventos/${eventId}`}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Ver Evento
                    </Link>
                    <Link
                      href="/eventos"
                      className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      Ver Eventos
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page Title */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-slate-900 mb-8"
          >
            Inscripcion al Evento
          </motion.h1>

          {/* Event Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6"
          >
            <div className="relative h-40 sm:h-48">
              <Image
                src={event.image}
                alt={event.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full mb-2">
                  {getSportLabel(event.sport)}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">{event.name}</h2>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <ClockIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">{event.time} hs</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <LocationIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm truncate">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <UsersIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">
                    {event.currentParticipants}/{event.maxParticipants}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrophyIcon className="w-5 h-5 text-orange-500" />
                  <span className="text-slate-700 font-medium">{event.prize}</span>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium capitalize">
                  {event.format === 'doubles' ? 'Dobles' : event.format === 'single' ? 'Individual' : 'Equipo'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Datos de Inscripcion
            </h3>

            {/* Player Info */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl mb-6">
              <Image
                src={user.avatar}
                alt={user.name}
                width={56}
                height={56}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
                <p className="text-sm text-blue-600">Rating: {user.rating}</p>
              </div>
            </div>

            {/* Partner Section for Doubles */}
            {isDoubles && (
              <div className="mb-6">
                <h4 className="text-md font-semibold text-slate-900 mb-3">
                  Invitar Companero
                </h4>
                <p className="text-sm text-slate-600 mb-4">
                  Este es un torneo de dobles. Invita a tu companero para completar la inscripcion.
                </p>

                {/* Toggle between email and search */}
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setPartnerSearchMode('email');
                      setSelectedPartner(null);
                      setPartnerSearch('');
                    }}
                    className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${
                      partnerSearchMode === 'email'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <MailIcon className="w-4 h-4 inline mr-2" />
                    Por Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPartnerSearchMode('search');
                      setPartnerEmail('');
                    }}
                    className={`flex-1 px-4 py-2 rounded-xl font-medium transition-colors ${
                      partnerSearchMode === 'search'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <SearchIcon className="w-4 h-4 inline mr-2" />
                    Buscar Jugador
                  </button>
                </div>

                {partnerSearchMode === 'email' ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email del companero
                    </label>
                    <input
                      type="email"
                      value={partnerEmail}
                      onChange={(e) => setPartnerEmail(e.target.value)}
                      placeholder="companero@email.com"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      Se enviara una invitacion al email indicado.
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Buscar jugador registrado
                    </label>
                    {selectedPartner ? (
                      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Image
                            src={selectedPartner.avatar}
                            alt={selectedPartner.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-slate-900">
                              {selectedPartner.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              Rating: {selectedPartner.rating}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedPartner(null)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <XIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="relative">
                          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            value={partnerSearch}
                            onChange={(e) => {
                              setPartnerSearch(e.target.value);
                              setShowPartnerDropdown(true);
                            }}
                            onFocus={() => setShowPartnerDropdown(true)}
                            placeholder="Buscar por nombre o email..."
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <AnimatePresence>
                          {showPartnerDropdown && partnerSearch && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute z-10 left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 max-h-60 overflow-y-auto"
                            >
                              {filteredPlayers.length > 0 ? (
                                filteredPlayers.map((player) => (
                                  <button
                                    key={player.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedPartner(player);
                                      setShowPartnerDropdown(false);
                                      setPartnerSearch('');
                                    }}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                                  >
                                    <Image
                                      src={player.avatar}
                                      alt={player.name}
                                      width={40}
                                      height={40}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="text-left">
                                      <p className="font-medium text-slate-900">
                                        {player.name}
                                      </p>
                                      <p className="text-sm text-slate-500">
                                        {player.email} - Rating: {player.rating}
                                      </p>
                                    </div>
                                  </button>
                                ))
                              ) : (
                                <div className="p-4 text-center text-slate-500">
                                  No se encontraron jugadores
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Rules */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-slate-900 mb-3">
                Reglas del Torneo
              </h4>
              <ul className="space-y-2">
                {event.rules.map((rule, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <CheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600">
                Acepto los{' '}
                <Link href="/terminos" className="text-blue-600 hover:underline">
                  terminos y condiciones
                </Link>{' '}
                del evento y las reglas del torneo. Entiendo que la inscripcion
                es definitiva una vez realizado el pago.
              </span>
            </label>
          </motion.div>

          {/* Payment Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Pago de Inscripcion
            </h3>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl mb-4">
              <div>
                <p className="text-sm text-slate-600">Cuota de inscripcion</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(event.entryFee)}
                </p>
              </div>
              <CreditCardIcon className="w-10 h-10 text-orange-500" />
            </div>

            {isPaid ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">Pago Completado</p>
                  <p className="text-sm text-green-600">
                    Tu pago ha sido procesado exitosamente.
                  </p>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handlePayment}
                disabled={isProcessingPayment}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCardIcon className="w-5 h-5" />
                    Pagar {formatCurrency(event.entryFee)}
                  </>
                )}
              </button>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <button
              type="button"
              onClick={handleSubmitRegistration}
              disabled={!canSubmit || isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Procesando inscripcion...
                </>
              ) : (
                <>
                  <CheckIcon className="w-5 h-5" />
                  Confirmar Inscripcion
                </>
              )}
            </button>

            {!canSubmit && (
              <p className="text-center text-sm text-slate-500">
                {!termsAccepted && 'Debes aceptar los terminos y condiciones. '}
                {!isPaid && 'Debes completar el pago. '}
                {isDoubles && !selectedPartner && !partnerEmail && 'Debes invitar a un companero.'}
              </p>
            )}

            <Link
              href={`/eventos/${eventId}`}
              className="block w-full text-center px-6 py-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Volver al Evento
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
