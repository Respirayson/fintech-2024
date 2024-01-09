import React, { useState, useEffect, createContext } from 'react';
import { ethers } from 'ethers';

// Create a context for the Web Provider
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
  const [alertMessage, setAlertMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const [currentAccount, setCurrentAccount] = useState(null);
  const [ethBalance, setEthBalance] = useState(0);

  /**
   * Check if the wallet is connected and set the current account
   */
  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) {
        setAlertMessage('Make sure you have metamask!');
        setShowAlert(true);
        setSuccess(false);
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const account = accounts[0];
        const balance = await provider.getBalance(accounts[0]);
        setEthBalance(parseFloat(ethers.utils.formatEther(balance)).toFixed(3));
        setCurrentAccount(account);
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
  }, []);

  /**
   * Close the alert after a specified time interval
   */
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
        setAlertMessage('');
        setSuccess(false);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <WebContext.Provider
      value={{
        showAlert,
        setShowAlert,
        alertMessage,
        setAlertMessage,
        success,
        setSuccess,
        currentAccount,
        ethBalance,
      }}
    >
      {children}
    </WebContext.Provider>
  );
}
