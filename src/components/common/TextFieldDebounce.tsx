import { useDebouncedCallback } from 'use-debounce'
import { Input } from '../ui/input';

type TextFieldDebounceProps = React.ComponentProps<"input"> & {
  debounceMs?: number,
  onChange: (v: string) => void,
  size?: 'small' | 'medium'
}

export default function TextFieldDebounce(props: TextFieldDebounceProps) {
  const debounced = useDebouncedCallback((v: string) => {
    props.onChange(v)
  }, props.debounceMs ?? 300);

  return (
    <Input type='text' {...props} onChange={e => debounced(e.currentTarget.value)}/>
  )
}
