import {
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/userService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function EditProfilePage(props) {
  const { } = props;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = async () => {
    const response = await UserService.details();
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetchUserProfile(),
    keepPreviousData: true,
    placeholderData: keepPreviousData,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const selectedGender = watch("sex");

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach((key) => {
        setValue(key, data[key]);
      });
    }
  }, [data, setValue]);

  const handleFormSubmit = async (editedProfileData) => {
    try {
      // edit applicant account
      let editedApplicant = { ...editedProfileData, userName: data.userName };
      setLoading(true);
      await UserService.updateProfile(editedApplicant);
      toast.success("Your profile has been updated!");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-10">Error loading profile data.</div>;
  }

  return (
    <div className="mt-10 mb-10 flex items-center justify-center">
      <div className="border rounded shadow-lg p-2">
        <div className="w-full mb-5">
          <span className="text-3xl font-semibold text-gray-700">
            Edit Profile
          </span>
        </div>
        <form autoComplete="off">
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
            <FormControl error={!!errors.sex}>
              <FormLabel id="gender-radio-group-label">Gender</FormLabel>
              <RadioGroup
                aria-labelledby="gender-radio-buttons-group-label"
                name="sex"
                value={selectedGender || ""}
                onChange={(e) => setValue("sex", e.target.value)}
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
              {loading ? "Updating Your Profile..." : "Edit Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfilePage;
