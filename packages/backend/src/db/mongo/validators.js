export const validateEmail = (value) => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value);
export const validateForbiddenString = (value, forbiddenString) => {
    if (value === forbiddenString) {
        throw new Error(`Pole ${forbiddenString} jest zakazane`);
    }
}