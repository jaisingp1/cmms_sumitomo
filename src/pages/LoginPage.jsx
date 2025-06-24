import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; // Para acceder a las variables CSS globales y estilos base
// Asumimos que App.css podría tener estilos más específicos de la app si es necesario
// import '../App.css';

const LoginPage = () => {
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
        <h2 className="text-xl text-center text-gray-700 mb-6">Iniciar Sesión</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] sm:text-sm"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
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
            Ingresar
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-sm hover:underline"
            style={{ color: 'var(--primary-color)' }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--secondary-color)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
