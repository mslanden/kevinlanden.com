import React, { useEffect } from 'react';
import styled from 'styled-components';
import Hero from '../components/Hero';
import Discover from '../components/Discover';
import Story from '../components/Story';
import Territory from '../components/Territory';
import MarketingPlan from '../components/MarketingPlan';
import Testimonials from '../components/Testimonials';
import Affiliate from '../components/Affiliate';
import { motion } from 'framer-motion';

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
      <Story />
      <Territory />
      <MarketingPlan />
      <Testimonials />
      <Affiliate />
    </HomeContainer>
  );
};

export default Home;