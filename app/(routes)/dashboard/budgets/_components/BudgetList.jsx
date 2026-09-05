'use client'
import React, { useEffect, useState } from 'react'
import CreateBudget from './CreateBudget'
import { db } from '@/utils/dbConfig'
import { Budgets, Expenses } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import BudgetItem from './BudgetItem'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'

function BudgetList() {
    const { user } = useUser();

    const [budgetList, setBudgetList] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        if (user) {
            getBudgetList();
        }
    }, [user]);

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
            setLoading(false); 
        }
    };

    return (
        <div className='mt-7'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                <CreateBudget refreshData={() => getBudgetList()} />
                {loading ? (
                    [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                        <div
                            key={index}
                            className='w-full h-[145px] bg-slate-200 rounded-lg animate-pulse'
                        ></div>
                    ))
                ) : budgetList.length > 0 && (
                    budgetList.map((budgets, index) => (
                        <BudgetItem key={index} budgets={budgets} />
                    ))
                )}
            </div>
        </div>
    );
}

export default BudgetList;
