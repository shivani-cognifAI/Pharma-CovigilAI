"use client";

import Dashboard from '@/common/Dasbord-report';
import LoadingSpinner from '@/common/LoadingSpinner';
import { useState } from 'react';
import BarGraph from './BarGraph';
import ReportingDashboard from './ScatterBarGraph';
import ChartComponent from './TotalCountLineScatterGraph';
import MonitorStatusDashboard from './BarGraph';
import IndividualDashboard from './IndividualDashboard';
 



function Analytics() {
   const [isLoading, setIsLoading] = useState(false)
return (
  
<>
<h3 className="absolute top-3 ml-2">Analytics</h3>
<Dashboard/>
<div className="main bg-white mt-4 w-[100%] custom-box-shadow">
  <div className=" p-4">
<ChartComponent/>
</div>
 <div className=" p-4">

<MonitorStatusDashboard/></div>
 
   
    <div className=" p-4">
<ReportingDashboard/>
  </div>
<div className="p-4">

<IndividualDashboard/></div>
</div>
{isLoading && <LoadingSpinner />}
</>


  )
}

export default Analytics
