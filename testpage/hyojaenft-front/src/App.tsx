import { Home } from "./pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Mypage } from "./pages/Mypage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/mypage",
    element: <Mypage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
