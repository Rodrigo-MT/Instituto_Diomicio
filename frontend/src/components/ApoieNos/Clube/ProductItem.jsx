import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './ProductItem.module.css';
import { FaPhone, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import api from '../../../api';
const INSTITUTO_MAP_URL =
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d56003.448294531336!2d-49.4202707!3d-28.683199!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x952182627b77a52f%3A0xbcf265032e5fe46b!2sInstituto%20de%20Educa%C3%A7%C3%A3o%20Especial%20Diom%C3%ADcio%20Freitas!5e0!3m2!1spt-BR!2sbr!4v1745521043366!5m2!1spt-BR!2sbr";

const ProductItem = () => {
    const { id } = useParams();
    const [produto, setProduto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get(`/products/${id}`)
          .then(response => {
            setProduto(response.data);
            setLoading(false);
          })
          .catch(err => {
            setError('Produto não encontrado');
            setLoading(false);
          });
      }, [id]);

    if (loading) return <p>Carregando produto...</p>;
    if (error) return <p>Erro: {error}</p>;
    if (!produto) return <p>Produto não encontrado</p>;

    // Ajusta o caminho da imagem, caso necessário
    const imageSrc = produto.imagem || `${api.defaults.baseURL}${produto.imagePath}`;
    return (
        <div className={styles.productPage}>
            <div className={styles.productContainer}>
                {/* Galeria */}
                <div className={styles.productGallery}>
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt={produto.nome}
                            className={styles.productImage}
                            onError={(e) => {
                                console.error('Erro ao carregar imagem:', e.target.src);
                                e.target.style.display = 'none';
                            }}
                        />
                    ) : (
                        <p>Imagem não disponível</p>
                    )}
                </div>

                {/* Detalhes do Produto */}
                <div className={styles.productDetails}>
                    <h1 className={styles.productTitle}>{produto.nome}</h1>
                    {produto.categoria && (
                        <p className={styles.productCategory}>{produto.categoria}</p>
                    )}

                    <div className={styles.productDescription}>
                        <p>
                            {produto.descricaoLonga ||
                                produto.descricaoCurta ||
                                produto.descricao ||
                                'Sem descrição disponível.'}
                        </p>
                    </div>

                    <p className={styles.productPrice}>
                        {produto.preco
                            ? produto.preco.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            })
                            : 'Preço não informado'}
                    </p>

                    <div className={styles.availabilityNote}>
                        <p>
                            ⚠️ A compra é realizada exclusivamente presencialmente no Instituto
                            Diomício Freitas.
                        </p>
                    </div>

                    <button
                        className={styles.buyButton}
                        onClick={() =>
                            window.open(
                                "https://www.google.com/maps?ll=-28.68328,-49.379071&z=12&t=m&hl=pt-BR&gl=BR&mapclient=embed&cid=13615055687831774315",
                                '_blank'
                            )
                        }
                    >
                        Comprar Presencialmente
                    </button>

                    <div className={styles.contactInfo}>
                        <h3>Informações para contato:</h3>
                        <p>
                            <FaPhone /> (48) 3433-8235
                        </p>
                        <p>
                            <FaPhone /> (48) 99838-4125
                        </p>
                        <p>
                            <FaMapMarkerAlt /> Rua Lúcia Milioli, 211 - Santa Bárbara CEP: 88802-020
                        </p>
                    </div>

                    <div className={styles.mapContainer}>
                        <iframe
                            title="Localização do Instituto"
                            src={INSTITUTO_MAP_URL}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>

                    <Link to="/apoie-nos" className={styles.backLink}>
                        <FaArrowLeft /> Voltar para Apoie-nos
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductItem;
