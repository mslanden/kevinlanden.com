import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaMoneyBillWave, FaHandshake, FaUserFriends, FaClipboardCheck, FaCheckCircle, FaUserTie } from 'react-icons/fa';

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
    background-image: url('/images/handshake.jpg');
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

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const InfoText = styled(motion.div)`
  color: ${props => props.theme.colors.text.primary};
  
  p {
    margin-bottom: 1.5rem;
    line-height: 1.8;
  }
  
  h3 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 1.8rem;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 1.5rem;
    position: relative;
    padding-bottom: 0.8rem;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 3px;
      background-color: ${props => props.theme.colors.primary};
    }
  }
  
  ul {
    list-style-type: none;
    padding: 0;
    margin-bottom: 2rem;
    
    li {
      padding-left: 2rem;
      position: relative;
      margin-bottom: 1rem;
      
      &::before {
        content: '→';
        position: absolute;
        left: 0;
        color: ${props => props.theme.colors.primary};
        font-weight: bold;
      }
    }
  }
`;

const BenefitsList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BenefitItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  padding: 1.5rem;
  background-color: rgba(50, 50, 50, 0.5);
  border-radius: ${props => props.theme.borderRadius.default};
  border: 1px solid rgba(210, 180, 140, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
    border-color: ${props => props.theme.colors.border};
    background-color: rgba(60, 60, 60, 0.5);
  }
`;

const BenefitIcon = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: rgba(139, 69, 19, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.theme.colors.border};
  flex-shrink: 0;
  
  svg {
    color: ${props => props.theme.colors.text.secondary};
    font-size: 1.3rem;
  }
`;

const BenefitContent = styled.div`
  flex: 1;
`;

const BenefitTitle = styled.h4`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.3rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const BenefitDescription = styled.p`
  color: ${props => props.theme.colors.text.primary};
  font-size: 1rem;
  line-height: 1.6;
`;

const HowItWorksSection = styled.section`
  padding: 5rem 0;
  background-color: rgba(30, 30, 30, 0.3);
`;

const StepsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const StepsTitle = styled(motion.h2)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 2.5rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 3rem;
  text-align: center;
`;

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const StepCard = styled(motion.div)`
  background-color: rgba(40, 40, 40, 0.6);
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 2rem;
  border: 1px solid ${props => props.theme.colors.border};
  text-align: center;
  height: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.5rem;
  color: white;
  font-weight: bold;
`;

const StepTitle = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1rem;
`;

const StepDescription = styled.p`
  color: ${props => props.theme.colors.text.primary};
  line-height: 1.7;
`;

const AffiliateTypes = styled.section`
  padding: 5rem 0;
  background-color: ${props => props.theme.colors.background.dark};
`;

const TypesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const TypesTitle = styled(motion.h2)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 2.5rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const TypesSubtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text.primary};
  max-width: 800px;
  margin: 0 auto 3rem;
  text-align: center;
  line-height: 1.7;
`;

const TypesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const TypeCard = styled(motion.div)`
  background-color: rgba(30, 30, 30, 0.6);
  border-radius: ${props => props.theme.borderRadius.default};
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
  height: 100%;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
    border-color: ${props => props.theme.colors.secondary};
  }
`;

const TypeHeader = styled.div`
  background-color: rgba(139, 69, 19, 0.2);
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const TypeIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: rgba(30, 30, 30, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  
  svg {
    color: ${props => props.theme.colors.text.secondary};
    font-size: 2rem;
  }
`;

const TypeTitle = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text.secondary};
  margin: 0;
`;

const TypeContent = styled.div`
  padding: 1.5rem;
  
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
        content: '✓';
        position: absolute;
        left: 0;
        color: ${props => props.theme.colors.secondary};
      }
    }
  }
`;

const FormSection = styled.section`
  padding: 5rem 0;
  background-color: rgba(30, 30, 30, 0.3);
`;

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const FormTitle = styled(motion.h2)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 2.5rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FormSubtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text.primary};
  max-width: 600px;
  margin: 0 auto 3rem;
  text-align: center;
  line-height: 1.7;
`;

