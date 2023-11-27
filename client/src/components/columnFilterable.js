import React, { useEffect, useState } from "react";

function ColumnWithFilter({
  name,
  technicalName,
  options,
  addFilterValue,
  type,
}) {
  const handleDropdownChange = (event) => {
    setSelectedValue(event.target.value);
    console.log(event.target.value);
    addFilterValue(technicalName, event.target.value);
  };
  const [selectedValue, setSelectedValue] = useState(null);
  const selectField = () => {
    return (
      <select
        className="form-select"
        value={selectedValue}
        onChange={handleDropdownChange}
      >
        <option value="" disabled>
          {" "}
        </option>
        <option selected value="false">
          Unpaid
        </option>

        <option selected value="true">
          Paid
        </option>
      </select>
    );
  };

  const textField = () => {
    return <input onChange={handleDropdownChange} placeholder="..."></input>;
  };

  const inputFiled = () => {
    switch (type) {
      case "select":
        return selectField();
      case "text":
        return textField();
    }
  };
  const [selectedOption, setSelectedOption] = useState("");
  return (
    <th scope="col">
      <div>{inputFiled()}</div>
    </th>
  );
}

export default ColumnWithFilter;
