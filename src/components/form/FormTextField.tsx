import { useFieldContext } from "@/hooks/form-context"
import { FormGroup, TextField,  } from "@mui/material";

interface FormTextFieldProps {
  label?: string
}

export default function FormTextField({ label }: FormTextFieldProps) {
  const field = useFieldContext<string>();
  return (
    <FormGroup>
      <TextField
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
