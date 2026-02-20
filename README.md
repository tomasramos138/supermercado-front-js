Front-End 
📌 Requisitos Previos

Node.js (v18 o superior)
pnpm (v9 o superior)
Backend API ejecutándose en: http://localhost:3000

⚙️ Configuración
1️⃣ Clonar el repositorio
git clone https://github.com/upskill-team/Front-End-DSW.git
cd Front-End-DSW
2️⃣ Instalar dependencias
pnpm install
3️⃣ Crear archivo .env

Crear un archivo .env en el directorio raíz con la siguiente variable:

VITE_API_BASE_URL=http://localhost:3000/api
🚀 Ejecutar el Servidor de Desarrollo
🔹 Modo desarrollo
pnpm run dev

La aplicación estará disponible en:

http://localhost:5173
🏗️ Compilación para Producción
pnpm build
pnpm preview
🧪 Ejecutar las Pruebas
🔹 Pruebas unitarias e integración
pnpm test
🔹 Pruebas E2E con Cypress
pnpm cypress:open
🔹 Cobertura de pruebas
pnpm test:coverage
📜 Scripts Disponibles

pnpm dev → Iniciar servidor de desarrollo con recarga automática

pnpm build → Compilar aplicación para producción

pnpm preview → Vista previa de la compilación de producción

pnpm lint → Ejecutar ESLint

pnpm test → Ejecutar pruebas unitarias e integración

pnpm test:coverage → Ejecutar pruebas con reporte de cobertura

pnpm cypress:open → Abrir ejecutor de pruebas Cypress

pnpm cypress:run → Ejecutar pruebas Cypress en modo headless
