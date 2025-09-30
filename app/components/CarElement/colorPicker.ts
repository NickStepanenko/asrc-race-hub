// Utility to convert RGB to Hex
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (x: number) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

async function getDominantColorHexIgnoringWhite(imgUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject('Canvas not supported');
        return;
      }
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const colorCount: { [key: string]: number } = {};
      let totalNonWhitePixels = 0;
      let totalPixels = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Ignore fully transparent pixels
        if (a === 0) continue;

        totalPixels++;

        // Define white threshold for "near white" (you can adjust tolerance if you want)
        const isWhite = (r >= 250 && g >= 250 && b >= 250);

        if (!isWhite) {
          totalNonWhitePixels++;
        }

        const rgbKey = `${r},${g},${b}`;
        colorCount[rgbKey] = (colorCount[rgbKey] || 0) + 1;
      }

      // If the image is fully or mostly white (no or very few non-white pixels)
      // then just return white
      if (totalNonWhitePixels === 0) {
        resolve('#FFFFFF');
        return;
      }

      // Find most frequent color excluding whites (if possible)
      let maxCount = 0;
      let dominantColor = '';
      for (const color in colorCount) {
        const [r, g, b] = color.split(',').map(Number);
        const isWhite = (r >= 250 && g >= 250 && b >= 250);
        // Skip white if other colors exist
        if (isWhite && totalNonWhitePixels > 0) continue;
        if (colorCount[color] > maxCount) {
          maxCount = colorCount[color];
          dominantColor = color;
        }
      }

      if (!dominantColor) {
        reject('No dominant color found');
        return;
      }

      const [r, g, b] = dominantColor.split(',').map(Number);
      resolve(rgbToHex(r, g, b));
    };

    img.onerror = () => {
      reject('Failed to load image');
    };
  });
}

export default getDominantColorHexIgnoringWhite;
