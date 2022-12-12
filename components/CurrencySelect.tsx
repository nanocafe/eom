
const DEFAULT_CURRENCY_CODE = "USD"

interface Iprops {
    defaultValue? : string,
    onChange? : (value : string) => void
}

export default function CurrencySelect ({defaultValue = DEFAULT_CURRENCY_CODE, onChange} : Iprops) {
    let currencies : any = {
        "USD" : "Dollar"
    }

    const handleChange = (val : string) => onChange && onChange(val)

    return (
        <select id="country" name="country"
            defaultValue={defaultValue}
            onChange={(e) => handleChange(e.target.value)}
            style={{
                padding: 8,
                marginTop: 6,
                marginBottom: 6
            }}
        >
            { Object.keys(currencies).map( (code : string) => <option key={code} value={code}>{ `${code} : ${currencies[code]}` }</option>) }
        </select>
    )
}