import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaIdCard, FaBirthdayCake, FaBook, FaCamera } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Interface pour les données utilisateur
interface UserData {
  name: string;
  email: string;
  phone: string;
  studentId: string;
  dateOfBirth: string;
  major: string;
  profilePicture: string;
  password?: string;
}

// Simuler une API avec un type de retour
const saveProfileToAPI = async (userData: UserData): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Profil sauvegardé :', userData);
      resolve({ success: true });
    }, 1000);
  });
};

interface ProfilePageProps {
  onClose?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserData>({
    name: 'Étudiant Exemple',
    email: 'etudiant@example.com',
    phone: '+221 77 123 45 67',
    studentId: 'STU123456',
    dateOfBirth: '2000-05-15',
    major: 'Génie Informatique',
    profilePicture: 'https://via.placeholder.com/150',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [previewPicture, setPreviewPicture] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Charger les données depuis une API (optionnel)
    // const fetchProfile = async () => {
    //   const response = await fetchProfileFromAPI();
    //   setUser(response);
    // };
    // fetchProfile();
  }, []);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewPicture(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user.name || !user.email || !user.phone || !user.dateOfBirth || !user.major) {
      toast.error(t('tousLesChampsObligatoires'));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      toast.error(t('emailInvalide'));
      return;
    }
    if (password && password !== confirmPassword) {
      toast.error(t('motsDePasseNonCorrespondants'));
      return;
    }
    if (password && password.length < 6) {
      toast.error(t('motDePasseTropCourt'));
      return;
    }

    setIsSaving(true);
    try {
      const updatedUser: UserData = {
        ...user,
        profilePicture: previewPicture || user.profilePicture,
        ...(password && { password }),
      };
      const response = await saveProfileToAPI(updatedUser);
      if (response.success) {
        setUser(updatedUser);
        setPreviewPicture(null);
        setPassword('');
        setConfirmPassword('');
        setIsEditing(false);
        toast.success(t('profilMisAJour'));
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
    if (isEditing && !window.confirm(t('confirmerAnnulationModifications'))) {
      return;
    }
    setIsEditing(false);
    setPreviewPicture(null);
    setPassword('');
    setConfirmPassword('');
    if (onClose) onClose();
    navigate('/dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full mx-auto my-8 border border-gray-100"
    >
      <h1 className="text-3xl font-bold text-[#2C6E78] mb-8 flex items-center justify-center">
        <FaUser className="mr-3 text-[#2CB3C2]" /> {t('Mon Profil')}
      </h1>

      <div className="flex justify-center mb-8">
        <div className="relative group">
          <img
            src={previewPicture || user.profilePicture}
            alt="Photo de profil"
            className="w-32 h-32 rounded-full object-cover border-4 border-[#2CB3C2] shadow-md transition-transform duration-300 group-hover:scale-105"
          />
          {isEditing && (
            <label
              htmlFor="profilePicture"
              className="absolute bottom-1 right-1 bg-[#2CB3C2] p-2 rounded-full cursor-pointer hover:bg-[#1F5A63] transition-colors duration-300"
            >
              <FaCamera className="text-white text-lg" />
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {[
          { icon: FaUser, label: t('nom'), value: user.name, key: 'name' },
          { icon: FaIdCard, label: t('numeroEtudiant'), value: user.studentId, key: 'studentId', disabled: true },
          { icon: FaEnvelope, label: t('email'), value: user.email, key: 'email' },
          { icon: FaPhone, label: t('telephone'), value: user.phone, key: 'phone' },
          { icon: FaBirthdayCake, label: t('dateDeNaissance'), value: user.dateOfBirth, key: 'dateOfBirth', type: 'date' },
          { icon: FaBook, label: t('filiere'), value: user.major, key: 'major' },
        ].map((field, index) => (
          <div key={index}>
            <label className="flex items-center text-[#2C6E78] font-semibold mb-1">
              <field.icon className="mr-2 text-[#2CB3C2]" /> {field.label}
            </label>
            <input
              type={field.type || 'text'}
              value={field.value}
              onChange={(e) => setUser({ ...user, [field.key]: e.target.value })}
              disabled={!isEditing || field.disabled}
              className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2CB3C2] ${
                isEditing && !field.disabled ? 'border-[#2CB3C2]' : 'border-gray-300 bg-gray-100'
              }`}
            />
          </div>
        ))}
        {isEditing && (
          <>
            <div>
              <label className="flex items-center text-[#2C6E78] font-semibold mb-1">
                <FaLock className="mr-2 text-[#2CB3C2]" /> {t('nouveauMotDePasse')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-[#2CB3C2] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]"
              />
            </div>
            <div>
              <label className="flex items-center text-[#2C6E78] font-semibold mb-1">
                <FaLock className="mr-2 text-[#2CB3C2]" /> {t('confirmerMotDePasse')}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-[#2CB3C2] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2CB3C2]"
              />
            </div>
          </>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        {isEditing ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={isSaving}
            className={`py-3 px-6 bg-[#2CB3C2] text-white rounded-lg shadow-md transition-opacity duration-300 ${
              isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1F5A63]'
            }`}
          >
            {isSaving ? t('sauvegardeEnCours') : t('enregistrerModifications')}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="py-3 px-6 bg-[#2CB3C2] text-white rounded-lg shadow-md hover:bg-[#1F5A63] transition-colors duration-300"
          >
            {t('modifier')}
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClose}
          className="py-3 px-6 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300"
        >
          {t('fermer')}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProfilePage;