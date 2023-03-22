const List_MarcaA = document.getElementById("List_MarcaA");
const List_MarcaB = document.getElementById("List_MarcaB");
const List_Type = document.getElementById("List_Type");
const List_Gama = document.getElementById("List_Gama");
const List_Modelo = document.getElementById("List_Modelo");
const List_Equiv = document.getElementById("List_Equiv");
var DB
const localforage = require("localforage");

function SeleccionarMarca() {
  return localforage.getItem("RivaCold" + List_Type.value).then(function (value) {
    DB = JSON.parse(value).filter(item => item.Marca != null).sort(function (a) { if (a.Vol) { return -1; } else return +1 })
    List_MarcaA.innerHTML = "";
    List_MarcaB.innerHTML = "";
    DBFilter = DB.map((item) => item.Marca);
    DBDuplicate = DBFilter.filter((item, index) => DBFilter.indexOf(item) == index);
    for (i = 0, len = DBDuplicate.length; i < len; i++) {
      OpcionA = document.createElement("option");
      OpcionA.text = DBDuplicate[i];
      OpcionA.value = DBDuplicate[i];
      List_MarcaA.add(OpcionA);
      OpcionB = document.createElement("option");
      OpcionB.text = DBDuplicate[i];
      OpcionB.value = DBDuplicate[i];
      List_MarcaB.add(OpcionB);
    }
    document.getElementById("RangoPos").value = "+20%";
    document.getElementById("RangoNeg").value = "-10%";
    Table();
    SeleccionarProveedor();
  })
}

function Table() {
  text1 = document.getElementById("tabla_text1")
  text2 = document.getElementById("tabla_text2")
  if (List_Type.value == "Eq") {
    text1.innerText = "Temperatura Ambiente";
    text2.innerText = "Temperatura de Cámara";
  } else if (List_Type.value == "Evap") {
    text1.innerText = "Salto Térmico ΔT";
    text2.innerText = "Temperatura de Cámara";
  } else if (List_Type.value == "Cond") {
    text1.innerText = "Salto Térmico ΔT";
    text2.innerText = "Temperatura Ambiente";
  } else if (List_Type.value == "Central") {
    text1.innerText = "Temperatura Ambiente";
    text2.innerText = "Temperatura de Evaporación";
  }
}

function SeleccionarProveedor() {
  List_Gama.innerHTML = "";
  DBFilter = DB.filter((item) => item.Marca == List_MarcaA.value).map((item) => item.Gama);
  DBDuplicate = DBFilter.filter((item, index) => DBFilter.indexOf(item) == index).sort();
  for (i = 0, len = DBDuplicate.length; i < len; i++) {
    Opcion = document.createElement("option");
    Opcion.text = DBDuplicate[i];
    Opcion.value = DBDuplicate[i];
    List_Gama.add(Opcion);
  }
  SeleccionarGama();
}

function SeleccionarGama() {
  List_Modelo.innerHTML = "";
  DBFilter = DB.filter((item) => item.Marca == List_MarcaA.value).filter((item) => item.Gama == List_Gama.value).map((item) => item.Ref);
  DBDuplicate = DBFilter.filter((item, index) => DBFilter.indexOf(item) == index).sort();
  for (i = 0, len = DBDuplicate.length; i < len; i++) {
    Opcion = document.createElement("option");
    Opcion.text = DBDuplicate[i];
    Opcion.value = DBDuplicate[i];
    List_Modelo.add(Opcion);
  }
  SeleccionarModelo();
}

