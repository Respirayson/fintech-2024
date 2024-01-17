import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import { WebContext } from "../context/WebContext";
import CommonSection from "../components/ui/Common-section/CommonSection";
import PolicyCard from "../components/ui/PolicyCard/PolicyCard";
import { Container, Row, Col } from "reactstrap";
import SellPolicyCard from "../components/ui/PolicyCard/SellPolicyCard";

const MyPolicies = () => {
  const { currentAccount } = useContext(WebContext);
  const [policies, setPolicies] = useState([]);
  const [displayedPolicies, setDisplayedPolicies] = useState([]);
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastPolicy = currentPage * itemsPerPage;
  const indexOfFirstPolicy = indexOfLastPolicy - itemsPerPage;
  const currentPolicies = displayedPolicies.slice(
    indexOfFirstPolicy,
    indexOfLastPolicy
  );
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("http://localhost:8000/policy");
        console.log(
          res.data.filter((policy) => policy.publicAddress === currentAccount)
        );
        setPolicies(
          res.data.filter((policy) => policy.publicAddress === currentAccount)
        );
        setDisplayedPolicies(
          res.data.filter((policy) => policy.publicAddress === currentAccount)
        );
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [currentAccount]);

  return (
    <>
      <CommonSection title={"My Policies"} />

      <section>
        <Container>
          <Row>
            {policies &&
              currentPolicies.map((policy) => (
                <Col lg="3" md="4" sm="6" className="mb-4" key={policy._id}>
                  <SellPolicyCard key={policy._id} {...policy} />
                </Col>
              ))}
          </Row>
        </Container>
      </section>

      <nav>
        <ul className="pagination">
          {Array.from({
            length: Math.ceil(displayedPolicies.length / itemsPerPage),
          }).map((_, index) => (
            <li
              key={index}
              className={`page-item ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              <button onClick={() => paginate(index + 1)} className="page-link">
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default MyPolicies;
