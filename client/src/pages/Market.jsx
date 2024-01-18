import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/ui/Common-section/CommonSection";
import axios from 'axios';
import BuyPolicyCard from "../components/ui/PolicyCard/BuyPolicyCard";
import { WebContext } from "../context/WebContext";
import { changeNetwork } from "../utils/connect";
import { useNavigate } from "react-router-dom";
import "../styles/market.css";

const Market = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [displayedPolicies, setDisplayedPolicies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('no-sort');
  const [filterBy, setFilterBy] = useState('no-filter')
  const itemsPerPage = 8;
  const indexOfLastPolicy = currentPage * itemsPerPage;
  const indexOfFirstPolicy = indexOfLastPolicy - itemsPerPage;
  const currentPolicies = displayedPolicies.slice(indexOfFirstPolicy, indexOfLastPolicy);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const { checkAuthenticated } = useContext(WebContext);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthenticated().then((isAuthenticated) => {
      setAuthenticated(isAuthenticated);
    });
    console.log(`Authenticated Status : ${authenticated}`);
  }, [authenticated, checkAuthenticated, setAuthenticated]);

  useEffect(() => {
    // Fetch policies when the component mounts
    const fetchPolicies = async () => {
      try {
        const response = await axios.get('http://localhost:8000/listed-policy');
        console.log(response.data)
        setPolicies(response.data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)));
        setDisplayedPolicies(response.data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)));
        console.log(policies)
      } catch (error) {
        console.error('Error fetching policies:', error);
      }
    };
    fetchPolicies();
  }, []);

  const handleSort = (e) => {
    const sortType = e.target.value;
    setSortBy(sortType);
  };

  const handleFilter = (e) => {
    const category = e.target.value;
    setFilterBy(category);
  }

  useEffect(() => {
    const sortedPolicies = sortBy === 'no-sort' ? policies : [...policies].sort((a, b) => {
      if (sortBy === 'start-date-asc') {
        return new Date(a.startDate) - new Date(b.startDate);
      } else if (sortBy === 'start-date-desc') {
        return new Date(b.startDate) - new Date(a.startDate);
      } else if (sortBy === 'maturity-date-asc') {
        return new Date(a.maturityDate) - new Date(b.maturityDate);
      } else if (sortBy === 'maturity-date-desc') {
        return new Date(b.maturityDate) - new Date(a.maturityDate);
      } else if (sortBy === 'price-asc') {
        return a.premium - b.premium;
      } else if (sortBy === 'price-desc') {
        return b.premium - a.premium;
      } else if (sortBy === 'time-created-asc') {
        return a.timeCreated - b.timeCreated;
      } else if (sortBy === 'time-created-desc') {
        return b.timeCreated - a.timeCreated;
      }
      return 0; // Default case, no sorting
    });
    const filteredPolicies = filterBy === 'no-filter' ? sortedPolicies : [...sortedPolicies].filter(policy => policy.policyType === filterBy);
    setDisplayedPolicies(filteredPolicies);
  }, [sortBy, filterBy, policies]);

  return (
      <>
        <CommonSection title={"MarketPlace"} />
        <button onClick={async () => await changeNetwork("0x13881")}>Change network</button>
        { authenticated ? (
          <section>
            <Container>
              <Row>
                <Col lg="12" className="mb-5">
                  <div className="market__product__filter d-flex align-items-center justify-content-between">
                    <div className="filter__left d-flex align-items-center gap-5">
                      <div className="all__category__filter">
                        <select onChange={handleFilter}>
                          <option value="no-filter">All Categories</option>
                          <option value="Life Insurance">Life</option>
                          <option value="Health Insurance">Health</option>
                          <option value="Motor Insurance">Motor</option>
                          <option value="Personal Accident Insurance">Personal Accident</option>
                          <option value="Business Insurance">Business</option>
                          <option value="Travel Insurance">Travel</option>
                          <option value="Critical Illness Insurance">Critical Illness</option>
                          <option value="Fire Insurance">Fire</option>
                          <option value="Child Insurance">Child</option>
                          <option value="Disability Insurance">Disability</option>
                          <option value="General Insurance">General</option>
                        </select>
                      </div>
                    </div>

                    <div className="filter__right">
                      <select onChange={handleSort}>
                        <option value='no-sort'>Sort By</option>
                        <option value="price-asc">Price (Low To High)</option>
                        <option value="price-desc">Price (High To Low)</option>
                        <option value="start-date-desc">Start Date (Latest)</option>
                        <option value="start-date-asc">Start Date (Earliest)</option>
                        <option value="maturity-date-desc">Maturity Date (Latest)</option>
                        <option value="maturity-date-asc">Maturity Date (Earliest)</option>
                        <option value="time-created-desc">Time Created (Newest)</option>
                        <option value="time-created-asc">Time Created (Oldest)</option>
                      </select>
                    </div>
                  </div>
                </Col>
                {policies && currentPolicies.map((policy) => (
                  <Col lg="3" md="4" sm="6" className="mb-4" key={policy._id}>
                    <BuyPolicyCard key={policy._id} {...policy} />
                  </Col>
                ))}
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
        {authenticated && 
          <nav>
            <ul className="pagination">
              {Array.from({ length: Math.ceil(displayedPolicies.length / itemsPerPage) }).map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button onClick={() => paginate(index + 1)} className="page-link">
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        }    
      </>
  );
};

export default Market;
