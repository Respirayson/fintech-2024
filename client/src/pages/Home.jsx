import React from "react";
import HeroSection from "../components/ui/HeroSection";
import LiveAuction from "../components/ui/Live-auction/LiveAuction";
import StepSection from "../components/ui/StepSection/StepSection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <LiveAuction />
      {/* <SellerSection />
      <Trending /> */}
      <StepSection /> 
    </>
  );
};

export default Home;
