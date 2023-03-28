var RivaColdDB
const List_Type = document.getElementById("list_type");
const List_Marca = document.getElementById("list_marca");
const List_Gama = document.getElementById("list_gama");
const List_Modelo = document.getElementById("list_modelo");
const localforage = require("localforage");

function SeleccionarGama() {
  return localforage.getItem("RivaCold" + List_Type.value, function (err, value) {
    RivaColdDB = JSON.parse(value).sort(function (a) { if (a.Vol) { return -1; } else { return 1 } })
    DBFilter = RivaColdDB.map((item) => item.Marca);
    DBDuplicate = DBFilter.filter((item, index) => DBFilter.indexOf(item) === index);
    List_Marca.innerHTML = "";
    for (i = 0, ilen = DBDuplicate.length; i < ilen; i++) {
      if (DBDuplicate[i] != null) {
        Opcion = document.createElement("option");
        Opcion.text = DBDuplicate[i];
        List_Marca.add(Opcion);
      }
    }
    SeleccionarMarca();
  })
}
function SeleccionarMarca() {
  DBFilter = RivaColdDB.filter((item) => item.Marca == List_Marca.value).map((item) => item.Gama);
  DBDuplicate = DBFilter.filter((item, index) => DBFilter.indexOf(item) === index).sort()
  List_Gama.innerHTML = "";
  for (i = 0, ilen = DBDuplicate.length; i < ilen; i++) {
    Opcion = document.createElement("option");
    Opcion.text = DBDuplicate[i]
    List_Gama.add(Opcion);
  }
  SeleccionarModelo();
}

function SeleccionarModelo() {
  DBFilter = RivaColdDB.filter((item) => item.Marca == List_Marca.value).filter((item) => item.Gama == List_Gama.value).map((item) => item.Ref);
  DBDuplicate = DBFilter.filter((item, index) => DBFilter.indexOf(item) === index).sort()
  List_Modelo.innerHTML = "";
  for (i = 0, ilen = DBDuplicate.length; i < ilen; i++) {
    Opcion = document.createElement("option");
    Opcion.text = DBDuplicate[i];
    List_Modelo.add(Opcion);
  }
  FichaTecnica();
}

