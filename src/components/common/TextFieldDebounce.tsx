import { TextField, TextFieldProps } from '@mui/material'
import { useDebouncedCallback } from 'use-debounce'

type TextFieldDebounceProps = TextFieldProps & {
  debounceMs?: number,
  onChange: (v: string) => void,
  size?: 'small' | 'medium'
}

export default function TextFieldDebounce(props: TextFieldDebounceProps) {
  const debounced = useDebouncedCallback((v: string) => {
    props.onChange(v)
  }, props.debounceMs ?? 300);

  return (
    <TextField {...props} size={props.size} onChange={e => debounced(e.currentTarget.value)}/>
  )
}
