import React, { useState, useEffect, useContext } from "react";

import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/ui/Common-section/CommonSection";
import PolicyPreview from "../components/ui/PolicyCard/PolicyPreview";
import { changeNetwork } from "../utils/connect";
import axios from "axios";

import "../styles/create-item.css";
import PolicyForm from "../components/CreatePolicyForm/CreatePolicyForm";
import { WebContext } from "../context/WebContext";
import { SourceTokenMinterContext } from "../context/SourceTokenMinterContext";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const navigate = useNavigate();
  const {
    setShowAlert,
    setAlertIcon,
    setAlertTitle,
    setAlertMessage,
    currentAccount,
    checkAuthenticated,
  } = useContext(WebContext);

  const { mintNewPolicyToken, approveSourceBridge } = useContext(
    SourceTokenMinterContext
  );

  const [authenticated, setAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    publicAddress: currentAccount,
    policyName: "-",
    issuerName: "-",
    policyType: "-",
    premium: 0,
    startDate: "-",
    maturityDate: "-",
    description: "-",
    timeCreated: "-",
    type: 1
  });

  useEffect(() => {
    checkAuthenticated().then((isAuthenticated) => {
      setAuthenticated(isAuthenticated);
    });
    console.log(`Authenticated Status : ${authenticated}`);
  }, [authenticated, checkAuthenticated, setAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      formData.publicAddress = currentAccount;
      const response = await axios.post(
        "http://localhost:8000/policy",
        formData
      );
      console.log(response.data);
      // const tokenId = await mintNewPolicyToken(1, 1234, 1234, "asdf", 1234);
      setShowAlert(true);
      setAlertIcon("success");
      setAlertTitle("Congratulations");
      setAlertMessage(response.data.message);
      // console.log(`Minted new policy token - token id: ${tokenId}`);
      setTimeout(() => {
        navigate("/");
      }, 10000);
      
      // const sourceBridgeTxHash = await approveSourceBridge();
      // console.log(`Approved bridge contract to trasfer token - Transaction hash: ${sourceBridgeTxHash}`);
    } catch (err) {
      setShowAlert(true);
      setAlertIcon("error");
      setAlertTitle("Error");
      setAlertMessage(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };

  return (
    <>
      <CommonSection title="Create Item" />
      <button onClick={async () => await changeNetwork("0xaa36a7")}>Change network</button>


      <section>
        {authenticated ? (
          <section>
            <Container>
              <Row>
                <Col lg="3" md="4" sm="6">
                  <h5 className="mb-4 text-light">Preview Item</h5>
                  <PolicyPreview
                    formData={formData}
                    handleChange={handleChange}
                  />
                </Col>
                <Col lg="9" md="8" sm="6">
                  <PolicyForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    publicAddress={currentAccount}
                  />
                </Col>
              </Row>
            </Container>
          </section>
        ) : (
          <div className="button-container">
            <p>Please log in to create a policy</p>
            <button
              className="custom-button"
              onClick={() => navigate("/wallet")}
            >
              Connect Wallet
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default Create;
