# Front-End

## Requisitos

- Node.js (v18 o superior)
- pnpm (v9 o superior)
- Backend API ejecutándose en: `http://localhost:3000`

---

## ⚙️ Configuración del Entorno

### Clonar el repositorio

```bash
git clone https://github.com/tomasramos138/supermercado-front-js
cd Front-End-DSW
```

---

### Instalar dependencias

```bash
pnpm install
```

---

### Crear archivo `.env`

Crear un archivo `.env` en el directorio raíz con la siguiente variable:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 🚀 Ejecutar el Servidor de Desarrollo

### Modo desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en:

http://localhost:5173

---

## 🏗️ Compilación para Producción

```bash
pnpm build
pnpm preview
```

---

## 🧪 Ejecutar las Pruebas

### 🔹 Pruebas unitarias e integración

```bash
pnpm test
```

### 🔹 Pruebas E2E con Cypress

```bash
pnpm cypress:open
```

### 🔹 Cobertura de pruebas

```bash
pnpm test:coverage
```

---

## 📜 Scripts Disponibles

- `pnpm run dev` → Iniciar servidor de desarrollo
- `pnpm build` → Compilar aplicación para producción
- `pnpm preview` → Vista previa de la compilación de producción
- `pnpm lint` → Ejecutar ESLint
- `pnpm test` → Ejecutar pruebas unitarias e integración
- `pnpm test:coverage` → Ejecutar pruebas con reporte de cobertura
- `pnpm cypress:open` → Abrir ejecutor de pruebas Cypress
- `pnpm cypress:run` → Ejecutar pruebas Cypress en modo headless
- `pnpm test:coverage` → Ejecutar pruebas con reporte de cobertura
- `pnpm cypress:open` → Abrir ejecutor de pruebas Cypress
- `pnpm cypress:run` → Ejecutar pruebas Cypress en modo headless
