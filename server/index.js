import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";
import mountRoutes from "./routes/index.js";

import { ethers } from "ethers";
import {
  polygonNode,
  sepoliaNode,
} from "../client/src/constants/providerEndpoints.js";
import {
  DestinationBridgeAddress,
  DestinationTokenMinterAddress,
  SourceBridgeAddress,
  SourceTokenMinterAddress,
  destinationBridgeAbi,
  destinationTokenMinterAbi,
  sourceBridgeAbi,
  sourceTokenMinterAbi,
} from "../client/src/constants/addresses.js";
import User from "./mongodb/models/user.js";
import Policy from "./mongodb/models/policy.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mountRoutes(app);

app.get("/", (req, res) => {
  res.send("Hello World! Checking whether it works or not");
});

// Get All Existing Users (FOR TESTING)
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// Delete Exisiting User
app.delete('/users', async (req, res) => {
  try {
    const { username } = req.body.username;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }    
    await User.deleteOne({ username });
    res.status(200).json({ message: 'User deleted successfully', user});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get All Existing Users (FOR TESTING)
app.get('/policy', async (req, res) => {
  try {
    const users = await Policy.find();
    res.json(users);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Add Policy
app.post('/policy', async (req, res) => {
  try {
    console.log(req.body);
    const { publicAddress, issuerName, policyName, policyType, premium, startDate, maturityDate, description } = req.body;
    const newPolicy = new Policy({ publicAddress, issuerName, policyName, policyType, premium, startDate, maturityDate, description });
    await newPolicy.save()
    res.status(200).json({ message: "Successfully added policy"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

// Delete Policy
app.delete('/policy', async (req, res) => {
  try {
    const policy = await Policy.findOne(req.body);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    await Policy.deleteOne({ policy });
    res.status(200).json({ message: 'Policy deleted successfully', policy});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


export const startServer = async () => {
  try {
    connectDB(process.env.ATLAS_URL);

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });

    // DESTINATION STUFF

    const polygonProvider = new ethers.WebSocketProvider(polygonNode);
    let wallet = new ethers.Wallet(process.env.PRIVATE_KEY, polygonProvider);

    let contract = new ethers.Contract(
      DestinationTokenMinterAddress,
      destinationTokenMinterAbi,
      polygonProvider
    );

    let destBridge = new ethers.Contract(
      DestinationBridgeAddress,
      destinationBridgeAbi,
      wallet
    );

    // SOURCE STUFF

    const sepoliaProvider = new ethers.WebSocketProvider(sepoliaNode);
    let sepoliaWallet = new ethers.Wallet(
      process.env.PRIVATE_KEY,
      sepoliaProvider
    );
    let sepoliaContract = new ethers.Contract(
      SourceTokenMinterAddress,
      sourceTokenMinterAbi,
      sepoliaProvider
    );

    let srcBridge = new ethers.Contract(
      SourceBridgeAddress,
      sourceBridgeAbi,
      sepoliaWallet
    );

    let data = await contract.name();
    console.log("Polygon Contract Name: ", data);

    let sepoliaData = await sepoliaContract.name();
    console.log("Sepolia contract Name: ", sepoliaData);

    srcBridge.on("Transfer", async (from, to, tokenId, date, nonce) => {
      // bridgeToken is called on srcBridge
      console.log("Transfer event: ", from, to, tokenId, date, nonce);
      console.log(tokenId.toString());

      let policyDetails = await sepoliaContract.viewPolicy(
        parseFloat(tokenId.toString())
      );

      let tx = await destBridge.mirrorToken(
        policyDetails[1],
        policyDetails[2],
        policyDetails[3],
        policyDetails[4],
        to,
        tokenId
      );
      tx.wait(2).then(() => {
        console.log("receipt: ", tx.hash);
      });
    });

    destBridge.on("Burn", async (tokenId, owner) => {
      // burnToken is called on destBridge
      console.log("Burn event: ", tokenId, owner);

      let tx = await srcBridge.withdraw(owner, tokenId);
      tx.wait(2).then(() => {
        console.log("receipt: ", tx.hash);
      });
    });
    
  } catch (error) {
    console.log(error);
  }
};
