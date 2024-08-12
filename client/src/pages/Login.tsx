// src/components/Login.tsx
import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { TextField, Button } from "@mui/material";
import { login } from "@/store/slices/authSlice";
import { publicApi } from "@/axios/Axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useAppDispatch } from "@/store/hooks";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    role: "Teacher" | "Student" | "Principal" | undefined;
    // name: string;
  };
}

const loginUser = async (credentials: { email: string; password: string }) => {
  const res = await publicApi.post<LoginResponse>("/users/login", credentials);
  return res;
};

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      const { data } = res;
      console.log(res);
      console.log(data);

      dispatch(login({ id: data.user.id, role: data.user.role}));
      //   dispatch(login({ name: data.user.name, _id: data.user._id }));
      localStorage.setItem("token", data.token);
    },
    onError: (err: AxiosError) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 sm:px-6 lg:px-8 w-full">
      {/* <div className="max-w-md w-full space-y-8 bg-zinc-800 p-6 rounded-xl border-[1px] border-[#363636]"> */}
      <div className="max-w-md w-full flex flex-col gap-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold ">
            Sign in to your account
          </h2>
        </div>
        <div className="form flex flex-col gap-5 ">
          {/* <div className="rounded-md shadow-sm"> */}
          {/* <TextField
            // margin="normal"
            required
            fullWidth
            id="name"
            label="Enter Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
          /> */}
          <TextField
            // margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
          />

          <TextField
            // margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />
          {/* </div> */}

          <div>
            <Button
              //   type="submit"
              fullWidth
              variant="contained"
              //   className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              //   disabled={isPending}
              onClick={handleSubmit}
            >
              {isPending ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </div>

        {/* {isError && (
          <Alert severity="error" className="mt-4">
            {(error as Error).message || "An error occurred"}
          </Alert>
        )} */}
      </div>
    </div>
  );
};

export default Login;
