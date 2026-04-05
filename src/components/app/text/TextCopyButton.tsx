import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { CheckIcon, XIcon, CopyIcon } from 'lucide-react';
import { m } from '@paraglide/messages';

export default function TextCopyButton({ content, myText }: { content: string, myText: boolean }) {
  const [state, setState] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const handleCopy = () => {
    setState('processing');
    navigator.clipboard.writeText(content).then(function () {
      setState('success');
      setTimeout(() => setState('idle'), 500);
    }, function () {
      setState('failed');
      setTimeout(() => setState('idle'), 500);
    });
  }

  function IconState() {
    return state === 'idle' ? <CopyIcon size={28} /> :
      state === 'processing' ? <></> :
        state === 'success' ? <CheckIcon size={28} /> : <XIcon size={28} />
  }

  return (
    <Button
      variant='success'
      onClick={handleCopy}
      disabled={state !== 'idle'}
      className='grow'
    >
      {myText && <IconState />}
      {!myText && m.result_steal()}
    </Button>
  )
}