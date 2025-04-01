import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import MDInput from "components/MDInput";

// types
interface Props {
  input?: {
    [key: string]: any;
  };
  [key: string]: any;
}

function MDDatePicker({ input, ...rest }: Props): JSX.Element {
  return (
    <Flatpickr
      {...rest}
      render={({ defaultValue }: any, ref: any) => (
        <MDInput {...input} defaultValue={defaultValue} inputRef={ref} />
      )}
    />
  );
}

MDDatePicker.defaultProps = {
  input: {},
};

export default MDDatePicker;
