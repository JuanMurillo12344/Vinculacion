#!/usr/bin/env node

/**
 * Script de Instalación y Configuración de Base de Datos
 * 
 * Ejecutar con: node scripts/setup-database.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('🚀 Configuración de Base de Datos - Sistema de Renta de Vehículos\n');

  // Verificar si existe .env
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');

  if (!fs.existsSync(envPath)) {
    console.log('📝 Creando archivo .env...');
    
    const dbUser = await question('Usuario de PostgreSQL (postgres): ') || 'postgres';
    const dbPassword = await question('Contraseña de PostgreSQL: ');
    const dbHost = await question('Host de PostgreSQL (localhost): ') || 'localhost';
    const dbPort = await question('Puerto de PostgreSQL (5432): ') || '5432';
    const dbName = await question('Nombre de la base de datos (rentacar_db): ') || 'rentacar_db';

    const databaseUrl = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=public`;
    
    const envContent = `DATABASE_URL="${databaseUrl}"\nNEXTAUTH_SECRET="${generateSecret()}"\nNEXTAUTH_URL="http://localhost:3000"\nNODE_ENV="development"\n`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Archivo .env creado\n');
  } else {
    console.log('✅ Archivo .env ya existe\n');
  }

  try {
    console.log('📦 Instalando dependencias de Prisma...');
    execSync('pnpm add prisma @prisma/client', { stdio: 'inherit' });
    console.log('✅ Dependencias instaladas\n');

    console.log('🔨 Generando cliente de Prisma...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Cliente de Prisma generado\n');

    const migrate = await question('¿Ejecutar migraciones de base de datos? (s/n): ');
    if (migrate.toLowerCase() === 's') {
      console.log('🗄️  Ejecutando migraciones...');
      execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
      console.log('✅ Migraciones completadas\n');
    }

    const studio = await question('¿Abrir Prisma Studio para ver los datos? (s/n): ');
    if (studio.toLowerCase() === 's') {
      console.log('🎨 Abriendo Prisma Studio...');
      execSync('npx prisma studio', { stdio: 'inherit' });
    }

    console.log('\n✅ ¡Configuración completada!');
    console.log('\n📚 Próximos pasos:');
    console.log('  1. Ejecuta: pnpm dev');
    console.log('  2. Abre: http://localhost:3000');
    console.log('  3. Para ver la base de datos: npx prisma studio\n');

  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

function generateSecret() {
  return require('crypto').randomBytes(32).toString('hex');
}

main();
