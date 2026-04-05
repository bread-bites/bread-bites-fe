import { useFieldContext } from '@/hooks/form-context'
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import { useState } from 'react';
import z from 'zod';
import { useAppForm } from '@/hooks/form-hook';
import { compressImage } from '@/utilities/compressor';
import { friendlySize } from '@/utilities/file';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Button } from '../ui/button';
import { m } from '@paraglide/messages';
import { CloudUploadIcon } from 'lucide-react';

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

export default function FormUploadImage({ maxSize }: { maxSize: number }) {
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
    <div className='flex flex-col gap-4 w-full'>
      <div className={clsx("grid grid-cols-1 gap-4", {
        'md:grid-cols-[3fr_1fr]': state !== null && isImage,
        'md:grid-cols-1': state === null || !isImage,
      })}>
        {/* Left column - Preview */}
        <div className='grow'>
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={clsx('border h-full flex flex-col items-center justify-center cursor-pointer mb-4 p-4', {
              'border-dashed border-gray-400 rounded-md h-48': true,
              'border-red-500': !field.state.meta.isValid,
            })}
          >
            <input {...getInputProps()} />

            {/* Not file */}
            {state === null && (
              <div className="flex flex-col items-center gap-2 p-4">
                <CloudUploadIcon size={64} className="text-gray-600/50 text-6xl" />
                <p className="text-gray-600/50 text-center">
                  {m.image_uploader_drop()}
                </p>
              </div>
            )}

            {/* File not image */}
            {state !== null && !isImage && (
              <div className="p-4">
                <p className="text-red-500">
                  {m.image_uploader_not_image()}
                </p>
              </div>
            )}

            {/* Preview image */}
            {state !== null && isImage && (
              !state.editedImage ? (
                <div>
                  <img
                    src={URL.createObjectURL(state.originalImage)}
                    alt="Original"
                    className="w-full max-h-[520px] object-contain"
                  />
                </div>
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
                  <p className="text-gray-600/50 text-center pt-4">
                    {m.image_uploader_click_outside()}
                  </p>
                </>
              )
            )}
          </div>
        </div>

        {/* Right column - Toolbar */}
        <div>
          {state !== null && isImage && (
            <div className="flex flex-col gap-4">
              {/* Original Image Section */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="mb-3">{m.image_uploader_original()}</p>
                <div className="flex flex-col gap-2 mb-3">
                  <p className={clsx({
                    'text-red-500': state.originalImage.size > maxSize,
                    'text-green-500': state.originalImage.size <= maxSize,
                  })}>{m.size()}: {friendlySize(state.originalImage.size)}</p>
                  <p>{m.resolution()}: {state.originalResolution[0]} x {state.originalResolution[1]}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={onPickOriginalImage}
                >
                  {m.image_uploader_use_original()}
                </Button>
              </div>

              {/* Compression Section */}
              <div className="bg-gray-800 p-4 flex flex-col gap-4 rounded-lg">
                <p>{m.image_compression()}</p>
                {
                  state.editedImage && state.editedResolution && (
                    <div className="flex flex-col gap-2 mb-3">
                      {
                        state.editedImage &&
                        <p className={clsx({
                          'text-red-500'  : state.editedImage.size > maxSize,
                          'text-green-500': state.editedImage.size <= maxSize,
                        })}>{m.size()}: {friendlySize(state.editedImage.size)}</p>
                      }
                      {
                        state.editedResolution &&
                        <p>{m.resolution()}: {state.editedResolution[0]} x {state.editedResolution[1]}</p>
                      }
                    </div>
                  )
                }
                <compressionForm.AppForm>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <compressionForm.AppField name='resolution'>
                        {
                          (field) => <field.FormNumberField min={0.1} max={1} step={0.1} topLabel className='grow' label={m.resolution()} />
                        }
                      </compressionForm.AppField>
                      <compressionForm.AppField name='quality'>
                        {
                          (field) => <field.FormNumberField min={0.1} max={1} step={0.1} topLabel className='grow' label={m.quality()} />
                        }
                      </compressionForm.AppField>
                    </div>
                    <div className="flex gap-2">
                      <compressionForm.FormSubmitButton
                        className='grow'
                        onClick={() => compressionForm.handleSubmit()}
                      >{m.image_uploader_compressed()}</compressionForm.FormSubmitButton>
                      {state.editedImage && (
                        <Button
                          variant="outline"
                          className='grow'
                          onClick={onPickCompressedImage}
                        >
                          {m.image_uploader_use_compressed()}
                        </Button>
                      )}
                    </div>
                  </div>
                </compressionForm.AppForm>
              </div>
              {
                state && state.usedImage && (
                  <p className='text-green-500'>
                    {m.image_uploader_used_image()}: <strong>{state.usedImage === 'original' ? m.image_uploader_original() : m.image_uploader_compressed()}</strong>
                  </p>
                )
              }
              {
                !field.state.meta.isValid && (
                  <p className='text-red-500'>
                    {field.state.meta.errors.map(x => x.message).join(', ')}
                  </p>
                )
              }
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
