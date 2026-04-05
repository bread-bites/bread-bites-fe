import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { EditIcon } from 'lucide-react';

export default function ImageUpdateButton({ id }: { id: string }) {
  return (
    <Link to='/image/$id/update' params={{ id }}>
      <Button variant='outline'>
        <EditIcon size={28} />
      </Button>
    </Link>
  )
}