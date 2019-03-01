// The "selectVars" parameter refers to an HTML element in which the application will run.
// The [] parameter in the module definition can be used to define dependent modules.
// Without the [] parameter, you are not creating a new module, but retrieving an existing one.



var selectVars = angular.module('selectVars',[]); //'ngRoute'

//var path = require('path');

var strAllYears = "*";
//cfg = require ('../../parameters.js');

/*
selectVars.config(function($routeProvider, $locationProvider){
    
    $routeProvider
    //the home page display
    .when('/xxx:col', {
      templateUrl: 'selectVars.html',
      controller: 'submitController'
    });

    $locationProvider.html5Mode(true);
});
*/

/*
$routeProvider.when('/view1/:param1/:param2', {
    templateUrl: 'partials/partial1.html',    
    controller: 'MyCtrl1'
});
*/

// Module that contains the controllers used in the main app page index.html

// Add a controller to application to show samples of the a query
/* Clóvis */
selectVars.controller('censoController', ['$scope', '$http', function sendData($scope, $http) {
    alert ('Iniciou censoController!')
    $http({
        method : 'get',
        url : '/data'
    }).then(function mySuccess(response) {
        $scope.dataQuery = response.data;
    }, function myError(response) {
        console.log('Error: ' + response.data);
    });

    // .success and .error methods are deprecated in Angular 1.6
}]);
/* */

