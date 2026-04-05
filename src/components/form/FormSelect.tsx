import { useFieldContext } from "@/hooks/form-context"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "../ui/combobox";
import { Field, FieldDescription, FieldLabel } from "../ui/field";

interface FormSelectProps<TValue> {
  label?: string,
  topLabel?: boolean,
  className?: string,
  options: { label: string, value: TValue }[],
}

export default function FormSelect<TValue>({ label, options, className, topLabel = false }: FormSelectProps<TValue>) {
  const field = useFieldContext<TValue | null>();
  return (
    <Field className={className}>
      {label && topLabel && <FieldLabel>{label}</FieldLabel>}
      <div className="flex flex-col gap-1">
        <Combobox items={options}>
          <ComboboxInput aria-invalid={!field.state.meta.isValid} placeholder={label} />
          <ComboboxContent aria-invalid={!field.state.meta.isValid}>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.value} value={item.value}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        {
          !field.state.meta.isValid && (
            <FieldDescription aria-invalid>{field.state.meta.errors.map(x => x.message).join(', ')}</FieldDescription>
          )
        }
      </div>
    </Field>
  );
}
