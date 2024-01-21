import React, { createContext, useContext } from "react";

import {
  SourceBridgeAddress,
  sourceBridgeAbi,
} from "../constants/addresses.js";
import { WebContext } from "./WebContext.jsx";

import { getEthereumContract } from "../utils/connect.js";

export const SourceBridgeContext = createContext();

const { ethereum } = window;

export function SourceBridgeProvider({ children }) {
  const { currentAccount } = useContext(WebContext);

  /**
   * Bridging protocol to polygon
   */
  const bridgeToken = async (tokenId) => {
    try {
      if (ethereum) {
        const contract = await getEthereumContract(
          SourceBridgeAddress,
          sourceBridgeAbi
        );

        const transaction = await contract.bridgeToken(currentAccount, tokenId);
        const receipt = await transaction.wait();
        console.log(
          `1 Token successfully bridged - Transation hash : ${receipt.hash}`
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
    <SourceBridgeContext.Provider
      value={{
        bridgeToken,
      }}
    >
      {children}
    </SourceBridgeContext.Provider>
  );
}