const Form = styled(motion.form)`
  background-color: rgba(40, 40, 40, 0.6);
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 3rem;
  border: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 2rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  &.full-width {
    grid-column: 1 / -1;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.colors.text.secondary};
    font-weight: 500;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 0.8rem 1rem;
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: ${props => props.theme.borderRadius.default};
    color: white;
    font-family: ${props => props.theme.fonts.body};
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.secondary};
    }
  }
  
  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

const SubmitButton = styled.button`
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
  margin-top: 1rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.tertiary};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.small};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const AffiliatePage = () => {
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
  
  const [benefitsRef, benefitsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [stepsRef, stepsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [typesRef, typesInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [formRef, formInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const benefits = [
    {
      icon: <FaMoneyBillWave />,
      title: "Generous Commissions",
      description: "Earn competitive referral fees for each successful transaction that originates from your referral."
    },
    {
      icon: <FaHandshake />,
      title: "Easy Partnership",
      description: "Simple process with minimal paperwork - just refer clients and we handle the rest."
    },
    {
      icon: <FaUserFriends />,
      title: "No Limits",
      description: "No cap on the number of referrals or commissions you can earn."
    },
    {
      icon: <FaClipboardCheck />,
      title: "Full Transparency",
      description: "Regular updates on your referrals' progress and detailed reporting of your earnings."
    }
  ];
  
  const steps = [
    {
      number: 1,
      title: "Apply",
      description: "Fill out our simple application form with your information and how you plan to refer clients."
    },
    {
      number: 2,
      title: "Get Approved",
      description: "We'll review your application and get back to you within 48 hours with your affiliate details."
    },
    {
      number: 3,
      title: "Refer Clients",
      description: "Introduce potential buyers or sellers to us via email, phone, or our online referral form."
    },
    {
      number: 4,
      title: "Stay Updated",
      description: "Receive regular updates on your referral's status throughout the transaction process."
    },
    {
      number: 5,
      title: "Get Paid",
      description: "Earn your commission once the transaction successfully closes. It's that simple!"
    }
  ];
  
  const affiliateTypes = [
    {
      icon: <FaUserTie />,
      title: "Real Estate Professionals",
      content: (
        <>
          <p>Perfect for real estate agents from other markets, brokers, property managers, and other industry professionals.</p>
          <ul>
            <li>Referral fees for out-of-area clients</li>
            <li>Opportunity to earn on transactions outside your specialty</li>
            <li>Professional handling of your valued clients</li>
            <li>Regular communication throughout the process</li>
          </ul>
        </>
      )
    },
    {
      icon: <FaHandshake />,
      title: "Business Partners",
      content: (
        <>
          <p>Ideal for financial advisors, attorneys, home inspectors, contractors, and other service providers who interact with potential real estate clients.</p>
          <ul>
            <li>Add value to your client relationships</li>
            <li>Earn additional income from existing clients</li>
            <li>Professional real estate service for your referrals</li>
            <li>Enhance your service offering</li>
          </ul>
        </>
      )
    },
    {
      icon: <FaUserFriends />,
      title: "Individual Affiliates",
      content: (
        <>
          <p>For anyone with a network of contacts who might be buying or selling property in our service area.</p>
          <ul>
            <li>Turn your connections into earnings</li>
            <li>Help friends and family with their real estate needs</li>
            <li>No real estate knowledge or license required</li>
            <li>Simple referral process</li>
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
            Affiliate Program
          </PageTitle>
          <PageDescription
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Partner with us and earn rewards for successful real estate referrals. Our program is designed for professionals, businesses, and individuals alike.
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
            <h2>Join Our Affiliate Program</h2>
            <p>
              The Outrider Affiliate Program is designed for real estate professionals, business owners, and individuals who want to earn by referring clients to our services. 
              Whether you're a financial advisor, attorney, home inspector, or just someone with a network of potential homebuyers or sellers, 
              you can benefit from our program.
            </p>
          </IntroText>
          
          <TwoColumnGrid>
            <InfoText
              initial={{ opacity: 0, x: -50 }}
              animate={introInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h3>Why Partner With Us?</h3>
              <p>
                When you refer a client who successfully completes a transaction with us, you'll receive a competitive referral fee as a thank you for your trust. 
                We pride ourselves on providing exceptional service to every referred client, ensuring they have a positive experience that reflects well on you.
              </p>
              <p>
                Our program requires no upfront costs or ongoing fees. It's a simple way to add value to your existing relationships while generating additional income. 
                Plus, you'll be connecting your network with a real estate professional who understands the unique challenges and opportunities of our local market.
              </p>
              
              <h3>What Sets Our Program Apart</h3>
              <ul>
                <li>Competitive referral fees paid promptly upon closing</li>
                <li>No complicated contracts or long-term commitments</li>
                <li>Regular updates on your referrals' progress</li>
                <li>Marketing materials to help you promote the program</li>
                <li>Dedicated affiliate support for questions and assistance</li>
                <li>Your clients receive our full-service approach at a competitive 1% listing fee</li>
              </ul>
            </InfoText>
            
            <BenefitsList
              ref={benefitsRef}
              initial="hidden"
              animate={benefitsInView ? "visible" : "hidden"}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
            >
              {benefits.map((benefit, index) => (
                <BenefitItem
                  key={benefit.title}
                  variants={{
                    hidden: { opacity: 0, x: 50 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                  }}
                >
                  <BenefitIcon>{benefit.icon}</BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>{benefit.title}</BenefitTitle>
                    <BenefitDescription>{benefit.description}</BenefitDescription>
                  </BenefitContent>
                </BenefitItem>
              ))}
            </BenefitsList>
          </TwoColumnGrid>
        </ContentContainer>
      </ContentSection>
      
      <HowItWorksSection>
        <StepsContainer ref={stepsRef}>
          <StepsTitle
            initial={{ opacity: 0, y: 30 }}
            animate={stepsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            How It Works
          </StepsTitle>
          
          <StepsGrid>
            {steps.map((step, index) => (
              <StepCard
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={stepsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <StepNumber>{step.number}</StepNumber>
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </StepCard>
            ))}
          </StepsGrid>
        </StepsContainer>
      </HowItWorksSection>
      
      <AffiliateTypes>
        <TypesContainer ref={typesRef}>
          <TypesTitle
            initial={{ opacity: 0, y: 30 }}
            animate={typesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            Who Can Join
          </TypesTitle>
          
          <TypesSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={typesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Our affiliate program is designed to be inclusive and beneficial for various professionals and individuals. 
            See which category fits you best.
          </TypesSubtitle>
          
          <TypesGrid>
            {affiliateTypes.map((type, index) => (
              <TypeCard
                key={type.title}
                initial={{ opacity: 0, y: 50 }}
                animate={typesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <TypeHeader>
                  <TypeIcon>{type.icon}</TypeIcon>
                  <TypeTitle>{type.title}</TypeTitle>
                </TypeHeader>
                <TypeContent>
                  {type.content}
                </TypeContent>
              </TypeCard>
            ))}
          </TypesGrid>
        </TypesContainer>
      </AffiliateTypes>
      
      <FormSection>
        <FormContainer ref={formRef}>
          <FormTitle
            initial={{ opacity: 0, y: 30 }}
            animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            Become an Affiliate
          </FormTitle>
          
          <FormSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Ready to start earning? Fill out the form below to apply for our affiliate program. We'll review your application and get back to you within 48 hours.
          </FormSubtitle>
          
          <Form
            initial={{ opacity: 0, y: 30 }}
            animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <FormGrid>
              <FormGroup>
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" required />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" required />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="business">Business Name (if applicable)</label>
                <input type="text" id="business" name="business" />
              </FormGroup>
              
              <FormGroup className="full-width">
                <label htmlFor="referralType">How will you refer clients?</label>
                <select id="referralType" name="referralType" required>
                  <option value="">Select an option</option>
                  <option value="realtor">I'm a Realtor</option>
                  <option value="professional">I'm a related professional (attorney, lender, etc.)</option>
                  <option value="business">I own a local business</option>
                  <option value="personal">Personal network</option>
                  <option value="other">Other</option>
                </select>
              </FormGroup>
              
              <FormGroup className="full-width">
                <label htmlFor="message">Additional Information</label>
                <textarea id="message" name="message" placeholder="Tell us a bit about yourself and how you plan to refer clients"></textarea>
              </FormGroup>
            </FormGrid>
            
            <SubmitButton type="submit">Submit Application</SubmitButton>
          </Form>
        </FormContainer>
      </FormSection>
    </PageContainer>
  );
};

export default AffiliatePage;