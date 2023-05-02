var RivaColdDB
var Table = JSON.parse(localStorage.getItem("TableOferta"));
var Reference = JSON.parse(localStorage.getItem("TextoModelo"));
var Cabecera = JSON.parse(localStorage.getItem("DatosOferta"));

const list_gama = document.getElementById("list_Gama");
const list_type = document.getElementById("list_type");
const list_modelo = document.getElementById("list_modelo");


function Display_Tabla(Table, j) {
  dTable = document.getElementById(Table)
  len = dTable.getElementsByTagName("textarea").length;
  if (dTable.getElementsByTagName("th")[j].style.display == "none") {
    dTable.getElementsByTagName("th")[j].style.display = "";
    for (k = 0; k < len; k++) {
      dTable.getElementsByTagName("td")[j + 7 * k].style.display = "";
    }
  } else {
    dTable.getElementsByTagName("th")[j].style.display = "none";
    for (k = 0; k < len; k++) {
      dTable.getElementsByTagName("td")[j + 7 * k].style.display = "none";
    }
  }
}

Display_DescuentoPP()
function Display_DescuentoPP() {
  document.getElementById("DescuentoPPC").style.display = document.getElementById("DescuentoPPC").style.display == "none" ? "" : "none"
  document.getElementById("tdDescuentoPP").style.display = document.getElementById("tdDescuentoPP").style.display == "none" ? "" : "none"
}
function Display_Portes() {
  document.getElementById("Coste_Portes").style.display = document.getElementById("Coste_Portes").style.display == "none" ? "" : "none"
  document.getElementById("label_Portes").style.display = document.getElementById("label_Portes").style.display == "none" ? "" : "none"
}

function Display_Impuesto() {
  if (document.getElementById("Table_Impuesto").style.display == "none") {
    document.getElementById("Table_Impuesto").style.display = "";
    document.getElementById("PrecioTotalIva").style.display = "";
    document.getElementById("LineaDivisionImpuesto").style.visibility = "";
    document.getElementById("button_DescuentoPP").style.display = ""
    document.getElementById("button_IGIC").style.display = ""
  } else {
    document.getElementById("Table_Impuesto").style.display = "none";
    document.getElementById("PrecioTotalIva").style.display = "none";
    document.getElementById("LineaDivisionImpuesto").style.visibility = "hidden";
    document.getElementById("button_DescuentoPP").style.display = "none"
    document.getElementById("button_IGIC").style.display = "none"
  }
}

function DisableInput(idcheck, iddisable) {
  document.getElementById(iddisable).disabled = document.getElementById(idcheck).checked ? true : false
}

function SeleccionarModelo() {
  localforage.getItem("RivaCold" + list_type.value, function (err, value) {
    RivaColdDB = JSON.parse(value).sort(function (a) { if (a.Volumen) { return -1; } else { return +1 } })
    list_type.value == "Tarifa0000" ? DBFilter = RivaColdDB.map((item) => item.Gama) : DBFilter = RivaColdDB.filter(item => item.Marca == "RivaCold").map((item) => item.Gama);
    DBDuplicate = DBFilter.filter((item, index) => DBFilter.indexOf(item) === index).sort();
    list_gama.innerHTML = "";
    for (i in DBDuplicate) {
      option_gama = document.createElement("option");
      option_gama.text = DBDuplicate[i];
      list_gama.add(option_gama);
    }
    SeleccionarGama();
  })
}

function SeleccionarGama() {
  list_modelo.innerHTML = "";
  const DBFilter = RivaColdDB.filter(item => item.Gama == list_gama.value).map((item) => item.Ref);
  const DBDuplicate = DBFilter.filter((item, index) => DBFilter.indexOf(item) === index).sort();
  for (i = 0, len = DBDuplicate.length; i < len; i++) {
    option_modelo = document.createElement("option");
    option_modelo.text = DBDuplicate[i];
    list_modelo.add(option_modelo);
  }
  SeleccionarProducto();
}

