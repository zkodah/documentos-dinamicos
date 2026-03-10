-- Habilitar extensión pgvector para futura IA
CREATE EXTENSION IF NOT EXISTS vector;

-- Habilitar extensión uuid
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Log de inicialización
DO $$
BEGIN
  RAISE NOTICE 'PostgreSQL inicializado con pgvector y uuid-ossp';
END $$;
