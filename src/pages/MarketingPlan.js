import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaCamera, FaGlobe, FaChartBar, FaMapMarkedAlt, FaFileAlt, FaPhotoVideo, FaHandshake } from 'react-icons/fa';

const PageContainer = styled.div`
  padding-top: 80px; /* Account for navbar */
`;

const PageHeader = styled.div`
  background-color: #1a1a1a;
  position: relative;
  padding: 6rem 0;
  text-align: center;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/rustic-home.jpg');
    background-size: cover;
    background-position: center;
    opacity: 0.2;
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(26, 26, 26, 0.8), #1a1a1a);
    z-index: 2;
  }
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 3;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const PageTitle = styled(motion.h1)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 4rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 3rem;
  }
`;

const PageDescription = styled(motion.p)`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text.primary};
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
`;

const ContentSection = styled.section`
  padding: 5rem 0;
  background-color: ${props => props.theme.colors.background.dark};
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const IntroText = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
  
  h2 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 2.5rem;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 1.5rem;
  }
  
  p {
    font-size: 1.1rem;
    color: ${props => props.theme.colors.text.primary};
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.8;
  }
`;

const MarketingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const MarketingCard = styled(motion.div)`
  background-color: rgba(30, 30, 30, 0.6);
  border-radius: ${props => props.theme.borderRadius.default};
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
    border-color: ${props => props.theme.colors.secondary};
  }
`;

const CardHeader = styled.div`
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const IconContainer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(139, 69, 19, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.theme.colors.border};
  flex-shrink: 0;
  
  svg {
    color: ${props => props.theme.colors.text.secondary};
    font-size: 1.5rem;
  }
`;

const CardTitle = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const CardContent = styled.div`
  padding: 2rem;
  
  p {
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 1.5rem;
    line-height: 1.7;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    
    li {
      padding-left: 1.5rem;
      position: relative;
      margin-bottom: 0.8rem;
      color: ${props => props.theme.colors.text.primary};
      
      &::before {
        content: '→';
        position: absolute;
        left: 0;
        color: ${props => props.theme.colors.primary};
      }
    }
  }
`;

const PricingSection = styled.section`
  padding: 5rem 0;
  background-color: rgba(30, 30, 30, 0.4);
  text-align: center;
`;

const PricingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const PricingTitle = styled(motion.h2)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 3rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1.5rem;
`;

const PricingCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
`;

const PricingCard = styled(motion.div)`
  background-color: rgba(30, 30, 30, 0.8);
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 3rem 2rem;
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  max-width: 350px;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  ${props => props.popular && `
    transform: scale(1.05);
    border-color: ${props.theme.colors.secondary};
    
    &::before {
      content: 'Most Popular';
      position: absolute;
      top: 1rem;
      right: -2rem;
      background-color: ${props.theme.colors.primary};
      color: white;
      padding: 0.3rem 2rem;
      font-size: 0.8rem;
      transform: rotate(45deg);
    }
  `}
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.large};
  }
`;

const PricingHeader = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 2rem;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 1rem;
  }
`;

const PricingPrice = styled.div`
  font-size: 3rem;
  color: white;
  margin-bottom: 1rem;
  
  span {
    font-size: 1rem;
    color: ${props => props.theme.colors.text.muted};
  }
`;

const PricingFeatures = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 2rem 0;
  text-align: left;
  
  li {
    padding-left: 1.5rem;
    position: relative;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text.primary};
    
    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: ${props => props.theme.colors.secondary};
    }
  }
`;

const PricingButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: ${props => props.theme.borderRadius.default};
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    background-color: ${props => props.theme.colors.tertiary};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.small};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ComparisonSection = styled.section`
  padding: 5rem 0;
  background-color: ${props => props.theme.colors.background.dark};
`;

const ComparisonContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const ComparisonTitle = styled(motion.h2)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 2.5rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 3rem;
  text-align: center;
