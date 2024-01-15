import React, { useState } from "react";

import "./modal.css";

const Modal = ({ setShowModal, publicAddress, description, premium }) => {
    const [quantity, setQuantity] = useState('');
    const [totalPrice, setTotalPrice] = useState(0)

  const handleQuantityChange = (e) => {
    if (e.target.value > 0) {
      setQuantity(e.target.value);
      setTotalPrice((e.target.value * premium).toFixed(2));
    }
  };
  
  return (
    <div className="modal__wrapper">
      <div className="single__modal">
        <span className="close__modal">
          <i class="ri-close-line" onClick={() => setShowModal(false)}></i>
        </span>
        <h6 className="text-center text-light">Place a Bid</h6>
        <p className="text-center text-light">
          You must have at least <span className="money">{premium} ETH to buy this policy</span>
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

        <button className="place__bid-btn">Purchase</button>
      </div>
    </div>
  );
};

export default Modal;