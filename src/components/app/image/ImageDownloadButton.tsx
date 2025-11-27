import DownloadIcon from '@mui/icons-material/Download';
import { Button } from '@mui/material';
import pkg from 'file-saver';

const { saveAs } = pkg;

export default function ImageUpdateButton({ link, myImage }: { link: string, myImage: boolean }) {
  const handleDownload = () => {
    saveAs(link, link.split('/').at(-1))
  }
  return (
    <Button
      variant='contained'
      size='small'
      onClick={handleDownload}
      color='success'
      className='grow'
      startIcon={!myImage && <DownloadIcon />}
    >
      {myImage && <DownloadIcon/>}
      {!myImage && "Steal"}
    </Button>
  )
}