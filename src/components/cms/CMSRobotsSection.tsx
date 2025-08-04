'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { Settings, FileText, HelpCircle, Eye, Save } from 'lucide-react';
import { CMSRobotsEditor } from './CMSRobotsEditor';

interface RobotsConfig {
  rules: Array<{
    userAgent: string;
    allow?: string[];
    disallow?: string[];
  }>;
  sitemap: string;
  host: string;
}

export const CMSRobotsSection: React.FC = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<RobotsConfig>({
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/services', '/about', '/contact', '/devis', '/legal'],
        disallow: ['/api/', '/admin/', '/dashboard/', '/auth/', '/_next/', '/static/', '*.json', '*.xml', '/temp/', '/test/']
      },
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/dashboard/', '/auth/', '/_next/', '/static/']
      },
      {
        userAgent: 'Bingbot',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/dashboard/', '/auth/', '/_next/', '/static/']
      },
      {
        userAgent: 'Slurp',
        allow: ['/'],
        disallow: ['/api/', '/admin/', '/dashboard/', '/auth/', '/_next/', '/static/']
      }
    ],
    sitemap: 'https://globalnet-services.fr/sitemap.xml',
    host: 'https://globalnet-services.fr'
  });

  const handleSaveConfig = (config: RobotsConfig) => {
    setCurrentConfig(config);
    // Ici on pourrait sauvegarder en base de données
    console.log('Configuration robots.txt sauvegardée:', config);
  };

  const generateRobotsPreview = () => {
    let content = `User-agent: *\n`;
    
    currentConfig.rules.forEach(rule => {
      if (rule.userAgent && rule.userAgent !== '*') {
        content += `User-agent: ${rule.userAgent}\n`;
      }
      
      if (rule.allow) {
        rule.allow.forEach(path => {
          content += `Allow: ${path}\n`;
        });
      }
      
      if (rule.disallow) {
        rule.disallow.forEach(path => {
          content += `Disallow: ${path}\n`;
        });
      }
      
      content += '\n';
    });
    
    content += `Sitemap: ${currentConfig.sitemap}\n`;
    content += `Host: ${currentConfig.host}\n`;
    
    return content;
  };

  return (
    <div className="space-y-6">
      {/* En-tête de la section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Configuration Robots.txt</h2>
            <p className="text-sm text-gray-600">Gérez les règles d'indexation des moteurs de recherche</p>
          </div>
        </div>
        <Button
          onClick={() => setIsEditorOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Settings size={16} />
          Modifier
        </Button>
      </div>

      {/* Aperçu de la configuration actuelle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Règles actuelles */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Règles actuelles</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditorOpen(true)}
                className="flex items-center gap-2"
              >
                <Eye size={14} />
                Voir détails
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            {currentConfig.rules.map((rule, index) => (
              <div key={index} className="border border-gray-100 rounded p-3 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-gray-700">
                    {rule.userAgent === '*' ? 'Tous les robots' : rule.userAgent}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Actif
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Autorisé:</span>
                    <span className="ml-1 text-gray-700">
                      {rule.allow?.length || 0} chemin(s)
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Bloqué:</span>
                    <span className="ml-1 text-gray-700">
                      {rule.disallow?.length || 0} chemin(s)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration globale */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration globale</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sitemap URL
              </label>
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                {currentConfig.sitemap}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Host
              </label>
              <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
                {currentConfig.host}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aperçu du fichier robots.txt */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Aperçu robots.txt</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditorOpen(true)}
              className="flex items-center gap-2"
            >
              <HelpCircle size={14} />
              Aide
            </Button>
          </div>
        </div>
        
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <pre>{generateRobotsPreview()}</pre>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">💡 Conseil</p>
              <p>
                Les modifications des règles robots.txt peuvent impacter l'indexation du site. 
                Testez toujours les changements avant de les appliquer en production.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Dernière modification: {new Date().toLocaleDateString('fr-FR')}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsEditorOpen(true)}
            className="flex items-center gap-2"
          >
            <Settings size={16} />
            Modifier la configuration
          </Button>
        </div>
      </div>

      {/* Éditeur modal */}
      <CMSRobotsEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveConfig}
        initialConfig={currentConfig}
      />
    </div>
  );
}; 