// Controller to capture the main form (current all page) submit to generate file sample and generate file
selectVars.controller('submitController',['$scope', '$rootScope', '$http', '$window', function ($scope, $rootScope, $http, $window) {
//selectVars.controller('submitController',['$scope', '$rootScope', '$routeParams', '$http', function ($scope, $rootScope, $routeParams, $http) {
    //$scope.data = {};

    $scope.parameters = {};
    console.log('selectVars: submitController');
    //console.log (req.query);
    $scope.parameters.formatoDados = "csv-commas";
    // Teste novo layout
    console.log ("Vai preencher tabela e censos:", $scope);

    $http.get('/selectVars/getSession')
    .then(function (response) {
        console.log ("Chamou getSession", response);
        if (response.data.col != "") {
            $scope.parameters.tabela = response.data.col;
            //$scope.$emit ("callUpdateVars", {});
            //$scope.parameters.abaPadronizadas = (response.data.abaCorrente == "abaPadronizadas") || (response.data.abaCorrente == "");
            //$scope.parameters.abaOriginais = false;
            
            $rootScope.$broadcast ("callUpdateVars", {});
            
        };
        $scope.parameters.anoPad = [];
        if ((response.data.censos) && (response.data.censos != "")) {
            console.log (response.data.censos);
            $scope.parameters.anoPad = JSON.parse (response.data.censos);
            //response.data.censos;
        };
        if (response.data.abaOriginais) {
            console.log ("abaOriginais", response.data.abaOriginais);
            $scope.parameters.abaOriginais = response.data.abaOriginais;
        } else {
            console.log ("SEM response.data.abaOriginais");
        }
        if (response.data.themePad) {
            console.log ("themePad", response.data.themePad);
            $scope.parameters.themePad = response.data.themePad;
        } else {
            console.log ("SEM response.data.themePad");
        }
        if (response.data.theme) {
            console.log (response.data.theme);
            $scope.parameters.theme = response.data.theme;
        } else {
            console.log ("theme", "SEM response.data.theme");
        }

        
        $scope.parameters.ano = response.data.anoAtual;
        $scope.parameters.selectedVariables = response.data.selectedVars;

        //$rootScope.$broadcast ("callUpdateVars", {});
        $rootScope.$broadcast ("callChangeThemePad", {});
        $rootScope.$broadcast ("callChangeTheme", {});

    }, function myError(response) {
        console.log ("ERRO: ", response);
    });
    
    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

/*
    var functionSortVariables = function (variableA, variableB) {
        if (variableA.year > variableB.year) {
            return -1;
        } else if (variableA.year < variableB.year) {
            return 1;
        } else {
            if (variableA.varCode > variableB.varCode) {
                return 1;
            } else if (variableA.varCode < variableB.varCode) {
                return -1
            }
        }
        // equal Year and varCode. Return 0 = equal
        return 0;
    }
*/


    var functionSortVariables = function (a, b) {
        console.log ("\nCompare:", a.yearToShow, a.varCode, b.yearToShow, b.varCode);
        if (a.yearToShow == strAllYears || b.yearToShow == strAllYears) {
            if (b.yearToShow == strAllYears && a.yearToShow != strAllYears) {
                return -1;
            } else if (a.yearToShow == strAllYears && b.yearToShow != strAllYears) {
                return 1;
            } else { // a and b == strAllYears. Compare varCode
                if (a.varCode > b.varCode) {
                    return 1;
                } else if (a.varCode < b.varCode) {
                    return -1;
                }
                return 0;
            }
        }
        if (a.yearToShow > b.yearToShow) {
            return -1;
        }
        if (a.yearToShow < b.yearToShow) {
            return 1;
        }
        // equal Year. Compare varCode
        if (a.varCode > b.varCode) {
            return 1;
        }
        if (a.varCode < b.varCode) {
            return -1;
        }
        return 0;
    }

    
    $scope.changeVarTab = function() {
      console.log("Acionou TABSSSS!!!" + $scope);
      if ($scope.parameters.abaOriginais) {
        console.log("set abaOriginais to false");
        $scope.parameters.abaOriginais = false;
        $rootScope.$broadcast ("callChangeThemePad", {});
        // listThemesPad($scope, $rootScope, $http);
      }
      else {
        console.log("set abaOriginais to true");
        $scope.parameters.abaOriginais = true;
        // listThemes($scope, $rootScope, $http);
        $rootScope.$broadcast ("callChangeTheme", {});
      }
      console.log('selectVars.submitController: changeVarTab');
    }

    $scope.changeCensosBackButtom = function() {
        console.log('selectVars.submitController: changeCensosBackButtom');

        // armazena dados em session:
        // - Aba corrente: variáveis padronizadas ou originais (abaPadronizadas ou abaOriginais)
        // - Tema na aba padronizada ou original: temaPadronizadas ou temaOriginais
        // - Ano selecionado na aba de variáveis originais: anosOrig
        // - Variáveis selecionadas: selectedVariables (alterar para guardar apenas anos/codVar)
        var strURL = "/selectVars/UpdateSess";
        var objParameters = {
            abaOriginais:$scope.parameters.abaOriginais,
            themePad:$scope.parameters.themePad,
            theme:$scope.parameters.theme,
            anoAtual:$scope.parameters.ano,
            selectedVars:$scope.parameters.selectedVariables
        };

        $http({
            method: 'post',
            url: strURL,
            data: objParameters
        }).then(function(httpResponse) {
            // this callback will be called asynchronously
            // when the response is available
            console.log ("selectVars/UpdateSess RES: ", httpResponse);
            $window.location.href = "/";
        }, function(httpResponse) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log ("Err-selectVars/UpdateSess: ", httpResponse)
        });
    }

    $scope.InfoVar = function(objVar) {
        console.log('selectVars.submitController: InforVar clicked -> infoVAR', objVar);

        $scope.codigoVariavel = objVar.varCode;
        $scope.anoVariavel = objVar.year;
        // $scope.textoDescricaoVar = objVar.description;
        $scope.textoLabelVar = objVar.label;
        $scope.textoPopToApplyVar = objVar.popToApply;
        $scope.categoryTableClass = "table-hide";
        //       $scope.tabActive = "active";
        $scope.textoObsVar = objVar.obs;
        $scope.resultFilterOK = "modal";
        $scope.displayLoadMsg = "block";

        console.log ("Tipo dados: ", $scope.parameters.tabela)

        // Consulta categorias da variável
        $http.get('/categories?coll=' + $scope.parameters.tabela + '&var=' + objVar.varCode +'&ano=' + objVar.year)
        .then(function (response) {
            console.log ("data");
            console.log (response.data);
            console.log ("data[0].==> DBNAME ==> ", response.data[0].dbName);

            $scope.data = [];

            if (objVar.catType == 0 || objVar.catType == 5) { // categoria == coleção
                console.log ("Coleção: ", response.data[0].collection.variable.category[0].value);
                var strColecao = "";

                // Obtém coleção da categoria
                if (response.data[0].collection.variable.category[0].value == "col" ||
                    response.data[0].collection.variable.category[0].value == 0)
                {
                    console.log ("Vai procurar: ", response.data[0].collection.variable.category[0].label);
                    strColecao = response.data[0].collection.variable.category[0].label
                    //console.log (strColecao);
                    $http.get('/auxiliares?coll=' + strColecao + '&ano=' + objVar.year + '&dbName=' + response.data[0].dbName)
                    .then(function (responseAux) {
                        //console.log (responseAux.data)
                        
                        $scope.data = {
                            model: null,
                            category: responseAux.data
                        };
                        
                        $scope.displayLoadMsg = "none";

                    }, function myError(responseAux) {
                        console.log('Erro: ' + responseAux.data);
                    });
                } else {
                    console.log ("Erro: coleção não encontrada!")
                }
            }

            // Preenche categorias.
            switch (objVar.catType) {
                // Categorias 0 ou 5 = coleção
                case 0:
                case 5: $scope.textoCategoriaVar = "";
                        $scope.categoryTableClass = "table-show";
                        break;
                // Categorias 1, 2 ou 6 = categorias pré-definidas, existentes nos metadados
                case 1:
                case 2:
                case 6: $scope.textoCategoriaVar = "";
                        $scope.categoryTableClass = "table-show";
                        $scope.data = {
                            model: null,
                            category: response.data[0].collection.variable.category
                        };
                        $scope.displayLoadMsg = "none";
                        break;
                // Categorias 3 ou 4 = campo numérico de valor variável.
                case 3:
                case 4: $scope.textoCategoriaVar = "Campo de valor variável." + '\n' + "Sem categorias";
                        $scope.categoryTableClass = "table-hide";
                        $scope.displayLoadMsg = "none";
                        break;
                // Senão, categoria desconhecida
                default: $scope.textoCategoriaVar = "Consultar categorias.";
                         $scope.categoryTableClass = "table-hide";
                         console.log("Categoria desconhecida");
                         $scope.displayLoadMsg = "none";
                         break;
            }
         }, function myError(response) {
            console.log('Error: ' + response.data);
            switch (objVar.catType) {
            case 0:
            case 5: $scope.textoCategoriaVar = "Coleção:";
                break;
            case 1:
            case 2:
            case 6: $scope.textoCategoriaVar = "Categorias:";
                break;
            case 3:
            case 4: $scope.textoCategoriaVar = "Campo de valor variável." + '\n' + "Sem categorias";
                break;
            default: $scope.textoCategoriaVar = "Consultar categorias.";
                console.log("Sem Estado");
                break;
            }
        });
    }

    // Function to handle change on "Select All" checkbox (CB) in Filter window.
    // If CB is (un)checked, all cb's of all categories must be (un)checked
    $scope.filterClickCBSelectAll = function (cbChecked) {
        console.log ("selectVars.submitController: filterClickCBSelectAll", cbChecked, $scope.filterAllChecked)
        for (i = 0; i < $scope.dataCat.category.length; i++) {
            $scope.dataCat.category [i].filterChecked = cbChecked;
        }
        // Checkbox para selação de todos ou nenhum foi clicado. Então não é mais indeterminado, se for atualmente
        // Esconde indeterminado e apresenta checkbox de seleção de todos (clicado) ou nenhum (desclicado).
        $scope.filterAllChecked = cbChecked; // Display check in filterAllChecked. Only in variables that have categories
        $scope.displayCBSelectAll = "block";
        $scope.filterAllCheckedIndeterminate = false;
        $scope.displayAllCheckedIndeterminate = "none";
    }

    // Function to handle click in a category CB
    // If all of then are (un)checked, do the same to "Select All" CB
    $scope.filterClickCB = function (idxCategory) {
        var input, table, tr, td, i;
        var difValue = false;
        var previousValue = null;

        console.log ("selectVars.submitController: fnFilterClickCB", idxCategory)
        i = 0;
        while (i < $scope.dataCat.category.length && !difValue) {
    //        for (i = 0; i < $scope.dataCat.category.length; i++) {
            console.log (i, $scope.dataCat.category [i].filterChecked);
            if (previousValue == null) {
                // First to check. Store this value
                previousValue = $scope.dataCat.category [i].filterChecked;
            } else {
                //console.log ("check: ", i)
                if (previousValue != $scope.dataCat.category [i].filterChecked) {
                    // It's is a different value
                    difValue = true;
                }
            }
            i++;
        }

        // If there is at least one difference among the categories cb, set "Select All" as indeterminate
        if (difValue) {
            if (!$scope.filterAllCheckedIndeterminate) {
                // There is at least one different value. Put indeterminated value at "Select All" CB
                $scope.displayCBSelectAll = "none";
                $scope.filterAllCheckedIndeterminate = true;
                $scope.displayAllCheckedIndeterminate = "block";
            }
        } else {
            // If there is no difference between the categories cb, set "Select All" as same value
            // console.log ("Vai: ", previousValue, " em ", cbSelectAll, " para ", cbSelectAll.checked);
            if ($scope.filterAllChecked != previousValue || $scope.filterAllCheckedIndeterminate) {
                //console.log ("Vai: ", previousValue, " em ", cbSelectAll, " para ", cbSelectAll.checked);
                $scope.filterAllChecked = previousValue; // Display check in filterAllChecked. Only in variables that have categories
                $scope.displayCBSelectAll = "block";
                $scope.filterAllCheckedIndeterminate = false;
                $scope.displayAllCheckedIndeterminate = "none";
            }
        }

/*
      // Select table
      table = document.getElementById("tabFilterCategory");
      // select TR
      tr = table.getElementsByTagName("tr");

      // Verify if all checkbox has the same value
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            input = td.getElementsByTagName("input");
            if (previousValue == null) {
                // First to check. Store this value
                //console.log ("Primeiro check: ", i)
                previousValue = input[0].checked;
            } else {
                //console.log ("check: ", i)
                if (previousValue != input[0].checked) {
                    // There is a different value
                    difValue = true;
                }
            }
        }
      }

      // Select "Select All"
      var cbSelectAll = document.getElementById("selectFilterAllCheckbox");
      var cbSelectAllIndeterminate = document.getElementById("selectFilterAllCheckboxIndeterminate");
      
      // If there is at least one difference among the categories cb, set "Select All" as indeterminate
      if (difValue) {
        if (!cbSelectAll.indeterminate) {
            // There is at least one different value. Put indeterminated value at "Select All" CB
            //console.log ("Vai indeterminate")
            cbSelectAll.indeterminate = true;
            cbSelectAllIndeterminate.checked = true;
            angular.element(document.getElementById('selectFilterAllCheckbox')).triggerHandler('click');
            angular.element(document.getElementById('selectFilterAllCheckboxIndeterminate')).triggerHandler('click');
        }
      } else {
        // If there is no difference between the categories cb, set "Select All" as same value
        // console.log ("Vai: ", previousValue, " em ", cbSelectAll, " para ", cbSelectAll.checked);
        if (cbSelectAll.checked != previousValue || cbSelectAll.indeterminate) {
            //console.log ("Vai: ", previousValue, " em ", cbSelectAll, " para ", cbSelectAll.checked);
            cbSelectAll.indeterminate = false;
            cbSelectAllIndeterminate.checked = false;
            cbSelectAll.checked = previousValue;
            angular.element(document.getElementById('selectFilterAllCheckbox')).triggerHandler('click');
            angular.element(document.getElementById('selectFilterAllCheckboxIndeterminate')).triggerHandler('click');
        }
      }

*/      
    }


    $scope.filterChangeOper = function (filterOper, loadValue) {
        $scope.placeHolder1stValue = "Inserir valor";
        $scope.displayInput2ndValue = "none";
        $scope.input1stValue = "";
        $scope.input2ndValue = "";
        if (loadValue) {
            if (filterOper == "><" && $scope.parameters.selectedVariables [$scope.idxVariavel].filterList &&
                $scope.parameters.selectedVariables [$scope.idxVariavel].filterList.length == 2) {
                $scope.input1stValue = $scope.parameters.selectedVariables [$scope.idxVariavel].filterList [0] + "";
                $scope.input2ndValue = $scope.parameters.selectedVariables [$scope.idxVariavel].filterList [1] + "";
            } else if ((filterOper == ">" || filterOper == "<" || filterOper == "=" || filterOper == ">=" || filterOper == "<=") &&
                        $scope.parameters.selectedVariables [$scope.idxVariavel].filterList &&
                        $scope.parameters.selectedVariables [$scope.idxVariavel].filterList.length == 1) {
                $scope.input1stValue = $scope.parameters.selectedVariables [$scope.idxVariavel].filterList [0] + "";
            }
        }
        
        switch (filterOper) {
            case ">":   $scope.filterOper = ">";
                        $scope.filterText = "Maiores que:";
                        break
            case "<":   $scope.filterOper = "<";
                        $scope.filterText = "Menores que:";
                        break
            case "=":   $scope.filterOper = "=";
                        $scope.filterText = "Iguais a:";
                        break
            case ">=":  $scope.filterOper = ">=";
                        $scope.filterText = "Maiores ou iguais a:";
                        break
            case "<=":  $scope.filterOper = "<=";
                        $scope.filterText = "Menores ou iguais a:";
                        break
            case "><":  $scope.filterOper = "><";
                        $scope.filterText = "Entre (inclusive):";
                        $scope.placeHolder1stValue = "Menor valor";
                        $scope.displayInput2ndValue = "flex";
                        break
            default:    $scope.filterOper = "";
                        $scope.filterText = "Erro";
                        break
        }

    }

    // Load category: check and load categories to Filter Frame (modal).
    $scope.loadCategories = function (objVar, idxObjVar) {
        console.log("selectVars.submitController: loadCategories clicked -> loadCategories", objVar);

        // Check type of filter, to prepare the window, the frame to select filters
        // 1 - Pré-defined categories. Can be at metadata or in collection. All categories will be presented in a table
        // 2 - Variable values (usually integer values). In this case the filter allow operations like >, <, = ...

        $scope.idxVariavel = idxObjVar; // The variable code
        $scope.codigoVariavel = objVar.varCode; // The variable code
        $scope.anoVariavel = objVar.year; // Year of the variable code
        //$scope.textoDescricaoVar = objVar.description;
        //$scope.textoPopToApplyVar = objVar.popToApply;
        $scope.categoryTableClass = "table-hide"; // class of table. If table-hide, the table won't be showed
        //       $scope.tabActive = "active";
        $scope.textoCategoriaVar = "textoCategoriaVar"; // Text to be presented in the category tab
        //$scope.textoObsVar = objVar.obs;
        $scope.resultFilterOK = "modal"; // Indicates if the frame will be closed ("modal") or not ("")
        $scope.displayLoadMsg = "block"; // Display message of "Loading data" ("block"). Or don't display ("none")
        $scope.displayNumericField = "none"; // Display fields for numeric variables ("block"). Or don't display ("none")
        $scope.displayCategField = "none"; // Display fields for categories in table ("block"). Or don't display ("none")
        $scope.filterAllChecked = true; // Display check in filterAllChecked. Only in variables that have categories
        $scope.displayCBSelectAll = "block";
        $scope.filterAllCheckedIndeterminate = false;
        $scope.displayAllCheckedIndeterminate = "none";


        if (!objVar.filterSelected) {
            objVar.filterSelected = "*";
        } else if (objVar.filterSelected == "-") {
            $scope.filterAllCheckedIndeterminate = true;
            $scope.displayAllCheckedIndeterminate = "block";
            $scope.displayCBSelectAll = "none";
        }

        console.log ("Filter - Tipo dados: ", $scope.parameters.tabela, objVar.filterSelected, objVar.filterList);

        if (objVar.catType == 3 || objVar.catType == 4) {
            // Categorias 3 ou 4 = campo numérico de valor variável. Não possui categorias armazenadas.
            // Prepara tela para filtro de campo variável.
            $scope.textoCategoriaVar = "Campo de valor variável. Escolher operações e valor"; // Text to be presented in the category tab
            $scope.displayLoadMsg = "none"; // Display message of "Loading data" ("block"). Or don't display ("none")
            $scope.displayNumericField = "block";
            $scope.displayCategField = "none";
            //$scope.filterOper = "";

            if (!objVar.filterSelected) {
                // There is no filter for this numeric variable. Start with ">"
                // Check first. If there is arguments (filterList), clean it.
                if (objVar.filterList) {
                    objVar.filterList = [];
                }
                $scope.filterChangeOper (">", false);
            } else if (objVar.filterSelected == "*" || objVar.filterSelected == "-") {
                // Wrong operators for this variable. Clear operator and arguments and start.
                objVar.filterSelected = ""
                if (objVar.filterList) {
                    objVar.filterList = [];
                }
                $scope.filterChangeOper (">", false);
            } else if (objVar.filterSelected == ">" || objVar.filterSelected == "<" || objVar.filterSelected == "=" ||
                       objVar.filterSelected == ">=" || objVar.filterSelected == "<=" || objVar.filterSelected == "><") {
                // Consistência.
                if (objVar.filterSelected == "><") {
                    // Wrong arguments for this variable. Clear operator and arguments and start.
                    if (!objVar.filterList || objVar.filterList.length != 2) {
                        objVar.filterSelected = ""
                        if (objVar.filterList) {
                            objVar.filterList = [];
                        }
                        $scope.filterChangeOper (">", false);
                    } else {
                        // OK. Load operators and arguments.
                        $scope.filterChangeOper (objVar.filterSelected, true);
                    }
                } else if (!objVar.filterList || objVar.filterList.length != 1) { // other operators
                    // Wrong arguments for this variable. Clear operator and arguments and start.
                    objVar.filterSelected = ""
                    if (objVar.filterList) {
                        objVar.filterList = [];
                    }
                    $scope.filterChangeOper (">", false);
                } else {
                    // OK. Load operators and arguments.
                    $scope.filterChangeOper (objVar.filterSelected, true);
                }
            } else {
                // Invalid operators. Clear operator and arguments and start.
                objVar.filterSelected = ""
                if (objVar.filterList) {
                    objVar.filterList = [];
                }
                $scope.filterChangeOper (">", false);
                //$scope.filterChangeOper (objVar.filterSelected, true);
            }
        } else { // // Categorias 1, 2, 5 ou 6. Possui categorias armazenadas nos metadados ou em coleção
            // Consulta categorias da variável no metadados
            $http.get('/categories?coll=' + $scope.parameters.tabela + '&var=' + objVar.varCode +'&ano=' + objVar.year)
            .then (function (response) {
                //console.log ("data", response.data);
                //console.log ("data[0].==> DBNAME ==> ", response.data[0].dbName);

                $scope.dataCat = [];

                if (objVar.catType == 0 || objVar.catType == 5) { // categoria está numa coleção. Busca na coleção.
                    console.log ("Coleção: ", response.data[0].collection.variable.category[0].value, response.data[0].collection.variable.category[0].label);
                    var strColecao = "";

                    // Obtém coleção da categoria
                    if (response.data[0].collection.variable.category[0].value == "col" ||
                        response.data[0].collection.variable.category[0].value == 0)
                    {
                        //console.log ("Vai procurar: ", response.data[0].collection.variable.category[0].label);
                        strColecao = response.data[0].collection.variable.category[0].label
                        //console.log (strColecao);
                        // Consulta categoria na coleção
                        $http.get('/auxiliares?coll=' + strColecao + '&ano=' + objVar.year + '&dbName=' + response.data[0].dbName)
                        .then(function (responseCat) {

                            //console.log ("\n\nresponseCat.data\n\n")
                            //console.log (responseCat.data)
                            if ($scope.filterAllCheckedIndeterminate == true && (objVar.filterList || objVar.filterList[0] != null)) {
                                for (i = 0; i < responseCat.data.length; i++) {
                                    //console.log (responseCat.data [i].State);
                                    if (objVar.filterList.indexOf (responseCat.data [i]._id) >= 0) {
                                        responseCat.data [i].filterChecked = true;
                                    } else {
                                        responseCat.data [i].filterChecked = false;
                                    }
                                }                            
                            } else {
                                for (i = 0; i < responseCat.data.length; i++) {
                                    //console.log (responseCat.data [i].State);
                                    responseCat.data [i].filterChecked = true;
                                }                            
                            }

                            $scope.dataCat = {
                                model: null,
                                category: responseCat.data
                            };
                            
                            $scope.displayLoadMsg = "none";
                            $scope.displayNumericField = "none";
                            $scope.displayCategField = "block";
                
                        }, function myError(responseCat) {
                            console.log('Erro: ' + responseCat.data);
                        });
                    } else {
                        console.log ("Erro: coleção não encontrada!");
                    }
                }

                $scope.textoCategoriaVar = "Campo de valores pré-definidos. Selecione valores.";
                // Preenche categorias.
                switch (objVar.catType) {
                    // Categorias 0 ou 5 = coleção. Dados preenchidos na consulta à coleção.
                    case 0:
                    case 5: $scope.categoryTableClass = "table-show";
                            break;
                    // Categorias 1, 2 ou 6 = categorias pré-definidas, existentes nos metadados
                    case 1:
                    case 2:
                    case 6: $scope.categoryTableClass = "table-show";
                            if ($scope.filterAllCheckedIndeterminate == true && (objVar.filterList || objVar.filterList[0] != null)) {
                                for (i = 0; i < response.data[0].collection.variable.category.length; i++) {
                                    //console.log (responseCat.data [i].State);
                                    if (objVar.filterList.indexOf (response.data[0].collection.variable.category [i].value) >= 0) {
                                        response.data[0].collection.variable.category [i].filterChecked = true;
                                    } else {
                                        response.data[0].collection.variable.category [i].filterChecked = false;
                                    }
                                }                            
                            } else {
                                for (i = 0; i < response.data[0].collection.variable.category.length; i++) {
                                    //console.log (responseCat.data [i].State);
                                    response.data[0].collection.variable.category [i].filterChecked = true;
                                }
                            }
            
                            //console.log ("response.data[0].collection.variable.category;", response.data[0].collection.variable.category)
                            var catAux = [];
                            for (i = 0; i < response.data[0].collection.variable.category.length; i++) {
                                var objCat = {};
                                objCat.value = response.data[0].collection.variable.category [i].value;
                                objCat.label = response.data[0].collection.variable.category [i].label;
                                objCat.filterChecked = response.data[0].collection.variable.category [i].filterChecked
                                catAux.push (objCat);
                            }
                	    console.log ("catAux", catAux)
                            if (objVar.varCode == "CEM_HARM_ANO") {
                               	console.log("Verifica a categoria da variável CEM_HARM_ANO é válida");
				var catTemp = [];
				for (i = 0; i < catAux.length; i++) {
                                  console.log("Verifica ano: ", catAux[i].value);
                                  if (objVar.year.indexOf(parseInt(catAux[i].value)) != -1) {
				      console.log("Ano selecionado: ", catAux[i]);
				      catTemp.push(catAux[i]);
				  } 
			       }
			       catAux = catTemp.slice(0);
			    }
                            $scope.dataCat = {
                                model: null,
                                category: catAux
                            };
                            $scope.displayLoadMsg = "none";
                            $scope.displayNumericField = "none";
                            $scope.displayCategField = "block";
                            break;
                    // Categorias 3 ou 4 = campo numérico de valor variável.
                    case 3: // Não entra aqui...
                    case 4: $scope.textoCategoriaVar = "Campo de valor variável." + '\n' + "Sem categorias!!!";
                            $scope.categoryTableClass = "table-hide";
                            $scope.displayLoadMsg = "none";
                            break;
                    // Senão, categoria desconhecida
                    default: $scope.textoCategoriaVar = "Consultar categorias.";
                             $scope.categoryTableClass = "table-hide";
                             console.log("Categoria desconhecida");
                             $scope.displayLoadMsg = "none";
                             $scope.displayNumericField = "none";
                             $scope.displayCategField = "none";
                             break;
                }
             }, function myError(response) {
                console.log('Error: ' + response.data);
                switch (objVar.catType) {
                case 0:
                case 5: $scope.textoCategoriaVar = "Coleção:";
                    break;
                case 1:
                case 2:
                case 6: $scope.textoCategoriaVar = "Categorias:";
                    break;
                case 3:
                case 4: $scope.textoCategoriaVar = "Campo de valor variável." + '\n' + "Sem categorias";
                    break;
                default: $scope.textoCategoriaVar = "Consultar categorias.";
                    console.log("Sem Estado");
                    break;
                }
            });
        }
    }

    // Function to filter some variable
    $scope.execFilter = function(objVar, objIndex) {
        /*
        console.log("selectVars.submitController: execFilter clicked -> execFilter");
        console.log ("filterAllCheckedIndeterminate:", $scope.filterAllCheckedIndeterminate,
                     "filterAllChecked:", $scope.filterAllChecked)
        console.log ("\nresponseCat.data\n", $scope.dataCat.category)
        console.log ("\nVAR\n", $scope.parameters.selectedVariables [$scope.idxVariavel].varCode)
        console.log ("objVar:", objVar)
        */
        // Check filter
        // 1 - Pré-defined categories. Can be at metadata or in collection. Check if all or none are selected
        // 2 - Variable values (usually integer values). In this case the filter allow operations like >, <, =...
        //      Check if there is a critéria:
        //      - If ">", "<", ">=", "<=" check if value box is filled. If not warn that all will be considered
        //      - If "between", check if max and minimum value is filled else warn that all will be considered
        $scope.resultFilterOK = "modal"; // Fecha modal

        if ($scope.parameters.selectedVariables [$scope.idxVariavel].catType == 3 || $scope.parameters.selectedVariables [$scope.idxVariavel].catType == 4) {
            // Variável numérica.
            // If a max and min number is considered one day, this is the place to check
            if (!$scope.filterOper) {
                console.log ("Erro: não há operação selecionada!");
            } else {
                if ($scope.filterOper == "><") {
                    if (!$scope.input1stValue || !$scope.input2ndValue || $scope.input1stValue.trim () == "" || $scope.input2ndValue.trim () == "") {
                        $scope.resultFilterOK = "";
                        bootbox.alert ({
                            size: "medium",
                            title: "Filtro de variável",
                            message: "<div class='alert alert-warning' role='alert'>Os campos devem ser preenchidos!</div>"
                        });
                    } else {
                        $scope.input1stValue = $scope.input1stValue.trim ();
                        $scope.input2ndValue = $scope.input2ndValue.trim ();
                        if (!$scope.isThisStringInteger ($scope.input1stValue) || !$scope.isThisStringInteger ($scope.input2ndValue)) {
                            $scope.resultFilterOK = "";
                            bootbox.alert ({
                                size: "medium",
                                title: "Filtro de variável",
                                message: "<div class='alert alert-warning' role='alert'>Use apenas números inteiros</div>"
                            });
                        } else {
                            // OK. Keep information and record in variable properties.
                            //console.log 
                            $scope.parameters.selectedVariables [$scope.idxVariavel].filterSelected = $scope.filterOper;
                            $scope.parameters.selectedVariables [$scope.idxVariavel].filterList = [];
                            $scope.parameters.selectedVariables [$scope.idxVariavel].filterList.push (parseInt ($scope.input1stValue));
                            $scope.parameters.selectedVariables [$scope.idxVariavel].filterList.push (parseInt ($scope.input2ndValue));
                        }
                    }
                } else { // >, <, =, >=, <=
                    if (!$scope.input1stValue || $scope.input1stValue.trim () == "") {
                        $scope.resultFilterOK = "";
                        bootbox.alert ({
                            size: "medium",
                            title: "Filtro de variável",
                            message: "<div class='alert alert-warning' role='alert'>O campo deve ser preenchido!</div>"
                        });
                    } else {
                        $scope.input1stValue = $scope.input1stValue.trim ();
                        if (!$scope.isThisStringInteger ($scope.input1stValue)) {
                            $scope.resultFilterOK = "";
                            bootbox.alert ({
                                size: "medium",
                                title: "Filtro de variável",
                                message: "<div class='alert alert-warning' role='alert'>Use apenas números inteiros</div>"
                            });
                        } else {
                            // OK. Keep information and record in variable properties.
                            //console.log 
                            $scope.parameters.selectedVariables [$scope.idxVariavel].filterSelected = $scope.filterOper;
                            $scope.parameters.selectedVariables [$scope.idxVariavel].filterList = [];
                            $scope.parameters.selectedVariables [$scope.idxVariavel].filterList.push (parseInt ($scope.input1stValue));
                        }
                    }
                }
            }
        } else { // Variável com categorias
            if ($scope.filterAllCheckedIndeterminate) {
                // Há categorias selecionadas. Trata lista.
                $scope.parameters.selectedVariables [$scope.idxVariavel].filterList = [];
                $scope.parameters.selectedVariables [$scope.idxVariavel].filterSelected = "-";
                for (i = 0; i < $scope.dataCat.category.length; i++) {
                    if ($scope.dataCat.category [i].filterChecked) {
                        if ($scope.parameters.selectedVariables [$scope.idxVariavel].catType == 0 || $scope.parameters.selectedVariables [$scope.idxVariavel].catType == 5) {
                            $scope.parameters.selectedVariables [$scope.idxVariavel].filterList.push ($scope.dataCat.category [i]._id)
                        } else {
                            $scope.parameters.selectedVariables [$scope.idxVariavel].filterList.push ($scope.dataCat.category [i].value)
                        }
                        
                    }
                }
            } else if ($scope.filterAllChecked) { // Todas as categorias foram selecionadas.
                $scope.parameters.selectedVariables [$scope.idxVariavel].filterSelected = "*";
                $scope.parameters.selectedVariables [$scope.idxVariavel].filterList = [];
            } else {
                // Nenhuma categoria selecionada. Retira do carrinho.
                $scope.parameters.selectedVariables [$scope.idxVariavel].filterSelected = "*";
                $scope.parameters.selectedVariables [$scope.idxVariavel].filterList = [];
                // Retira variável do carrinho.
                $scope.RemoveVar ($scope.parameters.selectedVariables [$scope.idxVariavel], $scope.idxVariavel);
                // Alert
                bootbox.alert ({
                    size: "medium",
                    title: "Filtro de variável",
                    message: "<div class='alert alert-warning' role='alert'>Nenhuma categoria selecionada. Variável removida do carrinho.</div>"
                });
            }
        }
        

        // Verifica seleção:

        /*
        bolExecOK = false;

        if (bolExecOK) {
            $scope.resultFilterOK = "modal"; // Fecha modal
        } else {
            bootbox.alert ({
                size: "medium",
                title: "Filtro de variável",
                message: "<div class='alert alert-warning' role='alert'>Nenhum filtro selecionado</div>"
            });
            $scope.resultFilterOK = ""; // Não fecha modal
            //$scope.categoryTableClass = "table-hide";

        }
        console.log($scope.parameters);
        console.log(objIndex, objVar);
        
        // Consistência. Verifica se há Variáveis de Tema selecionadas (obrigatórios)
        if ($scope.parameters.variaveis == null || $scope.parameters.variaveis[0] == null) {
            bootbox.alert ({
                size: "medium",
                title: "Seleção de variáveis",
                message: "<div class='alert alert-warning' role='alert'>" +
                "  Não há variáveis de tema selecionadas" +
                "</div>"
            });
            return;
        }

        if (!$scope.parameters.selectedVariables) {
            console.log ("Vai criar selectedVariables")
            $scope.parameters.selectedVariables = [];
        }

        for (i=0; i < $scope.parameters.variaveis.length; i++) {
            var objVar = {};
            objVar = JSON.parse($scope.parameters.variaveis[i]).collection.variable;
            // Verifica se variável já foi selecionada.
            var bolExiste = false;
            angular.forEach ($scope.parameters.selectedVariables, function (key,value) {
              if ((key.varCode == objVar.varCode) &&(key.year == objVar.year)) {
                  // Variável já existe na lista de selecionadas
                  bolExiste = true;
              }
            });
            if (!bolExiste) {
                // Variável ainda não existe. Vai incluir na lista.
                $scope.parameters.selectedVariables.push (objVar);

                objTabela = $scope.parameters;
                objParam = {params:objTabela};
                // Desabilita variável selecionada na lista temática, se houver.
                $scope.$emit ("varDisable", objVar);
            }
        }
        */
    } // $scope.execFilter

    $scope.isThisStringInteger = function(strInt) {
        var foundNotInt = false;
        i = 0;

        while (i < strInt.length && !foundNotInt) {
            //console.log (strInt [i]);
            if (strInt [i] in ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) {
                foundNotInt = false;
            } else {
                foundNotInt = true;
            }
            i++;
        }
        return (!foundNotInt);
    }
    
    $scope.submitTESTErem = function(objIndex){
        console.log('selectVars.submitController: testeREM clicked -> testeREM');
        $scope.parameters.selectedVariables.splice (1,1);
        //$scope.parameters.selectedVariables.pop();
        //$scope.parameters.selectedVariables.pop();
    }
        
    $scope.RemoveVar = function(objVar, objIndex){
        console.log('selectVars.submitController: RemoveVar clicked -> RemoveVAR', objVar);
	/*
        if (objVar.mandatory == 1) {
            // Variável obrigatória. Remove tudo.
            console.log ("mandatório!!!")
            var strMsg = "<div class='alert alert-warning' role='alert'>" +
                         " A variável " + objVar.varCode + " é obrigatória. Sua exclusão da lista de variáveis selecionadas " +
                         "resultará na exclusão de todas as variáveis harmonizadas. Continua?" +
                         "</div>";

            bootbox.confirm({
                title: "Exclusão de variável obrigatória",
                message: strMsg,
                buttons: {
                    confirm: {
                        label: 'Continua',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'Cancela',
                        className: 'btn-danger'
                    }
                },
                callback: function (result) {
                    if (result) {
                        // Apaga variáveis selecionadas;
                        console.log("selectVars.submitController: RemoveVar. Vai remover todas as harmonizadas!", objIndex);
                        // Verifica todas as variáveis harmonizadas na lista de selecionadas:
                        // ......
                        var bolTemVar = true;
                        var contador = 0;
                        
                        while (bolTemVar && $scope.parameters.selectedVariables.length > 0) {
                            var bolAchouVar = false;
                            i = 0;
                            console.log ("Tam selecionados: ", $scope.parameters.selectedVariables.length);
                            while (i < $scope.parameters.selectedVariables.length && !bolAchouVar) {
                                objVar = $scope.parameters.selectedVariables [i];
                                if (objVar.original == "padronizada") {
                                    bolAchouVar = true;
                                } else {
                                    i++;
                                }
                            }

                            if (bolAchouVar) {
                                // Encontou variável a ser retirada da lista
                                console.log ("Vai retirar: ", i, " - ", objVar)
                                $scope.parameters.selectedVariables.splice (i, 1);

                                if (objVar.original == "original") {
                                    $scope.$emit ("varEnableThemeSelected", objVar);
                                } else {
                                    $scope.$emit ("varEnableThemePadSelected", objVar);
                                }
                            } else {
                                // Não encontrou mais variáveis a serem retiradas da lista
                                console.log ("==>NÃO TEM MAIS VAR.....")
                                bolTemVar = false;
                            }
                            //if ($scope.parameters.selectedVariables.length == 0) {
                            //    bolTemVar = false;
                            //}
                            if (contador++ > 1000) {
                                console.log ("Saída de segurança!!!")
                                bolTemVar = false;
                            }
                        }

                        // Atualiza session
                        var strURL = "/selectVars/UpdateSess";
                        var objParameters = {
                            abaOriginais:$scope.parameters.abaOriginais,
                            themePad:$scope.parameters.themePad,
                            theme:$scope.parameters.theme,
                            anoAtual:$scope.parameters.ano,
                            selectedVars:$scope.parameters.selectedVariables
                        };

                        $http({
                            method: 'post',
                            url: strURL,
                            data: objParameters
                        }).then(function(httpResponse) {
                            // this callback will be called asynchronously
                            // when the response is available
                            console.log ("RemoveVar: selectVars/UpdateSess RES: ", httpResponse);
                            //$window.location.href = "/";
                        }, function(httpResponse) {
                            // called asynchronously if an error occurs
                            // or server returns response with an error status.
                            console.log ("RemoveVar: Err-selectVars/UpdateSess: ", httpResponse)
                        });

                        // Verifica se variável está na lista de variáveis de tema e "recoloca".
                    } else {
                        // volta tipo de dados anterior
                        console.log("selectVars.submitController: RemoveVar. NÃO vai remover a variável", result);
                        return;
                    }
                }
            });

        } else { */
            console.log("selectVars.submitController: RemoveVar. Vai remover variável:", objIndex);
            $scope.parameters.selectedVariables.splice (objIndex,1);

            // Verifica se variável está na lista de variáveis de tema e "recoloca".
            if (objVar.original == "original") {
                $scope.$emit ("varEnableThemeSelected", objVar);
            } else {
                $scope.$emit ("varEnableThemePadSelected", objVar);
            }
       // }
    }

    // submitQuery generate the sample file to be generated.
    $scope.submitQuery = function() {
        console.log('selectVars.submitController: submit clicked -> submitQuery');
        console.log($scope.parameters);

        // Consistência. Verifica Tipo de arquivo, Ano, Coleção e Variáveis (obrigatórios)
        // Todo: Hierarquia
        // Estado não é obrigatório.
        /*
        if ($scope.parameters.ano == null || $scope.parameters.ano == "") {
            bootbox.alert ({ 
                size: "small",
                title: "Falta informação",
                message: "<h4>Favor selecionar um ano</h4>"});
            //alert("Favor selecionar um ano!!!");
            return;
        }
        */
        if ($scope.parameters.selectedVariables == null || $scope.parameters.selectedVariables[0] == null) {
            bootbox.alert ({ 
                size: "medium",
                title: "Visualizar variáveis",
                message: "<div class='alert alert-warning' role='alert'>" +
                "  Não há variáveis selecionadas!" +
                "</div>"
            });
            // alert("Favor selecionar uma ou mais variáveis");
            return;
        }

        if ($scope.parameters.formatoDados == null || $scope.parameters.formatoDados == "") {
            alert("Favor selecionar um formato de dados");
            return;
        }

        $scope.parameters.email = "";

        var dialog = bootbox.dialog({
            title: 'Prévia e geração do arquivo',
            message: '<p><i class="fa fa-spin fa-spinner"></i>&nbsp;&nbsp;carregando dados...</p>',
            buttons: {
                cancel: {
                    label: "Cancelar",
                    className: 'btn-danger',
                    callback: function(){
                        console.log('Custom cancel clicked');
                    }
                },
                ok: {
                    label: "Gerar arquivo",
                    className: 'btn-info',
                    callback: function(){
                        strEmailRet = $("#inputEmail").val();
                        strFileType = $("input[name=formatoDados]:checked").val();
                        console.log('Custom OK clicked', strEmailRet, " - ", strFileType);
                        $scope.parameters.email = strEmailRet;
                        $scope.parameters.formatoDados = strFileType;

                        // Verificar email
                        strEmailRet = strEmailRet.trim();
                        if (!validateEmail(strEmailRet)) {
                            //console.log ("E-mail inválido!");
                            bootbox.alert ({
                                size: "medium",
                                title: "Prévia e geração do arquivo",
                                message: "<div class='alert alert-warning' role='alert'>" +
                                strEmailRet + ":  E-mail inválido!" +
                                "</div>"
                            });
                            return false;
                        } else {
                            // Gera arquivo e envia e-mail
                            //console.log ("Gera arquivo e envia e-mail!");
                            $scope.submitGeraArquivo();
                        }
                    }
                }
            }
        });
        dialog.init(function(){
            // Atualiza informações na página principal
            $scope.dataQuery = {};
            // Preenche dados do arquivo na tela
            var strURL = "/queryMonet";
            $http({
                method: 'post',
                url: strURL,
                data: $scope.parameters
            }).then(function(httpResponse){
                // *** VERIFICAR: Não está sendo usado mais
                $scope.dataQuery = httpResponse.data;
                //console.log(httpResponse.data);
                console.log('\n\nQuery executed successfully!!');

                var strTeste = ""; // Inclui anos selecionados

                // Gera tabela de amostras:
                var strHTMLVar = "<div style='height:500px;width:100%;overflow-x:auto'>" +
                    "<form>" +
                    "<div class='form-group'>" +
                    " <input id='inputEmail' type='email' name='email' value='' class='form-control is-invalid' aria-describedby='emailHelp' placeholder='Insira o e-mail destino' required>" +
                    " <small id='emailHelp' class='form-text text-muted'>Não compartilharemos seu email com ninguém.</small>" +
                    strTeste +
                    "</div>" +
                    "<div class='form-group'>" +
                    "<table id = 'tabSelectedVariablesModal' class='table table-striped table-condensed' size='10px' style='height:0px;font-size: 11px'>" +
                    "<tr>";

                // Monta cabeçalho.
                var objCabecalho = httpResponse.data [0];
                var objKey = [];
                for (fieldName in objCabecalho) {
                    console.log ("Campo: ", fieldName);
                    strHTMLVar += "<th style='vertical-align:middle;'>" + fieldName + "</th>";
                    objKey.push (fieldName);
                }

                strHTMLVar += "</tr>";

                // Monta linhas
                for (i = 0; i < httpResponse.data.length; i++) {
                    strHTMLVar += "<tr>";
                    //console.log (i, " - ", httpResponse.data[i]);
                    for (j = 0; j < objKey.length; j++) {
                        strHTMLVar += "<td style='vertical-align:middle;'>" + httpResponse.data[i][objKey[j]] +
                                    "</td>";
                    }
                    strHTMLVar += "</tr>";
                }
                
                strHTMLVar += "</table>" +
                            "</div>" +
                            "</form>" +
                            "</div>" +
                            "<div style='text-align:center'>" +
                            "   <h6><b>Opções de arquivo de saida</b></h6>" +
                            "   <div>" +
                            "	  <input id = 'radComma' type='radio' name='formatoDados' value='csv-commas' checked>" +
                            "		&nbsp;CSV delimitado por vírgula" +
                            "	  </input>" +
                            "	  &nbsp;&nbsp;" +
                            "	  <input id = 'radSemi' type='radio' name='formatoDados' value='csv-semicolon'>" +
                            "		&nbsp;CSV delimitado por ponto e vírgula" +
                            "	  </input>" +
                            "   </div>" +
                            "</div>";
                            

                dialog.find('.bootbox-body').html(strHTMLVar);

            }, function(httpResponse) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                $scope.msg = 'Erro na execução da Query'; 
            });

            
        });        
    }


    $scope.submitSelect = function(objVar, objIndex){
        console.log('selectVars.submitController: submit clicked -> submitSelect');
        console.log($scope.parameters);
        console.log(objIndex, objVar);
        
        // Consistência. Verifica se há Variáveis de Tema selecionadas (obrigatórios)
        if ($scope.parameters.variaveis == null || $scope.parameters.variaveis[0] == null) {
            bootbox.alert ({
                size: "medium",
                title: "Seleção de variáveis",
                message: "<div class='alert alert-warning' role='alert'>" +
                "  Não há variáveis de tema selecionadas" +
                "</div>"
            });
            return;
        }

        if (!$scope.parameters.selectedVariables) {
            console.log ("Vai criar selectedVariables")
            $scope.parameters.selectedVariables = [];
        }

        for (i=0; i < $scope.parameters.variaveis.length; i++) {
            var objVar = {};
            objVar = JSON.parse($scope.parameters.variaveis[i]).collection.variable;
            // Verifica se variável já foi selecionada.
            var bolExiste = false;
            angular.forEach ($scope.parameters.selectedVariables, function (key,value) {
              if ((key.varCode == objVar.varCode) &&(key.year == objVar.year)) {
                  // Variável já existe na lista de selecionadas
                  bolExiste = true;
              }
            });
            if (!bolExiste) {
                // Variável ainda não existe. Vai incluir na lista.
                $scope.parameters.selectedVariables.push (objVar);

                objTabela = $scope.parameters;
                objParam = {params:objTabela};
                // Desabilita variável selecionada na lista temática, se houver.
                $scope.$emit ("varDisable", objVar);
            }
        }
    } // $scope.submitSelect

    $scope.submitSelectFromTable = function(objVar, objIndex) {
        console.log('selectVars.submitController: submit clicked -> submitSelect');
        console.log($scope.parameters);
        console.log(objIndex, objVar);
        
        if (!$scope.parameters.selectedVariables) {
            console.log ("Vai criar selectedVariables")
            $scope.parameters.selectedVariables = [];
        }

        var bolExiste = false;
        angular.forEach ($scope.parameters.selectedVariables, function (key,value) {
          if ((key.varCode == objVar.varCode) &&(key.year == objVar.year)) {
              // Variável já existe na lista de selecionadas
              bolExiste = true;
          }
        });
        if (!bolExiste) {
            // Variável ainda não existe. Vai incluir na lista.
            $scope.parameters.selectedVariables.push (objVar);

            // Ordena lista de variáveis selecionadas, de acordo com o definido
            console.log ("\n=>Variáveis Sel:\n", $scope.parameters.selectedVariables);
            $scope.parameters.selectedVariables.sort(functionSortVariables);

            objTabela = $scope.parameters;
            objParam = {params:objTabela};

            // Desabilita variável selecionada na lista temática, se houver.
            if (objVar.original == "original") {
                $scope.$emit ("varDisable", objVar);
            } else {
                $scope.$emit ("varPadDisable", objVar);
            }
        }
    } // submitSelectFromTable

    $scope.$on ("onsubmitSelectFromTable", function(event, data) {
        console.log ("onsubmitSelectFromTable", data);
        $scope.submitSelectFromTable (data);
        //$scope.msgConfirmaGera = "";
        //$scope.texto = "";
        //$scope.fileLink = "";
        //$scope.dataQuery = [];
    });

    /*
    $scope.submitSelectPadFromTable = function(objVar, objIndex) {
        console.log('selectVars.submitController: submit clicked -> submitSelectPadFromTable');
        console.log($scope.parameters);
        console.log(objIndex, objVar);
        
        if (!$scope.parameters.selectedVariables) {
            console.log ("Vai criar selectedVariables")
            $scope.parameters.selectedVariables = [];
        }

        var bolExiste = false;
        angular.forEach ($scope.parameters.selectedVariables, function (key,value) {
          if ((key.varCode == objVar.varCode) &&(key.year == objVar.year)) {
              // Variável já existe na lista de selecionadas
              bolExiste = true;
          }
        });
        if (!bolExiste) {
            // Variável ainda não existe. Vai incluir na lista.
            $scope.parameters.selectedVariables.push (objVar);

            // Ordena lista de variáveis selecionadas, de acordo com o definido
            console.log ("\n=>Variáveis Sel:\n", $scope.parameters.selectedVariables);
            $scope.parameters.selectedVariables.sort(functionSortVariables);
            
            objTabela = $scope.parameters;
            objParam = {params:objTabela};
            // Desabilita variável selecionada na lista temática, se houver.
            $scope.$emit ("varPadDisable", objVar);
        }
    } // submitSelectPadFromTable
    */

    // submitGeraArquivo will generate the file. (/geraArq POST request)
    $scope.submitGeraArquivo = function() {
        console.log('submitController: clicked submit Gera Arquivo. Parâmetros: ', $scope.parameters);

        var arrayCensosOrig = [];

        if ($scope.parameters.selectedVariables == null || $scope.parameters.selectedVariables[0] == null) {
            bootbox.alert ({ 
                size: "medium",
                title: "Gerar arquivo",
                message: "<div class='alert alert-warning' role='alert'>" +
                "  Não há variáveis selecionadas!" +
                "</div>"
            });
            return;
        } else {
            if ($scope.parameters.selectedVariables.length > 0) {
                for (i = 0; i < $scope.parameters.selectedVariables.length; i++) {
                    if (arrayCensosOrig.indexOf ($scope.parameters.selectedVariables[i].yearToShow) == -1
                        && $scope.parameters.selectedVariables[i].yearToShow != "*") {
                        arrayCensosOrig.push ($scope.parameters.selectedVariables[i].yearToShow);
                    }
                }
                console.log ("ARRAY CENSO: ", arrayCensosOrig);
            }
       }
        
        if ($scope.parameters.formatoDados == null || $scope.parameters.formatoDados == "") {
            alert("Favor selecionar um formato de dados");
            return;
        }

        // Informar que tipos de informação será enviado para o email
        var strMsg = "<div class='alert alert-info' role='alert'>" +
            "  Prezado usuário.<br>Você receberá um email contendo links para baixar o arquivo gerado com as variáveis solicitadas, " +
            "o dicionário de dados e os manuais de IBGE correspondentes aos anos dos censos que você selecionou";
        // Verifica se foi escolhido mais de um censo.
        if (arrayCensosOrig.length > 1) {
            strMsg += "<br><br><b>Observação</b>: você escolheu mais de uma edição dos censos demográficos. " +
            "Existe a eventual possibilidade de que duas variáveis com conteúdos distintos recebam " +
            "o mesmo nome e numeração em Bancos de Dados diferentes dos censos. Por esta razão o CEM " +
            "adicionou os seguintes prefixos aos nomes das variáveis quando há a seleção de mais de uma edição:<br><br>" +
            "<b>c60_</b> = variáveis do censo de 1960<br>" +
            "<b>c70_</b> = variáveis do censo de 1970<br>" +
            "<b>c80_</b> = variáveis do censo de 1980<br>" +
            "<b>c91_</b> = variáveis do censo de 1991<br>" +
            "<b>c00_</b> = variáveis do censo de 2000<br>" +
            "<b>c10_</b> = variáveis do censo de 2010";
        }

        strMsg += "</div>";

        bootbox.alert ({
            size: "medium",
            title: "Obrigada por usar o App!",
            message: strMsg
        });

        //console.log("Vai gerar!!");
        var strEmail = $scope.parameters.email;
        //$scope.baixarArq = "";

        var strChosenDB = '/files/geraArqMonet';
        
        $http({
            method: 'post',
            url: strChosenDB,
            data: $scope.parameters
        }).then(function(httpResponse){
            // this callback will be called asynchronously
            // when the response is available
            //var resultado = httpResponse.data;
            var resultado = JSON.parse (httpResponse.data);
            if (resultado.resultado == 1) {
                // Geração do arquivo OK.
                console.log ("Arquivo gerado! : " + resultado.file);
                // Arquivo gerado. Atualiza informações na tela.
                $scope.dataFile = httpResponse.data;
                //$scope.texto = resultado.file;
                //$scope.texto = "";
                //$scope.msgConfirmaGera = "Link para download será enviado para o e-mail:";
                //$scope.baixarArq = strEmail;
                //$scope.fileLink = "files/download/?file=" + resultado.file;
                //$scope.fileLink = "";
            } else {
                // Erro na geração do arquivo.
                console.log ("Erro na geração! : " + resultado.file);
                //$scope.msgConfirmaGera = "Arquivo não gerado";
                //$scope.baixarArq = resultado.file.substring (0,50);
                //$scope.texto = "";
                //$scope.fileLink = "" + resultado.file;
            }

        }, function(httpResponse) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            $scope.msg = 'Erro na geração do arquivo:('; 
        });
    } //$scope.submitGeraArquivo

    // Função usada apenas para teste de submissão
    /*
    $scope.submitGeraArquivo2 = function() {
        console.log('clicked submit Gera Arquivo2');
        console.log($scope.parameters);
        
        $scope.parameters.email = "";

        bootbox.prompt ({
            title: "Favor inserir e-mail destino:",
            inputType: "email",
            callback: function (result) {
                if (!result) {
                    console.log("CANCELADO!");
                } else {
                    console.log("Vai gerar!!");
                    var strEmail = result;
                    // Atualiza informações na página principal
                    //$scope.msgConfirmaGera = "Processando...";
                    //$scope.baixarArq = "";

                    var strChosenDB = '/files/geraArqMonet-2';
                    $scope.parameters.email = strEmail;
                    
                    $http({
                        method: 'post',
                        url: strChosenDB,
                        data: $scope.parameters
                    }).then(function(httpResponse){
                        // this callback will be called asynchronously when the response is available
                        //var resultado = httpResponse.data;
                        var resultado = JSON.parse (httpResponse.data);
                        if (resultado.resultado == 1) {
                            // Geração do arquivo OK.
                            console.log ("Arquivo gerado! : " + resultado.file);
                            // Arquivo gerado. Atualiza informações na tela.
                            $scope.dataFile = httpResponse.data;
                            //$scope.baixarArq = strEmail;
                            //$scope.texto = resultado.file;
                            //$scope.texto = "";
                            //$scope.msgConfirmaGera = "link para download será enviado para o e-mail:";
                            //$scope.fileLink = "files/download/?file=" + resultado.file;
                            //$scope.fileLink = "";
                        } else {
                            // Erro na geração do arquivo.
                            console.log ("Erro na geração! : " + resultado.file);
                            //$scope.msgConfirmaGera = "Arquivo não gerado";
                            //$scope.baixarArq = resultado.file.substring (0,50);
                            //$scope.texto = "";
                            //$scope.fileLink = "" + resultado.file;
                        }

                    }, function(httpResponse) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        $scope.msg = 'Erro na geração do arquivo:('; 
                    });
                }

            }
        });
    } //$scope.submitGeraArquivo2
    */

    $scope.$on ("clearDataQuery", function(event, data) {
        console.log ("Clear Data Query")
        //$scope.msgConfirmaGera = "";
        //$scope.texto = "";
        //$scope.fileLink = "";
        //$scope.dataQuery = [];
    });

}]);

