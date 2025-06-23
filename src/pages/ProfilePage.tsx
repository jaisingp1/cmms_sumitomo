import React, { useState, ReactNode } from 'react';
import { simulatedUser, User } from '../userData'; // Importar datos y tipo User

// Helper para formatear fechas
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Componente genérico para una sección del perfil
interface ProfileSectionProps {
  title: string;
  children: ReactNode;
}
const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children }) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-8">
    <h2 className="text-xl font-semibold mb-6 text-gray-700 border-b pb-2">{title}</h2>
    {children}
  </div>
);

// Componente para un campo de información (label y valor)
interface InfoFieldProps {
  label: string;
  value: ReactNode | string | undefined | null;
  isEditable?: boolean;
}
const InfoField: React.FC<InfoFieldProps> = ({ label, value, isEditable = false }) => (
  <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
    <p className="text-sm font-medium text-gray-600 md:col-span-1">{label}:</p>
    <div className={`text-sm text-gray-800 md:col-span-2 ${isEditable ? 'p-2 border border-gray-200 rounded bg-gray-50' : ''}`}>
      {value ?? <span className="text-gray-400 italic">No disponible</span>}
    </div>
  </div>
);

// --- Subcomponentes para cada sección ---

// 🔹 Información Básica
const BasicInfoSection: React.FC<{ user: User; onRoleChange: (newRole: string) => void; selectedRole: string; onSaveRole: () => void }> = ({ user, onRoleChange, selectedRole, onSaveRole }) => (
  <ProfileSection title="🔹 Información Básica">
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6 items-center">
        <div className="md:col-span-1 flex justify-center md:justify-start">
            <img
                src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${user.fullName.replace(/\s/g, '+')}&background=random`}
                alt="Foto de perfil"
                className="w-24 h-24 rounded-full object-cover shadow-sm"
            />
        </div>
        <div className="md:col-span-5">
            <InfoField label="Nombre completo" value={user.fullName} />
            <InfoField label="Correo electrónico" value={user.email} />
            <InfoField label="Nombre de usuario / ID" value={user.username} />
        </div>
    </div>

    <div className="mb-4">
      <label htmlFor="roleSelect" className="block text-sm font-medium text-gray-600 mb-1">
        Rol / Tipo de usuario:
      </label>
      <div className="flex items-center space-x-2">
        <select
          id="roleSelect"
          value={selectedRole}
          onChange={(e) => onRoleChange(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          {user.availableRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button
          onClick={onSaveRole}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Guardar Rol
        </button>
      </div>
    </div>
    <InfoField label="Fecha de registro" value={formatDate(user.registrationDate)} />
  </ProfileSection>
);

// 📁 Información Laboral o Interna
const WorkInfoSection: React.FC<{ user: User }> = ({ user }) => (
  <ProfileSection title="📁 Información Laboral o Interna">
    <InfoField label="Departamento / Área" value={user.department} />
    <InfoField label="Cargo o posición" value={user.position} />
    <InfoField label="Jefe directo / Supervisor" value={user.directSupervisor} />
    <InfoField label="Ubicación de oficina / Sucursal" value={user.officeLocation} />
    <InfoField label="Equipo o grupo" value={user.team} />
  </ProfileSection>
);

// 🔐 Seguridad y Acceso
const SecurityAccessSection: React.FC<{
  user: User;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  onCurrentPasswordChange: (val: string) => void;
  onNewPasswordChange: (val: string) => void;
  onConfirmPasswordChange: (val: string) => void;
  onPasswordSubmit: (e: React.FormEvent) => void;
}> = ({
  user, currentPassword, newPassword, confirmPassword,
  onCurrentPasswordChange, onNewPasswordChange, onConfirmPasswordChange, onPasswordSubmit
}) => (
  <ProfileSection title="🔐 Seguridad y Acceso">
    <InfoField label="Última conexión" value={user.lastLogin ? `${formatDate(user.lastLogin.date)} (IP: ${user.lastLogin.ip}, Dispositivo: ${user.lastLogin.device})` : 'N/A'} />
    <InfoField label="Permisos asignados" value={user.permissions?.join(', ')} />
    <InfoField label="Estado de la cuenta" value={user.accountStatus} />

    <h3 className="text-md font-semibold mt-6 mb-3 text-gray-600">Cambiar Contraseña</h3>
    <form onSubmit={onPasswordSubmit}>
      <div className="mb-4">
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-600 mb-1">Contraseña Actual</label>
        <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => onCurrentPasswordChange(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div className="mb-4">
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600 mb-1">Nueva Contraseña</label>
        <input type="password" id="newPassword" value={newPassword} onChange={(e) => onNewPasswordChange(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-1">Confirmar Nueva Contraseña</label>
        <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => onConfirmPasswordChange(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
      <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Cambiar Contraseña
      </button>
    </form>
  </ProfileSection>
);

// 🧩 Preferencias del Usuario
const UserPreferencesSection: React.FC<{ user: User }> = ({ user }) => (
  <ProfileSection title="🧩 Preferencias del Usuario">
    <InfoField label="Idioma preferido" value={user.preferredLanguage} />
    <InfoField label="Zona horaria" value={user.timeZone} />
    <InfoField label="Tema visual / Modo oscuro" value={user.visualTheme} />
    <InfoField label="Notificaciones" value={user.notificationsEnabled ? 'Activas' : 'Desactivadas'} />
    <InfoField label="Formato de fecha" value={user.dateFormat} />
    <InfoField label="Formato de hora" value={user.timeFormat} />
  </ProfileSection>
);

// 📞 Información de Contacto
const ContactInfoSection: React.FC<{ user: User }> = ({ user }) => (
  <ProfileSection title="📞 Información de Contacto">
    <InfoField label="Teléfono interno o celular" value={user.internalPhone} />
    <InfoField label="Extensión" value={user.extension} />
    <InfoField label="Redes internas o chat" value={user.chatContact} />
  </ProfileSection>
);

// 📦 Actividad Reciente
const RecentActivitySection: React.FC<{ user: User }> = ({ user }) => (
    <ProfileSection title="📦 Actividad Reciente">
      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-1">Últimas acciones:</h4>
          {user.recentActions && user.recentActions.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-700 pl-2">
              {user.recentActions.map((item, index) => (
                <li key={index}>{item.action} ({formatDate(item.date)}) {item.details && `- ${item.details}`}</li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-500 italic">No hay acciones recientes.</p>}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-1">Proyectos recientes:</h4>
           {user.recentProjects && user.recentProjects.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-700 pl-2">
              {user.recentProjects.map((item, index) => (
                <li key={index}>{item.name} (Accedido: {formatDate(item.lastAccessed)})</li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-500 italic">No hay proyectos recientes.</p>}
        </div>
         <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-1">Sesiones activas:</h4>
           {user.activeSessions && user.activeSessions.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-700 pl-2">
              {user.activeSessions.map((item, index) => (
                <li key={index}>{item.device} (IP: {item.ip}, Última actividad: {item.lastActivity})</li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-500 italic">No hay sesiones activas.</p>}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-1">Historial de cambios (ejemplos):</h4>
           {user.changeHistory && user.changeHistory.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-700 pl-2">
              {user.changeHistory.map((item, index) => (
                <li key={index}>Campo: {item.field}, Anterior: {item.oldValue}, Nuevo: {item.newValue} ({formatDate(item.date)})</li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-500 italic">No hay historial de cambios disponible.</p>}
        </div>
      </div>
    </ProfileSection>
  );


// --- Componente Principal de la Página de Perfil ---
const ProfilePage: React.FC = () => {
  const [currentUserData, setCurrentUserData] = useState<User>(simulatedUser); // Para futuras ediciones
  const [selectedRole, setSelectedRole] = useState<string>(currentUserData.role);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const displayMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleRoleSave = () => {
    // Simular guardado y actualizar estado local si es necesario
    setCurrentUserData(prev => ({ ...prev, role: selectedRole }));
    console.log('Rol guardado:', selectedRole);
    displayMessage('success', 'Rol actualizado correctamente.');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      displayMessage('error', 'Las nuevas contraseñas no coinciden.');
      return;
    }
    if (!currentPassword || !newPassword) {
      displayMessage('error', 'Por favor, complete todos los campos de contraseña.');
      return;
    }
    console.log('Cambiando contraseña...');
    displayMessage('success', 'Contraseña actualizada correctamente.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-4xl"> {/* Aumentado max-w */}
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">Perfil de Usuario y Configuración</h1>

      {message && (
        <div
          className={`p-3 md:p-4 mb-6 rounded-md text-sm ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <BasicInfoSection
        user={currentUserData}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        onSaveRole={handleRoleSave}
      />
      <WorkInfoSection user={currentUserData} />
      <SecurityAccessSection
        user={currentUserData}
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        onCurrentPasswordChange={setCurrentPassword}
        onNewPasswordChange={setNewPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onPasswordSubmit={handlePasswordChange}
      />
      <UserPreferencesSection user={currentUserData} />
      <ContactInfoSection user={currentUserData} />
      <RecentActivitySection user={currentUserData} />

    </div>
  );
};

export default ProfilePage;
