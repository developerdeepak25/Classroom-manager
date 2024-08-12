import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { ReactNode, Suspense } from "react";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => {
    return state.Auth;
  });
  console.log(isAuthenticated);

  return isAuthenticated ? (
    <Suspense fallback={'loading...'}>{children}</Suspense>
  ) : (
    <>
      {console.log("navigating to signin")}
      <Navigate to="/login" />
    </>
  );
};

export default PrivateRoute;
