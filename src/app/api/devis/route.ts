import { NextRequest, NextResponse } from 'next/server';
import { DevisService, DevisData } from '@/utils/dataService';

export async function GET() {
  try {
    const devis = DevisService.getAll();
    return NextResponse.json({ data: { devis } });
  } catch (error) {
    console.error('Erreur lors de la récupération des devis:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des devis' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      clientName, 
      clientEmail, 
      clientPhone, 
      services, 
      totalAmount, 
      notes,
      discount = 0,
      tax = 20
    } = body;

    if (!clientName || !clientEmail || !services || !totalAmount) {
      return NextResponse.json(
        { error: 'Informations client, services et montant sont obligatoires' },
        { status: 400 }
      );
    }

    const finalAmount = totalAmount * (1 + tax / 100) - discount;

    const newDevis = DevisService.create({
      clientName,
      clientEmail,
      clientPhone: clientPhone || '',
      services,
      totalAmount,
      status: 'draft',
      notes,
      discount,
      tax,
      finalAmount
    });

    return NextResponse.json({ data: { devis: newDevis } }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du devis:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du devis' },
      { status: 500 }
    );
  }
} 