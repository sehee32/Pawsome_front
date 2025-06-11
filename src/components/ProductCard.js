import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product }) {
    return (
        <div className="product-card">
            <Link to={`/products/${product.id}`}><img src={`http://localhost:8080${product.imageUrl}`} alt={product.name} /></Link>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">{product.price.toLocaleString()}원</p>
        </div>
    );
}

export default ProductCard;
