import { FileService } from "medusa-interfaces";
import { Storage, UploadResponse } from "@google-cloud/storage";


export interface CredentialBody {
  client_email?: string;
  private_key?: string;
}

export interface GcpStorageServiceOptions {
  credentials: CredentialBody,
  bucket: string
}

class GcpStorageService extends FileService {
  bucket_: any;
  credentials_: CredentialBody;

  constructor({ }: any, options: GcpStorageServiceOptions) {
    super();
    this.bucket_ = options.bucket;
    this.credentials_ = options.credentials;
  }

  storage() {
    return new Storage({
      credentials: this.credentials_
    });
  }

  upload(file: { path: string; originalname: string; }) {
    return new Promise((resolve, reject) => {

      this.storage().bucket(this.bucket_).upload(file.path, {
        destination: file.originalname,
        public: true
      }).then((result: UploadResponse) => {
        const bucket_file = this.storage().bucket(this.bucket_).file(file.originalname);
        resolve({ url: bucket_file.publicUrl() });
      }).catch((err: any) => {
        console.error(err)
        reject(err);
      });

    })
  }

  delete(fileName: string) {
    return new Promise((resolve, reject) => {

      var url = fileName.split(`https://storage.googleapis.com/${this.bucket_}/`);

      fileName = url[url.length - 1];

      this.storage().bucket(this.bucket_).file(fileName).delete().then((res: unknown) => {
        resolve(res);
      }).catch((err: any) => {
        console.error(err);
        reject(err);
      });
    });
  }

}

export default GcpStorageService;