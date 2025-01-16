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
import EditJobPostRequestPage from "./pages/EditJobPostRequestPage";
import SubmitApplicationJob from "./pages/SubmitApplicationJobPage";
import ApplicationJobPage from "./pages/ApplicationJobPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import EditApplicationJobPage from "./pages/EditApplicationJobPage";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import InterviewPage from "./pages/InterviewPage";
import AdministratorDashboard from "./pages/AdministratorDashboard";
import HRManagerDashboardPage from "./pages/HRManagerDashboard";
import JobPostTemplateRequestFormPage from "./pages/JobPostTemplateRequestFormPage";
import JobPostTemplateRequestPage from "./pages/JobPostTemplateRequestPage";
import JobPostTemplateRequestDetailPage from "./pages/JobPostTemplateRequestDetailPage";
import JobPostTemplateDetailPage from "./pages/JobPostTemplateDetail";
import ReportAdministrator from "./pages/ReportAdministrator";
import ReportHRManager from "./pages/ReportHRManager";

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
        path: "/dashboard/administrator",
        element: <AdministratorDashboard></AdministratorDashboard>,
      },
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
      {
        path: "/report/administrator",
        element: (
          <ReportAdministrator></ReportAdministrator>
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
      {
        path: "/dashboard/HRManager",
        element: <HRManagerDashboardPage></HRManagerDashboardPage>,
      },
      {
        path: "/report/HR_Manager",
        element: <ReportHRManager></ReportHRManager>,
      },

    ],
    errorElement: "Page not found",
  },
  {
    element: (
      <MainLayout allowedRoles={["HR Manager", "Recruiter"]}></MainLayout>
    ),
    children: [
      {
        path: "/job-post-request",
        element: <JobPostRequestPage></JobPostRequestPage>,
      },
      {
        path: "/job-post-template-request",
        element: <JobPostTemplateRequestPage></JobPostTemplateRequestPage>,
      },
      {
        path: "/job-post-template-request/:id",
        element: <JobPostTemplateRequestDetailPage></JobPostTemplateRequestDetailPage>,
      },
      {
        path: "/job-post-request/:id",
        element: <JobPostRequestDetailPage></JobPostRequestDetailPage>,
      },
      {
        path: "/job-post-template/:id",
        element: <JobPostTemplateDetailPage></JobPostTemplateDetailPage>,
      },
    ],
    errorElement: "Page not found",
  },
  {
    element: <MainLayout allowedRoles={["Recruiter"]}></MainLayout>,
    children: [
      {
        path: "/dashboard/recruiter",
        element: <RecruiterDashboard></RecruiterDashboard>,
      },
      {
        path: "/job-post-request/new",
        element: <JobPostRequestFormPage></JobPostRequestFormPage>,
      },
      {
        path: "/job-post-template-request/new",
        element: <JobPostTemplateRequestFormPage></JobPostTemplateRequestFormPage>,
      },
      {
        path: "/edit/job-post-request/:id",
        element: <EditJobPostRequestPage></EditJobPostRequestPage>,
      },
    ],
    errorElement: "Page not found",
  },
  {
    element: <MainLayout allowedRoles={["Applicant"]}></MainLayout>,
    children: [
      {
        path: "/dashboard/applicant",
        element: <ApplicantDashboard></ApplicantDashboard>,
      },
      {
        path: "/document",
        element: <UploadDocumentPage></UploadDocumentPage>,
      },
      {
        path: "/document/new",
        element: <UploadDocumentForm></UploadDocumentForm>,
      },
      {
        path: "/jobpost/application/:jobPostId",
        element: <SubmitApplicationJob></SubmitApplicationJob>,
      },
      {
        path: "/application-job/:processId/edit",
        element: <EditApplicationJobPage></EditApplicationJobPage>,
      },
    ],
    errorElement: "Page not found",
  },
  {
    element: (
      <MainLayout
        allowedRoles={["HR Manager", "Recruiter", "Applicant"]}
      ></MainLayout>
    ),
    children: [
      {
        path: "/application-job",
        element: <ApplicationJobPage></ApplicationJobPage>,
      },
      {
        path: "/application-job/:processId",
        element: <ApplicationDetailPage></ApplicationDetailPage>,
      },
      {
        path: "/interview-schedule",
        element: <InterviewPage></InterviewPage>,
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
