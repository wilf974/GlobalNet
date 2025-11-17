import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test organizations
  const org1 = await prisma.organization.create({
    data: {
      name: 'CleanPro Services',
      slug: 'cleanpro-services',
      domain: 'cleanpro.local',
      plan: 'pro',
      status: 'active',
    },
  });

  const org2 = await prisma.organization.create({
    data: {
      name: 'Fresh Clean Solutions',
      slug: 'fresh-clean',
      domain: 'freshclean.local',
      plan: 'starter',
      status: 'active',
    },
  });

  const org3 = await prisma.organization.create({
    data: {
      name: 'Sparkling Spaces',
      slug: 'sparkling-spaces',
      domain: 'sparkling.local',
      plan: 'enterprise',
      status: 'active',
    },
  });

  console.log(`✅ Created 3 organizations`);

  // Create test users
  const hashedPassword = await bcryptjs.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'admin@cleanpro.local',
      name: 'Admin CleanPro',
      password: hashedPassword,
      role: 'OWNER',
      organizationId: org1.id,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'manager@cleanpro.local',
      name: 'Manager CleanPro',
      password: hashedPassword,
      role: 'MANAGER',
      organizationId: org1.id,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'admin@freshclean.local',
      name: 'Admin Fresh Clean',
      password: hashedPassword,
      role: 'OWNER',
      organizationId: org2.id,
    },
  });

  const user4 = await prisma.user.create({
    data: {
      email: 'admin@sparkling.local',
      name: 'Admin Sparkling',
      password: hashedPassword,
      role: 'OWNER',
      organizationId: org3.id,
    },
  });

  console.log(`✅ Created 4 users`);

  // Create test clients for org1
  const clients = [];
  const clientNames = [
    { name: 'Acme Corporation', email: 'contact@acme.fr', city: 'Paris' },
    { name: 'Global Services Ltd', email: 'info@globalservices.fr', city: 'Lyon' },
    { name: 'Tech Startup Inc', email: 'hello@techstartup.fr', city: 'Marseille' },
    { name: 'Finance Company', email: 'clients@financecompany.fr', city: 'Toulouse' },
    { name: 'Medical Clinic', email: 'contact@medicalclinic.fr', city: 'Nice' },
    { name: 'Retail Store', email: 'manager@retailstore.fr', city: 'Nantes' },
    { name: 'Restaurant Group', email: 'hello@restaurantgroup.fr', city: 'Strasbourg' },
    { name: 'Hotel Chain', email: 'booking@hotelchain.fr', city: 'Bordeaux' },
    { name: 'Manufacturing Plant', email: 'sales@manufacturing.fr', city: 'Lille' },
    { name: 'Legal Office', email: 'contact@legaloffice.fr', city: 'Rennes' },
  ];

  for (const clientData of clientNames) {
    const client = await prisma.client.create({
      data: {
        name: clientData.name,
        email: clientData.email,
        phone: '+33 1 23 45 67 89',
        organizationId: org1.id,
        city: clientData.city,
        status: Math.random() > 0.3 ? 'active' : 'prospect',
        type: 'company',
      },
    });
    clients.push(client);
  }

  console.log(`✅ Created 10 clients for CleanPro`);

  // Create test devis (quotes)
  const devisExamples = [
    { title: 'Nettoyage bureaux étage 1', items: 3 },
    { title: 'Service nettoyage industriel complet', items: 5 },
    { title: 'Vitrerie + nettoyage façade', items: 2 },
    { title: 'Nettoyage résidentiel mensuel', items: 2 },
    { title: 'Désinfection complète bâtiment', items: 4 },
  ];

  const devis = [];
  for (let i = 0; i < 10; i++) {
    const example = devisExamples[i % devisExamples.length];
    const client = clients[i];
    const baseTotal = 500 + Math.random() * 2000;
    const taxAmount = baseTotal * 0.2;

    const newDevis = await prisma.devis.create({
      data: {
        organizationId: org1.id,
        clientId: client.id,
        number: `DV-2025-${String(i + 1).padStart(4, '0')}`,
        status: ['draft', 'sent', 'accepted'][Math.floor(Math.random() * 3)],
        createdById: user1.id,
        subtotal: baseTotal,
        taxRate: 20,
        taxAmount: taxAmount,
        total: baseTotal + taxAmount,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        devisDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
      },
    });

    // Add items
    for (let j = 0; j < example.items; j++) {
      const unitPrice = 100 + Math.random() * 500;
      const quantity = 1 + Math.random() * 10;

      await prisma.devisItem.create({
        data: {
          devisId: newDevis.id,
          description: `Service nettoyage - Item ${j + 1}`,
          quantity,
          unitPrice,
          total: unitPrice * quantity,
        },
      });
    }

    devis.push(newDevis);
  }

  console.log(`✅ Created 10 devis with items`);

  // Create test factures (invoices)
  const acceptedDevis = devis.filter((d) => d.status === 'accepted').slice(0, 5);

  for (let i = 0; i < acceptedDevis.length; i++) {
    const devisData = acceptedDevis[i];
    const client = clients[i];

    await prisma.facture.create({
      data: {
        organizationId: org1.id,
        devisId: devisData.id,
        clientId: client.id,
        number: `FA-2025-${String(i + 1).padStart(4, '0')}`,
        status: ['paid', 'unpaid', 'partial'][Math.floor(Math.random() * 3)],
        createdById: user1.id,
        subtotal: devisData.subtotal,
        taxRate: devisData.taxRate,
        taxAmount: devisData.taxAmount,
        total: devisData.total,
        amountPaid: Math.random() > 0.5 ? devisData.total : devisData.total * Math.random(),
        paymentStatus: ['paid', 'unpaid', 'partial'][Math.floor(Math.random() * 3)],
        paymentMethod: ['bank_transfer', 'check'][Math.floor(Math.random() * 2)],
        invoiceDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log(`✅ Created 5 factures`);

  // Create subscription for org1
  await prisma.subscription.create({
    data: {
      organizationId: org1.id,
      plan: 'pro',
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      price: 99,
      currency: 'EUR',
      features: {
        maxDevis: 1000,
        maxUsers: 10,
        maxClients: 500,
        features: ['ai_pricing', 'realtime_notifications', 'advanced_reports'],
      },
    },
  });

  console.log(`✅ Created subscription`);

  // Create audit logs
  await prisma.auditLog.create({
    data: {
      organizationId: org1.id,
      userId: user1.id,
      action: 'organization.created',
      entity: 'Organization',
      entityId: org1.id,
      newValues: { name: org1.name, slug: org1.slug },
    },
  });

  console.log(`✅ Created audit logs`);

  console.log('✨ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
