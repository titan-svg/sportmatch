'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  LocationIcon,
  UsersIcon,
  CreditCardIcon,
  TrophyIcon,
  CheckIcon,
  PlusIcon,
  XIcon,
} from '@/components/Icons';
import { SportType, getSportLabel } from '@/lib/data';

interface EventFormData {
  name: string;
  description: string;
  sport: SportType;
  date: string;
  time: string;
  location: string;
  address: string;
  maxParticipants: number;
  entryFee: number;
  prize: string;
  format: 'single' | 'doubles' | 'team';
  rules: string[];
  image: string;
}

const initialFormData: EventFormData = {
  name: '',
  description: '',
  sport: 'tennis',
  date: '',
  time: '',
  location: '',
  address: '',
  maxParticipants: 16,
  entryFee: 0,
  prize: '',
  format: 'single',
  rules: [],
  image: '',
};

const sportOptions: { value: SportType; label: string }[] = [
  { value: 'tennis', label: 'Tenis' },
  { value: 'padel', label: 'Padel' },
  { value: 'soccer', label: 'Futbol' },
  { value: 'basketball', label: 'Basquet' },
  { value: 'volleyball', label: 'Voley' },
];

const formatOptions = [
  { value: 'single', label: 'Individual' },
  { value: 'doubles', label: 'Dobles' },
  { value: 'team', label: 'Equipos' },
];

const participantOptions = [8, 16, 32, 64];

export default function CrearEventoPage() {
  const router = useRouter();
  const { user, isLoading, isAdmin } = useAuth();
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [newRule, setNewRule] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'maxParticipants' || name === 'entryFee' ? Number(value) : value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof EventFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const addRule = () => {
    if (newRule.trim()) {
      setFormData((prev) => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()],
      }));
      setNewRule('');
    }
  };

  const removeRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripcion es requerida';
    }
    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }
    if (!formData.time) {
      newErrors.time = 'La hora es requerida';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'La ubicacion es requerida';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'La direccion es requerida';
    }
    if (formData.entryFee < 0) {
      newErrors.entryFee = 'El precio no puede ser negativo';
    }
    if (!formData.prize.trim()) {
      newErrors.prize = 'El premio es requerido';
    }
    if (!formData.image.trim()) {
      newErrors.image = 'La URL de la imagen es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real app, this would create the event via API
    console.log('Creating event:', formData);

    setIsSubmitting(false);
    router.push('/eventos');
  };

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

  // Only admin can create events
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="pt-20 pb-24 lg:pb-8">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XIcon className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Acceso Denegado
              </h3>
              <p className="text-slate-600 mb-6">
                Solo los administradores pueden crear eventos
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Main Content */}
      <main className="pt-20 pb-24 lg:pb-8">
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/eventos"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Volver a eventos
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Crear Nuevo Evento
            </h1>
            <p className="text-slate-600">
              Completa el formulario para crear un nuevo torneo o evento deportivo
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Basic Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                Informacion Basica
              </h2>

              <div className="space-y-4">
                {/* Event Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Nombre del Evento *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Torneo de Verano 2024"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.name ? 'border-red-300' : 'border-slate-200'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Descripcion *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe el evento, sus caracteristicas y lo que los participantes pueden esperar..."
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                      errors.description ? 'border-red-300' : 'border-slate-200'
                    }`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                {/* Sport and Format */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="sport"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Deporte *
                    </label>
                    <select
                      id="sport"
                      name="sport"
                      value={formData.sport}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    >
                      {sportOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="format"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Formato *
                    </label>
                    <select
                      id="format"
                      name="format"
                      value={formData.format}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    >
                      {formatOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Image URL */}
                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    URL de Imagen *
                  </label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.image ? 'border-red-300' : 'border-slate-200'
                    }`}
                  />
                  {errors.image && (
                    <p className="mt-1 text-sm text-red-500">{errors.image}</p>
                  )}
                  {formData.image && (
                    <div className="mt-3 relative h-40 rounded-xl overflow-hidden">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=400&fit=crop';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Date and Location Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <LocationIcon className="w-5 h-5 text-orange-500" />
                Fecha y Ubicacion
              </h2>

              <div className="space-y-4">
                {/* Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Fecha *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.date ? 'border-red-300' : 'border-slate-200'
                      }`}
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="time"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Hora *
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.time ? 'border-red-300' : 'border-slate-200'
                      }`}
                    />
                    {errors.time && (
                      <p className="mt-1 text-sm text-red-500">{errors.time}</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Nombre del Lugar *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Ej: Club Deportivo Central"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.location ? 'border-red-300' : 'border-slate-200'
                    }`}
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Direccion *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Ej: Av. Libertador 1234, Buenos Aires"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.address ? 'border-red-300' : 'border-slate-200'
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Participants and Pricing Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-blue-600" />
                Participantes y Precios
              </h2>

              <div className="space-y-4">
                {/* Max Participants */}
                <div>
                  <label
                    htmlFor="maxParticipants"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Maximo de Participantes *
                  </label>
                  <select
                    id="maxParticipants"
                    name="maxParticipants"
                    value={formData.maxParticipants}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    {participantOptions.map((num) => (
                      <option key={num} value={num}>
                        {num} participantes
                      </option>
                    ))}
                  </select>
                </div>

                {/* Entry Fee and Prize */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="entryFee"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Costo de Inscripcion (ARS) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500">
                        $
                      </span>
                      <input
                        type="number"
                        id="entryFee"
                        name="entryFee"
                        value={formData.entryFee}
                        onChange={handleInputChange}
                        min="0"
                        step="100"
                        placeholder="0"
                        className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.entryFee ? 'border-red-300' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.entryFee && (
                      <p className="mt-1 text-sm text-red-500">{errors.entryFee}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="prize"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Premio *
                    </label>
                    <input
                      type="text"
                      id="prize"
                      name="prize"
                      value={formData.prize}
                      onChange={handleInputChange}
                      placeholder="Ej: $50,000 + Trofeo"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.prize ? 'border-red-300' : 'border-slate-200'
                      }`}
                    />
                    {errors.prize && (
                      <p className="mt-1 text-sm text-red-500">{errors.prize}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Rules Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-green-600" />
                Reglas del Torneo
              </h2>

              <div className="space-y-4">
                {/* Add Rule */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRule}
                    onChange={(e) => setNewRule(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addRule();
                      }
                    }}
                    placeholder="Agregar una regla..."
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={addRule}
                    className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Agregar
                  </button>
                </div>

                {/* Rules List */}
                {formData.rules.length > 0 && (
                  <ul className="space-y-2">
                    {formData.rules.map((rule, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckIcon className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-slate-700">{rule}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeRule(index)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <XIcon className="w-5 h-5" />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                )}

                {formData.rules.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">
                    No hay reglas agregadas. Agrega las reglas del torneo.
                  </p>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-4 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Creando evento...
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-5 h-5" />
                    Crear Evento
                  </>
                )}
              </button>
              <Link
                href="/eventos"
                className="flex-1 py-4 px-6 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors text-center"
              >
                Cancelar
              </Link>
            </div>
          </motion.form>
        </div>
      </main>
    </div>
  );
}
