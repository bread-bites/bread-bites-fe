import { useFieldContext } from "@/hooks/form-context"
import { FormGroup, TextField,  } from "@mui/material";

interface FormTextAreaProps {
  label?: string
}

export default function FormTextArea({ label }: FormTextAreaProps) {
  const field = useFieldContext<string>();
  return (
    <FormGroup>
      <TextField
        multiline
        minRows={4}
        size="small"
        label={label}
        error={!field.state.meta.isValid}
        value={field.state.value}
        onChange={e => field.handleChange(e.currentTarget.value)}
        helperText={!field.state.meta.isValid && field.state.meta.errors.map(x => x.message).join(', ')}
      />
    </FormGroup>
  )
}