function SeleccionarProducto() {
  document.getElementById("Precio").value = "";
  document.getElementById("Cantidad").value = 1;
  document.getElementById("PrecioNeto").value = "";
  document.getElementById("RefModelo").value = list_modelo.value;
  DBFilter = RivaColdDB.filter(item => item.Ref == list_modelo.value)
  for (i = 0, len = DBFilter.length; i < len; i++) {
    document.getElementById("Precio").value = list_type.value == "Tarifa0000" ? DBFilter[0]["Precio Venta"] : DBFilter[0]["Precio"]
    document.getElementById("textoModelo").innerHTML = list_type.value === "Tarifa0000" && DBFilter[0]["Observación"] ? DBFilter[0]["Descripción"] + "\n" + DBFilter[0]["Observación"] : DBFilter[0]["Descripción"]
  }
  CalculoPrecio();
}

const Ddto1 = document.getElementById("dto1")
const Ddto2 = document.getElementById("dto2")
const Ddto3 = document.getElementById("dto3")
const DdtoF = document.getElementById("dto.Final")
const DPrecio = document.getElementById("Precio")

function CalculoDescuento() {
  Ddto1.value = PerCent1(Ddto1.value, 2)
  Ddto2.value = PerCent1(Ddto2.value, 2)
  Ddto3.value = PerCent1(Ddto3.value, 2)
  DdtoF.value = PerCent1((1 - (1 - Ddto1.value) * (1 - Ddto2.value) * (1 - Ddto3.value)), 2)
  parseFloat(DdtoF.value) > 100 || parseFloat(DdtoF.value) < 0 ? DdtoF.value = PerCent2(100, 2) : DdtoF.value = PerCent2(0, 2)
  CalculoPrecio();
}

function IGIC() {
  document.getElementById("Placelabel_IVA").innerHTML = document.getElementById("Placelabel_IVA").innerHTML == "IGIC" ? "IVA" : "IGIC"
  document.getElementById("IVA").value = document.getElementById("Placelabel_IVA").innerHTML == "IGIC" ? PerCent2(7, 2) : PerCent2(21, 2)
  GuardarDatos()
  ModifTable()
}

const dCantidad = document.getElementById("Cantidad")
const dPrecioNeto = document.getElementById("PrecioNeto")

function CalculoPrecio() {
  if (isNaN(parseFloat(DPrecio.value))) {
    DPrecio.value = "";
  } else {
    DPrecio.value = parseFloat(DPrecio.value).toFixed(2) + " €";
    Precio = parseFloat(DPrecio.value);
    dPrecioNeto.value = (Precio * (1 - parseFloat(DdtoF.value) / 100)).toFixed(2) + " €";
    !isNaN(parseFloat(dCantidad.value)) ? document.getElementById("PrecioNetoTotal").value = (parseFloat(dPrecioNeto.value) * parseFloat(dCantidad.value)).toFixed(2) + " €" : null
  }
}
const Table_Detalle = document.getElementById("Table_Detalle")
const Table_Detalle_tbody = Table_Detalle.getElementsByTagName("tbody")[0]
const Table_Detalle_tbody_th = Table_Detalle_tbody.getElementsByTagName("th")
const Table_Detalle_th = Table_Detalle.getElementsByTagName("th")
const Table_Detalle_td = Table_Detalle.getElementsByTagName("td")
const Table_Detalle_input = Table_Detalle.getElementsByTagName("input")
const Table_Detalle_textarea = Table_Detalle.getElementsByTagName("textarea")

function RegistrarModelo() {
  if (Table == null) { Table = [[]]; Reference = []; }
  j = parseFloat(Table_Detalle_tbody_th.length);
  Table[j] = [
    document.getElementById("RefModelo").value,
    document.getElementById("Cantidad").value,
    document.getElementById("Precio").value,
    document.getElementById("dto.Final").value,
    document.getElementById("PrecioNeto").value,
    document.getElementById("PrecioNetoTotal").value,
  ];
  Reference[j] = document.getElementById("textoModelo").value;
  localStorage.setItem("TableOferta", JSON.stringify(Table));
  localStorage.setItem("TextoModelo", JSON.stringify(Reference));
  PushDB();
}
const dDescuentoPP = document.getElementById("DescuentoPP")
const dIVA = document.getElementById("IVA")
const dCoste_Portes = document.getElementById("Coste_Portes")
const dBaseImponible = document.getElementById("BaseImponible")
const dImpuestoIVA = document.getElementById("ImpuestoIVA")
const dTotalOfertaIVA = document.getElementById("TotalOfertaIVA")

