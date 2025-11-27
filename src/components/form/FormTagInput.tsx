import { QUERY_KEY } from "@/constants/query-key";
import { useFieldContext } from "@/hooks/form-context"
import { getTag } from "@/api/tag";
import { Autocomplete, FormControl, FormHelperText } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import TextFieldDebounce from "../common/TextFieldDebounce";
import clsx from "clsx";

interface FormTagInputProps {
  label?: string,
  size?: 'small' | 'medium',
  className?: string
}

export default function FormTagInput({ label, size = 'small', className }: FormTagInputProps) {
  const field = useFieldContext<string[] | null>();
  const [inputState, setInputState] = useState<string>('');

  const getTagEndpoint = useServerFn(getTag);
  const { data, isLoading } = useQuery({
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
    // if (value.endsWith(' ')) {
    //   const newTag = value.trim().replaceAll(' ', '_').toLowerCase();
    //   if (newTag.length > 0 && !(field.state.value || []).includes(newTag)) {
    //     handleOnChange([...(field.state.value || []), newTag]);
    //   }
    //   setInputState('');
    // }
    // else setInputState(value);
    setInputState(value.trim().replaceAll(' ', '_').toLowerCase());
  }

  return (
    <FormControl size={size} fullWidth className={className}>
      <Autocomplete
        size={size}
        multiple
        freeSolo
        slotProps={{
          chip: {
            sx: {
              borderRadius: '4px'
            }
          }
        }}
        loading={isLoading}
        noOptionsText="Cannot find anything"
        filterOptions={x => x.filter(v => !(field.state.value ?? []).includes(v))}
        value={field.state.value || []}
        onChange={(_, newValue) => handleOnChange(newValue)}
        options={memoData}
        className={clsx(className)}
        renderInput={(params) => <TextFieldDebounce {...params} size={size} onChange={e => handleOnInputChange(e as string)} label={label || "Tags"} />}
      />
      {!field.state.meta.isValid && (
        <FormHelperText>
          {field.state.meta.errors.map(x => x.message).join(', ')}
        </FormHelperText>
      )}
    </FormControl>
  )
}
