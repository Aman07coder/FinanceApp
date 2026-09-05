import { db } from '@/utils/dbConfig'
import { Expenses } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

function ExpenseListTable({expensesList,refreshData}) {

    const deleteExpense=(async(expenses)=>{
        const result = await db.delete(Expenses)
        .where(eq(Expenses.id,expenses.id))
        .returning();

        if(result){
            toast('Expense Deleted Succesfully!')
            refreshData();
        }
    })

  return (
    <div className='mt-3  shadow-md max-h-[400px]  '> 
        <h2 className='font-bold text-lg '>Latest Expenses</h2>
        <div className='rounded-md border-2 border-primary shadow-md max-h-[262px] overflow-y-auto scroll-smooth scrollbar-hidden '>
            <div className='grid grid-cols-4 bg-[#c3c2fe] p-2 '>
                <h2 className='font-bold'>Name</h2>
                <h2 className='font-bold'>Amount</h2>
                <h2 className='font-bold'>Date</h2>
                <h2 className='font-bold'>Action</h2>
            </div>

            {expensesList.map((expenses,index)=>(
                <div key={expenses.id} className='grid grid-cols-4  bg-violet-100 p-2'>
                    <h2>{expenses.name}</h2>
                    <h2>${expenses.amount}</h2>
                    <h2>{expenses.createdAt}</h2>

                    <h2 >
                        <Trash onClick={async()=>await deleteExpense(expenses)}className='text-red-600 cursor-pointer' />
                    </h2>

                </div>
            ))}

        </div>
        
    </div>
  )
}

export default ExpenseListTable