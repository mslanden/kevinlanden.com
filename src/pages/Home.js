import React, { useEffect } from 'react';
import styled from 'styled-components';
import Hero from '../components/Hero';
import Discover from '../components/Discover';
import Territory from '../components/Territory';
import MarketingPlan from '../components/MarketingPlan';
import Testimonials from '../components/Testimonials';

const HomeContainer = styled.div`
  overflow: hidden;
`;

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <HomeContainer>
      <Hero />
      <Discover />
      <Territory />
      <MarketingPlan />
      <Testimonials />
    </HomeContainer>
  );
};

export default Home;