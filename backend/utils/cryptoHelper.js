import fs from 'fs';
import crypto from 'crypto';
import xml2js from 'xml2js';

function passwordDecrypt(cryptTxt, key) {
    if (!cryptTxt || cryptTxt === '0') {
        return '';
    }

    // VB.NET có Replace(" ", "+")
    cryptTxt = cryptTxt.replace(/ /g, '+');

    const bytesBuff = Buffer.from(cryptTxt, 'base64');

    // Salt cố định như VB.NET
    const salt = Buffer.from([
        0x49, 0x76, 0x61, 0x6E, 0x20, 0x4D,
        0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76
    ]);

    // VB.NET Rfc2898DeriveBytes mặc định: SHA1, 1000 iterations
    const derivedKey = crypto.pbkdf2Sync(key, salt, 1000, 48, 'sha1');
    const aesKey = derivedKey.slice(0, 32); // 32 bytes key
    const iv = derivedKey.slice(32); // 16 bytes IV

    // Giải mã AES-256-CBC
    const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
    decipher.setAutoPadding(true);

    const decryptedBytes = Buffer.concat([
        decipher.update(bytesBuff),
        decipher.final()
    ]);

    // VB.NET dùng Encoding.Unicode (UTF-16LE)
    return decryptedBytes.toString('utf16le');
}

function passwordEncrypt(inText, key) {
    // VB.NET dùng Encoding.Unicode (UTF-16LE)
    const bytesBuff = Buffer.from(inText, 'utf16le');

    // Salt cố định như VB.NET
    const salt = Buffer.from([
        0x49, 0x76, 0x61, 0x6E, 0x20, 0x4D,
        0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76
    ]);

    // Rfc2898DeriveBytes mặc định: SHA1, 1000 iterations
    const derivedKey = crypto.pbkdf2Sync(key, salt, 1000, 48, 'sha1');
    const aesKey = derivedKey.slice(0, 32); // 32 bytes key
    const iv = derivedKey.slice(32); // 16 bytes IV

    // AES-256-CBC encrypt
    const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
    cipher.setAutoPadding(true);

    const encryptedBytes = Buffer.concat([
        cipher.update(bytesBuff),
        cipher.final()
    ]);

    // VB.NET Convert.ToBase64String
    return encryptedBytes.toString('base64');
}

async function decryptFileToXml(filePath, key) {
    if (!fs.existsSync(filePath)) {
        return ''; // file chưa tồn tại
    }

    const cipherText = fs.readFileSync(filePath, 'utf8');
    let xml = '';

    try {
        xml = passwordDecrypt(cipherText, key);
    } catch (err) {
        // fallback: file có thể chưa mã hoá, đọc như XML thuần
        xml = cipherText;
    }

    return xml; // chuỗi XML
}

// === Parse XML thành JSON object (thay cho DataSet) ===
async function parseXmlString(xmlString) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xmlString, { explicitArray: false }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

export { passwordDecrypt, passwordEncrypt, decryptFileToXml, parseXmlString };
