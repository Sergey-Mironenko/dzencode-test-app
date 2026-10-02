'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const { register, isLoading, error: authError, clearError } = useAuth();

  const validateForm = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Введите корректный email адрес');
      return false;
    }

    if (password.length < 6) {
      setValidationError('Пароль должен содержать минимум 6 символов');
      return false;
    }

    if (password !== confirmPassword) {
      setValidationError('Пароли не совпадают');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    await register({ email, password });
  };

  const displayError = validationError || authError;

  return (
    <div className="min-vh-100 d-flex align-items-start align-items-sm-center justify-content-center bg-light px-3 pt-5 pt-sm-0">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-4 p-sm-5 rounded-4 shadow-sm w-100"
        style={{ maxWidth: '384px' }}
        noValidate
      >
        <h2 className="h2 fw-bold mb-4 text-center text-dark fs-3 fs-sm-2">Регистрация</h2>

        {displayError && (
          <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
            {displayError}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label text-secondary small fw-bold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (validationError) setValidationError(null);
            }}
            className="form-control shadow-none focus-ring"
            placeholder="example@mail.com"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label text-secondary small fw-bold">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (validationError) setValidationError(null);
            }}
            className="form-control shadow-none focus-ring"
            placeholder="Минимум 6 символов"
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label text-secondary small fw-bold">Повторите пароль</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (validationError) setValidationError(null);
            }}
            className="form-control shadow-none focus-ring"
            placeholder="Повторите введенный пароль"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-100 btn btn-success fw-bold py-2 mb-3 shadow-sm"
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        <p className="text-center small text-muted m-0">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-success text-decoration-none fw-semibold">
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}