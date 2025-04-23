import { useEffect, useState } from 'react';
import { API_BASE, getCookie } from '../utils/api';

interface Rental {
  id: number;
  book: {
    title: string;
    author: string;
  };
  rentedAt: string;
  returnedAt?: string;
}


export default function RentalHistoryPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);

  const fetchRentals = async () => {
    const token = getCookie('token');
    if (!token) return;

    const res = await fetch(`${API_BASE}/rental`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.ok) {
      const data = await res.json();
      setRentals(data);
    }
  };

  const returnBook = async (rentalId: number) => {
    const token = getCookie('token');
    const res = await fetch(`${API_BASE}/rental/return`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ rentalId })
    });

    if (res.ok) {
      fetchRentals(); // 重新載入列表
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">租借紀錄</h1>
      <ul className="space-y-2">
        {rentals.map((rental) => (
          <li key={rental.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{rental.book.title}</p>
              <p className="text-sm text-gray-500">作者：{rental.book.author}</p>
              <p>租借時間：{new Date(rental.rentedAt).toLocaleString()}</p>
            </div>
            {rental.returnedAt ? (
              <p className="text-green-600">已歸還：{new Date(rental.returnedAt).toLocaleString()}</p>
            ) : (
              <button
                className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded"
                onClick={() => returnBook(rental.id)}
              >
                歸還
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
