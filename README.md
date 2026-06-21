# CryptKit

CryptKit encrypts and decrypts full files in VS Code.

This extension is a modern replacement for an older file encryption extension.
It keeps the same command titles and password prompts, but uses authenticated
encryption for new encrypted content.

Encrypted output uses `cryptkit:v1` payloads backed by AES-256-GCM with a random
salt, random IV, and PBKDF2-SHA256 key derivation.

## Commands

- `encryptfile` encrypts the entire current document.
- `decryptfile` decrypts the entire current document.

Encryption prompts for the password twice. Decryption prompts once.