function PushDB() {
  ClearTable();
  let TotalOfertaPrecio = 0;
  let itemCount = "001";
  for (i = 0, Tablelen = Table.length; i < Tablelen; i++) {
    if (Table[i][0]) {
      item = itemCount;
      itemCount = ("000" + (parseFloat(itemCount) + 1)).slice(-3);
    } else {
      item = ""; Table[i] = ""
    }
    Table_Detalle_tbody.insertRow().innerHTML = "<th>" + item + "</th><td><input></td><td><textarea></textarea></td><td><input style='text-align:center'></td><td><input style='text-align:center'></td><td><input style='text-align:center'></td><td><input style='text-align:center'></td><td><input style='text-align:center'></td>";
    Table_Detalle_th[i + 8].insertAdjacentHTML("beforeend", `<button><i class='bi bi-x-octagon'style='color:red;font-size:15px;vertical-align:bottom' onclick='BorrarLinea(${i})'></i></button>`);
    if (i) {
      document.getElementById("Table_Detalle").getElementsByTagName("td")[7 * i + 1].insertAdjacentHTML(
        "beforeend", `<button><i class='bi bi-arrow-up-square'style='color: green;font-size:15px;margin-right:10px' onclick='MoveItem(${i},+1)'/></button>`);
    }
    for (j = 0; j < 6; j++) {
      Table_Detalle_input[j + 6 * i].value = Table[i][j]
    }
    if (!isNaN(parseFloat(Table[i][5]))) {
      TotalOfertaPrecio += parseFloat(Table[i][5])
    }
    Table_Detalle_textarea[i].innerHTML = Reference[i];
    Table_Detalle_textarea[i].rows = 0;
    Table_Detalle_textarea[i].rows = parseFloat(document.getElementById("Table_Detalle").getElementsByTagName("textarea")[i].textContent.split("\n").length + 1
    );
    Table[i][0] ? CheckStock(i) : null
  }
  !dDescuentoPP.value ? dDescuentoPP.value = PerCent2(0, 2) : null
  !dIVA.value ? dIVA.value = PerCent2(21, 2) : null

  if (parseFloat(dCoste_Portes.value) > 0) {
    dCoste_Portes.value = parseFloat(dCoste_Portes.value).toFixed(2) + " €"
    TotalOfertaPrecio += parseFloat(document.getElementById("Coste_Portes").value)
    document.getElementById("Coste_Portes").style.display = ""
    document.getElementById("label_Portes").style.display = ""
  } else {
    dCoste_Portes.value = "0 €"
    document.getElementById("Coste_Portes").style.display = "none"
    document.getElementById("label_Portes").style.display = "none"
  }
  dDescuentoPP.value = parseFloat(dDescuentoPP.value).toFixed(2) + "%";
  dIVA.value = parseFloat(dIVA.value).toFixed(0) + "%";
  document.getElementById("TotalOferta").textContent = TotalOfertaPrecio.toFixed(2) + " €";
  dBaseImponible.textContent = (TotalOfertaPrecio * (1 - parseFloat(dDescuentoPP.value) / 100)).toFixed(2) + " €";
  dImpuestoIVA.textContent = (parseFloat(dBaseImponible.textContent) * (parseFloat(dIVA.value) / 100)).toFixed(2) + " €";
  dTotalOfertaIVA.textContent = (parseFloat(dBaseImponible.textContent) * (1 + parseFloat(dIVA.value) / 100)).toFixed(2) + " €";
  Display_Tabla('Table_Detalle', 4)
  Display_Tabla('Table_Detalle', 4)
  Display_Tabla('Table_Detalle', 5)
  Display_Tabla('Table_Detalle', 5)
}

