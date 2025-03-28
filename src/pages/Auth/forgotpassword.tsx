import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginIllustration from "../../assets/Privacypolicy11-ezgif.com-gif-maker.gif";
import edutechLogo from "../../assets/logoedutech.jpg";
import backgroundImage from '../../assets/backgroundImage.jpg'; 
import { FaAt, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
      setSuccess(true);
    } catch (err) {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-montserrat"
       style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Couche de flou */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md"></div>

      <div className="absolute top-4 left-4">
        <img src={edutechLogo || "/placeholder.svg?height=40&width=120"} alt="EduTech Logo" className="h-10" />
      </div>

      <div className=" relative bg-[#2CB3C2] bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-lg flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        <div className="w-full md:w-1/2 bg-gradient-to-br bg-[#2CB3C2] flex items-center justify-center p-4">
          <img
            src={loginIllustration || "/placeholder.svg?height=300&width=300"}
            alt="Login Illustration"
            className="max-w-full h-auto max-h-[400px] md:max-h-none object-contain rounded-image"
          />
        </div>

        <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col justify-center bg-[#2CB3C2]">
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-4 md:p-6 min-h-[350px] md:min-h-[500px] flex flex-col justify-center">
            <Link to="/" className="flex items-center text-gray-600 hover:text-cyan-600 mb-6 transition-colors">
              <FaArrowLeft className="mr-2" />
              <span>Retour à la connexion</span>
            </Link>

            {success ? (
              <div className="text-center">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Email envoyé</h2>
                <p className="text-gray-600 mb-6">
                  Un code de réinitialisation a été envoyé à {email}. Veuillez vérifier votre boîte de réception.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="w-full bg-cyan-500 text-white p-3 rounded-xl border-2 border-cyan-500 hover:bg-cyan-600 hover:border-cyan-600 transition duration-300 font-medium"
                >
                  Retour à la connexion
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Mot de passe oublié</h2>
                <p className="text-gray-600 mb-6">
                  Entrez votre adresse e-mail pour recevoir un code.
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="mb-6 relative">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="exemple@gmail.com"
                        className="w-full p-3 pl-10 pt-7 rounded-xl bg-white border-2 border-black focus:outline-none focus:border-cyan-500 text-gray-600 peer transition-all duration-300"
                        required
                      />
                      <FaAt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <label
                        className={`absolute left-9 top-4 text-black transition-all duration-300 peer-focus:top-1 peer-focus:text-xs peer-focus:text-cyan-500 peer-focus:bg-white peer-focus:px-1 ${
                          email ? "top-1 text-xs text-black" : ""
                        }`}
                      >
                        Adresse e-mail
                      </label>
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-cyan-500 text-white p-3 rounded-xl border-2 border-cyan-500 hover:bg-cyan-600 hover:border-cyan-600 transition duration-300 font-medium disabled:opacity-50"
                  >
                    {isLoading ? "Traitement en cours..." : "Valider"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;