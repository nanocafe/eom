import { useEffect, useState } from "react";

interface CounterProps {
    min: number;
    max: number;
    defaultValue: number;
    onChange: (value: number) => void;
}

export default function Counter ({ min, max, defaultValue, onChange }: CounterProps) {

    const [value, setValue] = useState<number>(defaultValue);

    const increment = () => {
        if (value < max) {
            setValue(value + .5);
        }
    };
    const decrement = () => {
        if (value > min) {
            setValue(value - .5);
        }
    };

    useEffect(() => {
        onChange(value);
    }, [value])

    return (
        <>
            <div className="input-number-container flex h-8 mt-1">
                <button className="input-number-decrement w-8 bg-gold rounded-sm" type="button" onClick={decrement}>–</button>
                <input
                    id="input-price-guess"
                    className="h-full w-20 px-4 shadow-sm sm:text-sm bg-dim-gray"
                    type="text"
                    value={value.toFixed(2)}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    style={{
                        textAlign: 'center'
                    }}
                />
                <button className="input-number-increment h-full bg-gold w-8 rounded-sm" type="button" onClick={increment}>+</button>
            </div>
        </>
    )
}