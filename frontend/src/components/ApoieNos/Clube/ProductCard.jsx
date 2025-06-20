// src/components/ApoieNos/Clube/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProductItem.module.css';

const ProductCard = ({ produto }) => {
  if (!produto) return null;
  return (
<div className={styles.productCard}>
  <div className={styles.productImageContainer}>
    <img src={produto.imagem} alt={produto.nome} className={styles.productImage} />
  </div>
  <div className={styles.productInfo}>
    <Link to={`/apoie-nos/clube/${produto.id}`} className={styles.productLink}>
      <h3 className={styles.productTitle}>{produto.nome}</h3>
    </Link>
    <p className={styles.productDescription}>
      {produto.descricaoCurta || produto.descricao || 'Sem descrição'}
    </p>
    <p className={styles.productPrice}>
      {produto.preco
        ? produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        : 'Preço não informado'}
    </p>
  </div>
</div>
  );
};

export default ProductCard;
