import $ from "cash-dom";
import { getRegistered } from "../src/index";

export function createKeybindingEditor(entries) {
  let entries = getRegistered();
  const rows = _.map(entries, (val) =>
    $(`<tr>
        <td>${val.action}</td>
        <td>${val.combo}</td>
        <td>${val.description}</td>
        <td><input></input></td>
        <td><button>save</button></td>
    </tr>`)
  );

  const table = $(`
<table class="table">
  <thead>
    <tr>
      <th scope="col">action</th>
      <th scope="col">combo</th>
      <th scope="col">description</th>
      <th scope="col">input new combo</th>
      <th scope="col">save new combo</th>
    </tr>
  </thead>
  <tbody>
  
  </tbody>
</table>
`);

  table.find("tbody").append(...rows);
  return table;
}
