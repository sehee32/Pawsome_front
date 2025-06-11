import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle, FaEnvelope, FaUserEdit, FaKey } from 'react-icons/fa';
import './MyPage.css';

const Mypage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [orders, setOrders] = useState([]);
    const [showPwForm, setShowPwForm] = useState(false);
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [pwMsg, setPwMsg] = useState('');

    useEffect(() => {
        const token = localStorage.getItem("token");
        axios.get("http://localhost:8080/api/user/me", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setUserInfo(res.data));
        axios.get("http://localhost:8080/api/user/orders", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setOrders(res.data));
    }, []);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            await axios.put("http://localhost:8080/api/user/password", {
                currentPassword: currentPw,
                newPassword: newPw
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPwMsg("비밀번호가 변경되었습니다.");
            setCurrentPw(""); setNewPw("");
        } catch (err) {
            setPwMsg("비밀번호 변경 실패: " + (err.response?.data || "오류"));
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("정말 회원탈퇴 하시겠습니까?")) return;
        const token = localStorage.getItem("token");
        try {
            await axios.delete("http://localhost:8080/api/user/me", {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("회원탈퇴가 완료되었습니다.");
            localStorage.removeItem("token");
            window.location.href = "/";
        } catch (err) {
            alert("회원탈퇴 실패: " + (err.response?.data || "오류"));
        }
    };

    return (
        <div className="mypage-container">
            <h2>MyPage</h2>
            {userInfo && (
                <div className="profile-card">
                    <div className="profile-avatar">
                        <img
                            src="/Pawsomelogo.png"
                            alt="프로필 로고"
                            className="profile-logo-img"
                        />
                    </div>
                    <div className="profile-info">
                        <div>
                            <FaEnvelope className="profile-icon" />
                            <span className="profile-label">이메일</span>
                            <span className="profile-value">{userInfo.email}</span>
                        </div>
                        <div>
                            <FaUserEdit className="profile-icon" />
                            <span className="profile-label">이름</span>
                            <span className="profile-value">{userInfo.username}</span>
                        </div>
                    </div>
                    <button className="pw-btn" onClick={() => setShowPwForm(true)}>
                        <FaKey style={{ marginRight: 6 }} />
                        비밀번호 변경
                    </button>
                    {showPwForm && (
                        <div className="pw-modal">
                            <div className="pw-modal-content">
                                <h4>비밀번호 변경</h4>
                                <form className="pw-form" onSubmit={handleChangePassword}>
                                    <input type="password" placeholder="현재 비밀번호" value={currentPw}
                                           onChange={e => setCurrentPw(e.target.value)} required />
                                    <input type="password" placeholder="새 비밀번호" value={newPw}
                                           onChange={e => setNewPw(e.target.value)} required />
                                    <button type="submit">변경</button>
                                </form>
                                <div className="pw-msg">{pwMsg}</div>
                                <button className="pw-modal-close" onClick={() => setShowPwForm(false)}>닫기</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className="mypage-section">
                <h3>주문내역</h3>
                {orders.length === 0 ? (
                    <div>주문 내역이 없습니다.</div>
                ) : (
                    <table className="order-table">
                        <thead>
                        <tr>
                            <th>주문번호</th>
                            <th>주문일시</th>
                            <th>상품명</th>
                            <th>수량</th>
                            <th>금액</th>
                            <th>상태</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map(order => (
                            order.items.map((item, idx) => (
                                <tr key={order.id + '-' + idx}>
                                    {idx === 0 && (
                                        <>
                                            <td rowSpan={order.items.length}>{order.id}</td>
                                            <td rowSpan={order.items.length}>{order.orderDate}</td>
                                        </>
                                    )}
                                    <td>{item.productName}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price.toLocaleString()}원</td>
                                    {idx === 0 && (
                                        <td rowSpan={order.items.length}>{order.status}</td>
                                    )}
                                </tr>
                            ))
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
            <button className="delete-btn" onClick={handleDelete}>회원탈퇴</button>
        </div>
    );
};

export default Mypage;
