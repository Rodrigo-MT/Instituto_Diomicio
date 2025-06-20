import React from 'react';
import Banner from '../../components/Banner/Banner';
import About from '../../components/About/About';
import Noticias from '../../components/Noticias/Noticias';
import Maps from '../Maps/Maps';

const Home = () => {
  return (
    <main>
      <Banner />
      <About />
      <div style={{ marginBottom: '100vh' }}> {/* Espaço extra antes do rodapé */}
        <Noticias />
        <Maps />
      </div>
    </main>
  );
};

export default Home;