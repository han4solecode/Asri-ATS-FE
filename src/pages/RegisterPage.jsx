import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  FormHelperText,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerApplicant, reset } from "../slices/authSlice";
import { useForm } from "react-hook-form"

function RegisterPage(props) {
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
      alert(message);
    }

    if (isSuccess) {
      alert(
        "Your account has been created! Please log in with your newly created account"
      );
      navigate("/login");
    }

    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  const handleFormSubmit = (data) => {
      // create new applicant account
      dispatch(registerApplicant(data));
  };

  return (
    <div className="sm:w-3/4 md:w-3/4 mt-10 mb-10">
      <div className="border rounded shadow-lg p-2">
        <div className="w-full mb-5">
          <span className="text-3xl font-semibold text-gray-700">
            Create an Account
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
              {...register("username",{
                required:"Username is required", 
                maxLength:{
                value:50,
                message:"Username cannot exceed 50 characters"
              }})}
              error={!!errors.username}
              helperText={errors.username?.message}
            ></TextField>
            <TextField
              label="Password"
              name="password"
              fullWidth
              size="large"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password",{
                required:"Password is required",
                minLength:{
                  value:8,
                  message:"Password must be atleast 8 character long"
                },
                pattern:{
                  value: /^(?=.*[a-z])(?=.*[A-Z]).*$/,
                  message:"Password must contain uppercase and lowercase letter"
                }
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
          <div className="text-lg mb-3 underline text-gray-700">
            Personal Data
          </div>
          <div className="flex flex-col gap-2 md:flex-row mb-4">
            <TextField
              label="First Name"
              name="firstName"
              fullWidth
              size="large"
              {...register("firstName",{
                required:"First name is required", 
                maxLength:{
                value:50,
                message:"First name cannot exceed 50 characters"
              }})}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            ></TextField>
            <TextField
              label="Last Name"
              name="lastName"
              fullWidth
              size="large"
              {...register("lastName",{
                required:"Last name is required", 
                maxLength:{
                value:50,
                message:"Last name cannot exceed 50 characters"
              }})}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            ></TextField>
            <TextField
              label="Email Address"
              name="email"
              fullWidth
              size="large"
              placeholder="email@example.com"
              {...register("email",{
                required:"Email is required", 
                pattern:{
                value: /\S+@\S+\.\S+/,
                message:"Email is not valid"
              }})}
              error={!!errors.email}
              helperText={errors.email?.message}
            ></TextField>
            <TextField
              label="Phone Number"
              name="phoneNumber"
              fullWidth
              size="large"
              placeholder="08XXXXXXXX"
              {...register("phoneNumber",{
                required:"Phone number is required", 
                pattern:{
                value: /^(0)8[1-9][0-9]{6,9}$/,
                message:"Phone number is not valid"
              }})}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            ></TextField>
          </div>
          <div className="flex flex-col gap-2 md:flex-row mb-4">
            <TextField
              label="Home Address"
              name="address"
              fullWidth
              size="large"
              multiline
              maxRows={3}
              {...register("address",{
                required:"Address is required", 
                maxLength:{
                value:200,
                message:"Address cannot exceed 200 characters"
              }})}
              error={!!errors.address}
              helperText={errors.address?.message}
            ></TextField>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <TextField
              label="Date of Birth"
              name="dob"
              fullWidth
              size="large"
              type="date"
              {...register("dob",{
                required:"Date of birth is required", 
                validate:{
                  isValidDate:(value) => {
                    const currentDate = new Date().toISOString().slice(0, 10);
                    return value < currentDate || "Date of birth is not valid";
                  }
                }})}
              error={!!errors.dob}
              helperText={errors.dob?.message}
            ></TextField>
            <FormControl error={errors.sex}>
              <FormLabel id="gender-radio-group-label">Gender</FormLabel>
              <RadioGroup
                aria-labelledby="gender-radio-buttons-group-label"
                name="sex"
                {...register("sex",{
                  required:"Gender is required"
                })}
                sx={{ color: "#374151" }}
              >
                <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
              <FormHelperText>{errors.sex?.message}</FormHelperText>
            </FormControl>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <Button
              variant="contained"
              sx={{ width: "80%", backgroundColor: "#1f2937" }}
              onClick={handleSubmit((data) => {
                handleFormSubmit(data);
              })}
            >
              {isLoading ? "Creating Your Account..." : "Register"}
            </Button>
            <span className="text-sm text-gray-700">
              Already Have an Account?{" "}
              <Link to="/login" className="text-blue-700 hover:underline">
                Log In
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
