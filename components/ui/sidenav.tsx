'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { href: '/income', label: 'Income', icon: 'payments' },
  { href: '/expenses', label: 'Expenses', icon: 'receipt_long' },
  { href: '/allocations', label: 'Allocations', icon: 'pie_chart' },
  { href: '/exchange-rates', label: 'Exchange Rates', icon: 'currency_exchange' },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 border-r border-stone-200 bg-white flex flex-col justify-between z-50">
      <div className="flex flex-col p-4 gap-2">
        <div className="mb-8 px-4 py-2">
          <span className="text-2xl font-bold text-stone-800 tracking-tighter font-headline">MyWallet</span>
          <p className="text-xs text-stone-500 mt-1">Personal Finance</p>
        </div>
        <div className="flex flex-col gap-1 text-sm font-medium">
          {navItems.map(({ href, label, icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-stone-50 text-stone-900 font-semibold border-r-4 border-[#8B7355]'
                    : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {icon}
                </span>
                {label}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="p-4 border-t border-stone-200">
        <div className="flex flex-col gap-1 text-sm font-medium">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Link>
          <a
            href="/api/auth/sign-out"
            className="flex items-center gap-3 px-4 py-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </a>
        </div>
      </div>
    </nav>
  )
}
