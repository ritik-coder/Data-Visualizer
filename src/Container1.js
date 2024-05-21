import { useState } from "react";
import React from "react";
import "./App.css";
import "primeicons/primeicons.css";

var updatedb_list = [];
function Container1(props) {
  const [new_attribute, setNew_attribute] = useState("");
  // console.log("c1")
  var temp_list = [...props.keyList];
  temp_list.splice(0, 3);

  const handleEdit = (_id, id, field, value) => {
    console.log(value);
    var temp_list = [];
    var updated_dict = {};
    props.data.map((item) => {
      if (item.id === id) {
        item[field] = value;
        temp_list.push(item);
        updated_dict["_id"] = _id;
        updated_dict["ques"] = field;
        updated_dict["ans"] = value;
        // console.log(value);
        updatedb_list.push(updated_dict);
        // props.setUpdateValue(updatedb_list);
      } else {
        temp_list.push(item);
      }
    });
    props.setUpdateValue(updatedb_list);
    // console.log(props.UpdateValue);
    props.setData(temp_list);
  };

  var value = props.Energy;
  let greeting;
  if (props.IsUpdate == 0) {
    greeting = (
      <table class="table">
        <tr>
          <th>State</th>
          <th>{value}</th>
        </tr>
        {props.data.map((val, key) => {
          // var value="value_"+ props.colourValue;
          return (
            <tr key={key}>
              <td>{val.name}</td>
              <td>{val[value]}</td>
            </tr>
          );
        })}
      </table>
    );
  } else if (props.IsUpdate == 1) {
    greeting = (
      <table class="table">
        <thead>
          <tr>
            <th>State</th>
            <th>{value}</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((row) => {
            return (
              <tr key={row.id}>
                <td>
                  <input type="text" value={row.name} />
                </td>
                <td>
                  <input
                    type="number"
                    defaultValue={row[value]}
                    onBlur={(e) =>
                      handleEdit(
                        row._id,
                        row.id,
                        value,
                        e.target.value ? e.target.value : 0
                      )
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  } else if (props.IsUpdate == 2) {
    greeting = (
      <table class="table">
        <thead>
          <tr>
            <th>State</th>
            <th>
              <input
                type="text"
                defaultValue={"Enter a value"}
                onBlur={(e) => setNew_attribute(e.target.value)}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((row) => {
            return (
              <tr key={row.id}>
                <td>
                  <input type="text" value={row.name} />
                </td>
                <td>
                  <input
                    type="number"
                    defaultValue={0}
                    onBlur={(e) =>
                      handleEdit(
                        row._id,
                        row.id,
                        new_attribute,
                        e.target.value ? e.target.value : 0
                      )
                    }
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  return <div className="container_0">{greeting}</div>;
}

export default Container1;