//Add a controller to App to show the list of Brazil's states
/*
selectVars.controller('ufsController', function($scope, $http) {
    // NÃO está mais sendo chamado no início. UFS não está mais sendo usado!
    return;
    console.log ('Run ufsController');
    //console.log ($scope);
    $scope.data = [];
    // A função $http.get ('/ufs') faz a solicitação,
    // então atribuimos o resultado a $scope.data

    $http.get('/ufs')
    .then(function (response){        
        $scope.data = {
            model: null,
            ufs: response.data
        };
     }, function myError(response) {
        console.log('Error: ' + response.data);
    });

    $scope.$on ("callFillUFs", function(event, data) {
        console.log ("on callFillUFs: " + data.params.ano);

        $http.get('/ufs', data)
        .then(function (response){        
            //console.log (response.data);
            $scope.data = {
                model: null,
                ufs: response.data
            };
        }, function myError(response) {
            console.log('Error: ' + response.data);    
        });

        $scope.parameters.estado = "";
        
    });

    $scope.changeUF = function () {
        console.log ("changeUF: " + $scope.parameters.estado);
        $scope.$emit ("clearDataQuery", objParam);
    }
});
*/

//Add a controller to App to show the census's themes
selectVars.controller('themeController',['$scope', '$rootScope', '$http', listThemes]);

