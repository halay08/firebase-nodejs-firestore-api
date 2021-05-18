const base64Encode = (str: string) => {
    if (!str) {
        return '';
    }

    return Buffer.from(str).toString('base64');
};

const base64Decode = (str: string) => {
    if (!str) {
        return '';
    }

    return Buffer.from(str, 'base64').toString();
};

export { base64Encode, base64Decode };
