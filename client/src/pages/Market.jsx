import React, { useState, useEffect } from "react";

import CommonSection from "../components/ui/Common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";

import "../styles/market.css";

import axios from 'axios';
import PolicyCard from "../components/ui/PolicyCard/PolicyCard";

const Market = () => {
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

  useEffect(() => {
    // Fetch policies when the component mounts
    const fetchPolicies = async () => {
      try {
        const response = await axios.get('http://localhost:8000/policy');
        setPolicies(response.data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)));
        setDisplayedPolicies(response.data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)));
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
    // Sort policies when sortBy changes
    const sortedPolicies = sortBy === 'no-sort' ? policies : displayedPolicies.sort((a, b) => {
      if (sortBy === 'start-date') {
        return new Date(a.startDate) - new Date(b.startDate);
      } else if (sortBy === 'maturity-date') {
        return new Date(a.maturityDate) - new Date(b.maturityDate);
      } else if (sortBy === 'price-desc') {
        return a.premium - b.premium;
      } else if (sortBy === 'price-asc') {
        return b.premium - a.premium;
      }
      return 0; // Default case, no sorting
    });
    setDisplayedPolicies(sortedPolicies);
  }, [sortBy, displayedPolicies]);

  useEffect(() => {
    // Sort policies when sortBy changes

    const filteredPolicies = filterBy === 'no-filter' ? policies : displayedPolicies.filter(policy => policy.policyType === filterBy);
    setDisplayedPolicies(filteredPolicies);
  }, [filterBy, displayedPolicies]);

  return (
    <>
      <CommonSection title={"MarketPlace"} />

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
                    <option>Sort By</option>
                    <option value="price-asc">Price (Low To High)</option>
                    <option value="price-desc">Price (High To Low)</option>
                    <option value="start-date">Start Date</option>
                    <option value="maturity-date">Maturity Date</option>
                  </select>
                </div>
              </div>
            </Col>
            {policies && currentPolicies.map((policy) => (
              <Col lg="3" md="4" sm="6" className="mb-4" key={policy._id}>
                <PolicyCard key={policy._id} {...policy} />
              </Col>
            ))}
          </Row>
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
        </Container>
      </section>
    </>
  );
};

export default Market;
