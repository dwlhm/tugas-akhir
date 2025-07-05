export const ISPUCard = ({
  className,
  label,
  range,
}: {
  className: string,
  label: string,
  range: string,
}) => {
  return (
    <div className="border-b-4 border-indigo-500 text-black mb-2" style={{ borderBottom: "1px solid rgb(136, 136, 136)" }}>
      <p className={`block rounded-lg ${className} py-1 text-xs text-center max-w-[60px] w-full`}>{range}</p>
      <p className="font-medium m-1">{label}</p>
    </div>
  )
}
