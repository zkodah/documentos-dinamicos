module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'strapi-provider-upload-minio',
      providerOptions: {
        accessKey: env('MINIO_ACCESS_KEY'),
        secretKey: env('MINIO_SECRET_KEY'),
        endpoint: env('MINIO_ENDPOINT', 'localhost'),
        port: env.int('MINIO_PORT', 9000),
        useSSL: env.bool('MINIO_USE_SSL', false),
        bucket: env('MINIO_BUCKET', 'documentos-files'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
})
