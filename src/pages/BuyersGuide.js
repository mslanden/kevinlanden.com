import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaHandshake, FaFileSignature, FaMoneyBillWave, FaKey, FaDownload } from 'react-icons/fa';
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
    background-image: url('/images/ranch-home.jpg');
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

const BuyersGuide = () => {
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
  
  const [ctaRef, ctaInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const handleDownloadClick = () => {
    setIsModalOpen(true);
  };
  
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  
  const handleDownloadComplete = () => {
    // Open the themed HTML guide in a new tab
    window.open('/buyers-guide.html', '_blank');
  };
  
  const handleConsultationClick = () => {
    navigate('/contact');
  };
  
  const buyingSteps = [
    {
      icon: <FaSearch />,
      title: "1. Needs Assessment",
      content: (
        <>
          <p>The first step in your home buying journey is understanding exactly what you're looking for. We'll discuss:</p>
          <ul>
            <li>Property requirements (bedrooms, bathrooms, acreage, etc.)</li>
            <li>Location preferences within our service areas</li>
            <li>Must-have features and deal-breakers</li>
            <li>Budget considerations and financing options</li>
            <li>Timeline for your move</li>
          </ul>
        </>
      )
    },
    {
      icon: <FaMoneyBillWave />,
      title: "2. Financing Pre-Approval",
      content: (
        <>
          <p>Getting pre-approved for financing is crucial before beginning your search in today's competitive market.</p>
          <ul>
            <li>We'll connect you with trusted local lenders familiar with rural properties</li>
            <li>Determine your exact budget and purchasing power</li>
            <li>Explore conventional, FHA, VA, and rural development loan options</li>
            <li>Understand closing costs and down payment requirements</li>
            <li>Get a pre-approval letter to strengthen your offer</li>
          </ul>
        </>
      )
    },
    {
      icon: <FaHome />,
      title: "3. Property Search",
      content: (
        <>
          <p>Now for the exciting part - finding your ideal property! Our process includes:</p>
          <ul>
            <li>Access to MLS listings plus off-market opportunities</li>
            <li>Property tours at your convenience</li>
            <li>Expert guidance on evaluating rural properties (water rights, septic systems, etc.)</li>
            <li>Assessment of property values and potential appreciation</li>
            <li>Weekly updates on new listings matching your criteria</li>
          </ul>
        </>
      )
    },
    {
      icon: <FaHandshake />,
      title: "4. Making an Offer",
      content: (
        <>
          <p>When you find the right property, we'll craft a competitive offer strategy:</p>
          <ul>
            <li>Comprehensive market analysis to determine fair offer price</li>
            <li>Strategic negotiation of terms and contingencies</li>
            <li>Guidance on earnest money deposits</li>
            <li>Clear explanation of all contractual obligations</li>
            <li>Negotiation of seller concessions when appropriate</li>
          </ul>
        </>
      )
    },
    {
      icon: <FaFileSignature />,
      title: "5. Due Diligence & Escrow",
      content: (
        <>
          <p>Once your offer is accepted, we'll guide you through the critical inspection and escrow period:</p>
          <ul>
            <li>Coordination of property inspections with qualified professionals</li>
            <li>Review of property disclosures and title documents</li>
            <li>Negotiation of repair requests if needed</li>
            <li>Monitoring of all contingency deadlines</li>
            <li>Regular updates on escrow progress</li>
          </ul>
        </>
      )
    },
    {
      icon: <FaKey />,
      title: "6. Closing & Beyond",
      content: (
        <>
          <p>The final step is closing on your new property and ensuring a smooth transition:</p>
          <ul>
            <li>Final walkthrough of the property</li>
            <li>Review of closing documents and figures</li>
            <li>Coordination with lender, title company, and escrow officer</li>
            <li>Key transfer and possession arrangements</li>
            <li>Continued support after closing with local vendor recommendations and assistance</li>
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
            Buyers Guide
          </PageTitle>
          <PageDescription
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your comprehensive roadmap to finding and purchasing the perfect property in our beautiful mountain and rural communities.
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
            Download Buyers Guide
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
            <h2>The Outrider Approach to Buying</h2>
            <p>
              Purchasing a home in Anza, Aguanga, Idyllwild, or Mountain Center offers unique opportunities and challenges. 
              Rural and mountain properties often come with considerations that don't apply to typical suburban homes. 
              Our team specializes in these areas and will guide you through every aspect of the process, from water rights 
              and road access to power sources and internet availability. Let us be your outrider, scouting ahead to ensure 
              a smooth journey to homeownership.
            </p>
          </IntroText>
          
          <ProcessTimeline ref={timelineRef}>
            {buyingSteps.map((step, index) => (
              <TimelineItem
                key={step.title}
                initial={{ opacity: 0, x: -50 }}
                animate={timelineInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <TimelineIconContainer isLast={index === buyingSteps.length - 1}>
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
      
      <CTASection>
        <CTAContainer ref={ctaRef}>
          <CTATitle
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            Ready to Find Your Dream Property?
          </CTATitle>
          <CTAText
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Let's discuss your home buying goals and get you on the path to finding your perfect property. 
            Our knowledge of the local market and rural property considerations will save you time, money, and stress.
          </CTAText>
          <CTAButton
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConsultationClick}
          >
            Schedule a Consultation
          </CTAButton>
        </CTAContainer>
      </CTASection>
      
      <NewsletterModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onDownloadComplete={handleDownloadComplete}
        pdfFileName="buyers-guide.html"
      />
    </PageContainer>
  );
};

export default BuyersGuide;