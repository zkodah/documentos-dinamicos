// ─── Tipos base de Strapi ────────────────────────────────────────────────────

export interface StrapiEntity {
  id: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

// ─── Schema de documento ─────────────────────────────────────────────────────

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'boolean'
  | 'select'
  | 'file'
  | 'signature'
  | 'email'
  | 'phone'

export interface SchemaField {
  name: string
  label: string
  type: FieldType
  required: boolean
  options?: string[]
  placeholder?: string
  defaultValue?: unknown
  validation?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: string
  }
}

export interface SchemaJson {
  fields: SchemaField[]
  layout?: 'single' | 'two-column'
  version?: string
}

export interface DocumentSchema extends StrapiEntity {
  nombre: string
  nombre_tecnico: string
  descripcion?: string
  version: string
  categoria: string
  schema_json: SchemaJson
  activo: boolean
  icono?: string
  color?: string
  empresa?: Empresa
}

// ─── Documento ───────────────────────────────────────────────────────────────

export type DocumentoEstado =
  | 'borrador'
  | 'completado'
  | 'validado'
  | 'rechazado'
  | 'archivado'

export interface Documento extends StrapiEntity {
  titulo: string
  data: Record<string, unknown>   // JSONB - datos del formulario
  fecha_creacion?: string
  estado: DocumentoEstado
  document_schema?: DocumentSchema
  empleado?: Empleado
  empresa?: Empresa
}

// ─── Empleado ────────────────────────────────────────────────────────────────

export type EmpleadoEstado = 'activo' | 'inactivo' | 'suspendido'

export interface Empleado extends StrapiEntity {
  identificacion: string
  nombre_completo: string
  email?: string
  telefono?: string
  cargo?: string
  departamento?: string
  estado: EmpleadoEstado
  empresa?: Empresa
}

// ─── Empresa ─────────────────────────────────────────────────────────────────

export interface Empresa extends StrapiEntity {
  nombre: string
  rut?: string
  razon_social?: string
  industria?: string
  direccion?: string
  telefono?: string
  email?: string
  sitio_web?: string
  activa: boolean
  configuracion?: Record<string, unknown>
}

// ─── Utilidades ──────────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number
  pageSize?: number
  sort?: string
  filters?: Record<string, unknown>
}

export interface ApiError {
  message: string
  status?: number
}

export interface SelectOption {
  value: string
  label: string
}

// ─── Categorías de documentos por industria ──────────────────────────────────

export const CATEGORIAS_DOCUMENTO = [
  'RRHH',
  'Legal',
  'TI',
  'Ventas',
  'Administración',
  'Educación',
  'Otro',
] as const

export type CategoriaDocumento = typeof CATEGORIAS_DOCUMENTO[number]
