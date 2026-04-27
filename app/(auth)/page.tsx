import Link from 'next/link'
import { withAuth } from '@workos-inc/authkit-nextjs'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const { user } = await withAuth()
  if (user) redirect('/dashboard')

  return (
    <main className="flex-grow flex items-center justify-center p-6 md:p-12 lg:p-24 relative overflow-hidden bg-[#F5F0EB]">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-stone-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-stone-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        {/* Left: Copy & CTA */}
        <div className="flex flex-col space-y-8 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
          <div className="space-y-4">
            <h1 className="font-headline text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-stone-900">
              Know exactly where your money goes.
            </h1>
            <p className="text-lg md:text-xl text-stone-600 leading-relaxed max-w-md mx-auto lg:mx-0">
              Track income, allocate your budget, and stay on top of every currency — all in one place.
            </p>
          </div>
          <div className="pt-4">
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center px-8 py-4 bg-stone-700 hover:bg-stone-800 text-stone-50 text-base font-medium rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Right: Budget mockup card */}
        <div className="w-full max-w-lg mx-auto lg:ml-auto relative">
          <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 relative z-10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-semibold text-stone-900 text-lg">Monthly Budget</h3>
                <p className="text-stone-500 text-sm">October 2024</p>
              </div>
              <span className="material-symbols-outlined text-stone-400">more_horiz</span>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                      <span className="material-symbols-outlined text-amber-500 text-[18px]">restaurant</span>
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 text-sm">Food</p>
                      <p className="text-stone-500 text-xs">$720 / $1,000</p>
                    </div>
                  </div>
                  <span className="font-semibold text-stone-900 text-sm">72%</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '72%' }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                      <span className="material-symbols-outlined text-rose-500 text-[18px]">directions_car</span>
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 text-sm">Transport</p>
                      <p className="text-stone-500 text-xs">$225 / $500</p>
                    </div>
                  </div>
                  <span className="font-semibold text-stone-900 text-sm">45%</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-stone-700 h-1.5 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                      <span className="material-symbols-outlined text-emerald-500 text-[18px]">savings</span>
                    </div>
                    <div>
                      <p className="font-medium text-stone-900 text-sm">Savings</p>
                      <p className="text-stone-500 text-xs">$500 / $500</p>
                    </div>
                  </div>
                  <span className="font-semibold text-emerald-500 text-sm">100%</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-100">
              <div className="flex justify-between items-center">
                <span className="text-stone-500 text-sm font-medium">Total Spent</span>
                <span className="text-stone-900 font-semibold text-xl">$1,445.00</span>
              </div>
            </div>
          </div>
          {/* Decorative background card */}
          <div className="absolute -top-4 -right-4 w-full h-full bg-white/40 rounded-2xl border border-white/50 -z-10 transform rotate-2" />
        </div>
      </div>

      <footer className="absolute bottom-0 left-0 right-0 py-6 text-center border-t border-stone-200">
        <p className="text-stone-500 font-medium tracking-wide text-xs uppercase">MyWallet</p>
      </footer>
    </main>
  )
}
