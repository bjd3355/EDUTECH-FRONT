import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginIllustration from '../../assets/Privacypolicy11-ezgif.com-gif-maker.gif';
import edutechLogo from '../../assets/logoedutech.jpg';
import backgroundImage from '../../assets/backgroundImage.jpg'; // Ajoutez votre image de fond ici
import { FaAt, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Email invalide (ex. nom@domaine.com requis)");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (emailRegex.test(email) && password.length > 0) {
        const mockToken = `mock_${Math.random().toString(36).substring(2)}`;
        localStorage.setItem("token", mockToken);
        localStorage.setItem("user", JSON.stringify({ email }));
        localStorage.setItem("loginSuccess", "true");
        navigate("/dashboard");
      } else {
        setError("Identifiants invalides");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-2 sm:p-4 font-montserrat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Couche de flou */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md"></div>

      {/* Logo */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
        <img src={edutechLogo} alt="EduTech Logo" className="h-8 sm:h-10 w-auto" />
      </div>

      {/* Conteneur principal */}
      <div className=" bg-[#2CB3C2] bg-opacity-80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg flex flex-col sm:flex-row w-full max-w-[98%] sm:max-w-5xl min-h-[350px] sm:min-h-[500px] overflow-hidden">
        {/* Section illustration */}
        <div className="w-full sm:w-1/2 bg-gradient-to-br bg-[#2CB3C2] flex items-center justify-center p-4 sm:p-8 order-2 sm:order-1 min-h-[350px] sm:min-h-[500px]">
          <img
            src={loginIllustration}
            alt="Login Illustration"
            className="max-w-full h-auto max-h-[800px] md:max-h-none object-contain rounded-image"
          />
        </div>

        {/* Section formulaire */}
        <div className="w-full sm:w-1/2 p-4 sm:p-8 flex flex-col justify-center bg-[#2CB3C2] order-1 sm:order-2 min-h-[350px] sm:min-h-[500px]">
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-center h-full">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center underline">Connexion</h2>
            <form onSubmit={handleSubmit}>
              {/* Champ Email */}
              <div className="mb-4 sm:mb-6 relative">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@gmail.com"
                    className="w-full p-2 pl-10 pt-6 sm:pt-7 rounded-lg sm:rounded-xl bg-white border-2 border-black focus:outline-none focus:border-cyan-500 text-gray-600 peer transition-all duration-300 text-sm sm:text-base"
                    required
                  />
                  <FaAt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <label
                    className={`absolute left-9 top-3 sm:top-4 text-black transition-all duration-300 peer-focus:top-1 peer-focus:text-xs peer-focus:text-cyan-500 peer-focus:bg-white peer-focus:px-1 ${
                      email ? 'top-1 text-xs text-black' : ''
                    }`}
                  >
                    Email
                  </label>
                </div>
              </div>

              {/* Champ Mot de passe */}
              <div className="mb-4 sm:mb-6 relative">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="w-full p-2 pl-10 pr-10 pt-6 sm:pt-7 rounded-lg sm:rounded-xl bg-white border-2 border-black focus:outline-none focus:border-cyan-500 text-gray-600 peer transition-all duration-300 text-sm sm:text-base"
                    required
                  />
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <label
                    className={`absolute left-9 top-3 sm:top-4 text-black transition-all duration-300 peer-focus:top-1 peer-focus:text-xs peer-focus:text-cyan-500 peer-focus:bg-white peer-focus:px-1 ${
                      password ? 'top-1 text-xs text-black' : ''
                    }`}
                  >
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Lien Mot de passe oublié */}
              <div className="flex justify-end mb-3 sm:mb-5">
                <Link to="/Auth/forgot-password" className="text-cyan-400 font-medium hover:underline text-sm sm:text-base">
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Message d'erreur */}
              {error && <p className="text-red-500 text-xs sm:text-sm mb-3 sm:mb-4">{error}</p>}

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-cyan-500 text-white p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 border-cyan-500 hover:bg-cyan-600 hover:border-cyan-600 transition duration-300 font-medium disabled:opacity-50 text-sm sm:text-base"
              >
                {isLoading ? 'Connexion en cours...' : 'Connexion'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;