import { FormEvent, useState } from 'react'
import CountrySelect from './CountrySelect'
import CurrencySelect from './CurrencySelect'

export default function Form({
  errorMessage,
  onSubmit,
}: {
  errorMessage: string
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}) {

  const [countryCode, setCountryCode] = useState<string>("")
  const [currencyCode, setCurrencyCode] = useState<string>("USD")

  return (
    <form onSubmit={onSubmit}>
      <label>
        <span>Create Account</span>
        <input type="text" name="name_real" id="name" placeholder="Name" required />
        <input type="text" name="username" placeholder="Nickname" required />
        <input type="text" name="email" placeholder="Email" required />
        <input type="text" name="password" placeholder="Password" required />
        <input type="text" name="repeat_password" placeholder="Repeat Password" required />
      </label>

      <label>

      <span>Choose your region</span>

      <input type="text" name="currency_code" value={currencyCode} hidden required />
      <input type="text" name="country_code" value={countryCode} hidden required />

      <CountrySelect onChange={(val) => setCountryCode(val)} />
      <CurrencySelect onChange={(val) => setCurrencyCode(val)} defaultValue="USD" />

      </label>

      <button type="submit">Login</button>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <style jsx>{`
        form,
        label {
          display: flex;
          flex-flow: column;
        }
        label > span {
          font-weight: 600;
        }
        input {
          padding: 8px;
          margin: 0.3rem 0 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .error {
          color: brown;
          margin: 1rem 0 0;
        }
        button {
          padding: 8px;
          cursor: pointer;
        }
      `}</style>
    </form>
  )
}

/*

            <style jsx>{`
                .containerController {
                    width: 100%;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-gap: 20px;
                }
            `}</style>
            */