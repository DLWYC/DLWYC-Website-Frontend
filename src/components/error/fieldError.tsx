interface FieldErrorProps {
     message?: string
}

export function FieldError({ message }: FieldErrorProps) {
  if (!message) return null
  return (
    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1.5">
      <span className="inline-block w-1 h-1 rounded-full bg-red-500 shrink-0" />
      {message}
    </p>
  )
}