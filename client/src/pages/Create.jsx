import React, { useState, useEffect } from "react";

import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/ui/Common-section/CommonSection";
import PolicyPreview from "../components/ui/PolicyCard/PolicyPreview";
import img from "../assets/images/img-01.jpg";
import avatar from "../assets/images/ava-01.png";
import { checkWalletConnected } from '../utils/connect'
import axios from 'axios';

import "../styles/create-item.css";
import PolicyForm from "../components/CreatePolicyForm/CreatePolicyForm";
import { WebContext } from '../context/WebContext';

const Create = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  useEffect(() => {
    /**
     * Fetches the connected wallet account on component mount.
     */
    async function fetchData() {
      const account = await checkWalletConnected();
      setCurrentAccount(account);
      console.log(currentAccount)
    }
    fetchData();
    window?.ethereum?.on("accountsChanged", fetchData);
  }, []);


  const [formData, setFormData] = useState({
      publicAddress: currentAccount,
      policyName: '-',
      issuerName: '-',
      policyType: '-',
      premium: 0,
      startDate: '-',
      maturityDate: '-',
      description: '-',
  });

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          formData.publicAddress = currentAccount
          const response = await axios.post('http://localhost:8000/policy', formData);
          console.log('Policy created:', response.data);
      } catch (error) {
          console.error('Error creating policy:', error.message);
      } finally {
        setFormData({
          publicAddress: currentAccount,
          policyName: '',
          issuerName: '',
          policyType: '',
          premium: 0,
          startDate: '',
          maturityDate: '',
          description: '',
        })
      }
  };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
        console.log(formData)
    };


  return (
    <>
      <CommonSection title="Create Item" />

      <section>
        {currentAccount &&
          <Container>
            <Row>
              <Col lg="3" md="4" sm="6">
                <h5 className="mb-4 text-light">Preview Item</h5>
                <PolicyPreview formData={formData} handleChange={handleChange}/>
              </Col>
              <Col lg="9" md="8" sm="6">
                <PolicyForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} publicAddress={currentAccount}/>
              </Col>
            </Row>
          </Container>
        }
      </section>
    </>
  );
};

export default Create;
