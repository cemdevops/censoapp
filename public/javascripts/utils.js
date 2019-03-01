 //MongoClient = require('mongodb').MongoClient,
var assert = require('assert');
var cfg = require ('../../parameters.js');

// Função para retornar variávei Estado de acordo com o censo.
exports.obtemVarEstado =  function (strEstado) {
//  function obtemVarEstado (strEstado) {
  var varEstado = "";
  switch (strEstado) {
    case "2010": varEstado  = "V0001";
      break;
    case "2000": varEstado  = "V0102";
      break;
    case "1991": varEstado  = "V1101";
      break;
    case "1980": varEstado  = "V2";
      break;
    case "1970": varEstado  = "V055";
      break;
    default: varEstado  = "V0001";
      console.log("Sem Estado");
      break;
  }
  return varEstado;
}

// Função para retornar schema censo monet de acordo com o censo.
exports.obtemSchemaMonet =  function (strCenso) {
  //console.log ("vai obter schema: ", strCenso);
  var varSchema = [];
  console.log ("tamanho: ", strCenso.length);
  
  for (i = 0; i < strCenso.length; i++) {
    console.log("i=" + i + " str=" + strCenso [i]);
    switch (strCenso [i]) {
      case "2010": varSchema.push ({ano:strCenso [i],schema:"c2010"});
      console.log(strCenso [i]);
      break;
      case "2000": varSchema.push ({ano:strCenso [i],schema:"c2000"});
      console.log(strCenso [i]);
      break;
      case "1991": varSchema.push ({ano:strCenso [i],schema:"c1991"});
      console.log(strCenso [i]);
      break;
      case "1980": varSchema.push ({ano:strCenso [i],schema:"c1980"});
      console.log(strCenso [i]);
      break;
      case "1970": varSchema.push ({ano:strCenso [i],schema:"c1970"});
      console.log(strCenso [i]);
      break;
      case "1960": varSchema.push ({ano:strCenso [i],schema:"c1960"});
      console.log(strCenso [i]);
      break;
      default: varSchema.push ({ano:strCenso [i],schema:"c2010"});
      console.log(strCenso [i]);
      console.log("Sem schema!");
               break;
    }
  }
  return varSchema;
}

