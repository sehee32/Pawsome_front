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
    const [isEmailAvailable, setIsEmailAvailable] = useState(false);
    const [emailCheckMessage, setEmailCheckMessage] = useState('');

    // 이메일 중복 확인
    const handleEmailCheck = async () => {
        if (!formData.email) {
            setEmailCheckMessage('이메일을 입력하세요.');
            return;
        }
        try {
            const res = await axios.get(`http://localhost:8080/api/auth/check-email/${formData.email}`);
            if (res.data) {
                setIsEmailAvailable(false);
                setEmailCheckMessage('이미 사용 중인 이메일입니다.');
            } else {
                setIsEmailAvailable(true);
                setEmailCheckMessage('사용 가능한 이메일입니다.');
            }
        } catch (e) {
            setEmailCheckMessage('이메일 확인 중 오류가 발생했습니다.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'email') {
            setIsEmailAvailable(false);
            setEmailCheckMessage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!isEmailAvailable) {
            setErrorMessage('이메일 중복 확인을 해주세요.');
            return;
        }
        setIsLoading(true);
        try {
            await axios.post('http://localhost:8080/api/auth/register', formData);
            alert('회원가입 성공!');
            window.location.href = '/login';
        } catch (error) {
            setErrorMessage(
                error.response?.data?.includes("이미 사용 중")
                    ? '이미 가입된 이메일입니다.'
                    : '회원가입에 실패했습니다.'
            );
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

                    <div className="email-check-wrapper">
                        <input
                            type="email"
                            name="email"
                            placeholder="이메일"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="register-input"
                            style={{ marginBottom: 0 }}
                        />
                        <button
                            type="button"
                            className="email-check-button"
                            onClick={handleEmailCheck}
                        >
                            중복확인
                        </button>
                    </div>
                    {/* 이메일 중복확인 메시지 */}
                    {emailCheckMessage && (
                        <div className={`email-check-message ${isEmailAvailable ? 'success' : 'error'}`}>
                            {emailCheckMessage}
                        </div>
                    )}
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
