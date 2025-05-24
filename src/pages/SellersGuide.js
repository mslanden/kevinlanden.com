import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaHome, FaCamera, FaChartLine, FaAd, FaHandshake, FaFileContract, FaMoneyCheckAlt } from 'react-icons/fa';

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

const QuoteBox = styled(motion.div)`
  max-width: 800px;
  margin: 4rem auto;
  padding: 3rem;
  background-color: rgba(30, 30, 30, 0.8);
  border-radius: ${props => props.theme.borderRadius.large};
  border: 1px solid ${props => props.theme.colors.border};
  text-align: center;
  position: relative;
  
  &::before {
    content: '"';
    position: absolute;
    top: -30px;
    left: 30px;
    font-size: 8rem;
    font-family: ${props => props.theme.fonts.heading};
    color: ${props => props.theme.colors.primary};
    opacity: 0.3;
    line-height: 1;
  }
  
  h3 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 2rem;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 1.5rem;
  }
  
  p {
    font-size: 1.1rem;
    color: ${props => props.theme.colors.text.primary};
    font-style: italic;
  }
  
  .highlight {
    color: ${props => props.theme.colors.text.secondary};
    font-weight: bold;
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

const SellersGuide = () => {
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
  
  const [quoteRef, quoteInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [ctaRef, ctaInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
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
          
          <QuoteBox
            ref={quoteRef}
            initial={{ opacity: 0, y: 30 }}
            animate={quoteInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <h3>The Outrider Difference</h3>
            <p>
              <span className="highlight">No contract commitments</span> - weekly updates on market status, 
              every home gets all marketing to secure top dollar. 
              <span className="highlight"> Just 1% to list</span> your property (7k minimum).
            </p>
          </QuoteBox>
        </ContentContainer>
      </ContentSection>
      
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
          >
            Schedule a Property Evaluation
          </CTAButton>
        </CTAContainer>
      </CTASection>
    </PageContainer>
  );
};

export default SellersGuide;