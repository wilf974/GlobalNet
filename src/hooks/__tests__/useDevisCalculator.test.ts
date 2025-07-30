import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useDevisCalculator } from '../useDevisCalculator'

describe('useDevisCalculator', () => {
  it('calculates price for residential cleaning', () => {
    const { result } = renderHook(() => useDevisCalculator())
    
    const testData = {
      serviceDetails: {
        typeNettoyage: 'residentiel' as const,
        superficie: 100,
        frequence: 'hebdomadaire' as const,
        dateIntervention: new Date(),
        horaires: '9h-17h'
      }
    }
    
    const price = result.current.calculatePrice(testData)
    expect(price).toBeGreaterThan(0)
  })

  it('calculates price for office cleaning', () => {
    const { result } = renderHook(() => useDevisCalculator())
    
    const testData = {
      serviceDetails: {
        typeNettoyage: 'bureaux' as const,
        superficie: 200,
        frequence: 'mensuel' as const,
        dateIntervention: new Date(),
        horaires: '8h-18h'
      }
    }
    
    const price = result.current.calculatePrice(testData)
    expect(price).toBeGreaterThan(0)
  })

  it('calculates price for industrial cleaning', () => {
    const { result } = renderHook(() => useDevisCalculator())
    
    const testData = {
      serviceDetails: {
        typeNettoyage: 'industriel' as const,
        superficie: 500,
        frequence: 'ponctuel' as const,
        dateIntervention: new Date(),
        horaires: '6h-22h'
      }
    }
    
    const price = result.current.calculatePrice(testData)
    expect(price).toBeGreaterThan(0)
  })

  it('applies frequency multipliers correctly', () => {
    const { result } = renderHook(() => useDevisCalculator())
    
    const testData = {
      serviceDetails: {
        typeNettoyage: 'residentiel' as const,
        superficie: 100,
        frequence: 'hebdomadaire' as const,
        dateIntervention: new Date(),
        horaires: '9h-17h'
      }
    }
    
    const price = result.current.calculatePrice(testData)
    expect(price).toBeGreaterThan(0)
  })

  it('adds additional options to total price', () => {
    const { result } = renderHook(() => useDevisCalculator())
    
    const testData = {
      serviceDetails: {
        typeNettoyage: 'residentiel' as const,
        superficie: 100,
        frequence: 'hebdomadaire' as const,
        dateIntervention: new Date(),
        horaires: '9h-17h'
      },
      optionsSupplementaires: {
        nettoyageVitres: true,
        desinfection: false,
        nettoyageFacades: false,
        nettoyageParking: false,
        nettoyageCarpettes: true,
        traitementAntiCalcaire: false
      }
    }
    
    const price = result.current.calculatePrice(testData)
    expect(price).toBeGreaterThan(0)
  })

  it('handles invalid data gracefully', () => {
    const { result } = renderHook(() => useDevisCalculator())
    
    const testData = {
      serviceDetails: {
        typeNettoyage: 'invalid' as any,
        superficie: 100,
        frequence: 'hebdomadaire' as const,
        dateIntervention: new Date(),
        horaires: '9h-17h'
      }
    }
    
    const price = result.current.calculatePrice(testData)
    expect(price).toBe(0)
  })

  it('calculates options price correctly', () => {
    const { result } = renderHook(() => useDevisCalculator())
    
    const testData = {
      serviceDetails: {
        typeNettoyage: 'residentiel' as const,
        superficie: 100,
        frequence: 'hebdomadaire' as const,
        dateIntervention: new Date(),
        horaires: '9h-17h'
      },
      optionsSupplementaires: {
        nettoyageVitres: true,
        desinfection: false,
        nettoyageFacades: false,
        nettoyageParking: false,
        nettoyageCarpettes: true,
        traitementAntiCalcaire: false
      }
    }
    
    const optionsPrice = result.current.calculateOptionsPrice(testData)
    expect(optionsPrice).toBeGreaterThan(0)
  })

  it('returns price breakdown', () => {
    const { result } = renderHook(() => useDevisCalculator())
    
    const testData = {
      serviceDetails: {
        typeNettoyage: 'residentiel' as const,
        superficie: 100,
        frequence: 'hebdomadaire' as const,
        dateIntervention: new Date(),
        horaires: '9h-17h'
      }
    }
    
    const breakdown = result.current.getPriceBreakdown(testData)
    expect(breakdown).toHaveProperty('prixBase')
    expect(breakdown).toHaveProperty('reduction')
    expect(breakdown).toHaveProperty('options')
    expect(breakdown).toHaveProperty('total')
  })

  it('handles empty data', () => {
    const { result } = renderHook(() => useDevisCalculator())
    
    const price = result.current.calculatePrice({})
    expect(price).toBe(0)
    
    const optionsPrice = result.current.calculateOptionsPrice({})
    expect(optionsPrice).toBe(0)
    
    const breakdown = result.current.getPriceBreakdown({})
    expect(breakdown.total).toBe(0)
  })
}) 