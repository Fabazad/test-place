import React from "react";
import { formatDate } from "../../../helpers/textHelpers";

export const MyAffiliatedRow = ({ affiliated }) => {
  return (
    <tr key={affiliated._id}>
      <td>{affiliated.name}</td>
      <td>{affiliated.email}</td>
      <td>{affiliated.rateInPercent}%</td>
      <td>{formatDate(affiliated.createdAt)}</td>
    </tr>
  );
};
