import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LoginForm from '../LoginForm'
import { useAuth } from '@/contexts/AuthContext'

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn()
}))

describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      isLoading: false,
      error: null
    })
  })

  it('renders login form fields', () => {
    render(<LoginForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    const mockLogin = vi.fn()
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null
    })

    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/mot de passe/i)
    const submitButton = screen.getByRole('button', { name: /se connecter/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })

  it('shows loading state', () => {
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      isLoading: true,
      error: null
    })

    render(<LoginForm />)
    
    const submitButton = screen.getByRole('button', { name: /connexion en cours/i })
    expect(submitButton).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('displays error message', () => {
    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      isLoading: false,
      error: 'Invalid credentials'
    })

    render(<LoginForm />)
    
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<LoginForm />)
    
    const submitButton = screen.getByRole('button', { name: /se connecter/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/l'email est requis/i)).toBeInTheDocument()
      expect(screen.getByText(/le mot de passe est requis/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.blur(emailInput)
    
    await waitFor(() => {
      expect(screen.getByText(/format d'email invalide/i)).toBeInTheDocument()
    })
  })

  it('validates password length', async () => {
    render(<LoginForm />)
    
    const passwordInput = screen.getByLabelText(/mot de passe/i)
    fireEvent.change(passwordInput, { target: { value: '123' } })
    fireEvent.blur(passwordInput)
    
    await waitFor(() => {
      expect(screen.getByText(/le mot de passe doit contenir au moins 6 caractères/i)).toBeInTheDocument()
    })
  })

  it('has register button', () => {
    render(<LoginForm />)
    
    const switchButton = screen.getByRole('button', { name: /créer un compte/i })
    expect(switchButton).toBeInTheDocument()
    
    // Button should be clickable but doesn't change form without onSwitchToRegister prop
    fireEvent.click(switchButton)
    expect(screen.getByText(/connexion/i)).toBeInTheDocument()
  })

  it('handles keyboard navigation', () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/mot de passe/i)
    
    emailInput.focus()
    expect(emailInput).toHaveFocus()
    
    fireEvent.keyDown(emailInput, { key: 'Tab' })
    expect(passwordInput).toHaveFocus()
  })

  it('has proper accessibility attributes', () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/mot de passe/i)
    
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(emailInput).toHaveAttribute('required')
    expect(passwordInput).toHaveAttribute('required')
  })
}) 