import React from "react";
import App from "./App";
import Eastern from "./Eastern";
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
      </TabView>
    </div>
  );
}