// Função para obter o filtro de uma determinada variável, se houver.
// ** Atenção: falta ainda tratar tipos!
function getFilterVar (strFilterWhere, selem) {
  var strRet = "";

  if (selem.catType && (selem.catType == 3 || selem.catType == 4)) { // Numeric variable
    if (selem.filterSelected &&
       (selem.filterSelected == ">" || selem.filterSelected == "<" || selem.filterSelected == "=" ||
        selem.filterSelected == ">=" || selem.filterSelected == "<=" || selem.filterSelected == "><")) { // if filterSelected exist and is valid for numeric values
      // Filter exist and operator is valid
      if (selem.filterSelected == "><") {
        // Between operator. There must have 2 arguments
        if (selem.filterList && selem.filterList.length == 2) {
          console.log ("\n\nTem Filtro:\n", selem.varCode, selem.filterList);
          if (strFilterWhere != "") {
            // Não é primeira variável
            strRet = " AND "
          }
          strRet += selem.varCode + " between " + selem.filterList [0] + " and " + selem.filterList [1];
        } else { // if (selem.filterList && selem.filterList.length > 0)
          console.log ("Filter error: between with invalid arguments", selem.varCode)
        }
      } else { // if (selem.filterSelected == "><")
        // Other operator (selem.filterSelected == ">" || selem.filterSelected == "<" || ...). There must have only 1 argument
        if (selem.filterList && selem.filterList.length == 1) {
          console.log ("\n\nTem Filtro:\n", selem.varCode, selem.filterList);
          if (strFilterWhere != "") {
            // Não é primeira variável
            strRet = " AND "
          }
          strRet += selem.varCode + selem.filterSelected + selem.filterList [0];
        } else { // if (selem.filterList && selem.filterList.length > 0)
          console.log ("Filter error: operator with invalid arguments", selem.varCode)
        }
      }
    } else { // if (selem.filterSelected && (selem.filterSelected == ">" || selem.filterSelected == "<" || ...))
      console.log ("Filter error: invalid operator for numeric variable", selem.varCode)
    }
  } else { // if (selem.catType && (selem.catType == 3 || selem.catType == 4))
    // Variable with categories (1, 2, 5, 6)
    if (selem.filterSelected && selem.filterSelected == "-") {
      if (selem.filterList && selem.filterList.length > 0) {
        console.log ("\n\nTem Filtro:\n", selem.varCode, selem.filterList);
        if (strFilterWhere != "") {
          // Primeira variável
          strRet = " AND "
        }

        if (selem.filterList.indexOf ("") < 0) {
          // Não existe vazio (null)
          if (selem.filterList.length == 1) {
            strRet += selem.varCode + "=" + selem.filterList [0];
          } else {
            strRet += selem.varCode + " IN (";
            for (intCont = 0; intCont < selem.filterList.length; intCont++) {
              if (intCont == 0) {
                strRet += selem.filterList [intCont]; 
              } else {
                strRet += "," + selem.filterList [intCont]; 
              }
            }
            strRet +=  ")";
          }
        } else { // if (selem.filterList.indexOf ("") < 0)
          // Existe vazio (null). Tratamento diferente para a SQL
          if (selem.filterList.length == 1) {
            // Única alternativa escolhida é vazio
            strRet += selem.varCode + " is null";
          } else if (selem.filterList.length == 2) {
            // Filtrado um vazio e um valor não vazio
            strRet += "(" + selem.varCode + " is null or ";
            if (selem.filterList [0] === "") {
              strRet += selem.varCode + "=" + selem.filterList [1] + ")";
            } else {
              strRet += selem.varCode + "=" + selem.filterList [0] + ")";
            }
          } else { // selem.filterList.length >= 3 and existe null
            // Filtrado um vazio e mais de um valor não vazio
            strRet += "(" + selem.varCode + " is null or ";
            strRet += selem.varCode + " IN (";
            var intFirst = 0;
            for (intCont = 0; intCont < selem.filterList.length; intCont++) {
              if (selem.filterList [intCont] === "") {
                // Vai ser ignorado
                //console.log ("Ignorado:",intCont,selem.filterList [intCont])
                if (intCont == intFirst) {
                  intFirst++; // Era primeiro da lista. Incrementa o primeiro.
                }
              } else {
                // Vai ser incluído no filtro
                if (intCont == intFirst) { // Primeiro a ser incluído
                  strRet += selem.filterList [intCont]; 
                } else {
                  strRet += "," + selem.filterList [intCont]; 
                }
              }
            } // for (intCont = 0; intCont < selem.filterList.length; intCont++)
            strRet +=  "))";
          } // else { // selem.filterList.length >= 3 and existe null
        } // Else - if (selem.filterList.indexOf ("") < 0)
      } // if (selem.filterList && selem.filterList.length > 0)
    } // if (selem.filterSelected && selem.filterSelected == "-")
  }

  return (strRet);
}


function pad (width, string, padding) { 
  return (width <= string.length) ? string : pad(width, padding + string, padding)
}

