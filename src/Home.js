import React from "react";
import App from "./App";
import Eastern from "./Eastern";
import Eastern2 from "./Eastern2";
// import Easterndemo from "./easterndemo";
import { TabView, TabPanel } from "primereact/tabview";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./App.css";
export default function Home() {
  return (
    <div className="card">
      <TabView>
        <TabPanel header="All India">
          <App />
        </TabPanel>
        <TabPanel header="Eastern Region">
          <Eastern />
        </TabPanel>
        <TabPanel header="Eastern Region 2">
          <Eastern2 />
        </TabPanel>
      </TabView>
    </div>
  );
}
