import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface AuthState {
  token: string | null;
  user: { email: string; role: string } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: Cookies.get('token') || null,
  user: null,
  isLoading: false,
  error: null,
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:4000';

    // Формируем GraphQL мутацию для входа
    const mutation = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          success
          token
          message
          user {
            email
            role
          }
        }
      }
    `;

    try {
      const res = await fetch(`${BASE_URL}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: mutation,
          variables: credentials,
        }),
      });

      const result = await res.json();
      const data = result.data?.login;

      if (!res.ok || !data || !data.success) {
        return rejectWithValue(data?.message || 'Ошибка авторизации');
      }

      Cookies.set('token', data.token, { expires: 1 });
      return { token: data.token, user: data.user };
    } catch (err) {
      return rejectWithValue('Нет связи с сервером');
    }
  }
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    const BASE_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:4000';

    // Формируем GraphQL мутацию для регистрации
    const mutation = `
      mutation Register($email: String!, $password: String!) {
        register(email: $email, password: $password) {
          success
          token
          message
          user {
            email
            role
          }
        }
      }
    `;

    try {
      const res = await fetch(`${BASE_URL}/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: mutation,
          variables: credentials,
        }),
      });

      const result = await res.json();
      const data = result.data?.register;

      if (!res.ok || !data || !data.success) {
        return rejectWithValue(data?.message || 'Ошибка регистрации');
      }

      Cookies.set('token', data.token, { expires: 1 });
      return { token: data.token, user: data.user };
    } catch (err) {
      return rejectWithValue('Нет связи с сервером');
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      Cookies.remove('token');
      state.token = null;
      state.user = null;
      state.error = null;
      window.location.href = '/login';
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Вход
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<{ token: string; user?: any }>) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user || null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Регистрация
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action: PayloadAction<{ token: string; user?: any }>) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user || null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;