import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import './App.css'; // Mantener si hay estilos globales aquí

function App() {
  return (
    <Router>
      <Header />
      <main className="pt-4"> {/* Añadimos un padding top para que el contenido no quede debajo del header fijo si lo fuera */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Aquí se podrían añadir más rutas en el futuro */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
