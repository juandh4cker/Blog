const Select = ({ options, set, value }) => {
  const handleChange = (e) => {
    set(e.target.value);
  };

  return (
    <div className="p-4">
      <select
        id="language"
        value={value}
        onChange={handleChange}
        className="rounded-md font-base cursor-pointer my-1 transition 
          duration-300 transform bg-white text-gray-800 border border-blue-700 py-2
          px-3 text-sm hover:border-blue-500 hover:scale-105 focus:outline-none focus:ring-2
          focus:ring-blue-500 focus:scale-105 appearance-none"
      >
        {Object.entries(options).map(([key, text]) => (
          <option key={key} value={key}>{text}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;