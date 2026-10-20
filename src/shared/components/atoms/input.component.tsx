interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input = ({ label, ...props }: InputProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label htmlFor={props.id}>{label}</label>}
      <input {...props} className="w-full p-2 rounded-xs border border-gray-300 font-light" />
    </div>
  )
}
