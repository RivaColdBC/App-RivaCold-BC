function NumberFormatEUR(num) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(parseFloat(num))
}

function PerCent(A, B, Fixed) {
    return (parseFloat(A) / parseFloat(B) * 100).toFixed(Fixed) + " %"
}
function PerCent1(A, Fixed) {
    return (parseFloat(A) * 100).toFixed(Fixed) + " %"
}
function PerCent2(A, Fixed) {
    return (parseFloat(A)).toFixed(Fixed) + " %"
}
