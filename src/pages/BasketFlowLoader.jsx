import React, { useEffect,  } from "react";
import { useNavigate } from "react-router";
import Logo from '../assets/img/logo.png'

const BasketFlowLoader = () => {

  const navigate = useNavigate();

  useEffect(() => { 
    // Simulate loading time
    const timer = setTimeout(() => {
      navigate('/folders'); // Redirect to folders after loading
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [])

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-indigo-700">
      {/* Logo */}
      <img
        src={Logo}
        alt="BasketFlow Logo"
        className="w-32 h-32 mb-8 animate-bounce object-contain"
        draggable={false}
        style={{ filter: "drop-shadow(0 0 24px #312e81)" }}
      />
      {/* App Name */}
      <h1 className="text-4xl font-extrabold text-white mb-4 tracking-wide drop-shadow-lg">
        BasketFlow
      </h1>
      {/* Loading Animation */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></div>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0s]"></div>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
      </div>
      {/* Optional: Tagline */}
      <p className="mt-8 text-indigo-100 text-lg">
        Gestiona tus partidos de basketball fácilmente
      </p>
    </div>
  );
};

export default BasketFlowLoader;