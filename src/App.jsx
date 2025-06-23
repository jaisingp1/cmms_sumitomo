import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import OTDetailsPage from './pages/OTDetailsPage.tsx'; // Import the new page
import { mockOrdenesTrabajo } from './data/dropdownData'; // To fetch OT data
import './App.css'; // Mantener si hay estilos globales aquí

// Wrapper component to fetch OT data and pass it to OTDetailsPage
const OTDetailsWrapper = () => {
  const { otId } = useParams(); // Removed TypeScript generic here
  const ordenTrabajo = mockOrdenesTrabajo.find(ot => ot.id === otId);

  if (!ordenTrabajo) {
    return (
      <div className="p-4">
        <h2 className="text-xl text-red-600">Error: Orden de Trabajo no encontrada.</h2>
        <p>No se pudo encontrar una OT con el ID: {otId}</p>
      </div>
    );
  }
  return <OTDetailsPage ordenTrabajo={ordenTrabajo} />;
};

function App() {
  return (
    <Router>
      <Header />
      <main className="pt-4"> {/* Añadimos un padding top para que el contenido no quede debajo del header fijo si lo fuera */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/ot/:otId" element={<OTDetailsWrapper />} /> {/* New route for OT Details */}
          {/* Aquí se podrían añadir más rutas en el futuro */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
