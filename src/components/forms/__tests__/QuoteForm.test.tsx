import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import QuoteForm from '../QuoteForm'

// Mock the useDevisCalculator hook
vi.mock('@/hooks/useDevisCalculator', () => ({
  useDevisCalculator: () => ({
    calculatePrice: vi.fn(() => 150),
    calculateOptionsPrice: vi.fn(() => 50),
    getPriceBreakdown: vi.fn(() => ({
      prixBase: 100,
      reduction: 10,
      options: 50,
      total: 150
    }))
  })
}))

// Mock the useFormStepper hook
vi.mock('@/hooks/useFormStepper', () => ({
  useFormStepper: () => ({
    currentStep: 0,
    steps: [
      { id: 0, titre: 'Informations Client', description: 'Vos coordonnées', valide: false },
      { id: 1, titre: 'Service', description: 'Type de nettoyage', valide: false },
      { id: 2, titre: 'Options', description: 'Services supplémentaires', valide: false },
      { id: 3, titre: 'Validation', description: 'Récapitulatif', valide: false }
    ],
    nextStep: vi.fn(),
    prevStep: vi.fn(),
    goToStep: vi.fn(),
    isStepValid: vi.fn(() => false)
  })
}))

describe('QuoteForm Component', () => {
  it('renders the form with initial step', () => {
    render(<QuoteForm />)
    
    // Should show the first step title
    expect(screen.getByText('Informations Client')).toBeInTheDocument()
    expect(screen.getByText('Vos coordonnées')).toBeInTheDocument()
  })

  it('displays form fields for client information', () => {
    render(<QuoteForm />)
    
    // Check for client information fields
    expect(screen.getByLabelText(/nom/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/téléphone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/adresse/i)).toBeInTheDocument()
  })

  it('shows navigation buttons', () => {
    render(<QuoteForm />)
    
    // Should have next button
    const nextButton = screen.getByRole('button', { name: /suivant/i })
    expect(nextButton).toBeInTheDocument()
    
    // Previous button should be disabled on first step
    const prevButton = screen.getByRole('button', { name: /précédent/i })
    expect(prevButton).toBeDisabled()
  })

  it('displays step indicators', () => {
    render(<QuoteForm />)
    
    // Should show step indicators
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('handles form field changes', async () => {
    render(<QuoteForm />)
    
    const nomInput = screen.getByLabelText(/nom/i)
    fireEvent.change(nomInput, { target: { value: 'John Doe' } })
    
    expect(nomInput).toHaveValue('John Doe')
  })

  it('validates required fields', async () => {
    render(<QuoteForm />)
    
    const nextButton = screen.getByRole('button', { name: /suivant/i })
    fireEvent.click(nextButton)
    
    // Should show validation errors for required fields
    await waitFor(() => {
      expect(screen.getByText(/le nom est requis/i)).toBeInTheDocument()
    })
  })

  it('shows price calculation', () => {
    render(<QuoteForm />)
    
    // Should display price information
    expect(screen.getByText(/prix estimé/i)).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    const mockSubmit = vi.fn()
    render(<QuoteForm onSubmit={mockSubmit} />)
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/téléphone/i), { target: { value: '0123456789' } })
    fireEvent.change(screen.getByLabelText(/adresse/i), { target: { value: '123 Test St' } })
    
    const submitButton = screen.getByRole('button', { name: /envoyer le devis/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
    })
  })

  it('saves form data to localStorage', () => {
    const { getItem, setItem } = vi.mocked(localStorage)
    render(<QuoteForm />)
    
    const nomInput = screen.getByLabelText(/nom/i)
    fireEvent.change(nomInput, { target: { value: 'John Doe' } })
    
    // Should save to localStorage
    expect(setItem).toHaveBeenCalled()
  })

  it('loads form data from localStorage', () => {
    const mockData = {
      nom: 'John Doe',
      email: 'john@example.com'
    }
    
    const { getItem } = vi.mocked(localStorage)
    getItem.mockReturnValue(JSON.stringify(mockData))
    
    render(<QuoteForm />)
    
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
  })
}) 