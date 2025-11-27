import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import { Link } from '@tanstack/react-router';


export default function TextUpdateButton({ id }: { id: string }) {
  return (
    <Link to='/text/$id/update' params={{ id }}>
      <Button variant='contained' size='small' color='primary'>
        <EditIcon />
      </Button>
    </Link>
  )
}