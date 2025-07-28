import { useAuth0 } from "@auth0/auth0-react";
import ProfilePage from "./pages/Profile";

function App() {
  const {
    loginWithRedirect,
    isAuthenticated,
    isLoading,
    user,
  } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="login-container">
      {!isAuthenticated ? (
        <>
          <h1>Welcome to the App</h1>
          <button onClick={() => loginWithRedirect()}>Login</button>
        </>
      ) : (
        <>
          <div>
            <h2>Hello, {user?.name || "User"}</h2>
            <p>You are successfully logged in.</p>
          </div>
          <div>
            <ProfilePage />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
