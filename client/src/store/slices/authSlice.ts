import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// Define the initial state

type role = "Teacher" | "Student" | "Principal" | undefined;

type AuthStateType = {
  isAuthenticated: boolean;
  userId: undefined | string;
  // name: undefined | string;
  role: role;
};
const initialState: AuthStateType = {
  isAuthenticated: false,
  userId: undefined,
  // name: undefined,
  role: undefined,
};

// Create the slice
export const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    login: (
      _,
      action: PayloadAction<{
        // name: string | undefined;
        id: string | undefined;
        role:role
      }>
    ) => {
      const { id, role } = action.payload;
      // const { name, id } = action.payload;
      return {
        isAuthenticated: true,
        // name,
        userId: id,
        role
      };
    },
    resetAuth: () => {
      return initialState;
    },
  },
});

// Export the reducer functions
export const { login, resetAuth } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
