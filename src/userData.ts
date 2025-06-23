export interface User {
  name: string;
  role: string;
  profileImageUrl: string;
  availableRoles: string[];
}

export const simulatedUser: User = {
  name: 'Juan Pérez',
  role: 'Ingeniero', // Rol por defecto
  profileImageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
  availableRoles: ['Ingeniero', 'Supervisor', 'Administrador', 'Invitado'],
};

// Podríamos añadir funciones para "actualizar" estos datos en la simulación si fuera necesario,
// pero para este mockup, mantenerlos estáticos y solo leerlos es suficiente.
// Las actualizaciones se simulan a nivel de componente con mensajes.