function CheckStock(i) {
  Stock = 0
  DBTarifaFilter = DBTarifa.filter(function (event) {
    if (event.Ref == null) { return }
    return event.Ref.indexOf(Table_Detalle_input[6 * i].value) > -1
  })
  for (j = 0, lenDBTarifaFilter = DBTarifaFilter.length; j < lenDBTarifaFilter; j++) {
    DBStockFilter = DBStock.filter((item) => item.Cod == DBTarifaFilter[j]["Ref2"])
    for (k = 0, lenDBStockFilter = DBStockFilter.length; k < lenDBStockFilter; k++) {
      Stock = Stock + parseFloat(DBStockFilter[k]["Stock"])
    }
  }
  if (Stock > 0) {
    Table_Detalle_td[7 * i + 1].insertAdjacentHTML("beforeend", `<i class="bi bi-cart-check" style="color: green;font-size:15px">${Stock}u</i>`);
  } else {
    Plazo = ""
    for (k = 0, len = DBGama.length; k < len; k++) {
      document.getElementById("Table_Detalle").getElementsByTagName("input")[6 * i].value.startsWith(DBGama[k]["Gama"]) ? Plazo = DBGama[k]["Plazo_Entrega"] + "S" : null
    }
    Plazo ? Table_Detalle_td[7 * i + 1].insertAdjacentHTML("beforeend", `<i class="bi bi-cart-x" style="color: red;font-size:15px">${Plazo}</i>`) : null
  }
}

function ClearDB() {
  ClearTable();
  localStorage.removeItem("TableOferta");
  localStorage.removeItem("TextoModelo");
  localStorage.removeItem("DatosOferta");
  Table = []
  Reference = []
  Cabecera = []
  DatosCabecera();
  Initialización()
  GuardarDatos()
  ModifTable();
  OF()
}

