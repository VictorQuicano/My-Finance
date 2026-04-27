export default function DashboardPage() {
  return (
    <>
      {/* Sticky top bar */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm flex justify-between items-center px-8 h-16">
        <div className="text-lg font-bold text-stone-800 font-headline hidden md:block">Dashboard</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-stone-100 rounded-full px-4 py-1.5 text-stone-800 font-semibold">
            <button className="hover:bg-stone-200 rounded-full p-1 transition-transform active:scale-95">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="mx-4 text-sm">October 2024</span>
            <button className="hover:bg-stone-200 rounded-full p-1 transition-transform active:scale-95">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard content */}
      <div className="p-8 max-w-6xl mx-auto w-full flex flex-col gap-8">
        {/* Summary cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 flex flex-col gap-2">
            <div className="flex justify-between items-center text-stone-500 mb-2">
              <span className="text-sm font-medium">Total Income</span>
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-3xl font-bold text-stone-800 font-headline">—</span>
            <p className="text-xs text-stone-400 mt-2">No income logged yet</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 flex flex-col gap-2">
            <div className="flex justify-between items-center text-stone-500 mb-2">
              <span className="text-sm font-medium">Total Spent</span>
              <span className="material-symbols-outlined">receipt_long</span>
            </div>
            <span className="text-3xl font-bold text-stone-800 font-headline">—</span>
            <p className="text-xs text-stone-400 mt-2">No expenses logged yet</p>
          </div>

          <div className="bg-emerald-50 rounded-xl p-6 shadow-sm border border-emerald-100 flex flex-col gap-2">
            <div className="flex justify-between items-center text-emerald-700 mb-2">
              <span className="text-sm font-medium">Remaining</span>
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <span className="text-3xl font-bold text-emerald-700 font-headline">—</span>
            <p className="text-xs text-emerald-600 mt-2">Coming in Phase 3</p>
          </div>
        </section>

        {/* Budget by category */}
        <section className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
          <h2 className="text-xl font-bold text-stone-800 font-headline mb-6">Budget by Category</h2>
          <p className="text-stone-500 text-sm">
            Budget tracking coming in Phase 3. Set up your categories in onboarding to get started.
          </p>
        </section>
      </div>
    </>
  )
}
