import React, { useState, useEffect } from "react";
import { ComposableMap, Geography, Geographies } from "react-simple-maps";
import { scaleQuantile } from "d3-scale";
import axios from "axios";
import Container1 from "./Container1.js";
import Container3 from "./Container3.js";
import { geoPolyhedralWaterman } from "d3-geo-projection";
import { Dialog } from "primereact/dialog";
import "./App.css";
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

const INDIA_TOPO_JSON = require("./eastcopy.json");
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

function Eastern2() {
  // const [tooltipContent, setTooltipContent] = useState("");
  const [data, setData] = useState([]);
  const [keyList, setKeyList] = useState([]);
  const [UpdateValue, setUpdateValue] = useState([]);
  const [colourValue, setColourValue] = useState(1);
  const [Energy, setEnergy] = useState("Coal Energy");
  const [IsUpdate, setIsUpdate] = useState(0);
  const [IsSave, setIsSave] = useState(0);
  const [page, setpage] = useState(2);
  const [showdailog, setshowdailog] = useState(false);
  const [clickdata, setclickdata] = useState([]);
  // const page = 2;
  var colorScale = scaleQuantile()
    .domain(data.map((d) => d[Energy]))
    .range(COLOR_RANGE);

  function callApi() {
    axios
      .get("http://localhost:3001/eastern")
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

  // Function to update Excel data
  const updateDatabase = async (UpdateValue) => {
    try {
      await axios.post("http://localhost:3001/eastern/update_value", {
        data: UpdateValue,
      });
    } catch (error) {}
  };

  const addnewvalue = async (updatedData) => {
    try {
      await axios.post("http://localhost:3001/eastern/add_new_value", {
        data: updatedData,
      });
      // Optionally, fetch updated data again after update
      // fetchExcelData();
    } catch (error) {
      console.error("Error updating Excel data:", error);
    }
  };

  const delete_attribute = async (attribute) => {
    try {
      // console.log(UpdateValue)
      await axios.post("http://localhost:3001/eastern/delete_a_value", {
        data: attribute,
      });
    } catch (error) {
      // console.error('Error updating Excel data:', error);
    }
  };

  useEffect(() => {
    // console.log("ue2");
  }, [UpdateValue]);

  useEffect(() => {
    // console.log("ue1");

    callApi();
    // fetchData();
  }, []);

  var temp_list = [...keyList];
  temp_list.splice(0, 3);

  const onMouseclick = (e) => {
    var x = e[0];
    console.log(e[0], e[1], e[2]);
    // var Ac_name = "Ac_name";
    // x["District"] = e[1];
    // x["Ac_name"] = e[2];
    setclickdata([x]);
    setshowdailog(true);
  };

  const onMouseLeave = () => {
    setshowdailog(false);
  };

  return (
    <>
      <div className="full-width-height ">
        <h1 className="no-margin center">Eastern Regional {Energy} map</h1>
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
              width={2342}
              height={1507}
              projection="geoMercator"
              // projection="geoAzimuthalEqualArea"
              projectionConfig={{
                rotate: [-87.0, -22.0, 10],
                center: [0, 0],
                scale: 7000,
              }}
            >
              <Geographies geography={INDIA_TOPO_JSON}>
                {({ geographies }) =>
                
                  geographies.map((geo) => {
                    const current = [
                      data.find((s) => {
                        return s["id"] === geo.properties.id;
                      }),
                      geo.properties.DIST_NAME,
                      geo.properties.Ac_name,
                    ];
                    console.log(current);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={
                          current[0]
                            ? colorScale(current[0]?.[Energy])
                            : DEFAULT_COLOR
                        }
                        onClick={() => onMouseclick(current)}
                        style={geographyStyle}
                      />
                    );
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
            {/* <p>District : {clickdata[0].District}</p> */}
            {/* <p>Ac_name : {clickdata[0].Ac_name}</p> */}
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

export default Eastern2;
