import React from 'react';
import styles from './DashboardAdmin.module.css';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { logout } from '../../../../services/auth';
import EventosAdmin from '../pages/EventosAdmin/EventosAdmin';
import ProdutosAdmin from '../pages/ProdutosAdmin/ProdutosAdmin';
import NewsletterAdmin from '../pages/NewsletterAdmin/NewsletterAdmin';
import DestaquesAdmin from '../pages/DestaquesAdmin/DestaquesAdmin';
import ParceirosAdmin from '../pages/ParceirosAdmin/ParceirosAdmin';


const DashboardAdmin = () => {
  const navigate = useNavigate();

  const modules = [
    { title: "Início", icon: "🏠", path: "/admin" },
    { title: "Gestão de Eventos", icon: "📅", path: "/admin/eventos" },
    { title: "Clube das Mães", icon: "🧶", path: "/admin/produtos" },
    { title: "Newsletter", icon: "✉️", path: "/admin/newsletter" },
    { title: "Destaques do Site", icon: "⭐", path: "/admin/destaques" },
    { title: "Parceiros", icon: "🤝", path: "/admin/parceiros" }
  ];

  const handleLogout = () => {
    logout(); // Remove o token e redireciona
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        {modules.map((module, index) => (
          <button 
            key={index}
            className={styles.navButton}
            onClick={() => navigate(module.path)}
          >
            <span className={styles.navIcon}>{module.icon}</span>
            <span className={styles.navText}>{module.title}</span>
          </button>
        ))}

        <button 
          className={`${styles.navButton} ${styles.logoutButton}`}
          onClick={handleLogout}
        >
          <span className={styles.navIcon}>
            <FiLogOut />
          </span>
          <span className={styles.navText}>Sair</span>
        </button>
      </div>

      <div className={styles.mainContent}>
        <h1 className={styles.title}>Painel Administrativo</h1>
        <p className={styles.welcomeText}>Bem-vindo ao sistema de gestão</p>

        <div className={styles.contentWrapper}>
          <Routes>
            <Route path="eventos" element={<EventosAdmin />} />
            <Route path="produtos" element={<ProdutosAdmin />} />
            <Route path="newsletter" element={<NewsletterAdmin />} />
            <Route path="destaques" element={<DestaquesAdmin />} />
            <Route path="parceiros" element={<ParceirosAdmin />} /> {/* ✅ Nova rota */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
