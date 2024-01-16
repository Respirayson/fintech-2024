import React, { createContext } from "react";

import {
  DestinationBridgeAddress,
  destinationBridgeAbi,
} from "../constants/addresses.js";

import { getEthereumContract } from "../utils/connect.js";

export const DestBridgeContext = createContext();

const { ethereum } = window;

export function DestBridgeProvider({ children }) {
  /**
   * Bridging protocol back to sepolia
   */
  const bridgeToken = async (tokenId) => {
    try {
      if (ethereum) {
        const contract = await getEthereumContract(
          DestinationBridgeAddress,
          destinationBridgeAbi
        );

        const transaction = await contract.burnToken(tokenId);
        const receipt = await transaction.wait();
        console.log(
          `1 Token successfully burned - Transation hash : ${receipt.hash}`
        );
      } else {
        throw new Error("Ethereum is not present");
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  return (
    <DestBridgeContext.Provider
      value={{
        bridgeToken,
      }}
    >
      {children}
    </DestBridgeContext.Provider>
  );
}
