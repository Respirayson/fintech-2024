import React, { useContext } from "react";
import { SourceBridgeContext } from "../../../context/SourceBridgeContext";
import { WebContext } from "../../../context/WebContext";
import axios from "axios";
import "./modal.css";

const SellModal = ({
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
  const { bridgeToken } = useContext(SourceBridgeContext);
  const {
    setShowAlert,
    setAlertIcon,
    setAlertTitle,
    setAlertMessage,
  } = useContext(WebContext);

  const handleSubmit = async (token) => {
    // await bridgeToken(tokenId);
    try {
      const response = await axios.post(
        "http://localhost:8000/listed-policy", {
          policyId: policyId,
          publicAddressOwner: publicAddressOwner,
          publicAddressAgent: publicAddressAgent,
          issuerName: issuerName,
          policyName: policyName,
          policyType: policyType,
          premium: premium,
          startDate: startDate,
          maturityDate: maturityDate,
          description: description,
          timeCreated: timeCreated,
          type: type
        }
      );
      console.log(response.data);
      setShowAlert(true);
      setAlertIcon("success");
      setAlertTitle("Congratulations");
      setAlertMessage(response.data.message);
      setTimeout(() => {
        window.location.reload();
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
          <i className="ri-close-line" onClick={() => setShowModal(false)}></i>
        </span>
        <h6 className="text-center text-light">{issuerName}</h6>
        <p className="text-center text-light">
          Check your insurance policy details before listing it for sale.
        </p>
        <div className="input__item mb-4">
          <h6>Seller Address</h6>
          <input
            type="text"
            id="publicAddress"
            name="publicAddress"
            value={publicAddressOwner}
            readOnly
          />
        </div>
        <div className="input__item mb-3">
          <h6>Policy Name - Type</h6>
          <input
            type="text"
            name="policyName"
            value={policyName + " - " + policyType}
            readOnly
          />
        </div>
        <div className="input__item mb-3">
          <h6>Dates</h6>
          <input
            type="text"
            name="dates"
            value={startDate + " to " + maturityDate}
            readOnly
          />
        </div>
        <div className="input__item mb-4">
          <h6>Description</h6>
          <p>{description}</p>
        </div>
        <button className="place__bid-btn" onClick={handleSubmit}>
          List for Sale
        </button>
      </div>
    </div>
  );
};

export default SellModal;
