export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const baseKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"]
    );

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: 100000,
            hash: "SHA-256",
        },
        baseKey,
        {
            name: "AES-GCM",
            length: 256
        },
        true,
        ["encrypt", "decrypt"]
    );   
}

export async function encryptFile(
    file:File,
    masterKey: CryptoKey
): Promise<{ encryptedBuffer: ArrayBuffer; iv: Uint8Array }>{
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const fileBuffer = await file.arrayBuffer();

    const encryptedBuffer = await crypto.subtle.encrypt(
        {
            name: "AES-GCM", iv},
            masterKey,
            fileBuffer
    );
    return { encryptedBuffer, iv }
}

export async function decryptFile(
    encryptedBuffer: ArrayBuffer,
    iv: Uint8Array,
    masterKey: CryptoKey
) : Promise<ArrayBuffer> {
    return crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        masterKey,
        encryptedBuffer
    );
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}