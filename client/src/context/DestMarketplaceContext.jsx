import React, { createContext, useContext } from "react";

import {
  DestinationChainMarketplaceAddress,
  destinationMarketplaceAbi,
  DestinationTokenMinterAddress,
} from "../constants/addresses.js";
import { WebContext } from "./WebContext.jsx";

import { getEthereumContract } from "../utils/connect.js";

import axios from "axios";

// Create a context for the Trading Card Minter
export const DestMarketplaceContext = createContext();

const { ethereum } = window;

/**
 * Component representing the Trading Card Minter provider
 * @param {Object} props - The component props
 * @param {ReactNode} props.children - The children to be rendered inside the provider
 * @returns {JSX.Element} - The JSX element
 */
export function DestMarketplaceProvider({ children }) {
  const { currentAccount } = useContext(WebContext);
  console.log(currentAccount);

  /**
   * Add a listing for an NFT
   * @param {Object} collectible - The NFT collectible object
   * @param {number} price - The price of the NFT
   */
  const addListing = async (collectible, price) => {
    if (ethereum) {
      const contract = await getEthereumContract(
        DestinationChainMarketplaceAddress,
        destinationMarketplaceAbi
      );
      const transaction = await contract.listItem(
        DestinationTokenMinterAddress,
        collectible.tokenId,
        price.toString()
      );
      await transaction.wait();
      console.log(
        `Successfully listed NFT with id ${collectible.tokenId} for ${price} ETH`
      );

      // UPDATE THE DB WITH THE LISTINGS
      // axios.post();

      console.log("Successfully listed NFT");
    } else {
      console.log("Ethereum is not present");
    }
  };

  /**
   * Buy an NFT
   * @param {string} listingId - The ID of the NFT listing
   * @param {string} tokenId - The ID of the NFT token
   */
  const buyItem = async (listingId, tokenId) => {
    if (ethereum) {
      const contract = getEthereumContract(DestinationChainMarketplaceAddress, destinationMarketplaceAbi);
      const listing = await contract.getListing(DestinationTokenMinterAddress, tokenId);
      const transaction = await contract.buyItem(DestinationTokenMinterAddress, tokenId, {
        value: listing.price,
      });
      await transaction.wait();
      console.log(`Successfully bought NFT with id ${tokenId}`);
      
      // UPDATE THE DB 
      // axios.delete();

      console.log("Successfully deleted listing");
    }
  };

  /**
   * Get the proceeds from the NFT marketplace
   * @returns {number} - The proceeds in ETH
   */
  const getProceeds = async () => {
    if (ethereum) {
      const contract = getEthereumContract(DestinationChainMarketplaceAddress, destinationMarketplaceAbi);
      const transaction = await contract.getProceeds(currentAccount);
      return transaction; // in MATIC so no need to convert
    }
    return 0;
  };

  /**
   * Withdraw the proceeds from the NFT marketplace
   */
  const withdrawProceeds = async () => {
    if (ethereum) {
      const contract = getEthereumContract(DestinationChainMarketplaceAddress, destinationMarketplaceAbi);
      const transaction = await contract.withdrawProceeds();
      await transaction.wait();
      console.log("Successfully withdrew proceeds");
    }
  };

  return (
    <DestMarketplaceContext.Provider
      value={{
        addListing,
        buyItem,
        getProceeds,
        withdrawProceeds,
      }}
    >
      {children}
    </DestMarketplaceContext.Provider>
  );
}
