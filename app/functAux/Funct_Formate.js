function NumberFormatEUR(num) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(parseFloat(num))
}