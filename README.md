# Medusa File Google Cloud Storage Images

Google Cloud Platform (GCP) storage plugin for Medusa.js

## Prerequisites

- [Medusa backend](https://docs.medusajs.com/development/backend/install/)
- [Google Cloud Platform (GCP)](https://cloud.google.com/)

## How to install

1. Run the following command in the directory of your Medusa backend:

```
npm install medusa-plugin-gcp
```

2. Add following environment variables into your `.env`:

```
GCP_BUCKET=<YOUR_BUCKET_NAME>
GCP_PRIVATE_KEY=<YOUR_SERVICE_ACCOUNT_PRIVATE_KEY>
GCP_CLIENT_EMAIL=<YOUR_SERVICE_ACCOUNT_IAM_EMAIL>
```

3. Open your `medusa.config.js` and add the below configuration:

```js
module.exports = {
  plugins: [
    ...otherMedusaPlugins,
    {
      resolve: `medusa-plugin-gcp`,
      /** @type {import('medusa-plugin-gcp').PluginOptions} */
      options: {
        bucket: process.env.GCP_BUCKET,
        fileNaming: "original_random", // @default to original_random, options: original, random, original_random
        credentials: {
          private_key: process.env.GCP_PRIVATE_KEY,
          client_email: process.env.GCP_CLIENT_EMAIL,
        },
      },
    },
  ],
};
```

## Test the plugin

1. Run your Medusa backend:

```
npm run dev
```

2. Try to upload an image for a product using Medusa's admin interface. The image should appear into your storage bucket.

## Additional resources

- [GCP Storage Buckets](Bucketshttps://cloud.google.com/storage/docs/creating-buckets/)
- [GCP Service Accounts](https://cloud.google.com/iam/docs/service-account-overview/)
- [@google-cloud/storage (package)](https://www.npmjs.com/package/@google-cloud/storage/)
