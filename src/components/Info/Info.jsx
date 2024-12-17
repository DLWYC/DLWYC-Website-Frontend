export const Info = (e) => (
  <div className="flex items-center gap-4">
    <span className={`${e.checkStatus ? 'text-white' : 'text-white' } font-medium text-[14px]`}>{e.label}:</span>
    <p className={`truncate text-sm  ${e.checkStatus ? 'text-white' : 'text-white' }`}>{e.detail}</p>
  </div>
);
