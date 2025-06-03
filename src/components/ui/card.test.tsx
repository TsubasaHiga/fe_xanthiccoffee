import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from './card'

describe('Card Components', () => {
  describe('Card', () => {
    it('should render with default props', () => {
      render(<Card>Card content</Card>)

      const card = screen.getByText('Card content')
      expect(card).toBeInTheDocument()
      expect(card).toHaveAttribute('data-slot', 'card')
      expect(card).toHaveClass('flex', 'flex-col', 'rounded-xl', 'border')
    })

    it('should accept custom className', () => {
      render(<Card className='custom-class'>Card content</Card>)

      const card = screen.getByText('Card content')
      expect(card).toHaveClass('custom-class')
    })
  })

  describe('CardHeader', () => {
    it('should render with correct attributes', () => {
      render(<CardHeader>Header content</CardHeader>)

      const header = screen.getByText('Header content')
      expect(header).toHaveAttribute('data-slot', 'card-header')
      expect(header).toHaveClass('grid', 'auto-rows-min', 'px-6')
    })
  })

  describe('CardTitle', () => {
    it('should render with title styles', () => {
      render(<CardTitle>Test Title</CardTitle>)

      const title = screen.getByText('Test Title')
      expect(title).toHaveAttribute('data-slot', 'card-title')
      expect(title).toHaveClass('font-semibold', 'leading-none')
    })
  })

  describe('CardDescription', () => {
    it('should render with description styles', () => {
      render(<CardDescription>Test description</CardDescription>)

      const description = screen.getByText('Test description')
      expect(description).toHaveAttribute('data-slot', 'card-description')
      expect(description).toHaveClass('text-muted-foreground', 'text-sm')
    })
  })

  describe('CardAction', () => {
    it('should render with action styles', () => {
      render(<CardAction>Action content</CardAction>)

      const action = screen.getByText('Action content')
      expect(action).toHaveAttribute('data-slot', 'card-action')
      expect(action).toHaveClass('col-start-2', 'row-span-2')
    })
  })

  describe('CardContent', () => {
    it('should render with content styles', () => {
      render(<CardContent>Content here</CardContent>)

      const content = screen.getByText('Content here')
      expect(content).toHaveAttribute('data-slot', 'card-content')
      expect(content).toHaveClass('px-6')
    })
  })

  describe('CardFooter', () => {
    it('should render with footer styles', () => {
      render(<CardFooter>Footer content</CardFooter>)

      const footer = screen.getByText('Footer content')
      expect(footer).toHaveAttribute('data-slot', 'card-footer')
      expect(footer).toHaveClass('flex', 'items-center', 'px-6')
    })
  })

  describe('Complete Card', () => {
    it('should render a complete card with all components', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description</CardDescription>
            <CardAction>Action</CardAction>
          </CardHeader>
          <CardContent>Main content</CardContent>
          <CardFooter>Footer content</CardFooter>
        </Card>
      )

      expect(screen.getByText('Card Title')).toBeInTheDocument()
      expect(screen.getByText('Card description')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
      expect(screen.getByText('Main content')).toBeInTheDocument()
      expect(screen.getByText('Footer content')).toBeInTheDocument()
    })
  })
})
