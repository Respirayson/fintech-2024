const hre = require("hardhat");

const main = async () => {
  // Deploy Destination Stuff
  const destinationBridge = await hre.ethers.deployContract(
    "DestinationBridge"
  );
  await destinationBridge.waitForDeployment();

  console.log("DestinationBridge deployed to:", destinationBridge.target);

  const destinationTokenMinter = await hre.ethers.deployContract(
    "DestinationTokenMinter", [destinationBridge.target]
  );
  await destinationTokenMinter.waitForDeployment();

  console.log(
    "DestinationTokenMinter deployed to:",
    destinationTokenMinter.target
  );

  const destinationChainMarketplace = await hre.ethers.deployContract(
    "DestinationChainMarketplace"
  );
  await destinationChainMarketplace.waitForDeployment();

  console.log(
    "DestinationChainMarketplace deployed to:",
    destinationChainMarketplace.target
  );
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    console.log(error);
    process.exit(1);
  }
};

runMain();
