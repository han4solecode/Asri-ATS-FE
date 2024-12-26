import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Layouts
import LoginLayout from "./components/Layouts/LoginLayout";
import MainLayout from "./components/Layouts/MainLayout";

// Pages
import RegisterPage from "./pages/RegisterPage";
import RegisterCompanyPage from "./pages/RegisterCompanyPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import JobPostDetailPage from "./pages/JobPostDetailPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import UploadDocumentForm from "./pages/UploadDocumentForm";
import UploadDocumentPage from "./pages/UploadDocumentPage";
import RecruiterRequestPage from "./pages/RecruiterRequestPage";
import RecruiterRequestDetailPage from "./pages/RecruiterRequestDetailPage";
import RecruiterRegistrationPage from "./pages/RecruiterRegistrationPage";
import CompanyRegistrationRequestsPage from "./pages/CompanyRegistrationRequestsPage";
import CompanyRegistrationRequestReviewPage from "./pages/CompanyRegistrationRequestReviewPage";
import JobPostRequestFormPage from "./pages/JobPostRequestFormPage";
import JobPostRequestPage from "./pages/JobPostRequestPage";
import JobPostRequestDetailPage from "./pages/JobPostRequestDetail";

export const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: (
      <MainLayout
        allowedRoles={["Applicant", "Recruiter", "HR Manager", "Administrator"]}
      ></MainLayout>
    ),
    children: [
      {
        path: "/profile",
        element: <ProfilePage></ProfilePage>,
      },
      {
        path: "/edit/profile",
        element: <EditProfilePage></EditProfilePage>,
      },
    ],
    errorElement: "Page not found",
  },
  {
    element: <MainLayout allowedRoles={["Administrator"]}></MainLayout>,
    children: [
      {
        path: "/requests/company-registration",
        element: (
          <CompanyRegistrationRequestsPage></CompanyRegistrationRequestsPage>
        ),
      },
      {
        path: "/requests/company-registration/review/:id",
        element: (
          <CompanyRegistrationRequestReviewPage></CompanyRegistrationRequestReviewPage>
        ),
      },
    ],
  },
  {
    element: <MainLayout allowedRoles={["HR Manager"]}></MainLayout>,
    children: [
      {
        path: "/recruiter-request",
        element: <RecruiterRequestPage></RecruiterRequestPage>,
      },
      {
        path: "/recruiter-request/:id",
        element: <RecruiterRequestDetailPage></RecruiterRequestDetailPage>,
      },
    ],
    errorElement: "Page not found",
  },
  {
    element: <MainLayout allowedRoles={["HR Manager","Recruiter"]}></MainLayout>,
    children: [
      {
        path: "/job-post-request",
        element: <JobPostRequestPage></JobPostRequestPage>,
      },
      {
        path: "/job-post-request/:id",
        element: <JobPostRequestDetailPage></JobPostRequestDetailPage>,
      },
    ],
    errorElement: "Page not found",
  },
  {
    element: (
      <MainLayout
        allowedRoles={["Recruiter"]}
      ></MainLayout>
    ),
    children: [
      {
        path: "/job-post-request/new",
        element: <JobPostRequestFormPage></JobPostRequestFormPage>,
      },
    ],
    errorElement: "Page not found",
  },
  {
    element: <MainLayout allowedRoles={["Applicant"]}></MainLayout>,
    children: [
      {
        path: "/document",
        element: <UploadDocumentPage></UploadDocumentPage>,
      },
      {
        path: "/document/new",
        element: <UploadDocumentForm></UploadDocumentForm>,
      },
    ],
    errorElement: "Page not found",
  },
  {
    element: <LoginLayout></LoginLayout>,
    children: [
      {
        path: "/register",
        element: <RegisterPage></RegisterPage>,
      },
      {
        path: "/login",
        element: <LoginPage></LoginPage>,
      },
      {
        path: "/register-company",
        element: <RegisterCompanyPage></RegisterCompanyPage>,
      },
      {
        path: "/register-company/recruiter-request/new",
        element: <RecruiterRegistrationPage></RecruiterRegistrationPage>,
      },
      {
        path: "/unauthorized",
        element: "You are unauthorized to access this page",
      },
    ],
    errorElement: "Page not found",
  },
  {
    path: "",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <HomePage></HomePage>,
      },
      {
        path: "/jobpost/:jobPostId",
        element: <JobPostDetailPage></JobPostDetailPage>,
      },
    ],
    errorElement: "Page not found",
  },
]);

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}></RouterProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
