# NEXUS

Plataforma moderna de conversación y roleplay con inteligencia artificial. NEXUS es una aplicación web avanzada inspirada en estructuras modernas de chat con IA pero con identidad, diseño y código propios.

## 🎭 Características

### Personajes
- Crear, editar, duplicar y eliminar personajes sin límites
- Configuración extensible:
  - Nombre, imagen, personalidad, apariencia
  - Historia, profesión, relaciones, escenario
  - Contexto, lore extenso, información adicional
  - Mensaje inicial, guía interna para la IA
  - Temperatura, configuraciones del modelo
  - Etiquetas, estado público/privado
  - Tipo: Real, Ficticio o Mixto

### Perfiles de Usuario
- Múltiples perfiles reutilizables
- Descripción libre y extensible
- Sin perfil predefinido obligatorio

### Chats
- Conversaciones multipersona
- Historial persistente
- Sistema de memoria avanzado
- Chats favoritos y carpetas
- Exportación e importación
- Búsqueda integrada

### Interfaz
- Tema oscuro con colores: negro, rojo y blanco
- Diseño moderno y elegante
- 100% responsive (móvil, tablet, PC)
- Sin overflow horizontal
- Animaciones suaves

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Zustand (State Management)
- React Router

### Backend
- Node.js + Express
- TypeScript
- MongoDB
- JWT Authentication
- Mongoose ODM

### Herramientas
- Concurrently (dev)
- TSX (TypeScript execution)
- PostCSS + Autoprefixer

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- MongoDB (local o Atlas)

## 🚀 Inicio Rápido

### 1. Clonar el repositorio
```bash
git clone https://github.com/luvssj0-wq/aichat-roleplay.git
cd aichat-roleplay
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita `.env` con tus valores:
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/nexus
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key
VITE_API_URL=http://localhost:3000/api
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

Esto ejecutará:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### 5. Build para producción
```bash
npm run build
```

## 📁 Estructura del Proyecto

```
aichat-roleplay/
├── src/
│   ├── client/          # Frontend React
│   │   ├── components/  # Componentes reutilizables
│   │   ├── pages/       # Páginas principales
│   │   ├── store/       # Zustand stores
│   │   ├── styles/      # Estilos globales
│   │   ├── api/         # Clientes API
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── server/          # Backend Express
│   │   └── index.ts
│   └── types/           # TypeScript types compartidos
├── dist/                # Build output
├── tailwind.config.js   # Config Tailwind
├── vite.config.ts       # Config Vite
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies
```

## 🎨 Paleta de Colores

- **Primario**: Rojo (#ff0000)
- **Fondo**: Negro/Gris oscuro (#111827, #1f2937)
- **Texto**: Blanco (#ffffff)
- **Secundario**: Gris oscuro (#dark-800)

## 📚 Documentación Adicional

- [Tipos TypeScript](./src/types/README.md) (próximamente)
- [API REST](./docs/API.md) (próximamente)
- [Guía de Componentes](./docs/COMPONENTS.md) (próximamente)

## 🔐 Seguridad

- JWT para autenticación
- CORS configurado
- Variables de entorno protegidas
- Validación de entrada

## 📝 Licencia

MIT

## 👤 Autor

luvssj0

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes, abre un issue primero.
