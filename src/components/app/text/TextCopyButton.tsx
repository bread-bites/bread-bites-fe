import { Button } from '@mui/material';
import { useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


export default function ImageUpdateButton({ content, myText }: { content: string, myText: boolean }) {
  const [state, setState] = useState<'idle' | 'processing' | 'succcess' | 'failed'>('idle');
  const handleDownload = () => {
    setState('processing');
    navigator.clipboard.writeText(content).then(function () {
      setState('succcess');
      setTimeout(() => setState('idle'), 500);
    }, function () {
      setState('failed');
      setTimeout(() => setState('idle'), 500);
    });
  }

  function IconState() {
    return state === 'idle' ? <ContentCopyIcon /> :
      state === 'processing' ? <></> :
        state === 'succcess' ? <DoneIcon/> : <CloseIcon/>
  }

  return (
    <Button
      variant='contained'
      size='small'
      onClick={handleDownload}
      disabled={state !== 'idle'}
      loading={state === 'processing'}
      color='success'
      className='grow'
      startIcon={!myText && <IconState />}
    >
      {myText && <IconState />}
      {!myText && "Steal"}
    </Button>
  )
}