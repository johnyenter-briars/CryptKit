import * as crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const DIGEST = "sha256";
const ENCODING = "hex";
const IV_LABEL = "CryptKit IV";

function deriveKey(password: string): Buffer {
  return crypto.createHash(DIGEST).update(password, "utf8").digest();
}

function deriveIv(password: string): Buffer {
  return crypto
    .createHash(DIGEST)
    .update(IV_LABEL, "utf8")
    .update(password, "utf8")
    .digest()
    .subarray(0, 16);
}

export function encrypt(text: string, password: string): string {
  const cipher = crypto.createCipheriv(ALGORITHM, deriveKey(password), deriveIv(password));
  let encrypted = cipher.update(text, "utf8", ENCODING);
  encrypted += cipher.final(ENCODING);
  return encrypted;
}

export function decrypt(text: string, password: string): string {
  const decipher = crypto.createDecipheriv(ALGORITHM, deriveKey(password), deriveIv(password));
  let decrypted = decipher.update(text.trim(), ENCODING, "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
