var express = require('express');
var router = express.Router();
var path = require('path');

//var currentCensos = [];
//var currentCol = "";

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log ("SelVars INÍCIO XXX", req.body);
//  console.log ("SelVars INÍCIO 1", req.params);
//  console.log ("SelVars INÍCIO 2", req.query);

  //currentCol = req.query.col;
  //currentCensos = req.query.censos;
  
  res.sendFile(path.join(__dirname, '../', 'views', 'selectVars.html'));
//  res.send('selVars: respond with a resource');
});

router.get('/getSession', function(req, res, next) {
  console.log ("getVar", req.session);
	sess = req.session;
//  res.json({col:currentCol, censos:currentCensos});
  objJson = {
    col:sess.s_col,
    censos:sess.s_years,
    abaOriginais:sess.abaOriginais,
    themePad:sess.themePad,
    theme:sess.theme,
    anoAtual:sess.anoAtual,
    selectedVars:sess.selectedVars
  };
  res.json(objJson);
  //res.sendFile(path.join(__dirname, '../', 'views', 'selectVars.html'));
//  res.send('selVars: respond with a resource');
});

router.post('/UpdateSess', function(req, res) {
  console.log ("RUN SelectVar: Post/UpdateSess. Parameters:");
//  console.log (req.body);
//  console.log (req.session);
	var sess = req.session;
//	sess.s_col = req.body.tabela;
//  sess.s_years = req.body.censos;
//  sess.s_years2 = req.body.censos2;
  if (req.body.abaOriginais || req.body.abaOriginais == "") {
    console.log ("Vai atualizar abaOriginais com ", req.body.abaOriginais, ". Era:", sess.abaOriginais);
    sess.abaOriginais = req.body.abaOriginais;
  }
  
  if (req.body.themePad || req.body.themePad == "") {
    console.log ("Vai atualizar themePad com ", req.body.themePad, ". Era:", sess.themePad);
    sess.themePad = req.body.themePad;
  }
  
  if (req.body.theme || req.body.theme == "") {
    console.log ("Vai atualizar theme com ", req.body.theme, ". Era:", sess.theme);
    sess.theme = req.body.theme;
  }
  
  if (req.body.anoAtual || req.body.anoAtual == "") {
    console.log ("Vai atualizar anoAtual com ", req.body.anoAtual, ". Era:", sess.anoAtual);
    sess.anoAtual = req.body.anoAtual;
  }
  
  if (req.body.selectedVars || req.body.selectedVars == "") {
    console.log ("Vai atualizar selectedVars com ", req.body.selectedVars, ". Era:", sess.selectedVars);
    sess.selectedVars = req.body.selectedVars;
  }

  req.session.save();
    
  res.end('done');
});


module.exports = router;
