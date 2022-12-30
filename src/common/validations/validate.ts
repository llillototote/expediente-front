export function validateEmail(email: string) {
    const expreg = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
    return expreg.test(email.trim())
}

export function validateCI(ci: string) {
    const expreg = new RegExp("^[0-9]{11}$");
    return expreg.test(ci.trim())
}