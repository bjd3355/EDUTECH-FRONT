import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaIdCard, FaBirthdayCake, FaBook, FaCamera, FaCheck, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

// Interface pour les données utilisateur
interface UserData {
  name: string;
  email: string;
  phone: string;
  employeeId: string;
  dateOfBirth: string;
  department: string;
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
    name: 'Professeur Exemple',
    email: 'professeur@example.com',
    phone: '+221 77 123 45 67',
    employeeId: 'PROF123456',
    dateOfBirth: '1980-05-15',
    department: 'Informatique',
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
      toast.info('Photo de profil mise à jour !', { icon: <FaCamera /> });
    }
  };

  const handleSave = async () => {
    if (!user.name || !user.email || !user.phone || !user.dateOfBirth || !user.department) {
      toast.error(t('tousLesChampsObligatoires'), { icon: <FaTimes /> });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      toast.error(t('emailInvalide'), { icon: <FaTimes /> });
      return;
    }
    if (password && password !== confirmPassword) {
      toast.error(t('motsDePasseNonCorrespondants'), { icon: <FaTimes /> });
      return;
    }
    if (password && password.length < 6) {
      toast.error(t('motDePasseTropCourt'), { icon: <FaTimes /> });
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
        toast.success(t('profilMisAJour'), { icon: <FaCheck /> });
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch {
      toast.error(t('erreurSauvegarde'), { icon: <FaTimes /> });
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl max-w-3xl w-full mx-auto my-4 sm:my-6 md:my-8 border border-gray-100"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#6B7280] via-[#2CB3C2] to-[#1A8A97] bg-clip-text text-transparent mb-6 sm:mb-8 md:mb-10 flex items-center justify-center">
          <FaUser className="mr-2 sm:mr-3 md:mr-4 text-[#2CB3C2] animate-pulse text-lg sm:text-xl md:text-2xl" /> {t('Mon Profil')}
        </h1>

        <div className="flex justify-center mb-6 sm:mb-8 md:mb-10">
          <div className="relative group">
            <motion.img
              src={previewPicture || user.profilePicture}
              alt="Photo de profil"
              className="w-24 sm:w-32 md:w-40 h-24 sm:h-32 md:h-40 rounded-full object-cover border-4 border-[#2CB3C2] shadow-lg transition-transform duration-300"
              whileHover={{ scale: 1.1, rotate: 5 }}
            />
            {isEditing && (
              <label
                htmlFor="profilePicture"
                className="absolute bottom-1 sm:bottom-2 right-1 sm:right-2 bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] p-2 sm:p-3 rounded-full cursor-pointer hover:from-[#1A8A97] hover:to-[#2CB3C2] transition-all duration-300 shadow-md"
              >
                <FaCamera className="text-white text-base sm:text-xl" />
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

        <div className="space-y-6 sm:space-y-8">
          {[
            { icon: FaUser, label: t('nom'), value: user.name, key: 'name', type: 'text' },
            { icon: FaIdCard, label: t('numeroEmploye'), value: user.employeeId, key: 'employeeId', type: 'text', disabled: true },
            { icon: FaEnvelope, label: t('email'), value: user.email, key: 'email', type: 'email' },
            { icon: FaPhone, label: t('telephone'), value: user.phone, key: 'phone', type: 'tel' },
            { icon: FaBirthdayCake, label: t('dateDeNaissance'), value: user.dateOfBirth, key: 'dateOfBirth', type: 'date' },
            { icon: FaBook, label: t('departement'), value: user.department, key: 'department', type: 'text' },
          ].map((field, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <label className="flex items-center text-[#2C6E78] font-semibold mb-2 text-sm sm:text-base md:text-lg">
                <field.icon className="mr-2 sm:mr-3 text-[#2CB3C2] animate-bounce-slow text-lg sm:text-xl" /> {field.label}
              </label>
              <motion.input
                type={field.type}
                value={field.value}
                onChange={(e) => setUser({ ...user, [field.key]: e.target.value })}
                disabled={!isEditing || field.disabled}
                className={`w-full p-3 sm:p-4 border rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-[#2CB3C2]/20 focus:border-[#2CB3C2] transition-all duration-300 text-sm sm:text-base ${
                  isEditing && !field.disabled ? 'border-[#2CB3C2] bg-white' : 'border-gray-200 bg-gray-50'
                }`}
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>
          ))}
          {isEditing && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <label className="flex items-center text-[#2C6E78] font-semibold mb-2 text-sm sm:text-base md:text-lg">
                  <FaLock className="mr-2 sm:mr-3 text-[#2CB3C2] animate-bounce-slow text-lg sm:text-xl" /> {t('nouveauMotDePasse')}
                </label>
                <motion.input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 sm:p-4 border border-[#2CB3C2] rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-[#2CB3C2]/20 focus:border-[#2CB3C2] bg-white transition-all duration-300 text-sm sm:text-base"
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <label className="flex items-center text-[#2C6E78] font-semibold mb-2 text-sm sm:text-base md:text-lg">
                  <FaLock className="mr-2 sm:mr-3 text-[#2CB3C2] animate-bounce-slow text-lg sm:text-xl" /> {t('confirmerMotDePasse')}
                </label>
                <motion.input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 sm:p-4 border border-[#2CB3C2] rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-[#2CB3C2]/20 focus:border-[#2CB3C2] bg-white transition-all duration-300 text-sm sm:text-base"
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>
            </>
          )}
        </div>

        <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row justify-between gap-4">
          {isEditing ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] text-white rounded-xl shadow-lg transition-all duration-300 text-sm sm:text-base ${
                isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:from-[#1A8A97] hover:to-[#2CB3C2]'
              }`}
            >
              {isSaving ? t('sauvegardeEnCours') : t('enregistrerModifications')}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-[#2CB3C2] to-[#1A8A97] text-white rounded-xl shadow-lg hover:from-[#1A8A97] hover:to-[#2CB3C2] transition-all duration-300 text-sm sm:text-base"
            >
              {t('modifier')}
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClose}
            className="w-full py-2 sm:py-3 px-4 sm:px-6 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl shadow-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 text-sm sm:text-base"
          >
            {t('fermer')}
          </motion.button>
        </div>
      </motion.div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="colored"
        className="font-semibold text-sm sm:text-base"
      />
    </div>
  );
};

export default ProfilePage;