function Initialización() {
  date = new Date();
  Today = ("00" + date.getDate()).slice(-2) + "/" + ("00" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
  ValidDay = ("00" + date.getDate(date.setDate(date.getDate() + 30))).slice(-2) + "/" + ("00" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
  document.getElementById("FechaActual").value = Today;
  document.getElementById("FechaValidez").value = ValidDay;
  document.getElementById("Oferta_Situacion").value = "Pendiente";
  document.getElementById("Oferta_Embalaje").value = "Tipo estándar incluido";
  document.getElementById("Oferta_FormaPago").value = "La habitual";
  document.getElementById("Oferta_PlazoEntrega").value = "A confirmar";
}

function OF() {
  NOfertaCheck = 0;
  for (n = 1; n < 1000; n++) {
    for (i = 0, len = Registro.length; i < len; i++) {
      if (Registro[i]["NOferta"] == "OF_" + os.userInfo().username.toUpperCase().slice(-3) + "_" + ("0000" + n).slice(-4)) {
        NOfertaCheck = 1;
        break;
      }
    }
    if (NOfertaCheck == 0) {
      document.getElementById("Oferta_NumOferta").value = "OF_" + os.userInfo().username.toUpperCase().slice(0, 3) + "_" + ("0000" + n).slice(-4);
      document.getElementById("Oferta_Solicitado").value = os.userInfo().username.toUpperCase().slice(0, 3)
      break;
    }
    NOfertaCheck = 0;
  }
}

function ClearTable() { for (i = 2, len = Table_Detalle.rows.length; i < len; i++) { Table_Detalle.deleteRow(2) } }

function ModifTable() {
  if (Table_Detalle.rows.length > 2 && Table) {
    for (i = 0; i < Table.length; i++) {
      for (j = 0; j < 6; j++) {
        Table[i][j] = Table_Detalle_input[j + 6 * i].value;
      }
      Table[i][1] = Table[i][1] ? parseFloat(Table[i][1]) : null;
      Table[i][2] = Table[i][2] ? parseFloat(Table[i][2]).toFixed(2) + "€" : null;
      Table[i][3] = Table[i][3] ? parseFloat(Table[i][3]).toFixed(2) + "%" : null;
      Table[i][4] = Table[i][4] ? (parseFloat(Table[i][2]) * (1 - parseFloat(Table[i][3]) / 100)).toFixed(2) + "€" : null;
      Table[i][5] = Table[i][5] ? (parseFloat(Table[i][4]) * parseFloat(Table[i][1])).toFixed(2) + "€" : null;
      Reference[i] = Table_Detalle_textarea[i].value;
    }
  }
  localStorage.setItem("TableOferta", JSON.stringify(Table));
  localStorage.setItem("TextoModelo", JSON.stringify(Reference));
  PushDB();
}

function AñadirComplemento() {
  document.getElementById("ComplementoModelo").insertAdjacentHTML("afterbegin", "<div class='row' id='RowComplemento'><div class='col-6'><input type='text' class='form-control' placeholder='Complemento'/></div><div class='col-6'><input onchange='ModifComplemento()' type='text' class='form-control' placeholder='Precio (€ o %)'></div></div>");
  ModifComplemento();
}

function CondicionEntrega() {
  document.getElementById("Oferta_PlazoEntrega").value = document.getElementById("EntregaInmediata").checked ? "Entrega Inmediata" : document.getElementById("PlazoEntrega").value
  document.getElementById("Oferta_Portes").value = document.getElementById("list_Portes").value;
  document.getElementById("Oferta_Embalaje").value = document.getElementById("list_Embalaje").value;
  document.getElementById("Oferta_FormaPago").value = document.getElementById("list_FormadePago").value;
  document.getElementById("Oferta_Dir1").innerHTML = document.getElementById("list_DireccionEnvio").value;
  DatosCabecera()
  GuardarDatos()
}

function BorrarLinea(n) {
  Table.splice(n, 1);
  Reference.splice(n, 1);
  localStorage.setItem("TableOferta", JSON.stringify(Table));
  localStorage.setItem("TextoModelo", JSON.stringify(Reference));
  PushDB();
}

function MoveItem(n, dir) {
  TempArray = [];
  for (j = 0; j < 6; j++) {
    TempArray[j] = Table[n][j];
    Table[n][j] = Table[n - dir][j];
    Table[n - dir][j] = TempArray[j];
  }
  TempArray[0] = Reference[n];
  Reference[n] = Reference[n - dir];
  Reference[n - dir] = TempArray[0];
  localStorage.setItem("TableOferta", JSON.stringify(Table));
  localStorage.setItem("TextoModelo", JSON.stringify(Reference));
  PushDB();
}
const Campo = [
  "Oferta_NumOferta", "Oferta_CIF", "Oferta_NCliente", "Oferta_RazónSocial", "Oferta_Dirección", "Oferta_CP", "Oferta_Pais", "Oferta_Telf", "Oferta_Fax", "Oferta_Email", "Oferta_Solicitante", "Oferta_Situacion", "Oferta_Solicitud", "Oferta_Referencia", "Oferta_Referencia2", "Oferta_Referencia3", "Oferta_Solicitado", "Oferta_PlazoEntrega", "Oferta_Portes", "Oferta_Embalaje", "Oferta_FormaPago", "Oferta_Observacion", "Oferta_Dir1", "Oferta_Dir2", "Oferta_Dir3", "Oferta_Tel2", "Oferta_Fax2", "DescuentoPP", "IVA", "FechaActual", "FechaValidez", "Coste_Portes",
];

function DatosCabecera() {
  if (Cabecera) {
    for (i = 0, Campolen = Campo.length; i < Campolen; i++) {
      document.getElementById([Campo[i]]).value = Cabecera[i] ? Cabecera[i] : null;
    }
  }
  else {
    for (i = 0, Campolen = Campo.length; i < Campolen; i++) {
      document.getElementById([Campo[i]]).value = null;
    }
  }
}

function GuardarDatos() {
  Cabecera = [];
  for (i = 0; i < Campo.length; i++) {
    Cabecera[i] = document.getElementById([Campo[i]]).value.replace(";", "");
  }
  localStorage.setItem("DatosOferta", JSON.stringify(Cabecera));
}

function AltaTexto() {
  j = parseFloat(Table_Detalle_tbody_th.length);
  Table[j] = ["", "", "", "", "", ""];
  Reference[j] = "";
  localStorage.setItem("TableOferta", JSON.stringify(Table));
  localStorage.setItem("TextoModelo", JSON.stringify(Reference));
  PushDB();
}

const table_registro_oferta_tbody = document.getElementById("table_registro_oferta").getElementsByTagName("tbody")[0]
const table_registro_oferta_td = document.getElementById("table_registro_oferta").getElementsByTagName("td")
function RegistroOferta() {
  table_registro_oferta_tbody.innerHTML = "";
  const Count = 5;
  let j = -1;
  if (Registro.length > 1) {
    for (i = 0; i < Registro.length; i++) {
      if (i == 0 || Registro[i - 1]["NOferta"] != Registro[i]["NOferta"]) {
        table_registro_oferta_tbody.insertRow().innerHTML = "<td scope='row'/><td/><td/><td/><td style='text-align:center'/>";
        j += 1;
        table_registro_oferta_td[j * Count + 0].innerText = j + 1;
        table_registro_oferta_td[j * Count + 1].innerText = Registro[i]["Cabecera"].split(";")[0];
        table_registro_oferta_td[j * Count + 2].innerText = Registro[i]["Cabecera"].split(";")[13];
        table_registro_oferta_td[j * Count + 3].innerText = Registro[i]["Cabecera"].split(";")[3];
        // table_registro_oferta_td[j * Count + 4].insertAdjacentHTML("beforeend", "<button><i class='bi bi-clipboard-plus'style='color:green;font-size:15px;' onclick='AccederRegistro(" + JSON.stringify(Registro[i]["Cabecera"].split(";")[0]) + ")'></i></button><label style='width:30%'></label><button><i class='bi bi-backspace'style='color:red;font-size:15px' onclick='BorrarRegistro(" + JSON.stringify(Registro[i]["Cabecera"].split(";")[0]) + ")'></i></button>"
        table_registro_oferta_td[j * Count + 4].insertAdjacentHTML("beforeend", "<button><i class='bi bi-clipboard-plus'style='color:green;font-size:15px;' onclick='AccederRegistro(" + JSON.stringify(Registro[i]["Cabecera"].split(";")[0]) + ")' data-bs-dismiss='modal'/></button>"
        );
      }
    }
  }
}

function BorrarRegistro(j) {
  if (document.getElementById("AzureSQL").checked) {
    const { Connection, Request, TYPES } = require("tedious");
    const config = {
      authentication: {
        options: { userName: "gestorbcloud", password: "BCSYSTEMS&bccloud08918" },
        type: "default",
      },
      server: "bccloud.database.windows.net",
      options: { database: "bccloud", encrypt: true },
    };
    var connection = new Connection(config);
    connection.on("connect", function () {
      requestDelete = new Request(
        "DELETE FROM dbo.RegOferta WHERE NOferta = @Cabecera",
        (err) => { if (err) { throw err; } }
      );
      requestDelete.addParameter("Cabecera", TYPES.VarChar, j)
      requestDelete.on("requestCompleted", function () {
        SQL(TypeDB())
      });
      connection.execSql(requestDelete);
    });
    connection.connect();
  } else if (document.getElementById("Servidor").checked) {
    const oledb = require("node-adodb");
    oledb.PATH = "./resources/adodb.js";
    var connection = oledb.open(
      "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=\\\\call-bc\\Carpetas Publicas\\TECNIC\\RivaColdSelect\\RivaColdSelect.accdb;", process.arch.includes("64"));
    connection.execute('DELETE FROM RegOferta WHERE NOferta="' + j + '"');
  } else if (document.getElementById("Local").checked) {
    Directorio = __dirname.replace("\\app.asar", "");
    var connection = oledb.open("Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + Directorio + "\\BaseDatos\\RivaColdSelect.accdb;", process.arch.includes("64"));
    connection.execute('DELETE FROM RegOferta WHERE NOferta="' + j + '"');
  }
}

function AccederRegistro(NOferta) {
  for (i = 0; i < Registro.length; i++) {
    if (Registro[i]["NOferta"] == NOferta) {
      for (n = 0; n < Campo.length; n++) {
        document.getElementById([Campo[n]]).value =
          Registro[i]["Cabecera"].split(";")[n];
      }
    }
  }
  var Count = 0;
  Table = [];
  Reference = [];
  for (i = 0; i < Registro.length; i++) {
    if (Registro[i]["NOferta"] == NOferta) {
      Table[Count] = [];
      for (j = 0; j < 6; j++) {
        Table[Count][j] = Registro[i]["Oferta"].split(";")[j];
      }
      Reference[Count] = Registro[i]["Oferta"].split(";")[6];
      Count += 1;
    }
  }
  localStorage.setItem("TableOferta", JSON.stringify(Table));
  localStorage.setItem("TextoModelo", JSON.stringify(Reference));
  PushDB();
  GuardarDatos();
}

function GuardarRegistro() {
  if (document.getElementById("AzureSQL").checked) {
    const { Connection, Request, TYPES } = require("tedious");
    const config = {
      authentication: {
        options: { userName: "gestorbcloud", password: "BCSYSTEMS&bccloud08918" },
        type: "default",
      },
      server: "bccloud.database.windows.net",
      options: { database: "bccloud", encrypt: true },
    };
    var connection = new Connection(config);
    connection.on("connect", function () {
      requestDelete = new Request(
        "DELETE FROM dbo.RegOferta WHERE NOferta = @Cabecera",
        (err) => {
          if (err) {
            throw err;
          }
        }
      );
      requestDelete.addParameter("Cabecera", TYPES.VarChar, Cabecera[0]);
      requestDelete.on("requestCompleted", function () {
        if (Table && Reference && Cabecera) {
          var i = 0;
          FunctrequestInsert(connection, i, Table, Reference, Cabecera);
        }
      });
      connection.execSql(requestDelete);
    });
    connection.connect();
    connection.close();
  } else {
    const oledb = require("node-adodb");
    oledb.PATH = "./resources/adodb.js";
    if (document.getElementById("Servidor").checked) {
      var connection = oledb.open(
        "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=\\\\call-bc\\Carpetas Publicas\\TECNIC\\RivaColdSelect\\RivaColdSelect.accdb;",
        process.arch.includes("64")
      );
    } else if (document.getElementById("Local").checked) {
      Directorio = __dirname.replace("\\app.asar", "");
      var connection = oledb.open(
        "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" +
        Directorio +
        "\\BaseDatos\\RivaColdSelect.accdb;",
        process.arch.includes("64")
      );
    }
    connection.execute(
      'DELETE FROM RegOferta WHERE NOferta="' + Cabecera[0] + '"'
    );
    if (Table && Reference && Cabecera) {
      for (i = 0; i < Table.length; i++) {
        dCabecera = Cabecera[0]
        for (j = 1, Campolen = Campo.length; j < Campolen; j++) {
          dCabecera += ";" + Cabecera[j]
        }
        connection.execute(
          'INSERT INTO RegOferta (NOferta,Cabecera,Oferta) VALUES ("' + Cabecera[0] + '","' + dCabecera + '","' + Table[i][0] + ";" + Table[i][1] + ";" + Table[i][2] + ";" + Table[i][3] + ";" + Table[i][4] + ";" + Table[i][5] + ";" + Reference[i] + '")');
      }
    }
  }
}
function FunctrequestInsert(connection, i, Table, Reference, Cabecera) {
  const { Request, TYPES } = require("tedious");
  requestInsert = new Request(
    "INSERT INTO dbo.RegOferta (NOferta,Cabecera,Oferta) VALUES (@Cabecera,@TextCabecera,@TextOferta)",
    function (error) { error ? console.log(error) : null });
  TextCabecera = Cabecera[0]
  for (j = 1, Campolen = Campo.length; j < Campolen; j++) {
    TextCabecera += ";" + Cabecera[j]
  }
  const TextOferta = Table[i][0] + ";" + Table[i][1] + ";" + Table[i][2] + ";" + Table[i][3] + ";" + Table[i][4] + ";" + Table[i][5] + ";" + Reference[i];
  requestInsert.addParameter("Cabecera", TYPES.VarChar, Cabecera[0]);
  requestInsert.addParameter("TextCabecera", TYPES.VarChar, TextCabecera);
  requestInsert.addParameter("TextOferta", TYPES.VarChar, TextOferta);
  requestInsert.on("requestCompleted", function () {
    if (i < Reference.length - 1) {
      i += 1;
      FunctrequestInsert(connection, i, Table, Reference, Cabecera);
    } else {
      SQL(TypeDB())
    }
  });
  connection.execSql(requestInsert);
}

function TypeDB() {
  if (document.getElementById("Local").checked) {
    return "Local";
  } else if (document.getElementById("Servidor").checked) {
    return "Servidor";
  } else if (document.getElementById("AzureSQL").checked) {
    return "AzureSQL";
  }
}

localforage.getItem("RivaColdStock").then(function (value) {
  DBStock = JSON.parse(value)
  localforage.getItem("RivaColdTarifa0000").then(function (value) {
    DBTarifa = JSON.parse(value)
    localforage.getItem("RivaColdGama").then(function (value) {
      DBGama = JSON.parse(value)
      localforage.getItem("RegOferta").then(function (value) {
        Registro = JSON.parse(value)
        if (!Table) {
          ClearDB()
          GuardarDatos()
          OF();
        }
        SeleccionarModelo();
        DatosCabecera();
        ModifTable();
        GuardarDatos();
      })
    })
  })
})