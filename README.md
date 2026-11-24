# 🏍️ MotoRent — Plataforma de Alquiler de Motocicletas

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

**MotoRent** es una plataforma web full-stack diseñada para gestionar el alquiler de motocicletas tanto de flota propia como de propietarios particulares (modelo *peer-to-peer* y corporativo). Permite conectar arrendatarios (**Renters**) y propietarios (**Owners**) bajo un flujo seguro con verificación documental, contratos digitales, cálculo de comisiones, pagos y registro de entrega/devolución de vehículos.

---

## Características Principales

- **Autenticación y Seguridad:**
  - Registro e inicio de sesión con **JWT (JSON Web Tokens)** y contraseñas encriptadas con **bcryptjs**.
  - Verificación de cuenta por correo electrónico y recuperación de contraseña mediante **Nodemailer**.
  - Gestión de roles diferenciados: `USER`, `RENTER`, `OWNER` y `ADMIN`.
- **Gestión y Verificación Documental (KYC):**
  - Carga y consulta cifrada de documentos del cliente (cédula de ciudadanía, licencia de conducción, comprobante de domicilio).
  - Validación de documentos legales de la motocicleta (licencia de tránsito, SOAT/vigencia) y galería de imágenes públicas.
- **Catálogo y Publicación de Motocicletas:**
  - Registro de motocicletas con especificaciones técnicas (marca, modelo, año, placa, cilindraje, kilometraje, color y tarifa diaria).
  - Control de estados del vehículo (`PENDING_APPROVAL`, `AVAILABLE`, `RESERVED`, `RENTED`, `MAINTENANCE`, `INACTIVE`, `REJECTED`).
- **Flujo de Renta, Contratos Digitales e Incidentes:**
  - Consulta de cláusulas contractuales y firma digital de contratos de arrendamiento.
  - Desglose automático de costos: subtotal, comisión de la plataforma (`platformFee`), ganancias del propietario (`ownerEarnings`) y total.
  - Registro de entregas y devoluciones (`PICKUP` / `RETURN`) con kilometraje, nivel de combustible y evidencias fotográficas, además de reporte de incidentes.
- **Dashboard y Documentación Interactiva:**
  - Panel de estadísticas y métricas generales del sistema.
  - Documentación de API interactiva integrada con **Swagger UI** (`/doc_swagger`).

---

## Stack Tecnológico

### Frontend
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Enrutamiento:** React Router DOM v7
- **Componentes UI & Iconos:** React Native Paper / React Native Vector Icons / CSS personalizado

### Backend
- **Entorno y Framework:** Node.js + Express 5 (TypeScript / ES Modules)
- **ORM y Base de Datos:** Prisma ORM v7 + PostgreSQL (`@prisma/adapter-pg`)
- **Autenticación:** JSON Web Tokens (`jsonwebtoken`) + `bcryptjs`
- **Correos Electrónicos:** `nodemailer`
- **Documentación API:** `swagger-jsdoc` & `swagger-ui-express`

---

## Estructura del Proyecto

```text
MOTORENT-PROYECTO-/
├── backend/                  # API REST con Express, TypeScript y Prisma
│   ├── prisma/
│   │   └── schema.prisma     # Modelos de base de datos PostgreSQL
│   ├── src/
│   │   ├── config/           # Configuración de base de datos, Swagger y correo
│   │   ├── controllers/      # Lógica de controladores por módulo
│   │   ├── middleware/       # Autenticación JWT y validación de datos
│   │   ├── repositories/     # Capa de acceso a datos (Prisma)
│   │   ├── routes/           # Definición de endpoints REST
│   │   ├── services/         # Lógica de negocio y servicios
│   │   ├── utils/            # Utilidades, cifrado y helpers
│   │   ├── app.ts            # Configuración de la aplicación Express
│   │   └── server.ts         # Punto de entrada del servidor
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # Aplicación SPA con React 19, Vite y TypeScript
│   ├── src/
│   │   ├── assets/           # Recursos estáticos e imágenes
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/            # Vistas (Home, Login, Register, Motos, Publicarmoto, Rentas, Contrato, Dashboard, Perfil...)
│   │   ├── App.tsx           # Configuración de rutas del cliente
│   │   └── main.tsx          # Punto de entrada de React
│   ├── package.json
│   └── vite.config.ts
│
└── package.json
```

---

## Modelo de Base de Datos (Prisma)

El esquema en PostgreSQL (`backend/prisma/schema.prisma`) está compuesto por las siguientes entidades principales:

- **`User`**: Datos de cuenta, credenciales, rol y tokens de verificación/recuperación.
- **`Renter`**: Perfil de arrendatario con documentos de identidad, licencia de conducción y estado de verificación.
- **`Owner`**: Perfil de propietario con documentación personal y relación con sus motocicletas publicadas.
- **`Moto` & `MotoDocument`**: Información técnica de la motocicleta, tarifa diaria, estado de disponibilidad y licencia de tránsito.
- **`Rental` & `Contract`**: Registro del alquiler, fechas, desglose financiero y contrato digital asociado.
- **`VehicleHandover` & `HandoverEvidence`**: Actas de entrega (`PICKUP`) y devolución (`RETURN`) con evidencias adjuntas.

---

## Instalación y Configuración Local

