import { Button, TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login, reset } from "../slices/authSlice";
import { useForm } from "react-hook-form"
import { toast } from "react-toastify";

function LoginPage(props) {
  const {} = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success("You have successfully logged in!");
      navigate("/");
    }

    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  const handleFormSubmit = (data) => {
      // login applicant account
      dispatch(login(data));
  }

  return (
    <div className="sm:w-6/12 md:w-6/12 mt-10 mb-10">
      <div className="border rounded shadow-lg p-2">
        <div className="w-full mb-5">
          <span className="text-3xl font-semibold text-gray-700">Login</span>
        </div>
        <form autoComplete="off">
          <div className="flex flex-col gap-2 mb-4">
            <TextField
              label="Username"
              name="username"
              fullWidth
              size="large"
              {...register("username",{
                required:"Username is required"
              })}
              error={!!errors.username}
              helperText={errors.username?.message}
              sx={{ mb: 4, mt: 1 }}
            ></TextField>
            <TextField
              label="Password"
              name="password"
              fullWidth
              size="large"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password",{
                required:"Password is required"
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            ></TextField>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <Button
              variant="contained"
              sx={{ width: "40%", backgroundColor: "#1f2937" }}
              onClick={handleSubmit((data) => {
                handleFormSubmit(data);
              })}
            >
              {isLoading ? "Loggin into Your Account..." : "Login"}
            </Button>
            <span className="text-sm text-gray-700">
              {"Don't Have an Account yet? "}
              <Link to="/register" className="text-blue-700 hover:underline">
                Register
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
