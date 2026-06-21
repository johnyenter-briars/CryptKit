import * as crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const FORMAT_PREFIX = "cryptkit:v1";
const IV_LENGTH = 12;
const KEY_LENGTH = 32;
const PBKDF2_DIGEST = "sha256";
const PBKDF2_ITERATIONS = 310000;
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;

function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(
    password,
    salt,
    PBKDF2_ITERATIONS,
    KEY_LENGTH,
    PBKDF2_DIGEST,
  );
}

function toBase64Url(buffer: Buffer): string {
  return buffer.toString("base64url");
}

function fromBase64Url(value: string, fieldName: string): Buffer {
  try {
    return Buffer.from(value, "base64url");
  } catch {
    throw new Error(`Invalid encrypted payload: ${fieldName} is not base64url.`);
  }
}

export function encrypt(text: string, password: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = deriveKey(password, salt);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: TAG_LENGTH,
  });

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    FORMAT_PREFIX,
    toBase64Url(salt),
    toBase64Url(iv),
    toBase64Url(authTag),
    toBase64Url(encrypted),
  ].join(".");
}

export function decrypt(payload: string, password: string): string {
  const parts = payload.trim().split(".");
  if (parts.length !== 5 || parts[0] !== FORMAT_PREFIX) {
    throw new Error("Invalid encrypted payload format.");
  }

  const salt = fromBase64Url(parts[1], "salt");
  const iv = fromBase64Url(parts[2], "iv");
  const authTag = fromBase64Url(parts[3], "auth tag");
  const encrypted = fromBase64Url(parts[4], "ciphertext");

  if (salt.length !== SALT_LENGTH || iv.length !== IV_LENGTH || authTag.length !== TAG_LENGTH) {
    throw new Error("Invalid encrypted payload parameters.");
  }

  const key = deriveKey(password, salt);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);

  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString("utf8");
}
