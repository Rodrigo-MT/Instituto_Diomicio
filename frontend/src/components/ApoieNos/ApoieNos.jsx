import React, { useRef, useEffect, useState } from 'react';
import styles from './ApoieNos.module.css';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { QRCodeSVG } from 'qrcode.react';
import ProductCard from '../ApoieNos/Clube/ProductCard';
import api from '../../api';

const ApoieNos = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const containerRef = useRef(null);
  const triangleRef = useRef(null);
  const [produtoSelecionado] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animação GSAP
  useGSAP(() => {
    gsap.from(triangleRef.current, {
      duration: 1.5,
      clipPath: 'polygon(0 0, 0% 0, 0 0%)',
      ease: "power3.out"
    });
  }, { scope: containerRef });

  // Buscar produtos da API
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get('/products');
        const data = response.data;
  
        const produtosComImagens = data.map(produto => ({
          ...produto,
          imagem: produto.imagePath
            ? produto.imagePath.startsWith('http')
              ? produto.imagePath
              : `${api.defaults.baseURL}${produto.imagePath}`
            : 'https://via.placeholder.com/300x200?text=Sem+Imagem'
        }));
  
        setProdutos(produtosComImagens);
      } catch (err) {
        setError(err.message || 'Erro ao carregar produtos');
        console.error('Erro ao carregar produtos:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProdutos();
  }, []);

  // Bloquear scroll quando modal aberto
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [modalOpen]);

  return (
    <main className={styles.pageContainer} ref={containerRef}>
      <div className={styles.greenTriangle} ref={triangleRef}></div>

      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>Apoie-nos</h1>

        <div className={styles.mainContentBox}>
          {/* Seção de Doações */}
          <section className={styles.donationSection}>
            <h2 className={styles.sectionTitle}>Contribua com o Instituto de Educação Especial Diomício Freitas!</h2>

            <div className={styles.donationInfo}>
              <div className={styles.bankInfo}>
                <h3>Doações através de depósito bancário:</h3>
                <p>Banco Caixa Econômica</p>
                <p>Agência 1662</p>
                <p>C/C 2223-0</p>
              </div>

              <div className={styles.pixInfo}>
                <h3>PIX:</h3>
                <div className={styles.qrCodeContainer}>
                  <QRCodeSVG
                    value="75.567.081/0001-05"
                    size={160}
                    level="H"
                    marginSize={4}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
                <p className={styles.pixKey}>75.567.081/0001-05</p>
              </div>
            </div>
          </section>

          {/* Seção de Formas de Apoio */}
          <section className={styles.supportSection}>
            <h2 className={styles.sectionTitle}>Apoie-nos de diferentes formas!</h2>
            <p>
              Você pode ajudar o instituto não apenas através de doações financeiras, mas também participando
              dos nossos eventos beneficentes como almoços, pedágios solidários, e nossas campanhas de
              arrecadação de tampinhas, lacres e embalagens vazias de remédios. Cada pequena ação faz uma
              grande diferença!
            </p>
          </section>

          {/* Seção de Ações Realizadas */}
          <section className={styles.actionsSection}>
            <h2 className={styles.sectionTitle}>Ações Realizadas</h2>
            <p>
              A reciclagem é fundamental para preservar nosso meio ambiente e promover um desenvolvimento
              sustentável. Conscientes disso, lançamos o projeto "Recicle Correto", uma iniciativa pioneira
              na cidade para o descarte adequado de blisters de medicamentos.
            </p>
            <p>
              Em parceria com farmácias locais, instalamos coletores especiais onde a comunidade pode
              depositar esses materiais, que são então enviados para reciclagem em Curitiba. Além de
              proteger o meio ambiente, essa ação gera recursos para nosso instituto.
            </p>
            <p>
              Também mantemos projetos paralelos de reciclagem de tampinhas, lacres e latinhas de alumínio,
              ampliando nosso impacto positivo na comunidade e no planeta.
            </p>
          </section>

          {/* Seção Clube das Mães */}
          <section className={styles.clubSection}>
            <h2 className={styles.sectionTitle}>Clube das Mães</h2>

            {loading ? (
              <p>Carregando produtos...</p>
            ) : error ? (
              <p>Erro ao carregar produtos: {error}</p>
            ) : (
              <div className={styles.productsGrid}>
                {produtos.length > 0 ? (
                  produtos.map(produto => (
                    <ProductCard
                      key={produto.id}
                      produto={produto}
                    />
                  ))
                ) : (
                  <p>Nenhum produto disponível no momento.</p>
                )}
              </div>
            )}

            <div className={styles.clubHistory}>
              <h3>Histórico Clube de Mães</h3>
              <p>
                O Clube de Mães foi criado para fortalecer os laços entre famílias e escola, especialmente
                no desenvolvimento da autonomia dos alunos com necessidades especiais.
              </p>
              <p>
                Com o objetivo de preparar nossos alunos para o mercado de trabalho, identificamos a
                necessidade de projetos que promovessem sua independência. Apesar dos desafios e da
                extinção do apoio da LBA, o grupo perseverou, adaptando-se e mantendo encontros semanais
                onde discutimos o desenvolvimento dos filhos e trabalhamos em projetos manuais.
              </p>
              <p>
                Hoje, muitos de nossos alunos alcançaram sucesso profissional, e o Clube continua sendo
                um espaço importante de apoio mútuo e geração de recursos para o instituto.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && produtoSelecionado && (
        <div
          className={styles.modalOverlay}
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className={styles.modalContent}
            onClick={e => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={() => setModalOpen(false)}
              aria-label="Fechar modal"
            >
              ×
            </button>
            <h2 id="modal-title">{produtoSelecionado.nome}</h2>
            <img
              src={produtoSelecionado.imagem}
              alt={produtoSelecionado.nome}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=Imagem+Não+Disponível';
              }}
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                objectFit: 'contain',
                marginBottom: '1rem'
              }}
            />
            <p>{produtoSelecionado.descricao || 'Sem descrição disponível.'}</p>
            <p className={styles.productPrice}>
              {produtoSelecionado.preco?.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }) || 'Preço não informado'}
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default ApoieNos;