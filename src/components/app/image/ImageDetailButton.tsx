import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { InfoIcon } from 'lucide-react';

export default function ImageDetailButton({ id }: { id: string }) {
  return (
    <Link to='/image/$id' params={{ id }}>
      <Button variant='outline'>
        <InfoIcon size={28} />
      </Button>
    </Link>
  )
}