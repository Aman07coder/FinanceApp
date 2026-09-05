import React, { useEffect, useState } from 'react';
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function BarChartDash({ budgetList }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div>
        <h2 className="font-bold text-lg ml-2">Activity</h2>
        <div className=" rounded-lg shadow-md  p-5 border-2  border-primary bg-violet-100">
            <ResponsiveContainer width={'80%'} height={300} >
                <BarChart
                    data={budgetList}
                    margin={{ top: 10 }}
                >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalSpend" stackId="a" fill="#4845D2" />
                    <Bar dataKey="amount" stackId="a" fill="#C3C2FF" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
   
  );
}

export default BarChartDash;
