import { QUERY_KEY } from "@/constants/query-key";
import { useFieldContext } from "@/hooks/form-context"
import { getTag } from "@/api/tag";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue } from "../ui/combobox";

interface FormNewTagInputProps {
  label?: string
}

export default function FormNewTagInput({ label }: FormNewTagInputProps) {
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
    <Combobox
      multiple
      value={field.state.value || []}
      onValueChange={handleOnChange}
    >
      <ComboboxChips>
        <ComboboxValue>
          {field.state.value?.map((item) => (
            <ComboboxChip key={item}>{item}</ComboboxChip>
          ))}
        </ComboboxValue>
        <ComboboxChipsInput placeholder={label} onChange={(e) => handleOnInputChange(e.target.value)} />
      </ComboboxChips>
      <ComboboxContent>
        <ComboboxEmpty>{isLoading ? "Loading..." : "No items found"}</ComboboxEmpty>
        <ComboboxList>
          {memoData.map((item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
