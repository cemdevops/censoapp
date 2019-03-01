var cfg = require ('../../parameters.js');
var mongoClient = require('mongodb').MongoClient;
var dboper = require ('./operMongo');
var MDB = require('monetdb')();
var nodemailer = require('nodemailer');
var waterfall = require('async-waterfall');
var fs = require('fs');
var fs1 = require ('fs');
var utils = require ('./utils');
var assert = require('assert');
var exec = require('child_process').exec;
var NodeXls = require('node-xls');

var transporter = nodemailer.createTransport(
  {
    "service": "gmail",
    "auth": {
      "user": "cem.devops@gmail.com",
      "pass": "Cem#fflch"
    }
  }
);

// Função que gera arquivos:
// Dados, Metadados
// Envia email.
exports.geraArquivoCsv = function (dadosArq, callback) {

  // **---------------- 20171119
  // ** VERIFICAR: Está abrindo conexão e consultando Mongo novamente
  // ** ==> Aaparentemente não precisa mais. Verificar! Para envio de email?
  // **------------------------------------
  mongoClient.connect (cfg.MONGO_URL_W + "/"  + cfg.MONGO_DB_APP_CENSO + cfg.MONGO_URL_AUTH_DB, function (err,db) {
    assert.equal (err, null,"Erro-");
    console.log ('Connect to mongoDB (NEW/GERA-ARQ-2) ' + cfg.MONGO_URL + "/" + cfg.MONGO_DB_APP_CENSO);

    var strQuery = "{\"_id\":\"" + dadosArq._id + "\"}"; //,avaiable:{$ne:0}}";
    console.log (strQuery);
    //var strQuery = {"_id":req.body._id};

    dboper.findDocuments (db, cfg.MONGO_DB_QUEUE, JSON.parse (strQuery), {}, 0, function (result) {
      console.log (result);
      console.log (result.length);

      if (result.length > 0) {

        console.log (result[0].query);
        var strQueryMonet = result[0].query;
        var strUniqueID = result[0]._id;
        var objQryData = result[0].qryData;
        var strCollection = result[0].coll;
        var strSimpleFN = result[0].simpleFn;

        console.log ("UNIQUE ID: ", strUniqueID);
        
        var optionsMonet = {
          host  : cfg.MONET_DB_HOST, 
          port  : cfg.MONET_DB_PORT,
          dbname: cfg.MONET_DB_NAME,
          user  : cfg.MONET_DB_USER,
          password: cfg.MONET_DB_USER,
          language: 'sql',
          prettyResult: true, // the query result will be JSON   
          debug: false,      // Whether or not to log general debug messages
          debugMapi: false,  // Whether or not to show the Mapi messages that
                            // are being sent back and forth between 
                            // the MonetDB NodeJS module and the MonetDB server
          testing: false     // When set True, some additional (undocumented) methods 
                            // will be  exposed, e.g. to simulate socket failures
        };
        console.log ("Monet Option: ", optionsMonet);
      
        var conn = new MDB(optionsMonet);
        conn.connect();
        conn.query(strQueryMonet)
        .then(function(result){
          console.log('MONET OK: execution succesful!!');      
          conn.close();
          
          // Gera arquivo de metadados:
          
          geraArquivoMetadados (objQryData, strCollection, strSimpleFN, function (strRes) {
            console.log ("08 - Terminou de gerar arquivo metadados 0:", strRes);
        
            //var fileName = "POST files/GeraARQMonet-2";
            //var strTemp = "{\"resultado\":1,\"file\":\"" + fileName + "\"}"

            console.log ("Vai enviar e-mail!!", dadosArq.email, "\n");
            
            var strHTML = utils.getEmailHTMLBody (strUniqueID, objQryData);
            
            var mailOptions = {
              from: 'cem.devops@gmail.com',
              to: dadosArq.email,
              subject: '[CEM] Não responda - download de arquivo ',
              text: 'Arquivo disponível para download.',
              html: strHTML
            }
  
            transporter.sendMail(mailOptions, function(error, info) {
              if (error) {
                  console.log("ERRO NO EMAIL ===> ", error);
              } else {
                  console.log("Envio E-mail (" + dadosArq.email + ") OK: " + info.response);
                  newDate = new Date();
                  objUpdate = {status:3, dt3:newDate};
                  dboper.updateDocument (db, {_id:dadosArq._id}, objUpdate, cfg.MONGO_DB_QUEUE, function (resUpdEmail) {
                    console.log("Atualização BD envio email OK: ", resUpdEmail.result);
                  });
              }
            });
            // Envio email...
  
            console.log ("CALLBACK: ", "{\"resultado\":1,\"file\":\"" + dadosArq.filename + "\"}")
            callback ("{\"resultado\":1,\"file\":\"" + dadosArq.filename + "\"}");
            
          });

        }, function(err){
          //Handle error here
          console.error("MONET ERRO! ==> " + err);
          conn.close();
          callback ("{\"resultado\":0,\"file\":\"" + dadosArq.filename + "\"}");
        });
      }
      
    });
  });
}

