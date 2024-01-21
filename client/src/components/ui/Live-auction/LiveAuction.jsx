import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import "./live-auction.css";
import axios from "axios";
import BuyPolicyCard from "../PolicyCard/BuyPolicyCard.jsx";

const LiveAuction = () => {
  const [policies, setPolicies] = useState([]);

  // Fetch 8 latest policies listed on component mount
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await axios.get('http://localhost:8000/listed-policy');
        const sortedResponse = response.data.sort((a, b) => {
          b.timeCreated - a.timeCreated;
        });
        if (sortedResponse.length > 8) {
          setPolicies(sortedResponse.slice(1,9));
        } else {
          setPolicies(sortedResponse);
        }
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
                <BuyPolicyCard key={policy._id} {...policy} />
              </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default LiveAuction;
