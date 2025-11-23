import { useEffect, useState } from "react";
import RegistrationUnit from "../../../pages/Registration/RegistrationUnit";
import MainDashboard from "../../../pages/Dashboard/Index";

const InnerContent = (e) => {
  return (
    <div className={`lg:basis-[80%] basis-[100%] flex flex-col bg-[whitesmoke]`}>
      {/* "Attendenac" */}
      {e.hashValue == "#index" ? (
        <MainDashboard />
      ) : e.hashValue == "#attendance" ? (
        <RegistrationUnit />
      )
      :
      ('sdfsd')}
    </div>
  );
};

export default InnerContent;
