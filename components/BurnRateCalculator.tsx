import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Switch } from '@/components/ui/switch'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'

const initialData = [
  { group: 'Needs (50%)', target: 50, items: ['Rent or Mortgage', 'Food & Utilities', "Children’s School Fees", 'Transportation', 'Internet/Data'] },
  { group: 'Wants (30%)', target: 30, items: ['Non-essential Subscriptions', 'Entertainment & Outings', 'Gifts & Celebrations'] },
  { group: 'Savings & Sadaqah (20%)', target: 20, items: ['Zakat/Sadaqah/Support', 'Emergency Fund Allocation', 'Investments/Savings'] }
]

const currencySymbols = ['₦', '$', '£', '€', '₹']

export default function BurnRateCalculator() {
  const [amounts, setAmounts] = useState<Record<string, number>>({})
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  const [currency, setCurrency] = useState('₦')
  const [strictMode, setStrictMode] = useState(false)

  const handleInputChange = (category: string, value: string) => {
    const inputAmount = parseFloat(value) || 0
    const updated = { ...amounts, [category]: inputAmount }
    const newTotal = Object.values(updated).reduce((sum, val) => sum + val, 0)
    if (newTotal <= monthlyIncome) {
      setAmounts(updated)
    }
  }

  const total = Object.values(amounts).reduce((sum, val) => sum + val, 0)

  const groupedTotals = initialData.map(({ group, target, items }) => {
    const sum = items.reduce((acc, item) => acc + (amounts[item] || 0), 0)
    const percentage = monthlyIncome ? ((sum / monthlyIncome) * 100).toFixed(1) : '0'
    return { group, target, amount: sum, percentage: parseFloat(percentage) }
  })

  const annualProjection = total * 12

  const warningMessages = groupedTotals
    .filter(({ percentage, target }) => percentage > target)
    .map(({ group, target, percentage }) => `${group} exceeds ${target}%. Currently at ${percentage}%`)

  return (
    <div className="grid gap-6 p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center">The Ummah Builder's Burn Rate Calculator</h1>
      <p className="text-center text-muted-foreground mb-4">A monthly budget planner for Muslims dedicating their lives to Allah</p>

      <Accordion type="single" collapsible>
        <AccordionItem value="instructions">
          <AccordionTrigger className="p-4 border rounded-md cursor-pointer">Click to show/hide instructions</AccordionTrigger>
          <AccordionContent className="p-4 border-t">
            <p>This calculator helps you estimate your monthly and annual burn rate using the 50-30-20 rule. In strict mode, it enforces this rule. In relaxed mode, you have freedom but still get guidance to stay aligned. Remember, we are not calculators—use this as a planning tool guided by your Islamic values and goals.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card className="p-4">
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label>Prospective Monthly Income</label>
            <Input
              type="number"
              className="w-48"
              placeholder="Enter income"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="flex items-center justify-between">
            <label>Currency</label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {currencySymbols.map((symbol) => (
                  <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <label>Strict Mode (50-30-20 enforced)</label>
            <Switch checked={strictMode} onCheckedChange={setStrictMode} />
          </div>
        </CardContent>
      </Card>

      {initialData.map(({ group, items }) => (
        <Card key={group} className="p-4">
          <h2 className="text-xl font-semibold mb-2">{group}</h2>
          <CardContent className="space-y-3">
            {items.map((item) => (
              <div key={item} className="flex items-center justify-between">
                <label>{item}</label>
                <Input
                  type="number"
                  className="w-32"
                  placeholder={`${currency}0`}
                  value={amounts[item] || ''}
                  onChange={(e) => handleInputChange(item, e.target.value)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <CardContent>
          <p className="text-lg">Total Monthly Burn Rate: <strong>{currency}{total.toLocaleString()}</strong></p>
          <p className="text-sm">Projected Annual Burn Rate: <strong>{currency}{annualProjection.toLocaleString()}</strong></p>
          <div className="grid gap-4 mt-4">
            {groupedTotals.map(({ group, amount, percentage, target }) => (
              <div key={group}>
                <p className="mb-1">{group}: {currency}{amount.toLocaleString()} ({percentage}%)</p>
                <Progress value={percentage} />
                {strictMode && percentage > target && (
                  <p className="text-red-600 text-sm">Warning: {group} exceeds recommended {target}% allocation.</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {warningMessages.length > 0 && (
        <Card className="p-4 border-red-500">
          <h2 className="text-xl font-semibold mb-2 text-red-600">Budget Warnings</h2>
          <CardContent>
            <ul className="list-disc pl-5 text-sm text-red-700">
              {warningMessages.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {!strictMode && (
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">Why the 50-30-20 Rule Matters</h2>
          <CardContent>
            <p>The 50-30-20 rule helps you structure your spending: 50% on essentials, 30% on non-essentials, and 20% on saving and giving. In a dawah lifestyle, this structure helps you balance family, service, and sustainability. Strive to align your budget with these values even in relaxed mode.</p>
          </CardContent>
        </Card>
      )}

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-2">Understanding Runway</h2>
        <CardContent>
          <p>Your runway is how many months you can sustain your lifestyle without new income. It's calculated as: <strong>Total Savings / Monthly Burn Rate</strong>. Knowing your runway helps you plan your transition into full-time dawah and gives peace of mind during uncertain times.</p>
        </CardContent>
      </Card>
    </div>
  )
}
