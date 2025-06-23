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
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          MiEmpresa
        </Link>

        {/* Menú Superior */}
        <nav className="flex items-center space-x-6">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/profile" className="hover:text-gray-300">Configuración</Link> {/* Enlazado a /profile como se pide */}
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