function listThemes($scope, $rootScope, $http) {

    $rootScope.$on ("callFillThemes", function(event, data) {
        console.log ("on callFillThemes: " + $scope.parameters);

        $http.get('/theme', data)
        .then(function (response){        
            console.log (response.data);
            $scope.data = {
                model: null,
                themes: response.data
            };
        }, function myError(response) {
            console.log('Error: ' + response.data);    
        });

        $scope.parameters.theme = "";
    });

    // função chamada toda vez q altera ano do cesnso
    $scope.changeTheme = function () {
        //console.log ("on changeTheme - back: " + JSON.parse ($scope.parameters.theme).label);
        objTabela = $scope.parameters;
        objParam = {params:objTabela};
        console.log ("on changeTheme - back: " + objParam);
        
        $scope.$emit ("callFillVar", objParam);
        
        // Preenche a lista de UFs de acordo com o ano *** Não está mais sendo chamado!
        //$rootScope.$broadcast ("callFillUFs", objParam);
        // Clear Data Query
        $rootScope.$broadcast ("clearDataQuery", objParam);
    }

    $scope.$on ("callChangeTheme", function(event, data) {
        console.log ("on callChangeTheme: ");
        $scope.changeTheme ();
    });

};

//Add a controller to App to show the censos's themes (padronizadas)
selectVars.controller('themePadController',['$scope', '$rootScope', '$http', listThemesPad]);

