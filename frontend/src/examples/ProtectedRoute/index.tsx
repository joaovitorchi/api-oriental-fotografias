import { JSXElementConstructor, ReactElement } from "react";
import { Navigate } from "react-router-dom";
// import SignInIllustration from "layouts/authentication/sign-in/illustration";

interface Props {
  isAuthenticated: boolean;
  redirectPath?: string;
  children: ReactElement<any, string | JSXElementConstructor<any>>;
}

const ProtectedRoute = ({
  isAuthenticated,
  redirectPath = "/auth/login",
  children,
}: Props): JSX.Element => {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
