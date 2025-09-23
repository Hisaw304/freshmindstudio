import imageCompression from "browser-image-compression";

/**
 * compressFile(file, options)
 * - returns a compressed File (or the original if compression fails)
 */
export async function compressFile(
  file,
  options = { maxSizeMB: 1.0, maxWidthOrHeight: 1600, useWebWorker: true }
) {
  try {
    const compressed = await imageCompression(file, options);
    return compressed;
  } catch (err) {
    console.warn("compressFile failed:", err);
    return file;
  }
}
