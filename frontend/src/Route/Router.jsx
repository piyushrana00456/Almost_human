import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../Components/Home/Home";
import { VendorSignUp } from "../Components/Registration/VendorSignUp";
import { DriverSignUp } from "../Components/Registration/DriverSignUp";
import { LoginPage } from "../Pages/LoginPage/LoginPage";
import { PrivateRoute } from "./PrivateRoute";
import { DriverDash } from "../Pages/DriverDashboard/DriverDash";
import { NavContainer } from "../Components/Navbar/NavContainer";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginLoading } from "../Redux/Auth/action";
import { DriverJobs } from "../Pages/DriverDashboard/DriverJob";

export const Router = () => {
  const dispatch = useDispatch();
  // const { auth } = useSelector((state) => state.auth);
  React.useEffect(() => {
    dispatch(loginLoading());
    const data = localStorage.getItem("user");
    if (data !== null) {
      const action = dispatch(loginSuccess(JSON.parse(data)));
      dispatch(action);
    }
  }, []);

  return (
    <div>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/vendorSignUp">
          <NavContainer page="landing" />
          <VendorSignUp />
        </Route>
        <Route path="/driverSignUp">
          <NavContainer page="landing" />
          <DriverSignUp />
        </Route>
        <Route path="/login">
          <NavContainer page="landing" />
          <LoginPage />
        </Route>
        <PrivateRoute path="/driverDash" to="/">
          <DriverDash />
        </PrivateRoute>

        <PrivateRoute path="/driverJobs" to="/">
          <DriverJobs />
        </PrivateRoute>
      </Switch>
    </div>
  );
};
