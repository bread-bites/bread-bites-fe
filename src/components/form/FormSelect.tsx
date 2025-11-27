import { useFieldContext } from "@/hooks/form-context"
import { Autocomplete, FormControl, FormHelperText, TextField } from "@mui/material";

interface FormSelectProps<TValue> {
  label?: string,
  options: { label: string, value: TValue }[],
  className?: string
}

export default function FormSelect<TValue>({ label, options, className }: FormSelectProps<TValue>) {
  const field = useFieldContext<TValue | null>();
  return (
    <FormControl className={className}>
      <Autocomplete
        className={className}
        size="small"
        options={options}
        getOptionLabel={(option) => option.label}
        value={field.state.value ? options.find(o => o.value === field.state.value) ?? null : null}
        onChange={(_, newValue) => {
          field.handleChange(newValue !== null ? newValue.value : null);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={!field.state.meta.isValid}
          />
        )}
      />
      {
        !field.state.meta.isValid &&
        <FormHelperText>
          {field.state.meta.errors.map(x => x.message).join(', ')}
        </FormHelperText>
      }
    </FormControl>
  )
}
