const ArrayDB = ["RivaColdEq", "RivaColdEvap", "RivaColdCond", "RivaColdCentral"];
const ArrayRivaCold = ["RivaColdEq", "RivaColdEvap", "RivaColdCond", "RivaColdCentral", "RivaColdOPT", "RivaColdTarifa0000",];
const ArrayCliente = ["RivaColdCliente"];
var DBSearch

function Busqueda1(idsearch, idresult) {
    Didresult = document.getElementById(idresult);
    sp = document.getElementById(idsearch).value;
    if (sp) {
        Didresult.innerHTML = "";
        function ArrayLocalforage(nl) {
            return localforage.getItem(ArrayDB[nl], function (err, value) {
                DBFilter = JSON.parse(value).filter(item => item.Ref != null).filter(item => ("x" + item.Ref).toLowerCase().indexOf(sp.toLowerCase()) > -1);
                for (j = 0, jlen = DBFilter.length; j < jlen; j++) {
                    option_modelo = document.createElement("option");
                    option_modelo.text = DBFilter[j]["Ref"];
                    option_modelo.value = nl + "_A_" + DBFilter[j]["Marca"] + "_A_" + DBFilter[j]["Gama"] + "_A_" + DBFilter[j]["Ref"];
                    Didresult.add(option_modelo);
                }
                nl += 1
                nl < ArrayDB.length ? ArrayLocalforage(nl) : null
            })
        }
        ArrayLocalforage(0)
    }
}



function Busqueda2(idsearch, idresult) {
    const Didresult = document.getElementById(idresult);
    sp = document.getElementById(idsearch).value;
    if (sp) {
        RegLocal1 = [];
        RegLocal2 = [];
        Didresult.innerHTML = "";
        return localforage.getItem("RivaCold" + document.getElementById("list_type").value, function (err, value) {
            DBFilter = JSON.parse(value).sort(function (a) { if (a.Vol) { return -1; } else { return +1 } });
            for (j = 0; j < DBFilter.length; j++) {
                if ((DBFilter[j]["Ref2"] + DBFilter[j]["Ref"] + DBFilter[j]["Descripción"] + DBFilter[j]["RefAux"]).toUpperCase().indexOf(sp.toUpperCase()) > -1) {
                    option_modelo = document.createElement("option");
                    option_modelo.text = DBFilter[j]["Ref"];
                    Didresult.add(option_modelo);
                    if (list_type.value === "Tarifa0000") {
                        DBFilter[0]["Observación"] ? RegLocal1[j] = DBFilter[j]["Descripción"] + "\n" + DBFilter[0]["Observación"] : RegLocal1[j] = DBFilter[j]["Descripción"]
                        RegLocal2[j] = parseFloat(DBFilter[j]["Precio Venta"]);
                    } else {
                        RegLocal1[j] = DBFilter[j]["Descripción"]
                        RegLocal2[j] = parseFloat(DBFilter[j]["Precio"]);
                    }
                }
            }
            sessionStorage.setItem("SearchRegister2_1", JSON.stringify(RegLocal1));
            sessionStorage.setItem("SearchRegister2_2", JSON.stringify(RegLocal2));
        })
    }
}

function Busqueda3(idsearch, idresult) {
    RegLocal = [];
    i = 0;
    document.getElementById(idresult).innerHTML = "";
    sp = document.getElementById(idsearch).value;
    return localforage.getItem(ArrayCliente[0], function (err, value) {
        DBSearch = JSON.parse(value).sort();
        for (j = 0; j < DBSearch.length; j++) {
            const list_modelo = document.getElementById(idresult);
            if ((DBSearch[j]["Cliente"] + DBSearch[j]["C#I#F#"] + DBSearch[j]["Nombre"] + DBSearch[j]["Razón Social"] + parseFloat(DBSearch[j]["Teléfono"])).toUpperCase().indexOf(sp.toUpperCase()) > -1) {
                option_modelo = document.createElement("option");
                option_modelo.text = DBSearch[j]["Razón Social"];
                list_modelo.add(option_modelo);
                RegLocal[i] = j
                i += 1;
            }
        }
        sessionStorage.setItem("SearchRegister3", JSON.stringify(RegLocal));
    })
}
function Seleccionar2(idresult) {
    Register1 = JSON.parse(sessionStorage.getItem("SearchRegister2_1"));
    Register2 = JSON.parse(sessionStorage.getItem("SearchRegister2_2"));
    i = document.getElementById(idresult).selectedIndex;
    document.getElementById("RefModelo").value = document.getElementById(idresult).value;
    document.getElementById("textoModelo").innerHTML = Register1[i]
    document.getElementById("Precio").value = Register2[i] + "€";
}

