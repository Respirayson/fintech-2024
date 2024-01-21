import React, { createContext, useContext } from "react";
import { ethers } from "ethers";

import {
  SourceBridgeAddress,
  SourceTokenMinterAddress,
  sourceTokenMinterAbi,
} from "../constants/addresses.js";

import { getEthereumContract } from "../utils/connect.js";

export const SourceTokenMinterContext = createContext();

const { ethereum } = window;

export function SourceTokenMinterProvider({ children }) {
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
        console.log("CONTRACT");
        console.log(contract);

        const transaction = await contract.createNewPolicy(
          policyNumber,
          startDate,
          maturityDate,
          name,
          sumAssured
        );
        const receipt = await transaction.wait();
        console.log(
          `1 Token successfully sent - Transation hash : ${receipt.hash}`
        );
        console.log(receipt.logs[1].args);
        console.log(receipt.logs[1].eventName);
        return receipt.logs[1].args

        // const txn = await contract.setApprovalForAll(SourceBridgeAddress, true);
        // await txn.wait();
      } else {
        throw new Error("Ethereum is not present");
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
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

      const transaction = await contract.setApprovalForAll(
        SourceBridgeAddress,
        true
      );
      await transaction.wait();
      console.log(
        `Approved bridge contract to trasfer token - Transaction hash: ${transaction.hash}`
      );
    } else {
      console.log("Ethereum is not present");
      throw new Error("Ethereum is not present");
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
