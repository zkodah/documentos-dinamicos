#!/bin/bash
set -e

echo "=== Documentos Dinámicos - Setup inicial ==="

# Copiar .env si no existe
if [ ! -f infra/.env ]; then
  cp infra/.env.example infra/.env
  echo "✓ infra/.env creado — edita las credenciales antes de continuar"
else
  echo "✓ infra/.env ya existe"
fi

touch backend/public/uploads/.gitkeep

# Verificar Docker
if ! command -v docker &> /dev/null; then
  echo "✗ Docker no encontrado. Instala Docker Desktop."
  exit 1
fi

echo "=== Iniciando PostgreSQL y MinIO ==="
cd infra
docker compose up -d postgres minio

echo "Esperando PostgreSQL..."
until docker compose exec postgres pg_isready -U postgres; do
  sleep 2
done

echo ""
echo "=== Setup completo ==="
echo "  PostgreSQL : localhost:5432"
echo "  MinIO API  : http://localhost:9000"
echo "  MinIO UI   : http://localhost:9001"
echo ""
echo "Próximos pasos:"
echo "  1. cd backend && npm install && npm run develop"
echo "  2. cd frontend && npm install && npm run dev"
