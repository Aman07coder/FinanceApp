'use client'
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import CardInfo from './_components/CardInfo'
import { db } from '@/utils/dbConfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Budgets, Expenses } from '@/utils/schema';
import BarChartDash from './_components/BarChartDash';
import BudgetItem from './budgets/_components/BudgetItem';
import ExpenseListTable from './expenses/_components/ExpenseListTable';


function Dashboard() {
    const {user} = useUser();
    const [budgetList, setBudgetList] = useState([]);
    const [expensesList , setExpensesList ] = useState([]);

    const [loading, setLoading] = useState(true); 
    
    useEffect(() => {
        if (user) {
            getBudgetList();
            getAllExpenses();
        }
    }, [user]);


    const getAllExpenses=async()=>{
                const result = await db.select({
                    id:Expenses.id,
                    name:Expenses.name,
                    amount:Expenses.amount,
                    createdAt:Expenses.createdAt,
                }).from(Budgets)
                .rightJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
                .where(eq(Budgets.createdBy,user?.primaryEmailAddress.emailAddress))
                .orderBy(desc(Expenses.id));
                setExpensesList(result);
    }   
    

    const getBudgetList = async () => {
           setLoading(true); 
           try {
               const result = await db.select({
                   ...getTableColumns(Budgets),
                   totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
                   totalItem: sql`count(${Expenses.id})`.mapWith(Number),
               }).from(Budgets)
                   .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
                   .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
                   .groupBy(Budgets.id)
                   .orderBy(desc(Budgets.id));

               setBudgetList(result);
              
           } catch (error) {
               console.error('Error fetching budgets:', error);
           } finally {
               setLoading(false); // Stop loading
           }
    };

    return (
        <div className='p-8'>
            <h2 className='font-bold text-3xl' >Hi, {user?.fullName}</h2>
            <p className='text-gray-800'>📊 Visualize Your Finances, Track Every Dollar with Insight! </p>
            <CardInfo budgetList={budgetList} />

            <div className='grid grid-cols-1 md:grid-cols-3 mt-2 gap-2'>
                <div className='md:col-span-2 '>
                    <BarChartDash budgetList={budgetList} />
                    <ExpenseListTable expensesList={expensesList} refreshData={()=>getBudgetList()} />
                </div>
                <div >
                    <h2 className='font-bold text-lg '>Latest Budgets</h2>
                    <div className=' grid gap-2 max-h-[650px] overflow-y-auto scroll-smooth scrollbar-hidden' >
                        {budgetList.map((budget,index)=>(
                            <BudgetItem budgets={budget} key={index} />
                        ))}
                    </div>
                </div>
              
            </div>
        </div>
    )
}

export default Dashboard