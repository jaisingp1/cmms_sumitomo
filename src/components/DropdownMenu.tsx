import React from 'react';
import { Link } from 'react-router-dom'; // Asumimos que usaremos react-router-dom

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-gray-700">
      <Link
        to="/profile" // Actualizaremos esto cuando definamos las rutas
        className="block px-4 py-2 text-sm hover:bg-gray-100"
        onClick={onClose}
      >
        Perfil
      </Link>
      <button
        onClick={() => {
          alert('Simulando cierre de sesión...'); // Acción simulada
          onClose();
        }}
        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default DropdownMenu;
