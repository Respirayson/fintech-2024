import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WebContext } from "../../../context/WebContext";
import "./modal.css";
import axios from "axios";

const BuyModal = ({
  setShowModal,
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
}) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const { 
    setShowAlert,
    setAlertIcon,
    setAlertTitle,
    setAlertMessage,
    currentAccount 
  } = useContext(WebContext);

  const handleQuantityChange = (e) => {
    if (e.target.value > 0) {
      setQuantity(e.target.value);
      setTotalPrice((e.target.value * premium).toFixed(2));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/user-policy", {
          tokenId: 1,
          policyId: policyId,
          publicAddressPreviousOwner:publicAddressOwner,
          publicAddressOwner: currentAccount,
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
        }
      );
      console.log(response.data);
      setShowAlert(true);
      setAlertIcon("success");
      setAlertTitle("Congratulations");
      setAlertMessage(response.data.message);
      setTimeout(() => {
        navigate('/user-policy')
      }, 10000);
    } catch (err) {
      setShowAlert(true);
      setAlertIcon("error");
      setAlertTitle("Error");
      setAlertMessage(err.message);
    }
  };
  
  return (
    <div className="modal__wrapper">
      <div className="single__modal">
        <span className="close__modal">
        </span>
        <h6 className="text-center text-light">Place a Bid</h6>
        <p className="text-center text-light">
          You must have at least <span className="money">{premium} ETH to buy this policy</span>
        </p>
        <div className="input__item mb-4">
          <h6>Seller Address</h6>
            <input
              type="text"
              id="publicAddressOwner"
              name="publicAddressOwner"
              value={publicAddressOwner}
              readOnly
            />
        </div>
        <div className="input__item mb-3">
          <h6>Enter Quantity</h6>
          <input
            type="number"
            id="quantity"
            placeholder="Enter quantity"
            value={quantity}
            onChange={handleQuantityChange}
          />
        </div>
        <div className="input__item mb-4">
          <h6>Description</h6>
          <h6>{description}</h6>
        </div>
        <div className=" d-flex align-items-center justify-content-between">
          <p>Total Bid Amount</p>
          <span className="money">{totalPrice} ETH</span>
        </div>
        <button className="place__bid-btn" onClick={handleSubmit}>
          Purchase
        </button>
      </div>
    </div>
  );
};

export default BuyModal;
