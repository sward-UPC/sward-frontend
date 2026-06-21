/**
 * Utilidades para procesar la imagen de perfil en el cliente.
 *
 * Para evitar la complejidad de S3, la foto se redimensiona/comprime en el
 * navegador (canvas) a un data URL JPEG y se persiste como texto en el backend
 * (columna avatar_url TEXT). Esto mantiene la solución simple y autocontenida.
 */

/** Tamaño máximo (lado mayor) del avatar tras redimensionar. */
const MAX_SIZE = 256;
/** Calidad JPEG de salida. */
const JPEG_QUALITY = 0.8;
/** Límite del data URL resultante (~1.5 MB) para no saturar la columna TEXT. */
export const MAX_AVATAR_BYTES = 1_500_000;

/**
 * Lee un archivo de imagen, lo recorta a un cuadrado centrado, lo escala a
 * MAX_SIZE px y devuelve un data URL JPEG comprimido.
 *
 * @throws Error si el archivo no es una imagen o no puede decodificarse.
 */
export async function compressImageToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen.');
  }

  const dataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(dataUrl);

  // Recorte cuadrado centrado para que el avatar circular se vea bien.
  const side = Math.min(img.width, img.height);
  const sx = (img.width - side) / 2;
  const sy = (img.height - side) / 2;
  const target = Math.min(MAX_SIZE, side);

  const canvas = document.createElement('canvas');
  canvas.width = target;
  canvas.height = target;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No se pudo procesar la imagen.');
  ctx.drawImage(img, sx, sy, side, side, 0, 0, target, target);

  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}

/** Estima el tamaño en bytes de un data URL base64. */
export function dataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.split(',')[1] ?? '';
  return Math.floor((base64.length * 3) / 4);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('No se pudo cargar la imagen.'));
    img.src = src;
  });
}
