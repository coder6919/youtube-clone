import { createSlice } from '@reduxjs/toolkit';

// 1. Initial State: Try to load user from localStorage first
const initialState = {
  currentUser: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action: Login Success
    loginSuccess: (state, action) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      // Sync with localStorage
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    // Action: Logout
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    // Action: Update User Details (e.g., if they subscribe to a channel)
    updateUser: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.currentUser));
    }
  },
});

export const { loginSuccess, logout, updateUser } = userSlice.actions;

export default userSlice.reducer;