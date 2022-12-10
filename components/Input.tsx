import React from 'react'
import { TextField, TextFieldProps } from '@mui/material'

export type InputProps = TextFieldProps & {
	label: string;
	errorMessage?: string;
	isRequired?: boolean;
	containerClassName?: string;
}

export default function Input({
	label,
	errorMessage,
	isRequired,
	containerClassName,
	...props
}: InputProps) {
	return (
		<div className={containerClassName || 'w-full'}>
			<TextField
				label={label}
				variant="outlined"
				error={!!errorMessage}
				required={isRequired}
				{...props as any}
                InputLabelProps={{
                    shrink: true,
                }}
				size='medium'
			/>
			{
				errorMessage && (
					<span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
						{errorMessage}
					</span>
				)
			}
		</div>
	)
}
