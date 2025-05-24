import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaMoneyBillWave, FaHandshake, FaUserFriends, FaClipboardCheck } from 'react-icons/fa';

const AffiliateSection = styled.section`
  padding: 8rem 0;
  background-color: #1a1a1a;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/rustic-texture.jpg');
    background-size: cover;
    opacity: 0.1;
    z-index: 1;
  }
`;

const AffiliateContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 2;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: linear-gradient(to right, transparent, ${props => props.theme.colors.primary}, transparent);
  }
`;

const SectionTitle = styled(motion.h2)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 3rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  letter-spacing: 2px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text.muted};
  max-width: 700px;
  margin: 0 auto;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const AffiliateInfo = styled(motion.div)`
  color: ${props => props.theme.colors.text.primary};
  
  p {
    margin-bottom: 1.5rem;
    line-height: 1.8;
    font-size: 1.05rem;
  }
`;

const AffiliateBenefits = styled(motion.div)`
  background-color: rgba(30, 30, 30, 0.8);
  padding: 3rem;
  border-radius: ${props => props.theme.borderRadius.large};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.large};
`;

const BenefitsTitle = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 2rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 2rem;
  text-align: center;
`;

const BenefitsList = styled.div`
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

const SignupForm = styled(motion.form)`
  margin-top: 5rem;
  padding: 3rem;
  background-color: rgba(30, 30, 30, 0.8);
  border-radius: ${props => props.theme.borderRadius.large};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.large};
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const FormTitle = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 2rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 2rem;
  text-align: center;
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
  
  &.full-width {
    grid-column: 1 / -1;
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
  font-family: ${props => props.theme.fonts.body};
  margin-top: 1rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.tertiary};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Affiliate = () => {
  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [infoRef, infoInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [benefitsRef, benefitsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [formRef, formInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const benefitVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.6,
      },
    }),
  };
  
  const benefits = [
    {
      icon: <FaMoneyBillWave />,
      title: 'Generous Commissions',
      description: 'Earn competitive referral fees for each successful transaction that originates from your referral.'
    },
    {
      icon: <FaHandshake />,
      title: 'Easy Partnership',
      description: 'Simple process with minimal paperwork - just refer clients and we handle the rest.'
    },
    {
      icon: <FaUserFriends />,
      title: 'No Limits',
      description: 'No cap on the number of referrals or commissions you can earn.'
    },
    {
      icon: <FaClipboardCheck />,
      title: 'Full Transparency',
      description: 'Regular updates on your referrals\' progress and detailed reporting of your earnings.'
    }
  ];
  
  return (
    <AffiliateSection id="affiliate">
      <AffiliateContainer>
        <SectionHeader>
          <SectionTitle
            ref={titleRef}
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            Join Our Affiliate Program
          </SectionTitle>
          <SectionSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Partner with us and earn rewards for successful referrals
          </SectionSubtitle>
        </SectionHeader>
        
        <ContentWrapper>
          <AffiliateInfo
            ref={infoRef}
            initial={{ opacity: 0, x: -50 }}
            animate={infoInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <p>
              The Outrider Affiliate Program is designed for real estate professionals, business owners, and individuals who want to earn by referring clients to our services. Whether you're a financial advisor, attorney, home inspector, or just someone with a network of potential homebuyers or sellers, you can benefit from our program.
            </p>
            <p>
              When you refer a client who successfully completes a transaction with us, you'll receive a competitive referral fee as a thank you for your trust. We pride ourselves on providing exceptional service to every referred client, ensuring they have a positive experience that reflects well on you.
            </p>
            <p>
              Our program requires no upfront costs or ongoing fees. It's a simple way to add value to your existing relationships while generating additional income. Plus, you'll be connecting your network with a real estate professional who understands the unique challenges and opportunities of our local market.
            </p>
          </AffiliateInfo>
          
          <AffiliateBenefits
            ref={benefitsRef}
            initial={{ opacity: 0, x: 50 }}
            animate={benefitsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
          >
            <BenefitsTitle>Program Benefits</BenefitsTitle>
            
            <BenefitsList>
              {benefits.map((benefit, index) => (
                <BenefitItem
                  key={benefit.title}
                  custom={index}
                  initial="hidden"
                  animate={benefitsInView ? "visible" : "hidden"}
                  variants={benefitVariants}
                >
                  <BenefitIcon>{benefit.icon}</BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>{benefit.title}</BenefitTitle>
                    <BenefitDescription>{benefit.description}</BenefitDescription>
                  </BenefitContent>
                </BenefitItem>
              ))}
            </BenefitsList>
          </AffiliateBenefits>
        </ContentWrapper>
        
        <SignupForm
          ref={formRef}
          initial={{ opacity: 0, y: 50 }}
          animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <FormTitle>Become an Affiliate</FormTitle>
          
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
        </SignupForm>
      </AffiliateContainer>
    </AffiliateSection>
  );
};

export default Affiliate;