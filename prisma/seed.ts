
import { Country, Role } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";

async function main() {
  console.log("Clearing existing data...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding Users...");

  await prisma.user.create({
    data: {
      id: "admin-fury",
      email: "fury@shield.com",
      name: "Nick Fury",
      password: "hashed_password",
      role: Role.ADMIN,
      country: null,
    },
  });

  await prisma.user.create({
    data: {
      id: "manager-marvel",
      email: "carol@shield.com",
      name: "Captain Marvel",
      password: "hashed_password",
      role: Role.MANAGER,
      country: Country.INDIA,
    },
  });

  await prisma.user.create({
    data: {
      id: "manager-cap",
      email: "steve@shield.com",
      name: "Captain America",
      password: "hashed_password",
      role: Role.MANAGER,
      country: Country.AMERICA,
    },
  });

  await prisma.user.create({
    data: {
      id: "member-thanos",
      email: "thanos@titan.com",
      name: "Thanos",
      password: "hashed_password",
      role: Role.MEMBER,
      country: Country.INDIA,
    },
  });

  await prisma.user.create({
    data: {
      id: "member-thor",
      email: "thor@asgard.com",
      name: "Thor",
      password: "hashed_password",
      role: Role.MEMBER,
      country: Country.INDIA,
    },
  });

  await prisma.user.create({
    data: {
      id: "member-travis",
      email: "travis@earth.com",
      name: "Travis",
      password: "hashed_password",
      role: Role.MEMBER,
      country: Country.AMERICA,
    },
  });

  console.log("Seeding Restaurants & Menu Items...");

  await prisma.restaurant.create({
    data: {
      id: "rest-india-1",
      name: "Delhi Shawarma Hub",
      country: Country.INDIA,
      menuItems: {
        create: [
          { name: "Chicken Shawarma", price: 150.0 },
          { name: "Paneer Tikka", price: 200.0 },
        ],
      },
    },
  });

  await prisma.restaurant.create({
    data: {
      id: "rest-america-1",
      name: "New York Burger Co.",
      country: Country.AMERICA,
      menuItems: {
        create: [
          { name: "Classic Cheeseburger", price: 12.5 },
          { name: "Large Fries", price: 4.0 },
        ],
      },
    },
  });

  console.log("Seeding complete!");
}

async function seedPaymentMethods() {
  await prisma.paymentMethod.createMany({
    data: [
      {
        userId: "admin-fury",
        type: "CREDIT_CARD",
        cardLast4: "4242",
        cardBrand: "Visa",
        isDefault: true,
      },
      {
        userId: "admin-fury",
        type: "UPI",
        cardLast4: null,
        cardBrand: null,
        isDefault: false,
      },
    ],
  });

  await prisma.paymentMethod.create({
    data: {
      userId: "manager-marvel",
      type: "CREDIT_CARD",
      cardLast4: "5555",
      cardBrand: "Mastercard",
      isDefault: true,
    },
  });

  // Captain America (Manager - America)
  await prisma.paymentMethod.create({
    data: {
      userId: "manager-cap",
      type: "DEBIT_CARD",
      cardLast4: "8888",
      cardBrand: "Visa",
      isDefault: true,
    },
  });

  // Thanos (Member - India)
  await prisma.paymentMethod.create({
    data: {
      userId: "member-thanos",
      type: "UPI",
      cardLast4: null,
      cardBrand: null,
      isDefault: true,
    },
  });

  // Thor (Member - India)
  await prisma.paymentMethod.create({
    data: {
      userId: "member-thor",
      type: "WALLET",
      cardLast4: null,
      cardBrand: null,
      isDefault: true,
    },
  });

  // Travis (Member - America)
  await prisma.paymentMethod.create({
    data: {
      userId: "member-travis",
      type: "CREDIT_CARD",
      cardLast4: "1111",
      cardBrand: "Amex",
      isDefault: true,
    },
  });
}

async function runSeed() {
  await main();
  await seedPaymentMethods();
  console.log("All seeding complete!");
}

runSeed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
