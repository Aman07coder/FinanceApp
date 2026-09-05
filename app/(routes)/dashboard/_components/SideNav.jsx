"use client"
import React from 'react'
import Image from 'next/image'
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from 'lucide-react'

import { usePathname } from 'next/navigation'
import Link from 'next/link'


function SideNav() {
    const menuList=[
        {
            id:1,
            name:'Dashboard',
            icon:LayoutGrid,
            path:'/dashboard'
        },
        {
            id:2,
            name:'Budgets',
            icon:PiggyBank,
            path:'/dashboard/budgets'

        },
        {
            id:3,
            name:'All Expenses',
            icon:ReceiptText,
            path:'/dashboard/expense'
        },
    ]

    const path = usePathname();

    return (
        <div className='h-screen p-5 border-r-2 border-slate-300 shadow-sm'>
            
            <Link href='/'>
                <Image src={'/logo.svg'}
                    alt='logo'
                    width={160}
                    height={100}
                />
            </Link>
           

            <div className='mt-5'>
                {menuList.map((menu)=>(
                    <Link key={menu.id} href={menu.path}>
                        <h2 
                            className={`flex gap-2 items-center
                            text-gray-900 font-medium mb-2 p-3 cursor-pointer 
                            rounded-md hover:text-primary hover:bg-blue-200 ${path==menu.path &&'text-primary bg-blue-200'}
                            `}>
                                <menu.icon />
                                {menu.name}
                        </h2>
                    </Link>
                ))}
            </div>

          

        </div>
    )
}

export default SideNav