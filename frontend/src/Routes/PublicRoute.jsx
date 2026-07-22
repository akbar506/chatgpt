import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { refreshAccessToken } from "@/api/refreshAccessToken";
import { updateAccessToken, clearAccessToken } from "@/store/auth/authSlice";
import { loadUser, removeUser } from "@/store/user/userSlice";
import { Loader } from "lucide-react";

export default function PublicRoute() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // On component mount, attempt to restore the user's session by refreshing the access token. If successful, update the Redux store with the new access token and user information. If unsuccessful, clear the access token and remove the user from the store. Finally, set checkingAuth to false to indicate that the authentication check is complete.
  useEffect(() => {
    async function checkSession() {
      try {
        const { accessToken, user } = await refreshAccessToken();

        dispatch(updateAccessToken(accessToken));
        dispatch(loadUser(user));
      } catch {
        dispatch(clearAccessToken());
        dispatch(removeUser());
      } finally {
        setCheckingAuth(false);
      }
    }

    checkSession();
  }, [dispatch]);

  if (checkingAuth) {
    return <div className="min-h-screen grid place-items-center"><Loader className="animate-spin" /></div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}