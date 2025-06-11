import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import DaumPostcode from 'react-daum-postcode'; // 추가
import './OrderPage.css';

const OrderPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems } = location.state || { cartItems: [] };

    const [orderInfo, setOrderInfo] = useState({
        recipient: '',
        postcode: '',
        address: '',
        detailAddress: '',
        phone: ''
    });
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

    // 총 상품금액, 총 수량, 배송비, 총 주문금액 계산
    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity, 0
    );
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const shippingFee = totalPrice > 0 ? 3000 : 0;
    const totalOrderPrice = totalPrice + shippingFee;

    // 주소검색 완료시
    const handleComplete = (data) => {
        setOrderInfo({
            ...orderInfo,
            postcode: data.zonecode,
            address: data.address
        });
        setIsPostcodeOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            const orderData = {
                items: cartItems.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity
                })),
                recipient: orderInfo.recipient,
                address: `${orderInfo.address} ${orderInfo.detailAddress}`,
                postcode: orderInfo.postcode,
                phone: orderInfo.phone
            };

            await axios.post(
                "http://localhost:8080/api/orders",
                orderData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("주문이 완료되었습니다!");
            navigate("/mypage");
        } catch (error) {
            alert("주문 처리 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="order-container">
            <h2>주문 정보 입력</h2>
            <div className="order-wrapper">
                <div className="order-items">
                    {cartItems.map(item => (
                        <div key={item.id} className="order-item">
                            <img
                                src={`http://localhost:8080${item.product.imageUrl}`}
                                alt={item.product.name}
                            />
                            <div>
                                <h3>{item.product.name}</h3>
                                <p>수량: {item.quantity}</p>
                                <p>가격: {(item.product.price * item.quantity).toLocaleString()}원</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="order-form-section">
                    <div className="order-summary-card">
                        <div className="order-summary-row">
                            <span>총 수량</span>
                            <span>{totalQuantity}개</span>
                        </div>
                        <div className="order-summary-row">
                            <span>총 상품 금액</span>
                            <span>{totalPrice.toLocaleString()} 원</span>
                        </div>
                        <div className="order-summary-row">
                            <span>배송비</span>
                            <span>{shippingFee.toLocaleString()} 원</span>
                        </div>
                        <div className="order-summary-row total">
                            <span>총 주문금액</span>
                            <span>{totalOrderPrice.toLocaleString()} 원</span>
                        </div>
                    </div>
                    <form className="order-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>받는 사람</label>
                            <input
                                type="text"
                                required
                                value={orderInfo.recipient}
                                onChange={e => setOrderInfo({...orderInfo, recipient: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>배송 주소</label>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <input
                                    type="text"
                                    placeholder="우편번호"
                                    value={orderInfo.postcode}
                                    readOnly
                                    style={{ flex: 1 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsPostcodeOpen(true)}
                                    className="address-search-btn"
                                >
                                    주소검색
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="기본주소"
                                value={orderInfo.address}
                                readOnly
                                style={{ marginBottom: '8px' }}
                            />
                            <input
                                type="text"
                                placeholder="상세주소"
                                value={orderInfo.detailAddress}
                                onChange={e => setOrderInfo({...orderInfo, detailAddress: e.target.value})}
                            />
                            {isPostcodeOpen && (
                                <div className="postcode-modal">
                                    <DaumPostcode
                                        onComplete={handleComplete}
                                        autoClose
                                        style={{ width: 450, height: 600 }}
                                    />
                                    <button type="button" className="postcode-close" onClick={() => setIsPostcodeOpen(false)}>
                                        닫기
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label>연락처</label>
                            <input
                                type="tel"
                                required
                                pattern="[0-9]{3}[0-9]{4}[0-9]{4}"
                                placeholder="- 제외하고 입력해주세요"
                                value={orderInfo.phone}
                                onChange={e => setOrderInfo({...orderInfo, phone: e.target.value})}
                            />
                        </div>
                        <button type="submit" className="order-button">결제하기</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
