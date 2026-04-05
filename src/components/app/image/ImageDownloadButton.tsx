import { Button } from '@/components/ui/button';
import { m } from '@paraglide/messages';
import pkg from 'file-saver';
import { DownloadIcon } from 'lucide-react';

const { saveAs } = pkg;

export default function ImageUpdateButton({ link, myImage }: { link: string, myImage: boolean }) {
  const handleDownload = () => {
    saveAs(link, link.split('/').at(-1))
  }
  return (
    <Button
      variant='success'
      onClick={handleDownload}
      className='grow'
    >
      {myImage && <DownloadIcon size={28}/>}
      {!myImage && m.result_steal()}
    </Button>
  )
}