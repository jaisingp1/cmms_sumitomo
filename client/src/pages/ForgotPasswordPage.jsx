import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; // Para acceder a las variables CSS globales y estilos base

const ForgotPasswordPage = () => {
  const [messageVisible, setMessageVisible] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessageVisible(true);
    // Aquí iría la lógica para enviar el correo de recuperación
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img
            src="https://latam.sumitomodrive.com/themes/custom/sdt_tailwind/dist/svgs/logo/colored/sumitomo-drive-technologies.svg"
            alt="Sumitomo Drive Technologies Logo"
            className="h-12"
          />
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">CMMS Sumitomo</h1>
        <h2 className="text-xl text-center text-gray-700 mb-6">Recuperar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            style={{ backgroundColor: 'var(--primary-color)', color: 'var(--text-color)' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#002244'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color)'}
          >
            Enviar
          </button>
        </form>
        {messageVisible && (
          <div
            className="mt-4 p-3 rounded-md text-sm"
            style={{ backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' }}
          >
            Se enviará un link a su correo para recuperar la contraseña. Si no llega en 5 minutos, verificar en el spam.
          </div>
        )}
        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="text-sm hover:underline"
            style={{ color: 'var(--primary-color)' }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--secondary-color)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
          >
            Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
