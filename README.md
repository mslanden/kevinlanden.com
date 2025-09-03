# Outrider Real Estate - Modern React Implementation

This is a modern React implementation of the Outrider Real Estate website, featuring a clean, responsive design with western/country theming.

## Project Overview

Outrider Real Estate is Kevin Landen's real estate business serving Anza, Aguanga, Idyllwild, and Mountain Center. The website showcases the company's services, marketing plan, and affiliate program with a consistent western theme throughout.

## Features

- Responsive design that works on all devices
- Modern animations using Framer Motion
- Component-based architecture for easy maintenance
- Western/country theme throughout
- Complete information on services, territory, and marketing approach

## Pages

- **Home**: Main landing page with hero section, discover, story, territory, marketing plan, testimonials, and affiliate sections
- **Buyers Guide**: Comprehensive guide for property buyers
- **Sellers Guide**: Detailed guide for property sellers
- **Marketing Plan**: Information about the unique marketing approach
- **Testimonials**: Client reviews and success stories
- **Affiliate Program**: Details about joining the affiliate program

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```
   cd frontendv2
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Building for Production

To build the app for production:

```
npm run build
```
or
```
yarn build
```

This creates an optimized production build in the `build` folder.

## Technologies Used

- React.js
- React Router for navigation
- Styled Components for styling
- Framer Motion for animations
- React Icons for icon components
- React Intersection Observer for scroll animations

## Project Structure

```
src/
├── assets/        # Images, fonts, and other static assets
├── components/    # Reusable components
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── styles/        # Global styles and theme
├── App.js         # Main App component
└── index.js       # Entry point
```

## Design Principles

The design follows these key principles:
- Country/western aesthetic with earthy color palette
- Modern, clean layout with ample whitespace
- Visual hierarchy emphasizing key information
- Consistent branding throughout
- Responsive design for all device sizes

## Customization

The theme can be easily customized by modifying the `theme.js` file in the `styles` directory. This controls colors, fonts, spacing, and other design variables used throughout the application.