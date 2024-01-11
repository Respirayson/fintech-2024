import React, { createContext, useContext } from "react";

import {
  SourceBridgeAddress,
  SourceTokenMinterAddress,
  sourceTokenMinterAbi,
} from "../constants/addresses.js";
import { WebContext } from "./WebContext.jsx";

import { getEthereumContract } from "../utils/connect.js";

// Create a context for the Trading Card Minter
export const SourceTokenMinterContext = createContext();

const { ethereum } = window;

/**
 * Component representing the Trading Card Minter provider
 * @param {Object} props - The component props
 * @param {ReactNode} props.children - The children to be rendered inside the provider
 * @returns {JSX.Element} - The JSX element
 */
export function SourceTokenMinterProvider({ children }) {
  const { currentAccount } = useContext(WebContext);
  console.log(currentAccount);

  /**
   * Mint a new insurance policy
   */
  const mintNewPolicyToken = async (
    policyNumber,
    startDate,
    maturityDate,
    name,
    sumAssured
  ) => {
    try {
      if (ethereum) {
        const contract = await getEthereumContract(
          SourceTokenMinterAddress,
          sourceTokenMinterAbi
        );

        console.log(contract)

        const transaction = await contract.createNewPolicy(
          policyNumber,
          startDate,
          maturityDate,
          name,
          sumAssured
        );
        await transaction.wait();

        const txn = await contract.setApprovalForAll(SourceBridgeAddress, true);
        await txn.wait();

        console.log(
          `1 Token successfully sent - Transaction hash: ${transaction.hash}`
        );
      } else {
        console.log("Ethereum is not present");
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Approve the marketplace contract to sell a card
   */
  const approveSourceBridge = async () => {
    if (ethereum) {
      const contract = await getEthereumContract(
        SourceTokenMinterAddress,   
        sourceTokenMinterAbi
      );

      const transaction = await contract.setApprovalForAll(SourceBridgeAddress, true);
      await transaction.wait();
      console.log(
        `Approved bridge contract to trasfer token - Transaction hash: ${transaction.hash}`
      );
    } else {
      console.log("Ethereum is not present");
    }
  };

  return (
    <SourceTokenMinterContext.Provider
      value={{
        mintNewPolicyToken,
        approveSourceBridge,
      }}
    >
      {children}
    </SourceTokenMinterContext.Provider>
  );
}
