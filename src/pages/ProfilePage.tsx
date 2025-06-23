import React, { useState } from 'react';
import { simulatedUser } from '../userData'; // Importar datos simulados

const ProfilePage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>(simulatedUser.role);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRoleSave = () => {
    // Simular guardado
    console.log('Rol guardado:', selectedRole);
    setMessage({ type: 'success', text: 'Rol actualizado correctamente.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las nuevas contraseñas no coinciden.' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    if (!currentPassword || !newPassword) {
      setMessage({ type: 'error', text: 'Por favor, complete todos los campos de contraseña.' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    // Simular cambio de contraseña
    console.log('Cambiando contraseña...');
    setMessage({ type: 'success', text: 'Contraseña actualizada correctamente.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Configuración de Perfil</h1>

      {message && (
        <div
          className={`p-4 mb-6 rounded-md text-sm ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Sección de Rol */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Rol por Defecto</h2>
        <div className="mb-4">
          <label htmlFor="roleSelect" className="block text-sm font-medium text-gray-600 mb-1">
            Selecciona tu rol:
          </label>
          <select
            id="roleSelect"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            {simulatedUser.availableRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleRoleSave}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Guardar Rol
        </button>
      </div>

      {/* Sección de Cambio de Contraseña */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Cambiar Contraseña</h2>
        <form onSubmit={handlePasswordChange}>
          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Contraseña Actual
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600 mb-1">
              Nueva Contraseña
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cambiar Contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
