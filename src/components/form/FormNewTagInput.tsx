import { QUERY_KEY } from "@/constants/query-key";
import { useFieldContext } from "@/hooks/form-context"
import { getTag } from "@/api/tag";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue } from "../ui/combobox";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import clsx from "clsx";
import { m } from "@paraglide/messages";
import { BaseUIEvent } from "@base-ui/react";
import { useDebouncedCallback } from "use-debounce";

interface FormNewTagInputProps {
  label?: string,
  className?: string,
  topLabel?: boolean,
}

export default function FormNewTagInput({ label, topLabel = false, className = '' }: FormNewTagInputProps) {
  const field = useFieldContext<string[] | null>();
  const [inputState, setInputState] = useState<string>('');

  const debounced = useDebouncedCallback((v: string) => handleOnInputChange(v), 300);

  const getTagEndpoint = useServerFn(getTag);
  const { data, isLoading, isEnabled } = useQuery({
    queryKey: [QUERY_KEY.TAG, inputState],
    queryFn: async () => await getTagEndpoint({ data: { name: inputState } }),
    enabled: inputState.length >= 1
  });
  const memoData = useMemo(() => data?.map(x => x.name) ?? [], [data]);

  const handleOnChange = (newValue: string[]) => {
    field.handleChange(newValue
      .map(v => v.trim().replaceAll(' ', '_').toLowerCase())
      .filter((v, i, a) => (a.indexOf(v) === i && v.trim().length > 0))
    );
  }

  const handleOnInputChange = (value: string) => {
    setInputState(value.trim().replaceAll(' ', '_').toLowerCase());
  }

  const handleOnEnterCustom = (e: BaseUIEvent<React.KeyboardEvent<HTMLInputElement>>) => {
    if (e.nativeEvent.key === 'Enter' && inputState.trim().length > 0) {
      e.preventDefault();
      const newTag = inputState.trim().replaceAll(' ', '_').toLowerCase();
      if (newTag.length > 0 && !(field.state.value || []).includes(newTag)) {
        handleOnChange([...(field.state.value || []), newTag]);
      }
      setInputState('');
    }
  }

  return (
    <Field className="flex flex-col gap-1">
      {topLabel && <FieldLabel>{label ?? m.form_tags_label()}</FieldLabel>}
      <div className={clsx('flex flex-col gap-1')}>
        <Combobox
          multiple
          value={field.state.value || []}
          onValueChange={handleOnChange}
        >
          <ComboboxChips className={clsx('w-full', className)}>
            <ComboboxValue>
              {field.state.value?.map((item) => (
                <ComboboxChip key={item}>{item}</ComboboxChip>
              ))}
            </ComboboxValue>
            <ComboboxChipsInput
              placeholder={label ?? m.form_tags_label()}
              onKeyDown={(e) => handleOnEnterCustom(e)}
              onChange={(e) => debounced(e.target.value)}
            />
          </ComboboxChips>
          <ComboboxContent aria-invalid={!field.state.meta.isValid} className="w-full">
            {(!isEnabled) && (
              <ComboboxEmpty>{m.form_tags_placeholder()}</ComboboxEmpty>
            )}
            {(isEnabled && !isLoading && memoData.length === 0) && (
              <ComboboxEmpty>{m.form_tags_not_found()}</ComboboxEmpty>
            )}
            {isLoading && (
              <ComboboxEmpty>{m.loading()}</ComboboxEmpty>
            )}
            <ComboboxList>
              {memoData.map((item) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              ))}
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