### Prerrequisitos
- **Node.js** (v20 o superior recomendado)
- **PostgreSQL** (instancia local o en la nube como Neon / Supabase / Railway)
- **Git**

### 1. Clonar el repositorio

```bash
git clone https://github.com/haroldmerchan2025-jpg/MOTORENT-PROYECTO-.git
cd MOTORENT-PROYECTO-
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en la carpeta `backend/` con las siguientes variables de entorno:

```env
# Servidor
PORT=3000

# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:password@localhost:5432/motorent?schema=public"

# Seguridad y JWT
JWT_SECRET="tu_clave_secreta_jwt"
DOCUMENT_ENCRYPTION_KEY="clave_de_cifrado_para_documentos"

# Configuración SMTP (Nodemailer)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="tu_correo@gmail.com"
SMTP_PASS="tu_password_de_aplicacion"

# URL del Frontend (para enlaces de verificación y recuperación)
FRONTEND_URL="http://localhost:5173"
```

Genera el cliente de Prisma y sincroniza las migraciones de la base de datos:

```bash
npx prisma generate
npx prisma migrate dev
```

Inicia el servidor de desarrollo del backend:

```bash
npm run dev
```
> El servidor estará disponible en `http://localhost:3000` y la documentación Swagger en `http://localhost:3000/doc_swagger`.

### 3. Configurar el Frontend

En una nueva terminal, accede a la carpeta `frontend/`:

```bash
cd frontend
npm install
npm run dev
```
> La aplicación web se abrirá por defecto en `http://localhost:5173`.

---

## Principales Endpoints de la API

| Módulo | Método | Endpoint | Descripción | Auth |
| :--- | :---: | :--- | :--- | :---: |
| **Auth** | `POST` | `/auth/register` | Registro de nuevo usuario | ❌ |
| **Auth** | `POST` | `/auth/login` | Inicio de sesión y obtención de JWT | ❌ |
| **Auth** | `GET` | `/auth/me` | Obtener perfil del usuario autenticado | ✅ |
| **Auth** | `GET` | `/auth/verify-email/:token` | Verificar cuenta por correo electrónico | ❌ |
| **Auth** | `POST` | `/auth/resend-verification` | Reenviar enlace de verificación | ❌ |
| **Auth** | `POST` | `/auth/forgot-password` | Solicitar recuperación de contraseña | ❌ |
| **Auth** | `POST` | `/auth/reset-password` | Restablecer contraseña con token | ❌ |
| **Perfil** | `POST` | `/create/perfil/owner` | Crear solicitud de perfil propietario | ✅ |
| **Perfil** | `POST` | `/create/perfil/renter` | Crear solicitud de perfil arrendatario | ✅ |
| **Motos** | `GET` | `/api/motos` | Listar todas las motocicletas | ❌ |
| **Motos** | `POST` | `/api/create/moto` | Publicar/registrar una nueva motocicleta | ✅ |
| **Motos** | `GET` | `/api/motos/:motoId/disponibilidad` | Consultar disponibilidad de una moto | ❌ |
| **Documentos** | `PUT` | `/api/clientes/me/documentos` | Subir documentos cifrados del cliente | ✅ |
| **Documentos** | `PUT` | `/api/motos/:motoId/documentos/:tipo` | Subir documento legal de una moto | ✅ |
| **Documentos** | `POST` | `/api/motos/:motoId/imagenes` | Subir imágenes de una motocicleta | ✅ |
| **Rentas** | `GET` | `/api/clausulas` | Listar cláusulas del contrato de renta | ❌ |
| **Rentas** | `POST` | `/api/rentas` | Crear una nueva solicitud de renta | ✅ |
| **Rentas** | `POST` | `/api/rentas/:id/contrato/firmar` | Firmar digitalmente el contrato | ✅ |
| **Rentas** | `POST` | `/api/rentas/:id/pago` | Registrar el pago de una renta | ✅ |
| **Rentas** | `POST` | `/api/rentas/:id/incidente` | Reportar un incidente durante la renta | ✅ |
| **Dashboard** | `GET` | `/dashboard` | Obtener estadísticas del panel principal | ✅ |
| **Swagger** | `GET` | `/doc_swagger` | Interfaz interactiva de documentación OpenAPI | ❌ |

---

## Scripts Disponibles

### Backend (`/backend`)
- `npm run dev`: Ejecuta el servidor en modo desarrollo con recarga en caliente (`tsx watch`).
- `npm run typecheck`: Verifica los tipos de TypeScript sin emitir archivos.
- `npm run build`: Compila el proyecto TypeScript a JavaScript en `dist/`.
- `npm start`: Ejecuta la versión compilada en producción (`node dist/server.js`).

### Frontend (`/frontend`)
- `npm run dev`: Inicia el servidor de desarrollo de Vite.
- `npm run build`: Compila la aplicación React para producción.
- `npm run lint`: Ejecuta ESLint sobre el código fuente.
- `npm run preview`: Previsualiza la versión compilada de producción.

---

## Autores

- **Hainer Castellano** — [@K-vothe](https://github.com/K-vothe)
- **Harold Merchan** — [@haroldmerchan2025-jpg](https://github.com/haroldmerchan2025-jpg)
- **Alejandro** — [@Alej01121](https://github.com/Alej01121)
