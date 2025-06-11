import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import axios from 'axios';

function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
    });
    const [file, setFile] = useState(null); // 파일 상태 추가

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        console.log("프로덕트:", products);
    }, [products]); // products가 변경될 때만 실행됨

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/products');
            console.log(response.data); // 응답 데이터 구조 확인
            setProducts(response.data);
        } catch (error) {
            console.error('상품 목록 가져오기 오류:', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // 선택한 파일 저장
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newProduct.name);
            formData.append('description', newProduct.description);
            formData.append('price', newProduct.price);
            formData.append('file', file); // 파일 추가

            await axios.post('http://localhost:8080/api/products/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('상품 추가 성공!');
            setNewProduct({ name: '', description: '', price: '' });
            setFile(null); // 파일 초기화
            fetchProducts();
        } catch (error) {
            console.error('상품 추가 오류:', error);
            alert('상품 추가 실패!');
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/products/${id}`);
            alert('상품 삭제 성공!');
            fetchProducts();
        } catch (error) {
            console.error('상품 삭제 오류:', error);
            alert('상품 삭제 실패!');
        }
    };

    return (
        <div className="admin-dashboard-container">
            <h2 className="dashboard-title">Admin</h2>

            <form className="product-form" onSubmit={handleAddProduct}>
                <h2>새 상품 추가</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="상품 이름"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                />
                <textarea
                    name="description"
                    placeholder="상품 설명"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="가격"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                />
                <input
                    type="file"
                    name="file"
                    onChange={handleFileChange} // 파일 선택 핸들러
                    accept="image/*"
                    required
                />
                <button type="submit" className="add-product-button">추가하기</button>
            </form>

            <div className="product-list">
                {products.length > 0 && products.map((product) => (
                    <div key={product.id} className="product-item">
                        {/* 이미지 크기 스타일 적용 */}
                        <img
                            src={`http://localhost:8080${product.imageUrl}`}
                            alt={product.name}
                            className="product-image"
                        />
                        <div className="product-details">
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p className="price"><strong>{product.price.toLocaleString()}원</strong></p>
                        </div>
                        <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="delete-button"
                        >
                            삭제
                        </button>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default AdminDashboard;
