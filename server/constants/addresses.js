import { createRequire } from "module";
const require = createRequire(import.meta.url);

const destMinter = require("./DestinationTokenMinter.json");
const srcMinter = require("./SourceTokenMinter.json");
const srcBridge = require("./SourceBridge.json");
const destBridge = require("./DestinationBridge.json");
const destMarketplace = require("./DestinationChainMarketplace.json");

const SourceTokenMinterAddress = "0x7aD6A4C8E5d8c180A452415a0495EdC2b1226C80";
const SourceBridgeAddress = "0xd5A29E0dabC5fd265AFA409A992336Ff2F4add50";

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
