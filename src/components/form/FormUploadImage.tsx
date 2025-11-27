import { useFieldContext } from '@/hooks/form-context'
import { Alert, Box, Button, FormControl, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import clsx from 'clsx';
import { useState } from 'react';
import z from 'zod';
import { useAppForm } from '@/hooks/form-hook';
import { compressImage } from '@/utilities/compressor';
import { friendlySize } from '@/utilities/file';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

interface FormUploadImageState {
  usedImage?: 'original' | 'edited';
  originalImage: File;
  originalResolution: [number, number];
  editedImage: File | null;
  editedResolution: [number, number] | null;
}

const compressionSchema = z.object({
  resolution: z.number().min(0.1).max(1),
  quality: z.number().min(0.1).max(1),
});
type compressionFormSchemaType = z.infer<typeof compressionSchema>;

export default function FormUploadImage({ maxSizeKb }: { maxSizeKb: number }) {
  // This will be the final value to be submitted
  const field = useFieldContext<File | null>();

  // This is for preview and editing purpose
  // This is not the value that will be submitted
  const [state, setState] = useState<FormUploadImageState | null>(field.state.value ? {
    originalImage: field.state.value,
    originalResolution: [0, 0],
    editedImage: null,
    editedResolution: null,
  } : null);
  const isImage = state?.originalImage.type.startsWith('image/') ?? false;

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (file) => {
      if (file && file.length === 1 && file[0]) {
        const reader = new Image();
        reader.onload = function () {
          field.handleChange(null); // Reset the field value when a new image is uploaded
          setState({ originalImage: file[0], originalResolution: [reader.width, reader.height], editedImage: null, editedResolution: null });
        }
        reader.src = URL.createObjectURL(file[0]);
      }
    }
  });

  const onPickOriginalImage = () => {
    if (state && state.originalImage) {
      field.handleChange(state.originalImage);
      setState({ ...state, editedImage: null, editedResolution: null, usedImage: 'original' });
    }
  }

  const onPickCompressedImage = () => {
    if (state && state.editedImage) {
      field.handleChange(state.editedImage);
      setState({ ...state, usedImage: 'edited' });
    }
  }

  const compressionForm = useAppForm({
    defaultValues: {
      quality: 1.0,
      resolution: 1.0,
    } as compressionFormSchemaType,
    validators: {
      onChange: compressionSchema
    },
    onSubmit: async ({ value }) => {
      if (!state) return;

      const newResolution: [number, number] = [
        Math.round(state.originalResolution[0] * value.resolution),
        Math.round(state.originalResolution[1] * value.resolution)
      ]

      const file = await compressImage(
        state.originalImage,
        value.quality,
        newResolution[0],
        newResolution[1]
      );

      setState({
        ...state,
        editedImage: file,
        editedResolution: newResolution
      });
    }
  })

  return (
    <FormControl className='flex flex-col gap-4 w-full'>
      <Box className={clsx("grid grid-cols-1 gap-4", {
        'md:grid-cols-[3fr_1fr]': state !== null && isImage,
        'md:grid-cols-1': state === null || !isImage,
      })}>
        {/* Left column - Preview */}
        <Box className='grow'>
          {/* Dropzone */}
          <Box
            {...getRootProps()}
            className={clsx('border h-full flex flex-col items-center justify-center cursor-pointer mb-4 p-4', {
              'border-dashed border-gray-400 rounded-md h-48': true,
              'border-red-500': !field.state.meta.isValid,
            })}
          >
            <input {...getInputProps()} />

            {/* Not file */}
            {state === null && (
              <Box className="flex flex-col items-center gap-2 p-4">
                <CloudUploadIcon className="text-gray-600/50 text-6xl" />
                <Typography variant="body2" className="text-gray-600/50 text-center">
                  {'Drag & drop your image here, or click to select your image'}
                </Typography>
              </Box>
            )}

            {/* File not image */}
            {state !== null && !isImage && (
              <Box className="p-4">
                <Typography variant="body2" className="text-red-500">
                  Selected file is not an image
                </Typography>
              </Box>
            )}

            {/* Preview image */}
            {state !== null && isImage && (
              !state.editedImage ? (
                <Box>
                  <img
                    src={URL.createObjectURL(state.originalImage)}
                    alt="Original"
                    className="w-full max-h-[520px] object-contain"
                  />
                </Box>
              ) : (
                <>
                  <ReactCompareSlider
                    onMouseUp={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    className='max-h-[520px]'
                    itemOne={<ReactCompareSliderImage src={URL.createObjectURL(state.originalImage)} alt="Original" />}
                    itemTwo={<ReactCompareSliderImage src={URL.createObjectURL(state.editedImage)} alt="Edited" />}
                  />
                  <Typography variant="body2" className="text-gray-600/50 text-center pt-4">
                    {'Click outside the comparison box to reupload a new image'}
                  </Typography>
                </>
              )
            )}
          </Box>
        </Box>

        {/* Right column - Toolbar */}
        <Box>
          {state !== null && isImage && (
            <Box className="flex flex-col gap-4">
              {/* Original Image Section */}
              <Box className="bg-gray-800 p-4 rounded-lg">
                <Typography variant="h6" className="mb-3">Original Image</Typography>
                <Box className="flex flex-col gap-2 mb-3">
                  <Typography className={clsx({
                    'text-red-500': state.originalImage.size > maxSizeKb * 1024,
                    'text-green-500': state.originalImage.size <= maxSizeKb * 1024,
                  })}>Size: {friendlySize(state.originalImage.size)}</Typography>
                  <Typography>Resolution: {state.originalResolution[0]} x {state.originalResolution[1]}</Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onPickOriginalImage}
                  fullWidth
                >
                  Use Original Image
                </Button>
              </Box>

              {/* Compression Section */}
              <Box className="bg-gray-800 p-4 flex flex-col gap-4 rounded-lg">
                <Typography variant="h6" className="mb-3">Image Compression</Typography>
                {
                  state.editedImage && state.editedResolution && (
                    <Box className="flex flex-col gap-2 mb-3">
                      {
                        state.editedImage &&
                        <Typography className={clsx({
                          'text-red-500'  : state.editedImage.size > maxSizeKb * 1024,
                          'text-green-500': state.editedImage.size <= maxSizeKb * 1024,
                        })}>Size: {friendlySize(state.editedImage.size)}</Typography>
                      }
                      {
                        state.editedResolution &&
                        <Typography>Resolution: {state.editedResolution[0]} x {state.editedResolution[1]}</Typography>
                      }
                    </Box>
                  )
                }
                <compressionForm.AppForm>
                  <Box className="flex flex-col gap-3">
                    <Box className="flex gap-2">
                      <compressionForm.AppField name='resolution'>
                        {
                          (field) => <field.FormNumberField className='grow' label='Resolution (downsize)' min={0.1} max={1} step={0.1} />
                        }
                      </compressionForm.AppField>
                      <compressionForm.AppField name='quality'>
                        {
                          (field) => <field.FormNumberField className='grow' label='Quality' min={0.1} max={1} step={0.1} />
                        }
                      </compressionForm.AppField>
                    </Box>
                    <Box className="flex gap-2">
                      <compressionForm.FormSubmitButton
                        className='grow'
                        onClick={() => compressionForm.handleSubmit()}
                      >Compress Image</compressionForm.FormSubmitButton>
                      {state.editedImage && (
                        <Button
                          type='button'
                          variant="contained"
                          color="primary"
                          className='grow'
                          onClick={onPickCompressedImage}
                        >
                          Use Compressed Image
                        </Button>
                      )}
                    </Box>
                  </Box>
                </compressionForm.AppForm>
              </Box>
              {
                state && state.usedImage && (
                  <Alert severity='success'>
                    Used Image: <strong>{state.usedImage === 'original' ? 'Original Image' : 'Edited Image'}</strong>
                  </Alert>
                )
              }
              {
                !field.state.meta.isValid && (
                  <Alert severity='error'>
                    {field.state.meta.errors.map(x => x.message).join(', ')}
                  </Alert>
                )
              }
            </Box>
          )}
        </Box>
      </Box>
    </FormControl>
  )
}
