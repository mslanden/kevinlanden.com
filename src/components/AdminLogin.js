import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const LoginContainer = styled(motion.div)`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: rgba(20, 20, 20, 0.85);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
`;

const LoginTitle = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text.secondary};
  font-family: ${props => props.theme.fonts.heading};
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${props => props.theme.colors.text.secondary};
  font-weight: 600;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.small};
  color: ${props => props.theme.colors.text.primary};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const LoginButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.tertiary};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  text-align: center;
`;

const AdminLogin = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));

      // Call success callback
      onLoginSuccess(data.token, data.user);

    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <LoginTitle>Admin Login</LoginTitle>
      <LoginForm onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
        </InputGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <LoginButton type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </LoginButton>
      </LoginForm>
    </LoginContainer>
  );
};

export default AdminLogin;