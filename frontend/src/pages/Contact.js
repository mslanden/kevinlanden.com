import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { submitContactForm } from '../utils/api';

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

const FormSelect = styled.select`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: rgba(255, 255, 255, 0.08);
  color: ${props => props.theme.colors.text.primary};
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.2);
  }
  
  option {
    background-color: #1a1a1a;
    color: ${props => props.theme.colors.text.primary};
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
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    leadType: 'buyer'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await submitContactForm(formData);
      
      if (response.success) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          leadType: 'buyer'
        });
        alert('Thank you for your message. We will get back to you soon!');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      alert('There was an error submitting your message. Please try again.');
      console.error('Contact form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
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
                  <p>(951) 491-4890</p>
                </div>
              </ContactInfoItem>
              <ContactInfoItem>
                <FaEnvelope />
                <div>
                  <h3>Email</h3>
                  <p>kevin.landen@outriderrealty.com</p>
                </div>
              </ContactInfoItem>
            </ContactInfoList>
            
            <BusinessHours>
              <h3>Schedule a Meeting</h3>
              <p style={{
                color: '#d2b48c',
                lineHeight: '1.6',
                marginBottom: '1rem'
              }}>
                Ready to get started? Book a convenient time to discuss your real estate needs.
              </p>
              <a 
                href="https://calendly.com/landenkm/30min" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#8B4513',
                  color: 'white',
                  padding: '12px 24px',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                Book a Meeting
              </a>
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
            <ContactFormTitle>Questions?</ContactFormTitle>
            <FormGroup>
              <FormLabel htmlFor="name">Your Name</FormLabel>
              <FormInput 
                type="text" 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name" 
                required 
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="email">Email Address</FormLabel>
              <FormInput 
                type="email" 
                id="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email" 
                required 
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="phone">Phone Number</FormLabel>
              <FormInput 
                type="tel" 
                id="phone" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number" 
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="subject">Subject</FormLabel>
              <FormInput 
                type="text" 
                id="subject" 
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="What's this about?" 
                required 
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="leadType">I'm interested in...</FormLabel>
              <FormSelect 
                id="leadType" 
                name="leadType"
                value={formData.leadType}
                onChange={handleInputChange}
                required
              >
                <option value="buyer">Buying a property</option>
                <option value="seller">Selling a property</option>
                <option value="renter">Renting a property</option>
                <option value="investor">Investment opportunities</option>
                <option value="general">General real estate questions</option>
              </FormSelect>
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="message">Message</FormLabel>
              <FormTextarea 
                id="message" 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Feel welcome to inquire about any real estate matter." 
                required 
              />
            </FormGroup>
            <FormButton
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.05 } : {}}
              whileTap={!isSubmitting ? { scale: 0.95 } : {}}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
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
            <img
              src="/images/territory-map.jpeg"
              alt="Kevin Landen Real Estate Service Territory Map - Anza, Aguanga, Idyllwild, and Mountain Center"
            />
          </MapWrapper>
        </MapContainer>
      </MapSection>
    </PageContainer>
  );
};

export default Contact;
