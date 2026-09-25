import { useId, useState, type FormEvent } from 'react'
import type { SubmitResult } from '../hooks/useAccount'
import type { TransactionType } from '../types'

interface TransactionFormProps {
  type: TransactionType
  onSubmit: (
    type: TransactionType,
    amount: string,
    description?: string,
  ) => SubmitResult
}

const labels: Record<TransactionType, { title: string; action: string }> = {
  deposit: { title: 'Deposit', action: 'Deposit funds' },
  withdrawal: { title: 'Withdraw', action: 'Withdraw funds' },
}

export function TransactionForm({ type, onSubmit }: TransactionFormProps) {
  const amountId = useId()
  const descriptionId = useId()
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = onSubmit(type, amount, description)

    if (!result.ok) {
      setError(result.error?.message ?? 'Something went wrong.')
      setSuccess(null)
      return
    }

    setError(null)
    setSuccess(`${labels[type].title} completed.`)
    setAmount('')
    setDescription('')
  }

  return (
    <section className="card" aria-labelledby={`${type}-heading`}>
      <h2 id={`${type}-heading`}>{labels[type].title}</h2>
      <form onSubmit={handleSubmit} noValidate data-testid={`${type}-form`}>
        <label htmlFor={amountId}>Amount</label>
        <input
          id={amountId}
          name="amount"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.00"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value)
            setError(null)
            setSuccess(null)
          }}
        />

        <label htmlFor={descriptionId}>Description (optional)</label>
        <input
          id={descriptionId}
          name="description"
          autoComplete="off"
          placeholder={type === 'deposit' ? 'Salary transfer' : 'Rent payment'}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <button type="submit" className={`submit ${type}`}>
          {labels[type].action}
        </button>

        {error && (
          <p className="message error" role="alert" data-testid={`${type}-error`}>
            {error}
          </p>
        )}
        {success && (
          <p
            className="message success"
            role="status"
            data-testid={`${type}-success`}
          >
            {success}
          </p>
        )}
      </form>
    </section>
  )
}
