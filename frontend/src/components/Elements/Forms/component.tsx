export const Input = (props: {
  name: string;
  label: string;
  placeholder: string;
  defaultValue: string;
  type: string;
}) => {
  return (
    <div className="mb-3">
      <label
        htmlFor={`${props.name}-input`}
        className="text-sm font-medium capitalize"
      >
        {props.label}
      </label>
      <input
        id={`${props.name}-input`}
        name={props.name}
        placeholder={props.placeholder}
        type={props.type}
        className="bg-gray-100 border border-gray-400 text-sm rounded-md p-2 w-full"
        defaultValue={props.defaultValue}
        required
      />
    </div>
  );
};
