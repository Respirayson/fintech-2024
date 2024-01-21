import React, { useState } from "react";
import "./policy-card.css";

const PolicyPreview = ({formData}) => {

  return (
    <div className="single__nft__card">
      <div className="nft__content">
        <h5 className="nft__title">
          <p>{formData.policyName}</p>
        </h5>
        <div className="creator__info-wrapper d-flex gap-3">
          <div className="creator__info w-100 d-flex align-items-center justify-content-between">
            <div>
              <h6>Issued By</h6>
              <p>{formData.issuerName}</p>
            </div>
            <div>
              <h6>Current Price</h6>
              <p>{formData.premium} ETH</p>
            </div>
          </div>
        </div>
        <div className="creator__info w-100 d-flex align-items-center justify-content-between">
          <h6>Type</h6>
          <p>{formData.policyType}</p>
        </div>
        <div className="creator__info w-100 d-flex align-items-center justify-content-between">
          <h6>Start Date</h6>
          <p>{formData.startDate}</p>
        </div>
        <div className="creator__info w-100 d-flex align-items-center justify-content-between">
          <h6>Maturity Date</h6>
          <p>{formData.maturityDate}</p>
        </div>
        <div className=" mt-3 d-flex align-items-center justify-content-between">
          <button
            className="bid__btn d-flex align-items-center gap-1"
            onClick={() => setShowModal(true)}
          >
            <i className="ri-shopping-bag-line"></i> Buy Insurance
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyPreview;
