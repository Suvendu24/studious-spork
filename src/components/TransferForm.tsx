import { useId, useState, type FormEvent } from 'react'
import type { OperationResult } from '../hooks/useBanking'
import type { Account } from '../types'

interface TransferFormProps {
  recipients: Account[]
  onSubmit: (
    toAccountId: string,
    amount: string,
    description?: string,
  ) => OperationResult
}

export function TransferForm({ recipients, onSubmit }: TransferFormProps) {
  const recipientId = useId()
  const amountId = useId()
  const descriptionId = useId()
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  function clearMessages() {
    setError(null)
    setSuccess(null)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = onSubmit(recipient, amount, description)

    if (!result.ok) {
      setError(result.error?.message ?? 'Something went wrong.')
      setSuccess(null)
      return
    }

    const recipientName = recipients.find(
      (account) => account.id === recipient,
    )?.accountHolder

    setError(null)
    setSuccess(`Transfer to ${recipientName ?? 'recipient'} completed.`)
    setAmount('')
    setDescription('')
  }

  return (
    <section className="card" aria-labelledby="transfer-heading">
      <h2 id="transfer-heading">Send money</h2>
      <form onSubmit={handleSubmit} noValidate data-testid="transfer-form">
        <label htmlFor={recipientId}>Recipient</label>
        <select
          id={recipientId}
          name="recipient"
          value={recipient}
          onChange={(event) => {
            setRecipient(event.target.value)
            clearMessages()
          }}
        >
          <option value="">Select a recipient</option>
          {recipients.map((account) => (
            <option key={account.id} value={account.id}>
              {account.accountHolder} ({account.accountNumber})
            </option>
          ))}
        </select>

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
            clearMessages()
          }}
        />

        <label htmlFor={descriptionId}>Description (optional)</label>
        <input
          id={descriptionId}
          name="description"
          autoComplete="off"
          placeholder="Shared dinner"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <button type="submit" className="submit transfer">
          Send transfer
        </button>

        {error && (
          <p className="message error" role="alert" data-testid="transfer-error">
            {error}
          </p>
        )}
        {success && (
          <p
            className="message success"
            role="status"
            data-testid="transfer-success"
          >
            {success}
          </p>
        )}
      </form>
      <p className="balance-note">
        Transfers move money instantly between demo accounts and appear in both
        transaction histories.
      </p>
    </section>
  )
}
