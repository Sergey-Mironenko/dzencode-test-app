'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className="min-vh-100 d-flex align-items-start align-items-sm-center justify-content-center bg-light px-3 pt-5 pt-sm-0">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-4 p-sm-5 rounded-4 shadow-sm w-100"
        style={{ maxWidth: '384px' }}
      >
        <h2 className="h4 fw-bold mb-4 text-center text-dark">Вход в систему</h2>

        {error && (
          <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label text-secondary small fw-bold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control shadow-none focus-ring"
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label text-secondary small fw-bold">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control shadow-none focus-ring"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-100 btn btn-success fw-bold py-2 mb-3 shadow-sm"
        >
          {isLoading ? 'Загрузка...' : 'Войти'}
        </button>

        <p className="text-center small text-muted m-0">
          Еще нет аккаунта?{' '}
          <Link href="/register" className="text-success text-decoration-none fw-semibold">
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </div>
  );
}