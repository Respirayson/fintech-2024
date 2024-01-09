const hre = require("hardhat");

const main = async () => {

    // Deploy source stuff
    const SourceTokenMinter = await hre.ethers.deployContract("SourceTokenMinter");
    await SourceTokenMinter.waitForDeployment();

    console.log("SourceTokenMinter deployed to: ", SourceTokenMinter.target);

    const sourceBridge = await hre.ethers.deployContract("SourceBridge", [SourceTokenMinter.target]);
    await sourceBridge.waitForDeployment();

    console.log("SourceBridge deployed to:", sourceBridge.target);

}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

runMain();