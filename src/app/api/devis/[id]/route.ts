import { NextRequest, NextResponse } from 'next/server';
import { DevisService } from '@/utils/dataService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const devis = DevisService.getById(params.id);
    
    if (!devis) {
      return NextResponse.json(
        { error: 'Devis non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: { devis } });
  } catch (error) {
    console.error('Erreur lors de la récupération du devis:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du devis' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { 
      clientName, 
      clientEmail, 
      clientPhone, 
      services, 
      totalAmount, 
      status,
      notes,
      discount,
      tax
    } = body;

    const updates: any = {};
    if (clientName) updates.clientName = clientName;
    if (clientEmail) updates.clientEmail = clientEmail;
    if (clientPhone) updates.clientPhone = clientPhone;
    if (services) updates.services = services;
    if (totalAmount) updates.totalAmount = totalAmount;
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (discount !== undefined) updates.discount = discount;
    if (tax !== undefined) updates.tax = tax;

    // Recalculer le montant final si nécessaire
    if (totalAmount && tax !== undefined) {
      updates.finalAmount = totalAmount * (1 + tax / 100) - (discount || 0);
    }

    const updatedDevis = DevisService.update(params.id, updates);

    if (!updatedDevis) {
      return NextResponse.json(
        { error: 'Devis non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: { devis: updatedDevis } });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du devis:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du devis' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = DevisService.delete(params.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Devis non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: { message: 'Devis supprimé avec succès' } });
  } catch (error) {
    console.error('Erreur lors de la suppression du devis:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du devis' },
      { status: 500 }
    );
  }
} 