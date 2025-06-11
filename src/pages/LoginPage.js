import React, { useState } from 'react';
import './LoginPage.css';
import axios from "axios";

function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', formData);
            alert(`환영합니다, ${response.data.username}!`);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userEmail', response.data.email);
            window.location.href = '/';
        } catch (error) {
            console.error('로그인 오류:', error);
            setErrorMessage('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">로그인</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="이메일"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="login-input"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="login-input"
                    />
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? '로그인 중...' : '로그인'}
                    </button>
                </form>
                <div className="signup-link">
                    <p>계정이 없으신가요?</p>
                    <button onClick={() => window.location.href = '/register'} className="signup-button">회원가입</button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
