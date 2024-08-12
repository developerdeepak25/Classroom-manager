import { Navigate } from "react-router-dom";
import { ReactNode, Suspense } from "react";
import { useAppSelector } from "@/store/hooks";
// import FallBack from "../Fallback/FallBack";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => {
    return state.Auth;
  });
  console.log(isAuthenticated);

  return !isAuthenticated ? (
    <Suspense fallback={'loading....'}>{children}</Suspense>
  ) : (
    <>
      {console.log("herer")}
      <Navigate to="/" />
    </>
  );
};

export default PublicRoute;
