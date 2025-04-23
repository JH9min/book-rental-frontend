import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// Cookie 解析函式
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// 定義 props 型別
interface NavbarProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}

export default function Navbar({ isAuthenticated, setIsAuthenticated }: NavbarProps) {
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const navigate = useNavigate();

  // 計算並更新剩餘時間
  useEffect(() => {
    if (!isAuthenticated) {
      setRemainingTime(null);
      return;
    }

    const interval = setInterval(() => {
      const token = getCookie("token");
      if (!token) {
        setRemainingTime(null);
        return;
      }

      try {
        const decoded: any = jwtDecode(token);
        const now = Date.now() / 1000;
        const remaining = Math.max(0, Math.floor(decoded.exp - now));
        setRemainingTime(remaining);
      } catch {
        setRemainingTime(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // 登出邏輯
  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0"; // 清空 cookie
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 text-white z-50 shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-lg font-bold flex">
          <p>📚 BookRental</p>
          {isAuthenticated ? (
            <>
              <Link to="/books" className="text-white px-2">書籍列表</Link>
              <Link to="/rentalhistory" className="text-white px-2">我的租借</Link>
            </>
          ) : (
            <Link to="/books" className="text-white px-2">書籍列表</Link>
          )}
          
        </div>
        <div className="space-x-4 flex items-center">
          {/* 顯示剩餘時間 */}
          {remainingTime !== null && (
            <span className="text-sm text-gray-300">
              Token 剩餘時間：{remainingTime}s
            </span>
          )}

          {/* 根據登入狀態切換按鈕 */}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="hover:underline">
              登出
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                登入
              </Link>
              <Link to="/register" className="hover:underline">
                註冊
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
