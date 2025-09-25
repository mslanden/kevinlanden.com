import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaCookie, FaUserShield, FaEnvelope } from 'react-icons/fa';

const PolicyContainer = styled(motion.div)`
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

const PolicyContent = styled(motion.div)`
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

const PrivacyPolicy = () => {
  return (
    <PolicyContainer
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
            <FaShieldAlt />
            Privacy Policy
          </h1>
          <p>
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
        </Header>

        <PolicyContent
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
              <FaUserShield />
              Information We Collect
            </h2>
            <p>
              Outrider Real Estate collects information to provide better services to our users and clients. We collect information in the following ways:
            </p>

            <h3>Personal Information You Provide</h3>
            <ul>
              <li><strong>Contact Information:</strong> Name, email address, phone number when you contact us or subscribe to our newsletter</li>
              <li><strong>Property Preferences:</strong> Information about properties you're interested in, budget, and location preferences</li>
              <li><strong>Communication Records:</strong> Messages, emails, and call records for service improvement and compliance</li>
            </ul>

            <h3>Information Automatically Collected</h3>
            <ul>
              <li><strong>Usage Data:</strong> Pages visited, time spent, and interaction patterns on our website</li>
              <li><strong>Device Information:</strong> Browser type, IP address, operating system, and device identifiers</li>
              <li><strong>Location Data:</strong> General geographic location for relevant property recommendations</li>
            </ul>
          </Section>

          <Section>
            <h2>
              <FaCookie />
              How We Use Your Information
            </h2>
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li><strong>Service Provision:</strong> To provide real estate services, property searches, and market analysis</li>
              <li><strong>Communication:</strong> To respond to inquiries, provide updates, and send relevant property information</li>
              <li><strong>Marketing:</strong> To send newsletters, market reports, and promotional materials (with your consent)</li>
              <li><strong>Website Improvement:</strong> To analyze usage patterns and improve user experience</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our legitimate interests</li>
            </ul>
          </Section>

          <Section>
            <h2>Information Sharing</h2>
            <p>We do not sell, rent, or trade your personal information. We may share information only in these circumstances:</p>
            <ul>
              <li><strong>Service Providers:</strong> With trusted partners who assist in providing our services (MLS systems, email platforms)</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and safety</li>
              <li><strong>Business Transfer:</strong> In the event of a merger, acquisition, or sale of business assets</li>
              <li><strong>Consent:</strong> With your explicit permission for specific purposes</li>
            </ul>
          </Section>

          <Section>
            <h2>Data Protection & Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction:
            </p>
            <ul>
              <li><strong>Encryption:</strong> Data transmission is secured using SSL/TLS encryption</li>
              <li><strong>Access Controls:</strong> Limited access to personal data on a need-to-know basis</li>
              <li><strong>Regular Updates:</strong> Security systems and protocols are regularly updated</li>
              <li><strong>Staff Training:</strong> Our team is trained on privacy and security best practices</li>
            </ul>
          </Section>

          <Section>
            <h2>Your Rights & Choices</h2>
            <p>You have the following rights regarding your personal information:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal information we have about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
              <li><strong>Data Portability:</strong> Request your data in a structured, commonly used format</li>
            </ul>
          </Section>

          <Section>
            <h2>Cookies & Tracking</h2>
            <p>
              Our website uses cookies and similar technologies to enhance your browsing experience:
            </p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for website functionality and security</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
              <li><strong>Marketing Cookies:</strong> Used to provide relevant advertisements and content</li>
            </ul>
            <p>
              You can control cookie settings through your browser preferences. Note that disabling certain cookies may affect website functionality.
            </p>
          </Section>

          <Section>
            <h2>Third-Party Services</h2>
            <p>Our website may contain links to third-party websites or services, including:</p>
            <ul>
              <li><strong>MLS Platforms:</strong> For property listings and market data</li>
              <li><strong>Social Media:</strong> Links to our social media profiles</li>
              <li><strong>Analytics Services:</strong> Google Analytics for website performance analysis</li>
            </ul>
            <p>
              These third parties have their own privacy policies, and we are not responsible for their practices.
            </p>
          </Section>

          <Section>
            <h2>Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us immediately.
            </p>
          </Section>

          <Section>
            <h2>California Privacy Rights</h2>
            <p>
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul>
              <li>Right to know what personal information is collected</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of the sale of personal information</li>
              <li>Right to non-discrimination for exercising your privacy rights</li>
            </ul>
          </Section>

          <Section>
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements.
              We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date.
            </p>
          </Section>

          <ContactInfo>
            <h3>
              <FaEnvelope />
              Contact Us
            </h3>
            <p>
              If you have questions about this Privacy Policy or how we handle your personal information, please contact us:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:kevin.landen@outriderrealty.com">kevin.landen@outriderrealty.com</a><br />
              <strong>Phone:</strong> <a href="tel:+19514914890">(951) 491-4890</a><br />
              <strong>Address:</strong> Outrider Real Estate, Anza, CA
            </p>
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(139, 69, 19, 0.3)', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              <p>
                <strong>Website Development:</strong> For website-related questions or technical support, contact <a href="mailto:contact@marcelinolanden.com" style={{ color: '#8B4513' }}>Marcelino Landen</a> at <a href="https://marcelinolanden.com" target="_blank" rel="noopener noreferrer" style={{ color: '#8B4513' }}>marcelinolanden.com</a>
              </p>
            </div>
          </ContactInfo>
        </PolicyContent>
      </ContentWrapper>
    </PolicyContainer>
  );
};

export default PrivacyPolicy;