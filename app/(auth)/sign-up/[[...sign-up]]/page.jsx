import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        
        {/* Left Side Image & Text */}
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Finance"
            src="https://wallpaperboat.com/wp-content/uploads/2021/04/15/75170/finance-04-920x518.jpg"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />

          <div className="hidden lg:relative lg:block lg:p-12 z-10">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Welcome to Expense Tracker
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/90">
              Organize your expenses, visualize your budget, and grow your savings with ease.
            </p>
          </div>
        </section>

        {/* Right Side SignUp Form */}
        <main className="flex items-center justify-center px-6 py-12 sm:px-12 lg:col-span-7 xl:col-span-6">
          <div className="w-full max-w-lg space-y-6">
            
            {/* Mobile View Heading */}
            <div className="lg:hidden text-center">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Welcome to Expense Tracker
              </h1>
              <p className="mt-3 text-gray-600">
                Organize your expenses, visualize your budget, and grow your savings with ease.
              </p>
            </div>

            {/* Clerk SignUp Component */}
            <div className="flex justify-center">
              <div style={{ transform: 'scale(1.1)', transformOrigin: 'center' }}>
                <SignUp />
              </div>
            </div>

          </div>
        </main>
      </div>
    </section>
  );
}
