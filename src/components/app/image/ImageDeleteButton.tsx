import { deleteImage } from '@/api/image';
import { QUERY_KEY } from '@/constants/query-key';
import useModal, { usualErrorHandler } from '@/hooks/modal-hook-provider';
import { getContext } from '@/integrations/tanstack-query/root-provider';
import { AxiosCustomError } from '@/model/axios-error';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, Divider } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useState } from 'react';

export default function ImageDeleteButton({ id, image }: { id: string, image: string }) {
  const { show } = useModal();
  const [state, setState] = useState(false);
  const deleteImageEndpoint = useServerFn(deleteImage);
  const { mutate, isPending } = useMutation({
    mutationKey: [QUERY_KEY.IMAGE],
    mutationFn: async () => await deleteImageEndpoint({ data: { id: id } }),
    onSuccess: () => {
      show({
        title: 'Success',
        type: 'success',
        message: 'Successfully nuked 😔',
        okAction: {
          label: 'Nuked',
          onClick: () => setState(false)
        }
      });
      getContext().queryClient.invalidateQueries({ queryKey: [QUERY_KEY.IMAGE] });
    },
    onError: (e: AxiosCustomError) => usualErrorHandler(show, e)
  });

  const handleClose: DialogProps['onClose'] = () => {
    return;
  }

  return (
    <>
      <Button variant='contained' size='small' color='error' onClick={() => setState(true)}>
        <DeleteIcon />
      </Button>
      <Dialog open={state} onClose={handleClose} >
        <DialogTitle>Woahh.. Hold on there!</DialogTitle>
        <Divider />
        <DialogContent className='flex flex-col gap-4'>
          <img src={image} alt={id} className='min-h-40 saturate-0' />
          <DialogContentText>
            Are you suuuuuuuure to permanently nuke your image 😭
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button variant="contained" loading={isPending} color="success" onClick={() => setState(false)}>Nah I am good</Button>
          <Button variant="contained" loading={isPending} color="error" onClick={() => mutate()}>Goodbye</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
