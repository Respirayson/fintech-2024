import { useState } from "react";
import Routers from "../../routes/Routers";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";

const Layout = () => {
  const [authenticated, setAuthenticated] = useState(false);

  const navigate = useNavigate();

  /**
   * Checks if the user is authenticated by verifying the token with the server.
   * @returns {boolean} - Returns true if the user is authenticated, false otherwise.
   */
  const checkAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:8000/api/v1/auth/verify", {
        body: JSON.stringify({ token }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })
        .catch((errors) => {
          console.warn(errors);
        })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setAuthenticated(false);
          } else {
            setAuthenticated(true);
          }
        });
    }
    return authenticated;
  };

  /**
   * Handles user login by setting the authentication status and saving the token to localStorage.
   * @param {string} token - The authentication token.
   */
  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setAuthenticated(true);
  };

  /**
   * Handles user logout by removing the token from
   * localStorage and resetting the authentication status.
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <Header checkAuthenticated={checkAuthenticated} handleLogout={handleLogout} />
      <div>
        <Routers onLoggedIn={handleLogin} />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
