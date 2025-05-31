import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const PageContainer = styled.div`
  padding-top: 80px; /* Account for navbar */
`;

const PageHeader = styled.div`
  background-color: ${props => props.theme.colors.background.richDark};
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
    background-image: url('/images/mountain-landscape.jpg');
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
    background: linear-gradient(to bottom, rgba(13, 13, 13, 0.8), #0d0d0d);
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

const ContactSection = styled.section`
  padding: 5rem 0;
  background-color: ${props => props.theme.colors.background.dark};
`;

const ContactContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled(motion.div)`
  padding: 2rem;
  background-color: rgba(20, 20, 20, 0.7);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  box-shadow: ${props => props.theme.shadows.medium};
`;

const ContactInfoTitle = styled.h2`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 2rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 3px;
    background: ${props => props.theme.colors.primary};
  }
`;

const ContactInfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
`;

const ContactInfoItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text.primary};
  
  svg {
    color: ${props => props.theme.colors.primary};
    margin-right: 1rem;
    font-size: 1.2rem;
    margin-top: 0.25rem;
  }
  
  div {
    flex: 1;
  }
  
  h3 {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.colors.text.secondary};
  }
  
  p {
    line-height: 1.6;
  }
`;

const BusinessHours = styled.div`
  margin-top: 2.5rem;
  
  h3 {
    font-family: ${props => props.theme.fonts.heading};
    font-size: 1.5rem;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 1rem;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    tr {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      
      &:last-child {
        border-bottom: none;
      }
    }
    
    td {
      padding: 0.8rem 0;
      color: ${props => props.theme.colors.text.primary};
      
      &:last-child {
        text-align: right;
      }
    }
  }
`;

const ContactForm = styled(motion.form)`
  padding: 2rem;
  background-color: rgba(20, 20, 20, 0.7);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  box-shadow: ${props => props.theme.shadows.medium};
`;

const ContactFormTitle = styled.h2`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 2rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 3px;
    background: ${props => props.theme.colors.primary};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.secondary};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: rgba(255, 255, 255, 0.08);
  color: ${props => props.theme.colors.text.primary};
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.2);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: rgba(255, 255, 255, 0.08);
  color: ${props => props.theme.colors.text.primary};
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.2);
  }
`;

const FormButton = styled(motion.button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: ${props => props.theme.borderRadius.default};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.tertiary};
    transform: translateY(-3px);
  }
`;

const MapSection = styled.section`
  padding: 0 0 5rem;
  background-color: ${props => props.theme.colors.background.dark};
`;

const MapContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const MapWrapper = styled(motion.div)`
  width: 100%;
  height: 450px;
  border-radius: ${props => props.theme.borderRadius.default};
  overflow: hidden;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.medium};
  
  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [infoRef, infoInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [formRef, formInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [mapRef, mapInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    alert('Thank you for your message. We will get back to you soon!');
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <HeaderContent ref={headerRef}>
          <PageTitle
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.8 }}
          >
            Contact Us
          </PageTitle>
          <PageDescription
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            We're here to answer any questions you may have about our real estate services.
            Reach out to us and we'll respond as soon as we can.
          </PageDescription>
        </HeaderContent>
      </PageHeader>
      
      <ContactSection>
        <ContactContainer>
          <ContactInfo
            ref={infoRef}
            initial="hidden"
            animate={infoInView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <ContactInfoTitle>Get In Touch</ContactInfoTitle>
            <ContactInfoList>
              <ContactInfoItem>
                <FaPhoneAlt />
                <div>
                  <h3>Phone</h3>
                  <p>(555) 123-4567</p>
                </div>
              </ContactInfoItem>
              <ContactInfoItem>
                <FaEnvelope />
                <div>
                  <h3>Email</h3>
                  <p>info@kevinlanden.com</p>
                </div>
              </ContactInfoItem>
              <ContactInfoItem>
                <FaMapMarkerAlt />
                <div>
                  <h3>Office</h3>
                  <p>
                    123 Mountain View Road<br />
                    Anza, CA 92539
                  </p>
                </div>
              </ContactInfoItem>
            </ContactInfoList>
            
            <BusinessHours>
              <h3>Business Hours</h3>
              <table>
                <tbody>
                  <tr>
                    <td>Monday - Friday</td>
                    <td>9:00 AM - 5:00 PM</td>
                  </tr>
                  <tr>
                    <td>Saturday</td>
                    <td>10:00 AM - 3:00 PM</td>
                  </tr>
                  <tr>
                    <td>Sunday</td>
                    <td>Closed</td>
                  </tr>
                </tbody>
              </table>
            </BusinessHours>
          </ContactInfo>
          
          <ContactForm
            ref={formRef}
            initial="hidden"
            animate={formInView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
          >
            <ContactFormTitle>Send Us a Message</ContactFormTitle>
            <FormGroup>
              <FormLabel htmlFor="name">Your Name</FormLabel>
              <FormInput 
                type="text" 
                id="name" 
                placeholder="Enter your name" 
                required 
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="email">Email Address</FormLabel>
              <FormInput 
                type="email" 
                id="email" 
                placeholder="Enter your email" 
                required 
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="phone">Phone Number</FormLabel>
              <FormInput 
                type="tel" 
                id="phone" 
                placeholder="Enter your phone number" 
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="subject">Subject</FormLabel>
              <FormInput 
                type="text" 
                id="subject" 
                placeholder="What's this about?" 
                required 
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="message">Message</FormLabel>
              <FormTextarea 
                id="message" 
                placeholder="Tell us what you need..." 
                required 
              />
            </FormGroup>
            <FormButton
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send Message
            </FormButton>
          </ContactForm>
        </ContactContainer>
      </ContactSection>
      
      <MapSection>
        <MapContainer>
          <MapWrapper
            ref={mapRef}
            initial="hidden"
            animate={mapInView ? "visible" : "hidden"}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106326.53227912583!2d-116.71270724179686!3d33.55387899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80db54a3445b3fd7%3A0x29a7e95dc4a636bb!2sAnza%2C%20CA%2092539!5e0!3m2!1sen!2sus!4v1653065075455!5m2!1sen!2sus"
              title="Kevin Landen Real Estate Office Location"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </MapWrapper>
        </MapContainer>
      </MapSection>
    </PageContainer>
  );
};

export default Contact;
