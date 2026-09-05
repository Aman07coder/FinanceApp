'use client'
import { PenBox } from 'lucide-react'
import React, { use, useEffect, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/Button';
import EmojiPicker from 'emoji-picker-react';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbConfig';
import { Budgets } from '@/utils/schema';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { eq } from 'drizzle-orm';

function Editbudget({budgetInfo,refreshData}) {
   
    const [emojiIcon, setEmojiIcon] = useState();
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [name, setName] = useState();
    const [amount, setAmount] = useState();
    const { user } = useUser();

    useEffect(() => {
        setEmojiIcon(budgetInfo?.icon || "😊");
        setName(budgetInfo?.name || "");
        setAmount(budgetInfo?.amount || "");
    }, [budgetInfo]);

    const onUpdateBudget = async()=>{
        const result = await db.update(Budgets)
        .set({
            name: name,
            amount: amount,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            icon: emojiIcon,
        }).where(eq(Budgets.id,budgetInfo?.id))
        .returning();
        if(result){
            refreshData();
            toast('Budget Updated Successfully!')
        }
    }

  return (
    <div>
          <Dialog>
                <DialogTrigger asChild>
                    <Button className='flex gap-2 items center'><PenBox/> Edit</Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Budget</DialogTitle>
                        <DialogDescription>
                            <div className='mt-5'>
                                <Button variant='outline' className='text-lg' onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                                    {emojiIcon}
                                </Button>
                                {openEmojiPicker && (
                                    <div className='absolute z-20'
                                    style={{
                                        transform: 'scale(0.8)', 
                                        transformOrigin: 'top left'
                                        
                                    }}>
                                        <EmojiPicker
                                            onEmojiClick={(e) => {
                                                setEmojiIcon(e.emoji);
                                                setOpenEmojiPicker(false);
                                            }}
                                        />
                                    </div>
                                )}
                                <div className='mt-2'>
                                    <label className='text-black font-medium my-1'>Budget Name</label>
                                    <Input
                                        placeholder='e.g Laptop'
                                        defaultValue={budgetInfo?.name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className='mt-2'>
                                    <label className='text-black font-medium my-1'>Budget Amount</label>
                                    <Input
                                        placeholder='e.g 50000'
                                        type='number'
                                        defaultValue={budgetInfo?.amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                                <Button
                                    disabled={!(name||amount)}
                                    onClick={onUpdateBudget}
                                    className='mt-5 w-full'>
                                    Update Budget
                                </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
    </div>
  )
}

export default Editbudget