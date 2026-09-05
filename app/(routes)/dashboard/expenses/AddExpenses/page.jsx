"use client"
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { db } from '@/utils/dbConfig';
import { Expenses } from '@/utils/schema';
import moment from 'moment/moment';

function AddExpenses({budgets,budgetId,refreshData}) {

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

 

    const addNewExpense=async()=>{
        const result = await db.insert(Expenses).values({
            name:name,
            amount:amount,
            budgetId:budgetId,
            createdAt: moment().format('DD/MM/YYYY'),
        }).returning({insertedId:Expenses.id});

        setAmount('');
        setName('');

       

        if(result){
            if(budgets?.totalSpend + amount > budgets?.amount){
                toast('New Expense Added! You Clearly Overspent!!')
            }else{
                toast('New Expense Added!')
            }
            refreshData();
        }
    }
    

    return (
        <div className='border-2 border-primary p-5 rounded-lg'>
            <h2 className='font-bold text-lg'>Add Expense</h2>

            <div className='mt-2'>
                <label className='text-black font-medium my-1'>Expense Name</label>
                <Input
                    placeholder='e.g Cleaner'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
        
            <div className='mt-2'>
                <label className='text-black font-medium my-1'>Expense Amount</label>
                <Input
                    placeholder='e.g 50'
                    type='number'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <Button
                disabled={!(name && amount)}
                onClick={addNewExpense}
                className='mt-3 w-full'>
                Add New Expense
            </Button>

        </div>
    )
}

export default AddExpenses