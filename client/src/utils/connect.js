import { ethers } from 'ethers';

/**
 * Connects the wallet using MetaMask
 * @returns {Promise<string>} - The connected account address
 */
const connectWallet = async () => {
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });
  return accounts[0];
};

/**
 * Checks if the wallet is currently connected using MetaMask
 * @returns {Promise<string>} - The connected account address, or an empty string if not connected
 */
const checkWalletConnected = async () => {
  // Check if MetaMask is installed
  if (!window.ethereum) {
    return undefined;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log(`Connected: ${account}`);
      return account;
    }
    console.log('Not connected');
    return '';
  } catch (err) {
    console.log(err);
  }
};

const getEthereumContract = (address, abi) => {
  if (!window.ethereum) {
    return undefined;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(address, abi, signer);

  console.log({
    provider,
    signer,
    contract,
  });

  return contract;
};

export { connectWallet, checkWalletConnected, getEthereumContract };
