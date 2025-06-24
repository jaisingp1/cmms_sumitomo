import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import OTDetailsPage from './pages/OTDetailsPage.tsx'; // Import the new page
import LoginPage from './pages/LoginPage'; // Import LoginPage
import ForgotPasswordPage from './pages/ForgotPasswordPage'; // Import ForgotPasswordPage
import { mockOrdenesTrabajo } from './data/examples'; // Corrected import: To fetch OT data
import './App.css'; // Mantener si hay estilos globales aquí

// Wrapper component to fetch OT data and pass it to OTDetailsPage
const OTDetailsWrapper = () => {
  const { otId } = useParams();

  if (otId === 'new') {
    // Pasamos una prop 'isNew' a OTDetailsPage para indicar la creación de una nueva OT
    return <OTDetailsPage isNew={true} />;
  }

  const ordenTrabajo = mockOrdenesTrabajo.find(ot => ot.id === otId);

  if (!ordenTrabajo) {
    return (
      <div className="p-4">
        <h2 className="text-xl text-red-600">Error: Orden de Trabajo no encontrada.</h2>
        <p>No se pudo encontrar una OT con el ID: {otId}</p>
      </div>
    );
  }
  // Pasamos la OT encontrada a OTDetailsPage
  return <OTDetailsPage ordenTrabajo={ordenTrabajo} />;
};

// Componente que contiene la lógica de las rutas y el layout
const AppContent = () => {
  return (
    <>
      <Header />
      <main className="pt-4"> {/* Añadimos un padding top para que el contenido no quede debajo del header fijo si lo fuera */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/ot/:otId" element={<OTDetailsWrapper />} /> {/* New route for OT Details */}
          {/* Aquí se podrían añadir más rutas en el futuro */}
        </Routes>
      </main>
    </>
  );
};

// Componente principal de la aplicación que decide si mostrar Header o no.
function App() {
  // Usamos useLocation para determinar la ruta actual
  // Nota: Para que useLocation funcione aquí, App debe estar dentro de <Router>
  // o debemos pasar la location como prop si App no está renderizado por Router directamente.
  // La estructura actual tiene App renderizando Router, por lo que AppContent es el lugar
  // correcto para usar useLocation, o necesitamos un componente intermedio.

  // Solución: Envolver AppContent con Router en App, y luego App puede tener otro Router
  // o usar un contexto para la location.
  // La forma más simple es modificar la lógica de renderizado del Header DENTRO de AppContent
  // o crear un componente Layout que decida si mostrar Header.

  // Para este caso, vamos a modificar la estructura para que App decida el layout.
  // Las rutas de login y forgot-password no tendrán Header.
  return (
    <Router>
      <Routes>
        {/* Rutas que no muestran el Header */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Rutas que sí muestran el Header (usando un layout) */}
        <Route path="/*" element={<DefaultLayout />} />
      </Routes>
    </Router>
  );
}

// Layout por defecto que incluye el Header y las rutas principales
const DefaultLayout = () => {
  return (
    <>
      <Header />
      <main className="pt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/ot/:otId" element={<OTDetailsWrapper />} />
          {/* Otras rutas que usan el layout por defecto */}
        </Routes>
      </main>
    </>
  );
}

// Export AppContent for testing purposes if needed, though App.test.jsx can also be refactored
// to test App and let its internal BrowserRouter work, if we adjust how initial entries are set.
// For now, we'll adjust App.test.jsx to use AppContent.
export { AppContent };
export default App;
