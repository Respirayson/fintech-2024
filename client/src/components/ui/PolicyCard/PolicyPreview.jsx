import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./policy-card.css";

import Modal from "../Modal/Modal";

const PolicyPreview = ({formData}) => {

  const [showModal, setShowModal] = useState(false);

  return (
    <div className="single__nft__card">
      {/* <div className="nft__img">
        <img src={imgUrl} alt="" className="w-100" />
      </div> */}

      <div className="nft__content">
        <h5 className="nft__title">
          <p>{formData.policyName}</p>
        </h5>

        <div className="creator__info-wrapper d-flex gap-3">
          {/* <div className="creator__img">
            <img src={creatorImg} alt="" className="w-100" />
          </div> */}

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
            <i class="ri-shopping-bag-line"></i> Buy Insurance
          </button>

          {showModal && <Modal setShowModal={setShowModal} />}

          {/* <span className="history__link">
            <Link to="#">View History</Link>
          </span> */}
        </div>
      </div>
    </div>
  );
};

export default PolicyPreview;