exports.createSQL = function (objreq, sview) {

  /*
  console.log("##########################################################");
  console.log("Exibe o parâmetro passado:" + JSON.stringify(objreq) + "\n\n\n");
  console.log("Formatos dados: " + objreq.formatosdados);
  console.log("Tabela: " + objreq.tabela);
  console.log("Theme: " + objreq.theme +"\n");
  console.log("Estado: " + objreq.estado +"\n");
  console.log("Variaveis: " + objreq.variaveis + "\n");
  console.log("Selected Variables: " + JSON.stringify(objreq.selectedVariables) +"\n");
  console.log("##########################################################");
  */

  var strCollection = objreq.tabela;
  var svarCode;
  //var arrayAnos = objreq.anoPad;
  var arrayAnos = [];
  //var arrayUF = objreq.estado;
  var arrayVar = [];
  arrayVar = objreq.selectedVariables;
  //$scope.parameters.anoPad
  var arraysql = [];
  //console.log("Inicia o processamento dos censos selecionados");
  var sheader = "SELECT ";
  var spref;
  var selem;
  //var svpadr = [];
  var arraypadr = [];

  // Cria select para header
  for (i = 0; i < arrayVar.length; i++) {
    selem = arrayVar[i];
    // Verifica se é variável padrão
    if (selem.original.toUpperCase() == 'PADRONIZADA') {
      console.log("Localizou variavel padrao: " + arrayVar[i]);
	    arraypadr.push(selem.varCode);
    } else {
      svarCode = selem.varCode.replace("VAR","V");
      console.log ("==>Módulo. Int ", ~~selem.year/100, " e resto = ", pad (2,(selem.year%100).toString(),"0"));
      spref = "c" + pad (2,(selem.year%100).toString(),"0") + "_";
      if (i < (arrayVar.length - 1))
         sheader += spref + svarCode  + ", ";
      else
         sheader +=  spref + svarCode;
      //console.log("Process year: " + selem.year);
      if (arrayAnos.indexOf(selem.year) == -1) {
         //console.log("Insert year: " + selem.year);
         arrayAnos.push(selem.year);
      }
    }
  } // for (i = 0; i < arrayVar.length; i++)

  // Contorno para um censo apenas...
  // Se for apenas um censo, refaz select do header sem prefixos
  console.log ("==> ArrayAnos = ", arrayAnos, ". ANOS = ", objreq.anoPad)
  if (arrayAnos.length == 1) {
    sheader = "SELECT ";
    for (i = 0; i < arrayVar.length; i++) {
      selem = arrayVar[i];
      if (selem.original.toUpperCase() != 'PADRONIZADA') {
        svarCode = selem.varCode.replace("VAR","V");
        spref = "c" + pad (2,(selem.year%100).toString(),"0") + "_";
        if (i < (arrayVar.length - 1))
           sheader += spref + svarCode + " as " + svarCode + ", ";
        else
           sheader +=  spref + svarCode + " as " + svarCode;
      }
    }
  }
  // ...Contorno para um censo apenas

  // Adiciona a variável padrão no final do header
  // PS: se houver alteração na ordem e padronizadas não ficar no final, deve-se verificar vírgulas
  for (i = 0; i < arraypadr.length; i++) {
    console.log("Insere variável padrão no header: " + arraypadr[i]);
    if (i < (arraypadr.length - 1))
      sheader += arraypadr[i]  + ", "
    else
      sheader += arraypadr[i]
  }

  // Seleciona entre header sem prefixo e com prefixo
  if (arrayAnos.length == 1) {
    sheader +=  " FROM cHeader." + strCollection + "HeaderSemPrefixo";
  } else {
    sheader +=  " FROM cHeader." + strCollection + "Header";
  }

  // Verifica se é select para visualização ou geração de arquivo
  if (sview) 
    sheader += " WHERE (0=1) "
  else 
    sheader += " WHERE (1=1) ";

  console.log("Select header: " + sheader);
  arraysql.push(sheader);

  if (arraypadr.length > 0) {
    var sSchema = exports.obtemSchemaMonet (objreq.anoPad);
  } else {
    var sSchema = exports.obtemSchemaMonet (arrayAnos);
  }
  
  //console.log("Schemas: " + sSchema);
  for (x = 0; x < sSchema.length; x++) {
    //console.log(" Process Schema: " + JSON.stringify(sSchema[x]) + "  [Ano: "  + sSchema[x].ano + " Schema " + sSchema[x].schema + "]");
    var ssql = "";
    var ssqlfields = "SELECT ";
    var strFilterWhere = "";
    for (i = 0; i < arrayVar.length; i++) {
      var selem = arrayVar[i];
      // Verifica se selem é variável padrão
      if (arraypadr.indexOf(selem.varCode) == -1) {
        // Processa variável comum
        if (selem.year ==  sSchema[x].ano) {
          var svarCode = selem.varCode.replace("VAR","V");
          if (i > 0) {
            ssqlfields += ", cast(" + svarCode + " as varchar(20))";
          } else {
            ssqlfields += "cast(" + svarCode + " as varchar(20))";
          }
          // Constrói filtro (where) para esta variável, se houver.
          strFilterWhere += getFilterVar (strFilterWhere, selem);
          /*
          if (selem.filterSelected && selem.filterSelected == "-") {
            if (selem.filterList && selem.filterList.length > 0) {
              console.log ("\n\nTem Filtro:\n", selem.varCode, selem.filterList);
              if (strFilterWhere != "") {
                // Primeira variável
                strFilterWhere += " AND ";
              }

              if (selem.filterList.length == 1) {
                strFilterWhere += selem.varCode + " = " + selem.filterList [0];
              } else {
                strFilterWhere += selem.varCode + " IN (";
                for (intCont = 0; intCont < selem.filterList.length; intCont++) {
                  if (intCont == 0) {
                    strFilterWhere += selem.filterList [intCont]; 
                  } else {
                    strFilterWhere += "," + selem.filterList [intCont]; 
                  }
                }
                strFilterWhere +=  ")";
              }
            }
          }
          */
        } else {
          if (i > 0) 
             ssqlfields += ",''";
          else
             ssqlfields += "''";
        }
      } else {
        console.log("Variável padrão não considerada: " + selem.varCode);
        // Constrói filtro (where) para esta variável, se houver.
        strFilterWhere += getFilterVar (strFilterWhere, selem);

        /*
        if (selem.filterSelected && selem.filterSelected == "-") {
          if (selem.filterList && selem.filterList.length > 0) {
            console.log ("\n\nTem Filtro:\n", selem.varCode, selem.filterList);
            if (strFilterWhere != "") {
              // Primeira variável
              strFilterWhere += " AND "
            }

            if (selem.filterList.length == 1) {
              strFilterWhere += selem.varCode + " = " + selem.filterList [0];
            } else {
              strFilterWhere += selem.varCode + " IN (";
              for (intCont = 0; intCont < selem.filterList.length; intCont++) {
                if (intCont == 0) {
                  strFilterWhere += selem.filterList [intCont]; 
                } else {
                  strFilterWhere += "," + selem.filterList [intCont]; 
                }
              }
              strFilterWhere +=  ")";
            }
          }
        }
        */

	    }

    }

    // Adiciona variável padrão no final da SQL
    for (y = 0; y < arraypadr.length; y++) {
      if (ssqlfields == "SELECT ") {
        ssqlfields += arraypadr[y];
      } else {
        ssqlfields += ", " + arraypadr[y];
      }
    }
    //console.log("Variáveis selecionadas: " + ssqlfields);
    ssql = ssqlfields + " FROM c" + sSchema[x].ano + "." + strCollection; // + " as \"A" + sSchema[x].ano +"\"";
    //console.log("VISUALIZAR: " + sview + " Collection: " + strCollection);
    //var svaruf = exports.obtemVarEstado (sSchema[x].ano);
    ssql = ssqlfields + " FROM c" + sSchema[x].ano + "." + strCollection; // + " as \"A" + sSchema[x].ano +"\"";
    var sid = "";
    if (sview) {
      //console.log("Processa WHERE");
      if (strFilterWhere != "") 
         ssql +=  " WHERE " + strFilterWhere; // + " LIMIT " + (12/sSchema.length) ssql += "AND " + strFilterWhere + " ";
      else {
        if (strCollection == "tPes") 
          sid = "idpessoa"
        else 
          sid = "iddomicilio"
        ssql += " WHERE (" +  sid + " < " + (12/sSchema.length) +") ";
      }      
    } else {
      if (strFilterWhere != "") {
        ssql += " WHERE " + strFilterWhere;
      }
    }
    //console.log("Censo: " + sSchema[x].ano + " SQL parcial " + ssql);
    arraysql.push(ssql);

    console.log ("\n\nSTR-WHERE: ", strFilterWhere)
  }
  var ssqlfull = "";
  for (i = 0; i < arraysql.length; i++) {
     if (i > 0) 
        ssqlfull += ' UNION ALL ' +  arraysql[i];
     else
        ssqlfull += arraysql[i];
  }
  console.log("Return SQL FULL: " + ssqlfull);
  return ssqlfull;
}

