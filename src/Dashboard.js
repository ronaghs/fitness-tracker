import React from "react";
import MyCalendar from "./Dashboard/Calendar";
import Navbar from "./Landing Page/ResponsiveAppBar";

function Dashboard() {
  return (
    <div>
      <Navbar />
      <MyCalendar />
    </div>
  );
}

export default Dashboard;
