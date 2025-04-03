import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCog, FaBell, FaLock, FaGlobe, FaLanguage, FaUndo } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Interface pour les paramètres
interface SettingsData {
  notifications: boolean;
  emailNotifications: boolean;
  privacy: 'public' | 'private';
  language: 'en' | 'fr';
  theme: 'light' | 'dark';
}

// Simuler une API
const saveSettingsToAPI = async (settings: SettingsData): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Paramètres sauvegardés :', settings);
      resolve({ success: true });
    }, 1000);
  });
};

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const initialSettings: SettingsData = {
    notifications: true,
    emailNotifications: false,
    privacy: 'public',
    language: 'fr',
    theme: 'light',
  };

  const [settings, setSettings] = useState<SettingsData>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [previewTheme, setPreviewTheme] = useState(settings.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', previewTheme === 'dark');
  }, [previewTheme]);

  const handleChange = (newSettings: Partial<SettingsData>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    setHasUnsavedChanges(true);
  };

  const validateSettings = (): boolean => {
    if (!settings.language) {
      toast.error(t('langueRequise'));
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateSettings()) return;
    setIsSaving(true);
    try {
      const response = await saveSettingsToAPI(settings);
      if (response.success) {
        toast.success(t('parametresMisAJour'));
        setHasUnsavedChanges(false);
        if (i18n.language !== settings.language) {
          i18n.changeLanguage(settings.language);
        }
        setPreviewTheme(settings.theme);
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch {
      toast.error(t('erreurSauvegarde'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm(t('modificationsNonSauvegardees'))) {
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setPreviewTheme(initialSettings.theme);
    setHasUnsavedChanges(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-full sm:max-w-lg md:max-w-2xl mx-auto my-4 sm:my-8 border border-gray-100 ${
        previewTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'
      }`}
    >
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center justify-center">
        <FaCog className="mr-2 sm:mr-3 text-[#2CB3C2]" /> {t('parametres')}
      </h1>

      <div className="space-y-4 sm:space-y-6">
        {/* Section Notifications */}
        <Section title={t('notifications')} icon={<FaBell />}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleChange({ notifications: e.target.checked })}
                className="w-5 h-5 text-[#2CB3C2] rounded focus:ring-[#2CB3C2]"
                aria-label={t('activerNotifications')}
              />
              <span className="text-sm sm:text-base">{t('activerNotifications')}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleChange({ emailNotifications: e.target.checked })}
                className="w-5 h-5 text-[#2CB3C2] rounded focus:ring-[#2CB3C2]"
                aria-label={t('notificationsEmail')}
              />
              <span className="text-sm sm:text-base">{t('notificationsEmail')}</span>
            </label>
          </div>
        </Section>

        {/* Section Confidentialité */}
        <Section title={t('confidentialite')} icon={<FaLock />}>
          <select
            value={settings.privacy}
            onChange={(e) => handleChange({ privacy: e.target.value as 'public' | 'private' })}
            className="w-full p-2 sm:p-3 border border-[#2CB3C2] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2CB3C2] text-sm sm:text-base"
          >
            <option value="public">{t('publique')}</option>
            <option value="private">{t('privee')}</option>
          </select>
        </Section>

        {/* Section Langue */}
        <Section title={t('langue')} icon={<FaLanguage />}>
          <select
            value={settings.language}
            onChange={(e) => handleChange({ language: e.target.value as 'en' | 'fr' })}
            className="w-full p-2 sm:p-3 border border-[#2CB3C2] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2CB3C2] text-sm sm:text-base"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </Section>

        {/* Section Thème */}
        <Section title={t('theme')} icon={<FaGlobe />}>
          <select
            value={settings.theme}
            onChange={(e) => {
              const newTheme = e.target.value as 'light' | 'dark';
              handleChange({ theme: newTheme });
              setPreviewTheme(newTheme);
            }}
            className="w-full p-2 sm:p-3 border border-[#2CB3C2] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2CB3C2] text-sm sm:text-base"
          >
            <option value="light">{t('clair')}</option>
            <option value="dark">{t('sombre')}</option>
          </select>
        </Section>
      </div>

      {/* Boutons d'action */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-between gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={isSaving}
          className={`py-2 sm:py-3 px-4 sm:px-6 bg-[#2CB3C2] text-white rounded-lg shadow-md transition-opacity duration-300 flex items-center justify-center w-full sm:w-auto ${
            isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1F5A63]'
          }`}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-4 sm:h-5 w-4 sm:w-5 mr-2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                <path fill="white" d="M4 12a8 8 0 018-8v8h-8z" />
              </svg>
              {t('sauvegardeEnCours')}
            </>
          ) : (
            t('enregistrer')
          )}
        </motion.button>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="py-2 sm:py-3 px-4 sm:px-6 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition-colors duration-300 flex items-center justify-center w-full sm:w-auto"
          >
            <FaUndo className="mr-2" /> {t('reinitialiser')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClose}
            className="py-2 sm:py-3 px-4 sm:px-6 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center w-full sm:w-auto"
          >
            {t('fermer')}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Composant réutilisable pour les sections
interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon, children }) => (
  <div className="border-b border-gray-200 pb-4">
    <h2 className="flex items-center text-[#2C6E78] font-semibold mb-2 text-sm sm:text-base">
      {icon}
      <span className="ml-2">{title}</span>
    </h2>
    <div className="ml-0 sm:ml-6">{children}</div>
  </div>
);

export default Settings;