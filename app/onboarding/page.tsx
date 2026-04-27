'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CURRENCIES = [
  'AED','AFN','ALL','AMD','ANG','AOA','ARS','AUD','AWG','AZN',
  'BAM','BBD','BDT','BGN','BHD','BIF','BMD','BND','BOB','BRL',
  'BSD','BTN','BWP','BYN','BZD','CAD','CDF','CHF','CLP','CNY',
  'COP','CRC','CUP','CVE','CZK','DJF','DKK','DOP','DZD','EGP',
  'ERN','ETB','EUR','FJD','FKP','GBP','GEL','GHS','GIP','GMD',
  'GNF','GTQ','GYD','HKD','HNL','HRK','HTG','HUF','IDR','ILS',
  'INR','IQD','IRR','ISK','JMD','JOD','JPY','KES','KGS','KHR',
  'KMF','KPW','KRW','KWD','KYD','KZT','LAK','LBP','LKR','LRD',
  'LSL','LYD','MAD','MDL','MGA','MKD','MMK','MNT','MOP','MRU',
  'MUR','MVR','MWK','MXN','MYR','MZN','NAD','NGN','NIO','NOK',
  'NPR','NZD','OMR','PAB','PEN','PGK','PHP','PKR','PLN','PYG',
  'QAR','RON','RSD','RUB','RWF','SAR','SBD','SCR','SDG','SEK',
  'SGD','SHP','SLL','SOS','SRD','STN','SVC','SYP','SZL','THB',
  'TJS','TMT','TND','TOP','TRY','TTD','TWD','TZS','UAH','UGX',
  'USD','UYU','UZS','VES','VND','VUV','WST','XAF','XCD','XOF',
  'XPF','YER','ZAR','ZMW','ZWL',
]

type Category = {
  name: string
  percentage: number
  isSavings: boolean
  isMixed: boolean
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

  const filtered = CURRENCIES.filter((c) => c.includes(search.toUpperCase()))
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
      if (savingsExists) {
        // remaining goes to savings automatically — do nothing extra
      } else {
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
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold">Welcome to MyWallet</h1>
          <p className="mt-1 text-zinc-500">Choose your home currency</p>
          <input
            className="mt-4 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-zinc-200">
            {filtered.map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-zinc-50 ${
                  currency === c ? 'bg-zinc-100 font-semibold' : ''
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep(2)}
            className="mt-6 w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-700 transition-colors"
          >
            Continue with {currency}
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold">Set up your budget</h1>
        <p className="mt-1 text-zinc-500">
          Allocate your income across categories. Total must be ≤ 100%.
        </p>

        <div className="mt-6 space-y-3">
          {categories.map((cat, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                placeholder="Category name"
                value={cat.name}
                onChange={(e) => updateCategory(i, 'name', e.target.value)}
              />
              <input
                type="number"
                min={0}
                max={100}
                className="w-20 rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
                placeholder="%"
                value={cat.percentage || ''}
                onChange={(e) => updateCategory(i, 'percentage', parseFloat(e.target.value) || 0)}
              />
              <label className="flex items-center gap-1 text-xs text-zinc-500">
                <input
                  type="checkbox"
                  checked={cat.isSavings}
                  onChange={(e) => updateCategory(i, 'isSavings', e.target.checked)}
                />
                Savings
              </label>
              {categories.length > 1 && (
                <button
                  onClick={() => removeCategory(i)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addCategory}
          className="mt-3 text-sm text-zinc-500 hover:text-zinc-900 underline"
        >
          + Add category
        </button>

        <div className={`mt-4 text-sm font-medium ${total > 100 ? 'text-red-600' : 'text-zinc-700'}`}>
          Total allocated: {total.toFixed(1)}%
          {remainder > 0 && (
            <span className="ml-2 text-zinc-400">
              (remaining {remainder.toFixed(1)}% → Mixed bucket)
            </span>
          )}
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setStep(1)}
            className="flex-1 rounded-full border border-zinc-200 py-3 text-sm font-medium hover:bg-zinc-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSave}
            disabled={saving || total > 100 || categories.some((c) => !c.name.trim())}
            className="flex-1 rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving…' : 'Finish setup'}
          </button>
        </div>
      </div>
    </main>
  )
}
