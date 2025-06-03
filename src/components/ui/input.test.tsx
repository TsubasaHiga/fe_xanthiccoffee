import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Input } from './input'

describe('Input Component', () => {
  it('should render with default props', () => {
    render(<Input />)

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('data-slot', 'input')
  })

  it('should render with different types', () => {
    const { rerender } = render(<Input type='email' />)
    let input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')

    rerender(<Input type='password' />)
    input = screen.getByDisplayValue('') // password inputs don't have textbox role
    expect(input).toHaveAttribute('type', 'password')

    rerender(<Input type='date' />)
    input = screen.getByDisplayValue('')
    expect(input).toHaveAttribute('type', 'date')
  })

  it('should handle value and onChange', () => {
    const handleChange = vi.fn()
    render(<Input value='test' onChange={handleChange} />)

    const input = screen.getByDisplayValue('test')
    expect(input).toHaveValue('test')

    fireEvent.change(input, { target: { value: 'new value' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('should accept placeholder', () => {
    render(<Input placeholder='Enter text...' />)

    const input = screen.getByPlaceholderText('Enter text...')
    expect(input).toBeInTheDocument()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />)

    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:pointer-events-none')
  })

  it('should accept custom className', () => {
    render(<Input className='custom-class' />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
  })

  it('should have focus styles', () => {
    render(<Input />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('focus-visible:border-ring')
    expect(input).toHaveClass('focus-visible:ring-[3px]')
  })

  it('should have invalid styles for aria-invalid', () => {
    render(<Input aria-invalid />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('aria-invalid:border-destructive')
    expect(input).toHaveClass('aria-invalid:ring-destructive/20')
  })

  it('should accept and forward other props', () => {
    render(<Input name='testInput' required aria-label='Test input' />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('name', 'testInput')
    expect(input).toHaveAttribute('required')
    expect(input).toHaveAttribute('aria-label', 'Test input')
  })
})
