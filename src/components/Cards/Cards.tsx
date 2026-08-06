export const UiCard = ({Icon, color, value, text}) => {
  return (
    <div className={`rounded-[10px] bg-[${color}] lg:h-[30vh] h-[30vh] flex flex-col px-5 py-3 justify-end text-[black] gap-4 pb-3`}>
      {<Icon />}

      <h2 className="text-[40px] font-header font-bold">
        {value}
      </h2>
      <p className="font-grotesk text-[17px] leading-[21px] tracking-[0.3px] font-[500]">
        {text}
      </p>
    </div>
  );
}
