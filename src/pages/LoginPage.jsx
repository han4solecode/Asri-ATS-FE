import {
    Button,
    TextField,
    InputAdornment,
    IconButton,
  } from "@mui/material";
  import { Visibility, VisibilityOff } from "@mui/icons-material";
  import { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { useNavigate, Link } from "react-router-dom";
  import { login, reset } from "../slices/authSlice";
  
  function LoginPage(props) {
    const {} = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    const { isLoading, isError, isSuccess, message } = useSelector(
      (state) => state.auth
    );
  
    const initialvalues = {
      username: "",
      password: ""
    };
  
    const [formValues, setFormValues] = useState(initialvalues);
    const [errors, setErrors] = useState(initialvalues);
    const [showPassword, setShowPassword] = useState(false);
  
    useEffect(() => {
      if (isError) {
        alert(message);
      }
  
      if (isSuccess) {
        alert(
          "You have successfully logged in!"
        );
        navigate("/");
      }
  
      dispatch(reset());
    }, [isError, isSuccess, message, navigate, dispatch]);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormValues({ ...formValues, [name]: value });
    };
  
    const handleFormSubmit = (e) => {
      e.preventDefault();
  
      // validation
      let errorMessages = {};
  
      if (!formValues.username.trim()) {
        errorMessages.username = "Username is required";
      }
  
      if (!formValues.password) {
        errorMessages.password = "Passwword is required";
      }

      setErrors(errorMessages);
  
      let formValid = true;
      for (let propName in errorMessages) {
        if (errorMessages[propName].length > 0) {
          formValid = false;
        }
      }
  
      if (formValid) {
        // create new applicant account
        let newApplicant = { ...formValues };
        dispatch(login(newApplicant));
      }
    };
  
    return (
      <div className="sm:w-3/4 md:w-3/4 mt-10 mb-10">
        <div className="border rounded shadow-lg p-2">
          <div className="w-full mb-5">
            <span className="text-3xl font-semibold text-gray-700">
              Login
            </span>
          </div>
          <form autoComplete="off">
            <div className="text-lg mb-3 underline text-gray-700">
              Credentials
            </div>
            <div className="flex flex-col gap-2 md:flex-row mb-4">
              <TextField
                label="Username"
                name="username"
                fullWidth
                size="large"
                value={formValues.username}
                onChange={handleInputChange}
                error={errors.username}
                helperText={errors.username}
              ></TextField>
              <TextField
                label="Password"
                name="password"
                fullWidth
                size="large"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={formValues.password}
                onChange={handleInputChange}
                error={errors.password}
                helperText={errors.password}
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
                onClick={handleFormSubmit}
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
  