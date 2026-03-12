module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: '@strapi/provider-upload-aws-s3',
      providerOptions: {
        accessKeyId: env('MINIO_ACCESS_KEY'),
        secretAccessKey: env('MINIO_SECRET_KEY'),
        endpoint: `http://${env('MINIO_ENDPOINT', 'localhost')}:${env('MINIO_PORT', 9000)}`,
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
        params: {
          Bucket: env('MINIO_BUCKET', 'documentos-files'),
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
})
