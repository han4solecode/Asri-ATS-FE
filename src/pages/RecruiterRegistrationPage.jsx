import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  MenuItem,
  CircularProgress,
  FormHelperText,
  Typography,
  Box,
} from "@mui/material";
import RecruiterRegisterService from "../services/recruiterRegister.service";
import CompanyService from "../services/company.service";
import { Link } from "react-router-dom";

const RecruiterRegistrationPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    sex: "",
    email: "",
    phoneNumber: "",
    address: "",
    companyId: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch companies from the backend
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await CompanyService.getCompany();
        setCompanies(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Validate inputs
  const validate = () => {
    const phoneNumberRegex = /^(0)8[1-9][0-9]{6,9}$/;
    const emailRegex = /\S+@\S+\.\S+/;
    const currentDate = new Date().toISOString().slice(0, 10);

    let validationErrors = {};

    if (!formValues.firstName.trim()) {
      validationErrors.firstName = "First name is required.";
    } else if (formValues.firstName.length > 50) {
      validationErrors.firstName = "First name cannot exceed 50 characters.";
    }

    if (!formValues.lastName.trim()) {
      validationErrors.lastName = "Last name is required.";
    } else if (formValues.lastName.length > 50) {
      validationErrors.lastName = "Last name cannot exceed 50 characters.";
    }

    if (!formValues.dob) {
      validationErrors.dob = "Date of birth is required.";
    } else if (formValues.dob > currentDate) {
      validationErrors.dob = "Date of birth must be in the past.";
    }

    if (!formValues.sex) {
      validationErrors.sex = "Gender is required.";
    }

    if (!formValues.email) {
      validationErrors.email = "Email is required.";
    } else if (!emailRegex.test(formValues.email)) {
      validationErrors.email = "Email is not valid.";
    }

    if (!formValues.phoneNumber) {
      validationErrors.phoneNumber = "Phone number is required.";
    } else if (!phoneNumberRegex.test(formValues.phoneNumber)) {
      validationErrors.phoneNumber = "Phone number is not valid.";
    }

    if (!formValues.address.trim()) {
      validationErrors.address = "Address is required.";
    } else if (formValues.address.length > 200) {
      validationErrors.address = "Address cannot exceed 200 characters.";
    }

    if (!formValues.companyId) {
      validationErrors.companyId = "Please select a company.";
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await RecruiterRegisterService.recruiterRequest(formValues);
      if (response.data.status === "Success") {
        alert("Registration successful!");
        setFormValues({
          firstName: "",
          lastName: "",
          dob: "",
          sex: "",
          email: "",
          phoneNumber: "",
          address: "",
          companyId: "",
        });
      } else {
        alert("Registration failed!");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="sm:w-3/4 md:w-3/4 mt-10 mb-10 border rounded shadow-lg p-4"
    >
      <Typography variant="h5" className="mb-5 font-semibold text-gray-700">
        Recruiter Registration
      </Typography>

      {/* Personal Information */}
      <Typography variant="h6" className="mb-3 underline text-gray-700">
        Personal Information
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <TextField
          label="First Name"
          name="firstName"
          value={formValues.firstName}
          onChange={handleInputChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
          fullWidth
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formValues.lastName}
          onChange={handleInputChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
          fullWidth
        />
        <TextField
          label="Date of Birth"
          name="dob"
          type="date"
          value={formValues.dob}
          onChange={handleInputChange}
          error={!!errors.dob}
          helperText={errors.dob}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <FormControl error={!!errors.sex} fullWidth>
          <FormLabel>Gender</FormLabel>
          <RadioGroup
            name="sex"
            value={formValues.sex}
            onChange={handleInputChange}
          >
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
          </RadioGroup>
          <FormHelperText>{errors.sex}</FormHelperText>
        </FormControl>
      </div>

      <TextField
        label="Address"
        name="address"
        value={formValues.address}
        onChange={handleInputChange}
        error={!!errors.address}
        helperText={errors.address}
        fullWidth
        multiline
        rows={3}
        className="mb-4"
      />

      {/* Contact Information */}
      <Typography variant="h6" className="mb-3 underline text-gray-700">
        Contact Information
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <TextField
          label="Email"
          name="email"
          value={formValues.email}
          onChange={handleInputChange}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={formValues.phoneNumber}
          onChange={handleInputChange}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
          fullWidth
        />
      </div>

      {/* Company Information */}
      <Typography variant="h6" className="mb-3 underline text-gray-700">
        Company Information
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <TextField
          select
          label="Company"
          name="companyId"
          value={formValues.companyId}
          onChange={handleInputChange}
          error={!!errors.companyId}
          helperText={errors.companyId}
          fullWidth
          className="pb-2"
        >
          {companies.map((company) => (
            <MenuItem key={company.companyId} value={company.companyId}>
              {company.name}
            </MenuItem>
          ))}
        </TextField>
      )}

      {/* Submit Button */}
      <div className="flex flex-col gap-2 items-center justify-center pt-2">
      
      <Button
        type="submit"
        variant="contained"
        className="w-full mt-6"
        sx={{ width: "80%", backgroundColor: "#1f2937" }}
      >
        {isSubmitting ? "Submitting..." : "Register"}
      </Button>
      <span className="text-sm text-gray-700">
        Already Have an Account?{" "}
        <Link to="/login" className="text-blue-700 hover:underline">
          Log In
        </Link>
      </span>
      </div>
    </Box>
  );
};

export default RecruiterRegistrationPage;
