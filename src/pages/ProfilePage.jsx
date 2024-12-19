import { Button, CircularProgress, Divider, Typography } from "@mui/material";
import UserService from "../services/userService";
import { useQuery } from "@tanstack/react-query";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const fetchUserProfile = async () => {
    const response = await UserService.details();
    return response.data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => fetchUserProfile(),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <CircularProgress />
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-10">Error loading profile.</div>;
  }

  const {
    userId,
    userName,
    email,
    phoneNumber,
    firstName,
    lastName,
    address,
    dob,
    sex,
    roles,
  } = data;

  return (
    <>
      <div className="flex items-center justify-center my-6 mx-6 md:mx-0">
        <div className="w-full md:w-4/5 bg-white rounded-2xl shadow-lg border-4 border-gray-200 p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <PersonIcon sx={{ fontSize: 96 }} className="text-gray-700" />
            <div className="ml-6">
              <Typography variant="h5" className="font-semibold text-gray-800">
                {`${firstName} ${lastName}`}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {roles[0]}
              </Typography>
              <div className="mt-4">
                <Button onClick={()=> navigate("/edit/profile")} variant="contained" color="primary" size="small">
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Spacer before Divider */}
          <Divider sx={{ mt: 3, mb: 2 }} />

          {/* Contact Information */}
          <div className="mb-6">
            <Typography
              variant="h6"
              className="font-semibold text-gray-800 mb-4"
            >
              Contact Information
            </Typography>
            <div className="space-y-2">
              <Typography variant="body1" className="text-gray-700">
                Email: <span className="font-semibold">{email}</span>
              </Typography>
              <Typography variant="body1" className="text-gray-700">
                Phone: <span className="font-semibold">{phoneNumber}</span>
              </Typography>
              <Typography variant="body1" className="text-gray-700">
                Address: <span className="font-semibold">{address}</span>
              </Typography>
            </div>
          </div>

          {/* Personal Details */}
          <div className="mb-6">
            <Typography
              variant="h6"
              className="font-semibold text-gray-800 mb-4"
            >
              Personal Details
            </Typography>
            <div className="space-y-2">
              <Typography variant="body1" className="text-gray-700">
                Date of Birth: <span className="font-semibold">{dob}</span>
              </Typography>
              <Typography variant="body1" className="text-gray-700">
                Sex: <span className="font-semibold">{sex}</span>
              </Typography>
            </div>
          </div>

          {/* Account Details */}
          <div className="mb-6">
            <Typography
              variant="h6"
              className="font-semibold text-gray-800 mb-4"
            >
              Account Details
            </Typography>
            <div className="space-y-2">
              <Typography variant="body1" className="text-gray-700">
                Username: <span className="font-semibold">{userName}</span>
              </Typography>
              <Typography variant="body1" className="text-gray-700">
                User ID: <span className="font-semibold">{userId}</span>
              </Typography>
            </div>
          </div>

          {/* Roles */}
          <div>
            <Typography
              variant="h6"
              className="font-semibold text-gray-800 mb-4"
            >
              Roles
            </Typography>
            <ul className="list-disc list-inside text-gray-700">
              <li>{roles[0]}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