function SeleccionarModelo() {
  List_Equiv.innerHTML = "";
  DBFilterA = DB.filter(item => item.Ref == List_Modelo.value)
  MarcaAField = Object.getOwnPropertyNames(DBFilterA[0]).sort().reverse();
  DBFilterB = DB.filter(item => item.Marca == List_MarcaB.value)
  MarcaBField = Object.getOwnPropertyNames(DBFilterB[0]).sort().reverse();
  PDiffStorage = 999999, PRefStorage = "", NDiffStorage = -999999, NRefStorage = ""
  for (j = 0, DBFilterBlength = DBFilterB.length; j < DBFilterBlength; j++) {
    if (DBFilterA[0]["Config1"] == DBFilterB[j]["Config1"] || (!DBFilterB[j]["Config1"] && !DBFilterA[0]["Config1"])) {
      if (DBFilterA[0]["Config2"] == DBFilterB[j]["Config2"] || (!DBFilterB[j]["Config2"] && !DBFilterA[0]["Config2"]) || (DBFilterA[0]["Config6"] && DBFilterB[j]["Config2"] == "Silencioso") || (DBFilterA[0]["Config2"] == "Horizontal" && DBFilterB[j]["Config2"] == "Silencioso")) {
        if (DBFilterA[0]["Config3"] == DBFilterB[j]["Config3"] || (!DBFilterB[j]["Config3"] && !DBFilterA[0]["Config3"])) {
          if (DBFilterA[0]["Config4"] == DBFilterB[j]["Config4"] || !DBFilterA[0]["Config4"]) {
            if ((DBFilterA[0]["Config6"]=="Centrifugo" && DBFilterB[j]["Centrifugo"]) || DBFilterA[0]["Config6"] == DBFilterB[j]["Config6"] || DBFilterA[0]["Config6"]!="Centrifugo") {
              if (DBFilterA[0]["Aplicación"] == DBFilterB[j]["Aplicación"] || (!DBFilterB[j]["Aplicación"] && !DBFilterA[0]["Aplicación"]) || (DBFilterA[0]["Aplicación"] == "Dual" && (DBFilterB[j]["Aplicación"] == "MBP" || DBFilterB[j]["Aplicación"] == "LBP")) || (DBFilterB[j]["Aplicación"] == "Dual" && (DBFilterA[0]["Aplicación"] == "MBP" || DBFilterA[0]["Aplicación"] == "LBP"))) {
                if (DBFilterA[0]["Motoventilador_Núm#ventilador"] == DBFilterB[j]["Motoventilador_Núm#ventilador"] || !DBFilterB[j]["Motoventilador_Núm#ventilador"] || !DBFilterA[0]["Motoventilador_Núm#ventilador"]) {
                  Diff = ListadoEquivalencia(DBFilterA[0], DBFilterB, MarcaAField, MarcaBField, j);
                  if (parseFloat(Diff) >= 0) {
                    if (parseFloat(Diff) <= PDiffStorage) {
                      PDiffStorage = parseFloat(Diff)
                      PRefStorage = DBFilterB[j]["Ref"]
                      PStockStorage = DBFilterB[j]["Ficha producto_Stock"] == "Si" ? true : false;
                    }
                  } else {
                    if (parseFloat(Diff) >= NDiffStorage) {
                      NDiffStorage = parseFloat(Diff)
                      NRefStorage = DBFilterB[j]["Ref"]
                      NStockStorage = DBFilterB[j]["Ficha producto_Stock"] == "Si" ? true : false;
                    }
                  }
                  if (parseFloat(document.getElementById("RangoNeg").value) <= parseFloat(Diff) && parseFloat(document.getElementById("RangoPos").value) >= parseFloat(Diff)) {
                    option_modelo = document.createElement("option");
                    DBFilterB[j]["Ficha producto_Stock"] == "Si" ? option_modelo.style.backgroundColor = "lime" : null
                    option_modelo.text = DBFilterB[j]["Ref"] + " " + Diff;
                    List_Equiv.add(option_modelo);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ConfiguracionTexto = ""
  for (j = 1; j < 10; j++) {
    Object.getOwnPropertyNames(DBFilterA[0]).includes("Config" + j) ? DBFilterA[0]["Config" + j] ? ConfiguracionTexto = ConfiguracionTexto + " " + DBFilterA[0]["Config" + j] : null : null;
  }
  ConfiguracionTexto += DBFilterA[0]["Aplicación"] ? "<br>" + "Aplicación: " + DBFilterA[0]["Aplicación"] : ""
  ConfiguracionTexto += DBFilterA[0]["Refrigerante"] ? "<br>" + "Refrigerante: " + DBFilterA[0]["Refrigerante"] : ""
  ConfiguracionTexto += DBFilterA[0]["Ficha producto_Expansión"] ? "<br>" + "Expansión: " + DBFilterA[0]["Ficha producto_Expansión"] : ""
  ConfiguracionTexto += DBFilterA[0]["Desescarche_Tipo"] ? "<br>" + "Desescarche: " + DBFilterA[0]["Desescarche_Tipo"] : ""
  document.getElementById("Table_Type_Body").getElementsByTagName("th")[0].innerHTML = ConfiguracionTexto
  if (List_Equiv.length == 0) {
    if (PRefStorage) {
      PStockStorage ? option_modelo.style.backgroundColor = "lime" : null
      option_modelo = document.createElement("option");
      option_modelo.text = PRefStorage + " " + PDiffStorage + "%";
      List_Equiv.add(option_modelo);
    }
    if (NRefStorage) {
      NStockStorage ? option_modelo.style.backgroundColor = "lime" : null
      option_modelo = document.createElement("option");
      option_modelo.text = NRefStorage + " " + NDiffStorage + "%";
      List_Equiv.add(option_modelo);
    }
  } else if (List_Equiv.length > 8) {
    List_Equiv.size = 8;
    List_Equiv.size = List_Equiv.length;
  }
  if (List_Equiv.length > 1) {
    Ordenar = []
    for (i = 0, len = List_Equiv.length; i < len; i++) {
      Ordenar[i] = []
      Ordenar[i]["Diff"] = parseFloat(List_Equiv[i].text.split(" ")[1])
      Ordenar[i]["text"] = List_Equiv[i].text
      Ordenar[i]["color"] = List_Equiv[i].style.backgroundColor
    }
    Ordenar.sort(function (a, b) { if (a.Diff > b.Diff) { return -1; } })
    for (i = 0, len = List_Equiv.length; i < len; i++) {
      List_Equiv[i].text = Ordenar[i]["text"]
      List_Equiv[i].style.backgroundColor = Ordenar[i]["color"]
    }
  }
  List_Equiv.selectedIndex = 0;
  DatosEquivalencia();
}

function ListadoEquivalencia(DBFilterA, DBFilterB, MarcaAField, MarcaBField, j) {
  PFModelo = 0; PFEq = 0;
  for (k = 0, len = MarcaAField.length; k < len; k++) {
    if (MarcaAField[k].startsWith("PC_") && DBFilterA[MarcaAField[k]]) {
      Tamb = parseFloat(MarcaAField[k].split("_")[1]);
      Tcamara = parseFloat(MarcaAField[k].split("_")[2]);
      Interp = Interpol(Tamb, Tcamara, DBFilterB, MarcaBField, j);
      if (Interp != "-") {
        PFModelo = PFModelo + parseFloat(DBFilterA[MarcaAField[k]]);
        PFEq = PFEq + parseFloat(Interp);
      }
    }
  }
  return ((PFEq / PFModelo - 1) * 100).toFixed(2) + "%";
}

const Tabla_PF_tbody = document.getElementById("Table_PF").getElementsByTagName("tbody")
const Tabla_Price_tbody = document.getElementById("Table_Price").getElementsByTagName("tbody")
function DatosEquivalencia() {
  Tabla_PF_tbody[0].innerHTML = ""
  Tabla_Price_tbody[0].innerHTML = ""
  DBFilterA = DB.filter(item => item.Ref == List_Modelo.value)
  MarcaAField = Object.getOwnPropertyNames(DBFilterA[0]).sort(function (a, b) {
    if (a.split("_")[0] == "PC") {
      if (parseFloat(a.split("_")[1] > parseFloat(b.split("_")[1]))) {
        return -1;
      }
      else if (parseFloat(a.split("_")[1] == parseFloat(b.split("_")[1]))) {
        if (parseFloat(a.split("_")[2] <= parseFloat(b.split("_")[2]))) { return -1; }
        else { return 1; }
      }
      else {
        return 1;
      }
    } else { return -1; }
  })
  DBFilterB = DB.filter(item => item.Ref == List_Equiv.value.split(" ")[0])
  if (DBFilterB.length) {
    MarcaBField = Object.getOwnPropertyNames(DBFilterB[0]).sort().reverse();
    MarcaAPrecio = DBFilterA[0]["Precio"] ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(parseFloat(DBFilterA[0]["Precio"])) : "No disponible";
    MarcaBPrecio = DBFilterB[0]["Precio"] ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(parseFloat(DBFilterB[0]["Precio"])) : "No disponible";
    Tabla_Price_tbody[0].insertRow().innerHTML = "<th scope='row'>" + MarcaAPrecio + "</th><td>" + MarcaBPrecio + "</td>";
    for (k = 0, MarcaAFieldlength = MarcaAField.length; k < MarcaAFieldlength; k++) {
      if (MarcaAField[k].startsWith("PC_") && DBFilterA[0][MarcaAField[k]]) {
        PFModelo = parseFloat(DBFilterA[0][MarcaAField[k]]).toFixed(0) + " W";
        Tamb = parseFloat(MarcaAField[k].split("_")[1]);
        Tcamara = parseFloat(MarcaAField[k].split("_")[2]);
        PFEq = Interpol(Tamb, Tcamara, DBFilterB, MarcaBField, 0);
        Tamb = MarcaAField[k].split("_")[1];
        Tcamara = MarcaAField[k].split("_")[2];
        Diff = ((parseFloat(PFEq) / parseFloat(PFModelo) - 1) * 100).toFixed(2) + " %";
        (PFEq != "-" && Tamb != "25°C" && Tamb != "20°C") || document.getElementById("BotonMostrarPF").checked ? document.getElementById("Table_PF").getElementsByTagName("tbody")[0].insertRow().innerHTML = "<th>" + Tamb + "</th><th>" + Tcamara + "</th><th>" + PFModelo + "</th><th>" + PFEq + "</th><th>" + Diff + "</th>" : null;
      }
    }
  }
  ArrayTable = []
  Tabla_PF_tbody_tr = Tabla_PF_tbody[0].getElementsByTagName("tr")
  for (i = 0, len = Tabla_PF_tbody_tr.length; i < len; i++) {
    ArrayTable[i] = []
    ArrayTable[i]["Tamb"] = Tabla_PF_tbody_tr[i].getElementsByTagName("th")[0].textContent
    ArrayTable[i]["Tcamara"] = Tabla_PF_tbody_tr[i].getElementsByTagName("th")[1].textContent
    ArrayTable[i]["HTML"] = Tabla_PF_tbody_tr[i].innerHTML
  }
  ArrayTable.sort(function (a, b) { if (a.Tamb > b.Tamb) { return -1 } else if (a.Tamb == b.Tamb) { if (parseFloat(a.Tcamara) > parseFloat(b.Tcamara)) { return 1 } else { return -1 } } else { return 1 } })

  for (i = 0, len = Tabla_PF_tbody_tr.length; i < len; i++) {
    Tabla_PF_tbody_tr[i].innerHTML = ArrayTable[i]["HTML"]
  }
}


function RangoEq(Direccion, Rango) {
  ValueRango = parseFloat(document.getElementById(Rango).value);
  Simbolo = ValueRango + Direccion > 0 ? "+" : null;
  document.getElementById(Rango).value = Simbolo + parseFloat(ValueRango + Direccion) + "%";
  SeleccionarModelo();
}

SeleccionarMarca();
