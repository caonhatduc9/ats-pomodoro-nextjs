import getPixels from 'get-pixels';

interface ImageBrightnessResult {
  brightness: number;
  type: 'dark' | 'light';
}

export const checkImageBrightness = (imagePath: string): Promise<ImageBrightnessResult> => {
  return new Promise((resolve, reject) => {
    getPixels(imagePath, (err, pixels) => {
      if (err) {
        reject('Error loading image');
        return;
      }

      let totalBrightness = 0;
      const data = pixels.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        totalBrightness += brightness;
      }

      const averageBrightness = totalBrightness / (pixels.shape[0] * pixels.shape[1]);
      const result: ImageBrightnessResult = {
        brightness: averageBrightness,
        type: averageBrightness < 128 ? 'dark' : 'light',
      };

      resolve(result);
    });
  });
};
