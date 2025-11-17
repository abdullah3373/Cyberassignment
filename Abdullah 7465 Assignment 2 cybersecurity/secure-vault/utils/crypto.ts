
// NOTE: In a real-world application, key management is a critical security concern.
// This client-side implementation is for demonstration purposes only.
// Keys should be managed securely on the server-side.

const ALGORITHM = 'AES-GCM';
const IV_LENGTH = 12; // bytes
const KEY_ALGORITHM = { name: ALGORITHM, length: 256 };
const KEY_EXTRACTABLE = true;
const KEY_USAGES: KeyUsage[] = ['encrypt', 'decrypt'];

// Helper to convert strings to ArrayBuffer
const str2ab = (str: string): ArrayBuffer => {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

// Helper to convert ArrayBuffer to string
const ab2str = (buf: ArrayBuffer): string => {
  return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
};

// Helper to convert ArrayBuffer to Base64
const ab2b64 = (buf: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buf);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// Helper to convert Base64 to ArrayBuffer
const b642ab = (b64: string): ArrayBuffer => {
  const binary_string = window.atob(b64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

// Derives a key from a password using PBKDF2
const getKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    str2ab(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    KEY_ALGORITHM,
    KEY_EXTRACTABLE,
    KEY_USAGES
  );
};


export const encryptData = async (data: string, secret: string): Promise<string> => {
  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const key = await getKey(secret, salt);
    const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const encodedData = str2ab(data);

    const encryptedContent = await window.crypto.subtle.encrypt(
      { name: ALGORITHM, iv },
      key,
      encodedData
    );

    const encryptedBytes = new Uint8Array([...salt, ...iv, ...new Uint8Array(encryptedContent)]);
    return ab2b64(encryptedBytes.buffer);
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Could not encrypt data.');
  }
};

export const decryptData = async (encryptedBase64: string, secret: string): Promise<string> => {
  try {
    const encryptedBytes = new Uint8Array(b642ab(encryptedBase64));

    const salt = encryptedBytes.slice(0, 16);
    const iv = encryptedBytes.slice(16, 16 + IV_LENGTH);
    const data = encryptedBytes.slice(16 + IV_LENGTH);

    const key = await getKey(secret, salt);
    
    const decryptedContent = await window.crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      data
    );

    return ab2str(decryptedContent);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Could not decrypt data. Check secret or data format.');
  }
};
