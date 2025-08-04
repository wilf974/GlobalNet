'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { HelpCircle, Save, RotateCcw, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';

interface RobotsRule {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
}

interface RobotsConfig {
  rules: RobotsRule[];
  sitemap: string;
  host: string;
}

interface CMSRobotsEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: RobotsConfig) => void;
  initialConfig?: RobotsConfig;
}

export const CMSRobotsEditor: React.FC<CMSRobotsEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  initialConfig
}) => {
  const [config, setConfig] = useState<RobotsConfig>({
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

  const [showHelp, setShowHelp] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeHelpField, setActiveHelpField] = useState<string | null>(null);

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
    }
  }, [initialConfig]);

  const helpContent = {
    userAgent: {
      title: "User Agent",
      content: "L'identifiant du robot d'indexation. '*' signifie tous les robots, 'Googlebot' signifie uniquement le robot Google."
    },
    allow: {
      title: "Pages autorisées",
      content: "Liste des chemins accessibles aux robots. Autorisez les pages publiques importantes : accueil, services, à propos, contact, devis."
    },
    disallow: {
      title: "Pages interdites",
      content: "Liste des chemins bloqués pour les robots. Bloquez les pages privées : /api/, /admin/, /dashboard/, /auth/, /_next/, /static/."
    },
    sitemap: {
      title: "Sitemap URL",
      content: "L'URL du sitemap XML qui liste toutes les pages publiques du site. Généralement à https://votre-domaine.com/sitemap.xml"
    },
    host: {
      title: "Host",
      content: "Le domaine principal du site. Mettez votre domaine principal sans slash final : https://globalnet-services.fr"
    }
  };

  const addRule = () => {
    setConfig(prev => ({
      ...prev,
      rules: [...prev.rules, { userAgent: '', allow: [], disallow: [] }]
    }));
  };

  const removeRule = (index: number) => {
    setConfig(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const updateRule = (index: number, field: keyof RobotsRule, value: any) => {
    setConfig(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => 
        i === index ? { ...rule, [field]: value } : rule
      )
    }));
  };

  const addPath = (ruleIndex: number, type: 'allow' | 'disallow', path: string) => {
    if (!path.trim()) return;
    
    setConfig(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => {
        if (i === ruleIndex) {
          const currentPaths = rule[type] || [];
          return {
            ...rule,
            [type]: [...currentPaths, path.trim()]
          };
        }
        return rule;
      })
    }));
  };

  const removePath = (ruleIndex: number, type: 'allow' | 'disallow', pathIndex: number) => {
    setConfig(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => {
        if (i === ruleIndex) {
          const currentPaths = rule[type] || [];
          return {
            ...rule,
            [type]: currentPaths.filter((_, j) => j !== pathIndex)
          };
        }
        return rule;
      })
    }));
  };

  const generateRobotsTxt = () => {
    let content = `User-agent: *\n`;
    
    config.rules.forEach(rule => {
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
    
    content += `Sitemap: ${config.sitemap}\n`;
    content += `Host: ${config.host}\n`;
    
    return content;
  };

  const handleSave = () => {
    onSave(config);
    onClose();
  };

  const resetToDefault = () => {
    setConfig({
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
  };

  const handleAddPath = (ruleIndex: number, type: 'allow' | 'disallow') => {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
      addPath(ruleIndex, type, input.value);
      input.value = '';
    };
  };

  const handleKeyPress = (ruleIndex: number, type: 'allow' | 'disallow') => {
    return (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        addPath(ruleIndex, type, e.currentTarget.value);
        e.currentTarget.value = '';
      }
    };
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Éditeur Robots.txt" size="xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Éditeur Robots.txt</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-2"
            >
              <HelpCircle size={16} />
              Aide
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2"
            >
              {previewMode ? <EyeOff size={16} /> : <Eye size={16} />}
              Prévisualisation
            </Button>
          </div>
        </div>

        {showHelp && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Guide d'utilisation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              {Object.entries(helpContent).map(([key, help]) => (
                <div key={key} className="space-y-1">
                  <strong>{help.title}:</strong>
                  <p>{help.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {previewMode ? (
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Prévisualisation robots.txt</h3>
              <pre className="text-sm bg-white p-4 rounded border overflow-x-auto">
                {generateRobotsTxt()}
              </pre>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Configuration globale */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sitemap URL
                  <button
                    type="button"
                    onClick={() => setActiveHelpField(activeHelpField === 'sitemap' ? null : 'sitemap')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <HelpCircle size={14} />
                  </button>
                </label>
                <Input
                  value={config.sitemap}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfig(prev => ({ ...prev, sitemap: e.target.value }))}
                  placeholder="https://globalnet-services.fr/sitemap.xml"
                />
                {activeHelpField === 'sitemap' && (
                  <div className="absolute z-10 mt-1 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                    {helpContent.sitemap.content}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Host
                  <button
                    type="button"
                    onClick={() => setActiveHelpField(activeHelpField === 'host' ? null : 'host')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <HelpCircle size={14} />
                  </button>
                </label>
                <Input
                  value={config.host}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfig(prev => ({ ...prev, host: e.target.value }))}
                  placeholder="https://globalnet-services.fr"
                />
                {activeHelpField === 'host' && (
                  <div className="absolute z-10 mt-1 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                    {helpContent.host.content}
                  </div>
                )}
              </div>
            </div>

            {/* Règles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Règles Robots</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addRule}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  Ajouter une règle
                </Button>
              </div>

              {config.rules.map((rule, ruleIndex) => (
                <div key={ruleIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        User Agent
                        <button
                          type="button"
                          onClick={() => setActiveHelpField(activeHelpField === 'userAgent' ? null : 'userAgent')}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <HelpCircle size={14} />
                        </button>
                      </label>
                      <Input
                        value={rule.userAgent}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateRule(ruleIndex, 'userAgent', e.target.value)}
                        placeholder="* (tous les robots)"
                      />
                      {activeHelpField === 'userAgent' && (
                        <div className="absolute z-10 mt-1 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                          {helpContent.userAgent.content}
                        </div>
                      )}
                    </div>
                    {config.rules.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeRule(ruleIndex)}
                        className="ml-4 text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pages autorisées */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pages autorisées
                        <button
                          type="button"
                          onClick={() => setActiveHelpField(activeHelpField === 'allow' ? null : 'allow')}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <HelpCircle size={14} />
                        </button>
                      </label>
                      <div className="space-y-2">
                        {(rule.allow || []).map((path, pathIndex) => (
                          <div key={pathIndex} className="flex items-center gap-2">
                            <Input
                              value={path}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const newPaths = [...(rule.allow || [])];
                                newPaths[pathIndex] = e.target.value;
                                updateRule(ruleIndex, 'allow', newPaths);
                              }}
                              placeholder="/"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removePath(ruleIndex, 'allow', pathIndex)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        ))}
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Ajouter un chemin autorisé"
                            onKeyPress={handleKeyPress(ruleIndex, 'allow')}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddPath(ruleIndex, 'allow')}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </div>
                      {activeHelpField === 'allow' && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                          {helpContent.allow.content}
                        </div>
                      )}
                    </div>

                    {/* Pages interdites */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pages interdites
                        <button
                          type="button"
                          onClick={() => setActiveHelpField(activeHelpField === 'disallow' ? null : 'disallow')}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <HelpCircle size={14} />
                        </button>
                      </label>
                      <div className="space-y-2">
                        {(rule.disallow || []).map((path, pathIndex) => (
                          <div key={pathIndex} className="flex items-center gap-2">
                            <Input
                              value={path}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const newPaths = [...(rule.disallow || [])];
                                newPaths[pathIndex] = e.target.value;
                                updateRule(ruleIndex, 'disallow', newPaths);
                              }}
                              placeholder="/api/"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removePath(ruleIndex, 'disallow', pathIndex)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        ))}
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Ajouter un chemin interdit"
                            onKeyPress={handleKeyPress(ruleIndex, 'disallow')}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddPath(ruleIndex, 'disallow')}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                      </div>
                      {activeHelpField === 'disallow' && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                          {helpContent.disallow.content}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={resetToDefault}
              className="flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Réinitialiser
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Save size={16} />
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}; 