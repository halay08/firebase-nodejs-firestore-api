// Find out more here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
export const formatCurrency = (amount: string | number, locale: string = 'vn-VN', currency: string = 'VND') => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(Number(amount));
};
