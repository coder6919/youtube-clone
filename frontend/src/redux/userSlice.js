import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: JSON.parse(localStorage.getItem('user')) || null,
  // token: ... <-- DELETED (We don't handle tokens in frontend state anymore)
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      // The payload now only contains 'user', because we removed 'token' from the backend response
      state.currentUser = action.payload.user;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      // localStorage.setItem('token'...) <-- DELETED
    },
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem('user');
      // localStorage.removeItem('token') <-- DELETED
    },
    updateUser: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.currentUser));
    }
  },
});

export const { loginSuccess, logout, updateUser } = userSlice.actions;

export default userSlice.reducer;