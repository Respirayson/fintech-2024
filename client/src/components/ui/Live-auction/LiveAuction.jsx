import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

import NftCard from "../PolicyCard/PolicyPreview.jsx";
import { NFT__DATA } from "../../../assets/data/data.js";

import "./live-auction.css";
import axios from "axios";
import PolicyCard from "../PolicyCard/PolicyCard.jsx";

const LiveAuction = () => {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    // Fetch policies when the component mounts
    const fetchPolicies = async () => {
      try {
        const response = await axios.get('http://localhost:8000/policy');
        setPolicies(response.data);
      } catch (error) {
        console.error('Error fetching policies:', error);
      }
    };

    fetchPolicies();
  }, []);

  console.log(policies)

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="mb-5">
            <div className="live__auction__top d-flex align-items-center justify-content-between ">
              <h3>Live Auction</h3>
              <span>
                <Link to="/market">Explore more</Link>
              </span>
            </div>
          </Col>

          {policies && policies.map((policy) => (
              <Col lg="3" md="4" sm="6" className="mb-4" key={policy._id}>
                <PolicyCard key={policy._id} {...policy} />
              </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default LiveAuction;