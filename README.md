# 📋 Documentos Dinámicos

> Sistema SaaS de gestión documental con **Schema Builder visual** para crear formularios personalizados sin código.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Strapi](https://img.shields.io/badge/Strapi-4.25-purple)](https://strapi.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)

---

## 🎯 ¿Qué Resuelve?

Las empresas necesitan gestionar **múltiples tipos de documentos** que cambian constantemente. La solución tradicional requiere desarrollo cada vez que aparece un nuevo tipo de formulario.

**Con Documentos Dinámicos:**
- ✅ Administradores crean tipos de documentos desde la UI — sin código
- ✅ Formularios generados automáticamente desde el schema
- ✅ Multi-tenant: aislamiento completo por empresa
- ✅ Aplicable a cualquier industria

---

## ⭐ Features Principales

### 🎨 Schema Builder Visual
- Agregar campos (texto, número, fecha, archivo, select, firma, etc.)
- Validaciones configurables por campo
- Preview en tiempo real del formulario
- Categorías flexibles (RRHH, Legal, TI, Ventas, etc.)

### 📝 Formularios Auto-generados
- Sistema lee el schema JSON y genera el formulario completo
- Validaciones client-side y server-side
- Soporte para archivos adjuntos via MinIO

### 🏢 Multi-tenant
- Schemas públicos o específicos por empresa
- Datos completamente aislados entre organizaciones

---

## 🏗️ Stack

| Capa       | Tecnología                          |
|------------|-------------------------------------|
| Frontend   | Next.js 14 + TypeScript + Tailwind  |
| Backend    | Strapi 4.25 (Headless CMS)          |
| Base datos | PostgreSQL 16 + pgvector            |
| Storage    | MinIO (S3-compatible)               |
| Auth       | NextAuth.js + Strapi JWT            |
| Infra      | Docker Compose                      |

---

## 🚀 Quick Start

```bash
# 1. Clonar
git clone https://github.com/zkodah/documentos-dinamicos.git
cd documentos-dinamicos

# 2. Configurar variables
cp infra/.env.example infra/.env
# Editar infra/.env con tus valores reales

# 3. Levantar servicios de infra
cd infra
docker compose up -d postgres minio

# 4. Iniciar backend (primera vez)
cd ../backend
npm install
npm run develop   # genera admin en http://localhost:1337/admin

# 5. Iniciar frontend
cd ../frontend
npm install
npm run dev       # http://localhost:3000
```

---

## 🎓 Casos de Uso

| Área | Documentos |
|------|-----------|
| RRHH | Contratos laborales, certificados de antigüedad, evaluaciones |
| Legal | Contratos comerciales, NDA, poderes legales |
| TI | Inventario de equipos, solicitudes de acceso, incidentes |
| Ventas | Cotizaciones, contratos comerciales |
| Educación | Certificados, diplomas, registros académicos |
| Administración | Formularios internos, autorizaciones |

---

## 📁 Estructura

```
documentos-dinamicos/
├── frontend/          # Next.js 14
│   └── src/domains/   # Auth, Schemas, Documentos, Empleados, Empresas
├── backend/           # Strapi 4.25
│   ├── config/        # DB, server, plugins
│   └── src/api/       # document-schema, documento, empleado, empresa
├── infra/             # Docker Compose + configs
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── postgres/
│   └── nginx/
├── scripts/
└── docs/
```

---

## 👨‍💻 Autor

**Manuel Alejandro Luque Treupil** · [@zkodah](https://github.com/zkodah)
