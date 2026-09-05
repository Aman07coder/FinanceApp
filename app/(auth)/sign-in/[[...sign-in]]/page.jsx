import { SignIn } from '@clerk/nextjs';

export default function Page() {
    return (
        <section className="bg-white">
            <div className="lg:grid lg:min-h-screen lg:grid-cols-12">

                {/* Left side image and heading */}
                <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
                    <img
                        alt="Finance"
                        src="\finance-for-non-finance-course.jpeg"
                        className="absolute inset-0 h-full w-full object-cover opacity-50"
                    />
                    <div className="hidden lg:relative ml-3 lg:block lg:p-12 z-10">
                        <h2 className="text-3xl font-bold text-white sm:text-4xl">
                            Welcome to Expense Tracker
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed text-white">
                            Organize your expenses, visualize your budget, and grow your savings with ease.
                        </p>
                    </div>
                </section>

                {/* Right side Sign In */}
                <main className="flex items-center justify-center px-6 py-12 sm:px-12 lg:col-span-7 xl:col-span-6">
                    <div className="w-full max-w-lg space-y-6">

                        {/* Mobile welcome heading */}
                        <div className="lg:hidden text-center">
                            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                Welcome to Expense Tracker
                            </h1>
                            <p className="mt-3 text-gray-600">
                                Organize your expenses, visualize your budget, and grow your savings with ease.
                            </p>
                        </div>

                        {/* Clerk Sign In */}
                        <div className="flex justify-center">
                            <div style={{ transform: 'scale(1.1)', transformOrigin: 'center' }}>
                                <SignIn />
                            </div>
                        </div>

                    </div>
                </main>

            </div>
        </section>
    );
}
