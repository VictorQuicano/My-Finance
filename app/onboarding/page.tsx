'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CURRENCY_META: Record<string, { symbol: string; name: string }> = {
  AED: { symbol: 'د.إ', name: 'UAE Dirham' },
  ARS: { symbol: '$', name: 'Argentine Peso' },
  AUD: { symbol: '$', name: 'Australian Dollar' },
  BDT: { symbol: '৳', name: 'Bangladeshi Taka' },
  BGN: { symbol: 'лв', name: 'Bulgarian Lev' },
  BHD: { symbol: 'BD', name: 'Bahraini Dinar' },
  BOB: { symbol: 'Bs', name: 'Bolivian Boliviano' },
  BRL: { symbol: 'R$', name: 'Brazilian Real' },
  CAD: { symbol: '$', name: 'Canadian Dollar' },
  CHF: { symbol: 'Fr', name: 'Swiss Franc' },
  CLP: { symbol: '$', name: 'Chilean Peso' },
  CNY: { symbol: '¥', name: 'Chinese Yuan' },
  COP: { symbol: '$', name: 'Colombian Peso' },
  CRC: { symbol: '₡', name: 'Costa Rican Colón' },
  CZK: { symbol: 'Kč', name: 'Czech Koruna' },
  DKK: { symbol: 'kr', name: 'Danish Krone' },
  DOP: { symbol: 'RD$', name: 'Dominican Peso' },
  DZD: { symbol: 'DA', name: 'Algerian Dinar' },
  EGP: { symbol: '£', name: 'Egyptian Pound' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  GEL: { symbol: '₾', name: 'Georgian Lari' },
  GHS: { symbol: '₵', name: 'Ghanaian Cedi' },
  GTQ: { symbol: 'Q', name: 'Guatemalan Quetzal' },
  HKD: { symbol: '$', name: 'Hong Kong Dollar' },
  HNL: { symbol: 'L', name: 'Honduran Lempira' },
  HUF: { symbol: 'Ft', name: 'Hungarian Forint' },
  IDR: { symbol: 'Rp', name: 'Indonesian Rupiah' },
  ILS: { symbol: '₪', name: 'Israeli Shekel' },
  INR: { symbol: '₹', name: 'Indian Rupee' },
  IQD: { symbol: 'IQD', name: 'Iraqi Dinar' },
  ISK: { symbol: 'kr', name: 'Icelandic Króna' },
  JMD: { symbol: 'J$', name: 'Jamaican Dollar' },
  JOD: { symbol: 'JD', name: 'Jordanian Dinar' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
  KES: { symbol: 'Ksh', name: 'Kenyan Shilling' },
  KRW: { symbol: '₩', name: 'South Korean Won' },
  KWD: { symbol: 'KD', name: 'Kuwaiti Dinar' },
  KZT: { symbol: '₸', name: 'Kazakhstani Tenge' },
  MAD: { symbol: 'MAD', name: 'Moroccan Dirham' },
  MXN: { symbol: '$', name: 'Mexican Peso' },
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit' },
  NGN: { symbol: '₦', name: 'Nigerian Naira' },
  NIO: { symbol: 'C$', name: 'Nicaraguan Córdoba' },
  NOK: { symbol: 'kr', name: 'Norwegian Krone' },
  NPR: { symbol: '₨', name: 'Nepalese Rupee' },
  NZD: { symbol: '$', name: 'New Zealand Dollar' },
  OMR: { symbol: 'OMR', name: 'Omani Rial' },
  PEN: { symbol: 'S/', name: 'Peruvian Sol' },
  PHP: { symbol: '₱', name: 'Philippine Peso' },
  PKR: { symbol: '₨', name: 'Pakistani Rupee' },
  PLN: { symbol: 'zł', name: 'Polish Złoty' },
  PYG: { symbol: '₲', name: 'Paraguayan Guaraní' },
  QAR: { symbol: 'QR', name: 'Qatari Riyal' },
  RON: { symbol: 'lei', name: 'Romanian Leu' },
  RSD: { symbol: 'din', name: 'Serbian Dinar' },
  RUB: { symbol: '₽', name: 'Russian Ruble' },
  SAR: { symbol: 'SR', name: 'Saudi Riyal' },
  SEK: { symbol: 'kr', name: 'Swedish Krona' },
  SGD: { symbol: '$', name: 'Singapore Dollar' },
  THB: { symbol: '฿', name: 'Thai Baht' },
  TND: { symbol: 'DT', name: 'Tunisian Dinar' },
  TRY: { symbol: '₺', name: 'Turkish Lira' },
  TTD: { symbol: 'TT$', name: 'Trinidad Dollar' },
  TWD: { symbol: 'NT$', name: 'New Taiwan Dollar' },
  TZS: { symbol: 'TSh', name: 'Tanzanian Shilling' },
  UAH: { symbol: '₴', name: 'Ukrainian Hryvnia' },
  USD: { symbol: '$', name: 'US Dollar' },
  UYU: { symbol: '$', name: 'Uruguayan Peso' },
  UZS: { symbol: "so'm", name: 'Uzbekistani Som' },
  VND: { symbol: '₫', name: 'Vietnamese Dong' },
  XAF: { symbol: 'CFA', name: 'Central African Franc' },
  XOF: { symbol: 'CFA', name: 'West African Franc' },
  ZAR: { symbol: 'R', name: 'South African Rand' },
  ZMW: { symbol: 'ZK', name: 'Zambian Kwacha' },
}

const CURRENCIES = Object.keys(CURRENCY_META).sort()

const SEGMENT_COLORS = ['#8B7355', '#A38F75', '#C8B89A', '#78716c', '#57534e', '#a8a29e']

type Category = {
  name: string
  percentage: number
  isSavings: boolean
  isMixed: boolean
}

function getCurrencySymbol(code: string) {
  return CURRENCY_META[code]?.symbol ?? code.slice(0, 2)
}

function getCurrencyName(code: string) {
  return CURRENCY_META[code]?.name ?? code
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [currency, setCurrency] = useState('USD')
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState<Category[]>([
    { name: '', percentage: 0, isSavings: false, isMixed: false },
  ])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const filtered = CURRENCIES.filter((c) =>
    c.includes(search.toUpperCase()) || getCurrencyName(c).toLowerCase().includes(search.toLowerCase())
  )
  const total = categories.reduce((s, c) => s + (Number(c.percentage) || 0), 0)
  const remainder = 100 - total

  function addCategory() {
    setCategories([...categories, { name: '', percentage: 0, isSavings: false, isMixed: false }])
  }

  function removeCategory(i: number) {
    setCategories(categories.filter((_, idx) => idx !== i))
  }

  function updateCategory(i: number, field: keyof Category, value: string | number | boolean) {
    setCategories(categories.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)))
  }

  async function handleSave() {
    setError('')
    const payload = [...categories]

    if (remainder > 0) {
      const savingsExists = categories.some((c) => c.isSavings)
      if (!savingsExists) {
        payload.push({ name: 'Mixed', percentage: remainder, isSavings: false, isMixed: true })
      }
    }

    setSaving(true)
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homeCurrency: currency, categories: payload }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error?.message ?? 'Something went wrong')
        return
      }
      router.push('/dashboard')
    } catch {
      setError('Network error, please try again')
    } finally {
      setSaving(false)
    }
  }

  if (step === 1) {
    return (
      <main className="min-h-screen bg-[#F5F0EB] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col" style={{ minHeight: '600px' }}>
          {/* Header */}
          <header className="flex-none mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-stone-400 tracking-wider uppercase">Step 1 of 2</span>
              <span className="material-symbols-outlined text-stone-300">account_balance_wallet</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 font-headline mb-2">Choose your home currency</h1>
            <p className="text-sm text-stone-500 leading-relaxed">
              Select the primary currency for your budget and tracking.
            </p>
          </header>

          {/* Search */}
          <div className="flex-none relative mb-4">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-[20px]">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-transparent focus:border-stone-300 focus:bg-white rounded-lg text-sm text-stone-800 placeholder-stone-400 transition-colors outline-none"
              placeholder="Search currencies..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Currency list */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2 min-h-0" style={{ maxHeight: '320px' }}>
            {filtered.map((code) => {
              const isSelected = currency === code
              return (
                <button
                  key={code}
                  onClick={() => setCurrency(code)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left group ${
                    isSelected
                      ? 'bg-stone-100 border-stone-200'
                      : 'border-transparent hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium shadow-sm text-sm ${
                      isSelected ? 'bg-white text-stone-700' : 'bg-stone-50 group-hover:bg-white text-stone-600'
                    }`}>
                      {getCurrencySymbol(code)}
                    </div>
                    <div>
                      <div className={`text-sm ${isSelected ? 'font-semibold text-stone-900' : 'font-medium text-stone-700'}`}>
                        {code}
                      </div>
                      <div className="text-xs text-stone-500">{getCurrencyName(code)}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-stone-700 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="flex-none mt-6 pt-4 border-t border-stone-100">
            <button
              onClick={() => setStep(2)}
              className="w-full bg-[#8B7355] hover:bg-[#7a6449] text-white rounded-full py-3.5 px-4 font-medium tracking-wide transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              Continue with {currency}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F5F0EB] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-stone-200/50">
        {/* Header */}
        <div className="px-8 pt-10 pb-6">
          {/* Step indicator */}
          <div className="flex items-center justify-center mb-8 space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#8B7355] text-white text-sm font-semibold">
              1
            </div>
            <div className="w-12 h-0.5 bg-[#8B7355]/30" />
            <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#8B7355] text-[#8B7355] text-sm font-semibold bg-white/50">
              2
            </div>
            <span className="ml-4 text-sm font-medium text-stone-500 uppercase tracking-wider">Step 2 of 2</span>
          </div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-stone-900 text-center mb-2">
            Set up your budget allocations
          </h1>
          <p className="text-stone-500 text-center text-base max-w-md mx-auto">
            Define how you want to divide your income across different categories.
          </p>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {/* Category rows */}
          <div className="space-y-4 mb-6">
            {categories.map((cat, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 p-4 rounded-xl border shadow-sm relative overflow-hidden ${
                  cat.isSavings
                    ? 'bg-stone-50/80 border-[#8B7355]/20'
                    : 'bg-white border-stone-100'
                }`}
              >
                {cat.isSavings && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8B7355]" />}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[#8B7355] shrink-0 ${
                  cat.isSavings ? 'bg-[#8B7355]/10' : 'bg-stone-100'
                }`}>
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: cat.isSavings ? "'FILL' 1" : "'FILL' 0" }}>
                    {cat.isSavings ? 'eco' : 'category'}
                  </span>
                </div>
                <div className="flex-grow flex items-center gap-3 min-w-0">
                  <input
                    className="flex-grow bg-transparent border-0 p-0 text-stone-800 font-medium focus:ring-0 text-base outline-none min-w-0"
                    placeholder="Category name"
                    type="text"
                    value={cat.name}
                    onChange={(e) => updateCategory(i, 'name', e.target.value)}
                  />
                  {cat.isSavings && (
                    <label className="flex items-center gap-2 text-xs font-medium text-[#8B7355] bg-[#8B7355]/10 px-2 py-1 rounded cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={cat.isSavings}
                        onChange={(e) => updateCategory(i, 'isSavings', e.target.checked)}
                        className="w-3 h-3"
                      />
                      Savings
                    </label>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="w-16 text-right border border-stone-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-[#8B7355] focus:border-[#8B7355] font-medium text-stone-900 text-sm outline-none"
                    placeholder="0"
                    value={cat.percentage || ''}
                    onChange={(e) => updateCategory(i, 'percentage', parseFloat(e.target.value) || 0)}
                  />
                  <span className="text-stone-500 font-medium text-sm">%</span>
                </div>
                {!cat.isSavings && (
                  <label className="flex items-center gap-1.5 text-xs text-stone-400 cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={cat.isSavings}
                      onChange={(e) => updateCategory(i, 'isSavings', e.target.checked)}
                      className="w-3 h-3"
                    />
                    Savings
                  </label>
                )}
                {categories.length > 1 && (
                  <button
                    onClick={() => removeCategory(i)}
                    className="text-stone-300 hover:text-stone-500 transition-colors shrink-0"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add category */}
          <div className="mb-8">
            <button
              onClick={addCategory}
              className="flex items-center gap-2 text-[#8B7355] hover:text-[#7a6449] font-medium text-sm transition-colors group"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">add_circle</span>
              Add another category
            </button>
          </div>

          {/* Allocation summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
            <div className="flex justify-between items-end mb-3">
              <span className="text-sm font-medium text-stone-500 uppercase tracking-wider">Total Allocation</span>
              <div className="text-right">
                <span className={`font-headline text-2xl font-bold ${total > 100 ? 'text-red-600' : 'text-stone-900'}`}>
                  {total.toFixed(0)}%
                </span>
                <span className="text-sm text-stone-500 block">allocated</span>
              </div>
            </div>
            {/* Segmented bar */}
            <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden flex">
              {categories
                .filter((c) => c.percentage > 0)
                .map((c, i) => (
                  <div
                    key={i}
                    className="h-full transition-all"
                    style={{
                      width: `${Math.min(c.percentage, 100)}%`,
                      backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
                    }}
                    title={`${c.name || 'Category'}: ${c.percentage}%`}
                  />
                ))}
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-4">
              {categories
                .filter((c) => c.name || c.percentage > 0)
                .map((c, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-stone-600">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
                    />
                    {c.name || 'Category'} ({c.percentage}%)
                  </div>
                ))}
              {remainder > 0 && total < 100 && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-stone-400">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-200" />
                  Unallocated ({remainder.toFixed(0)}%)
                </div>
              )}
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>

        {/* Footer actions */}
        <div className="px-8 py-6 bg-stone-50/50 border-t border-stone-200/50 flex justify-between items-center">
          <button
            onClick={() => setStep(1)}
            className="px-6 py-2.5 text-stone-600 font-medium hover:bg-stone-200/50 rounded-full transition-colors text-sm"
          >
            Back
          </button>
          <button
            onClick={handleSave}
            disabled={saving || total > 100 || categories.some((c) => !c.name.trim())}
            className="px-8 py-3 bg-[#8B7355] hover:bg-[#7a6449] text-white font-semibold rounded-full shadow-sm transition-all hover:shadow hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {saving ? 'Saving…' : 'Finish setup'}
          </button>
        </div>
      </div>
    </main>
  )
}
