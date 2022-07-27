import { useState } from "react"

export default function Counter () {

    const [value, setValue] = useState(0) 

    const increment = () => setValue(value + 1)
    const decrement = () => setValue(value - 1)

    return (
        <>
            <div className="input-number-container flex h-8 mt-1">
                <button className="input-number-decrement w-8 bg-gold rounded-sm" type="button" onClick={decrement}>–</button>
                <input
                    id="input-price-guess"
                    className="h-full w-14 px-4 shadow-sm sm:text-sm bg-dim-gray"
                    type="text"
                    value={value} min="0" max="1000"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    step=".1"
                    style={{
                        textAlign: 'center'
                    }}
                />
                <button className="input-number-increment h-full bg-gold w-8 rounded-sm" type="button" onClick={increment}>+</button>
            </div>
        </>
    )
}