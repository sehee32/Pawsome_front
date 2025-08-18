#  Pawsome Front

이 프로젝트는 React를 사용하여 반려동물 용품 쇼핑몰 웹페이지를 구현했습니다.

<br><br><br>

## 🛠 기술 스택

- Frontend : React, Axios
- Backend : Spring Boot, MySQL, JPA, JWT

## 🚀 프로젝트 설정 및 실행

### 설치

```bash
npm install
```

### 실행

```bash
npm start
```

## 🌟 주요 기능

### 회원가입

![회원가입](https://github.com/user-attachments/assets/642cafb5-36de-4c9b-a8b3-2149905386c6)
![회원가입시유저데이터추가](https://github.com/user-attachments/assets/a88189de-e15d-4ff2-a42c-39a8aab7b3b0)
![회원가입시유저테이블에데이터추가](https://github.com/user-attachments/assets/ab3c7c21-dd6e-4a85-a664-d3155242f0ed)
![회원가입중복이메일불가](https://github.com/user-attachments/assets/a1d86c17-18aa-4ede-ba38-a59962eef07e)

<details><summary>주요 코드
</summary>

```
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


// 회원가입 요청
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
```
</details>


### 로그인 (LoginPage.vue)
![로그인성공](https://github.com/user-attachments/assets/0bf34ce5-461b-4303-b5b6-4c2fcf249e74)
![로그인실패](https://github.com/user-attachments/assets/aa5425e0-b25d-4db6-abfd-a5b88a9b9b93)

<details><summary>주요 코드
</summary>

```
// 로그인 요청
const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage('');
  setIsLoading(true);
  try {
    const response = await axios.post('http://localhost:8080/api/auth/login', formData);

    // 로그인 성공 처리
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
```
</details>

### 마이페이지
![마이페이지비밀번호변경](https://github.com/user-attachments/assets/9f097d71-9e1f-45e1-b3ea-c2fca3bc382c)
![마이페이지비밀번호변경데이터](https://github.com/user-attachments/assets/128d3674-682d-4dfa-b8f9-6a2c45d9ce80)
![비밀번호변경실패](https://github.com/user-attachments/assets/2ce97cc8-99e9-4a87-9457-4953d088058c)
![회원탈퇴](https://github.com/user-attachments/assets/4506f2e5-596c-4dde-8703-62fbac11f750)
![회원탈퇴확인](https://github.com/user-attachments/assets/6e7320bd-754e-4a91-a9a2-e34681111cbf)

<details><summary>주요 코드
</summary>

```
// 사용자 정보 / 주문 내역 조회
useEffect(() => {
  const token = localStorage.getItem("token");

  axios.get("http://localhost:8080/api/user/me", {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => setUserInfo(res.data));

  axios.get("http://localhost:8080/api/user/orders", {
    headers: { Authorization: `Bearer ${token}` }
  }).then(res => setOrders(res.data));
}, []);


// 비밀번호 변경
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
    setCurrentPw(""); 
    setNewPw("");
  } catch (err) {
    setPwMsg("비밀번호 변경 실패: " + (err.response?.data || "오류"));
  }
};


// 회원 탈퇴
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

```
</details>


### 상품 목록 및 상세 조회
![상품목록및상세조회](https://github.com/user-attachments/assets/750908fc-e7e2-4868-af6c-04f81e0d0a95)

<details><summary>주요 코드
</summary>

```
코드입력하기
```
</details>


### 장바구니
![장바구니담기](https://github.com/user-attachments/assets/db2c3766-4fb2-4dfc-a9de-813796aec301)
![장바구니추가시데이터추가](https://github.com/user-attachments/assets/981ea4ef-204c-4973-b88a-894027ee1124)
![장바구니수량변경](https://github.com/user-attachments/assets/91c9dcb6-508a-4be8-a338-b985db2fca61)
![장바구니선택삭제](https://github.com/user-attachments/assets/9b129a5f-71d0-455e-a35a-4f0903eb4a1a)
![장바구니전체삭제](https://github.com/user-attachments/assets/331b738e-070a-4907-901e-96eea06bb484)


<details><summary>주요 코드
</summary>

```
코드입력하기
```
</details>


### 주문 및 결제 페이지
![주문페이지이동](https://github.com/user-attachments/assets/6487f0c8-0534-41e3-87cf-9f41d0c63b46)
![주문하기](https://github.com/user-attachments/assets/d1c07d0c-40b3-451c-a4f6-54979d0e7db9)
![주문시데이터추가](https://github.com/user-attachments/assets/21c8f72e-ab99-43e9-8d2e-43d717093415)
![주문시마이페이지에주문내역데이터추가](https://github.com/user-attachments/assets/aa4dfeba-7a25-4a6a-99d5-9e7de91d55f3)

<details><summary>주요 코드
</summary>

```
코드입력하기
```
</details>


### 관리자 전용 상품 관리 페이지

<details><summary>주요 코드
</summary>

```
코드입력하기
```
</details>







