
// src/pages/BookListPage.tsx
import { useEffect, useState } from 'react';
import { API_BASE, getCookie } from '../utils/api';

interface Book {
  id: number;
  title: string;
  author: string;
}

export default function BookListPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');

  const fetchBooks = async () => {
    const token = getCookie('token');
    if (!token) return;
    const res = await fetch(`${API_BASE}/books`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setBooks(data);
    } else {
      setMessage('無法取得書籍資料');
    }
  };

  const addBook = async () => {
    const token = getCookie('token');
    if (!token) { setMessage('請先登入'); return; }
    const res = await fetch(`${API_BASE}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title, author })
    });
    if (res.ok) {
      setMessage('新增成功');
      setTitle('');
      setAuthor('');
      fetchBooks();
    } else {
      setMessage('新增失敗');
    }
  };

  const rentBook = async (id: number) => {
    const token = getCookie('token');
    if (!token) { setMessage('請先登入'); return; }
    const res = await fetch(`${API_BASE}/rental`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ bookId: id })
    });
    if (res.ok) {
      setMessage(`書籍 ${id} 已租借`);
    } else {
      setMessage('租借失敗');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">書籍列表</h1>
      <div className="mb-6 flex space-x-2">
        <input
          className="border p-2 rounded flex-1"
          placeholder="書名"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 rounded flex-1"
          placeholder="作者"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button
          className="bg-green-500 text-white px-4 rounded"
          onClick={addBook}
        >新增書籍</button>
      </div>
      {message && <p className="mb-4 text-blue-600">{message}</p>}
      <ul className="space-y-4">
        {books.map((book) => (
          <li key={book.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">{book.title}</p>
              <p className="text-gray-600">{book.author}</p>
            </div>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={() => rentBook(book.id)}
            >租借</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
