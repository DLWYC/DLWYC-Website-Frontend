import Select from "react-select";

const customStyles = {
  control: (provided) => ({
    ...provided,
    padding: '3.5px',
    border: '0.1px solid #12489927',
    borderRadius: '8px',
    boxShadow: 'none',
    minHeight: '42px',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '8px',
    border: 'none',
    color: 'red',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
    zIndex: 9999,
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#b3d9ff' : state.isFocused ? '#f0f0f0' : '#fff',
    color: '#333',
    padding: '10px',
    '&:active': {
      backgroundColor: '#b3d9ff',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#333',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#AAA',
  }),
  input: (provided) => ({
    ...provided,
    color: '#333',
  }),
};


const Input = (e) => {
  return (
    <div className={`text-[15px] space-y-1 ${e.basis ? "basis-[50%]" : "basis-[100%]"} `}>
      <label className="text-faint-blue font-normal tracking-[0.6px]">
        {e.label}
        <span className="text-[red]">*</span>
      </label>
      {e.readOnly ? (
        <input
          type={e.type}
          className={`w-full outline-none ring-[0.3px]  rounded-md p-3 text-text-primary placeholder:text-[#AAA] tracking-[0.8px] text-[14px] ${e.error[e.name] ? 'ring-[1px] ring-[red]' : 'ring-text-primary'}`}
          name={e.name}
          value={e.value}
          placeholder={e.placeholder}
          required
          readOnly
          onChange={e.removeError}
          onInput={e.onInput}
        />
      )
      :
      e.type ? (
        <input
          type={e.type}
          className={`w-full outline-none ring-[0.3px]  rounded-md p-3 text-text-primary placeholder:text-[#AAA] tracking-[0.8px] text-[14px] ${e.error[e.name] ? 'ring-[1px] ring-[red]' : 'ring-text-primary'}`}
          name={e.name}
          value={e.value}
          placeholder={e.placeholder}
          required
          onChange={e.removeError}
          onInput={e.onInput}
        />
      ) : 
       e.name === 'parish' && e.denomination === "Non-Anglican" ? 
      
        (
          <Select
          value={null}
          isDisabled
        />
        )
       : e.name === "parish" && e.denomination === "Anglican" ? (
        <Select
          options={e.options}
          onChange={e.onChange}
          isSearchable
          value={e.value}
          styles={customStyles} 
          placeholder="Select a parish"
          className="react-select-container"
          classNamePrefix="react-select"
        />
      )
       : e.name === "noOfUnpaidCampers" ? (
        <Select
          options={e.options}
          onChange={e.onChange}
          isSearchable
          isMulti
          closeMenuOnSelect={false}
          value={e.value}
          styles={customStyles} 
          placeholder="Select Your Members"
          className="react-select-container"
          classNamePrefix="react-select"
        />
      ) : e.denomination === "Non-Anglican" ? (
        <select
          className={`w-full outline-none ring-[0.3px] rounded-md p-3 text-[14px] tracking-[0.8px] text-text-primary bg-transparent `}
          name={e.name}
          onInput={e.onInput}
          disabled
        >
          {e.options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.option}
            </option>
          ))}
        </select>
      )
      : (
        <select
          className={`w-full outline-none ring-[0.3px] rounded-md p-3 text-[14px] tracking-[0.8px] text-text-primary ${e.error[e.name] ? 'ring-[1px] ring-[red]' : 'ring-text-primary'} `}
          name={e.name}
          required
          onInput={e.onInput}
          value={e.value}
          onChange={e.removeError}
        >
          {e.options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.option}
            </option>
          ))}
        </select>
      )
      }
      {e.error[e.name] ? (<p className="text-red-500 text-[14px]">{Object.values(e.error[e.name])}</p>) : (<></>) }

    </div>
  );
};  

export default Input;
