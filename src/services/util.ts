import { SelectField } from 'src/common/interface/util';

export function prepareToSelect(
  collection: any[],
  label: string,
  value: string
): SelectField[] {
  const res: SelectField[] = [];
  collection.forEach((elem) => {
    res.push({ value: elem[value], label: elem[label] });
  });
  return res;
}
