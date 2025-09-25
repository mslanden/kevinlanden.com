import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaGavel, FaHome, FaExclamationTriangle, FaBalanceScale, FaEnvelope } from 'react-icons/fa';

const TermsContainer = styled(motion.div)`
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%);
  padding: 8rem 0 4rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 6rem 0 2rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;

  h1 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 3.5rem;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    svg {
      color: ${props => props.theme.colors.primary};
    }

    @media (max-width: ${props => props.theme.breakpoints.md}) {
      font-size: 2.5rem;
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  p {
    font-size: 1.2rem;
    color: ${props => props.theme.colors.text.muted};
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const TermsContent = styled(motion.div)`
  background-color: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 3rem;
  backdrop-filter: blur(10px);

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 2rem;
  }
`;

const Section = styled.section`
  margin-bottom: 3rem;

  &:last-child {
    margin-bottom: 0;
  }

  h2 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 2rem;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;

    svg {
      color: ${props => props.theme.colors.primary};
      font-size: 1.5rem;
    }
  }

  h3 {
    font-size: 1.5rem;
    color: ${props => props.theme.colors.text.secondary};
    margin: 2rem 0 1rem;
  }

  p, li {
    color: ${props => props.theme.colors.text.primary};
    font-size: 1.1rem;
    line-height: 1.7;
    margin-bottom: 1rem;
  }

  ul {
    padding-left: 2rem;
    margin-bottom: 1.5rem;

    li {
      margin-bottom: 0.5rem;
    }
  }

  strong {
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
  }
`;

const LastUpdated = styled.div`
  background-color: rgba(139, 69, 19, 0.1);
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.small};
  padding: 1rem;
  margin-bottom: 3rem;
  text-align: center;
  color: ${props => props.theme.colors.text.muted};
  font-size: 0.95rem;
`;

const WarningBox = styled.div`
  background-color: rgba(255, 193, 7, 0.1);
  border: 1px solid #FFC107;
  border-left: 4px solid #FFC107;
  border-radius: ${props => props.theme.borderRadius.small};
  padding: 1.5rem;
  margin: 2rem 0;

  h4 {
    color: #FFC107;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.2rem;
  }

  p {
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 0;
  }
