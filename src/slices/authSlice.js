import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "../services/auth.service";

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: user,
  isLoading: false,
  isSuccess: false,
  isAuthenticated: false,
  isError: false,
  message: "",
};

export const registerApplicant = createAsyncThunk(
  "auth/registerApplicant",
  async (userData) => {
    try {
      const res = await AuthService.registerAplicant(userData);
      return res.data;
    } catch (error) {
      let message = "Error occured at applicant registration";
      if (error.response && error.response.data) {
        message = error.response.data.message;
      }
      throw new Error(message);
    }
  }
);

export const login = createAsyncThunk("auth/login", async (userData) => {
  try {
    const res = await AuthService.login(userData);
    return res.data;
  } catch (error) {
    let message = "Error occured when login";
    if (error.response && error.response.data) {
      message = error.response.data.message;
    }
    throw new Error(message);
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    const res = await AuthService.logout();
    return res.data;
  } catch (error) {
    let message = "Error occured when logout";
    if (error.response && error.response.data) {
      message = error.response.data.message;
    }
    throw new Error(message);
  }
});

export const refreshToken = createAsyncThunk("auth/refreshToken", async () => {
  try {
    const res = await AuthService.refreshToken();
    return res.data;
  } catch (error) {
    let message = "Error occured when refreshing access token";
    if (error.response && error.response.data) {
      message = error.response.data.message;
    }
    throw new Error(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // register cases
      .addCase(registerApplicant.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerApplicant.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(registerApplicant.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.error.message || "";
      })
      // login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.error.message || "";
        state.isSuccess = false;
        state.isError = true;
        state.isAuthenticated = false;
        state.user = null;
      })
      // logout cases
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isSuccess = false;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action.error.message || "";
        state.isError = true;
        state.isSuccess = false;
      })
      // refresh token cases
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isSuccess = false;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem("user");
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
