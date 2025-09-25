import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUniversalAccess, FaEye, FaKeyboard, FaMobileAlt, FaEnvelope, FaExclamationCircle } from 'react-icons/fa';

const AccessibilityContainer = styled(motion.div)`
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

const AccessibilityContent = styled(motion.div)`
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

const CommitmentBox = styled.div`
  background-color: rgba(76, 175, 80, 0.1);
  border: 1px solid #4CAF50;
  border-left: 4px solid #4CAF50;
  border-radius: ${props => props.theme.borderRadius.small};
  padding: 2rem;
  margin: 2rem 0;

  h3 {
    color: #4CAF50;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.3rem;
  }

  p {
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
`;

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
`;

const FeatureCard = styled.div`
  background-color: rgba(139, 69, 19, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 1.5rem;

  h4 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.2rem;
  }

  ul {
    padding-left: 1rem;
    margin: 0;

    li {
      color: ${props => props.theme.colors.text.primary};
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }
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

const Accessibility = () => {
  return (
    <AccessibilityContainer
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
            <FaUniversalAccess />
            Accessibility Statement
          </h1>
          <p>
            Outrider Real Estate is committed to ensuring digital accessibility for all users, including people with disabilities.
          </p>
        </Header>

        <AccessibilityContent
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <CommitmentBox>
            <h3>
              <FaUniversalAccess />
              Our Commitment
            </h3>
            <p>
              We are committed to providing an inclusive digital experience for all users, regardless of ability. We believe everyone should have equal access to information about real estate opportunities in our community.
            </p>
            <p>
              Our website aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards to ensure accessibility for people with disabilities.
            </p>
          </CommitmentBox>

          <Section>
            <h2>Accessibility Features</h2>
            <p>
              We have implemented numerous accessibility features to make our website usable by people with various disabilities:
            </p>

            <FeatureList>
              <FeatureCard>
                <h4>
                  <FaEye />
                  Visual Accessibility
                </h4>
                <ul>
                  <li>High contrast color schemes</li>
                  <li>Scalable fonts and clear typography</li>
                  <li>Alternative text for images</li>
                  <li>Keyboard navigation support</li>
                  <li>Focus indicators for interactive elements</li>
                </ul>
              </FeatureCard>

              <FeatureCard>
                <h4>
                  <FaKeyboard />
                  Navigation
                </h4>
                <ul>
                  <li>Tab navigation through all interactive elements</li>
                  <li>Skip links to main content</li>
                  <li>Logical heading structure</li>
                  <li>Consistent navigation patterns</li>
                  <li>Clear link descriptions</li>
                </ul>
              </FeatureCard>

              <FeatureCard>
                <h4>
                  <FaMobileAlt />
                  Responsive Design
                </h4>
                <ul>
                  <li>Mobile-friendly interface</li>
                  <li>Touch-friendly controls</li>
                  <li>Scalable content for different screen sizes</li>
                  <li>Optimized for various devices</li>
                  <li>Fast loading times</li>
                </ul>
              </FeatureCard>
            </FeatureList>
          </Section>

          <Section>
            <h2>Standards Compliance</h2>
            <p>
              Our website strives to comply with accessibility standards and guidelines:
            </p>
            <ul>
              <li><strong>WCAG 2.1 Level AA:</strong> We aim to meet the Web Content Accessibility Guidelines at the AA conformance level</li>
              <li><strong>Section 508:</strong> Compliance with federal accessibility requirements</li>
              <li><strong>ADA Compliance:</strong> Following Americans with Disabilities Act digital accessibility principles</li>
            </ul>

            <h3>Ongoing Improvements</h3>
            <p>
              Web accessibility is an ongoing effort. We regularly:
            </p>
            <ul>
              <li>Audit our website for accessibility issues</li>
              <li>Update content and features to improve accessibility</li>
              <li>Test with assistive technologies</li>
              <li>Incorporate user feedback into improvements</li>
            </ul>
          </Section>

          <Section>
            <h2>Assistive Technologies</h2>
            <p>
              Our website is designed to be compatible with assistive technologies, including:
            </p>
            <ul>
              <li><strong>Screen Readers:</strong> JAWS, NVDA, VoiceOver, and similar software</li>
              <li><strong>Voice Recognition:</strong> Dragon NaturallySpeaking and similar programs</li>
              <li><strong>Keyboard Navigation:</strong> For users who cannot use a mouse</li>
              <li><strong>Screen Magnification:</strong> ZoomText and similar tools</li>
            </ul>
          </Section>

          <Section>
            <h2>Property Information Accessibility</h2>
            <p>
              We make special efforts to ensure property information is accessible:
            </p>
            <ul>
              <li><strong>Property Photos:</strong> All images include descriptive alternative text</li>
              <li><strong>Property Details:</strong> Information is structured with clear headings and labels</li>
              <li><strong>Contact Forms:</strong> Forms include proper labels and instructions</li>
              <li><strong>Maps and Directions:</strong> Alternative text-based location information provided</li>
            </ul>
          </Section>

          <Section>
            <h2>
              <FaExclamationCircle />
              Known Issues & Limitations
            </h2>
            <p>
              We are continuously working to improve accessibility, but acknowledge some current limitations:
            </p>
            <ul>
              <li><strong>Third-Party Content:</strong> Some MLS listings may have accessibility limitations beyond our control</li>
              <li><strong>PDF Documents:</strong> Some documents may not be fully accessible; alternative formats available upon request</li>
              <li><strong>Legacy Content:</strong> Older content is being updated to meet current accessibility standards</li>
            </ul>

            <p>
              We are actively working to address these limitations and welcome feedback on areas for improvement.
            </p>
          </Section>

          <Section>
            <h2>Alternative Access Options</h2>
            <p>
              If you encounter accessibility barriers on our website, we offer alternative ways to access our services:
            </p>
            <ul>
              <li><strong>Phone Support:</strong> Speak directly with our team for property information and assistance</li>
              <li><strong>Email Assistance:</strong> Request information in alternative formats</li>
              <li><strong>In-Person Meetings:</strong> Schedule face-to-face consultations</li>
              <li><strong>Custom Solutions:</strong> We'll work with you to find the best way to access our services</li>
            </ul>
          </Section>

          <ContactInfo>
            <h3>
              <FaEnvelope />
              Accessibility Support
            </h3>
            <p>
              If you experience any difficulty accessing our website or need assistance with any content, please contact us:
            </p>
            <p>
              <strong>Email:</strong> <a href="mailto:kevin.landen@outriderrealty.com">kevin.landen@outriderrealty.com</a><br />
              <strong>Phone:</strong> <a href="tel:+19514914890">(951) 491-4890</a><br />
              <strong>TTY/TDD:</strong> Available upon request<br />
              <strong>Address:</strong> Outrider Real Estate, Anza, CA
            </p>
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(139, 69, 19, 0.3)', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>
              <p>
                <strong>Website Development:</strong> For website-related accessibility questions or technical support, contact <a href="mailto:contact@marcelinolanden.com" style={{ color: '#8B4513' }}>Marcelino Landen</a> at <a href="https://marcelinolanden.com" target="_blank" rel="noopener noreferrer" style={{ color: '#8B4513' }}>marcelinolanden.com</a>
              </p>
            </div>
            <p>
              We will work with you to provide the information, item, or transaction you seek through a communication method that is accessible to you, consistent with applicable law.
            </p>
          </ContactInfo>
        </AccessibilityContent>
      </ContentWrapper>
    </AccessibilityContainer>
  );
};

export default Accessibility;