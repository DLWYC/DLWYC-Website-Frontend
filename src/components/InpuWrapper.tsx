export function InputWrapper({ icon: Icon, error, children }: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; error?: boolean; children: React.ReactNode }) {
  return (
    <div className={`relative flex items-center border rounded-lg transition-all
      ${error
        ? 'border-red-400 bg-red-50 focus-within:ring-2 focus-within:ring-red-100'
        : 'border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400'
      }`}
    >
      <Icon className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none shrink-0" />
      {children}
    </div>
  )
}