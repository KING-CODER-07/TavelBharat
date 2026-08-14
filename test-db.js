const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasourceUrl: "mongodb://127.0.0.1:27018/travelbharat?replicaSet=rs0"
});
prisma.place.count().then(c => console.log('Place Count:', c)).catch(console.error).finally(() => prisma.$disconnect());
