import { put, del } from "@vercel/blob";

export interface StorageProvider {
  upload(file: File, path: string): Promise<{ url: string }>;
  delete(url: string): Promise<void>;
}

class VercelBlobProvider implements StorageProvider {
  async upload(file: File, path: string): Promise<{ url: string }> {
    const blob = await put(path, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return { url: blob.url };
  }

  async delete(url: string): Promise<void> {
    await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
  }
}

class LocalStorageProvider implements StorageProvider {
  async upload(file: File, path: string): Promise<{ url: string }> {
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;
    return { url: dataUrl };
  }

  async delete(_url: string): Promise<void> {
    // No-op for local storage
  }
}

export function getStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER || "local";
  if (provider === "vercel-blob") {
    return new VercelBlobProvider();
  }
  return new LocalStorageProvider();
}