function listThemesPad($scope, $rootScope, $http) {

    $rootScope.$on ("callFillThemesPad", function(event, data) {
        console.log ("on callFillThemesPad: " + $scope.parameters);

        $http.get('/themePad', data)
        .then(function (response){        
            console.log (response.data);
            $scope.data = {
                model: null,
                themesPad: response.data
            };
        }, function myError(response) {
            console.log('Error: ' + response.data);    
        });

        $scope.parameters.themePad = "";
    });
    
    // função chamada toda vez q altera ano do cesnso
    $scope.changeThemePad = function () {
        //console.log ("on changeTheme - back: " + JSON.parse ($scope.parameters.theme).label);
        objTabela = $scope.parameters;
        objParam = {params:objTabela};
        console.log ("on changeThemePad - back: ", objParam);
        
        $scope.$emit ("callFillVarPad", objParam);
        
        // Preenche a lista de UFs de acordo com o ano *** Não está mais sendo chamado!
        //$rootScope.$broadcast ("callFillUFs", objParam);
        // Clear Data Query
        // CLOVIS - PAD???
        $rootScope.$broadcast ("clearDataQuery", objParam);
    }

    $scope.$on ("callChangeThemePad", function(event, data) {
        console.log ("on callChangeThemePad: ");
        $scope.changeThemePad ();
    });
};


