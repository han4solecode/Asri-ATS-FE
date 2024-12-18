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

function RegisterPage(props) {
  const {} = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const initialvalues = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    dob: "",
    sex: "",
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
        "Your account has been created! Please log in with your newly created account"
      );
      navigate("/login");
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
    const currentDate = new Date().toISOString().slice(0, 10);
    const phoneNumberRegex = /^(0)8[1-9][0-9]{6,9}$/;
    const emailRegex = /\S+@\S+\.\S+/;
    let errorMessages = {};

    if (!formValues.username.trim()) {
      errorMessages.username = "Username is required";
    } else if (formValues.username.length > 50) {
      errorMessages.username = "Username cannot exceed 50 characters";
    } else {
      errorMessages.username = "";
    }

    if (!formValues.password) {
      errorMessages.password = "Passwword is required";
    } else if (formValues.password.length < 8) {
      errorMessages.password = "Passwword must be atleast 8 character long";
    } else if (
      !/[A-Z]/.test(formValues.password) ||
      !/[a-z]/.test(formValues.password)
    ) {
      errorMessages.password =
        "Passwword must contain uppercase and lowercase letter";
    } else {
      errorMessages.password = "";
    }

    if (!formValues.firstName.trim()) {
      errorMessages.firstName = "First name is required";
    } else if (formValues.firstName.length > 50) {
      errorMessages.firstName = "First name cannot exceed 50 characters";
    } else {
      errorMessages.firstName = "";
    }

    if (!formValues.lastName.trim()) {
      errorMessages.lastName = "Last name is required";
    } else if (formValues.lastName.length > 50) {
      errorMessages.lastName = "Last name cannot exceed 50 characters";
    } else {
      errorMessages.lastName = "";
    }

    if (!formValues.address.trim()) {
      errorMessages.address = "Address is required";
    } else if (formValues.address.length > 200) {
      errorMessages.address = "Address cannot exceed 200 characters";
    } else {
      errorMessages.address = "";
    }

    if (!formValues.dob) {
      errorMessages.dob = "Date of birth is required";
    } else if (formValues.dob > currentDate) {
      errorMessages.dob = "Date of birth is not valid";
    } else {
      errorMessages.dob = "";
    }

    if (!formValues.sex) {
      errorMessages.sex = "Gender is required";
    } else {
      errorMessages.sex = "";
    }

    if (!formValues.email) {
      errorMessages.email = "Email is required";
    } else if (!emailRegex.test(formValues.email)) {
      errorMessages.email = "Email is not valid";
    } else {
      errorMessages.email = "";
    }

    if (!formValues.phoneNumber) {
      errorMessages.phoneNumber = "Phone number is required";
    } else if (!phoneNumberRegex.test(formValues.phoneNumber)) {
      errorMessages.phoneNumber = "Phone number is not valid";
    } else {
      errorMessages.phoneNumber = "";
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
      dispatch(registerApplicant(newApplicant));
    }
  };

  console.log(formValues);

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
          <div className="text-lg mb-3 underline text-gray-700">
            Personal Data
          </div>
          <div className="flex flex-col gap-2 md:flex-row mb-4">
            <TextField
              label="First Name"
              name="firstName"
              fullWidth
              size="large"
              value={formValues.firstName}
              onChange={handleInputChange}
              error={errors.firstName}
              helperText={errors.firstName}
            ></TextField>
            <TextField
              label="Last Name"
              name="lastName"
              fullWidth
              size="large"
              value={formValues.lastName}
              onChange={handleInputChange}
              error={errors.lastName}
              helperText={errors.lastName}
            ></TextField>
            <TextField
              label="Email Address"
              name="email"
              fullWidth
              size="large"
              placeholder="email@example.com"
              value={formValues.email}
              onChange={handleInputChange}
              error={errors.email}
              helperText={errors.email}
            ></TextField>
            <TextField
              label="Phone Number"
              name="phoneNumber"
              fullWidth
              size="large"
              placeholder="08XXXXXXXX"
              value={formValues.phoneNumber}
              onChange={handleInputChange}
              error={errors.phoneNumber}
              helperText={errors.phoneNumber}
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
              value={formValues.address}
              onChange={handleInputChange}
              error={errors.address}
              helperText={errors.address}
            ></TextField>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <TextField
              label="Date of Birth"
              name="dob"
              fullWidth
              size="large"
              type="date"
              value={formValues.dob}
              onChange={handleInputChange}
              error={errors.dob}
              helperText={errors.dob}
            ></TextField>
            <FormControl error={errors.sex}>
              <FormLabel id="gender-radio-group-label">Gender</FormLabel>
              <RadioGroup
                aria-labelledby="gender-radio-buttons-group-label"
                name="sex"
                value={formValues.sex}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
              </RadioGroup>
              <FormHelperText>{errors.sex}</FormHelperText>
            </FormControl>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <Button
              variant="contained"
              sx={{ width: "80%", backgroundColor: "#1f2937" }}
              onClick={handleFormSubmit}
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