function Seleccionar3(idresult) {
    return localforage.getItem(ArrayCliente[0], function (err, value) {
        DBSearch = JSON.parse(value).sort();
        Register = JSON.parse(sessionStorage.getItem("SearchRegister3"));
        i = document.getElementById(idresult).selectedIndex;
        j = Register[i]
        document.getElementById("DatosCliente").innerHTML =
            "Numero de cliente: " + DBSearch[j]["Cliente"]
            + "\nC.I.F.: " + DBSearch[j]["C#I#F#"]
            + "\nRazón Social: " + DBSearch[j]["Razón Social"]
            + "\nDirección: " + DBSearch[j]["Dirección"]
            + "\nC.P: " + DBSearch[j]["C#P"]
            + "\nPoblación: " + DBSearch[j]["Población"]
            + "\nProvincia: " + DBSearch[j]["Provincia"]
            + "\nTeléfono: " + DBSearch[j]["Teléfono"]
            + "\nPaís: " + DBSearch[j]["Pais"]
            + "\nForma de Pago: " + DBSearch[j]["nom_fpg"]
            + "\nObservación: " + DBSearch[j]["Observaciones"]
        document.getElementById("DatosCliente").rows = 0;
        document.getElementById("DatosCliente").rows = parseFloat(document.getElementById("DatosCliente").scrollHeight / 24).toFixed(0);
    })
}

function Aplicar1(idresult) {
    Didresult = document.getElementById(idresult).value
    document.getElementById("List_Type").selectedIndex = Didresult.split("_A_")[0];
    SeleccionarMarca().then(() => {
        document.getElementById("List_MarcaA").value = Didresult.split("_A_")[1];
        SeleccionarProveedor();
        document.getElementById("List_Gama").value = Didresult.split("_A_")[2];
        SeleccionarGama();
        document.getElementById("List_Modelo").value = Didresult.split("_A_")[3];
        SeleccionarModelo();
    })
}

function Aplicar2(idresult) {
    return localforage.getItem(ArrayCliente[0], function (err, value) {
        DBSearch = JSON.parse(value).sort();
        Register = JSON.parse(sessionStorage.getItem("SearchRegister3"));
        i = document.getElementById(idresult).selectedIndex;
        j = Register[i]
        document.getElementById("Oferta_NCliente").value = ("00000" + parseFloat(DBSearch[j]["Cliente"])).slice(-5)
        document.getElementById("Oferta_CIF").value = DBSearch[j]["C#I#F#"]
        document.getElementById("Oferta_RazónSocial").value = DBSearch[j]["Razón Social"].toUpperCase();
        document.getElementById("Oferta_Dirección").value = DBSearch[j]["Dirección"].toUpperCase();
        document.getElementById("Oferta_CP").value = DBSearch[j]["C#P"] + " - " + DBSearch[j]["Población"].toUpperCase();
        document.getElementById("Oferta_Pais").value = DBSearch[j]["Provincia"].toUpperCase() + " - " + DBSearch[j]["Pais"].toUpperCase();
        document.getElementById("Oferta_Telf").value = DBSearch[j]["Teléfono"];
        document.getElementById("Oferta_Tel2").value = DBSearch[j]["Teléfono"];
        document.getElementById("Oferta_Portes").value = DBSearch[j]["des_coe"];
        document.getElementById("Oferta_Dir1").value = DBSearch[j]["nom_cen1"];
        document.getElementById("Oferta_Dir2").value = DBSearch[j]["dir_cen1"];
        document.getElementById("Oferta_FormaPago").value = DBSearch[j]["nom_fpg"];
        GuardarDatos()
    })
}

function AppereSearch() {
    if (document.getElementById("ModalBuscador").style.display == "none") {
        document.getElementById("ModalBuscador").style.display = "";
        document.getElementById("ModalOpcion").style.display = "none";
    } else {
        document.getElementById("ModalBuscador").style.display = "none";
        document.getElementById("ModalOpcion").style.display = "";
    }
}
