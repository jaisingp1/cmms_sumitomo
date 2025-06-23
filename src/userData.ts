export interface User {
  // Información Básica
  fullName: string; // Cambiado de 'name' a 'fullName' para mayor claridad
  profileImageUrl: string;
  email: string;
  username: string; // ID único
  role: string; // Rol actual
  registrationDate: string;
  availableRoles: string[];

  // Información Laboral o Interna
  department?: string;
  position?: string;
  directSupervisor?: string;
  officeLocation?: string;
  team?: string;

  // Seguridad y Acceso
  // Contraseña no se almacena aquí directamente, se maneja en el componente
  lastLogin?: {
    date: string;
    ip: string;
    device: string;
  };
  permissions?: string[]; // Lista de permisos o roles asignados
  accountStatus: 'Activo' | 'Inactivo' | 'Pendiente';

  // Preferencias del Usuario
  preferredLanguage: string;
  timeZone: string;
  visualTheme: 'Claro' | 'Oscuro';
  notificationsEnabled: boolean;
  dateFormat: 'DD/MM/AAAA' | 'MM/DD/AAAA' | 'AAAA-MM-DD';
  timeFormat: '12h' | '24h';

  // Información de Contacto
  internalPhone?: string;
  extension?: string;
  chatContact?: string; // Ej: 'jperez@empresa.teams'

  // Actividad Reciente
  recentActions?: Array<{ action: string; date: string; details?: string }>;
  recentProjects?: Array<{ name: string; lastAccessed: string }>;
  activeSessions?: Array<{ device: string; ip: string; lastActivity: string }>;
  changeHistory?: Array<{ field: string; oldValue: string; newValue: string; date: string }>;
}

export const simulatedUser: User = {
  // Información Básica
  fullName: 'Juan Antonio Pérez Gómez',
  profileImageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
  email: 'juan.perez@example.com',
  username: 'jperez123',
  role: 'Ingeniero', // Rol actual por defecto
  registrationDate: '2022-08-15T10:30:00Z',
  availableRoles: ['Ingeniero', 'Supervisor', 'Administrador', 'Invitado', 'Técnico Especializado'],

  // Información Laboral o Interna
  department: 'Tecnología de la Información (TI)',
  position: 'Desarrollador Frontend Senior',
  directSupervisor: 'Ana López',
  officeLocation: 'Edificio Central, Piso 3, Oficina 305',
  team: 'Equipo Alpha',

  // Seguridad y Acceso
  lastLogin: {
    date: new Date(Date.now() - 86400000).toISOString(), // Ayer
    ip: '192.168.1.101',
    device: 'Chrome en Windows 10',
  },
  permissions: ['read:docs', 'write:code', 'admin:users_basic'],
  accountStatus: 'Activo',

  // Preferencias del Usuario
  preferredLanguage: 'Español (México)',
  timeZone: 'America/Mexico_City (GMT-6)',
  visualTheme: 'Claro',
  notificationsEnabled: true,
  dateFormat: 'DD/MM/AAAA',
  timeFormat: '24h',

  // Información de Contacto
  internalPhone: '+52 55 1234 5678',
  extension: '1023',
  chatContact: 'juan.perez@teams.empresa.com',

  // Actividad Reciente
  recentActions: [
    { action: 'Actualizó tarea #123', date: new Date(Date.now() - 3600000).toISOString(), details: 'Marcada como completada' },
    { action: 'Creó nuevo documento "Especificaciones v2"', date: new Date(Date.now() - 7200000).toISOString() },
  ],
  recentProjects: [
    { name: 'Proyecto Phoenix', lastAccessed: new Date(Date.now() - 172800000).toISOString() },
    { name: 'Sistema de Tickets Interno', lastAccessed: new Date(Date.now() - 864000000).toISOString() },
  ],
  activeSessions: [
    { device: 'Laptop Oficina (Chrome)', ip: '203.0.113.45', lastActivity: 'Hace 15 minutos' },
    { device: 'Móvil Personal (Safari)', ip: '198.51.100.12', lastActivity: 'Hace 2 horas' },
  ],
  changeHistory: [
    { field: 'Rol', oldValue: 'Desarrollador Junior', newValue: 'Desarrollador Frontend Senior', date: '2023-01-10T09:00:00Z' },
    { field: 'Departamento', oldValue: 'Desarrollo', newValue: 'Tecnología de la Información (TI)', date: '2022-11-01T14:30:00Z' },
  ],
};
