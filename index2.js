const pantalla = document.querySelector('#pantalla');
const botones = document.querySelectorAll('input[type="button"]');

function calcular() {
    try {
        let expresion = pantalla.value;

        expresion = expresion.replace(/(\d)\s*\(/g, '$1*(');
        expresion = expresion.replace(/\)\s*(\d)/g, ')*$1');
        expresion = expresion.replace(/\)\s*\(/g, ')*(');

        expresion = expresion.replace(/(\d+(?:\.\d+)?)\s*([\+\-])\s*(\d+(?:\.\d+)?)%/g, '$1 $2 ($1 * $3 / 100)');
        expresion = expresion.replace(/(\d+(?:\.\d+)?)%/g, '($1 / 100)');

        expresion = expresion.replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)');
        expresion = expresion.replace(/√(\d+(?:\.\d+)?)/g, 'Math.sqrt($1)');

        expresion = expresion.replace(/\^/g, '**');

        if (/\/0(?!\.)/.test(expresion)) {
            pantalla.value = 'No se puede dividir entre 0';
        } else {
            let resultado = eval(expresion);
            
            if (resultado === Infinity || resultado === -Infinity || isNaN(resultado)) {
                pantalla.value = 'No se puede dividir entre 0';
            } else {
                pantalla.value = resultado;
            }
        }
    } catch (e) {
        pantalla.value = 'Error';
    }
}

function insertarEnCursor(texto) {
    if (pantalla.value === 'Error' || pantalla.value === 'No se puede dividir entre 0') {
        pantalla.value = '';
    }

    const inicio = pantalla.selectionStart;
    const fin = pantalla.selectionEnd;
    const valorActual = pantalla.value;

    if (valorActual === '0' && texto !== '.') {
        pantalla.value = texto;
        pantalla.setSelectionRange(1, 1);
    } else {
        pantalla.value = valorActual.substring(0, inicio) + texto + valorActual.substring(fin);
        const nuevaPosicion = inicio + texto.length;
        pantalla.setSelectionRange(nuevaPosicion, nuevaPosicion);
    }
    pantalla.focus();
}

function borrarEnCursor() {
    if (pantalla.value === 'Error' || pantalla.value === 'No se puede dividir entre 0') {
        pantalla.value = '0';
        pantalla.focus();
        return;
    }

    const inicio = pantalla.selectionStart;
    const fin = pantalla.selectionEnd;
    const valorActual = pantalla.value;

    if (inicio !== fin) {
        pantalla.value = valorActual.substring(0, inicio) + valorActual.substring(fin);
        pantalla.setSelectionRange(inicio, inicio);
    } else if (inicio > 0) {
        pantalla.value = valorActual.substring(0, inicio - 1) + valorActual.substring(inicio);
        pantalla.setSelectionRange(inicio - 1, inicio - 1);
    }

    if (pantalla.value === '') {
        pantalla.value = '0';
    }
    pantalla.focus();
}

botones.forEach(function(boton) {
    boton.addEventListener('click', function() {
        const id = boton.id;

        if (id === '=') {
            calcular();
        } else if (id === 'AC' || id === 'CE') {
            pantalla.value = '0';
            pantalla.focus();
        } else if (id === 'DEL') {
            borrarEnCursor();
        } else {
            insertarEnCursor(id);
        }
    });
});

pantalla.addEventListener('keydown', function(event) {
    const permitidos = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '+', '-', '*', '/', '%', '^', '(', ')', '.', '√',
        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'
    ];

    if (event.key === 'Enter') {
        event.preventDefault();
        calcular();
    } else if (event.key === 'Escape') {
        event.preventDefault();
        pantalla.value = '0';
        pantalla.focus();
    } else if (!permitidos.includes(event.key) && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
    }
});