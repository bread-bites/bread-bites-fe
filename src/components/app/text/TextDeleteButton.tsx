import { deleteText } from '@/api/text';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { QUERY_KEY } from '@/constants/query-key';
import useModal, { usualErrorHandler } from '@/hooks/modal-hook-provider';
import { getContext } from '@/integrations/tanstack-query/root-provider';
import { AxiosCustomError } from '@/model/axios-error';
import { useMutation } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';

export default function TextDeleteButton({ id, content }: { id: string, content: string }) {
  const { show } = useModal();
  const [open, setOpen] = useState(false);
  const deleteTextEndpoint = useServerFn(deleteText);
  const { mutate, isPending } = useMutation({
    mutationKey: [QUERY_KEY.TEXT],
    mutationFn: async () => await deleteTextEndpoint({ data: { id: id } }),
    onSuccess: () => {
      show({
        title: 'Success',
        type: 'success',
        message: 'Successfully nuked 😔',
        okAction: {
          label: 'Nuked',
          onClick: () => { setOpen(false); }
        }
      });
      getContext().queryClient.invalidateQueries({ queryKey: [QUERY_KEY.TEXT] });
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
          <DialogTitle className='font-bold'>Woahh.. Hold on there!</DialogTitle>
          <DialogDescription>Are you suuuuuure to permanently nuke your text 😭</DialogDescription>
        </DialogHeader>
        <Separator />
        <div className='p-4 bg-muted/50 rounded-sm max-h-64 overflow-auto'>
          <p className='whitespace-pre-line text-sm'>{content}</p>
        </div>
        <Separator />
        <DialogFooter>
          <DialogClose>
            <Button variant="outline" disabled={isPending} onClick={() => setOpen(false)}>Nah I am good</Button>
          </DialogClose>
          <Button variant='destructive' onClick={() => mutate()} disabled={isPending}>
            Goodbye
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
