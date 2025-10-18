export function maskElement(e) {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length <= 2) {
        valor = valor.replace(/^(\d*)/, '($1');
    } else if (valor.length > 2 && valor.length <= 6) {
        valor = valor.replace(/^(\d{2})(\d*)/, '($1) $2');
    } else if (valor.length > 6 && valor.length <= 10) {
        valor = valor.replace(/^(\d{2})(\d{4})(\d*)/, '($1) $2-$3');
    } else if (valor.length > 10) {
        valor = valor.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    e.target.value = valor;
}