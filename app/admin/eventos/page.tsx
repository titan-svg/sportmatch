'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import {
  CalendarIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
  FilterIcon,
  UsersIcon,
  EyeIcon,
} from '@/components/Icons';
import {
  events as allEvents,
  Event,
  EventStatus,
  getEventRegistrations,
  getStatusLabel,
  getSportLabel,
  formatDate,
  formatCurrency,
} from '@/lib/data';

export default function AdminEventosPage() {
  const { user, isLoading, isAdmin, isCoordinator } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(allEvents);
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (!isLoading && user && !isAdmin && !isCoordinator) {
      router.push('/dashboard');
    }
  }, [user, isLoading, isAdmin, isCoordinator, router]);

  const filteredEvents = statusFilter === 'all'
    ? events
    : events.filter(e => e.status === statusFilter);

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'in_progress':
        return 'bg-orange-100 text-orange-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const handleDelete = (event: Event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      setEvents(events.filter(e => e.id !== eventToDelete.id));
      setShowDeleteModal(false);
      setEventToDelete(null);
    }
  };

  const getEventStats = (eventId: string) => {
    const registrations = getEventRegistrations(eventId);
    const approved = registrations.filter(r => r.status === 'approved' || r.status === 'paid').length;
    const pending = registrations.filter(r => r.status === 'pending').length;
    return { total: registrations.length, approved, pending };
  };

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
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                Gestionar Eventos
              </h1>
              <p className="text-slate-600 mt-1">
                Administra todos los eventos de la plataforma
              </p>
            </div>
            <Link
              href="/eventos/crear"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Crear Evento
            </Link>
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
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{events.length}</p>
                  <p className="text-sm text-slate-500">Total</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {events.filter(e => e.status === 'upcoming').length}
                  </p>
                  <p className="text-sm text-slate-500">Proximos</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {events.filter(e => e.status === 'in_progress').length}
                  </p>
                  <p className="text-sm text-slate-500">En curso</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {events.filter(e => e.status === 'completed').length}
                  </p>
                  <p className="text-sm text-slate-500">Finalizados</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-slate-200 p-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <FilterIcon className="w-5 h-5 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Filtrar por estado:</span>
              <div className="flex flex-wrap gap-2">
                {(['all', 'upcoming', 'in_progress', 'completed', 'cancelled'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {status === 'all' ? 'Todos' : getStatusLabel(status)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Events Table */}
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
                      Evento
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Deporte
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Fecha
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Participantes
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Estado
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                      Inscripcion
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence>
                    {filteredEvents.map((event, index) => {
                      const stats = getEventStats(event.id);
                      return (
                        <motion.tr
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-slate-50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-12 h-12 rounded-lg bg-cover bg-center"
                                style={{ backgroundImage: `url(${event.image})` }}
                              />
                              <div>
                                <p className="font-semibold text-slate-900">{event.name}</p>
                                <p className="text-sm text-slate-500">{event.location}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-700">{getSportLabel(event.sport)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-slate-700">{formatDate(event.date)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <UsersIcon className="w-4 h-4 text-slate-500" />
                              <span className="text-slate-700">
                                {event.currentParticipants}/{event.maxParticipants}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                              {getStatusLabel(event.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <span className="text-green-600 font-medium">{stats.approved}</span>
                              <span className="text-slate-400"> / </span>
                              <span className="text-orange-500">{stats.pending} pend.</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/eventos/${event.id}`}
                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Ver evento"
                              >
                                <EyeIcon className="w-5 h-5" />
                              </Link>
                              <Link
                                href={`/eventos/${event.id}/editar`}
                                className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                title="Editar evento"
                              >
                                <EditIcon className="w-5 h-5" />
                              </Link>
                              <button
                                onClick={() => handleDelete(event)}
                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Eliminar evento"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No hay eventos con este filtro</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && eventToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Eliminar Evento
              </h3>
              <p className="text-slate-600 mb-6">
                ¿Estas seguro de que deseas eliminar &quot;{eventToDelete.name}&quot;? Esta accion no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
