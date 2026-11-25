import sharp from 'sharp';

/**
 * Remove near-white studio background for dark UI compositing.
 * @param {Buffer} input
 * @param {{ width: number, height: number, removeWhiteBg?: boolean }} opts
 */
export async function postProcessRaster(input, opts) {
  const { width, height, removeWhiteBg = false } = opts;
  let pipe = sharp(input).rotate();

  if (removeWhiteBg) {
    const meta = await pipe.metadata();
    const w = meta.width ?? width;
    const h = meta.height ?? height;
    const { data } = await sharp(input).rotate().ensureAlpha().resize(w, h, { fit: 'cover' }).raw().toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (lum > 248) {
        data[i + 3] = 0;
      } else if (lum > 225) {
        const edge = (248 - lum) / 23;
        data[i + 3] = Math.min(data[i + 3], Math.round(255 * edge * edge));
      }
    }
    pipe = sharp(data, { raw: { width: w, height: h, channels: 4 } });
  }

  return pipe.resize(width, height, { fit: 'cover', position: 'centre' }).webp({ quality: 88, alphaQuality: 100 }).toBuffer();
}

/** @param {Buffer} input */
export async function postProcessOgPng(input) {
  return sharp(input).rotate().resize(1200, 630, { fit: 'cover' }).png({ compressionLevel: 9 }).toBuffer();
}