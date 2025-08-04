'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Save, 
  Eye, 
  X, 
  Plus,
  Trash2,
  Move,
  Link,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Building,
  Settings,
  Users,
  HelpCircle,
  Shield
} from 'lucide-react';

interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
  order: number;
}

interface FooterLink {
  id: string;
  label: string;
  url: string;
  isActive: boolean;
}

interface SocialMedia {
  platform: string;
  url: string;
  isActive: boolean;
}

interface CompanyInfo {
  name: string;
  description: string;
  copyright: string;
}

interface CMSFooterEditorProps {
  sections: FooterSection[];
  socialMedia: SocialMedia[];
  companyInfo: CompanyInfo;
  onSave: (sections: FooterSection[], social: SocialMedia[], company: CompanyInfo) => void;
  onCancel: () => void;
  className?: string;
}

export function CMSFooterEditor({ 
  sections, 
  socialMedia, 
  companyInfo, 
  onSave, 
  onCancel, 
  className = '' 
}: CMSFooterEditorProps) {
  const [footerSections, setFooterSections] = useState<FooterSection[]>(sections);
  const [social, setSocial] = useState<SocialMedia[]>(socialMedia);
  const [company, setCompany] = useState<CompanyInfo>(companyInfo);
  const [isPreview, setIsPreview] = useState(false);
  const [newLink, setNewLink] = useState({ label: '', url: '' });
  const [selectedSection, setSelectedSection] = useState<string>('');

  const handleAddSection = () => {
    const newSection: FooterSection = {
      id: crypto.randomUUID(),
      title: 'Nouvelle Section',
      links: [],
      order: footerSections.length + 1,
    };
    setFooterSections([...footerSections, newSection]);
  };

  const handleRemoveSection = (id: string) => {
    setFooterSections(footerSections.filter(section => section.id !== id));
  };

  const handleUpdateSection = (id: string, field: keyof FooterSection, value: any) => {
    setFooterSections(footerSections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const handleAddLink = (sectionId: string) => {
    if (newLink.label.trim() && newLink.url.trim()) {
      const newFooterLink: FooterLink = {
        id: crypto.randomUUID(),
        label: newLink.label.trim(),
        url: newLink.url.trim(),
        isActive: true,
      };
      setFooterSections(footerSections.map(section => 
        section.id === sectionId 
          ? { ...section, links: [...section.links, newFooterLink] }
          : section
      ));
      setNewLink({ label: '', url: '' });
    }
  };

  const handleRemoveLink = (sectionId: string, linkId: string) => {
    setFooterSections(footerSections.map(section => 
      section.id === sectionId 
        ? { ...section, links: section.links.filter(link => link.id !== linkId) }
        : section
    ));
  };

  const handleUpdateLink = (sectionId: string, linkId: string, field: keyof FooterLink, value: any) => {
    setFooterSections(footerSections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            links: section.links.map(link => 
              link.id === linkId ? { ...link, [field]: value } : link
            )
          }
        : section
    ));
  };

  const handleSocialMediaChange = (platform: string, field: keyof SocialMedia, value: any) => {
    setSocial(social.map(item => 
      item.platform === platform ? { ...item, [field]: value } : item
    ));
  };

  const handleCompanyChange = (field: keyof CompanyInfo, value: string) => {
    setCompany(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(footerSections, social, company);
  };

  const renderFooterEditor = () => (
    <div className="space-y-6">
      {/* Company Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Informations de l'Entreprise
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'entreprise
            </label>
            <input
              type="text"
              value={company.name}
              onChange={(e) => handleCompanyChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="GlobalNet Services"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={company.description}
              onChange={(e) => handleCompanyChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Leader du nettoyage professionnel depuis plus de 10 ans..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Copyright
            </label>
            <input
              type="text"
              value={company.copyright}
              onChange={(e) => handleCompanyChange('copyright', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="© 2025 GlobalNet Services. Tous droits réservés."
            />
          </div>
        </div>
      </div>

      {/* Footer Sections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Sections du Footer
          </h3>
          <button
            onClick={handleAddSection}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter Section</span>
          </button>
        </div>

        <div className="space-y-4">
          {footerSections.map((section) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleUpdateSection(section.id, 'title', e.target.value)}
                  className="text-lg font-semibold border-none focus:ring-0 bg-transparent"
                />
                <button
                  onClick={() => handleRemoveSection(section.id)}
                  className="p-1 text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Add new link */}
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  placeholder="Label du lien"
                  value={selectedSection === section.id ? newLink.label : ''}
                  onChange={(e) => {
                    setSelectedSection(section.id);
                    setNewLink(prev => ({ ...prev, label: e.target.value }));
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="URL"
                  value={selectedSection === section.id ? newLink.url : ''}
                  onChange={(e) => {
                    setSelectedSection(section.id);
                    setNewLink(prev => ({ ...prev, url: e.target.value }));
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleAddLink(section.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Links list */}
              <div className="space-y-2">
                {section.links.map((link) => (
                  <div key={link.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    <Move className="w-4 h-4 text-gray-400 cursor-move" />
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => handleUpdateLink(section.id, link.id, 'label', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => handleUpdateLink(section.id, link.id, 'url', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={link.isActive}
                        onChange={(e) => handleUpdateLink(section.id, link.id, 'isActive', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-600">Actif</span>
                    </label>
                    <button
                      onClick={() => handleRemoveLink(section.id, link.id)}
                      className="p-1 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Social Media */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Réseaux Sociaux
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {social.map((item) => (
            <div key={item.platform} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                {item.platform === 'facebook' && <Facebook className="w-5 h-5 text-blue-600" />}
                {item.platform === 'twitter' && <Twitter className="w-5 h-5 text-blue-400" />}
                {item.platform === 'linkedin' && <Linkedin className="w-5 h-5 text-blue-700" />}
                {item.platform === 'instagram' && <Instagram className="w-5 h-5 text-pink-600" />}
                {item.platform === 'youtube' && <Youtube className="w-5 h-5 text-red-600" />}
                <span className="font-medium capitalize">{item.platform}</span>
              </div>
              <input
                type="url"
                value={item.url}
                onChange={(e) => handleSocialMediaChange(item.platform, 'url', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://..."
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={item.isActive}
                  onChange={(e) => handleSocialMediaChange(item.platform, 'isActive', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-600">Actif</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Prévisualisation du Footer</h3>
        
        <div className="bg-blue-900 text-white p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Company Info */}
            <div>
              <h4 className="font-semibold mb-2">{company.name}</h4>
              <p className="text-sm text-gray-300">{company.description}</p>
            </div>
            
            {/* Footer Sections */}
            {footerSections.map((section) => (
              <div key={section.id}>
                <h4 className="font-semibold mb-2">{section.title}</h4>
                <ul className="space-y-1 text-sm text-gray-300">
                  {section.links.filter(link => link.isActive).map((link) => (
                    <li key={link.id}>
                      <a href={link.url} className="hover:text-white transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {/* Bottom section */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center space-x-4">
              {social.filter(item => item.isActive).map((item) => (
                <a
                  key={item.platform}
                  href={item.url}
                  className="text-gray-300 hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.platform === 'facebook' && <Facebook className="w-5 h-5" />}
                  {item.platform === 'twitter' && <Twitter className="w-5 h-5" />}
                  {item.platform === 'linkedin' && <Linkedin className="w-5 h-5" />}
                  {item.platform === 'instagram' && <Instagram className="w-5 h-5" />}
                  {item.platform === 'youtube' && <Youtube className="w-5 h-5" />}
                </a>
              ))}
            </div>
            <div className="text-sm text-gray-300">
              {company.copyright}
            </div>
          </div>
        </div>
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
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Éditeur de Footer
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
        {isPreview ? renderPreview() : renderFooterEditor()}
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