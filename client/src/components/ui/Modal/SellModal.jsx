import React, { useContext, useState } from "react";
import { SourceBridgeContext } from "../../../context/SourceBridgeContext";

import "./modal.css";

const SellModal = ({
  setShowModal,
  publicAddress,
  description,
  premium,
  policyName,
  policyType,
  issuerName,
  startDate,
  maturityDate,
}) => {
  const { bridgeToken } = useContext(SourceBridgeContext);

  const handleSubmit = async (tokenId) => {
    await bridgeToken(tokenId);

    // Add the listing to the database
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
            value={publicAddress}
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