`;

const ContactInfo = styled.div`
  background-color: rgba(139, 69, 19, 0.1);
  border-left: 4px solid ${props => props.theme.colors.primary};
  padding: 2rem;
  margin-top: 3rem;
  border-radius: 0 ${props => props.theme.borderRadius.small} ${props => props.theme.borderRadius.small} 0;

  h3 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    margin-bottom: 0.5rem;
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const TermsOfService = () => {
  return (
    <TermsContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <ContentWrapper>
        <Header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1>
            <FaGavel />
            Terms of Service
          </h1>
          <p>
            These terms govern your use of our website and real estate services. Please read them carefully.
          </p>
        </Header>

        <TermsContent
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <LastUpdated>
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </LastUpdated>

          <Section>
            <h2>
              <FaBalanceScale />
              Agreement to Terms
            </h2>
            <p>
              By accessing and using the Outrider Real Estate website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p>
              These Terms of Service ("Terms") govern your access to and use of our website, services, and any content provided by Outrider Real Estate ("we," "us," or "our").
            </p>
          </Section>

          <Section>
            <h2>
              <FaHome />
              Real Estate Services
            </h2>
            <p>
              Outrider Real Estate provides professional real estate services in the Anza, Aguanga, Idyllwild, and Mountain Center areas of California.
            </p>

            <h3>Service Description</h3>
            <ul>
              <li><strong>Property Listings:</strong> We provide access to current property listings and market information</li>
              <li><strong>Buyer Representation:</strong> Professional assistance in finding and purchasing properties</li>
              <li><strong>Seller Representation:</strong> Marketing and sale of your property</li>
              <li><strong>Market Analysis:</strong> Comparative market analysis and property valuations</li>
              <li><strong>Consultation Services:</strong> Real estate advice and market insights</li>
            </ul>

            <h3>Professional Standards</h3>
            <p>
              Our services are provided in accordance with California real estate law and the standards of the National Association of Realtors®. We maintain professional liability insurance and adhere to ethical standards in all transactions.
            </p>
          </Section>

          <Section>
            <h2>Website Use</h2>
            <p>
              You may use our website for lawful purposes only. You agree not to use the site:
            </p>
            <ul>
              <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
              <li>To impersonate or attempt to impersonate the company, employees, or other users</li>
              <li>To engage in any other conduct that restricts or inhibits anyone's use of the website</li>
              <li>To interfere with or circumvent security features of the website</li>
            </ul>
          </Section>

          <Section>
            <h2>Property Information Accuracy</h2>
            <WarningBox>
              <h4>
                <FaExclamationTriangle />
                Important Disclaimer
              </h4>
              <p>
                Property information is obtained from sources deemed reliable but is not guaranteed. All dimensions, square footages, and property details should be independently verified. Properties may be subject to prior sale, withdrawal, or price changes.
              </p>
            </WarningBox>

            <h3>MLS Information</h3>
            <p>
              Property listings displayed on our website are provided by the Multiple Listing Service (MLS) and other sources. We make reasonable efforts to ensure accuracy, but information may become outdated or contain errors.
            </p>

            <h3>Your Responsibility</h3>
            <p>
              You should independently verify all property information, including but not limited to:
            </p>
            <ul>
              <li>Property boundaries, square footage, and lot size</li>
              <li>Schools, taxes, and HOA fees</li>
              <li>Zoning, permits, and legal restrictions</li>
              <li>Property condition and required repairs</li>
            </ul>
          </Section>

          <Section>
            <h2>Client Relationships</h2>
            <p>
              Real estate representation relationships are established through separate written agreements. These Terms of Service do not create an agency relationship or fiduciary duty.
            </p>

            <h3>Confidentiality</h3>
            <p>
              We maintain the confidentiality of client information in accordance with California real estate law and our privacy policy.
            </p>

            <h3>Conflicts of Interest</h3>
            <p>
              We will disclose any potential conflicts of interest and obtain appropriate consents as required by law.
            </p>
          </Section>

          <Section>
            <h2>Intellectual Property</h2>
            <p>
              The content, organization, graphics, design, compilation, and other matters related to this website are protected under applicable copyrights, trademarks, and other proprietary rights.
            </p>
            <ul>
              <li><strong>Website Content:</strong> All text, images, logos, and design elements are owned by Outrider Real Estate or licensed for use</li>
              <li><strong>Property Photos:</strong> Property images may be subject to copyright by photographers or property owners</li>
              <li><strong>MLS Data:</strong> MLS information is provided under license and subject to MLS terms of use</li>
            </ul>
          </Section>

          <Section>
            <h2>Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Outrider Real Estate shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul>
              <li>Loss of profits, revenue, or business opportunities</li>
              <li>Errors or inaccuracies in property information</li>
              <li>Technical issues or website downtime</li>
              <li>Third-party actions or content</li>
            </ul>
          </Section>

          <Section>
            <h2>Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Outrider Real Estate and its employees from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees arising out of or relating to your violation of these Terms or your use of the website.
            </p>
          </Section>

          <Section>
            <h2>Privacy Policy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the website, to understand our practices.
            </p>
          </Section>

          <Section>
            <h2>Modifications</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on the website. Your continued use of the website after changes are posted constitutes your acceptance of the modified Terms.
            </p>
          </Section>

          <Section>
            <h2>Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles. Any legal action relating to these Terms shall be brought in the appropriate courts of Riverside County, California.
            </p>
          </Section>

          <Section>
            <h2>Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that the Terms shall otherwise remain in full force and effect.
            </p>
          </Section>

          <ContactInfo>
            <h3>
              <FaEnvelope />
              Contact Information
            </h3>
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:kevin.landen@outriderrealty.com">kevin.landen@outriderrealty.com</a><br />
              <strong>Phone:</strong> <a href="tel:+19514914890">(951) 491-4890</a><br />
              <strong>Address:</strong> Outrider Real Estate, Anza, CA<br />
              <strong>License:</strong> California DRE License #02140923
            </p>
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(139, 69, 19, 0.3)', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              <p>
                <strong>Website Development:</strong> For website-related questions or technical support, contact <a href="mailto:contact@marcelinolanden.com" style={{ color: '#8B4513' }}>Marcelino Landen</a> at <a href="https://marcelinolanden.com" target="_blank" rel="noopener noreferrer" style={{ color: '#8B4513' }}>marcelinolanden.com</a>
              </p>
            </div>
          </ContactInfo>
        </TermsContent>
      </ContentWrapper>
    </TermsContainer>
  );
};

export default TermsOfService;