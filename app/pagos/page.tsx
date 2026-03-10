'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { CreditCardIcon, CheckIcon, FilterIcon } from '@/components/Icons';
import {
  registrations,
  events,
  formatCurrency,
  formatDate,
  getEventById,
  Registration,
  Event,
} from '@/lib/data';

type PaymentStatus = 'all' | 'paid' | 'pending';

interface PaymentItem {
  registration: Registration;
  event: Event;
  amount: number;
  isPaid: boolean;
}

export default function PagosPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [filter, setFilter] = useState<PaymentStatus>('all');
  const [payments, setPayments] = useState<PaymentItem[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      // Get user's registrations and create payment items
      const userRegistrations = registrations.filter(
        r => r.userId === user.id || r.partnerId === user.id
      );

      const paymentItems: PaymentItem[] = userRegistrations.map(reg => {
        const event = getEventById(reg.eventId);
        return {
          registration: reg,
          event: event!,
          amount: event?.entryFee || 0,
          isPaid: reg.status === 'paid',
        };
      }).filter(p => p.event);

      setPayments(paymentItems);
    }
  }, [user]);

  const handlePay = (registrationId: string) => {
    setPayments(prev =>
      prev.map(p =>
        p.registration.id === registrationId
          ? {
              ...p,
              isPaid: true,
              registration: {
                ...p.registration,
                status: 'paid' as const,
                paidAt: new Date().toISOString().split('T')[0],
              },
            }
          : p
      )
    );
  };

  const filteredPayments = payments.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'paid') return p.isPaid;
    if (filter === 'pending') return !p.isPaid;
    return true;
  });

  const totalSpent = payments
    .filter(p => p.isPaid)
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => !p.isPaid)
    .reduce((sum, p) => sum + p.amount, 0);

  const paidCount = payments.filter(p => p.isPaid).length;
  const pendingCount = payments.filter(p => !p.isPaid).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-20 pb-24 lg:pb-8 px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Mis Pagos</h1>
            <p className="text-slate-600">Gestiona tus pagos e inscripciones a eventos</p>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            {/* Total Spent */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <CheckIcon className="w-6 h-6" />
                </div>
                <span className="text-blue-100 font-medium">Total Gastado</span>
              </div>
              <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
              <p className="text-blue-200 text-sm mt-1">{paidCount} pagos realizados</p>
            </div>

            {/* Pending */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <CreditCardIcon className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-slate-600 font-medium">Pendiente</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{formatCurrency(pendingAmount)}</p>
              <p className="text-slate-500 text-sm mt-1">{pendingCount} pagos pendientes</p>
            </div>

            {/* Total Events */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                  <FilterIcon className="w-6 h-6 text-slate-600" />
                </div>
                <span className="text-slate-600 font-medium">Total Inscripciones</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{payments.length}</p>
              <p className="text-slate-500 text-sm mt-1">eventos registrados</p>
            </div>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 mb-6"
          >
            {[
              { value: 'all', label: 'Todos', count: payments.length },
              { value: 'paid', label: 'Pagados', count: paidCount },
              { value: 'pending', label: 'Pendientes', count: pendingCount },
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value as PaymentStatus)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filter === tab.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    filter === tab.value
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Payments Table - Desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Evento
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Monto
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Fecha
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                    Estado
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                    Accion
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        No hay pagos para mostrar
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment, index) => (
                      <motion.tr
                        key={payment.registration.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              {payment.isPaid ? (
                                <CheckIcon className="w-5 h-5 text-blue-600" />
                              ) : (
                                <CreditCardIcon className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {payment.event.name}
                              </p>
                              <p className="text-sm text-slate-500">
                                {payment.event.sport === 'tennis' ? 'Tenis' : 'Padel'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-900">
                            {formatCurrency(payment.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {payment.isPaid && payment.registration.paidAt
                            ? formatDate(payment.registration.paidAt)
                            : formatDate(payment.registration.registeredAt)}
                        </td>
                        <td className="px-6 py-4">
                          {payment.isPaid ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                              <CheckIcon className="w-4 h-4" />
                              Pagado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                              <CreditCardIcon className="w-4 h-4" />
                              Pendiente
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {!payment.isPaid && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handlePay(payment.registration.id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                            >
                              Pagar
                            </motion.button>
                          )}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>

          {/* Payments Cards - Mobile */}
          <div className="md:hidden space-y-4">
            <AnimatePresence>
              {filteredPayments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200"
                >
                  No hay pagos para mostrar
                </motion.div>
              ) : (
                filteredPayments.map((payment, index) => (
                  <motion.div
                    key={payment.registration.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            payment.isPaid ? 'bg-green-100' : 'bg-orange-100'
                          }`}
                        >
                          {payment.isPaid ? (
                            <CheckIcon className="w-6 h-6 text-green-600" />
                          ) : (
                            <CreditCardIcon className="w-6 h-6 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {payment.event.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            {payment.event.sport === 'tennis' ? 'Tenis' : 'Padel'}
                          </p>
                        </div>
                      </div>
                      {payment.isPaid ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Pagado
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                          Pendiente
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-2xl font-bold text-slate-900">
                          {formatCurrency(payment.amount)}
                        </p>
                        <p className="text-sm text-slate-500">
                          {payment.isPaid && payment.registration.paidAt
                            ? formatDate(payment.registration.paidAt)
                            : formatDate(payment.registration.registeredAt)}
                        </p>
                      </div>
                      {!payment.isPaid && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handlePay(payment.registration.id)}
                          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Pagar
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Pending Payments Section */}
          {pendingCount > 0 && filter !== 'paid' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-200 rounded-xl flex items-center justify-center">
                  <CreditCardIcon className="w-5 h-5 text-orange-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Pagos Pendientes</h3>
                  <p className="text-sm text-slate-600">
                    Tienes {pendingCount} pago{pendingCount > 1 ? 's' : ''} pendiente
                    {pendingCount > 1 ? 's' : ''} por un total de{' '}
                    <span className="font-semibold">{formatCurrency(pendingAmount)}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {payments
                  .filter(p => !p.isPaid)
                  .map(payment => (
                    <motion.button
                      key={payment.registration.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePay(payment.registration.id)}
                      className="px-4 py-2 bg-white border border-orange-300 text-orange-700 rounded-xl font-medium hover:bg-orange-50 transition-colors text-sm"
                    >
                      Pagar {payment.event.name} - {formatCurrency(payment.amount)}
                    </motion.button>
                  ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
