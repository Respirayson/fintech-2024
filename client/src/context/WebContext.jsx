import React, { useState, useEffect, createContext } from "react";
import { ethers } from "ethers";
import Swal from "sweetalert2";
import axios from "axios";

// Create a context   for the Web Provider
export const WebContext = createContext();

const { ethereum } = window;

/**
 * Component representing the Web Provider
 * @param {Object} props - The component props
 * @param {ReactNode} props.children - The children to be rendered inside the provider
 * @returns {JSX.Element} - The JSX element
 */
export function WebProvider({ children }) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertIcon, setAlertIcon] = useState(null);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isRedirect, setIsRedirect] = useState(false);
  const [autoredirect, setAutoredirect] = useState("");
  const [success, setSuccess] = useState(false);

  const [currentAccount, setCurrentAccount] = useState(null);
  const [ethBalance, setEthBalance] = useState("");

  const [authenticated, setAuthenticated] = useState(false);
  const [accountType, setAccountType] = useState("");

  /**
   * Checks if the user is authenticated by verifying the token with the server.
   * @returns {boolean} - Returns true if the user is authenticated, false otherwise.
   */
  const checkAuthenticated = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/auth/verify",
          { token },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;
        if (data.error) {
          setAuthenticated(false);
        } else {
          setAuthenticated(true);
        }
      } catch (error) {
        console.warn(error);
      }
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
  };

  /**
   * Returns the correct token symbol based on the chain ID
   */
  const getCorrectTokenSymbol = (chainID) => {
    console.log(`Chain ID : ${chainID}`);
    if (chainID == 0x1) {
      return "ETH";
    } else if (chainID == 0x13881) {
      return "MATIC";
    } else {
      return "UNKNOWN";
    }
  };

  /**
   * Check if the wallet is connected and set the current account
   */
  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) {
        setAlertIcon("error");
        setAlertTitle("MetaMask Required");
        setAlertMessage("Please ensure that you have MetaMask installed!");
        setShowAlert(true);
        setSuccess(false);
        return;
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        const provider = new ethers.BrowserProvider(ethereum);
        const account = accounts[0];
        const balance = await provider.getBalance(accounts[0]);
        setEthBalance(parseFloat(ethers.formatEther(balance)).toFixed(3) + " " + getCorrectTokenSymbol(ethereum.chainId));
        setCurrentAccount(account);
        console.log(`Public Address : ${account}`);
      } else {
        // No account connected
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Check if the wallet is connected on component mount
  useEffect(() => {
    checkIfWalletIsConnected();
    window?.ethereum?.on("chainChanged", checkIfWalletIsConnected);
  }, []);

  // Get account type
  useEffect(() => {
    async function fetchAccountType() {
      const response = await axios.get(
        "http://localhost:8000/agent",
         {
          params: {
            publicAddress: currentAccount
          }
        }
      );
      if (response.data.message === "VALID") {
        console.log("Account Type : Agent")
        setAccountType("Agent");
      } else if (response.data.message === "INVALID") {
        console.log("Account Type : General");
        setAccountType("General");
      } else {
        setAccountType("Error");
        console.log("Error");
      }
    }
    fetchAccountType();
  }, [currentAccount])

  /**
   * Close the alert after a specified time interval
   */
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setAlertIcon(null);
        setAlertTitle("");
        setShowAlert(false);
        Swal.close();
        setAlertMessage("");
        setSuccess(false);
        if (isRedirect) {
          setTimeout(() => {
            window.open(autoredirect, "_blank");
            setAutoredirect("");
            setIsRedirect(false);
          }, 3000);
        }
      }, 3500);

      return () => {
        Swal.fire({
          icon: alertIcon,
          title: alertTitle,
          html: alertMessage.replace(/\n/g, "<br>"),
          showConfirmButton: false,
          timer: 3500,
        });
        clearTimeout(timer);
      };
    }
  }, [
    showAlert,
    isRedirect,
    alertIcon,
    alertTitle,
    alertMessage,
    autoredirect,
  ]);

  return (
    <WebContext.Provider
      value={{
        showAlert,
        setShowAlert,
        alertIcon,
        setAlertIcon,
        alertTitle,
        setAlertTitle,
        alertMessage,
        setAlertMessage,
        autoredirect,
        setAutoredirect,
        isRedirect,
        setIsRedirect,
        success,
        setSuccess,
        currentAccount,
        ethBalance,
        accountType,
        checkAuthenticated,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </WebContext.Provider>
  );
}
