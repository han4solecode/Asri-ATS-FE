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
import { Controller, useForm } from "react-hook-form";

function RegisterCompanyPage(props) {
  const { } = props;
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (data) => {
    setIsLoading(true);
    CompanyService.registerCompanyRequest(data)
      .then((res) => {
        alert(res.data.message);
        reset();
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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
              {...register("companyName", {
                required: "Company name is required",
                maxLength: {
                  value: 50,
                  message: "Company name cannot exceed 50 characters"
                }
              })}
              error={!!errors.companyName}
              helperText={errors.companyName?.message}
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
              {...register("companyAddress", {
                required: "Company address is required",
                maxLength: {
                  value: 200,
                  message: "Company address cannot exceed 200 characters"
                }
              })}
              error={!!errors.companyAddress}
              helperText={errors.companyAddress?.message}
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
              {...register("firstName", {
                required: "First name is required",
                maxLength: {
                  value: 50,
                  message: "First name cannot exceed 50 characters"
                }
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            ></TextField>
            <TextField
              label="Last Name"
              name="lastName"
              fullWidth
              size="large"
              {...register("lastName", {
                required: "Last name is required",
                maxLength: {
                  value: 50,
                  message: "Last name cannot exceed 50 characters"
                }
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            ></TextField>
            <TextField
              label="Email Address"
              name="email"
              fullWidth
              size="large"
              placeholder="email@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Email is not valid"
                }
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            ></TextField>
            <TextField
              label="Phone Number"
              name="phoneNumber"
              fullWidth
              size="large"
              placeholder="08XXXXXXXX"
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^(0)8[1-9][0-9]{6,9}$/,
                  message: "Phone number is not valid"
                }
              })}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
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
              {...register("userAddress", {
                required: "Home address is required",
                maxLength: {
                  value: 200,
                  message: "Home address cannot exceed 200 characters"
                }
              })}
              error={!!errors.userAddress}
              helperText={errors.userAddress?.message}
            ></TextField>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <TextField
              label="Date of Birth"
              name="dob"
              fullWidth
              size="large"
              type="date"
              {...register("dob", {
                required: "Date of birth is required",
                validate: {
                  isValidDate: (value) => {
                    const currentDate = new Date().toISOString().slice(0, 10);
                    return value < currentDate || "Date of birth is not valid";
                  }
                }
              })}
              error={!!errors.dob}
              helperText={errors.dob?.message}
            ></TextField>
            <FormControl error={!!errors.sex}>
              <FormLabel id="gender-radio-group-label">Gender</FormLabel>
              <Controller
                name="sex"
                control={control} // Menyambungkan control dari useForm
                rules={{ required: "Gender is required" }} // Menambahkan validasi
                defaultValue="" // Menetapkan nilai default untuk RadioGroup
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    aria-labelledby="gender-radio-buttons-group-label"
                    sx={{ color: "#374151" }}
                  >
                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                  </RadioGroup>
                )}
              />
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
              {isLoading ? "Submiting Registration Request..." : "Register"}
            </Button>
            <div className="text-center">
              <span className="text-sm text-gray-700">
                Already Have an Account?{" "}
                <Link to="/login" className="text-blue-700 hover:underline">
                  Log In
                </Link>
              </span>{" "}
              |{" "}
              <span className="text-sm text-gray-700">
                Register as a Recruiter Instead?{" "}
                <Link
                  to="/register-company/recruiter-request/new"
                  className="text-blue-700 hover:underline"
                >
                  Go Here
                </Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterCompanyPage;
