import { useState, useEffect } from 'react'
import { withAuthPage } from '@/lib/withAuthPage'
import ProtectedLayout from '@/components/ProtectedLayout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface BurnItem {
  id?: string
  label: string
  category: string
  value: number
}

const BurnRatePage = ({ user }: { user: { id: string; email: string } }) => {
  const [income, setIncome] = useState(0)
  const [currency, setCurrency] = useState('USD')
  const [items, setItems] = useState<BurnItem[]>([])
  const [form, setForm] = useState<BurnItem>({ label: '', category: 'needs', value: 0 })
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/burn-items')
      .then(r => r.ok ? r.json() : [])
      .then(data => setItems(data))
      .catch(() => {})
  }, [])

  const saveItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.label) return
    const method = editId ? 'PUT' : 'POST'
    const body = editId ? { ...form, id: editId } : form
    const res = await fetch('/api/burn-items', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) return
    const data = await (method === 'POST' ? res.json() : res.json())
    if (editId) {
      setItems(items.map(i => (i.id === editId ? data : i)))
    } else {
      setItems([...items, data])
    }
    setForm({ label: '', category: 'needs', value: 0 })
    setEditId(null)
  }

  const handleEdit = (item: BurnItem) => {
    setForm(item)
    setEditId(item.id!)
  }

  const handleDelete = async (id: string) => {
    const res = await fetch('/api/burn-items', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) setItems(items.filter(i => i.id !== id))
  }

  const exportPdf = () => {
    window.print()
  }

  const total = items.reduce((sum, i) => sum + i.value, 0)

  return (
    <ProtectedLayout user={user}>
      <h2 className="text-xl font-bold mb-4">Burn Rate Calculator</h2>

      <div className="space-y-6">
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm mb-1">Monthly Income</label>
            <Input
              type="number"
              value={income}
              onChange={e => setIncome(parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Currency</label>
            <select
              className="border rounded-md h-9 px-3"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <Button onClick={exportPdf}>Export PDF</Button>
        </div>

        <form onSubmit={saveItem} className="space-x-2">
          <Input
            placeholder="Label"
            value={form.label}
            onChange={e => setForm({ ...form, label: e.target.value })}
          />
          <select
            className="border rounded-md h-9 px-3"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            <option value="needs">50% Needs</option>
            <option value="wants">30% Wants</option>
            <option value="savings">20% Savings</option>
          </select>
          <Input
            type="number"
            value={form.value}
            onChange={e => setForm({ ...form, value: parseFloat(e.target.value) })}
          />
          <Button type="submit">{editId ? 'Update' : 'Add'}</Button>
        </form>

        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="py-2">Label</th>
              <th className="py-2">Category</th>
              <th className="py-2">Value</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="py-2">{item.label}</td>
                <td className="py-2 capitalize">{item.category}</td>
                <td className="py-2">{item.value} {currency}</td>
                <td className="py-2 space-x-2">
                  <Button size="sm" variant="outline" type="button" onClick={() => handleEdit(item)}>Edit</Button>
                  <Button size="sm" variant="destructive" type="button" onClick={() => handleDelete(item.id!)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="font-medium">Total: {total} {currency}</div>
      </div>
    </ProtectedLayout>
  )
}

export const getServerSideProps = withAuthPage(async (_ctx, user) => {
  return { props: { user } }
})

export default BurnRatePage
