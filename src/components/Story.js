import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const StorySection = styled.section`
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
    background-size: cover;
    opacity: 0.1;
    z-index: 1;
  }
`;

const StoryContainer = styled.div`
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

const StoryTitle = styled(motion.h2)`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 3.5rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1.5rem;
  letter-spacing: 2px;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2.8rem;
  }
`;

const StorySubtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text.muted};
  max-width: 600px;
  margin: 0 auto;
`;

const StoryContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const StoryImage = styled(motion.div)`
  position: relative;
  border-radius: ${props => props.theme.borderRadius.large};
  overflow: hidden;
  height: 500px;
  box-shadow: ${props => props.theme.shadows.large};
  border: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: ${props => props.theme.breakpoints.lg}) {
    height: 400px;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.7) 100%);
  }
`;

const StoryImageCaption = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: white;
  z-index: 2;
  font-family: ${props => props.theme.fonts.heading};
  font-size: 1.2rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
`;

const StoryText = styled(motion.div)`
  color: ${props => props.theme.colors.text.primary};
  
  p {
    margin-bottom: 1.5rem;
    line-height: 1.8;
    font-size: 1.05rem;
  }
`;

const StoryQuote = styled(motion.blockquote)`
  position: relative;
  font-family: ${props => props.theme.fonts.heading};
  font-style: italic;
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text.secondary};
  margin: 3rem 0;
  padding: 1.5rem 2rem;
  border-left: 3px solid ${props => props.theme.colors.primary};
  background-color: rgba(139, 69, 19, 0.1);
  border-radius: 0 ${props => props.theme.borderRadius.default} ${props => props.theme.borderRadius.default} 0;
  
  &::before {
    content: '"';
    position: absolute;
    top: -10px;
    left: 10px;
    font-size: 3rem;
    color: ${props => props.theme.colors.primary};
    opacity: 0.4;
  }
  
  &::after {
    content: '"';
    position: absolute;
    bottom: -30px;
    right: 10px;
    font-size: 3rem;
    color: ${props => props.theme.colors.primary};
    opacity: 0.4;
  }
`;

const Story = () => {
  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [imageRef, imageInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [textRef, textInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [quoteRef, quoteInView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  
  return (
    <StorySection id="story">
      <StoryContainer>
        <SectionHeader>
          <StoryTitle
            ref={titleRef}
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            Take No Bull
          </StoryTitle>
          <StorySubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Our story of dedication, service, and unwavering commitment to excellence
          </StorySubtitle>
        </SectionHeader>
        
        <StoryContent>
          <StoryImage
            ref={imageRef}
            initial={{ opacity: 0, x: -50 }}
            animate={imageInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            <img src="/images/marine.png" alt="Kevin Landen in Marine Corps" />
            <StoryImageCaption>From Marine Corps to Real Estate</StoryImageCaption>
          </StoryImage>
          
          <StoryText
            ref={textRef}
            initial={{ opacity: 0, x: 50 }}
            animate={textInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
          >
            <p>
              Our story begins on the seat of a college office lab chair with a black computer screen prompting: Unformatted Disk. Kevin Landen would spend the next six months typewriting his college English papers due to this unresolved hurdle.
            </p>
            <p>
              From this deficiency swelled a desire to never let computers or technology hold back his dreams for the future. He subsequently joined the Marine Corps as a 4066, Small Computer Systems Specialist. In the years that followed the Corps, he struggled waiting tables in the service industry.
            </p>
            <p>
              To support his growing family, he constantly worked two and sometimes 3 jobs at the same time. From waiting tables, to bartending, to financial services, to real estate - each move was to gather more knowledge, more skills to be helpful to others so they can achieve their goals - and not just a great meal.
            </p>
            <p>
              The Marine Corps instilled discipline, a resolve to strive for excellence, and to leave things better than how you found them. As a restaurant server and bartender, customer service, attention to detail, and the client experience were paramount. Financial services demonstrated ethics, compliance, professionalism, and what it means to be a fiduciary.
            </p>
            
            <StoryQuote
              ref={quoteRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={quoteInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
            >
              An outrider is a cowhand that rode beside the herd and scouted for water and the best grass to graze.
            </StoryQuote>
            
            <p>
              On selling his home, as numerous others have experienced with the real estate industry, he encountered a void of communication and poor photography and marketing effort. This experience, with such a high-dollar transaction, brought him back to the college computer screen so long ago.
            </p>
            <p>
              He soon went on to study the real estate industry and procure his license. Upon performing transactions on VRBO, Airbnb, rentals, condo, manufactured home, and traditional home sales- he set off to encapsulate the standard of what an agent should be. An outrider.
            </p>
            <p>
              As your realtor, we ride with you to professionally navigate the market conditions, staying in constant communication, and ensuring your home is best in show. For our buyers - an active pursuit to seek out the most opportune property and terms fitting your objectives.
            </p>
          </StoryText>
        </StoryContent>
      </StoryContainer>
    </StorySection>
  );
};

export default Story;