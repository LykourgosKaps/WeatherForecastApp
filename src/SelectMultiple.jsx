export function SelectMultiple({
  filterType,
  filterOptions,
  filters,
  setFilters,
}) {
  const handleCheck = (option) => {
    if (filters.includes(option)) {
      setFilters(filters.filter((item) => item !== option));
    } else {
      setFilters([...filters, option]);
    }
  };

  return (
    <div
      style={{
        width: "250px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "12px",
        background: "white",
      }}
    >
      <h3 style={{ marginTop: 0 }}>{filterType}</h3>

      {filterOptions.map((option) => (
        <label key={option} style={{ display: "block", marginBottom: "8px" }}>
          <input
            type="checkbox"
            checked={filters.includes(option)}
            onChange={() => handleCheck(option)}
          />{" "}
          {option}
        </label>
      ))}
    </div>
  );
}