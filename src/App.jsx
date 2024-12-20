import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Layouts
import LoginLayout from "./components/Layouts/LoginLayout";
import MainLayout from "./components/Layouts/MainLayout";

// Pages
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import JobPostDetailPage from "./pages/JobPostDetailPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import UploadDocumentForm from "./pages/UploadDocumentForm";
import UploadDocumentPage from "./pages/UploadDocumentPage";

export const queryClient = new QueryClient();

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: "Landing Page",
  // },
  {
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
      {
        path: "/profile",
        element: <ProfilePage></ProfilePage>,
      },
      {
        path: "/document",
        element: <UploadDocumentPage></UploadDocumentPage>,
      },
      {
        path: "/document/new",
        element: <UploadDocumentForm></UploadDocumentForm>,
      },
    ],
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
        path: "/edit/profile",
        element: <EditProfilePage></EditProfilePage>,
      }
    ],
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
