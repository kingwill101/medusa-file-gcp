import { FileService } from "medusa-interfaces";
import { Storage, UploadResponse } from "@google-cloud/storage";
import stream from "stream";
import { GetSignedUrlConfig } from "@google-cloud/storage";
import { nanoid } from "nanoid";

export interface CredentialBody {
  client_email?: string;
  private_key?: string;
}

export interface GcpStorageServiceOptions {
  credentials: CredentialBody,
  bucket: string,
  fileNaming?: "original" | "random" | "original_random",
}

class GcpStorageService extends FileService {
  bucket_: any;
  credentials_: CredentialBody;
  gcsBaseUrl: string;
  fileNaming: "original" | "random" | "original_random" = "original_random";

  constructor({ }: any, options: GcpStorageServiceOptions) {
    super();
    this.bucket_ = options.bucket;
    this.credentials_ = options.credentials;
    this.gcsBaseUrl = `https://storage.googleapis.com/${this.bucket_}/`;
    this.fileNaming = options.fileNaming || "original_random";
  }

  storage() {
    return new Storage({
      credentials: this.credentials_
    });
  }

  upload(file: { path: string; originalname: string; }) {
    let fileName = file.originalname;
    const fileWihoutExt = file.originalname.split('.').shift();
    const fileExt = file.originalname.split('.').pop();

    switch (this.fileNaming) {
      case "original":
        fileName = file.originalname;
        break;
      case "random":
        fileName = nanoid(10) + `.${fileExt}`;
        break;
      case "original_random":
        fileName = `${fileWihoutExt}_${nanoid(10)}.${fileExt}`;
        break;
      default:
        fileName = nanoid(10) + `.${fileExt}`;
        break;
    }
    return new Promise((resolve, reject) => {

      this.storage().bucket(this.bucket_).upload(file.path, {
        destination: fileName,
        public: true
      }).then((result: UploadResponse) => {
        const bucket_file = this.storage().bucket(this.bucket_).file(fileName);
        resolve({ url: bucket_file.publicUrl() });
      }).catch((err: any) => {
        console.error(err)
        reject(err);
      });

    })
  }

  delete(fileName: string) {
    return new Promise((resolve, reject) => {
      this.storage()
        .bucket(this.bucket_)
        .file(fileName)
        .delete()
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  async getDownloadStream({ ...fileData }) {
    return this.storage()
      .bucket(this.bucket_)
      .file(fileData.fileKey)
      .createReadStream()
  }

  async getUploadStreamDescriptor({ ...fileData }) {
    const fileKey = `${fileData.name}.${fileData.ext}`;
    const pass = new stream.PassThrough();

    return {
      writeStream: pass,
      promise: pass.pipe(this.storage().bucket(this.bucket_).file(fileKey).createWriteStream()),
      url: `${this.gcsBaseUrl}/${fileKey}`,
      fileKey,
    }
  }

  async getPresignedDownloadUrl({ ...fileData }) {
    const fileKey = fileData.fileKey;

    const options = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000,  // 15 MINUTES
    } as GetSignedUrlConfig

    
    return (this.storage()
                .bucket(this.bucket_)
                .file(fileKey)
                .getSignedUrl(options))
  }
}

export default GcpStorageService;