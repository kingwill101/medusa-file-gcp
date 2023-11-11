var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
var gcp_exports = {};
__export(gcp_exports, {
  default: () => gcp_default
});
var import_medusa_interfaces = require("medusa-interfaces");
var import_storage = require("@google-cloud/storage");
var import_stream = __toESM(require("stream"));
bvar import_nanoid = require("nanoid");
class GcpStorageService extends import_medusa_interfaces.FileService {
  bucket_;
  credentials_;
  gcsBaseUrl;
  fileNaming = "original_random";
  constructor({}, options) {
    super();
    this.bucket_ = options.bucket;
    this.credentials_ = options.credentials;
    this.gcsBaseUrl = `https://storage.googleapis.com/${this.bucket_}/`;
    this.fileNaming = options.fileNaming || "original_random";
  }
  storage() {
    return new import_storage.Storage({
      credentials: this.credentials_
    });
  }
  upload(file) {
    let fileName = file.originalname;
    const fileWihoutExt = file.originalname.split(".").shift();
    const fileExt = file.originalname.split(".").pop();
    switch (this.fileNaming) {
      case "original":
        fileName = file.originalname;
        break;
      case "random":
        fileName = (0, import_nanoid.customAlphabet)("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 10)() + `.${fileExt}`;
        break;
      case "original_random":
        fileName = `${fileWihoutExt}_${(0, import_nanoid.customAlphabet)("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 10)()}.${fileExt}`;
        break;
      default:
        fileName = (0, import_nanoid.customAlphabet)("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 10)() + `.${fileExt}`;
        break;
    }
    return new Promise((resolve, reject) => {
      this.storage().bucket(this.bucket_).upload(file.path, {
        destination: fileName,
        public: true
      }).then((result) => {
        const bucket_file = this.storage().bucket(this.bucket_).file(fileName);
        resolve({ url: bucket_file.publicUrl() });
      }).catch((err) => {
        console.error(err);
        reject(err);
      });
    });
  }
  delete(fileName) {
    return new Promise((resolve, reject) => {
      this.storage().bucket(this.bucket_).file(fileName).delete().then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  }
  async getDownloadStream({ ...fileData }) {
    return this.storage().bucket(this.bucket_).file(fileData.fileKey).createReadStream();
  }
  async getUploadStreamDescriptor({ ...fileData }) {
    const fileKey = `${fileData.name}.${fileData.ext}`;
    const pass = new import_stream.default.PassThrough();
    return {
      writeStream: pass,
      promise: pass.pipe(this.storage().bucket(this.bucket_).file(fileKey).createWriteStream()),
      url: `${this.gcsBaseUrl}/${fileKey}`,
      fileKey
    };
  }
  async getPresignedDownloadUrl({ ...fileData }) {
    const fileKey = fileData.fileKey;
    const options = {
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1e3
    };
    return this.storage().bucket(this.bucket_).file(fileKey).getSignedUrl(options);
  }
}
var gcp_default = GcpStorageService;
module.exports = __toCommonJS(gcp_exports);
