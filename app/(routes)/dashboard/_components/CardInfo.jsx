'use client'
import { PiggyBank, Receipt, Wallet } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function CardInfo({budgetList}) {

    const [totalBudget , setToatalBudget] = useState(0);
    const [totalSpent , setToatalSpent] = useState(0);

    useEffect(()=>{ 
        budgetList&&CalCardInfo();
    },[budgetList]);

    const CalCardInfo=()=>{
       
        let totalBudget = 0;
        let totalSpent = 0

        budgetList.forEach(element =>{
            totalBudget+= Number(element.amount);
            totalSpent+= element.totalSpend ; 
        })

        setToatalBudget(totalBudget);
        setToatalSpent(totalSpent);
    }

    return (
        <div>
            {budgetList?.length>0 ?
                (<div className='mt-7 grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-2 '>
                    <div className='p-7 border-2 border-primary shadow-md  rounded-lg flex items-center justify-between  bg-violet-100'>
                        <div>
                            <h2 className='text-sm'>Total Budget</h2>
                            <h2 className='font-bold text-2xl'>${totalBudget}</h2>
                        </div>
                        <PiggyBank className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
                    </div>
                    <div className='p-7 border-2 border-primary shadow-md   rounded-lg flex items-center justify-between  bg-violet-100'>
                        <div>
                            <h2 className='text-sm'>Total Spent</h2>
                            <h2 className='font-bold text-2xl'>${totalSpent}</h2>
                        </div>
                        <Receipt className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
                    </div>
                    <div className='p-7 border-2 border-primary shadow-md   rounded-lg flex items-center justify-between  bg-violet-100'>
                        <div>
                            <h2 className='text-sm'>No. of Budgets</h2>
                            <h2 className='font-bold text-2xl'>{budgetList?.length}</h2>
                        </div>
                        <Wallet className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
                    </div>
                </div>) : (
                    <div className='mt-7 grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-2 '>
                    <div className='p-7 border-2 border-primary shadow-md  rounded-lg flex items-center justify-between  bg-violet-100'>
                        <div>
                            <h2 className='text-sm'>Total Budget</h2>
                            <h2 className='font-bold text-2xl'>$ 0</h2>
                        </div>
                        <PiggyBank className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
                    </div>
                    <div className='p-7 border-2 border-primary shadow-md   rounded-lg flex items-center justify-between  bg-violet-100'>
                        <div>
                            <h2 className='text-sm'>Total Spent</h2>
                            <h2 className='font-bold text-2xl'>$ 0</h2>
                        </div>
                        <Receipt className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
                    </div>
                    <div className='p-7 border-2 border-primary shadow-md   rounded-lg flex items-center justify-between  bg-violet-100'>
                        <div>
                            <h2 className='text-sm'>No. of Budgets</h2>
                            <h2 className='font-bold text-2xl'>0</h2>
                        </div>
                        <Wallet className='bg-primary p-3 h-12 w-12 rounded-full text-white' />
                    </div>
                </div>
                )
            }
        </div>
    )
}

export default CardInfo