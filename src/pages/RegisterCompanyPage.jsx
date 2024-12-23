import {
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  FormHelperText,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CompanyService from "../services/company.service";

function RegisterCompanyPage(props) {
  const {} = props;
  const navigate = useNavigate();

  const initialvalues = {
    // user info
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    userAddress: "",
    dob: "",
    sex: "",
    // company info
    companyName: "",
    companyAddress: "",
  };

  const [formValues, setFormValues] = useState(initialvalues);
  const [errors, setErrors] = useState(initialvalues);
  const [isLoading, setIsLoading] = useState(false);

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

    if (!formValues.companyName.trim()) {
      errorMessages.companyName = "Company name is required";
    } else if (formValues.companyName.length > 50) {
      errorMessages.companyName = "Company name cannot exceed 50 characters";
    } else {
      errorMessages.companyName = "";
    }

    if (!formValues.companyAddress.trim()) {
      errorMessages.companyAddress = "Company address is required";
    } else if (formValues.companyAddress.length > 200) {
      errorMessages.companyAddress =
        "Company address cannot exceed 200 characters";
    } else {
      errorMessages.companyAddress = "";
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

    if (!formValues.userAddress.trim()) {
      errorMessages.userAddress = "Home address is required";
    } else if (formValues.userAddress.length > 200) {
      errorMessages.userAddress = "Address cannot exceed 200 characters";
    } else {
      errorMessages.userAddress = "";
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
      setIsLoading(true);
      CompanyService.registerCompanyRequest(formValues)
        .then((res) => {
          alert(res.data.message);
        })
        .catch((err) => {
          console.log(err);
          alert(err.response.data.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  console.log(formValues);

  return (
    <div className="sm:w-3/4 md:w-3/4 mt-10 mb-10">
      <div className="border rounded shadow-lg p-2">
        <div className="w-full mb-5">
          <span className="text-3xl font-semibold text-gray-700">
            Register Your Company
          </span>
        </div>
        <form autoComplete="off">
          <div className="text-lg mb-3 underline text-gray-700">
            Company Information
          </div>
          <div className="flex flex-col gap-2 md:flex-row mb-4">
            <TextField
              label="Company Name"
              name="companyName"
              fullWidth
              size="large"
              value={formValues.companyName}
              onChange={handleInputChange}
              error={errors.companyName}
              helperText={errors.companyName}
            ></TextField>
          </div>
          <div className="flex flex-col gap-2 md:flex-row mb-4">
            <TextField
              label="Company Address"
              name="companyAddress"
              fullWidth
              size="large"
              multiline
              maxRows={3}
              value={formValues.companyAddress}
              onChange={handleInputChange}
              error={errors.companyAddress}
              helperText={errors.companyAddress}
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
              name="userAddress"
              fullWidth
              size="large"
              multiline
              maxRows={3}
              value={formValues.userAddress}
              onChange={handleInputChange}
              error={errors.userAddress}
              helperText={errors.userAddress}
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
              <FormHelperText>{errors.sex}</FormHelperText>
            </FormControl>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center">
            <Button
              variant="contained"
              sx={{ width: "80%", backgroundColor: "#1f2937" }}
              onClick={handleFormSubmit}
            >
              {isLoading ? "Submiting Registration Request..." : "Register"}
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

export default RegisterCompanyPage;
