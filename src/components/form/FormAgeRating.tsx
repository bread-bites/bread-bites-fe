import { useFieldContext } from "@/hooks/form-context"
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxList } from "../ui/combobox";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { AGE_RATING_ENUM_TYPE_VALUE, AGE_RATING_SELECT, getAgeRatingLabel } from "@/constants/age-rating";
import { m } from "@paraglide/messages";
import clsx from "clsx";

interface FormSelectProps {
  topLabel?: boolean,
  className?: string
}

export default function FormAgeRating({ topLabel = false, className }: FormSelectProps) {
  const field = useFieldContext<AGE_RATING_ENUM_TYPE_VALUE>();

  return (
    <Field className={clsx("flex flex-col gap-1", className)}>
      {topLabel && <FieldLabel>{m.age_rating()}</FieldLabel>}
      <div className="flex flex-col gap-1">
        <Combobox
          items={AGE_RATING_SELECT}
          itemToStringLabel={({ value }) => getAgeRatingLabel(value)}
          value={AGE_RATING_SELECT.find(x => x.value === field.state.value) ?? AGE_RATING_SELECT[0]}
          onValueChange={(t) => { t && field.handleChange(t.value) }}
        >
          <ComboboxInput aria-invalid={!field.state.meta.isValid} placeholder={m.age_rating()}  />
          <ComboboxContent aria-invalid={!field.state.meta.isValid} alignOffset={-1} sideOffset={4} className='min-w-[calc(var(--anchor-width)+--spacing(7.4))]'>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={item.value} value={item}>
                  {getAgeRatingLabel(item.value)}
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