//Add a controller to App to show the census's years
selectVars.controller('yearsController',['$scope', '$rootScope', '$http', listYears]);

function listYears($scope, $rootScope, $http) {

    $http.get('/year')
    .then(function (response){
        // build object to fill year combo
        var objYear = [];
        for (i = 0; i < response.data.length; i++) {
            var elementYear = {};
            elementYear.codYear = response.data [i]._id;
            elementYear.year = response.data [i].year;
            objYear.push (elementYear);
        }
        $scope.data = {
            model: null,
            years: objYear
        };
        // console.log ($scope.data.years);

     }, function myError(response) {
        console.log('YEAR Error: ' + response.data);    
    });
    
    // função chamada toda vez q altera ano do cesnso
    $scope.changeCenso = function (censoAno) {
        $scope.parameters.ano = censoAno;
        console.log ("yearsController/changeCenso: " + $scope.parameters.ano);
        objTabela = $scope.parameters;
        objParam = {params:objTabela};

        // Preenche a lsita de coleções
        $scope.$emit ("callFillVar", objParam);
        
        // Preenche a lista de UFs de acordo com o ano *** Não está mais sendo chamado!
        //$rootScope.$broadcast ("callFillUFs", objParam);
        // Clear Data Query
        $rootScope.$broadcast ("clearDataQuery", objParam);
    }
};

