import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./Cart.css";
import {useNavigate} from "react-router-dom";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();
    const handleOrder = () => {
        if (selectedItems.length === 0) {
            alert("주문할 상품을 선택해주세요.");
            return;
        }
        const selectedCartItems = cartItems.filter(item =>
            selectedItems.includes(item.product.id)
        );
        navigate("/order", {state: {cartItems: selectedCartItems}});
    };

    const handleCheckboxChange = (id) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        const fetchCart = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("로그인이 필요합니다.");
                window.location.href = "/login";
                return;
            }

            try {
                const response = await axios.get("http://localhost:8080/api/cart", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCartItems(response.data);
                setSelectedItems(response.data.map(item => item.product.id));
            } catch (error) {
                alert("장바구니를 불러오지 못했습니다.");
            }
        };

        fetchCart();
    }, []);

    const increaseQuantity = async (productId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(
                `http://localhost:8080/api/cart/${productId}`,
                { quantity: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCartItems(prev =>
                prev.map(item =>
                    item.product.id === productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } catch (error) {
            alert("수량 변경에 실패했습니다.");
        }
    };

    const decreaseQuantity = async (productId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(
                `http://localhost:8080/api/cart/${productId}`,
                { quantity: -1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCartItems(prev =>
                prev
                    .map(item =>
                        item.product.id === productId
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    )
                    .filter(item => item.quantity > 0)
            );
        } catch (error) {
            alert("수량 변경에 실패했습니다.");
        }
    };

    const removeFromCart = async (productId) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`http://localhost:8080/api/cart/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(prev => prev.filter(item => item.product.id !== productId));
            setSelectedItems(prev => prev.filter(id => id !== productId));
        } catch (error) {
            alert("삭제에 실패했습니다.");
        }
    };

    const removeSelectedItems = async () => {
        const token = localStorage.getItem("token");
        try {
            await Promise.all(
                selectedItems.map(productId =>
                    axios.delete(`http://localhost:8080/api/cart/${productId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                )
            );
            setCartItems(prev =>
                prev.filter(item => !selectedItems.includes(item.product.id))
            );
            setSelectedItems([]);
        } catch (error) {
            alert("선택 항목 삭제에 실패했습니다.");
        }
    };

    const clearCart = async () => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete("http://localhost:8080/api/cart", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems([]);
            setSelectedItems([]);
        } catch (error) {
            alert("전체 삭제에 실패했습니다.");
        }
    };

    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.product.id));
    const totalQuantity = selectedCartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = selectedCartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const shippingFee = totalPrice > 0 ? 3000 : 0;
    const totalOrderPrice = totalPrice + shippingFee;

    return (
        <div className="cart-container">
            <h2 className="cart-title">Cart</h2>
            <div className="cart-wrapper">
                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <p>장바구니가 비어 있습니다.</p>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.product.id)}
                                    onChange={() => handleCheckboxChange(item.product.id)}
                                />
                                <div className="product-info">
                                    <img
                                        src={`http://localhost:8080${item.product.imageUrl}`}
                                        alt={item.product.name}
                                    />
                                    <div className="product-detail">
                                        <p className="product-id">{item.product.id}</p>
                                        <div className="product-name">{item.product.name}</div>
                                        <div className="product-category">{item.product.description}</div>
                                        <div className="product-price">{item.product.price.toLocaleString()} 원</div>
                                    </div>
                                </div>
                                <div className="cart-item-right">
                                    <button
                                        className="delete-button"
                                        onClick={() => removeFromCart(item.product.id)}
                                    >
                                        ×
                                    </button>
                                    <div className="quantity-control">
                                        <button onClick={() => decreaseQuantity(item.product.id)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => increaseQuantity(item.product.id)}>+</button>
                                    </div>
                                    <div className="product-subinfo">
                                        상품금액 {item.product.price.toLocaleString()}원 / 수량 {item.quantity}개
                                    </div>
                                    <div className="total-price">
                                        총 { (item.product.price * item.quantity).toLocaleString() } 원
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    {cartItems.length > 0 && (
                        <div className="button-group">
                            <button onClick={removeSelectedItems} className="delete-all-button">선택 삭제</button>
                            <button onClick={clearCart} className="delete-all-button">전체삭제</button>
                        </div>
                    )}
                </div>
                <div className="order-summary">
                    <div className="order-detail">
                        <span>총 수량</span>
                        <span>{totalQuantity}개</span>
                    </div>
                    <div className="order-detail">
                        <span>총 상품 금액</span>
                        <span>{totalPrice.toLocaleString()} 원</span>
                    </div>
                    <div className="order-detail">
                        <span>배송비</span>
                        <span>{shippingFee.toLocaleString()} 원</span>
                    </div>
                    <div className="order-detail total">
                        <span>총 주문금액</span>
                        <span>{totalOrderPrice.toLocaleString()} 원</span>
                    </div>
                    <div className="button-group">
                        <button className="order-button" onClick={handleOrder}>주문하기</button>
                        <button className="delete-all-button" onClick={clearCart}>전체삭제</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
