import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaCamera, FaChartLine, FaAd, FaHandshake, FaFileContract, FaMoneyCheckAlt, FaChartBar, FaMapMarkedAlt, FaFileAlt, FaPhotoVideo, FaDownload } from 'react-icons/fa';
import NewsletterModal from '../components/NewsletterModal';

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
    background-image: url('/images/ranch-sunset.jpg');
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

const DownloadButton = styled(motion.button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: ${props => props.theme.borderRadius.default};
  cursor: pointer;
  margin-top: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: background-color ${props => props.theme.transitions.default};
  
  &:hover {
    background-color: ${props => props.theme.colors.tertiary};
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const ContentSection = styled.section`
  padding: 5rem 0;
  background-color: ${props => props.theme.colors.background.dark};
`;

const MarketingSection = styled.section`
  padding: 5rem 0;
  background-color: ${props => props.theme.colors.background.warmDark};
`;

const PricingSection = styled.section`
  padding: 5rem 0;
  background-color: ${props => props.theme.colors.background.coolDark};
  text-align: center;
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

const ProcessTimeline = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 0 auto;
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  margin-bottom: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const TimelineIconContainer = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: rgba(139, 69, 19, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 2rem;
  flex-shrink: 0;
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: calc(100% + 3rem - 70px);
    background-color: ${props => props.theme.colors.border};
    display: ${props => props.isLast ? 'none' : 'block'};
  }
  
  svg {
    color: ${props => props.theme.colors.text.secondary};
    font-size: 1.8rem;
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-bottom: 1.5rem;
    margin-right: 0;
    
    &::after {
      display: none;
    }
  }
`;

const TimelineContent = styled.div`
  flex: 1;
  background-color: rgba(30, 30, 30, 0.5);
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 2rem;
  border: 1px solid ${props => props.theme.colors.border};
  
  h3 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 1.8rem;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 1rem;
  }
  
  p {
    color: ${props => props.theme.colors.text.primary};
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
    
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

const MarketingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const MarketingCard = styled(motion.div)`
  background-color: rgba(20, 20, 20, 0.85);
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
        content: '\2022';
        position: absolute;
        left: 0;
        color: ${props => props.theme.colors.primary};
      }
    }
  }
`;

const PricingTitle = styled(motion.h2)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 3rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1.5rem;
`;

const PricingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const PricingCard = styled(motion.div)`
  background-color: rgba(20, 20, 20, 0.85);
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 3rem 2rem;
  border: 1px solid ${props => props.theme.colors.border};
  width: 100%;
  max-width: 800px;
  margin: 3rem auto;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.medium};
  
  ${props => props.popular && `
    border-color: ${props.theme.colors.secondary};
    box-shadow: ${props.theme.shadows.large};
    position: relative;
  `}
`;

