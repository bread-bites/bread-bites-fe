'use client';

import { QUERY_KEY } from "@/constants/query-key";
import { useFieldContext } from "@/hooks/form-context"
import { getTag } from "@/api/tag";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useRef, useState } from "react";
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue } from "../ui/combobox";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import clsx from "clsx";
import { m } from "@paraglide/messages";
import { BaseUIEvent } from "@base-ui/react";
import { useDebouncedCallback } from "use-debounce";
import { Toggle } from "../ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { getLocalStorage, setLocalStorage } from "@/utilities/frontend-api";
import { LOCAL_STORAGE_KEY } from "@/constants/local-storage";
import { isMobile } from "react-device-detect";

interface FormNewTagInputProps {
  label?: string,
  className?: string,
  topLabel?: boolean,
}

export default function FormNewTagInput({ label, topLabel = false, className = '' }: FormNewTagInputProps) {
  const field = useFieldContext<string[] | null>();
  const ref = useRef<HTMLInputElement>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [inputState, setInputState] = useState<string>('');
  const [searchEnabled, setSearchEnabled] = useState<boolean>(getLocalStorage(LOCAL_STORAGE_KEY.SEARCH_TAG_ENABLED) === "1");

  const debounced = useDebouncedCallback((v: string) => handleOnInputChange(v), 300);

  const getTagEndpoint = useServerFn(getTag);
  const { data, isLoading, isEnabled } = useQuery({
    queryKey: [QUERY_KEY.TAG, inputState],
    queryFn: async () => await getTagEndpoint({ data: { name: inputState } }),
    enabled: inputState.length >= 1 && searchEnabled,
  });
  const memoData = useMemo(() => data?.map(x => x.name) ?? [], [data]);

  const handleOnChange = (newValue: string[]) => {
    field.handleChange(newValue
      .map(v => v.trim().replaceAll(' ', '_').toLowerCase())
      .filter((v, i, a) => (a.indexOf(v) === i && v.trim().length > 0))
    );
    setTempValue('');
    setInputState('');
  }

  const handleOnInputChange = (value: string) => {
    setInputState(value.trim().replaceAll(' ', '_').toLowerCase());
  }

  // Unreliable due to Android IME
  const handleOnKeyDown = (e: BaseUIEvent<React.KeyboardEvent<HTMLInputElement>>) => {
    if (!isMobile && (e.nativeEvent.key === 'Enter' || e.nativeEvent.key === ' ') && tempValue.trim().length > 0) {
      e.preventDefault();
      const newTag = tempValue.trim().replaceAll(' ', '_').toLowerCase();
      if (newTag.length > 0 && !(field.state.value || []).includes(newTag)) {
        handleOnChange([...(field.state.value || []), newTag]);
      }
      setInputState('');
      setTempValue('');
      debounced('');
    }
  }

  const handleOnTyping = (e: BaseUIEvent<React.ChangeEvent<HTMLInputElement, HTMLInputElement>>) => {
    const value = e.target.value;
    if (isMobile && (value.endsWith(' ') || value.endsWith('\n'))) {
      const newTag = tempValue.trim().replaceAll(' ', '_').toLowerCase();
      if (newTag.length > 0 && !(field.state.value || []).includes(newTag)) {
        handleOnChange([...(field.state.value || []), newTag]);
      }
      setInputState('');
      setTempValue('');
      debounced('');
    }
    else {
      setInputState(value);
      setTempValue(value);
      debounced(value);
    }
  }

  return (
    <Field className="flex flex-col gap-1 relative">
      {topLabel && <FieldLabel>{label ?? m.form_tags_label()}</FieldLabel>}
      <div className="flex flex-col gap-1">
        <Combobox
          multiple
          value={field.state.value || []}
          onValueChange={handleOnChange}
        >
          <ComboboxChips className={clsx('w-full relative', className)}>
            <ComboboxValue>
              {field.state.value?.map((item) => (
                <ComboboxChip key={item}>{item}</ComboboxChip>
              ))}
            </ComboboxValue>
            <ComboboxChipsInput
              ref={ref}
              value={tempValue}
              placeholder={label ?? m.form_tags_label()}
              onChange={handleOnTyping}
              onKeyDown={handleOnKeyDown}
            />
            <div className="absolute right-2">
              <Tooltip>
                <TooltipTrigger>
                  <Toggle
                    size="xs"
                    className='cursor-pointer'
                    pressed={searchEnabled}
                    onPressedChange={(v, e) => {
                      e.event?.preventDefault();
                      e.event?.stopPropagation();
                      setLocalStorage(LOCAL_STORAGE_KEY.SEARCH_TAG_ENABLED, v ? "1" : "0");
                      setSearchEnabled(v);
                    }}
                    aria-label="Toggle search"
                  >
                    {searchEnabled ? '🔎' : '❌'}
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  {m.form_tags_search_tooltip()}
                </TooltipContent>
              </Tooltip>
            </div>
          </ComboboxChips>
          <ComboboxContent
            aria-invalid={!field.state.meta.isValid}
            alignOffset={-10}
            sideOffset={10}
            className='min-w-[calc(var(--anchor-width)+--spacing(5))]'
          >
            {(!searchEnabled) && (
              <ComboboxEmpty>{m.form_tags_search_disabled()}</ComboboxEmpty>
            )}
            {(searchEnabled && !isEnabled) && (
              <ComboboxEmpty>{m.form_tags_placeholder()}</ComboboxEmpty>
            )}
            {(searchEnabled && isEnabled && !isLoading && memoData.length === 0) && (
              <ComboboxEmpty>{m.form_tags_not_found()}</ComboboxEmpty>
            )}
            {(searchEnabled && isLoading) && (
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
