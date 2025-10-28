import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, User, LoginData, RegisterData } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginData) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_USER'; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: 'AUTH_FAILURE', payload: 'No token found' });
      return;
    }

    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.getMe();
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.data.data.user,
          token: token,
        },
      });
    } catch (error: any) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.response?.data?.message || 'Authentication failed',
      });
    }
  };

  const login = async (credentials: LoginData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.login(credentials);
      const { token, data } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: data.user,
          token: token,
        },
      });
    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.response?.data?.message || 'Login failed',
      });
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authAPI.register(userData);
      const { token, data } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: data.user,
          token: token,
        },
      });
    } catch (error: any) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error.response?.data?.message || 'Registration failed',
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'AUTH_LOGOUT' });
    authAPI.logout().catch(console.error);
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
    localStorage.setItem('user', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
