'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import {
  CheckIcon,
  XIcon,
  FilterIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon,
} from '@/components/Icons';
import {
  registrations as allRegistrations,
  Registration,
  events,
  getEventById,
  getUserById,
  getRegistrationStatusLabel,
  formatDate,
  formatDateTime,
} from '@/lib/data';

export default function AdminInscripcionesPage() {
  const { user, isLoading, isAdmin, isCoordinator } = useAuth();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>(allRegistrations);
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('pending');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && user && !isAdmin && !isCoordinator) {
      router.push('/dashboard');
    }
  }, [user, isLoading, isAdmin, isCoordinator, router]);

  const filteredRegistrations = registrations.filter(r => {
    const matchesEvent = eventFilter === 'all' || r.eventId === eventFilter;
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesEvent && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      case 'approved':
        return 'bg-blue-100 text-blue-700';
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const handleApprove = (registrationId: string) => {
    setRegistrations(registrations.map(r =>
      r.id === registrationId ? { ...r, status: 'approved' as const } : r
    ));
  };

  const handleReject = (registrationId: string) => {
    setRegistrations(registrations.map(r =>
      r.id === registrationId ? { ...r, status: 'rejected' as const } : r
    ));
  };

  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const approvedCount = registrations.filter(r => r.status === 'approved' || r.status === 'paid').length;

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
              Gestionar Inscripciones
            </h1>
            <p className="text-slate-600 mt-1">
              Aprueba o rechaza las inscripciones de los participantes
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{registrations.length}</p>
                  <p className="text-sm text-slate-500">Total</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
                  <p className="text-sm text-slate-500">Pendientes</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{approvedCount}</p>
                  <p className="text-sm text-slate-500">Aprobadas</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <XIcon className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {registrations.filter(r => r.status === 'rejected').length}
                  </p>
                  <p className="text-sm text-slate-500">Rechazadas</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-slate-200 p-4 mb-6"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex items-center gap-3 flex-1">
                <FilterIcon className="w-5 h-5 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Evento:</span>
                <select
                  value={eventFilter}
                  onChange={(e) => setEventFilter(e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos los eventos</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>{event.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-700">Estado:</span>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'pending', 'approved', 'paid', 'rejected'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        statusFilter === status
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {status === 'all' ? 'Todos' : getRegistrationStatusLabel(status)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Registrations Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Participante
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Compañero
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Evento
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Fecha Inscripcion
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Estado
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence>
                    {filteredRegistrations.map((registration, index) => {
                      const participant = getUserById(registration.userId);
                      const partner = registration.partnerId ? getUserById(registration.partnerId) : null;
                      const event = getEventById(registration.eventId);

                      if (!participant || !event) return null;

                      return (
                        <motion.tr
                          key={registration.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-slate-50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Image
                                src={participant.avatar}
                                alt={participant.name}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-semibold text-slate-900">{participant.name}</p>
                                <p className="text-sm text-slate-500">{participant.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {partner ? (
                              <div className="flex items-center gap-3">
                                <Image
                                  src={partner.avatar}
                                  alt={partner.name}
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                  <p className="font-semibold text-slate-900">{partner.name}</p>
                                  <p className="text-sm text-slate-500">{partner.email}</p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-sm">Sin compañero</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-700">{event.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-700">
                              {formatDateTime(registration.registeredAt)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                              {getRegistrationStatusLabel(registration.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {registration.status === 'pending' && (
                                <>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleApprove(registration.id)}
                                    className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 font-medium rounded-lg hover:bg-green-200 transition-colors"
                                  >
                                    <CheckIcon className="w-4 h-4" />
                                    Aprobar
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleReject(registration.id)}
                                    className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors"
                                  >
                                    <XIcon className="w-4 h-4" />
                                    Rechazar
                                  </motion.button>
                                </>
                              )}
                              {registration.status !== 'pending' && (
                                <span className="text-sm text-slate-400">
                                  {registration.status === 'approved' || registration.status === 'paid'
                                    ? 'Aprobada'
                                    : 'Rechazada'}
                                </span>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {filteredRegistrations.length === 0 && (
              <div className="text-center py-12">
                <UsersIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No hay inscripciones con este filtro</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
