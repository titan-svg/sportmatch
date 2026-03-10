'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import {
  BellIcon,
  ChatIcon,
  SendIcon,
  ArrowLeftIcon,
  CalendarIcon,
  TrophyIcon,
  CreditCardIcon,
  CheckIcon,
} from '@/components/Icons';
import {
  getUserMessages,
  getUserById,
  getUserNotifications,
  Message,
  Notification,
  User,
  formatDateTime,
} from '@/lib/data';

type TabType = 'mensajes' | 'notificaciones';

interface Conversation {
  partnerId: string;
  partner: User;
  lastMessage: Message;
  unreadCount: number;
  messages: Message[];
}

export default function MensajesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('mensajes');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (user) {
      // Load messages and build conversations
      const userMessages = getUserMessages(user.id);
      const conversationMap = new Map<string, Message[]>();

      userMessages.forEach((msg) => {
        const partnerId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, []);
        }
        conversationMap.get(partnerId)!.push(msg);
      });

      const convList: Conversation[] = [];
      conversationMap.forEach((messages, partnerId) => {
        const partner = getUserById(partnerId);
        if (partner) {
          const sortedMessages = messages.sort(
            (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          const unreadCount = messages.filter(
            (m) => m.receiverId === user.id && !m.read
          ).length;
          convList.push({
            partnerId,
            partner,
            lastMessage: sortedMessages[sortedMessages.length - 1],
            unreadCount,
            messages: sortedMessages,
          });
        }
      });

      // Sort by last message time (newest first)
      convList.sort(
        (a, b) =>
          new Date(b.lastMessage.createdAt).getTime() -
          new Date(a.lastMessage.createdAt).getTime()
      );

      setConversations(convList);

      // Load notifications
      const userNotifications = getUserNotifications(user.id);
      setNotifications(
        userNotifications.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    }
  }, [user]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      receiverId: selectedConversation.partnerId,
      content: newMessage.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    // Update conversation with new message
    setSelectedConversation((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [...prev.messages, newMsg],
        lastMessage: newMsg,
      };
    });

    // Update conversations list
    setConversations((prev) =>
      prev.map((conv) =>
        conv.partnerId === selectedConversation.partnerId
          ? { ...conv, messages: [...conv.messages, newMsg], lastMessage: newMsg }
          : conv
      )
    );

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'event':
        return <CalendarIcon className="w-5 h-5" />;
      case 'match':
        return <TrophyIcon className="w-5 h-5" />;
      case 'result':
        return <CheckIcon className="w-5 h-5" />;
      case 'payment':
        return <CreditCardIcon className="w-5 h-5" />;
      default:
        return <BellIcon className="w-5 h-5" />;
    }
  };

  const getNotificationIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'event':
        return 'bg-blue-100 text-blue-600';
      case 'match':
        return 'bg-orange-100 text-orange-600';
      case 'result':
        return 'bg-green-100 text-green-600';
      case 'payment':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-16 lg:pt-20 pb-20 lg:pb-8">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              Centro de Mensajes
            </h1>
            <p className="text-slate-500 mt-1">
              Gestiona tus conversaciones y notificaciones
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6"
          >
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('mensajes')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 font-medium transition-colors ${
                  activeTab === 'mensajes'
                    ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ChatIcon className="w-5 h-5" />
                Mensajes
                {conversations.reduce((acc, c) => acc + c.unreadCount, 0) > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {conversations.reduce((acc, c) => acc + c.unreadCount, 0)}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('notificaciones')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 font-medium transition-colors ${
                  activeTab === 'notificaciones'
                    ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <BellIcon className="w-5 h-5" />
                Notificaciones
                {unreadNotificationsCount > 0 && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'mensajes' ? (
                <motion.div
                  key="mensajes"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex h-[calc(100vh-280px)] lg:h-[600px]"
                >
                  {/* Conversation List */}
                  <div
                    className={`${
                      isMobileView && selectedConversation
                        ? 'hidden'
                        : 'w-full md:w-1/3'
                    } border-r border-slate-200 overflow-y-auto`}
                  >
                    {conversations.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <ChatIcon className="w-16 h-16 text-slate-300 mb-4" />
                        <p className="text-slate-500 font-medium">
                          No tienes conversaciones
                        </p>
                        <p className="text-slate-400 text-sm mt-1">
                          Tus mensajes apareceran aqui
                        </p>
                      </div>
                    ) : (
                      conversations.map((conv, index) => (
                        <motion.button
                          key={conv.partnerId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setSelectedConversation(conv)}
                          className={`w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 text-left ${
                            selectedConversation?.partnerId === conv.partnerId
                              ? 'bg-blue-50'
                              : ''
                          }`}
                        >
                          <div className="relative">
                            <Image
                              src={conv.partner.avatar}
                              alt={conv.partner.name}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            {conv.unreadCount > 0 && (
                              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-slate-900 truncate">
                                {conv.partner.name}
                              </p>
                              <span className="text-xs text-slate-400">
                                {formatDateTime(conv.lastMessage.createdAt)}
                              </span>
                            </div>
                            <p
                              className={`text-sm truncate ${
                                conv.unreadCount > 0
                                  ? 'text-slate-700 font-medium'
                                  : 'text-slate-500'
                              }`}
                            >
                              {conv.lastMessage.senderId === user.id && (
                                <span className="text-slate-400">Tu: </span>
                              )}
                              {conv.lastMessage.content}
                            </p>
                          </div>
                        </motion.button>
                      ))
                    )}
                  </div>

                  {/* Chat View */}
                  <div
                    className={`${
                      isMobileView && !selectedConversation
                        ? 'hidden'
                        : 'flex-1'
                    } flex flex-col`}
                  >
                    {selectedConversation ? (
                      <>
                        {/* Chat Header */}
                        <div className="flex items-center gap-3 p-4 border-b border-slate-200">
                          {isMobileView && (
                            <button
                              onClick={() => setSelectedConversation(null)}
                              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                              <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
                            </button>
                          )}
                          <Image
                            src={selectedConversation.partner.avatar}
                            alt={selectedConversation.partner.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">
                              {selectedConversation.partner.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {selectedConversation.partner.sport === 'tennis'
                                ? 'Tenis'
                                : selectedConversation.partner.sport === 'padel'
                                ? 'Padel'
                                : selectedConversation.partner.sport}{' '}
                              - {selectedConversation.partner.rating} pts
                            </p>
                          </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                          {selectedConversation.messages.map((msg, index) => {
                            const isSent = msg.senderId === user.id;
                            return (
                              <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className={`flex ${
                                  isSent ? 'justify-end' : 'justify-start'
                                }`}
                              >
                                <div
                                  className={`flex items-end gap-2 max-w-[80%] ${
                                    isSent ? 'flex-row-reverse' : ''
                                  }`}
                                >
                                  {!isSent && (
                                    <Image
                                      src={selectedConversation.partner.avatar}
                                      alt={selectedConversation.partner.name}
                                      width={28}
                                      height={28}
                                      className="w-7 h-7 rounded-full object-cover"
                                    />
                                  )}
                                  <div
                                    className={`px-4 py-2 rounded-2xl ${
                                      isSent
                                        ? 'bg-blue-600 text-white rounded-br-md'
                                        : 'bg-slate-100 text-slate-900 rounded-bl-md'
                                    }`}
                                  >
                                    <p className="text-sm">{msg.content}</p>
                                    <p
                                      className={`text-xs mt-1 ${
                                        isSent
                                          ? 'text-blue-200'
                                          : 'text-slate-400'
                                      }`}
                                    >
                                      {formatDateTime(msg.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 border-t border-slate-200">
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder="Escribe un mensaje..."
                              className="flex-1 px-4 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleSendMessage}
                              disabled={!newMessage.trim()}
                              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              <SendIcon className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <ChatIcon className="w-20 h-20 text-slate-200 mb-4" />
                        <p className="text-slate-500 font-medium text-lg">
                          Selecciona una conversacion
                        </p>
                        <p className="text-slate-400 text-sm mt-1">
                          Elige un chat de la lista para ver los mensajes
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="notificaciones"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-h-[calc(100vh-280px)] lg:max-h-[600px] overflow-y-auto"
                >
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                      <BellIcon className="w-16 h-16 text-slate-300 mb-4" />
                      <p className="text-slate-500 font-medium">
                        No tienes notificaciones
                      </p>
                      <p className="text-slate-400 text-sm mt-1">
                        Las notificaciones de eventos y partidos apareceran aqui
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {notifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 hover:bg-slate-50 transition-colors ${
                            !notification.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          {notification.link ? (
                            <Link
                              href={notification.link}
                              onClick={() =>
                                markNotificationAsRead(notification.id)
                              }
                              className="flex items-start gap-4"
                            >
                              <div
                                className={`p-2.5 rounded-xl ${getNotificationIconColor(
                                  notification.type
                                )}`}
                              >
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p
                                    className={`font-semibold ${
                                      !notification.read
                                        ? 'text-slate-900'
                                        : 'text-slate-700'
                                    }`}
                                  >
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <span className="w-2 h-2 bg-blue-600 rounded-full" />
                                  )}
                                </div>
                                <p className="text-sm text-slate-600 mt-0.5">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-slate-400 mt-2">
                                  {formatDateTime(notification.createdAt)}
                                </p>
                              </div>
                            </Link>
                          ) : (
                            <button
                              onClick={() =>
                                markNotificationAsRead(notification.id)
                              }
                              className="w-full flex items-start gap-4 text-left"
                            >
                              <div
                                className={`p-2.5 rounded-xl ${getNotificationIconColor(
                                  notification.type
                                )}`}
                              >
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p
                                    className={`font-semibold ${
                                      !notification.read
                                        ? 'text-slate-900'
                                        : 'text-slate-700'
                                    }`}
                                  >
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <span className="w-2 h-2 bg-blue-600 rounded-full" />
                                  )}
                                </div>
                                <p className="text-sm text-slate-600 mt-0.5">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-slate-400 mt-2">
                                  {formatDateTime(notification.createdAt)}
                                </p>
                              </div>
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
