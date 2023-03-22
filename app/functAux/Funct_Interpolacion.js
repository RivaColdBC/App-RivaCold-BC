function Interpol(Tamb, Tcamara, MarcaB, MarcaBField, i) {
    MarcaBFieldlength = MarcaBField.length
    for (m = 0; m < MarcaBFieldlength; m++) {
        if (MarcaB[i][MarcaBField[m]]) {
            if (Tamb == parseFloat(MarcaBField[m].split("_")[1])) {
                if (Tcamara == parseFloat(MarcaBField[m].split("_")[2])) {
                    return parseFloat(MarcaB[i][MarcaBField[m]]).toFixed(0) + " W";
                }
            }
        }
    }
    positive = 0, negative = 0;
    for (Int = 0; Int < MarcaBFieldlength; Int++) {
        if (Tcamara == parseFloat(MarcaBField[Int].split("_")[2]) && MarcaBField[Int].startsWith("PC_")) {
            for (iamb = 1; iamb < 30; iamb++) {
                if (Tamb + iamb == parseFloat(MarcaBField[Int].split("_")[1]) && MarcaB[i][MarcaBField[Int]] && !positive) {
                    Tambip = Tamb + iamb;
                    PFeqip = parseFloat(MarcaB[i][MarcaBField[Int]]);
                    positive = 1;
                }
                if (Tamb - iamb == parseFloat(MarcaBField[Int].split("_")[1]) && MarcaB[i][MarcaBField[Int]] && !negative) {
                    Tambin = Tamb - iamb;
                    PFeqin = parseFloat(MarcaB[i][MarcaBField[Int]]);
                    negative = 1;
                }
            }
        }
    }
    if (positive && negative) {
        return Interpolacion(Tamb, Tambip, Tambin, PFeqip, PFeqin) + " W (*)";
    } else if (positive && !negative) {
        for (Int = 0; Int < MarcaBFieldlength; Int++) {
            if (
                Tcamara == parseFloat(MarcaBField[Int].split("_")[2]) &&
                MarcaBField[Int].startsWith("PC_")
            ) {
                for (iamb = 1; iamb < 30; iamb++) {
                    if (Tambip + iamb == parseFloat(MarcaBField[Int].split("_")[1]) && MarcaB[i][MarcaBField[Int]]) {
                        return (
                            Interpolacion(Tamb, Tambip, Tambip + iamb, PFeqip, parseFloat(MarcaB[i][MarcaBField[Int]])) + " W (+)"
                        );
                    }
                }
            }
        }
    } else if (!positive && negative) {
        for (Int = 0; Int < MarcaBFieldlength; Int++) {
            if (
                Tcamara == parseFloat(MarcaBField[Int].split("_")[2]) &&
                MarcaBField[Int].startsWith("PC_")
            ) {
                for (iamb = 1; iamb < 30; iamb++) {
                    if (
                        Tambin - iamb == parseFloat(MarcaBField[Int].split("_")[1]) &&
                        MarcaB[i][MarcaBField[Int]]
                    ) {
                        return (
                            Interpolacion(Tamb, Tambin - iamb, Tambin, parseFloat(MarcaB[i][MarcaBField[Int]]), PFeqin) + " W (-)"
                        );
                    }
                }
            }
        }
    } else {
        for (Int = 0; Int < MarcaBFieldlength; Int++) {
            if (
                Tamb == parseFloat(MarcaBField[Int].split("_")[1]) &&
                MarcaBField[Int].startsWith("PC_")
            ) {
                for (icamara = 1; icamara < 30; icamara++) {
                    if (
                        Tcamara + icamara == parseFloat(MarcaBField[Int].split("_")[2]) &&
                        MarcaB[i][MarcaBField[Int]] &&
                        !positive
                    ) {
                        Tcamaraip = Tcamara + icamara;
                        PFeqip = parseFloat(MarcaB[i][MarcaBField[Int]]);
                        positive = 1;
                    }
                }
            }
            if (
                Tamb == parseFloat(MarcaBField[Int].split("_")[1]) &&
                MarcaBField[Int].startsWith("PC_")
            ) {
                for (icamara = 1; icamara < 30; icamara++) {
                    if (
                        Tcamara - icamara == parseFloat(MarcaBField[Int].split("_")[2]) &&
                        MarcaB[i][MarcaBField[Int]] &&
                        !negative
                    ) {
                        Tcamarain = Tcamara - icamara;
                        PFeqin = parseFloat(MarcaB[i][MarcaBField[Int]]);
                        negative = 1;
                    }
                }
            }
        }

        if (positive && negative) {
            return (
                Interpolacion(Tcamara, Tcamaraip, Tcamarain, PFeqip, PFeqin) + "W (*)"
            );
        } else if (positive && !negative) {
            for (Int = 0; Int < MarcaBFieldlength; Int++) {
                if (
                    Tamb == parseFloat(MarcaBField[Int].split("_")[1]) &&
                    MarcaBField[Int].startsWith("PC_")
                ) {
                    for (icamara = 1; icamara < 30; icamara++) {
                        if (
                            parseFloat(Tcamaraip) + icamara ==
                            parseFloat(MarcaBField[Int].split("_")[2]) &&
                            MarcaB[i][MarcaBField[Int]]
                        ) {
                            Tcamarain = parseFloat(Tcamaraip) + icamara;
                            PFeqin = parseFloat(MarcaB[i][MarcaBField[Int]]);
                            return (
                                Interpolacion(Tcamara, Tcamaraip, Tcamarain, PFeqip, PFeqin) +
                                " W (+)"
                            );
                        }
                    }
                }
            }
        } else if (!positive && negative) {
            for (Int = 0; Int < MarcaBFieldlength; Int++) {
                if (
                    Tamb == parseFloat(MarcaBField[Int].split("_")[1]) &&
                    MarcaBField[Int].startsWith("PC_")
                ) {
                    for (icamara = 1; icamara < 30; icamara++) {
                        if (
                            parseFloat(Tcamarain) - icamara ==
                            parseFloat(MarcaBField[Int].split("_")[2]) &&
                            MarcaB[i][MarcaBField[Int]]
                        ) {
                            Tcamaraip = parseFloat(Tcamarain) - icamara;
                            PFeqip = parseFloat(MarcaB[i][MarcaBField[Int]]);
                            return (
                                Interpolacion(Tcamara, Tcamaraip, Tcamarain, PFeqip, PFeqin) +
                                " W (-)"
                            );
                        }
                    }
                }
            }
        }
    }
    return "-";
}

function Interpolacion(x, x1, x2, y1, y2) {
    y = (y1 - ((y1 - y2) * (x1 - x)) / (x1 - x2)).toFixed(0);
    return y;
}