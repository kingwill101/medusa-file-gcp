export type PluginOptions = {
  /**
   * GCP BUCKET NAME
   */
  bucket: string;
  /**
   * private_key and client_email from GCP service account json
   * https://cloud.google.com/iam/docs/service-account-overview/
   */
  credentials: {
    client_email: string;
    private_key: string;
  }

  /**
   * fileNaming: "original" | "random" | "original_random",
   * @default: "original_random"
   */

  fileNaming?: "original" | "random" | "original_random";
};