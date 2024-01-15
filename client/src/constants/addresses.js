import destMinter from "./DestinationTokenMinter.json" assert { type: "json" };
import srcMinter from "./SourceTokenMinter.json" assert { type: "json" };
import srcBridge from "./SourceBridge.json" assert { type: "json" };
import destBridge from "./DestinationBridge.json" assert { type: "json" };
import destMarketplace from "./DestinationChainMarketplace.json" assert { type: "json" };

const SourceTokenMinterAddress = "0xc167c047dE102b5184681602a7A62e6f22Ef592D";
const SourceBridgeAddress = "0x2983b7ee6695036f496cE91919460B0E6D039713";

const DestinationBridgeAddress = "0xFBCe9EA0B19e9651488Cc372eD3F4C2Ab57FE797";
const DestinationTokenMinterAddress =
  "0x262b0e781134251B2c6eCD35Be49B7b71d63Fdc9";
const DestinationChainMarketplaceAddress =
  "0x908b9b4766636bb59Af5e4B8f9faFAcd1F3c7d44";

const destinationTokenMinterAbi = destMinter.abi;
const sourceTokenMinterAbi = srcMinter.abi;
const sourceBridgeAbi = srcBridge.abi;
const destinationBridgeAbi = destBridge.abi;
const destinationMarketplaceAbi = destMarketplace.abi;

export {
  SourceTokenMinterAddress,
  SourceBridgeAddress,
  DestinationBridgeAddress,
  DestinationTokenMinterAddress,
  DestinationChainMarketplaceAddress,
  destinationTokenMinterAbi,
  sourceTokenMinterAbi,
  sourceBridgeAbi,
  destinationBridgeAbi,
  destinationMarketplaceAbi,
};
