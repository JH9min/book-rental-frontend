import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import LoginPage from './pages/LoginPage';
import BookListPage from './pages/BookListPage';
import RegisterPage from './pages/RegisterPage';
import RentalHistoryPage from './pages/RentalHistoryPage';
import Navbar from './components/Navbar';

// 從 cookie 中取得指定名稱的值
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function App() {
  // 初始化登入狀態（從 cookie 中找 JWT 並驗證是否過期）
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const token = getCookie('token');
      if (!token) return false;
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // 每秒檢查一次 JWT 是否過期，過期就自動登出
    const interval = setInterval(() => {
      const token = getCookie('token');
      if (!token) return setIsAuthenticated(false);

      try {
        const decoded: any = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp <= now) {
          document.cookie = 'token=; path=/; max-age=0'; // 清除 cookie
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* 傳入登入狀態與 setter 給 Navbar */}
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <div className="main-content max-w-4xl mx-auto pt-16">
        <Routes>
          {/* 登入頁面 */}
          <Route path="/login" element={<LoginPage setAuth={setIsAuthenticated} />} />
          {/* 註冊頁面 */}
          <Route path="/register" element={<RegisterPage />} />
          {/* 需要登入才能進入的頁面 */}
          <Route
            path="/books"
            element={isAuthenticated ? <BookListPage /> : <Navigate to="/login" />}
          />
          <Route path="/rentalhistory" element={isAuthenticated ? <RentalHistoryPage /> : <Navigate to="/login" />} />
          {/* 其他路徑一律導向 /books */}
          <Route path="*" element={<Navigate to="/books" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
