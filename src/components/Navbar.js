import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import axios from "axios";

function Navbar() {
    const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true); // 토큰이 있으면 로그인 상태로 설정
            axios.get('http://localhost:8080/api/auth/is-admin', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => setIsAdmin(response.data)) // 관리자 여부 확인
                .catch(error => {
                    console.error('관리자 여부 확인 오류:', error);
                    setIsAdmin(false);
                });
        } else {
            setIsLoggedIn(false); // 토큰이 없으면 로그아웃 상태로 설정
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // 토큰 삭제
        setIsLoggedIn(false); // 로그아웃 상태로 전환
        setIsAdmin(false); // 관리자 여부 초기화
        navigate('/'); // 홈으로 이동
    };

    return (

        <nav className="navbar">
            <Link to="/" className="logo"><img src="/Pawsomelogo.png" alt="logo" className="logo-img" />Pawsome</Link>
            <div className="menu">
                <Link to="/">HOME</Link>
                <Link to="/cart">CART</Link>
                {isAdmin && <Link to="/admin">ADMIN</Link>} {/* 관리자 전용 */}
                {isLoggedIn && <Link to="/mypage">MYPAGE</Link>}
                {!isLoggedIn ? (
                    <Link to="/login">LOGIN</Link> // 로그인 상태가 아니면 "로그인" 표시
                ) : (
                    <Link to="/" onClick={handleLogout}>LOGOUT</Link> // 로그인 상태면 "로그아웃" 링크 표시
                )}
            </div>
        </nav>

    );
}



export default Navbar;
