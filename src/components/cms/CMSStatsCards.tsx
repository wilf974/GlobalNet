'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Settings, 
  Mail, 
  MessageSquare,
  Users,
  Building,
  HelpCircle,
  Image,
  BarChart3
} from 'lucide-react';
import { CMSStats } from '@/types/cms';

interface CMSStatsCardsProps {
  stats: CMSStats;
  className?: string;
}

export function CMSStatsCards({ stats, className = '' }: CMSStatsCardsProps) {
  const statsCards = [
    {
      title: 'Pages',
      value: stats.totalPages,
      icon: FileText,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Pages publiées',
    },
    {
      title: 'Services',
      value: stats.totalServices,
      icon: Settings,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      description: 'Services actifs',
    },
    {
      title: 'Messages',
      value: stats.totalContactForms,
      icon: Mail,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      description: 'Formulaires reçus',
    },
    {
      title: 'Non lus',
      value: stats.unreadContactForms,
      icon: MessageSquare,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      description: 'Messages non lus',
    },
    {
      title: 'Témoignages',
      value: stats.totalTestimonials,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      description: 'Témoignages approuvés',
    },
    {
      title: 'Articles',
      value: stats.totalBlogPosts,
      icon: FileText,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      description: 'Articles publiés',
    },
    {
      title: 'Images',
      value: stats.totalGalleryItems,
      icon: Image,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      description: 'Images en galerie',
    },
    {
      title: 'En attente',
      value: stats.pendingTestimonials,
      icon: HelpCircle,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      description: 'Témoignages en attente',
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {statsCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500">{card.description}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
} 