import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaQuoteLeft, FaStar, FaUser, FaHome, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

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
    background-image: url('/images/happy-clients.jpg');
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
  
  p {
    font-size: 1.2rem;
    color: ${props => props.theme.colors.text.primary};
    max-width: 800px;
    margin: 0 auto 2rem;
    line-height: 1.8;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
`;

const FilterButton = styled.button`
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text.primary};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  padding: 0.7rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.default};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : 'rgba(139, 69, 19, 0.1)'};
    transform: translateY(-2px);
  }
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

const TestimonialCard = styled(motion.div)`
  background-color: rgba(30, 30, 30, 0.6);
  border-radius: ${props => props.theme.borderRadius.default};
  padding: 2.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
    border-color: ${props => props.theme.colors.secondary};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 0;
    background-color: ${props => props.theme.colors.primary};
    transition: height 0.5s ease;
  }
  
  &:hover::before {
    height: 100%;
  }
`;

const QuoteIcon = styled(FaQuoteLeft)`
  color: ${props => props.theme.colors.primary};
  font-size: 2rem;
  opacity: 0.3;
  margin-bottom: 1.5rem;
`;

const TestimonialText = styled.div`
  color: ${props => props.theme.colors.text.primary};
  line-height: 1.8;
  font-style: italic;
  margin-bottom: 2rem;
  flex: 1;
`;

const StarRating = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  
  svg {
    color: ${props => props.theme.colors.text.secondary};
    margin-right: 0.3rem;
  }
