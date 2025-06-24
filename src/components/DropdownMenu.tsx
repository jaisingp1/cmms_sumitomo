import React from 'react';
import { Link } from 'react-router-dom'; // Asumimos que usaremos react-router-dom

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void; // Prop opcional para el logout
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    onClose(); // Cierra el dropdown independientemente
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-gray-700">
      <Link
        to="/profile"
        className="block px-4 py-2 text-sm hover:bg-gray-100"
        onClick={onClose} // Cierra el dropdown al hacer clic en un enlace
      >
        Perfil
      </Link>
      <button
        onClick={handleLogoutClick}
        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default DropdownMenu;
