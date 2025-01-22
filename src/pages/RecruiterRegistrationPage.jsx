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
  Typography,
  Box,
  FormHelperText
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import RecruiterRegisterService from "../services/recruiterRegister.service";
import CompanyService from "../services/company.service";
import { Link } from "react-router-dom";

const RecruiterRegistrationPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    reset, // Add reset for clearing form fields
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      dob: "",
      sex: "",
      email: "",
      phoneNumber: "",
      address: "",
      companyId: "",
    },
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await CompanyService.getCompany();
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const validateFields = (data) => {
    const phoneNumberRegex = /^(0)8[1-9][0-9]{6,9}$/;
    const emailRegex = /\S+@\S+\.\S+/;
    const currentDate = new Date().toISOString().slice(0, 10);
    let isValid = true; // Track validation state
  
    if (!data.dob || data.dob > currentDate) {
      setError("dob", { type: "manual", message: "Date of birth must be in the past." });
      isValid = false;
    }
  
    if (!phoneNumberRegex.test(data.phoneNumber)) {
      setError("phoneNumber", { type: "manual", message: "Phone number is not valid." });
      isValid = false;
    }
  
    if (!emailRegex.test(data.email)) {
      setError("email", { type: "manual", message: "Email is not valid." });
      isValid = false;
    }
  
    return isValid;
  };

  const onSubmit = async (data) => {
    clearErrors();
    const isValid = validateFields(data); // Validate fields
  
    if (!isValid) {
      // Halt submission if validation fails
      return;
    }
  
    setIsSubmitting(true);
    try {
      const response = await RecruiterRegisterService.recruiterRequest(data);
      if (response.data.status === "Success") {
        alert("Registration successful!");
        reset(); // Clear all form fields
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
      onSubmit={handleSubmit(onSubmit)}
      className="sm:w-3/4 md:w-3/4 mt-10 mb-10 border rounded shadow-lg p-4"
    >
      <Typography variant="h5" className="mb-5 font-semibold text-gray-700">
        Recruiter Registration
      </Typography>

      <Typography variant="h6" className="mb-3 underline text-gray-700">
        Personal Information
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Controller
          name="firstName"
          control={control}
          rules={{
            required: "First name is required.",
            maxLength: { value: 50, message: "First name cannot exceed 50 characters." },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="First Name"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          rules={{
            required: "Last name is required.",
            maxLength: { value: 50, message: "Last name cannot exceed 50 characters." },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Last Name"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="dob"
          control={control}
          rules={{ required: "Date of birth is required." }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Date of Birth"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.dob}
              helperText={errors.dob?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="sex"
          control={control}
          rules={{ required: "Gender is required." }}
          render={({ field }) => (
            <FormControl error={!!errors.sex} fullWidth>
              <FormLabel>Gender</FormLabel>
              <RadioGroup {...field}>
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
              </RadioGroup>
              {errors.sex && (
                <FormHelperText>{errors.sex.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />
      </div>

      <Controller
        name="address"
        control={control}
        rules={{
          required: "Address is required.",
          maxLength: { value: 200, message: "Address cannot exceed 200 characters." },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Address"
            multiline
            rows={3}
            error={!!errors.address}
            helperText={errors.address?.message}
            fullWidth
          />
        )}
      />

      <Typography variant="h6" className="mb-3 underline text-gray-700">
        Contact Information
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Controller
          name="email"
          control={control}
          rules={{ required: "Email is required." }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="phoneNumber"
          control={control}
          rules={{ required: "Phone number is required." }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Phone Number"
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
              fullWidth
            />
          )}
        />
      </div>

      <Typography variant="h6" className="mb-3 underline text-gray-700">
        Company Information
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Controller
          name="companyId"
          control={control}
          rules={{ required: "Please select a company." }}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Company"
              error={!!errors.companyId}
              helperText={errors.companyId?.message}
              fullWidth
            >
              {companies.map((company) => (
                <MenuItem key={company.companyId} value={company.companyId}>
                  {company.name}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      )}

      <div className="flex flex-col gap-2 items-center justify-center pt-2">
        <Button
          type="submit"
          variant="contained"
          className="w-full mt-6"
          sx={{ width: "80%", backgroundColor: "#1f2937" }}
          disabled={isSubmitting}
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
