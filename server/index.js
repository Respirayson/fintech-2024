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
} from "./constants/addresses.js";
import User from "./mongodb/models/user.js";
import Policy from "./mongodb/models/policy.js";
import ListedPolicy from "./mongodb/models/listedpolicy.js";
import Agent from "./mongodb/models/agent.js";
import UserPolicy from "./mongodb/models/userpolicies.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mountRoutes(app);

app.get("/", (req, res) => {
  res.send("Hello World! Checking whether it works or not");
});

/**
 * API for Users
 */

// GET all users
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

// DELETE user
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

/**
 * API for Agent
 */

// CHECK if agent's public address is valid
app.get('/agent', async (req, res) => {
  try {
    const { publicAddress } = req.query;
    if (!publicAddress) {
      return res.status(200).json({ 
        message: 'NOT LOGGED IN'
      });
    }
    const existingAgent = await Agent.findOne({ publicAddress });
    if (existingAgent) {
      return res.status(200).json({ 
        message: 'VALID',
        publicAddress: publicAddress
      });
    }
    return res.status(200).json({ 
      message: 'INVALID',
      publicAddress: publicAddress
  });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST new verified agent
app.post('/agent', async (req, res) => {
  try {
    const { publicAddress } = req.body;
    const existingAgent = await Agent.findOne({ publicAddress });
    if (existingAgent) {
      return res.status(400).json({ error: 'Agent with this public address already exists.' });
    }
    const newAgent = new Agent({ publicAddress });
    await newAgent.save();
    return res.status(200).json({ message: 'Agent added successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * API for Policy
 */

// GET all policies
app.get('/policy', async (req, res) => {
  try {
    const policies = await Policy.find();
    res.json(policies);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// POST new policy (Agents)
app.post('/policy', async (req, res) => {
  try {
    console.log(req.body);
    const { publicAddressOwner, publicAddressAgent, policyName, issuerName, policyType, premium, startDate, maturityDate, description, type } = req.body;
    const timeCreated = new Date(Date.now());
    const newPolicy = new Policy({ publicAddressOwner, publicAddressAgent, policyName, issuerName, policyType, premium, startDate, maturityDate, description, timeCreated, type });
    const savedPolicy = await newPolicy.save();
    const policyId = savedPolicy._id;
    await Policy.updateOne({ _id: savedPolicy._id }, { policyId });
    const insertedPolicy = await Policy.findById(newPolicy._id);
    res.status(200).json({
      message: "Successfully added policy",
      policy: insertedPolicy.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

// DELETE policy (NOT FOR USE)
app.delete('/policy', async (req, res) => {
  try {
    const policyConditions = req.body;
    console.log(req.body)
    const policy = await Policy.findOne(policyConditions);
    if (!policy) {
      return res.status(404).json({ message: 'Policy not found' });
    }
    await Policy.deleteOne(policyConditions);
    res.status(200).json({ message: 'Policy deleted successfully', policy });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/**
 * API for ListedPolicy
 */

// GET all listed policies (MarketPlace)
app.get('/listed-policy', async (req, res) => {
  try {
    const listedPolicies = await ListedPolicy.find({ listed : true });
    res.json(listedPolicies);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// POST new listed policy (Agents)
app.post('/listed-policy', async (req, res) => {
  try {
    console.log(req.body);
    const {
      policyId,
      publicAddressOwner,
      publicAddressAgent,
      issuerName,
      policyName,
      policyType,
      premium,
      startDate,
      maturityDate,
      description,
      timeCreated,
      type
    } = req.body;
    const newListedPolicy = new ListedPolicy({
      policyId,
      publicAddressOwner,
      publicAddressAgent,
      issuerName,
      policyName,
      policyType,
      premium,
      startDate,
      maturityDate,
      description,
      timeCreated,
      type
    });
    await newListedPolicy.save()
    const insertedPolicy = await ListedPolicy.findById(newListedPolicy._id);
    if (type === 1) {
      const agentPolicy = await Policy.findById(policyId);
      agentPolicy.listed = true;
      await agentPolicy.save();
    } else {
      const userPolicy = await UserPolicy.findById(policyId);
      userPolicy.listed = true;
      await userPolicy.save();
    }
    res.status(200).json({
      message: "Successfully listed policy",
      policy: insertedPolicy.toJSON()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

// DELETE listed policy (User Sell / Agent Delist)
app.delete('/listed-policy', async (req, res) => {
  try {
    console.log(req.query);
    const listedPolicy = await ListedPolicy.find(req.query);
    if (!listedPolicy) {
      return res.status(404).json({ message: 'Listed Policy not found' });
    }
    await ListedPolicy.deleteOne({ listedPolicy });
    if (req.query.type === '1') {
      const agentPolicy = await Policy.findOne(req.query);
      console.log(agentPolicy);
      agentPolicy.listed = false;
      await agentPolicy.save();
    } else {
      const userPolicy = await UserPolicy.find(req.query);
      userPolicy.listed = false;
      await userPolicy.save();
    }
    res.status(200).json({ message: 'Delisted policy successfully', listedPolicy});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// UPDATE listed policy status (Agent List/Delist) DEPRECATED
app.patch('/policy', async (req, res) => {
  try {
    const { _id, listed } = req.body;
    const updatedPolicy = await Policy.findByIdAndUpdate(_id, { listed }, { new: true });
    if (updatedPolicy) {
      return res.status(200).json({
        message: 'Policy updated successfully',
        updatedPolicy
      });
    } else {
      return res.status(404).json({
        error: 'Policy not found'
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})

/**
 * API for UserPolicy
 */

// GET all user's policies (User)
app.get('/user-policy', async (req, res) => {
  try {
    const { publicAddress } = req.query;
    const userPolicies = await UserPolicy.find({ publicAddress });
    if (userPolicies.length > 0) {
      return res.status(200).json({
        message: "User policies found",
        policies: userPolicies
      });
    } else {
      return res.status(200).json({
        message: "No policies found for user",
        polciies: userPolicies
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

// GET all user's policies (FOR TESTING)
app.get('/get-user-policy', async (req, res) => {
  try {
    const userPolicies = await UserPolicy.find();
    if (userPolicies.length > 0) {
      return res.status(200).json({
        message: "User policies found",
        policies: userPolicies
      });
    } else {
      return res.status(200).json({
        message: "No policies found for user",
        polciies: userPolicies
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

// POST to user policies
app.post('/user-policy', async (req, res) => {
  try {
    const {
      tokenId,
      policyId,
      publicAddressPreviousOwner,
      publicAddressOwner,
      publicAddressAgent,
      issuerName,
      policyName,
      policyType,
      premium,
      startDate,
      maturityDate,
      description,
      timeCreated,
      type
    } = req.body;
    const timePurchased = new Date(Date.now());
    const newUserPolicy = new UserPolicy({
      tokenId,
      policyId,
      publicAddressOwner,
      publicAddressAgent,
      issuerName,
      policyName,
      policyType,
      premium,
      startDate,
      maturityDate,
      description,
      timeCreated,
      timePurchased,
      type
    });
    await newUserPolicy.save()
    const insertedUserPolicy = await UserPolicy.findById(newUserPolicy._id);
    await UserPolicy.deleteOne({
      tokenId: 1,
      policyId: policyId,
      publicAddressOwner: publicAddressPreviousOwner,
      publicAddressAgent: publicAddressAgent,
      issuerName: issuerName,
      policyName: policyName,
      policyType: policyType,
      premium: premium,
      startDate: startDate,
      maturityDate: maturityDate,
      description: description,
      timeCreated: timeCreated,
      type: 2
    })
    res.status(200).json({
      message: "Successfully purchased policy",
      policy: insertedUserPolicy.toJSON(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

/**
 * API for AgentPolicy
 */

// GET all agent's policies
app.get('/agent-policy', async (req, res) => {
  try {
    const { publicAddress } = req.query;
    const agentPolicies = await Policy.find({ publicAddress });
    if (agentPolicies.length > 0) {
      return res.status(200).json({
        message: "Agent policies found",
        policies: agentPolicies
      });
    } else {
      return res.status(200).json({
        message: "No policies found for agent",
        policies: agentPolicies
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
})

app.put

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
