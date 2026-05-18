**[Pawsome Back 보러가기](https://github.com/sehee32/pawsome_back)**   


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


## ✍️QA Testing

- 회원가입 / 로그인 기능 테스트
- JWT 인증 및 사용자 권한 테스트
- 상품 목록 및 상세 조회 테스트
- 장바구니 추가 / 수정 / 삭제 테스트
- 주문 및 결제 프로세스 테스트
- 마이페이지 주문 내역 및 회원정보 테스트
- 관리자 상품 등록 / 삭제 기능 테스트

📄 테스트케이스 문서:
- Pawsome_TC.xlsx



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


### 로그인
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
// 상품 카드 컴포넌트 (ProductCard.js)
function ProductCard({ product }) {
    return (
        <div className="product-card">
            {/* 상품 이미지 클릭 시 상세페이지 이동 */}
            <Link to={`/products/${product.id}`}>
                <img src={`http://localhost:8080${product.imageUrl}`} alt={product.name} />
            </Link>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">{product.price.toLocaleString()}원</p>
        </div>
    );
}


// 상품 목록 불러오기 (HomePage.js)
function HomePage() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/products')
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    return (
        <div className="homepage">
            <div className="product-list">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}


// 상품 상세 정보 호출 (ProductDetailPage.js)
function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/products/${id}`)
            .then(response => setProduct(response.data))
            .catch(error => console.error('Error fetching product:', error));
    }, [id]);

    if (!product) return <div className="loading">Loading...</div>;
}

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
// 장바구니 담기 (ProductDetailPage.js)
const addToCart = async () => {
  const token = localStorage.getItem("token"); // JWT 인증 토큰
  if (!token) {
    alert("로그인이 필요합니다.");
    window.location.href = "/login";
    return;
  }

  try {
    await axios.post(
      `http://localhost:8080/api/cart/${product.id}`,
      { quantity: 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("장바구니에 담았습니다!");
  } catch (error) {
    alert("오류 발생: " + (error.response?.data || error.message));
  }
};


// 수량 변경 및 삭제 (Cart.js)
// 수량 증가
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
  } catch {
    alert("수량 변경에 실패했습니다.");
  }
};

// 수량 감소
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
  } catch {
    alert("수량 변경에 실패했습니다.");
  }
};

// 단일 상품 삭제
const removeFromCart = async (productId) => {
  const token = localStorage.getItem("token");
  try {
    await axios.delete(`http://localhost:8080/api/cart/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    setSelectedItems(prev => prev.filter(id => id !== productId));
  } catch {
    alert("삭제에 실패했습니다.");
  }
};

// 선택된 상품 삭제
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
    setCartItems(prev => prev.filter(item => !selectedItems.includes(item.product.id)));
    setSelectedItems([]);
  } catch {
    alert("선택 항목 삭제에 실패했습니다.");
  }
};

// 전체 삭제
const clearCart = async () => {
  const token = localStorage.getItem("token");
  try {
    await axios.delete("http://localhost:8080/api/cart", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCartItems([]);
    setSelectedItems([]);
  } catch {
    alert("전체 삭제에 실패했습니다.");
  }
};

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
//주문페이지 이동 (Cart.js)
const handleOrder = () => {
  if (selectedItems.length === 0) {
    alert("주문할 상품을 선택해주세요.");
    return;
  }
  const selectedCartItems = cartItems.filter(item =>
    selectedItems.includes(item.product.id)
  );
  navigate("/order", { state: { cartItems: selectedCartItems } });
};

// 주문데이터 제출 (OrderPage.js)
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
  } catch {
    alert("주문 처리 중 오류가 발생했습니다.");
  }
};
```
</details>


### 관리자 전용 상품 관리 페이지
![관리자페이지진입과상품삭제](https://github.com/user-attachments/assets/b2b93aae-6276-48e6-9a9c-fe410f94cdc2)
![관리자상품추가](https://github.com/user-attachments/assets/6dea2ca1-9de6-4a2b-a2b1-706a9fec564e)

<details><summary>주요 코드
</summary>

```
// 관리자 페이지 진입 (Navbar.js)
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


{isAdmin && <Link to="/admin">ADMIN</Link>} {/* 관리자 전용 */}


// 관리자 페이지 상품 가져오기 (AdminDashboard.js)
const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/products');
            console.log(response.data); // 응답 데이터 구조 확인
            setProducts(response.data);
        } catch (error) {
            console.error('상품 목록 가져오기 오류:', error);
        }
    };

// 상품 추가 & 삭제
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

```
</details>



