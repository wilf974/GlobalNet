import { NextRequest, NextResponse } from 'next/server';
import { ClientService, ClientData } from '@/utils/dataService';

export async function GET() {
  try {
    const clients = ClientService.getAll();
    return NextResponse.json({ data: { clients } });
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, address, company, notes } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Nom, email et téléphone sont obligatoires' },
        { status: 400 }
      );
    }

    const newClient = ClientService.create({
      name,
      email,
      phone,
      address: address || '',
      company,
      totalDevis: 0,
      totalRevenue: 0,
      lastContact: new Date().toISOString(),
      status: 'active',
      notes
    });

    return NextResponse.json({ data: { client: newClient } }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du client' },
      { status: 500 }
    );
  }
} 