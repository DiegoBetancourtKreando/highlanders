// ============================================================
// Script standalone de importación de Excel
// Uso: npm run import:excel -- "ruta/al/archivo.xlsx"
// ============================================================

import { importService } from "../src/services/import.service";
import { prisma } from "../src/lib/prisma";

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("❌ Debes especificar la ruta del archivo Excel");
    console.log('Uso: npx tsx scripts/import-excel.ts "ruta/al/archivo.xlsx"');
    process.exit(1);
  }

  console.log("📂 Iniciando importación desde:", filePath);
  console.log("========================================\n");

  const result = await importService.importFromExcel(filePath);

  console.log("\n========================================");
  console.log("📊 RESULTADO DE IMPORTACIÓN");
  console.log("========================================");
  console.log(`Total filas procesadas: ${result.totalRows}`);
  console.log(`✅ Importados exitosamente: ${result.successRows}`);
  console.log(`❌ Con errores: ${result.errorRows}`);

  if (result.errors.length > 0) {
    console.log("\n⚠️  DETALLE DE ERRORES:");
    result.errors.forEach((err) => {
      console.log(`  Fila ${err.row}: ${err.message}`);
    });
  }

  console.log("\n🎉 Importación finalizada!");
}

main()
  .catch((error) => {
    console.error("❌ Error en la importación:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
