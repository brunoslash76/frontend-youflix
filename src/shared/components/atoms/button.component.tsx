interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button {...props} className="bg-blue-500 disabled:bg-blue-300 text-white px-4 py-2 rounded-md cursor-pointer">
      {children}
    </button>
  )

}