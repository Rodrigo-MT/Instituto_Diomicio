import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Banner from './components/Banner/Banner';
import About from './components/About/About';
import Eventos from './components/Eventos/Eventos';
import Parceiros from './components/Parceiros/Parceiros';
import ApoieNos from './components/ApoieNos/ApoieNos';
import Noticias from './components/Noticias/Noticias';
import Footer from './components/Footer/Footer';
import Maps from './components/Maps/Maps';
import LoginPage from './components/Login/LoginPage';
import DashboardAdmin from './components/Login/Dashboard/layout/DashboardAdmin';
import EventosAdmin from './components/Login/Dashboard/pages/EventosAdmin';
import ProdutosAdmin from './components/Login/Dashboard/pages/ProdutosAdmin';
import NewsletterAdmin from './components/Login/Dashboard/pages/NewsletterAdmin';
import DestaquesAdmin from './components/Login/Dashboard/pages/DestaquesAdmin';
import ParceirosAdmin from './components/Login/Dashboard/pages/ParceirosAdmin';
import ProductItem from './components/ApoieNos/Clube/ProductItem';

// Novo componente de proteção de rota simplificado
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas protegidas */}
        <Route path="/admin/" element={
          <RequireAuth>
            <DashboardAdmin />
          </RequireAuth>
        }>
          <Route path="eventos" element={<EventosAdmin />} />
          <Route path="produtos" element={<ProdutosAdmin />} />
          <Route path="newsletter" element={<NewsletterAdmin />} />
          <Route path="destaques" element={<DestaquesAdmin />} />
          <Route path="parceiros" element={<ParceirosAdmin />} />
        </Route>

        {/* Rotas com layout padrão */}
        <Route path="*" element={
          <div className="App" style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}>
            <Header />
            <main style={{
              flex: 1,
              padding: '2rem 0',
              paddingBottom: '4rem'
            }}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <Banner />
                      <About />
                      <Noticias />
                      <div style={{ marginBottom: '20vh' }}>
                        <Maps />
                      </div>
                    </>
                  }
                />
                <Route path="/eventos" element={<Eventos />} />
                <Route path="/parceiros" element={<Parceiros />} />
                <Route path="/apoie-nos" element={<ApoieNos />} />
                <Route path="/apoie-nos/clube/:id" element={<ProductItem />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;