//Add a controller to App to show the census's tables
selectVars.controller('tablesController', function ($scope, $rootScope, $http) {

    console.log ('Run tablesController');

    $scope.data = [];

    $scope.updateVars = function () {
        console.log ("Mudou coleção. ", $scope.parameters.tabela);
        if (($scope.parameters.tabelaAnt) || ($scope.parameters.tabelaAnt == "")) {
            console.log ("Tem tabela anterior: ", $scope.parameters.tabelaAnt);
        } else {
            console.log ("Não tem tabela anterior. Vai criar.");
            $scope.parameters.tabelaAnt = "";
        }
        // Verifica se existem variáveis selecionadas:
        if (($scope.parameters.selectedVariables != null) && 
            ($scope.parameters.selectedVariables[0] != null)) {
            bootbox.confirm({
                title: "Alteração de tipo de dados",
                message: "<div class='alert alert-warning' role='alert'>" +
                "  Há variáveis selecionadas. A mudança de tipo de dados descartará essas variáveis!" +
                "</div>",
                buttons: {
                    confirm: {
                        label: 'Continua',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'Cancela',
                        className: 'btn-danger'
                    }
                },
                callback: function (result) {
                    if (result) {
                        // Apaga variáveis selecionadas;
                        console.log('RESULTADO MUDANÇA DADOS: Apaga selecionados 1' + result);
                        objTabela = $scope.parameters;
                        objParam = {params:objTabela};
                        console.log(objParam.params);
                        $scope.parameters.selectedVariables = [];
                        $scope.parameters.tabelaAnt = $scope.parameters.tabela;
                        $scope.$emit ("callFillThemesPad", objParam);
                        $scope.$emit ("callFillThemes", objParam);
                        $scope.$emit ("callFillVar", objParam);
                        $scope.$emit ("clearDataQuery", objParam);
                    } else {
                        // volta tipo de dados anterior
                        console.log('RESULTADO MUDANÇA DADOS: Volta anterior e retorna. ' + result);
                        $scope.parameters.tabela = $scope.parameters.tabelaAnt;
                        return;
                    }
                }
            });
        } else {
            $scope.parameters.tabelaAnt = $scope.parameters.tabela;
            objTabela = $scope.parameters;
            objParam = {params:objTabela};
            console.log(objParam.params);
            $scope.$emit ("callFillThemesPad", objParam);
            $scope.$emit ("callFillThemes", objParam);
            $scope.$emit ("callFillVar", objParam);
            $scope.$emit ("clearDataQuery", objParam);
        }
    }

    // Função para limpar dados na tela.
    $scope.submitLimpa = function () {
        console.log ("submitLimpa", $scope.parameters.tabela);
        if (($scope.parameters.tabelaAnt) || ($scope.parameters.tabelaAnt == "")) {
            console.log ("Tem tabela anterior: ", $scope.parameters.tabelaAnt);
        } else {
            console.log ("Não tem tabela anterior. Vai criar.");
            $scope.parameters.tabelaAnt = "";
        }
        // Verifica se existem variáveis selecionadas:
        if (($scope.parameters.selectedVariables != null) && 
            ($scope.parameters.selectedVariables[0] != null)) {
            bootbox.confirm({
                title: "Reinício dos dados da aplicação",
                message: "Há variáveis selecionadas. O procedimento de reinício descartará essas variáveis!",
                buttons: {
                    confirm: {
                        label: 'Continua',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'Cancela',
                        className: 'btn-danger'
                    }
                },
                callback: function (result) {
                    if (result) {
                        // Apaga variáveis selecionadas;
                        //console.log('RESULTADO MUDANÇA DADOS: Apaga selecionados 1' + result);
                        //$scope.parameters.tabela = "";
                        objTabela = $scope.parameters;
                        objParam = {params:objTabela};
                        //console.log(objParam.params);
                        $scope.parameters.selectedVariables = [];
                        //$scope.parameters.tabelaAnt = $scope.parameters.tabela;
                        $scope.parameters.theme = "";
                        $scope.parameters.themePad = "";
                        $scope.parameters.ano = "";

                        //$scope.$emit ("callFillThemes", objParam);
                        $scope.$emit ("callFillVar", objParam);
                        $scope.$emit ("callFillVarPad", objParam);
                        //$scope.$emit ("clearDataQuery", objParam);
                    } else {
                        // volta tipo de dados anterior
                        console.log('RESULTADO MUDANÇA DADOS: Volta anterior e retorna. ' + result);
                        $scope.parameters.tabela = $scope.parameters.tabelaAnt;
                        return;
                    }
                }
            });
        } else {
            //$scope.parameters.tabelaAnt = $scope.parameters.tabela;
            //$scope.parameters.tabela = "";
            objTabela = $scope.parameters;
            objParam = {params:objTabela};
            //console.log(objParam.params);
            $scope.parameters.theme = "";
            $scope.parameters.themePad = "";
            $scope.parameters.ano = "";

            //$scope.$emit ("callFillThemes", objParam);
            $scope.$emit ("callFillVar", objParam);
            $scope.$emit ("callFillVarPad", objParam);
            //$scope.$emit ("clearDataQuery", objParam);
        }
    }

    /*
    $scope.$on ("callFillTables", function(event, data) {
        console.log ("on callFillTables: " + data.params.ano);
        $scope.data = [];

        $http.get ('/collection', data)
        .then(function (response){
            //console.log (response.data);
            $scope.data = {
                model: null,
                colecoes: response.data
            };
        }, function myError(response) {
            console.log('Error: ' + response.data);    
        });
        
        
        // Associa vazio para apagar tabela que está selecionada!
        $scope.parameters.tabela = "";
        objTabela = $scope.parameters;
        objParam = {params:objTabela};
        // Atualiza variáveis
        $scope.$emit ("callFillVar", objParam);
        
        //$scope.$apply (function () {
        //    $scope.parameters.tabela = "";
        //});
        
        
    });
    */

    $scope.$on ("callUpdateVars", function(event, data) {
        console.log ("on callUpdateVars: ");
        $scope.updateVars ();
    });

    if ($scope.parameters.tabela) {
        $scope.updateVars ();
    }

});

