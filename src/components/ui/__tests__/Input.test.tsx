import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Input from '../Input'

describe('Input Component', () => {
  it('renders correctly with basic props', () => {
    render(<Input name="test" placeholder="Test input" />)
    
    const input = screen.getByPlaceholderText('Test input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('name', 'test')
  })

  it('renders with label when provided', () => {
    render(<Input name="test" label="Test Label" />)
    
    const label = screen.getByText('Test Label')
    expect(label).toBeInTheDocument()
  })

  it('shows error message when error prop is provided', () => {
    render(<Input name="test" error="This is an error" />)
    
    const errorMessage = screen.getByText('This is an error')
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage).toHaveClass('text-error-600')
  })

  it('handles onChange events correctly', () => {
    const handleChange = vi.fn()
    render(<Input name="test" onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test value' } })
    
    // The component should call onChange with the event object
    expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({ value: 'test value' })
    }))
  })

  it('works with React Hook Form register', () => {
    const mockRegister = vi.fn().mockReturnValue({
      onChange: vi.fn(),
      onBlur: vi.fn(),
      name: 'test',
      ref: vi.fn(),
    })

    render(<Input {...mockRegister('test')} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(mockRegister).toHaveBeenCalledWith('test')
  })

  it('renders as textarea when type is textarea', () => {
    render(<Input name="test" type="textarea" />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea.tagName).toBe('TEXTAREA')
  })

  it('applies custom className', () => {
    render(<Input name="test" className="custom-class" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
  })

  it('handles required prop correctly', () => {
    render(<Input name="test" required />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('required')
  })

  it('handles different input types', () => {
    const { rerender } = render(<Input name="email" type="email" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')

    rerender(<Input name="tel" type="tel" />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'tel')

    rerender(<Input name="number" type="number" />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('type', 'number')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Input name="test" ref={ref} />)
    
    expect(ref).toHaveBeenCalled()
  })

  it('has base classes', () => {
    render(<Input name="test" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('block', 'w-full', 'px-3', 'py-2')
    expect(input).toHaveClass('border', 'border-gray-300', 'rounded-md')
    expect(input).toHaveClass('focus:outline-none', 'focus:ring-2')
  })
}) 