`;

const ComparisonTable = styled(motion.div)`
  background-color: rgba(30, 30, 30, 0.5);
  border-radius: ${props => props.theme.borderRadius.default};
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    overflow-x: auto;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1.2rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
  
  th {
    background-color: rgba(50, 50, 50, 0.5);
    color: ${props => props.theme.colors.text.secondary};
    font-family: ${props => props.theme.fonts.heading};
    font-weight: 600;
  }
  
  td {
    color: ${props => props.theme.colors.text.primary};
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  .check {
    color: ${props => props.theme.colors.secondary};
    text-align: center;
  }
  
  .times {
    color: #ff6b6b;
    text-align: center;
  }
  
  .highlight {
    background-color: rgba(139, 69, 19, 0.1);
  }
`;

const CTASection = styled.section`
  padding: 5rem 0;
  background-color: rgba(139, 69, 19, 0.1);
  text-align: center;
`;

const CTAContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const CTATitle = styled(motion.h2)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 2.5rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1.5rem;
`;

const CTAText = styled(motion.p)`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 2rem;
  line-height: 1.7;
`;

const CTAButton = styled(motion.button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: ${props => props.theme.borderRadius.default};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.tertiary};
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const MarketingPlanPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [introRef, introInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [cardsRef, cardsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [pricingRef, pricingInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [comparisonRef, comparisonInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [ctaRef, ctaInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const marketingServices = [
    {
      icon: <FaCamera />,
      title: "Professional Photography",
      content: (
        <>
          <p>First impressions matter. Our professional photography service ensures your property looks its absolute best online and in print.</p>
          <ul>
            <li>High-resolution interior and exterior photos</li>
            <li>Optimal lighting and composition techniques</li>
            <li>Highlighting key selling features</li>
            <li>Twilight shots for enhanced curb appeal</li>
            <li>Detail photos of unique property features</li>
          </ul>
        </>
      )
    },
    {
      icon: <FaPhotoVideo />,
      title: "Aerial & Virtual Tours",
      content: (
        <>
          <p>Give potential buyers a comprehensive view of your property with our advanced visual marketing tools.</p>
          <ul>
            <li>Drone aerial photography and video</li>
            <li>Property boundary visualization</li>
            <li>Interactive 3D virtual tours</li>
            <li>360° room panoramas</li>
            <li>Guided video walkthrough with narration</li>
          </ul>
        </>
      )
    },
    {
      icon: <FaFileAlt />,
      title: "Professional Listing",
      content: (
        <>
          <p>Our detailed, compelling property descriptions tell the unique story of your home to potential buyers.</p>
          <ul>
            <li>Professionally written, engaging descriptions</li>
            <li>Highlighting key property features and benefits</li>
            <li>SEO optimization for maximum online visibility</li>
            <li>Accurate property specifications</li>
            <li>Feature sheets for showings and open houses</li>
          </ul>
        </>
      )
    },
    {
      icon: <FaGlobe />,
      title: "Digital Marketing",
      content: (
        <>
          <p>Our comprehensive digital marketing strategy ensures your property reaches qualified buyers wherever they are.</p>
          <ul>
            <li>Featured placement on major real estate websites</li>
            <li>Custom property website</li>
            <li>Social media marketing campaigns</li>
            <li>Email marketing to our buyer database</li>
            <li>Digital advertising targeted to likely buyers</li>
          </ul>
        </>
      )
    },
    {
      icon: <FaChartBar />,
      title: "Market Analysis",
      content: (
        <>
          <p>Our detailed market analysis helps position your property competitively for a successful sale.</p>
          <ul>
            <li>Comprehensive comparable sales analysis</li>
            <li>Current market trend evaluation</li>
            <li>Pricing strategy development</li>
            <li>Weekly market updates</li>
            <li>Showing feedback analysis and adjustments</li>
          </ul>
        </>
      )
    },
    {
      icon: <FaHandshake />,
      title: "Transaction Management",
      content: (
        <>
          <p>From listing to closing, we handle all the details of your transaction for a smooth, stress-free experience.</p>
          <ul>
            <li>Offer presentation and negotiation</li>
            <li>Contract management</li>
            <li>Inspection and repair coordination</li>
            <li>Closing preparation and document review</li>
            <li>Communication with all parties (buyers, title, lenders)</li>
          </ul>
        </>
      )
    }
  ];
  
  return (
    <PageContainer>
      <PageHeader ref={headerRef}>
        <HeaderContent>
          <PageTitle
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            Marketing Plan
          </PageTitle>
          <PageDescription
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            How we showcase your property to achieve the best possible outcome with our comprehensive marketing strategy.
          </PageDescription>
        </HeaderContent>
      </PageHeader>
      
      <ContentSection>
        <ContentContainer>
          <IntroText
            ref={introRef}
            initial={{ opacity: 0, y: 30 }}
            animate={introInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <h2>The Outrider Marketing Advantage</h2>
            <p>
              At Outrider Real Estate, we believe every property deserves professional marketing, regardless of price point. 
              Our comprehensive marketing plan is designed to showcase your property's unique features and attract qualified buyers. 
              From professional photography to targeted digital marketing, we employ proven strategies to ensure your property stands out 
              in today's competitive market.
            </p>
          </IntroText>
          
          <MarketingGrid ref={cardsRef}>
            {marketingServices.map((service, index) => (
              <MarketingCard
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                animate={cardsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <CardHeader>
                  <IconContainer>{service.icon}</IconContainer>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {service.content}
                </CardContent>
              </MarketingCard>
            ))}
          </MarketingGrid>
        </ContentContainer>
      </ContentSection>
      
      <PricingSection>
        <PricingContainer ref={pricingRef}>
          <PricingTitle
            initial={{ opacity: 0, y: 30 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            Simple, Transparent Pricing
          </PricingTitle>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ color: '#f5f5f5', maxWidth: '800px', margin: '0 auto', lineHeight: '1.7' }}
          >
            We believe in providing exceptional service at a fair price. Our listing fee is just 1% of the sale price 
            (with a $7,000 minimum), significantly lower than the industry standard while providing comprehensive marketing and support.
          </motion.p>
          
          <PricingCards>
            <PricingCard
              initial={{ opacity: 0, y: 30 }}
              animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              popular
            >
              <PricingHeader>
                <h3>Outrider Full Service</h3>
              </PricingHeader>
              
              <PricingPrice>
                1% <span>of sale price ($7k minimum)</span>
              </PricingPrice>
              
              <PricingFeatures>
                <li>Professional Photography</li>
                <li>Aerial Drone Photography</li>
                <li>Virtual 3D Tours</li>
                <li>Custom Property Website</li>
                <li>Featured MLS Listing</li>
                <li>Social Media Campaigns</li>
                <li>Weekly Market Updates</li>
                <li>Full Transaction Management</li>
                <li>No Contract Commitment</li>
              </PricingFeatures>
              
              <PricingButton>Get Started</PricingButton>
            </PricingCard>
          </PricingCards>
        </PricingContainer>
      </PricingSection>
      
      <ComparisonSection>
        <ComparisonContainer ref={comparisonRef}>
          <ComparisonTitle
            initial={{ opacity: 0, y: 30 }}
            animate={comparisonInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            How We Compare
          </ComparisonTitle>
          
          <ComparisonTable
            initial={{ opacity: 0, y: 30 }}
            animate={comparisonInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Table>
              <thead>
                <tr>
                  <th>Features</th>
                  <th>Outrider (1%)</th>
                  <th>Traditional Agents (2.5-3%)</th>
                  <th>Discount Brokers (1-1.5%)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="highlight">
                  <td>Professional Photography</td>
                  <td className="check">✓</td>
                  <td className="check">✓</td>
                  <td className="times">×</td>
                </tr>
                <tr>
                  <td>Aerial Drone Photography</td>
                  <td className="check">✓</td>
                  <td className="check">✓</td>
                  <td className="times">×</td>
                </tr>
                <tr className="highlight">
                  <td>3D Virtual Tours</td>
                  <td className="check">✓</td>
                  <td className="times">Optional Extra</td>
                  <td className="times">×</td>
                </tr>
                <tr>
                  <td>Custom Property Website</td>
                  <td className="check">✓</td>
                  <td className="times">×</td>
                  <td className="times">×</td>
                </tr>
                <tr className="highlight">
                  <td>Weekly Market Updates</td>
                  <td className="check">✓</td>
                  <td className="times">×</td>
                  <td className="times">×</td>
                </tr>
                <tr>
                  <td>No Contract Commitment</td>
                  <td className="check">✓</td>
                  <td className="times">×</td>
                  <td className="times">×</td>
                </tr>
                <tr className="highlight">
                  <td>Rural Property Expertise</td>
                  <td className="check">✓</td>
                  <td className="times">Varies</td>
                  <td className="times">×</td>
                </tr>
                <tr>
                  <td>In-Person Support</td>
                  <td className="check">✓</td>
                  <td className="check">✓</td>
                  <td className="times">Limited</td>
                </tr>
              </tbody>
            </Table>
          </ComparisonTable>
        </ComparisonContainer>
      </ComparisonSection>
      
      <CTASection>
        <CTAContainer ref={ctaRef}>
          <CTATitle
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            Ready to Market Your Property?
          </CTATitle>
          <CTAText
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Let us show you how our comprehensive marketing plan can help you sell your property 
            for top dollar with less stress and a lower commission.
          </CTAText>
          <CTAButton
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Schedule a Marketing Consultation
          </CTAButton>
        </CTAContainer>
      </CTASection>
    </PageContainer>
  );
};

export default MarketingPlanPage;