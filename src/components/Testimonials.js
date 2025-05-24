import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaQuoteLeft, FaQuoteRight, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const TestimonialsSection = styled.section`
  padding: 8rem 0;
  background-color: ${props => props.theme.colors.background.dark};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/wooden-fence.jpg');
    background-size: cover;
    opacity: 0.05;
    z-index: 1;
  }
`;

const TestimonialsContainer = styled.div`
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

const TestimonialsWrapper = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 900px;
`;

const TestimonialSlider = styled(motion.div)`
  overflow: hidden;
  position: relative;
  padding: 2rem 0;
`;

const TestimonialTrack = styled(motion.div)`
  display: flex;
  transition: transform 0.5s ease;
`;

const TestimonialCard = styled(motion.div)`
  flex-shrink: 0;
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
`;

const TestimonialContent = styled.div`
  background-color: rgba(30, 30, 30, 0.8);
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 3rem;
  box-shadow: ${props => props.theme.shadows.medium};
  position: relative;
  border: 1px solid ${props => props.theme.colors.border};
  min-height: 250px;
  display: flex;
  flex-direction: column;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 2rem;
  }
`;

const QuoteIconLeft = styled(FaQuoteLeft)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  color: ${props => props.theme.colors.primary};
  opacity: 0.3;
  font-size: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.5rem;
    top: 1.5rem;
    left: 1.5rem;
  }
`;

const QuoteIconRight = styled(FaQuoteRight)`
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  color: ${props => props.theme.colors.primary};
  opacity: 0.3;
  font-size: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.5rem;
    bottom: 1.5rem;
    right: 1.5rem;
  }
`;

const TestimonialText = styled.p`
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  font-style: italic;
  text-align: center;
  flex: 1;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1rem;
  }
`;

const StarRating = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  svg {
    color: ${props => props.theme.colors.text.secondary};
    font-size: 1.2rem;
    margin: 0 0.2rem;
  }
`;

const TestimonialAuthor = styled.div`
  text-align: center;
  margin-top: auto;
`;

const AuthorName = styled.h4`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.3rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.2rem;
`;

const AuthorLocation = styled.p`
  color: ${props => props.theme.colors.text.muted};
  font-size: 0.9rem;
`;

const SliderControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
`;

const ControlButton = styled.button`
  background-color: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text.secondary};
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(139, 69, 19, 0.2);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background-color: transparent;
      transform: none;
    }
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const SliderDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

const SliderDot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ active }) => 
    active ? 'rgba(210, 180, 140, 1)' : 'rgba(210, 180, 140, 0.3)'};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(210, 180, 140, 0.8);
  }
`;

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  // Sample testimonial data
  const testimonials = [
    {
      text: "Kevin helped us find our dream mountain property in Idyllwild. His knowledge of the area and attention to detail made the process smooth and enjoyable. We couldn't be happier with our new home!",
      author: "Sarah & James Thompson",
      location: "Idyllwild, CA",
      rating: 5
    },
    {
      text: "Selling my ranch property in Anza seemed daunting until I worked with Outrider Real Estate. They understood the unique aspects of rural properties and found the perfect buyers who appreciated the land as much as I did.",
      author: "Robert Johnson",
      location: "Anza, CA",
      rating: 5
    },
    {
      text: "I appreciated the weekly updates and constant communication throughout my home buying process. As a first-time buyer, I had lots of questions, and Kevin was always patient and thorough in his explanations.",
      author: "Michelle Garcia",
      location: "Aguanga, CA",
      rating: 5
    },
    {
      text: "The marketing for my property was exceptional. Professional photography, detailed descriptions, and targeted advertising brought multiple offers within the first week. Outrider truly delivers on their promises.",
      author: "David & Lisa Wilson",
      location: "Mountain Center, CA",
      rating: 5
    }
  ];
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };
  
  return (
    <TestimonialsSection id="testimonials">
      <TestimonialsContainer>
        <SectionHeader>
          <SectionTitle
            ref={titleRef}
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            Client Testimonials
          </SectionTitle>
          <SectionSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            What our clients are saying about their Outrider experience
          </SectionSubtitle>
        </SectionHeader>
        
        <TestimonialsWrapper
          ref={testimonialsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <TestimonialSlider>
            <TestimonialTrack
              animate={{ x: `${-currentIndex * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ display: 'flex' }}
            >
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} style={{ width: '100%', flexShrink: 0 }}>
                  <TestimonialContent>
                    <QuoteIconLeft />
                    <QuoteIconRight />
                    
                    <StarRating>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </StarRating>
                    
                    <TestimonialText>
                      {testimonial.text}
                    </TestimonialText>
                    
                    <TestimonialAuthor>
                      <AuthorName>{testimonial.author}</AuthorName>
                      <AuthorLocation>{testimonial.location}</AuthorLocation>
                    </TestimonialAuthor>
                  </TestimonialContent>
                </TestimonialCard>
              ))}
            </TestimonialTrack>
          </TestimonialSlider>
          
          <SliderControls>
            <ControlButton onClick={prevSlide}>
              <FaChevronLeft />
            </ControlButton>
            
            <SliderDots>
              {testimonials.map((_, index) => (
                <SliderDot 
                  key={index} 
                  active={currentIndex === index} 
                  onClick={() => goToSlide(index)}
                />
              ))}
            </SliderDots>
            
            <ControlButton onClick={nextSlide}>
              <FaChevronRight />
            </ControlButton>
          </SliderControls>
        </TestimonialsWrapper>
      </TestimonialsContainer>
    </TestimonialsSection>
  );
};

export default Testimonials;