`;

const TestimonialMeta = styled.div`
  margin-top: auto;
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: 1.5rem;
`;

const ClientName = styled.h3`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.3rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const ClientLocation = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.text.muted};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const ClientTransaction = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.text.muted};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const ClientDate = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.text.muted};
  font-size: 0.9rem;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const LoadMoreButton = styled(motion.button)`
  background-color: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text.secondary};
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: ${props => props.theme.borderRadius.default};
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 3rem auto 0;
  display: block;
  
  &:hover {
    background-color: rgba(139, 69, 19, 0.1);
    transform: translateY(-3px);
    border-color: ${props => props.theme.colors.secondary};
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      background-color: transparent;
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

// Sample testimonial data
const allTestimonials = [
  {
    id: 1,
    text: "Kevin helped us find our dream mountain property in Idyllwild. His knowledge of the area and attention to detail made the process smooth and enjoyable. We couldn't be happier with our new home!",
    clientName: "Sarah & James Thompson",
    location: "Idyllwild, CA",
    transactionType: "Buyer",
    date: "July 2024",
    rating: 5,
    category: "buyer"
  },
  {
    id: 2,
    text: "Selling my ranch property in Anza seemed daunting until I worked with Outrider Real Estate. They understood the unique aspects of rural properties and found the perfect buyers who appreciated the land as much as I did.",
    clientName: "Robert Johnson",
    location: "Anza, CA",
    transactionType: "Seller",
    date: "June 2024",
    rating: 5,
    category: "seller"
  },
  {
    id: 3,
    text: "I appreciated the weekly updates and constant communication throughout my home buying process. As a first-time buyer, I had lots of questions, and Kevin was always patient and thorough in his explanations.",
    clientName: "Michelle Garcia",
    location: "Aguanga, CA",
    transactionType: "Buyer",
    date: "May 2024",
    rating: 5,
    category: "buyer"
  },
  {
    id: 4,
    text: "The marketing for my property was exceptional. Professional photography, detailed descriptions, and targeted advertising brought multiple offers within the first week. Outrider truly delivers on their promises.",
    clientName: "David & Lisa Wilson",
    location: "Mountain Center, CA",
    transactionType: "Seller",
    date: "April 2024",
    rating: 5,
    category: "seller"
  },
  {
    id: 5,
    text: "We were relocating from out of state and Kevin's knowledge of the Anza area was invaluable. He found us the perfect property that met all our criteria and helped navigate the complexities of rural property ownership.",
    clientName: "Mark & Jennifer Davis",
    location: "Anza, CA",
    transactionType: "Buyer",
    date: "March 2024",
    rating: 5,
    category: "buyer"
  },
  {
    id: 6,
    text: "Kevin's 1% listing fee saved us thousands of dollars, but the service was still top-notch. The professional photography and marketing materials were better than what other agents had provided at a much higher cost.",
    clientName: "Thomas Anderson",
    location: "Idyllwild, CA",
    transactionType: "Seller",
    date: "February 2024",
    rating: 5,
    category: "seller"
  },
  {
    id: 7,
    text: "We had a challenging property to sell with unique zoning considerations. Kevin's expertise in the local regulations and his network of contacts made all the difference in finding the right buyer quickly.",
    clientName: "Patricia & Michael Brown",
    location: "Aguanga, CA",
    transactionType: "Seller",
    date: "January 2024",
    rating: 5,
    category: "seller"
  },
  {
    id: 8,
    text: "The Outrider difference is real! We listed with another agent for 6 months with no success. Kevin relisted our property with fresh marketing and strategic pricing, and we had an offer within 3 weeks.",
    clientName: "Susan Miller",
    location: "Mountain Center, CA",
    transactionType: "Seller",
    date: "December 2023",
    rating: 5,
    category: "seller"
  },
  {
    id: 9,
    text: "Kevin took the time to understand exactly what we were looking for in a mountain retreat. His patience and dedication to finding us the perfect property made the experience enjoyable rather than stressful.",
    clientName: "Daniel & Karen White",
    location: "Idyllwild, CA",
    transactionType: "Buyer",
    date: "November 2023",
    rating: 5,
    category: "buyer"
  },
  {
    id: 10,
    text: "As investors looking for vacation rental properties, we appreciated Kevin's insights into the local market and potential rental income. His guidance helped us make a sound investment decision.",
    clientName: "Ryan & Emily Lewis",
    location: "Idyllwild, CA",
    transactionType: "Buyer",
    date: "October 2023",
    rating: 5,
    category: "buyer"
  },
  {
    id: 11,
    text: "The weekly updates on our listing were so valuable. Kevin kept us informed about showing activity, market changes, and buyer feedback. We always knew exactly where we stood in the selling process.",
    clientName: "Laura Martinez",
    location: "Anza, CA",
    transactionType: "Seller",
    date: "September 2023",
    rating: 5,
    category: "seller"
  },
  {
    id: 12,
    text: "Kevin's expertise in rural properties was evident from our first meeting. He helped us navigate well rights, septic systems, and other considerations we wouldn't have known to ask about as city dwellers buying our first country home.",
    clientName: "Christopher & Amanda Johnson",
    location: "Aguanga, CA",
    transactionType: "Buyer",
    date: "August 2023",
    rating: 5,
    category: "buyer"
  }
];

const TestimonialsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const [currentFilter, setCurrentFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(6);
  
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [introRef, introInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [buttonRef, buttonInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [ctaRef, ctaInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    setVisibleCount(6);
  };
  
  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 6);
  };
  
  const filteredTestimonials = currentFilter === 'all' 
    ? allTestimonials 
    : allTestimonials.filter(testimonial => testimonial.category === currentFilter);
  
  const visibleTestimonials = filteredTestimonials.slice(0, visibleCount);
  
  return (
    <PageContainer>
      <PageHeader ref={headerRef}>
        <HeaderContent>
          <PageTitle
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            Client Testimonials
          </PageTitle>
          <PageDescription
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Real stories from real clients about their experiences working with Outrider Real Estate.
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
            <p>
              At Outrider Real Estate, we're proud of the relationships we build with our clients. 
              We believe that real estate is about more than just transactions—it's about helping people achieve their dreams and goals. 
              Here's what our clients have to say about working with us.
            </p>
            
            <FilterContainer>
              <FilterButton 
                active={currentFilter === 'all'} 
                onClick={() => handleFilterChange('all')}
              >
                All Testimonials
              </FilterButton>
              <FilterButton 
                active={currentFilter === 'buyer'} 
                onClick={() => handleFilterChange('buyer')}
              >
                Buyer Experiences
              </FilterButton>
              <FilterButton 
                active={currentFilter === 'seller'} 
                onClick={() => handleFilterChange('seller')}
              >
                Seller Experiences
              </FilterButton>
            </FilterContainer>
          </IntroText>
          
          <TestimonialsGrid ref={testimonialsRef}>
            {visibleTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                initial={{ opacity: 0, y: 50 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <QuoteIcon />
                
                <StarRating>
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </StarRating>
                
                <TestimonialText>
                  {testimonial.text}
                </TestimonialText>
                
                <TestimonialMeta>
                  <ClientName>{testimonial.clientName}</ClientName>
                  <ClientLocation>
                    <FaMapMarkerAlt />
                    {testimonial.location}
                  </ClientLocation>
                  <ClientTransaction>
                    <FaHome />
                    {testimonial.transactionType}
                  </ClientTransaction>
                  <ClientDate>
                    <FaCalendarAlt />
                    {testimonial.date}
                  </ClientDate>
                </TestimonialMeta>
              </TestimonialCard>
            ))}
          </TestimonialsGrid>
          
          {visibleTestimonials.length < filteredTestimonials.length && (
            <LoadMoreButton
              ref={buttonRef}
              onClick={handleLoadMore}
              initial={{ opacity: 0, y: 30 }}
              animate={buttonInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
            >
              Load More Testimonials
            </LoadMoreButton>
          )}
        </ContentContainer>
      </ContentSection>
      
      <CTASection>
        <CTAContainer ref={ctaRef}>
          <CTATitle
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            Ready to Have Your Own Success Story?
          </CTATitle>
          <CTAText
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Whether you're buying or selling in our service area, we're committed to providing the same level 
            of exceptional service that our past clients have experienced. Let's create your real estate success story together.
          </CTAText>
          <CTAButton
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us Today
          </CTAButton>
        </CTAContainer>
      </CTASection>
    </PageContainer>
  );
};

export default TestimonialsPage;