geraArquivoMetadados = function (objMD, tCol, fileName, callback) {
  console.log ("GeraArqMD: Início: ", objMD);
  console.log("INICIA A CONCATENAÇÃO DE ARQUIVOS!");
  console.log(JSON.stringify(objMD));
  var strCmd = "";
  
  var arrayAuxYear = []; 
  for (i = 0; i < objMD.length; i++) {
     if (Array.isArray(objMD [i].year)) {
       console.log("objMD.year is array : " + objMD [0].year);
       for (j = 0; j < objMD[i].year.length; j++) {
 	 if (arrayAuxYear.indexOf(objMD [i].year[j]) === -1) 
     	    arrayAuxYear.push(objMD [i].year[j]);
       }
     } else {
         console.log("objMD.year is numeric");
	 if (arrayAuxYear.indexOf(objMD [i].year) === -1)
	    arrayAuxYear.push(objMD [i].year)	
     }
  }

  var auxCmd = "";
  for (i = 0; i < arrayAuxYear.length; i++) {  
     if  (arrayAuxYear[i] == 1960 || arrayAuxYear[i] == 2000) {
      if (arrayAuxYear[i] == 1960) 
         strCmd = "zip -j \"" + cfg.MONET_DB_OUTPUT_FOLDER + fileName + " - Documentos Relacionados.zip\" \"" + cfg.APP_AUX_FILES_FOLDER +  "Censo " + arrayAuxYear[i] + " - Dicionário de Códigos.xlsx\"";
      else 
         strCmd = "zip -j \"" + cfg.MONET_DB_OUTPUT_FOLDER + fileName + " - Documentos Relacionados.zip\" \"" + cfg.APP_AUX_FILES_FOLDER +  "Censo " + arrayAuxYear[i] + " - Dicionário de Códigos.xls\"";
     } else 
         strCmd = "zip -j \"" + cfg.MONET_DB_OUTPUT_FOLDER + fileName + " - Documentos Relacionados.zip\" \"" + cfg.APP_AUX_FILES_FOLDER +  "Censo " + arrayAuxYear[i] + " - Dicionário de Códigos.doc\"";

    strCmd += "; zip -j \"" + cfg.MONET_DB_OUTPUT_FOLDER + fileName + " - Documentos Relacionados.zip\" \"" + cfg.APP_AUX_FILES_FOLDER +  "Censo " + arrayAuxYear[i] + " - Variáveis Auxiliares.zip\"";
    console.log("Adiciona arquivos: " + strCmd);
    auxCmd += strCmd + ";";  
  } 
  
  var resultZip;
  exec(auxCmd, function(error, stdout, stderr) {        
      console.log("Result Zip", stdout);
      if (error) {
         console.log ("Error: ", error, "strErr: ", stderr)
  	 resultZip = stderr;   
      } else  
	resultZip = stdout;   
   });
  callback (resultZip);

} // exports.geraArquivoMetadados


  