const PricingHeader = styled.div`
  margin-bottom: 1.5rem;
  
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
  max-width: 600px;
  margin: 2rem auto;
  
  li {
    padding-left: 1.5rem;
    position: relative;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text.primary};
    
    &::before {
      content: '\2713';
      position: absolute;
      left: 0;
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const PricingButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.tertiary};
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.shadows.small};
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const SellersGuide = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
  
  const [timelineRef, timelineInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [marketingRef, marketingInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const handleDownloadClick = () => {
    setIsModalOpen(true);
  };
  
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  
  const handleDownloadComplete = () => {
    // Open the themed HTML guide in a new tab
    window.open('/sellers-guide.html', '_blank');
  };
  
  const handleGetStartedClick = () => {
    navigate('/contact');
  };
  
  const handleEvaluationClick = () => {
    navigate('/contact');
  };
  
  const [pricingRef, pricingInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [ctaRef, ctaInView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  
  const marketingServices = [
    {
      title: "Professional Photography",
      icon: <FaCamera />,
      content: (
        <>
          <p>
            High-quality, professionally staged photos that showcase your property in its best light. Our photographers
            understand how to capture rural and mountain properties to highlight views, land features, and unique attributes.
          </p>
          <ul>
            <li>Interior and exterior professional shots</li>
            <li>Twilight photography for select properties</li>
            <li>Staging recommendations and assistance</li>
          </ul>
        </>
      )
    },
    {
      title: "Market Analysis",
      icon: <FaChartBar />,
      content: (
        <>
          <p>
            Comprehensive market analysis to properly position and price your property based on current conditions, recent sales,
            and the unique attributes of rural and mountain properties.
          </p>
          <ul>
            <li>Comparative market analysis</li>
            <li>Price trend monitoring</li>
            <li>Strategic positioning recommendations</li>
          </ul>
        </>
      )
    },
    {
      title: "Targeted Advertising",
      icon: <FaAd />,
      content: (
        <>
          <p>
            Precision digital marketing campaigns that target qualified buyers looking specifically for rural and mountain
            properties with your unique features.
          </p>
          <ul>
            <li>Social media advertising</li>
            <li>Paid search campaigns</li>
            <li>Email marketing to buyer database</li>
          </ul>
        </>
      )
    },
    {
      title: "Area Expertise",
      icon: <FaMapMarkedAlt />,
      content: (
        <>
          <p>
            Detailed information about water rights, easements, zoning, and other important aspects of rural property ownership
            that buyers need to understand.
          </p>
          <ul>
            <li>Local area knowledge</li>
            <li>Access to specialized resources</li>
            <li>Community and recreational information</li>
          </ul>
        </>
      )
    },
    {
      title: "Documentation",
      icon: <FaFileAlt />,
      content: (
        <>
          <p>
            Professional property documentation including detailed property features, disclosure preparation, and organization
            of all necessary paperwork for a smooth transaction.
          </p>
          <ul>
            <li>Property feature sheets</li>
            <li>Disclosure assistance</li>
            <li>Document preparation and review</li>
          </ul>
        </>
      )
    },
    {
      title: "Visual Media",
      icon: <FaPhotoVideo />,
      content: (
        <>
          <p>
            High-quality visual content including aerial drone photography and immersive 3D virtual tours that allow buyers
            to experience your property from anywhere.
          </p>
          <ul>
            <li>Aerial drone photography</li>
            <li>3D virtual property tours</li>
            <li>Property video tours</li>
          </ul>
        </>
      )
    }
  ];

  const sellingSteps = [
    {
      icon: <FaHome />,
      title: "1. Property Evaluation",
      content: (
        <>
          <p>We begin with a thorough assessment of your property to understand its unique value proposition:</p>
          <ul>
            <li>On-site property evaluation to identify selling points and improvement opportunities</li>
            <li>Analysis of land attributes, outbuildings, water rights, and other rural features</li>
            <li>Review of documentation and title</li>
            <li>Identification of potential challenges to address before listing</li>
            <li>Preliminary market value estimate based on comparable properties</li>
          </ul>
        </>
      )
    },
    {
      icon: <FaChartLine />,
      title: "2. Pricing Strategy",
      content: (
        <>
          <p>Setting the right price is critical, especially for unique rural and mountain properties:</p>
          <ul>
            <li>Comprehensive market analysis of comparable properties</li>
            <li>Evaluation of current market conditions and trends</li>
            <li>Discussion of pricing strategies (competitive, aggressive, value-range)</li>
            <li>Analysis of potential buyer demographics for your property type</li>
            <li>Strategic price positioning to maximize interest and value</li>
          </ul>
        </>
      )
    },
    {
      icon: <FaCamera />,
      title: "3. Preparation & Presentation",
      content: (
        <>
          <p>We'll help you prepare your property to make the best possible impression:</p>
          <ul>
            <li>Professional photography that highlights your property's best features</li>
            <li>Personalized staging recommendations to enhance appeal</li>
            <li>Drone aerial photography to showcase property boundaries and surroundings</li>
            <li>Compelling property descriptions that tell your home's story</li>
            <li>Virtual tour creation for maximum online engagement</li>
          </ul>
        </>
      )
    },
    {
      icon: <FaAd />,
      title: "4. Marketing & Exposure",
      content: (
        <>
          <p>Our comprehensive marketing strategy ensures maximum visibility to qualified buyers:</p>
          <ul>
            <li>Featured placement on MLS and major real estate platforms</li>
            <li>Social media marketing targeted to likely buyer demographics</li>
            <li>Email campaigns to our database of active buyers and agents</li>
            <li>Custom property website with detailed information</li>
            <li>Strategic open houses and private showings when appropriate</li>
          </ul>
        </>
      )
    },
    {
      icon: <FaHandshake />,
      title: "5. Offer Management & Negotiation",
      content: (
        <>
          <p>When offers arrive, we'll help you navigate the negotiations to maximize your return:</p>
          <ul>
            <li>Thorough evaluation of each offer's terms and contingencies</li>
            <li>Clear explanation of all offer components and implications</li>
            <li>Strategic counter-offer development</li>
            <li>Negotiation of terms beyond just price (timing, contingencies, etc.)</li>
            <li>Multiple offer strategy when applicable</li>
          </ul>
        </>
      )
    },
    {
      icon: <FaFileContract />,
      title: "6. Contract to Closing",
      content: (
        <>
          <p>Once under contract, we'll manage the process to ensure a smooth transaction:</p>
          <ul>
            <li>Coordination of inspections, appraisals, and other contingencies</li>
            <li>Monitoring and enforcement of all contract deadlines</li>
            <li>Negotiation of repair requests when needed</li>
            <li>Regular communication with all parties (buyer's agent, title, lender)</li>
            <li>Pre-closing preparation and final walkthrough coordination</li>
          </ul>
        </>
      )
    },
    {
      icon: <FaMoneyCheckAlt />,
      title: "7. Closing & Beyond",
      content: (
        <>
          <p>We'll ensure a smooth closing and remain a resource for you afterward:</p>
          <ul>
            <li>Review of closing documents for accuracy</li>
            <li>Coordination with escrow and title companies</li>
            <li>Representation at closing if desired</li>
            <li>Assistance with move-out logistics and final property transfer</li>
            <li>Continued support and resources after the sale is complete</li>
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
            Sellers Guide
          </PageTitle>
          <PageDescription
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your roadmap to successfully selling your property in our rural and mountain communities for maximum value with minimum stress.
          </PageDescription>
          <DownloadButton
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadClick}
          >
            <FaDownload />
            Download Sellers Guide
          </DownloadButton>
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
            <h2>The Outrider Approach to Selling</h2>
            <p>
              Selling a property in Anza, Aguanga, Idyllwild, or Mountain Center presents unique challenges and opportunities. 
              Rural and mountain properties often have special features that need to be properly highlighted and explained to 
              potential buyers. Our specialized knowledge of these areas allows us to effectively market your property's 
              unique attributes, from water rights and views to outbuildings and acreage. We understand what buyers in these 
              areas are looking for and how to present your property in its best light.
            </p>
          </IntroText>
          
          <ProcessTimeline ref={timelineRef}>
            {sellingSteps.map((step, index) => (
              <TimelineItem
                key={step.title}
                initial={{ opacity: 0, x: -50 }}
                animate={timelineInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <TimelineIconContainer isLast={index === sellingSteps.length - 1}>
                  {step.icon}
                </TimelineIconContainer>
                <TimelineContent>
                  <h3>{step.title}</h3>
                  {step.content}
                </TimelineContent>
              </TimelineItem>
            ))}
          </ProcessTimeline>
        </ContentContainer>
      </ContentSection>
      
      <MarketingSection>
        <ContentContainer>
          <IntroText
            ref={marketingRef}
            initial={{ opacity: 0, y: 30 }}
            animate={marketingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <h2>Comprehensive Marketing Strategy</h2>
            <p>
              Your property deserves a marketing strategy as unique as its features. Our comprehensive approach ensures maximum exposure to qualified buyers across multiple platforms, from traditional MLS listings to cutting-edge digital marketing.            
            </p>
          </IntroText>
          
          <MarketingGrid>
            {marketingServices.map((service, index) => (
              <MarketingCard
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                animate={marketingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
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
      </MarketingSection>
      
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
            
            <PricingButton onClick={handleGetStartedClick}>Get Started</PricingButton>
          </PricingCard>
        </PricingContainer>
      </PricingSection>
      
      <CTASection>
        <CTAContainer ref={ctaRef}>
          <CTATitle
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            Ready to Sell Your Property?
          </CTATitle>
          <CTAText
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Let's discuss your property and develop a customized selling strategy that will maximize your return. 
            Our expertise in rural and mountain properties ensures your unique property will be properly valued and marketed.
          </CTAText>
          <CTAButton
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEvaluationClick}
          >
            Schedule a Property Evaluation
          </CTAButton>
        </CTAContainer>
      </CTASection>
      
      <NewsletterModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onDownloadComplete={handleDownloadComplete}
        pdfFileName="sellers-guide.html"
      />
    </PageContainer>
  );
};

export default SellersGuide;