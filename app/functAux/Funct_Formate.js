function NumberFormatEUR(num) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(ParseNumber(num))
}

function ParseNumber(num) {
    num = num.toString()
    if (num.split(",")[0].length == 1) {
        return parseFloat(num)
    }
    return parseFloat(num.split(",")[0].replace(".", "")) + parseFloat("0." + num.split(",")[1])
}

function PerCent(A, B, Fixed) {
    return (ParseNumber(A) / ParseNumber(B) * 100).toFixed(Fixed) + " %"
}

function PerCent1(A, Fixed) {
    return (ParseNumber(A)).toFixed(Fixed) + " %"
}

function PerCent1coma(A, Fixed) {
    return ((ParseNumber(A)).toFixed(Fixed) + " %").replace(".", ",")
}

