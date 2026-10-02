import Cookies from 'js-cookie';

export const loginUser = async (credentials: { email: string; pass: string }) => {
  if (credentials.email === 'admin@mail.com' && credentials.pass === 'admin123') {
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_jwt_token';
    Cookies.set('token', mockToken, { expires: 1 });
    return { success: true };
  }
  return { success: false, error: 'Неверный email или пароль' };
};

export const logoutUser = () => {
  Cookies.remove('token');
  window.location.href = '/login';
};