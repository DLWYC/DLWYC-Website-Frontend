function Button(e) {
  return (
    <div className="flex w-[full]">
      <a
        href={e.link}
        className={` bg-reddish p-button rounded-md hover:bg-text-header text-white transition ease-in-out delay-20 cursor-pointer`}
      >
        {e.text}
      </a>
    </div>
  );
}

export default Button;
