export const classNames = (...classes: any[]) => {
	return classes.filter(Boolean).join(' ');
}

export const getCurrentMonthName = () => {
	return new Date().toLocaleString('en-US', { month: 'long' });
}

// Remove decimals without rounding
export const toFixedSafe = (num: number | string, fixed: number) => {
    const re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    const match = num.toString().match(re);
    if (!match) throw new Error('toFixedSafe: invalid number');
    return match[0];
}
