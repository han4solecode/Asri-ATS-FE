import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";

import LoginLayout from "./components/Layouts/LoginLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: "Landing Page",
  },
  {
    element: <LoginLayout></LoginLayout>,
    children: [
      {
        path: "/register",
        element: "Registration Page",
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  );
}

export default App;
