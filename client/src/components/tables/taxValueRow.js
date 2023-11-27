import React, { useEffect, useState } from "react";
import { DispatchFeedbackContexts } from "../../App";
import apiService from "../../services/apiService";

function TaxValueRow({ row, i, refreshData }) {
  const feedback = DispatchFeedbackContexts();
  const [form, setForm] = useState({
    taxCodeId: row.taxCodeId,
    customerGroupId: row.customerGroupId,
    percentage: row.percentage,
  });

  const updateTaxValue = async () => {
    try {
      await apiService.updateTaxValue(form);
      feedback({
        type: "Success",
        message: "Success! Tax code percentage saved",
      });

      refreshData();
    } catch (err) {
      feedback({
        type: "Error",
        message: `Ops! Something went wrong while updating the data. (${
          err.response.data.message
            ? err.response.data.message
            : "Error from server"
        })`,
      });
      console.log(err);
    }
  };
  function handleChange(event) {
    const { value, name } = event.target;
    console.log(event.target.type);
    setForm((prevNote) => ({
      ...prevNote,

      [name]: value,
    }));
  }

  useEffect(() => {}, []);
  return (
    <tr>
      <th scope="row">{i}</th>
      <td>{row.name}</td>
      <td>{row.customerGroup.code}</td>
      <td>{row.taxCode.code}</td>
      <td className={!row.percentage && "bg-danger"}>
        {!row.percentage && <span>Missing percentage!</span>}
        <input
          onChange={handleChange}
          type="number"
          required
          name="percentage"
          class="form-control"
          id="inputPercentage"
          value={form.percentage}
          placeholder="23"
        ></input>
      </td>
      <td>
        <button
          type="button"
          class="btn btn-success"
          onClick={() => updateTaxValue()}
        >
          Update
        </button>
      </td>
    </tr>
  );
}

export default TaxValueRow;
