"use client";

import { useState } from "react";
import Header from "../Components/Header";
import Panel from "../Components/Panel";
import LabelsPanel from "../Components/LabelsPanel";
import DateSelector from "../Components/DateSelector";

const Manager = () => {
  const [selectedDashboard, setSelectedDashboard] = useState('Manager');
  const [selectedDate, setSelectedDate] = useState(()=>{
    const today = new Date();
    return today.toISOString().split('T')[0];
  })
  const [selectedDays, setSelectedDays] = useState<string[]>([])

  const handleDashboardChange = (dashboard: string)=> {
    setSelectedDashboard(dashboard)
  }

  const handleDateChange = (date: string)=>{
    setSelectedDate(date);
  }

  const handleDayToggle = (day: string ) =>{
    setSelectedDays((prev)=>
    prev.includes(day) ? prev.filter((d)=> d !== day) : [...prev, day])
  }

  const dropDwonOptions = [
    "Customer Service",
    "WareHouse",
    "Printer",
    "Manager"
  ]

  return (
    <div className="w-full h-screen text-white overflow-hidden">
      <Header
        userName="NAME"
        location="ABB-#"
        showDropdown={true}
        dropdownOptions={dropDwonOptions}
        onDropdownChange={handleDashboardChange}
        selectedOption={selectedDashboard}
      />

      <div className="pt-16 h-full flex flex-col md:flex-row relative overflow-hidden">
        <div className="w-full md:w-[420px] lg:w-[480px] xl:w-[520px] md:absolute md:top-0 md:left-0 md:pt-16 h-full overflow-hidden">
          <div className="h-full max-h-full overflow-hidden">
            <Panel title="Labels Printed" width="full" borderSide="right">
              <p>Labes content will go here</p>
            </Panel>
          </div>
        </div>

        <div className="flex-1 md:mx-[420px] lg:mx-[480px] xl:mx-[520px] flex flex-col h-full overflow-hidden">
          <div className="px-4 py-6 flex justify-center flex-shrink-0">
            <DateSelector
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              selectedDays={selectedDays}
              onDayToggle={handleDayToggle}
            />
          </div>

          <div className="flex-1 overflow-hidden">
            <Panel width="full">
              <p>Manager middle content will go here</p>
            </Panel>
          </div>
        </div>

        <div className="w-full md:w-[420px] lg:w-[480px] xl:w-[520px] md:absolute md:top-0 md:bottom-0 md:right-0 md:pt-16 h-full overflow-hidden">
          <div className="h-full max-h-full overflow-hidden">
            <Panel title="Performance Metrics" width="full" borderSide="left">
              <p>Performance metrics will go here</p>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Manager;