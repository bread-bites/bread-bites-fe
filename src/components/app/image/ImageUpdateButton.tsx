import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import { Link } from '@tanstack/react-router';


export default function ImageUpdateButton({ id }: { id: string }) {
  return (
    <Link to='/image/$id/update' params={{ id }}>
      <Button variant='contained' size='small' color='primary'>
        <EditIcon />
      </Button>
    </Link>
  )
}