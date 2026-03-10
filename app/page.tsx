'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  TrophyIcon,
  CalendarIcon,
  UsersIcon,
  ChartIcon,
  ArrowRightIcon,
  CheckIcon,
  StarIcon,
} from '@/components/Icons';

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const features = [
    {
      icon: CalendarIcon,
      title: 'Gestión de Eventos',
      description: 'Crea y organiza torneos fácilmente con sistema de inscripciones automático.',
    },
    {
      icon: UsersIcon,
      title: 'Registro de Jugadores',
      description: 'Inscripción sencilla con invitación a compañeros para torneos en parejas.',
    },
    {
      icon: TrophyIcon,
      title: 'Brackets Automáticos',
      description: 'Generación automática de enfrentamientos y seguimiento de resultados.',
    },
    {
      icon: ChartIcon,
      title: 'Ranking de Jugadores',
      description: 'Sistema de puntos y clasificación actualizado en tiempo real.',
    },
  ];

  const testimonials = [
    {
      name: 'María García',
      role: 'Jugadora de Tenis',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      text: 'SportMatch ha transformado la forma en que participo en torneos. Todo es más fácil y organizado.',
    },
    {
      name: 'Diego Fernández',
      role: 'Organizador',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      text: 'Como organizador, ahorro horas de trabajo. Las inscripciones y brackets se generan solos.',
    },
    {
      name: 'Laura Sánchez',
      role: 'Jugadora de Pádel',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      text: 'Me encanta poder ver mi posición en el ranking y competir con otros jugadores.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-slate-200 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">SportMatch</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-slate-600 font-medium hover:text-blue-600 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/registro"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-6">
                La plataforma #1 para eventos deportivos
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Organiza torneos como un{' '}
                <span className="gradient-text">profesional</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Gestiona eventos deportivos, inscripciones, brackets y rankings de jugadores
                en una sola plataforma intuitiva y fácil de usar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/registro"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Comenzar Gratis
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
                <Link
                  href="/eventos"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  Ver Eventos
                </Link>
              </div>

              <div className="flex items-center gap-8 mt-10">
                <div>
                  <p className="text-3xl font-bold text-slate-900">500+</p>
                  <p className="text-sm text-slate-500">Torneos organizados</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">5,000+</p>
                  <p className="text-sm text-slate-500">Jugadores activos</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">4.9</p>
                  <p className="text-sm text-slate-500">Calificación</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                <Image
                  src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&h=800&fit=crop"
                  alt="Tennis tournament"
                  fill
                  className="object-cover rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Torneo Confirmado</p>
                      <p className="text-sm text-slate-500">24 participantes</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                  </div>
                  <p className="text-sm text-slate-500 mt-1">+2,000 reseñas</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Todo lo que necesitas para tus eventos
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Una plataforma completa para organizadores y participantes de eventos deportivos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 card-hover"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-xl text-slate-400">
              Miles de jugadores y organizadores confían en SportMatch.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800 p-6 rounded-2xl"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-white">{testimonial.name}</p>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              ¿Listo para organizar tu próximo torneo?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Únete a miles de organizadores y jugadores que ya usan SportMatch.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
            >
              Crear Cuenta Gratis
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SportMatch</span>
            </div>
            <p className="text-slate-400">
              © 2024 SportMatch. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
