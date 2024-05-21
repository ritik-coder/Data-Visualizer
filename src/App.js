import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantile } from "d3-scale";
import { Tooltip as ReactTooltip } from "react-tooltip";
import axios from "axios";
import Container1 from "./Container1.js";
import Container3 from "./Container3.js";
import { Dialog } from "primereact/dialog";

import { Tooltip } from "primereact/tooltip";

import "./App.css";

const INDIA_TOPO_JSON = require("./india.json");

const PROJECTION_CONFIG = {
  scale: 350,
  center: [78.9629, 22.5937], // always in [East Latitude, North Longitude]
};
// Red Variants
const COLOR_RANGE = [
  "#ffedea",
  "#ffcec5",
  "#ffad9f",
  "#ff8a75",
  "#ff5533",
  "#e2492d",
  "#be3d26",
  "#9a311f",
  "#782618",
];

// const DEFAULT_COLOR = '#EEE';
const DEFAULT_COLOR = "#ffedea";

const geographyStyle = {
  default: {
    outline: "none",
  },
  hover: {
    fill: "#ccc",
    transition: "all 250ms",
    outline: "none",
  },
  pressed: {
    outline: "none",
  },
};

function App() {
  const [tooltipContent, setTooltipContent] = useState("");
  const [data, setData] = useState([]);
  const [keyList, setKeyList] = useState([]);
  const [UpdateValue, setUpdateValue] = useState([]);
  const [colourValue, setColourValue] = useState(1);
  const [Energy, setEnergy] = useState("Coal Energy");
  const [IsUpdate, setIsUpdate] = useState(0);
  const [IsSave, setIsSave] = useState(0);
  const [page, setpage] = useState(1);
  const [showdailog, setshowdailog] = useState(false);
  const [clickdata, setclickdata] = useState([]);
  // const page = 1;

  var colorScale = scaleQuantile()
    .domain(data.map((d) => d[Energy]))
    .range(COLOR_RANGE);

  function callApi() {
    axios
      .get("http://localhost:3001")
      .then(function (response) {
        setData(response.data);

        const attributeList = Object.keys(response.data[0]);
        setKeyList(attributeList);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {});
  }
  data.map((item) => {
    console.log(item.id);
  });

  // Function to update Excel data
  const updateDatabase = async (UpdateValue) => {
    try {
      // console.log(UpdateValue)
      await axios.post("http://localhost:3001/update_value", {
        data: UpdateValue,
      });
      // Optionally, fetch updated data again after update
      // fetchExcelData();
    } catch (error) {
      // console.error('Error updating Excel data:', error);
    }
  };

  const addnewvalue = async (updatedData) => {
    try {
      await axios.post("http://localhost:3001/add_new_value", {
        data: updatedData,
      });
      // Optionally, fetch updated data again after update
      // fetchExcelData();
    } catch (error) {
      console.error("Error updating Excel data:", error);
    }
  };

  // Function to update Excel data
  const delete_attribute = async (attribute) => {
    try {
      // console.log(UpdateValue)
      await axios.post("http://localhost:3001/delete_a_value", {
        data: attribute,
      });
      // Optionally, fetch updated data again after update
      // fetchExcelData();
    } catch (error) {
      // console.error('Error updating Excel data:', error);
    }
  };

  useEffect(() => {}, [UpdateValue]);

  useEffect(() => {
    // console.log("ue1");
    callApi();
    // fetchData();
  }, []);

  var temp_list = [...keyList];
  temp_list.splice(0, 3);

  //to show the popup
  const onMouseclick = (e) => {
    // console.log(e);
    setclickdata([e]);
    setshowdailog(true);
  };

  const onMouseLeave = () => {
    setshowdailog(false);
    // setTooltipContent("");
  };

  return (
    <>
      <div className="full-width-height ">
        <h1 className="no-margin center">States and {Energy} Graph</h1>
        <div className="devider">
          <Container1
            data={data}
            IsSave={IsSave}
            keyList={keyList}
            UpdateValue={UpdateValue}
            setUpdateValue={setUpdateValue}
            IsUpdate={IsUpdate}
            setData={setData}
            Energy={Energy}
          />

          <div className="container_1">
            <ComposableMap
              projectionConfig={PROJECTION_CONFIG}
              projection="geoMercator"
              // projection="geoEqualEarth"
              width={280}
              height={200}
              data-tip=""
            >
              <Geographies geography={INDIA_TOPO_JSON}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    // console.log(geo);
                    const current = data.find((s) => {
                      return s["id"] === geo.id;
                    });

                    // colorScale(99)
                    // console.log(current);
                    return (
                      <>
                        <Geography
                          color="black"
                          key={geo.rsmKey}
                          geography={geo}
                          fill={
                            current
                              ? colorScale(current?.[Energy])
                              : DEFAULT_COLOR
                          }
                          style={geographyStyle}
                          // onMouseEnter={onMouseEnter(current)}
                          onClick={() => onMouseclick(current)}
                          // onMouseOver={onMouseEnter(current)}
                          // onMouseLeave={() => setshowdailog(false)}
                        />
                      </>
                    );
                    <ReactTooltip offset={{ top: 335, left: 45 }}>
                      hfg
                    </ReactTooltip>;
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>
          <Container3
            data={data}
            keyList={keyList}
            setKeyList={setKeyList}
            colourrange={COLOR_RANGE}
            colourValue={colourValue}
            UpdateValue={UpdateValue}
            setIsUpdate={setIsUpdate}
            setIsSave={setIsSave}
            setColourValue={setColourValue}
            Energy={Energy}
            setEnergy={setEnergy}
            updateDatabase={updateDatabase}
            addnewvalue={addnewvalue}
            delete_attribute={delete_attribute}
            page={page}
          />
        </div>
      </div>
      <Dialog
        header="Values"
        visible={showdailog}
        style={{ width: "13vw", height: "18vw" }}
        onHide={() => setshowdailog(false)}
      >
        {clickdata[0] ? (
          <div>
            <p>State : {clickdata[0].name}</p>
            {temp_list.map((item) => (
              <p>
                {item} : {clickdata[0][item] ? clickdata[0][item] : "NA"}
              </p>
            ))}
          </div>
        ) : (
          ""
        )}
      </Dialog>
    </>
  );
}

export default App;
