'use client'
import React, { useState } from 'react';
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
import { Input } from "@/components/ui/input";
import EmojiPicker from 'emoji-picker-react';
import { toast} from "sonner";
import { Button } from '@/components/ui/Button';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/dbConfig';
import { Budgets } from '@/utils/schema';

function CreateBudget({refreshData}) {
    const [emojiIcon, setEmojiIcon] = useState('😊');
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [name, setName] = useState();
    const [amount, setAmount] = useState();

    const { user } = useUser();

    const onCreateBudget = async () => {
        const result = await db.insert(Budgets)
            .values({
                name: name,
                amount: amount,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                icon: emojiIcon,
            })
            .returning({ insertedId:Budgets.id });

        if(result){
            refreshData()
            toast('New Budget Created!');
        }
    };

    return (
        <div>
            <Dialog>

                <DialogTrigger className='w-full h-full'>
                    <div className="bg-slate-100 p-10 rounded-md 
                        items-center flex justify-center flex-col border-2 border-dashed border-primary cursor-pointer
                        hover:shadow-lg h-full ">
                        <h2 className="text-3xl">+</h2>
                        <h2>Create New Budget</h2>
                    </div>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Budget</DialogTitle>
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
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className='mt-2'>
                                    <label className='text-black font-medium my-1'>Budget Amount</label>
                                    <Input
                                        placeholder='e.g 50000'
                                        type='number'
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                                <Button
                                    disabled={!(name && amount)}
                                    onClick={onCreateBudget}
                                    className='mt-5 w-full'>
                                    Create Budget
                                </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CreateBudget;
