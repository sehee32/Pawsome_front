import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ProductDetailPage.css';

function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    // 상품 상세 정보 가져오기
    useEffect(() => {
        axios.get(`http://localhost:8080/api/products/${id}`)
            .then(response => setProduct(response.data))
            .catch(error => console.error('Error fetching product:', error));
    }, [id]);

    if (!product) return <div className="loading">Loading...</div>;

    // ✅ 서버 API를 호출해 장바구니에 상품 추가
    const addToCart = async () => {
        const token = localStorage.getItem("token"); // JWT 토큰
        if (!token) {
            alert("로그인이 필요합니다.");
            window.location.href = "/login";
            return;
        }

        try {
            await axios.post(
                `http://localhost:8080/api/cart/${product.id}`,
                { quantity: 1 },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    // withCredentials: true
                }
            );
            alert("장바구니에 담았습니다!");
        } catch (error) {
            console.error("실패:", error.response?.data);
            alert("오류 발생: " + (error.response?.data || error.message));
        }
    };

    return (
        <div className="product-detail-container">
            <div className="product-image-section">
                <img
                    src={`http://localhost:8080${product.imageUrl}`}
                    alt={product.name}
                    className="product-image"
                />
            </div>
            <div className="product-info-section">
                <h1 className="product-name">{product.name}</h1>
                <p className="product-description">{product.description}</p>
                <p className="product-price">가격: {product.price.toLocaleString()}원</p>
                <button
                    className="add-to-cart-button"
                    onClick={addToCart}
                >
                    장바구니 담기
                </button>
            </div>
        </div>
    );
}

export default ProductDetailPage;