const http = "https://select1.rivacold.com/media/immagini/"
const Ignore = ["Foto", "Foto2", "Foto_Esquema1", "Foto_Esquema2", "Foto_Esquema3", "SSMA_TimeStamp", "Serie", "Ficha producto_Stock", "Vol"]
function FichaTecnica() {
  ClearTable("table_PC", 0);
  ClearTable("table_FT", 0);
  document.getElementById("Div_Table_FT").innerHTML = ""
  CountPF = 0
  RegPF = []
  RivaColdDBF = RivaColdDB.filter(item => item.Ref == List_Modelo.value)
  RivaColdField = Object.getOwnPropertyNames(RivaColdDB[0])
    .sort(function (a, b) {
      if (parseFloat(a.split("_")[1]) > parseFloat(b.split("_")[1])) { return +1; } else if (parseFloat(a.split("_")[1]) < parseFloat(b.split("_")[1])) { return -1; } else {
        if (parseFloat(a.split("_")[2]) > parseFloat(b.split("_")[2])) { return +1; }
      }
    });
  document.getElementById("imagenmodelo").src = RivaColdDBF[0]["Foto2"] ? http + RivaColdDBF[0]["Foto2"] : RivaColdDBF[0]["Foto"] ? "../../resources/Gama/" + RivaColdDBF[0]["Foto"] + ".jpg" : ""
  document.getElementById("imagenEsquema1").src = RivaColdDBF[0]["Foto_Esquema1"] ? http + RivaColdDBF[0]["Foto_Esquema1"] : ""
  document.getElementById("imagenEsquema2").src = RivaColdDBF[0]["Foto_Esquema2"] ? http + RivaColdDBF[0]["Foto_Esquema2"] : ""
  document.getElementById("imagenEsquema3").src = RivaColdDBF[0]["Foto_Esquema3"] ? http + RivaColdDBF[0]["Foto_Esquema3"] : ""
  Placelabel = []
  for (j = 0, jlen = RivaColdField.length; j < jlen; j++) {
    if (RivaColdDBF[0][RivaColdField[j]] && !Ignore.includes(RivaColdField[j])) {
      if (RivaColdField[j].startsWith("PC_")) {
        RegPF[CountPF] = j;
        CountPF += 1;
      } else {
        Propiedad = RivaColdField[j].split("_")
        if (Propiedad[1]) {
          if (!Placelabel.includes(Propiedad[0])) {
            document.getElementById("Div_Table_FT").insertAdjacentHTML("beforeend", '<table class="table table-striped" id="table_FT_' + Propiedad[0] + '"><thead><tr><th colspan="2">' + Propiedad[0] + '</th></tr></thead><tbody/></table>')
            Placelabel.push(Propiedad[0])
          }
          document.getElementById("table_FT_" + Propiedad[0]).getElementsByTagName("tbody")[0].insertRow().innerHTML = "<th class='TagTipo'>" + Propiedad[1] + "</th><td>" + RivaColdDBF[0][RivaColdField[j]] + "</td>"
        } else {
          document.getElementById("table_FT").getElementsByTagName("tbody")[0].insertRow().innerHTML = "<th class='TagTipo'>" + RivaColdField[j] + "</th><td>" + RivaColdDBF[0][RivaColdField[j]] + "</td>";
        }
      }
    }
  }
  document.getElementById("table_PC").getElementsByTagName("thead")[0].insertRow().innerHTML = document.getElementById("list_type").value == "Evap" || document.getElementById("list_type").value == "Cond" ? "<th scope='col'>dT\\Tc</th>" : document.getElementById("list_type").value == "Central" ? "<th scope='col'>Tamb\\Tevap</th>" : "<th scope='col'>Tamb\\Tc</th>"
  RegTc = [], CountRegTc = 0, RegTamb = [], CountRegTamb = 0;
  for (j = 0; j < CountPF; j++) {
    if (!RegTc.includes(parseFloat(RivaColdField[RegPF[j]].split("_")[2]))) {
      RegTc[CountRegTc] = parseFloat(RivaColdField[RegPF[j]].split("_")[2])
      CountRegTc += 1;
    }
    if (!RegTamb.includes(parseFloat(RivaColdField[RegPF[j]].split("_")[1]))) {
      RegTamb[CountRegTamb] = parseFloat(RivaColdField[RegPF[j]].split("_")[1])
      CountRegTamb += 1;
    }
  }
  RegTc.sort(function (a, b) { if (parseFloat(a) >= parseFloat(b)) { return 1; } else { return -1 } })
  RegTamb.sort(function (a, b) { if (parseFloat(a) >= parseFloat(b)) { return 1; } else { return -1 } })
  for (j = 0, jlen = RegTc.length; j < jlen; j++) {
    document.getElementById("table_PC").getElementsByTagName("tr")[0].insertAdjacentHTML("beforeend", "<th scope='col'>" + parseFloat(RegTc[j]) + " °C</th>");
  } for (j = 0, jlen = RegTamb.length; j < jlen; j++) {
    TempAmb = document.getElementById("list_type").value == "Evap" || document.getElementById("list_type").value == "Cond" ? " K" : " °C"
    document.getElementById("table_PC").getElementsByTagName("tbody")[0].insertRow().innerHTML = "<th>" + RegTamb[j] + TempAmb + "</th>";
  }

  for (col = 0; col < CountRegTc; col++) {
    for (row = 0; row < CountRegTamb; row++) {
      done = true
      for (j = 0, jlen = RivaColdField.length; j < jlen; j++) {
        if (parseFloat(RivaColdField[j].split("_")[1]) == parseFloat(RegTamb[row]) && parseFloat(RivaColdField[j].split("_")[2]) == parseFloat(RegTc[col])) {
          if (RivaColdDBF[0][RivaColdField[j]]) {
            document.getElementById("table_PC").getElementsByTagName("tr")[row + 1].insertAdjacentHTML("beforeend", "<th>" + parseFloat(RivaColdDBF[0][RivaColdField[j]]).toFixed(0) + "W</th>");
            done = false
          }
        }
      }
      done ? document.getElementById("table_PC").getElementsByTagName("tr")[row + 1].insertAdjacentHTML("beforeend", "<th>-</th>") : null
    }
  }
}

function ClearTable(id, n) {
  for (i = n, ilen = document.getElementById(id).rows.length; i < ilen; i++) {
    document.getElementById(id).deleteRow(n);
  }
}

SeleccionarGama();
