'use client'
import { db } from '@/utils/dbConfig'
import { Budgets ,Expenses } from '@/utils/schema'
import React, { useEffect, useState } from 'react'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import BudgetItem from '../../budgets/_components/BudgetItem'
import { use } from 'react'
import AddExpenses from '../AddExpenses/page'
import ExpenseListTable from '../_components/ExpenseListTable'

import { TrashIcon } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Editbudget from '../_components/Editbudget'
import { Button } from '@/components/ui/Button'
  

function ExpensesScreen({params}) {
    const unwrappedParams = use(params)
    const {user} = useUser();
    const [budgetInfo,setBudgetInfo] = useState();
    const [expensesList ,setExpensesList] = useState([]);
    const route = useRouter()
    const [loading, setLoading] = useState(true); 


    useEffect(()=>{
        user&&getBudgetInfo();
    },[user]);

    const getBudgetInfo = async () => {
        setLoading(true);
        try {
            const result = await db.select({
                ...getTableColumns(Budgets),
                totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
                totalItem: sql`count(${Expenses.id})`.mapWith(Number),
            }).from(Budgets)
                .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
                .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
                .where(eq(Budgets.id,unwrappedParams?.id))
                .groupBy(Budgets.id)

                setBudgetInfo(result[0]);
                getExpensesList();

        } catch (error) {
            console.error('Error fetching budgets:', error);
        } finally{
            setLoading(false);
        }
    }

    const getExpensesList=async()=>{
            const result = await db.select().from(Expenses)
            .where(eq(Expenses.budgetId,unwrappedParams?.id))
            .orderBy(desc(Expenses.id));
            setExpensesList(result);
    }   

    const deleteBudget=(async()=>{
        const delExpenseResult = await db.delete(Expenses)
        .where(eq(Expenses.budgetId,unwrappedParams?.id))
        .returning();
            let result = null;
        if(delExpenseResult){
            result = await db.delete(Budgets)
            .where(eq(Budgets.id,unwrappedParams?.id))
            .returning();
        }

        if(result){
            toast('Budget Deleted Succesfully!');
            route.replace('/dashboard/budgets'); 
        }
    })

        return (
            <div className='p-5'>
                <h2 className='text-2xl font-bold flex justify-between items-center'>Budget Expenses
                    <span className='flex gap-2 items-center'>
                        <div className='flex gap-2 items-center'>
                            <Editbudget budgetInfo={budgetInfo} refreshData={()=>getBudgetInfo()} />
                            <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className='flex gap-2 ' variant='destructive'> 
                                <TrashIcon/>Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your current budget and expenses from the database.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={()=>deleteBudget()}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </span>
                </h2>

                
                <div className=' grid grid-cols-1  mt-4 gap-4  '>
                    {!loading ? ( <BudgetItem
                                        budgets={budgetInfo}
                                    />
                                ) : (
                                    <div className='w-full h-[145px] bg-slate-200 rounded-lg animate-pulse'
                                    ></div>
                                )
                    }
                    <AddExpenses  budgets={budgetInfo} budgetId={unwrappedParams?.id} user={user} refreshData={()=>getBudgetInfo()} />
                </div>
                <div className='mt-4'>
                    <ExpenseListTable expensesList={expensesList}
                    refreshData={()=>getBudgetInfo()} />
                </div>
            </div>
        )
    
}

export default ExpensesScreen