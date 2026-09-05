'use client'
import { useUser } from '@clerk/nextjs';
import React from 'react'

function Hero() {
    const { user } = useUser();
    return (
        <section className="bg-[url('/moneybg.jpg')] bg-cover bg-center h-[calc(100vh-82px)] w-full" >
            <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex">
                <div className="mx-auto max-w-xl text-center pt-16">
                    <h1 className="text-4xl font-extrabold sm:text-5xl">
                        Master Your Money
                        <strong className="font-extrabold text-primary sm:block"> Budget Better </strong>
                    </h1>

                    <p className="mt-4 sm:text-xl/relaxed">
                        Spend smarter, save better, and simplify your financial journey.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <a
                            className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none  sm:w-auto"
                            href={user ? "/dashboard" : "/sign-in"}
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero