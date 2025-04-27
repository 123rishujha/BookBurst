import "./App.css";
import { ToastContainer } from "react-toastify";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UserRoutes from "./components/user/UserRoutes";
import { useLayoutEffect } from "react";
import { localStoragekeys } from "./imports/mainExports";
import ProtectedRoute, { PublicOnlyRoute } from "./utils/RoutesValidation";
import { userStateUpdate } from "./redux/user/userSlice";
import PublicBooks from "./components/publicUser/PublicBooks";
import TopRatedBooks from "./components/publicUser/TopRatedBooks";
import Footer from "./components/footer/Footer";
import UserNavbar from "./components/navbar/UserNavbar";
import PublicNavbar from "./components/navbar/PublicNavbar";
import LoginPage from "./pages/login/LoginPage";
import SignUpPage from "./pages/signUp/SignUpPageMain";

function App() {
  const dispatch = useDispatch();
  const { userState } = useSelector((store) => store.user);

  useLayoutEffect(() => {
    let userLocalData = localStorage.getItem(localStoragekeys.userState);
    if (userLocalData) {
      dispatch(userStateUpdate(JSON.parse(userLocalData)));
    }
  }, []);

  return (
    <div>
      {userState?.token ? <UserNavbar /> : <PublicNavbar />}
      <Routes>
        <Route path="/" element={<PublicBooks />} />
        <Route path="/top-rated" element={<TopRatedBooks />} />
        {/* <Route path="/:username" element={<p>username portfolio</p>} /> */}
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <SignUpPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/my-bookshelf/*"
          element={
            <ProtectedRoute>
              <UserRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
