<h1>
  <img src="https://raw.githubusercontent.com/johnyenter-briars/CryptKit/refs/heads/master/resources/cryptkit.png" width="100" alt="CryptKit icon" align="center">
  CryptKit
</h1>

CryptKit encrypts and decrypts full files in VS Code.

Encrypted output is written back to replace the file.

## Commands

- `encryptfile` encrypts the entire current document.
- `decryptfile` decrypts the entire current document.

## Encryption Details

- Algorithm: AES-256-CBC
- Ciphertext encoding: hex
- Key: SHA-256 hash of the password, interpreted as 32 raw bytes
- IV: first 16 bytes of SHA-256 over `CryptKit IV` followed by the password

The IV is derived from the password. It is not stored in the encrypted output.
To reproduce the IV in another tool:

1. Start with this exact UTF-8 text:

   ```text
   CryptKit IV
   ```

2. Append the password directly after it, with no separator.

   For example, if the password is `mypassword`, hash this exact UTF-8 text:

   ```text
   CryptKit IVmypassword
   ```

3. Compute the SHA-256 hash of that text.
4. Take the first 16 raw bytes of the SHA-256 hash.
5. Use those 16 bytes as the AES-256-CBC IV.

The encrypted file only contains the hex ciphertext. To decrypt outside VS Code, the external tool must recreate the same key and IV from the password.

## AI Disclosure
- AI was used for sections of code and resources for this tool.
- All code was reviewed and tested by maintainers. 

## License
Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

## Contact
- [Open an Issue](https://github.com/johnyenter-briars/CryptKit/issues)
- [Project Link](https://github.com/johnyenter-briars/CryptKit)

## Contributing
- Contributions are most welcome.
- *But*, issues, fixes and feature requests are **not** guaranteed.
- **Use at your own risk: This software is provided "as is," without warranty of any kind, express or implied. Use it at your own discretion and responsibility.**
