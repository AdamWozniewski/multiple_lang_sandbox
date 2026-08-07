export const validateEmail = (value: string) =>
  /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value);
export const validateForbiddenString = (
  value: string,
  forbiddenString: string,
) => {
  if (value === forbiddenString)
    throw new Error(`Pole ${forbiddenString} jest zakazane`);
};