//Add a controller to App to show the list of table's variable
selectVars.controller('variaveisController', function($scope, $rootScope, $http) {
    $scope.data = [];
    // A função $http.get ('/variaveis') faz a solicitação,
    // então atribuimos o resultado a $scope.data
    console.log ('Run variaveisController');
    console.log($scope.parameters);

    $http.get('/variaveis')
    .then(function (response){
        // console.log (response.data);
        $scope.data = {
            model: null,
            variaveis: response.data
        };
     }, function myError(response) {
        console.log('Error: ' + response.data);    
    });

    // Preenche lista de variáveis (de tema)
    $rootScope.$on ("callFillVar", function(event, data) {
        console.log ('on callFillVar');
        $http.get('/variaveis', data)
        .then(function (response){
            //$scope.data.variaveis = "";
            if ($scope.data.variaveis[1] != null) {
              console.log ($scope.data.item)
            }
            
            console.log ('CallFillVar: $http.get /variaveis - response.data');
            var intThemeId = 0;
            if (data.params.theme) {
                // Tema foi escolhido
                console.log (JSON.parse(data.params.theme).label);
                $scope.temaEscolhido = " (" + JSON.parse(data.params.theme).label + ")";
                intThemeId = JSON.parse(data.params.theme).themeId;
                console.log ("COD:", intThemeId);
                if (intThemeId == 95) {
                    console.log ("VAR PADR!!");
                    for (j = 0; j < response.data.length; j++) {
                        response.data[j].collection.variable.yearToShow = strAllYears;
                    }
                }
            } else {
                $scope.temaEscolhido = "";
            }

            // Verifica se alguma variável está na lista de selecionadas.
            // Se estiver, carrega desabilitada.
            if ($scope.parameters.selectedVariables) {
                if ($scope.parameters.selectedVariables.length > 0) {
                    for (i = 0; i < $scope.parameters.selectedVariables.length; i++) {
                        for (j = 0; j < response.data.length; j++) {
                            if (($scope.parameters.selectedVariables[i].varCode == response.data[j].collection.variable.varCode) &&
                               ($scope.parameters.selectedVariables[i].yearToShow == response.data[j].collection.variable.yearToShow)) {
                                   response.data[j].collection.variable.disabled = "option-selected";
                            }
                        }
                    }


                } else {
                    console.log ("Lista de selecionadas vazia")
                }
            } else {
                console.log ("Lista de selecionadas não existe")
            }

            $scope.data = {
                model: null,
                variaveis: response.data
            };
            $scope.data.selected = 0;
            
        }, function myError(response) {
            console.log('Error ($http.get /callFillVar): ' + response.data);    
        });
    })
    
    $rootScope.$on ("varEnableThemeSelected", function(event, data) {
        console.log ('on varEnableThemeSelected: ', data.year, '-', data.varCode);
        //console.log ($scope.data.variaveis);

        var bolAchou = false;
        var i = 0;
        while ((i < $scope.data.variaveis.length) && (!bolAchou)) {
            if (($scope.data.variaveis[i].collection.variable.varCode == data.varCode) &&
                ($scope.data.variaveis[i].collection.variable.yearToShow == data.yearToShow)) {
                    // Encontrou variável. Habilita.
                    $scope.data.variaveis[i].collection.variable.disabled = "";
                    $scope.data.variaveis[i].collection.variable.checked = false;
                    bolAchou = true;
            };
            i++;
        }
    })

    // Desabilita variável na lista de variáveis de tema.
    $rootScope.$on ("varDisable", function(event, data) {
        console.log ('on varDisable: ', data.year, '-', data.varCode);
        //console.log ($scope.data.variaveis);

        var bolAchou = false;
        var i = 0;
        // Faz busca linear e todas as variáveis da lista de tema, até encontrar ou até o fim.
        while ((i < $scope.data.variaveis.length) && (!bolAchou)) {
            if (($scope.data.variaveis[i].collection.variable.varCode == data.varCode) &&
                ($scope.data.variaveis[i].collection.variable.yearToShow == data.yearToShow)) {
                    // Encontrou. Desabilita (associa à classe de selecionado)
                    $scope.data.variaveis[i].collection.variable.disabled = "option-selected";
                    // Variável já existe na lista de selecionadas
                    bolAchou = true;
            };
            i++;
        }
    })
});


//Add a controller to App to show the list of table's variable
selectVars.controller('variaveisPadController', function($scope, $rootScope, $http) {
    $scope.data = [];
    // A função $http.get ('/variaveis') faz a solicitação,
    // então atribuimos o resultado a $scope.data
    console.log ('Run variaveisPadController');
    console.log($scope.parameters);

    $http.get('/variaveisPad')
    .then(function (response){
        console.log ('VariaveisPadController:', response.data.length);
        // console.log (response.data);
        $scope.data = {
            model: null,
            variaveisPad: response.data
        };
     }, function myError(response) {
        console.log('Error: ' + response.data);
    });

    // Preenche lista de variáveis (de tema)
    $rootScope.$on ("callFillVarPad", function(event, data) {
        console.log ('on callFillVarPad');
        $http.get('/variaveisPad', data)
        .then(function (response){
            //$scope.data.variaveis = "";
            if ($scope.data.variaveisPad[1] != null) {
              console.log ($scope.data.item)
            }
            
            console.log ('callFillVarPad: $http.get /variaveisPad - response.data');
            var intThemeId = 0;
            if (data.params.themePad) {
                // Tema foi escolhido
                console.log (JSON.parse(data.params.themePad).label);
                $scope.temaEscolhido = " (" + JSON.parse(data.params.themePad).label + ")";
                intThemeId = JSON.parse(data.params.themePad).themeId;
                console.log ("COD:", intThemeId);
                for (j = 0; j < response.data.length; j++) {
                    response.data[j].collection.variable.yearToShow = strAllYears;
                    console.log ("YEARS:", response.data[j])
                }
            } else {
                $scope.temaEscolhido = "";
            }

            // Verifica se alguma variável está na lista de selecionadas.
            // Se estiver, carrega desabilitada.
            if ($scope.parameters.selectedVariables) {
                if ($scope.parameters.selectedVariables.length > 0) {
                    for (i = 0; i < $scope.parameters.selectedVariables.length; i++) {
                        for (j = 0; j < response.data.length; j++) {
                            if (($scope.parameters.selectedVariables[i].varCode == response.data[j].collection.variable.varCode) &&
                               ($scope.parameters.selectedVariables[i].yearToShow == response.data[j].collection.variable.yearToShow)) {
                                   response.data[j].collection.variable.disabled = "option-selected";
                            }
                        }
                    }
                } else {
                    console.log ("Lista de selecionadas vazia")
                }
            } else {
                console.log ("Lista de selecionadas não existe")
            }

            $scope.data = {
                model: null,
                variaveisPad: response.data
            };
            $scope.data.selected = 0;
            
        }, function myError(response) {
            console.log('Error ($http.get /callFillVar): ' + response.data);    
        });
    })
    
    $rootScope.$on ("varEnableThemePadSelected", function(event, data) {
        console.log ('on varEnableThemePadSelected: ', data.year, '-', data.varCode);
        //console.log ($scope.data.variaveisPad);

        var bolAchou = false;
        var i = 0;
        while ((i < $scope.data.variaveisPad.length) && (!bolAchou)) {
            if (($scope.data.variaveisPad[i].collection.variable.varCode == data.varCode) &&
                ($scope.data.variaveisPad[i].collection.variable.yearToShow == data.yearToShow)) {
                    // Encontrou variável. Habilita.
                    $scope.data.variaveisPad[i].collection.variable.disabled = "";
                    $scope.data.variaveisPad[i].collection.variable.checked = false;
                    bolAchou = true;
            };
            i++;
        }
    })

    // Desabilita variável na lista de variáveis de tema.
    $rootScope.$on ("varPadDisable", function(event, data) {
        console.log ('on varPadDisable: ', data.year, '-', data.varCode);
        //console.log ($scope.data.variaveisPad);

        var bolAchou = false;
        var i = 0;
        // Faz busca linear e todas as variáveis da lista de tema, até encontrar ou até o fim.
        while ((i < $scope.data.variaveisPad.length) && (!bolAchou)) {
            if (($scope.data.variaveisPad[i].collection.variable.varCode == data.varCode) &&
                ($scope.data.variaveisPad[i].collection.variable.yearToShow == data.yearToShow)) {
                    // Encontrou. Desabilita (associa à classe de selecionado)
                    $scope.data.variaveisPad[i].collection.variable.disabled = "option-selected";
                    // Variável já existe na lista de selecionadas
                    bolAchou = true;
            };
            i++;
        }

        for (i = 0; i < $scope.data.variaveisPad.length; i++) {
            console.log ("Vai verificar variável obrigatória!", $scope.data.variaveisPad[i].collection.variable)
            if (($scope.data.variaveisPad[i].collection.variable.mandatory == 1) &&
                ($scope.data.variaveisPad[i].collection.variable.disabled == "")) {
                // Variável é obrigatória e não está selecionada. Seleciona automaticamente.
                console.log ("Encontrou variável harm. obrigatória!", $scope.data.variaveisPad[i].collection.variable)
                $scope.$emit ("onsubmitSelectFromTable", $scope.data.variaveisPad[i].collection.variable);
            }
        }
    })
});

//selectVars.controller('variaveisController', function($scope, $rootScope, $http) {
    
//selectVars.controller('censosController',['$scope', '$rootScope', '$http', listCensos]);

selectVars.controller('censosController', function listCensos($scope, $rootScope, $http) {

    console.log ('Run censosController');

    $http.get('/year')
    .then(function (response){
        // build object to fill year combo
        console.log ('Return get /year OK');
        var objYear = [];
        for (i = 0; i < response.data.length; i++) {
            var elementYear = {};
            elementYear.codYear = response.data [i]._id;
            elementYear.year = response.data [i].year;
            // elementYear.description = "Censo de " + response.data [i].year + " - características etc etc etc."
            elementYear.description = "Censo de " + response.data [i].year;
            objYear.push (elementYear);
        }
        $scope.data = {
            model: null,
            censos: objYear
        };
        // console.log ($scope.data.years);

     }, function myError(response) {
        console.log('YEAR Error: ' + response.data);    
    });
});

/********* ***********************************************************************/
/********* ***********************************************************************/
