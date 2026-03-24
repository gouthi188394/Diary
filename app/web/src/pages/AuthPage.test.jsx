import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AuthProvider } from '../context/AuthContext.jsx';
import { AuthPage } from './AuthPage.jsx';

describe('AuthPage', () => {
  it('renders the product value proposition', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <AuthPage />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Secure personal diary SaaS/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start journaling/i })).toBeInTheDocument();
  });
});
