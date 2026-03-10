'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import {
  UserIcon,
  ArrowLeftIcon,
  CameraIcon,
  MailIcon,
  PhoneIcon,
  CheckIcon,
  XIcon,
} from '@/components/Icons';
import { SportType, getSportLabel } from '@/lib/data';

export default function EditProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    sport: 'tennis' as SportType,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        sport: user.sport,
      });
    }
  }, [user, isLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, you would update the user data via API
    // For demo, just show success message
    setIsSaving(false);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      router.push('/perfil');
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const sportOptions: { value: SportType; label: string }[] = [
    { value: 'tennis', label: 'Tenis' },
    { value: 'padel', label: 'Padel' },
    { value: 'soccer', label: 'Futbol' },
    { value: 'basketball', label: 'Basquet' },
    { value: 'volleyball', label: 'Voley' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-20 pb-24 lg:pb-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/perfil"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-4"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Volver al perfil
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Editar Perfil</h1>
                <p className="text-slate-600">Actualiza tu informacion personal</p>
              </div>
            </div>
          </motion.div>

          {/* Success Message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800">Perfil actualizado</p>
                <p className="text-sm text-green-600">Redirigiendo al perfil...</p>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <form onSubmit={handleSubmit}>
              {/* Avatar Section */}
              <div className="px-6 py-8 border-b border-slate-100 bg-slate-50">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative">
                    <Image
                      src={formData.avatar || user.avatar}
                      alt={formData.name}
                      width={120}
                      height={120}
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                      <CameraIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 w-full sm:w-auto">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      URL del Avatar
                    </label>
                    <input
                      type="url"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleChange}
                      placeholder="https://ejemplo.com/mi-foto.jpg"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <p className="mt-2 text-xs text-slate-500">
                      Ingresa la URL de una imagen para tu avatar
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="p-6 space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Correo Electronico
                  </label>
                  <div className="relative">
                    <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Telefono
                  </label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Sport Preference */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Deporte Principal
                  </label>
                  <select
                    name="sport"
                    value={formData.sport}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    {sportOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Link
                  href="/perfil"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-5 h-5" />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100"
          >
            <h4 className="font-medium text-blue-900 mb-2">Consejos para tu perfil</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>- Usa una foto de perfil clara y reciente</li>
              <li>- Asegurate de que tu correo electronico sea valido</li>
              <li>- Tu numero de telefono sera usado para notificaciones importantes</li>
              <li>- El deporte principal determina tu ranking inicial</li>
            </ul>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
