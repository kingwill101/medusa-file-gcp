# Medusa File Google Cloud Storage Images
Google cloud storage plugin for medusajs


Usage

Open your `medusa.config.js` and add the below configuration

```js
module.exports = {
  plugins: [
    ...otherMedusaPlugins,
    {
      resolve: `medusa-file-gcp`,
      options: {
        bucket: process.env.GCP_BUCKET,
        credentials: {
            private_key: "----BEGIN PRIVATE KEY", 
            client_email: "myemail@example.com"
        },
      },
    },
  ]
}
```