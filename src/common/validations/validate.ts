export function validateEmail(email: string) {
    const expreg = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
    return expreg.test(email.trim())
}

export function validateCI(ci: string) {
    const expreg = new RegExp("^[0-9]{11}$");
    return expreg.test(ci.trim())
}

export function newEmailIsValid(correo: string) {
    let msg = '';
    let status = true;
    // validar con expresiones regulares que sea un dominio valido
    if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$/.test(correo)) {
        // en caso de que todo este bien poner status en false
        status = false;
    } else {
        msg = 'No es una dirección de correo válida';
    }


    return { status, msg };
}

export function validarNewPass(
    pass: string
) {
    const letras = [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
    ];

    const caracteres = [
        '`',
        '/',
        '*',
        '-',
        '.',
        '_',
        '~',
        '!',
        '@',
        '#',
        '$',
        '%',
        '^',
        '&',
        '(',
        ')',
        ',',
        '?',
        ':',
        ';',
        `'`,
        `"`,
        '+',
    ];

    const numeros = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    let flag = false;
    const msgs = [];
    //  longitud
    if (pass.length >= 8) {
        // mayusculas
        let ma_flag = false;
        letras.forEach((letra) => {
            if (pass.includes(letra.toUpperCase())) {
                ma_flag = true;
            }
        });
        if (ma_flag) {
            // minusculas
            let mi_flag = false;
            letras.forEach((letra) => {
                if (pass.includes(letra)) {
                    mi_flag = true;
                }
            });
            if (mi_flag) {
                let ce_flag = false;
                caracteres.forEach((caracter) => {
                    if (pass.includes(caracter)) {
                        ce_flag = true;
                    }
                });
                if (ce_flag) {
                    // numeros
                    let nu_flag = false;
                    numeros.forEach((letra) => {
                        if (pass.includes(letra)) {
                            nu_flag = true;
                        }
                    });
                    if (nu_flag) {
                        flag = true;
                    } else {
                        flag = false;
                        msgs.push('la contraseña debe tener números');
                    }
                } else {
                    flag = false;
                    msgs.push('la contraseña debe tener caracteres especiales');
                }
            } else {
                flag = false;
                msgs.push('la contraseña debe tener minúsculas');
            }
        } else {
            flag = false;
            msgs.push('la contraseña debe tener mayúsculas');
        }
    } else {
        flag = false;
        msgs.push('la contraseña debe tener mínimo 8 caracteres');
    }

    return { flag, msgs };
}