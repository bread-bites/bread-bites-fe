import { useFieldContext } from '@/hooks/form-context'
import { Box, Button, FormControl, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import clsx from 'clsx';
import { useState } from 'react';
import { compressAccurately, EImageType } from 'image-conversion';


interface FormUploadImageState {
  originalImage: File;
  originalResolution: [number, number];
  editedImage: File | null;
}

function friendlySize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
}

export default function FormUploadImage() {
  // This will be the final value to be submitted
  const field = useFieldContext<File | null>();

  // This is for preview and editing purpose
  // This is not the value that will be submitted
  const [state, setState] = useState<FormUploadImageState | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (file) => {
      if (file && file.length === 1 && file[0]) {
        const reader = new Image();
        reader.onload = function () {
          setState({ originalImage: file[0], originalResolution: [reader.width, reader.height], editedImage: null });
        }
        reader.src = URL.createObjectURL(file[0]);
      }
    }
  });
  const isImage = state?.originalImage.type.startsWith('image/') ?? false;

  const onPickOriginalImage = () => {
    if (state && state.originalImage) {
      field.handleChange(state.originalImage);
      setState({ ...state, editedImage: null });
    }
  }

  const onClickCompressImage = () => {
    if (state) {
      compressAccurately(state.originalImage, {
        type: EImageType.JPEG,
        scale: 0.5,
        size: 1024 * 30, // 30 KB
      }).then((compressedImage) => {
        const newImageFile = new File([compressedImage], 'compressed.jpg', { type: 'image/jpeg' });
        const reader = new Image();
        reader.onload = function () {
          setState({ ...state, editedImage: newImageFile });
        }
        reader.src = URL.createObjectURL(compressedImage);
      });
    }

  }

  return (
    <FormControl className='flex gap-2'>
      {/* Image field */}
      <Box
        {...getRootProps()}
        className={clsx('border flex flex-col items-center justify-center cursor-pointer', {
          'border-dashed border-gray-400 rounded-md h-32': true,
          'border-red-500': !field.state.meta.isValid,
        })}
      >
        <input {...getInputProps()} />

        {/* Not file */}
        {
          state === null && (
            <Box className="flex flex-col items-center gap-2">
              <CloudUploadIcon className="text-gray-600/50 text-6xl" />
              <Typography variant="body2" className="text-gray-600/50">
                {'Drag & drop your image here, or click to select your image'}
              </Typography>
            </Box>
          )
        }

        {/* File not image */}
        {
          state !== null && !isImage && (
            <Box>
              <Typography variant="body2" className="text-red-500">
                Selected file is not an image
              </Typography>
            </Box>
          )
        }

        {/* Preview image  */}
        {
          state !== null && isImage && (
            <Box>
              <img
                src={URL.createObjectURL(state.originalImage)}
                alt="Preview"
                className="max-h-32 object-contain"
              />
            </Box>
          )
        }
      </Box>

      {/* Editor field */}
      {
        state !== null && isImage && (
          <Box>
            {/* Original Image info */}
            <Box className='flex gap-2'>
              <Box>
                <Typography>Size: {friendlySize(state?.originalImage.size!)}</Typography>
                <Typography>Resolution: {state?.originalResolution[0]} x {state?.originalResolution[1]}</Typography>
              </Box>
              <Button variant='contained' color='primary' onClick={onPickOriginalImage}>
                Use Original Image
              </Button>
            </Box>
          </Box>
        )
      }

    </FormControl>
  )
}
