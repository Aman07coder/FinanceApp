import { UserButton } from '@clerk/nextjs'
import React from 'react'

function DashboardHeader() {
  return (
    <div className='p-5 shadow-sm border-b-2 border-slate-300  flex justify-end '>
        <div>
            <UserButton />
        </div>
    </div>
  )
}

export default DashboardHeader