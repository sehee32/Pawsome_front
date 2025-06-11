import React, { useState } from 'react';
import './RegisterPage.css';
import axios from 'axios';

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
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
            await axios.post('http://localhost:8080/api/auth/register', formData, {
                headers: { 'Content-Type': 'application/json' }
            });
            alert('회원가입 성공!');
            setFormData({ username: '', email: '', password: '' });
            window.location.href = '/login';
        } catch (error) {
            console.error('회원가입 오류:', error);
            setErrorMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h1 className="register-title">회원가입</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="이름"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="register-input"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="이메일"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="register-input"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="register-input"
                    />
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <button type="submit" className="register-button" disabled={isLoading}>
                        {isLoading ? '회원가입 중...' : '회원가입'}
                    </button>
                </form>
                <div className="login-link">
                    <p>이미 계정이 있으신가요?</p>
                    <button onClick={() => window.location.href = '/login'} className="login-button">로그인</button>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
