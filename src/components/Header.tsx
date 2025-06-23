import React, { useState, useEffect, useRef } from 'react';
import ProfileCard from './ProfileCard';
import DropdownMenu from './DropdownMenu';
import { Link } // Asumimos que usaremos react-router-dom para la navegación del menú
from 'react-router-dom';

import { simulatedUser } from '../userData'; // Importar datos simulados

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  // Cerrar dropdown si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white text-gray-700 shadow-md"> {/* Fondo blanco, texto gris oscuro */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="https://latam.sumitomodrive.com/themes/custom/sdt_tailwind/dist/svgs/logo/colored/sumitomo-drive-technologies.svg"
            alt="Sumitomo Drive Technologies Logo"
            className="h-10 mr-3" // Ajustar altura según sea necesario
          />
        </Link>

        {/* Menú Superior */}
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link to="/profile" className="text-gray-600 hover:text-blue-600">Configuración</Link>
        </nav>

        {/* Información de Usuario y Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <ProfileCard
            userName={simulatedUser.name}
            userRole={simulatedUser.role}
            profileImageUrl={simulatedUser.profileImageUrl}
            onProfileClick={toggleDropdown}
          />
          <DropdownMenu isOpen={isDropdownOpen} onClose={closeDropdown} />
        </div>
      </div>
    </header>
  );
};

export default Header;
