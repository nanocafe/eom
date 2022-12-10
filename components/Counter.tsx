import React from "react";
import { IMaskInput } from 'react-imask';
import Input, { InputProps } from "./Input";
import { InputAdornment } from '@mui/material';

type CounterProps = InputProps & {
    label: string;
    min: number;
    max: number;
    step: number;
    defaultValue?: number;
    onChange?: (value: number) => void;
}

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const TextMaskCustom = React.forwardRef<HTMLElement, CustomProps>(
    function TextMaskCustom(props, ref) {
        const { onChange, ...other } = props;
        return (
            <IMaskInput
                {...other}
                mask="0.00"
                definitions={{
                    '#': /[0-9]/,
                }}
                inputRef={ref as any}
                onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
                overwrite
            />
        );
    },
);

export default function Counter({ label, min, max, step, value: _value, defaultValue, onChange, ...props }: CounterProps) {

    const [value, setValue] = React.useState(defaultValue?.toString() || '0.00');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        onChange && onChange(Number(event.target.value));
    };

    console.log('props', props)

    return (
        <Input
            type="number"
            label={label}
            id="price"
            className="w-40"
            variant='outlined'
            value={value}
            inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9].*',
                min,
                max,
                step,
            }}
            InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputComponent: TextMaskCustom as any,
            }}
            onChange={handleChange}
            {...props}
        />
    )
}