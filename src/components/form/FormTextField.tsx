import { useFieldContext } from "@/hooks/form-context"
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

interface FormTextFieldProps {
  label?: string;
  className?: string;
  topLabel?: boolean;
}

export default function FormTextField({ label, className, topLabel }: FormTextFieldProps) {
  const field = useFieldContext<string>();
  return (
    <Field className="flex flex-col gap-1">
      { topLabel && <FieldLabel>{label}</FieldLabel>}
      <div className="flex flex-col gap-1">
        <Input
          placeholder={label}
          className={className}
          aria-invalid={!field.state.meta.isValid}
          value={field.state.value}
          onChange={e => field.handleChange(e.currentTarget.value)}
        />
        {!field.state.meta.isValid && (
          <FieldDescription aria-invalid>{field.state.meta.errors.map(x => x.message).join(', ')}</FieldDescription>
        )}
      </div>
    </Field>
  )
}
