import React, { useState, useEffect, createContext } from 'react';
import { ethers } from 'ethers';
import Swal from 'sweetalert2';

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
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isRedirect, setIsRedirect] = useState(false);
  const [autoredirect, setAutoredirect] = useState('');
  const [success, setSuccess] = useState(false);

  const [currentAccount, setCurrentAccount] = useState(null);
  const [ethBalance, setEthBalance] = useState(0);

  /**
   * Check if the wallet is connected and set the current account
   */
  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) {
        setAlertIcon('error');
        setAlertTitle('MetaMask Required');
        setAlertMessage('Please ensure that you have MetaMask installed!');
        setShowAlert(true);
        setSuccess(false);
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length) {
        const provider = new ethers.BrowserProvider(ethereum);
        const account = accounts[0];
        const balance = await provider.getBalance(accounts[0]);
        setEthBalance(parseFloat(ethers.utils.formatEther(balance)).toFixed(3));
        setCurrentAccount(account);
        console.log(account)
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
        setAlertIcon(null);
        setAlertTitle('');
        setShowAlert(false);
        Swal.close();
        setAlertMessage('');
        setSuccess(false);
        if (isRedirect) {
          setTimeout(() => {
            window.open(autoredirect, "_blank");
            setAutoredirect('');
            setIsRedirect(false);
          }, 3000)
        }
      }, 3500);

      return () => {
        Swal.fire({
          icon: alertIcon,
          title: alertTitle,
          html: alertMessage.replace(/\n/g, '<br>'),
          showConfirmButton: false,
          timer: 3500
        })
        clearTimeout(timer);
      }
    } 
  }, [showAlert, isRedirect, alertIcon, alertTitle, alertMessage, autoredirect]);

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
      }}
    >
      {children}
    </WebContext.Provider>
  );
}
