import db from '@/services/database'

const items = [
  {
    id: 1, firstName: "John", lastName: "Doe", email: "john@example.com", password: "123456"
  },
  { id: 2, firstName: "Jane", lastName: "Doe", email: "jane@example.com", password: "123456" },
];

const seed = async (items: Array<Record<string, any>>) => {
  console.log("Creating items ...");

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    console.log("Creating item:", item);
    await db.user.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }
};

seed(items)
  .then(() => {
    console.log("Created/Updated users successfully.");
  })
  .catch((error) => {
    console.error("Error:", error);
  })
  .finally(() => {
    db.$disconnect();
    console.log("Disconnected Prisma Client, exiting.");
  });
