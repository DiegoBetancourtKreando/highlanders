// ============================================================
// SEED - Inicialización de la base de datos
// npx prisma db seed
// ============================================================

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de HighLanders Uniforms...\n");

  // 1. Categorías
  console.log("📁 Creando categorías...");
  const categories = [
    { name: "Sub-4", slug: "sub-4", order: 1 },
    { name: "Sub-5", slug: "sub-5", order: 2 },
    { name: "Sub-6", slug: "sub-6", order: 3 },
    { name: "Sub-7", slug: "sub-7", order: 4 },
    { name: "Sub-8", slug: "sub-8", order: 5 },
    { name: "Sub-9", slug: "sub-9", order: 6 },
    { name: "Sub-10", slug: "sub-10", order: 7 },
    { name: "Sub-11", slug: "sub-11", order: 8 },
    { name: "Sub-12", slug: "sub-12", order: 9 },
    { name: "Sub-13", slug: "sub-13", order: 10 },
    { name: "Sub-14", slug: "sub-14", order: 11 },
    { name: "Sub-16", slug: "sub-16", order: 12 },
    { name: "Sub-22", slug: "sub-22", order: 13 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, order: cat.order },
      create: cat,
    });
  }
  console.log(`   ✅ ${categories.length} categorías creadas`);

  // 2. Sedes
  console.log("📍 Creando sedes...");
  const venues = [
    { name: "A. La Pampa", slug: "a-la-pampa", order: 1 },
    { name: "B. Carcelén", slug: "b-carcelen", order: 2 },
    { name: "C. El Portal", slug: "c-el-portal", order: 3 },
    { name: "D. Pomasqui", slug: "d-pomasqui", order: 4 },
  ];

  for (const venue of venues) {
    await prisma.venue.upsert({
      where: { slug: venue.slug },
      update: { name: venue.name, order: venue.order },
      create: venue,
    });
  }
  console.log(`   ✅ ${venues.length} sedes creadas`);

  // 3. Posiciones
  console.log("⚽ Creando posiciones...");
  const positions = [
    { name: "GK", fullName: "Portero (Goalkeeper)", slug: "gk" },
    { name: "DF", fullName: "Defensa (Defender)", slug: "df" },
    { name: "MF", fullName: "Mediocampista (Midfielder)", slug: "mf" },
    { name: "WG", fullName: "Extremo (Winger)", slug: "wg" },
    { name: "FW", fullName: "Delantero (Forward)", slug: "fw" },
  ];

  for (const pos of positions) {
    await prisma.position.upsert({
      where: { slug: pos.slug },
      update: { name: pos.name, fullName: pos.fullName },
      create: pos,
    });
  }
  console.log(`   ✅ ${positions.length} posiciones creadas`);

  // 4. Tipos de uniforme
  console.log("👕 Creando tipos de uniforme...");
  const uniformTypes = [
    { name: "Uniforme completo", slug: "uniforme-completo" },
    { name: "Solo camiseta", slug: "solo-camiseta" },
    { name: "Solo pantaloneta", slug: "solo-pantaloneta" },
    { name: "Solo medias", slug: "solo-medias" },
  ];

  for (const ut of uniformTypes) {
    await prisma.uniformType.upsert({
      where: { slug: ut.slug },
      update: { name: ut.name },
      create: ut,
    });
  }
  console.log(`   ✅ ${uniformTypes.length} tipos de uniforme creados`);

  // 5. Estilos de uniforme
  console.log("🎨 Creando estilos de uniforme...");
  const uniformStyles = [
    { name: "Titular (verde con dorado)", slug: "titular-verde-dorado", color: "Verde con dorado" },
  ];

  for (const us of uniformStyles) {
    await prisma.uniformStyle.upsert({
      where: { slug: us.slug },
      update: { name: us.name, color: us.color },
      create: us,
    });
  }
  console.log(`   ✅ ${uniformStyles.length} estilo de uniforme creado`);

  // 6. Tallas de uniforme
  console.log("📏 Creando tallas...");
  const sizes = [
    { name: "28", category: "numeric", order: 1 },
    { name: "30", category: "numeric", order: 2 },
    { name: "32", category: "numeric", order: 3 },
    { name: "34", category: "numeric", order: 4 },
    { name: "36", category: "numeric", order: 5 },
    { name: "38", category: "numeric", order: 6 },
    { name: "40", category: "numeric", order: 7 },
    { name: "42", category: "numeric", order: 8 },
    { name: "XS", category: "letter", order: 9 },
    { name: "S", category: "letter", order: 10 },
    { name: "M", category: "letter", order: 11 },
    { name: "L", category: "letter", order: 12 },
    { name: "XL", category: "letter", order: 13 },
    { name: "XXL", category: "letter", order: 14 },
  ];

  for (const size of sizes) {
    await prisma.uniformSize.upsert({
      where: { name: size.name },
      update: { category: size.category, order: size.order },
      create: size,
    });
  }
  console.log(`   ✅ ${sizes.length} tallas creadas`);

  // 7. Usuario administrador por defecto
  console.log("🔐 Creando usuario administrador...");
  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.adminUser.upsert({
    where: { email: "admin@highlanders.com" },
    update: {
      passwordHash,
      fullName: "Administrador Sistema",
      role: "superadmin",
    },
    create: {
      email: "admin@highlanders.com",
      passwordHash,
      fullName: "Administrador Sistema",
      role: "superadmin",
    },
  });
  console.log("   ✅ Usuario admin creado: admin@highlanders.com / admin123");

  console.log("\n🎉 Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
