import Compressor from 'compressorjs';

export const compressImage = (file: File, quality: number, width: number, height: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality,
      width,
      height,
      success: (result) => {
        resolve(result instanceof File ? result : new File([result], file.name, { type: file.type }));
      },
      error: (err) => {
        reject(err);
      }
    })
  });
}