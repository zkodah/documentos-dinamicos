import { strapiClient } from '@/shared/services/strapi'
import type { StrapiListResponse, StrapiResponse } from '@/shared/services/strapi'
import type { SchemaJson } from '@/shared/types'

export interface SchemaDto {
  nombre: string
  nombre_tecnico: string
  descripcion?: string
  version: string
  categoria: string
  schema_json: SchemaJson
  activo: boolean
  icono?: string
  color?: string
  publishedAt?: string
}

export interface SchemaAttributes {
  nombre: string
  nombre_tecnico: string
  descripcion?: string
  version: string
  categoria: string
  schema_json: SchemaJson
  activo: boolean
  icono?: string
  color?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export const schemasService = {
  async list() {
    const res = await strapiClient.get<StrapiListResponse<SchemaAttributes>>(
      '/document-schemas?publicationState=preview&sort=createdAt:desc'
    )
    return res.data
  },

  async get(id: number) {
    const res = await strapiClient.get<StrapiResponse<SchemaAttributes>>(
      `/document-schemas/${id}?publicationState=preview`
    )
    return res.data
  },

  async create(dto: SchemaDto) {
    const res = await strapiClient.post<StrapiResponse<SchemaAttributes>>(
      '/document-schemas',
      { data: { ...dto, publishedAt: new Date().toISOString() } }
    )
    return res.data
  },

  async update(id: number, dto: Partial<SchemaDto>) {
    const res = await strapiClient.put<StrapiResponse<SchemaAttributes>>(
      `/document-schemas/${id}`,
      { data: dto }
    )
    return res.data
  },

  async remove(id: number) {
    await strapiClient.delete(`/document-schemas/${id}`)
  },
}
