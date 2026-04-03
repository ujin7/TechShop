const fs = require('fs');
const vm = require('vm');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

function readNamedExport(filePath, symbol) {
  const code = fs.readFileSync(filePath, 'utf8')
    .replace(/export\s+const\s+/g, 'const ')
    .replace(/export\s+default\s+/g, '');
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`${code}\nthis.__out = ${symbol};`, ctx);
  return ctx.__out;
}

function toDate(value) {
  if (!value) return new Date();
  return value.includes('T') ? new Date(value) : new Date(`${value}T00:00:00.000Z`);
}

async function main() {
  const products = readNamedExport('src/data/products.js', 'products');
  const users = readNamedExport('src/data/users.js', 'users');
  const reviews = readNamedExport('src/data/reviews.js', 'reviews');
  const orders = readNamedExport('src/data/orders.js', 'orders');

  await prisma.review.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  await prisma.product.createMany({
    data: products.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      subcategory: p.subcategory,
      price: p.price,
      originalPrice: p.originalPrice ?? null,
      images: JSON.stringify(p.images ?? []),
      thumbnail: p.thumbnail ?? '',
      rating: p.rating ?? 0,
      reviewCount: p.reviewCount ?? 0,
      stock: p.stock ?? 0,
      isNew: !!p.isNew,
      isFeatured: !!p.isFeatured,
      tags: JSON.stringify(p.tags ?? []),
      description: p.description ?? '',
      specs: JSON.stringify(p.specs ?? {}),
      createdAt: toDate(p.createdAt),
    })),
  });

  const userRows = [];
  for (const u of users) {
    userRows.push({
      id: u.id,
      name: u.name,
      email: u.email,
      password: await bcrypt.hash(u.password, 10),
      avatar: u.avatar ?? null,
      createdAt: toDate(u.createdAt),
      address: u.address ? JSON.stringify(u.address) : null,
    });
  }
  await prisma.user.createMany({ data: userRows });

  for (const r of reviews) {
    await prisma.review.create({
      data: {
        id: r.id,
        productId: r.productId,
        userId: r.userId,
        userName: r.userName ?? '익명',
        rating: Number(r.rating ?? 0),
        title: r.title ?? '',
        content: r.content ?? '',
        helpful: r.helpful ?? 0,
        images: JSON.stringify(r.images ?? []),
        createdAt: toDate(r.createdAt),
      },
    });
  }

  for (const o of orders) {
    await prisma.order.create({
      data: {
        id: o.id,
        userId: o.userId,
        status: o.status ?? 'pending',
        items: JSON.stringify(o.items ?? []),
        shipping: JSON.stringify(o.shipping ?? {}),
        paymentMethod: o.paymentMethod ?? 'card',
        subtotal: o.subtotal ?? 0,
        shippingFee: o.shippingFee ?? 0,
        total: o.total ?? 0,
        orderedAt: toDate(o.orderedAt),
        deliveredAt: o.deliveredAt ? toDate(o.deliveredAt) : null,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Database seeded successfully.');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
