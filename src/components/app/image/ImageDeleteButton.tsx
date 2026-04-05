import { deleteImage } from '@/api/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { QUERY_KEY } from '@/constants/query-key';
import useModal, { usualErrorHandler } from '@/hooks/modal-hook-provider';
import { getContext } from '@/integrations/tanstack-query/root-provider';
import { AxiosCustomError } from '@/model/axios-error';
import { m } from '@paraglide/messages';
import { useMutation } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';

export default function ImageDeleteButton({ id, image }: { id: string, image: string }) {
  const { show } = useModal();
  const [open, setOpen] = useState(false);
  const deleteImageEndpoint = useServerFn(deleteImage);
  const { mutate, isPending } = useMutation({
    mutationKey: [QUERY_KEY.IMAGE],
    mutationFn: async () => await deleteImageEndpoint({ data: { id: id } }),
    onSuccess: () => {
      show({
        title: m.success(),
        type: 'success',
        message: m.image_delete_success(),
        okAction: {
          label: m.ok(),
          onClick: () => { setOpen(false); }
        }
      });
      getContext().queryClient.invalidateQueries({ queryKey: [QUERY_KEY.IMAGE] });
    },
    onError: (e: AxiosCustomError) => usualErrorHandler(show, e)
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant='destructive'></Button>}>
        <TrashIcon size={28} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='font-bold'>{m.image_delete_confirm_title()}</DialogTitle>
          <DialogDescription>{m.image_delete_confirm_message()}</DialogDescription>
        </DialogHeader>
        <Separator />
        <div>
          <img src={image} alt={id} className=' saturate-0' />
        </div>
        <Separator />
        <DialogFooter>
          <DialogClose>
            <Button variant="outline" disabled={isPending} onClick={() => setOpen(false)}>{m.image_delete_confirm_cancel()}</Button>
          </DialogClose>
          <Button variant='destructive' onClick={() => mutate()} disabled={isPending}>
            {m.image_delete_confirm_confirm()}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}
