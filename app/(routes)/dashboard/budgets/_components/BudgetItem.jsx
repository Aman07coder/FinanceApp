import Link from 'next/link'
import React from 'react'

function BudgetItem({budgets}) {

    const calculatorProgress = (()=>{
        let percent =(budgets?.totalSpend/budgets?.amount)*100;
        if(percent>100){
            percent=100;
        }
        return percent.toFixed(2);
    })

  return (
        <Link href={'/dashboard/expenses/'+ budgets?.id}>
            <div className='p-5 border-2 border-primary rounded-lg hover:shadow-lg cursor-pointer shadow-md  bg-violet-100'>
                <div className='flex items-center justify-between'>
                    <div className='flex gap-2 items-center'>
                        <h2 className='text-2xl p-3 px-4 bg-[#c3c2ff] rounded-full'>{budgets?.icon}</h2>
                        <div>
                            <h2 className='font-bold'>{budgets?.name}</h2>
                            <h2 className='text-sm text-gray-500'>{budgets?.totalItem} Item</h2>
                        </div>
                    </div>
                    <h2 className='font-bold text-primary '>${budgets?.amount}</h2>
                </div>

                <div className='mt-5'>
                    <div className='flex items-center justify-between mb-3'>
                        <h2 className='text-xs text-slate-600'>${budgets?.totalSpend?budgets?.totalSpend:0} Spent</h2>
                        <h2 className='text-xs text-slate-600'>${budgets?.amount - budgets?.totalSpend} Remaining</h2>
                    </div>
                    <div className='w-full bg-[#c3c2ff] h-2 rounded-full'>
                        <div style={{width:`${calculatorProgress()}%`}} className='bg-primary h-2 rounded-full'></div>
                    </div>
                </div>
        </div>
    </Link>
  )
}

export default BudgetItem