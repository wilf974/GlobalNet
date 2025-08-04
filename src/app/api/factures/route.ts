import { NextRequest, NextResponse } from 'next/server';
import { FactureService, DevisService } from '@/utils/dataService';

export async function GET() {
  try {
    const factures = FactureService.getAll();
    return NextResponse.json({ data: { factures } });
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des factures' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { devisId } = body;

    if (!devisId) {
      return NextResponse.json(
        { error: 'ID du devis requis' },
        { status: 400 }
      );
    }

    // Récupérer le devis
    const devis = DevisService.getById(devisId);
    if (!devis) {
      return NextResponse.json(
        { error: 'Devis non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que le devis est approuvé
    if (devis.status !== 'approved') {
      return NextResponse.json(
        { error: 'Seuls les devis approuvés peuvent être transformés en facture' },
        { status: 400 }
      );
    }

    // Créer la facture à partir du devis
    const newFacture = FactureService.createFromDevis(devis);

    return NextResponse.json({ data: { facture: newFacture } }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la facture:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la facture' },
      { status: 500 }
    );
  }
} 