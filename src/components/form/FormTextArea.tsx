import { useFieldContext } from "@/hooks/form-context"
import { Textarea } from "../ui/text-area";
import { Field, FieldDescription, FieldLabel } from "../ui/field";

interface FormTextAreaProps {
  label?: string,
  topLabel?: boolean,
  minRows?: number
}

export default function FormTextArea({ label, minRows = 4, topLabel }: FormTextAreaProps) {
  const field = useFieldContext<string>();
  return (
    <Field className="flex flex-col gap-1">
      {label && topLabel && <FieldLabel>{label}</FieldLabel>}
      <div className="flex flex-col gap-1">
        <Textarea
          value={field.state.value}
          rows={minRows}
          aria-invalid={!field.state.meta.isValid}
          onChange={(t) => field.handleChange(t.target.value)}
        />
        {
          !field.state.meta.isValid && (
            <FieldDescription aria-invalid>{field.state.meta.errors.map(x => x.message).join(', ')}</FieldDescription>
          )
        }
      </div>
    </Field>
  )
}