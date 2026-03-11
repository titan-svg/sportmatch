'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  HomeIcon,
  CalendarIcon,
  TrophyIcon,
  UserIcon,
  BellIcon,
  ChatIcon,
  SettingsIcon,
  LogoutIcon,
  MenuIcon,
  XIcon,
  PlusIcon,
  ShieldIcon,
} from '@/components/Icons';
import { getUnreadNotificationsCount } from '@/lib/data';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAdmin, isCoordinator } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const unreadCount = user ? getUnreadNotificationsCount(user.id) : 0;

  const navItems = [
    { href: '/dashboard', label: 'Inicio', icon: HomeIcon },
    { href: '/eventos', label: 'Eventos', icon: CalendarIcon },
    { href: '/ranking', label: 'Ranking', icon: TrophyIcon },
    { href: '/mensajes', label: 'Mensajes', icon: ChatIcon },
  ];

  const adminItems = [
    { href: '/admin/eventos', label: 'Gestionar Eventos', icon: SettingsIcon },
    { href: '/admin/inscripciones', label: 'Inscripciones', icon: UserIcon },
    { href: '/admin/resultados', label: 'Resultados', icon: TrophyIcon },
  ];

  if (!user) return null;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50">
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <TrophyIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">SportMatch</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}

            {isCoordinator && (
              <div className="relative group">
                <button className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                  pathname.startsWith('/admin')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}>
                  <ShieldIcon className="w-5 h-5" />
                  Admin
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {adminItems.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 px-4 py-3 text-slate-600 hover:bg-slate-50 first:rounded-t-xl last:rounded-b-xl"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          
          </div> 

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/eventos/crear"
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Crear Evento
              </Link>
            )}

            <Link
              href="/mensajes"
              className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <BellIcon className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full object-cover"
                />
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100">
                      <p className="font-semibold text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/perfil"
                        className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <UserIcon className="w-5 h-5" />
                        Mi Perfil
                      </Link>
                      <Link
                        href="/perfil/editar"
                        className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <SettingsIcon className="w-5 h-5" />
                        Configuración
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <LogoutIcon className="w-5 h-5" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          {navItems.slice(0, 4).map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl ${
                pathname === item.href || pathname.startsWith(item.href + '/')
                  ? 'text-blue-700'
                  : 'text-slate-500'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center gap-1 px-4 py-2 text-slate-500"
          >
            <MenuIcon className="w-6 h-6" />
            <span className="text-xs font-medium">Más</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-80 bg-white z-50 overflow-y-auto"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-lg font-semibold">Menú</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>

              {/* User Info */}
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.points} pts</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-4 space-y-2">
                <Link
                  href="/perfil"
                  className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserIcon className="w-5 h-5" />
                  Mi Perfil
                </Link>

                {isAdmin && (
                  <Link
                    href="/eventos/crear"
                    className="flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-600 rounded-xl"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <PlusIcon className="w-5 h-5" />
                    Crear Evento
                  </Link>
                )}

                {isCoordinator && (
                  <>
                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-400 uppercase">
                      Administración
                    </div>
                    {adminItems.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    ))}
                  </>
                )}

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    <LogoutIcon className="w-5 h-5" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
