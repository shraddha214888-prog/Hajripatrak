const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 calculation table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4);
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function generatePngBuffer(width, height, isMaskable = false) {
  // RGBA buffer: each row has 1 filter byte + width * 4 bytes
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * (isMaskable ? 0.45 : 0.42);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter byte: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // School branding theme colors: Primary deep sky blue (#0369a1 -> R:3, G:105, B:161)
      // Gradient to brighter sky blue (#0284c7 -> R:2, G:132, B:199)
      const gradT = y / height;
      let r = Math.round(2 * (1 - gradT) + 3 * gradT);
      let g = Math.round(132 * (1 - gradT) + 105 * gradT);
      let b = Math.round(199 * (1 - gradT) + 161 * gradT);
      let a = 255;

      // Rounded rectangle for card / badge inside safe zone
      const cardW = width * (isMaskable ? 0.55 : 0.65);
      const cardH = height * (isMaskable ? 0.65 : 0.72);
      const inCardX = Math.abs(dx) < cardW / 2;
      const inCardY = Math.abs(dy + height * 0.02) < cardH / 2;

      if (inCardX && inCardY) {
        // Inner white card
        r = 255;
        g = 255;
        b = 255;

        // Clipboard top clip
        if (dy < -cardH / 2 + height * 0.08 && Math.abs(dx) < width * 0.16) {
          r = 2;
          g = 132;
          b = 199;
        }

        // Checklist lines
        const relY = dy - (-cardH / 2 + height * 0.18);
        if (relY > 0 && relY < cardH * 0.65) {
          const lineIndex = Math.floor(relY / (cardH * 0.16));
          const lineY = relY % (cardH * 0.16);

          // Green check badge on right
          const inCheckX = dx > cardW * 0.22 && dx < cardW * 0.42;
          if (lineY > height * 0.02 && lineY < height * 0.08) {
            if (inCheckX) {
              r = 16;
              g = 185;
              b = 129; // Emerald green
            } else if (dx < cardW * 0.15 && dx > -cardW * 0.35) {
              // Row bar
              if (lineIndex === 0) { r = 14; g = 165; b = 233; }
              else if (lineIndex === 1) { r = 244; g = 63; b = 94; }
              else { r = 100; g = 116; b = 139; }
            }
          }
        }
      }

      // Amber "STD 7" badge on bottom-right
      const badgeDx = dx - width * 0.22;
      const badgeDy = dy - height * 0.22;
      const badgeDist = Math.sqrt(badgeDx * badgeDx + badgeDy * badgeDy);
      if (badgeDist < width * 0.16) {
        if (badgeDist > width * 0.14) {
          r = 255; g = 255; b = 255; // White border
        } else {
          r = 245; g = 158; b = 11; // Amber #f59e0b
        }
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: 6 (RGBA)
  ihdrData[10] = 0; // Compression
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT (Deflated raw data)
  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve(__dirname, '../public');

// Generate 192x192
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), generatePngBuffer(192, 192, false));
console.log('Created pwa-192x192.png');

// Generate 512x512
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), generatePngBuffer(512, 512, false));
console.log('Created pwa-512x512.png');

// Generate 512x512 maskable (with safe zone margins)
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), generatePngBuffer(512, 512, true));
console.log('Created pwa-maskable-512x512.png');

// Generate apple-touch-icon (180x180)
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generatePngBuffer(180, 180, false));
console.log('Created apple-touch-icon.png');
