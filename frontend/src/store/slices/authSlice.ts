import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User, Workspace } from '../../types';

interface AuthState {
  user: User | null;
  workspace: Workspace | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  workspace: null,
  accessToken: localStorage.getItem('accessToken'),
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await axios.post('/api/auth/login', { email, password }, {
      withCredentials: true
    });
    return response.data;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string; firstName: string; lastName: string }) => {
    const response = await axios.post('/api/auth/register', userData, {
      withCredentials: true
    });
    return response.data;
  }
);

export const fetchWorkspace = createAsyncThunk(
  'auth/fetchWorkspace',
  async (workspaceId: string) => {
    const response = await axios.get(`/api/workspaces/${workspaceId}`);
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.workspace = null;
      state.accessToken = null;
      localStorage.removeItem('accessToken');
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem('accessToken', action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(fetchWorkspace.fulfilled, (state, action) => {
        state.workspace = action.payload;
      });
  },
});

export const { logout, setAccessToken, clearError } = authSlice.actions;
export default authSlice.reducer;