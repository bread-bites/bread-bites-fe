import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { InfoIcon } from 'lucide-react';

export default function TextDetailButton({ id }: { id: string }) {
  return (
    <Link to='/text/$id' params={{ id }}>
      <Button variant='outline'>
        <InfoIcon size={28} />
      </Button>
    </Link>
  )
}