exports.getQryData = function (objReq) {
  var selVar = objReq.selectedVariables;
  //console.log ("selVar: ", selVar);

  var objRet = [];
  var objVar = {};
  
  for (i = 0; i < selVar.length; i++) {
    var intIdxYear = -1;
    
    for (j = 0; j < objRet.length; j++) {
      if (objRet [j].year == selVar [i].year) {
        intIdxYear = j;
        //console.log ("Encontrou year: ", intIdxYear);
      }
    }

    if (intIdxYear >= 0) {
      // Já existe um registro de ano
      console.log ("02 - intIdx já existe. Inclui varCode: ", selVar [i].varCode);
      objRet[intIdxYear].var.push (selVar [i].varCode);
    } else {
      console.log ("02 - NOVO ANO. Inclui: ", selVar [i].year, selVar [i].varCode);
      objVar = {"year":selVar [i].year,"var":[selVar [i].varCode]};
      objRet.push (objVar);
    }
  }

  console.log ("03 - Fim GetQyrData: ", objRet);

  return objRet;
}

exports.getEmailHTMLBody = function (strUniqueID, objQryData) {
  var strHTML = "";
  var strVarTable = "";
  var strManualLink = "";

  console.log ("objQryData: ", objQryData);

  console.log("UNIQUEID" + strUniqueID);

  strManualLink = "<div> Documentos Complementares:";

  strVarTable = "<table style='border: 1px solid black'>" +
      "  <tr style='border: 1px solid black;text-align:center'>" +
      "    <th bgcolor='#98d4ff' style='border: 1px solid black'>Ano</th>" +
      "    <th bgcolor='#98d4ff' style='border: 1px solid black'>Variável</th> " +
      "  </tr>";

  // Consulta para cada ano
  console.log ("Vai verificar dados para email:")

//  var bisHarm = false;
  var arrayAuxYear = []; 
  for (i = 0; i < objQryData.length; i++) {
     if (Array.isArray(objQryData [i].year)) {
//     bisHarm = true;
       console.log("objQryData.year is array : " + objQryData [0].year);
       for (j = 0; j < objQryData[i].year.length; j++) {
 	 if (arrayAuxYear.indexOf(objQryData [i].year[j]) === -1) 
     	    arrayAuxYear.push(objQryData [i].year[j]);
       }
       strVarTable += "  <tr style='border: 1px solid black'>" +
       "    <td style='border: 1px solid black'>" + objQryData [i].year.toString() + "</td>" +
       "    <td style='border: 1px solid black'>" + objQryData[i].var + "</td>" +
       "  </tr>";
     } else {
	 if (arrayAuxYear.indexOf(objQryData [i].year) === -1)
	    arrayAuxYear.push(objQryData [i].year)	
         console.log("objQryData.year is numeric");
         for (j = 0; j < objQryData[i].var.length; j++) {
           strVarTable += "  <tr style='border: 1px solid black'>" +
           "    <td style='border: 1px solid black'>" + objQryData[i].year + "</td>" +
           "    <td style='border: 1px solid black'>" + objQryData[i].var[j] + "</td>" +
           "  </tr>";
         }
     }
  }
  
  console.log("arrayAuxYear: " + arrayAuxYear);

  for (i = 0; i < arrayAuxYear.length; i++) {
       // var strAux = objQryData[i].var[0].substring (0,5).toUpperCase();
       strManualLink += "  <br>" +
          "  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
          " <a href='http://" + cfg.APP_IP + "/" + cfg.APP_CENSO_MANUAL_FILES_FOLDER + "Censo " + arrayAuxYear[i] + " - Documentação Complementar.zip'> Censo " + arrayAuxYear[i] + "(IBGE)</a>";
  }

//   if (!bisHarm)
    strManualLink += "  <br>" +
      "  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
      " <a href='http://" + cfg.APP_IP + "/" + cfg.APP_CENSO_MANUAL_FILES_FOLDER +  "Dicionário de Códigos - Variáveis Harmonizadas - Censos 1960-2010.xlsx'> Censos 1960-2010 Dicionário de Variáveis Harmonizadas(CEM) </a>";

  // var strAux = objQryData[i].var[0].substring (0,5).toUpperCase();
  // strManualLink += "  <br>" +
  // "  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
  // " <a href='http://" + cfg.APP_IP + "/" + cfg.APP_CENSO_MANUAL_FILES_FOLDER + "Censo " + objQryData[i].year + " - Documentos Complementares.zip'> Censo " + objQryData[i].year + " </a>";

  strManualLink += "</div>";
  strVarTable += "</table>";
  
  strHTML = "<style>" +
      "table, th, td {" +
      "    border: 1px solid black;" +
      "}" +
      "</style>" +
      "<h1>CEM - Plataforma de Extração de Dados Censitários</h1>" +
      "<h2>Arquivos disponíveis.</h2>" +
      "<p>Para baixar os arquivos, clique nos links abaixo:</p>" +
      "<p>Dados Extraídos(CEM):" +
      "  <br>" +
      "  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
      " <a href='http://" + cfg.APP_IP + ":" + cfg.APP_PORT + "/files/download?file=" + strUniqueID + "&ty=0'>Arquivo de Dados</a>" +
      "  <br>" +
      "<p>Documentação(IBGE):" +
      "  <br>" +
      "  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
      " <a href='http://" + cfg.APP_IP + ":" + cfg.APP_PORT + "/files/download?file=" + strUniqueID + "&ty=1'>Documentos Relacionados</a>" +
      "</p>" +
      strManualLink +
      "<p><u>Atenção</u>:&nbsp;<i>Os arquivos ficarão disponíveis por 24h</i></p>" +
      "<h2>Variáveis extraídas:</h2>" +
      strVarTable +
      "<p><i>Atenciosamente,<br>Equipe CEM</i></p>";

  return (strHTML)  ;
}
  
