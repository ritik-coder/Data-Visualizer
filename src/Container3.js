import React, { useState, useEffect, useRef } from "react";
import LinearGradient from "./LinearGradient.js";
import { Button } from "primereact/button";
import { saveAs } from "file-saver";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { FileUpload } from "primereact/fileupload";
import "./App.css";
const Container3 = (props) => {
  // console.log({props.data});
  // var i=1;
  // console.log(props.page);
  var temp_list = [...props.keyList];
  temp_list.splice(0, 3);

  const [selectedOption, setSelectedOption] = useState(1);

  const UpdateValue = (value) => {
    if (value === 0) {
      props.setIsUpdate(0);
    } else {
      props.setIsUpdate(1);
    }
  };
  const SaveValue = (value) => {
    if (value === 0) {
      props.setIsSave(0);
    } else {
      //
      // console.log(props.UpdateValue);
      props.updateDatabase(props.UpdateValue);
      props.setIsUpdate(0);
    }
  };

  const AddnewValue = (value) => {
    if (value === 0) {
    } else {
      props.addnewvalue(props.data);
      props.setIsUpdate(2);
    }
  };

  const gradientData = {
    fromColor: props.colourrange[0],
    toColor: props.colourrange[props.colourrange.length - 1],
    min: 0,
    max: props.data.reduce(
      (max, item) => (item[props.Energy] > max ? item[props.Energy] : max),
      0
    ),
  };

  // Function to handle the selection change
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    props.setColourValue(selectedValue);
    props.setEnergy(selectedValue);
  };
  const Downloadxlsx = (value) => {
    if (value == 1) {
      saveAs("files/india-upload.xlsx", "Download-Update-Format-india.xlsx");
    }
    if (value == 2) {
      saveAs(
        "files/eastern-upload.xlsx",
        "Download-Update-Format-eastern.xlsx"
      );
    }
  };

  const toast = useRef(null);

  // const onError = (p) => {
  //   console.log(p);
  //   toast.current.show({
  //     severity: "error",
  //     summary: "Error",
  //     detail: p.xhr.response,
  //   });
  // };
  // const onUpload = () => {
  //   toast.current.show({
  //     severity: "info",
  //     summary: "Success",
  //     detail: "File Uploaded",
  //   });
  // };
  const onUpload = (p) => {
    console.log(p);
    if (p.xhr.status == 500) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "All values should be numeric",
      });
    } else if (p.xhr.status == 200) {
      toast.current.show({
        severity: "info",
        summary: "Success",
        detail: "File Uploaded",
      });
    }
  };

  return (
    <div class="flexbox-container ">
      <select value={selectedOption} onChange={handleSelectChange}>
        <option value="Coal Energy">Select Energy</option>
        {temp_list.map((item) => (
          <option value={item}>{item}</option>
        ))}
      </select>

      <Button
        style={{ fontSize: "small", margin: "3px" }}
        size="small"
        rounded
        raised
        // severity="success"
        label="Update Value"
        onClick={() => UpdateValue(1)}
      />
      <Button
        style={{ fontSize: "small", margin: "3px" }}
        size="small"
        rounded
        raised
        // severity="success"
        label="Discard Changes"
        onClick={() => window.location.reload()}
      />

      <Button
        style={{ fontSize: "small", margin: "3px" }}
        size="small"
        rounded
        raised
        severity="danger"
        label="Save Value"
        onClick={() => SaveValue(1)}
      />

      <Button
        style={{ fontSize: "small", margin: "3px" }}
        size="small"
        rounded
        raised
        severity="success"
        label="Add New Value"
        onClick={() => AddnewValue(1)}
      />
      <Button
        style={{ fontSize: "small", margin: "3px" }}
        size="small"
        rounded
        raised
        severity="success"
        label="Download Update Format"
        onClick={() => Downloadxlsx(props.page)}
      />

      <div className="card flex justify-content-center ">
        <Toast ref={toast}></Toast>
        <FileUpload
          style={{ margin: "0px", width: "100%", borderRadius: "10px" }}
          mode="basic"
          name="file"
          url={
            props.page == 1
              ? "http://localhost:3001/upload-data"
              : "http://localhost:3002/eastern/upload-data"
          }
          accept="xlsx/*"
          maxFileSize={1000000}
          onUpload={onUpload}
          onError={onUpload}
          auto
          chooseLabel="Upload Data......."
        />
      </div>

      <LinearGradient data={gradientData} />
    </div>
  );
};

export default Container3;
