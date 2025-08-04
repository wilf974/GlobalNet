'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Settings, 
  Save, 
  Eye, 
  Trash2, 
  Plus,
  Edit,
  Check,
  X,
  Image,
  Link,
  Bold,
  Italic,
  List,
  Quote
} from 'lucide-react';
import { PageContent, ServiceContent } from '@/types/cms';

interface CMSContentEditorProps {
  type: 'page' | 'service';
  content?: PageContent | ServiceContent;
  onSave: (content: any) => void;
  onCancel: () => void;
  className?: string;
}

export function CMSContentEditor({ 
  type, 
  content, 
  onSave, 
  onCancel, 
  className = '' 
}: CMSContentEditorProps) {
  const [formData, setFormData] = useState({
    title: type === 'page' ? (content as PageContent)?.title || '' : (content as ServiceContent)?.name || '',
    content: type === 'page' ? (content as PageContent)?.content || '' : (content as ServiceContent)?.description || '',
    metaDescription: (content as PageContent)?.metaDescription || '',
    slug: (content as PageContent)?.slug || '',
    isPublished: type === 'page' ? (content as PageContent)?.isPublished || false : (content as ServiceContent)?.isActive || false,
    // Service specific fields
    description: (content as ServiceContent)?.shortDescription || '',
    price: (content as ServiceContent)?.price || '',
    category: (content as ServiceContent)?.category || 'residential',
    features: (content as ServiceContent)?.features || [],
    image: (content as ServiceContent)?.image || '',
  });

  const [isPreview, setIsPreview] = useState(false);
  const [newFeature, setNewFeature] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    const contentToSave = type === 'page' ? {
      title: formData.title,
      content: formData.content,
      metaDescription: formData.metaDescription,
      slug: formData.slug,
      isPublished: formData.isPublished,
    } : {
      name: formData.title,
      shortDescription: formData.description,
      content: formData.content,
      price: formData.price,
      category: formData.category,
      features: formData.features,
      image: formData.image,
      isActive: formData.isPublished,
    };

    onSave(contentToSave);
  };

  const renderPageEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Titre de la page
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Titre de la page"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slug (URL)
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => handleInputChange('slug', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="titre-de-la-page"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description SEO
        </label>
        <textarea
          value={formData.metaDescription}
          onChange={(e) => handleInputChange('metaDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Description pour les moteurs de recherche..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contenu
        </label>
        <div className="border border-gray-300 rounded-lg">
          {/* Toolbar */}
          <div className="flex items-center space-x-2 p-2 border-b border-gray-300 bg-gray-50">
            <button className="p-1 hover:bg-gray-200 rounded" title="Gras">
              <Bold className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded" title="Italique">
              <Italic className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded" title="Liste">
              <List className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded" title="Citation">
              <Quote className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded" title="Image">
              <Image className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded" title="Lien">
              <Link className="w-4 h-4" />
            </button>
          </div>
          
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            rows={12}
            className="w-full px-3 py-2 border-0 focus:ring-0 resize-none"
            placeholder="Contenu de la page..."
          />
        </div>
      </div>
    </div>
  );

  const renderServiceEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nom du service
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Nom du service"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description courte
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Description courte du service"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prix
        </label>
        <input
          type="text"
          value={formData.price}
          onChange={(e) => handleInputChange('price', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="À partir de 50€"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Catégorie
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="residential">Résidentiel</option>
          <option value="commercial">Commercial</option>
          <option value="industrial">Industriel</option>
          <option value="specialized">Spécialisé</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image
        </label>
        <input
          type="text"
          value={formData.image}
          onChange={(e) => handleInputChange('image', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="/images/services/service.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fonctionnalités
        </label>
        <div className="space-y-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ajouter une fonctionnalité..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
            />
            <button
              onClick={handleAddFeature}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-sm">{feature}</span>
                <button
                  onClick={() => handleRemoveFeature(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description détaillée
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Description détaillée du service..."
        />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {type === 'page' ? (
            <FileText className="w-6 h-6 text-blue-600" />
          ) : (
            <Settings className="w-6 h-6 text-green-600" />
          )}
          <h2 className="text-xl font-semibold text-gray-900">
            {content ? 'Modifier' : 'Créer'} {type === 'page' ? 'une page' : 'un service'}
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Prévisualiser</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isPreview ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Prévisualisation</h3>
              <div className="prose max-w-none">
                <h1>{formData.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: formData.content }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Published toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="published"
                checked={formData.isPublished}
                onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="published" className="text-sm font-medium text-gray-700">
                Publié
              </label>
            </div>

            {/* Editor content */}
            {type === 'page' ? renderPageEditor() : renderServiceEditor()}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onCancel}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Annuler</span>
        </button>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Sauvegarder</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
} 