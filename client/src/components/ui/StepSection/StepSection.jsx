import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";

import "./stepsection.css";

const STEP__DATA = [
  {
    title: "SETUP",
    desc: "Connect via MetaMask to securely manage your digital assets and engage in decentralized transactions",
    icon: "ri-wallet-line",
  },

  {
    title: "CREATE",
    desc: "Design and establish your customised, transparent, tamper-proof insurance policies effortlessly",
    icon: "ri-layout-masonry-line",
  },

  {
    title: "SHOP",
    desc: "Explore a diverse range of innovative decentralized insurance policies available on the marketplace",
    icon: "ri-image-line",
  },

  {
    title: "SELL",
    desc: "List your insurance offerings on the marketplacee and let smart contracts handle the execution of policies",
    icon: "ri-list-check",
  }
];

const StepSection = () => {
  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="mb-4">
            <h3 className="step__title">Endless Opportunities Await</h3>
          </Col>

          {STEP__DATA.map((item, index) => (
            <Col lg="3" md="4" sm="6" key={index} className="mb-4">
              <div className="single__step__item">
                <span>
                  <i class={item.icon}></i>
                </span>
                <div className="step__item__content">
                  <h5>
                    <Link to="/wallet">{item.title}</Link>
                  </h5>
                  <p className="mb-0">{item.desc}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default StepSection;