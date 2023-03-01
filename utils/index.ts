export const classNames = (...classes: any[]) => {
	return classes.filter(Boolean).join(' ');
}

export const getCurrentMonthName = () => {
	return new Date().toLocaleString('en-US', { month: 'long' });
}