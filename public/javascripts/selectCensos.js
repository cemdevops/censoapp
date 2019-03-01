// The "selectCensos" parameter refers to an HTML element in which the application will run.
// The [] parameter in the module definition can be used to define dependent modules.
// Without the [] parameter, you are not creating a new module, but retrieving an existing one.
var selectCensos = angular.module('selectCensos',[]); // 'ui.router'

// Controller to capture the main form (current all page) submit to generate file sample and generate file
//selectCensos.controller('generalController',['$scope', '$rootScope', '$state', '$http', '$window', function ($scope, $rootScope, $state, $http, $window) {
selectCensos.controller('generalController',['$scope', '$rootScope', '$http', '$window', function ($scope, $rootScope, $http, $window) {

    console.log('selectCensos: generalController');
    // Execução inicial. Cria $scope.parameters
    $scope.parameters = {};

    /*
    $scope.parameters = {};
    $scope.parameters.formatoDados = "csv-commas";
    $scope.parameters.selectedCensos = [];
    $scope.parameters.tPesClicked = false;
    $scope.parameters.tDomClicked = false;
    if ($scope.parameters) {
        console.log('selectCensos: generalController: TEM tabela');
        $scope.parameters.tabela = "";
    } else {
        console.log('selectCensos: generalController: Não tem parameters');

        $scope.parameters = {};
    //    $scope.parameters.formatoDados = "csv-commas";
        $scope.parameters.selectedCensos = [];
        $scope.parameters.tPesClicked = false;
        $scope.parameters.tDomClicked = false;
        $scope.parameters.tabela = "";
    }
    */

    // Recupera dados de sessão, se existe
    $http.get('/getSess')
    .then(function (res){
        console.log ("generalController/getSess: ", res.data);
        $scope.parameters.tabela = res.data.col;
        if (res.data.col == "tPes") {
            console.log ("generalController/getSess: tPES OK");
            $scope.parameters.tPesClicked = true;
            $scope.parameters.tDomClicked = false;
            $scope.parameters.tabela = "tPes";
            $scope.parameters.tabelaAnt = "tPes";
        } else if (res.data.col == "tDom") {
            console.log ("generalController/getSess: tDOM OK");
            $scope.parameters.tPesClicked = false;
            $scope.parameters.tDomClicked = true;
            $scope.parameters.tabela = "tDom";
            $scope.parameters.tabelaAnt = "tDom";
        } else {
            console.log ("generalController/getSess: Sem tipo de dados selecionado!");
            $scope.parameters.tPesClicked = false;
            $scope.parameters.tDomClicked = false;
            $scope.parameters.tabela = "";
            $scope.parameters.tabelaAnt = "";
        }
        $scope.parameters.selectedCensos = res.data.censos2;
        if (res.data.censos2 && res.data.censos2 [0] != null) {
            $scope.parameters.selectedCensosAnt = [];
            for (i = 0; i < res.data.censos2.length; i++) {
                $scope.parameters.selectedCensosAnt.push (res.data.censos2 [i]);
            }
        } else {
            $scope.parameters.selectedCensosAnt = res.data.censos2;
        }
        $scope.parameters.selectedVars = res.data.selectedVars;
        $scope.parameters.theme = res.data.theme;
        $scope.parameters.themePad = res.data.themePad;
        $scope.parameters.anoAtual = res.data.anoAtual;

        console.log ("SeletedCensos: ",$scope.parameters.selectedCensos);
        if ($scope.parameters.censos && $scope.parameters.censos.length > 0) {
            console.log ("==> generalController/getSess: chama onfillCensosTable!");
            $scope.$broadcast ("onfillCensosTable");
        } else {
            console.log ("==> generalController/getSess: NÃO precisou chamar onfillCensosTable!");
        }
        
     }, function myError(res) {
        console.log('Error: ' + res.data);
    });

    // InfoCenso: preenche modal com dados do censo e habilita apresentação.
    $scope.InfoCenso = function(objVar){
        console.log('selectCensos.generalController: InfoCenso clicked -> ', objVar);

        $scope.codigoVariavel = objVar.varCode;
        $scope.anoVariavel = objVar.year;
        // $scope.textoDescricaoVar = objVar.description;
        $scope.textoLabelVar = objVar.label;
        $scope.textoPopToApplyVar = objVar.popToApply;
        $scope.categoryTableClass = "table-hide";
        //       $scope.tabActive = "active";
        $scope.textoObsVar = objVar.obs;
    }
    
/*
    $scope.$on ("clearDataQuery", function(event, data) {
        console.log ("Clear Data Query")
        $scope.msgConfirmaGera = "";
        $scope.texto = "";
        $scope.fileLink = "";
        $scope.dataQuery = [];
    });
*/

    // Função para limpar dados na tela.
    $scope.submitLimpa = function () {

        console.log ("submitLimpa", $scope.parameters);

        $scope.parameters.tDomClicked = false;
        $scope.parameters.tPesClicked = false;
        

        // Verifica se tem coleção selecionada
        if ($scope.parameters.tabela != null && $scope.parameters.tabela != "") {
            $scope.parameters.tabela = "";
        }
        
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
                        console.log('RESULTADO MUDANÇA DADOS: Apaga selecionados 1' + result);
                        $scope.parameters.tabela = "";
                        objTabela = $scope.parameters;
                        objParam = {params:objTabela};
                        //console.log(objParam.params);
                        $scope.parameters.selectedVariables = [];
                        //$scope.parameters.tabelaAnt = $scope.parameters.tabela;
                        //$scope.$emit ("callFillThemes", objParam);
                        //$scope.$emit ("callFillVar", objParam);
                        //$scope.$emit ("clearDataQuery", objParam);
                        $scope.$broadcast ("onRemoveAllCensosFromSelectedList", objParam);
                        
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
            $scope.parameters.tabela = "";
            objTabela = $scope.parameters;
            objParam = {params:objTabela};
            //console.log(objParam.params);
            //$scope.$emit ("callFillThemes", objParam);
            //$scope.$broadcast ("callFillVar", objParam);
            //$scope.$emit ("clearDataQuery", objParam);
            if ($scope.parameters.selectedCensos != null && $scope.parameters.selectedCensos [0] != null) {
                $scope.$broadcast ("onRemoveAllCensosFromSelectedList", objParam);
            }
        }
    } // $scope.submitLimpa

    // Função para confirmar censos selecionados e redirecionar.
    $scope.confSelectCensos = function () {
        console.log ("confSelectCensos", $scope.parameters);

        if ($scope.parameters.tabela == null || $scope.parameters.tabela == "") {
            bootbox.alert ({
                size: "medium",
                title: "Falta informação",
                message: "<h4>Não há tipo de dados selecionado</h4>"});
            return;
        }
        if ($scope.parameters.selectedCensos == null || $scope.parameters.selectedCensos [0] == null) {
            bootbox.alert ({
                size: "medium",
                title: "Falta informação",
                message: "<h4>Não há censo selecionado</h4>"});
            return;
        }

        //console.log ("tabela: ", $scope.parameters.tabela, $scope.parameters.tabelaAnt);
        //console.log ("tabelaAnt: ", $scope.parameters.tabelaAnt);
        //console.log ("selectedCensos: ", $scope.parameters.selectedCensos);
        //console.log ("selectedVars: ", $scope.parameters.selectedVars)

        var bolNewTable = false; // Indica se houve troca de tipo de dados
        var bolChangeSelectedVars = false; // Indica se precisa descartar variáveis selecionadas
        var bolChangedCensus = false; // Indica se algum censo foi retirado da lista
        var arrayCensos = [];

        // Verifica se houve alteração de tipo de dados
        if (($scope.parameters.tabelaAnt != "") && ($scope.parameters.tabelaAnt != $scope.parameters.tabela)) {
            bolNewTable = true;
        }

        // Constrói array de censos
        for (i = 0; i < $scope.parameters.selectedCensos.length; i++) {
            arrayCensos.push ($scope.parameters.selectedCensos[i].year);
        }
        console.log ("arrayCensos: ", arrayCensos);

        // Verifica se censos foram alterados
        if ($scope.parameters.selectedCensosAnt && $scope.parameters.selectedCensosAnt [0] != null) {
            for (i = 0; i < $scope.parameters.selectedCensosAnt.length; i++) {
                console.log ("Censo anterior: ", $scope.parameters.selectedCensosAnt [i].year)
                if (arrayCensos.indexOf ($scope.parameters.selectedCensosAnt [i].year) == -1) {
                    bolChangedCensus = true;
                }
            }

            i = 0;
            while (!bolChangedCensus && i < arrayCensos.length) {
                bolChangedCensus = true;
                for (j = 0; j < $scope.parameters.selectedCensosAnt.length; j++) {
                    if (arrayCensos [i] == $scope.parameters.selectedCensosAnt [j].year) {
                        bolChangedCensus = false;
                    }
                }
                i++;
            }
        }
        
        if ($scope.parameters.selectedVars && $scope.parameters.selectedVars.length > 0) {
            console.log ("tem selectedVars");
            if (bolNewTable) {
                console.log ("Trocou tabela!!! Change");
                // Trocou tipo de dados e tem variáveis selecionadas. Precisa descartar.
                bolChangeSelectedVars = true;
            } else if (bolChangedCensus) { // Verifica se anos de variáveis selecionadas foram descartadas.
                console.log ("NÃO Trocou tabela mas alterou censos!");
                // Não trocou tipo de dados, mas pode haver variável cujo ano não está mais selecionado.
                console.log ("SELECTED VARS: ", $scope.parameters.selectedVars)
                for (i = 0; i < $scope.parameters.selectedVars.length; i++) {
                    if ($scope.parameters.selectedVars [i].original == "original") {
                        if (arrayCensos.indexOf ($scope.parameters.selectedVars [i].year) == -1) {
                            console.log ("NÃO encontrou ", $scope.parameters.selectedVars [i].year, " em arrayCensois");
                            bolChangeSelectedVars = true;
                        } else {
                            console.log ("Encontrou ", $scope.parameters.selectedVars [i].year, " em arrayCensois");
                        }
                    } else if ($scope.parameters.selectedVars [i].original == "padronizada") {
                        console.log ("Encontrou variáveis harmonizadas: ", $scope.parameters.selectedVars [i].varCode);
                        bolChangeSelectedVars = true;
                    }
                }
            }
        }

        if (bolChangeSelectedVars) { // Confirma se vai descartar variáveis selecionadas
            bootbox.confirm({
                title: "Alteração de tipo de dados e censos",
                message: "<div class='alert alert-warning' role='alert'>" +
                "  Há variáveis selecionadas que serão descartadas com a mudança realizada. Continua?" +
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
                        // Apaga variáveis selecionadas e continua na seleção de variáveis;
                        var strAux = "[";
                        for (i = 0; i < $scope.parameters.selectedCensos.length; i++) {
                            if (i == 0) {
                                strAux += $scope.parameters.selectedCensos [i].year;
                            } else {
                                strAux += "," + $scope.parameters.selectedCensos[i].year;
                            }
                        }
                        strAux += "]";

                        $scope.parameters.selectedVars = [];
                        if (bolNewTable) {
                            $scope.parameters.theme = "";
                            $scope.parameters.themePad = "";
                        }

                        if (arrayCensos.indexOf ($scope.parameters.anoAtual) == -1) {
                            $scope.parameters.anoAtual = "";
                        }

                        var strURL = "/UpdateSess";
                        var objParameters = {
                            tabela:$scope.parameters.tabela,
                            censos:strAux,
                            censos2:$scope.parameters.selectedCensos,
                            theme:$scope.parameters.theme,
                            themePad:$scope.parameters.themePad,
                            anoAtual:$scope.parameters.anoAtual,
                            selectedVars: $scope.parameters.selectedVars
                        };

                        $http({
                            method: 'post',
                            url: strURL,
                            data: objParameters
                        }).then(function(httpResponse){
                            console.log ("UpdtSes-Res: ", httpResponse);
                            $window.location.href = "/selectVars";
                        }, function(httpResponse) {
                            console.log ("Err-Res: ", httpResponse)
                        });
                    } else {
                        // Não vai descartar. Desfaz alterações e retorna
                        $window.location.href = "/";
                        return;
                    }
                }
            });
        } else {
            // Não tem variáveis selecionadas. Verifica outros campos e prossegue para seleção de variáveis.
            var strAux = "[";
            for (i = 0; i < $scope.parameters.selectedCensos.length; i++) {
                if (i == 0) {
                    strAux += $scope.parameters.selectedCensos [i].year;
                } else {
                    strAux += "," + $scope.parameters.selectedCensos[i].year;
                }
            }
            strAux += "]";

            if (arrayCensos.indexOf ($scope.parameters.anoAtual) == -1) {
                $scope.parameters.anoAtual = "";
            }

            var strURL = "/UpdateSess";
            var objParameters = {
                tabela:$scope.parameters.tabela,
                censos:strAux,
                anoAtual:$scope.parameters.anoAtual,
                censos2:$scope.parameters.selectedCensos
            };

            $http({
                method: 'post',
                url: strURL,
                data: objParameters
            }).then(function(httpResponse){
                console.log ("UpdtSes-Res: ", httpResponse)
                $window.location.href = "/selectVars";
            }, function(httpResponse) {
                console.log ("Err-Res: ", httpResponse)
            });
        }


        return;


        if ($scope.parameters.selectedVars) {
            console.log ("$scope.parameters.selectedVars")
            if ($scope.parameters.selectedVars.length > 0) {
                console.log ("TEM VARIÀVEIS: ", $scope.parameters.selectedVars);
                if ($scope.parameters.tabela != $scope.parameters.tabelaAnt) {
                    bootbox.confirm({
                        title: "Alteração de tipo de dados e censos",
                        message: "<div class='alert alert-warning' role='alert'>" +
                        "  Há variáveis selecionadas. A mudança realizada descartará essas variáveis!" +
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
                                // Apaga variáveis selecionadas e continua na seleção de variáveis;
                                console.log('RESULTADO MUDANÇA DADOS: Apaga selecionados 1' + result);
                                /*
                                objTabela = $scope.parameters;
                                objParam = {params:objTabela};
                                console.log(objParam.params);
                                $scope.parameters.selectedVariables = [];
                                $scope.parameters.tabelaAnt = $scope.parameters.tabela;
                                $scope.$emit ("callFillThemes", objParam);
                                $scope.$emit ("callFillVar", objParam);
                                $scope.$emit ("clearDataQuery", objParam);
                                */
                            } else {
                                // Desfaz alterações e retorna
                                console.log('RESULTADO MUDANÇA DADOS: Volta anterior e retorna. ' + result);
                                //$scope.parameters.tabela = $scope.parameters.tabelaAnt;
                                return;
                            }
                        }
                    });
                }
                //return;
            }
            
        }
        return;

        //$state.go("selectVars", { id: "testeParam"});
        //$location.path('/xxx');
//        $rootScope.param1 = true;
//        $rootScope.param2 = "james";
//        $scope.userInput = "teste";
        console.log ("SELECTED CENSOS: ", $scope.parameters.selectedCensos)
        var strAux = "[";
        for (i = 0; i < $scope.parameters.selectedCensos.length; i++) {
            if (i == 0) {
                strAux += $scope.parameters.selectedCensos [i].year;
            } else {
                strAux += "," + $scope.parameters.selectedCensos[i].year;
            }
        }
        strAux += "]";
        /*
        $.post("http://localhost:3000/login",{email:email,pass:pass},function(data){		
			if(data==='done')			
			{
				window.location.href="/admin";
			}
        });
        */

        // Atualiza dados de sessão.
        var strURL = "/UpdateSess";
        var objParameters = {
            tabela:$scope.parameters.tabela,
            censos:strAux,
            censos2:$scope.parameters.selectedCensos
        };

        $http({
            method: 'post',
            url: strURL,
            data: objParameters
        }).then(function(httpResponse){
            console.log ("UpdtSes-Res: ", httpResponse)
        }, function(httpResponse) {
            console.log ("Err-Res: ", httpResponse)
        });
    
//        $window.location.href = "/selectVars?" + "col=" + $scope.parameters.tabela + "&censos=" + strAux;
        $window.location.href = "/selectVars";
        
    } // $scope.confSelectCensos
    
}]);

//Add a controller to App to show the list of Brazil's states
/*
//Add a controller to App to show the census's themes
selectCensos.controller('themeController',['$scope', '$rootScope', '$http', listThemes]);

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
};

//Add a controller to App to show the census's years
selectCensos.controller('yearsController',['$scope', '$rootScope', '$http', listYears]);

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
    $scope.changeCenso = function () {
        console.log ("changeCenso: " + $scope.parameters.ano);
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
*/

//Add a controller to App to show the census's tables
selectCensos.controller('tablesController', function ($scope, $rootScope, $http) {

    console.log ('Run tablesController');

    //$scope.parameters.tabela = "";
    // $scope.parameters.tabela = "";
    //$scope.data = [];

    $scope.changeCollection = function () {
        console.log ("tablesController.changeCollection. ", $scope.parameters.tabela);
        // Atualiza apresentação página HTML
        if (($scope.parameters.tabela) || ($scope.parameters.tabela == "")) {
            if ($scope.parameters.tabela == "tPes") {
                $scope.parameters.tPesClicked = true;
                $scope.parameters.tDomClicked = false;
                console.log ("CLICOU tPesClicked")
            } else {
                $scope.parameters.tPesClicked = false;
                $scope.parameters.tDomClicked = true;
                console.log ("CLICOU tDOMClicked")
            }
        }
        
        if (($scope.parameters.tabelaAnt) || ($scope.parameters.tabelaAnt == "")) {
            console.log ("Tem tabela anterior: ", $scope.parameters.tabelaAnt);
        } else {
            console.log ("Não tem tabela anterior. Vai criar.");
            $scope.parameters.tabelaAnt = "";
        }

        // Tem que verificar se existem variáveis do outro tipo de dados selecionados
        // Feito através dos dados de session (no início carregar em uma variável?)
        // Por enquanto apenas atualiza session com relação ao tipo de dados selecionados.
        /*
        $http({
            method: 'post',
            url: "/UpdateSess-dataType",
            data: {tabela:$scope.parameters.tabela}
        }).then(function(httpResponse){
            // this callback will be called asynchronously
            // when the response is available
            console.log ("UpdateSess-dataType RES: ", httpResponse)
        }, function(httpResponse) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log ("Err-UpdateSess-dataType-Res: ", httpResponse)
        });
        */
        
        // Verifica se existem variáveis selecionadas:
        /*
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
            //$scope.$emit ("callFillThemes", objParam);
            //$scope.$emit ("callFillVar", objParam);
            //$scope.$emit ("clearDataQuery", objParam);
        }
        */
    }


    /*
    $scope.changeNEWCollection = function (value) {
        console.log ("changeNEWCollection", value)
        console.log ($scope.parameters)
    }
        
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
    });
    */
});

//Add a controller to App to show the list of table's variable
/*
selectCensos.controller('variaveisController', function($scope, $rootScope, $http) {
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
*/

/**
 * CensosController
 */
selectCensos.controller('censosController', function listCensos($scope, $http) {

    console.log ('Run censosController');

    // Verifica se parâmetro censos existe. Cria se necessário.
    if ($scope.parameters.censos == null || $scope.parameters.censos[0] == null) {
        // parameters.censo não existe. Cria
        $scope.parameters.censos = [];
    }

    // Função de ordenação de array de acordo com o campo year (decrescente)
    var functionSort = function (censoA, censoB) {
        if (censoA.year > censoB.year) {
            return -1;
        }
        if (censoA.year < censoB.year) {
            return 1;
        }
        // equal Year. Return 0 = equal
        return 0;
    }

    // Função que preeche o parâmetro que contém todos os censos (parameters.censos)
    var fillCensosTable = function() {
        console.log("censosController.fillCensosTable:", $scope.parameters);
        $http.get('/year')
        .then(function (response){
            // build object to fill year combo
            console.log ('Return get /year OK');
            var objYear = [];
            for (i = 0; i < response.data.length; i++) {
                bolAchou = false;
                if ($scope.parameters.selectedCensos) {
                    for (j = 0; j < $scope.parameters.selectedCensos.length; j++) {
                        if (response.data [i].year == $scope.parameters.selectedCensos [j].year) {
                            bolAchou = true;
                        }
                    }
                }
                var elementYear = {};
                elementYear.codYear = response.data [i]._id;
                elementYear.year = response.data [i].year;
                elementYear.description = "Censo de " + response.data [i].year;
		// elementYear.description = "Censo de " + response.data [i].year + " - características etc etc etc."
                
		if (!bolAchou) {
                    elementYear.disabled = "";
                } else {
                    elementYear.disabled = "option-selected";
                }
                objYear.push (elementYear);
            }
            $scope.data = {
                model: null,
                censos: objYear.sort(functionSort)
            };
            //$scope.parameters.selectedCensos
            $scope.parameters.censos = objYear.sort(functionSort);
            console.log ($scope.parameters.censos);
    
         }, function myError(response) {
            console.log('Censos Error: ' + response.data);    
        });
    }

    fillCensosTable();

    $scope.$on ("onfillCensosTable", function(event, data) {
        console.log ("ON censosController.fillCensosTable: ");
        fillCensosTable ();
    })
    
    // Função chamada no change de checkBox de censos (check)
    $scope.changeCensosCheckBox = function(objCenso, objIndex) {
        console.log("censosController.changeCensosCheckBox:", $scope.parameters);
        console.log("objIndex", objIndex, "objCenso", objCenso);
        
        if (!$scope.parameters.selectedCensos) {
            console.log ("selectedCensos não existe! Vai criar.")
            $scope.parameters.selectedCensos = [];
        }

        var bolExiste = false;
        angular.forEach ($scope.parameters.selectedCensos, function (key,value) {
          if (key.year == objCenso.year) {
              // Variável já existe na lista de selecionadas
              bolExiste = true;
          }
        });
        if (!bolExiste) {
            // Censo ainda não existe na lista de censos selecionados. Vai incluir.
            $scope.parameters.selectedCensos.push (objCenso);

            console.log ("\n=>Censos Sel:\n", $scope.parameters.selectedCensos);
            // Ordena lista de censos selecionados, de acordo com o definido em functionSort
            $scope.parameters.selectedCensos.sort(functionSort);
            
            // Desabilita censo selecionado na lista de censos.
            //$scope.$emit ("censoDisable", objCenso);
            $scope.censoDisable (objCenso);
        }
    } // submitSelectFromTable


    $scope.censoDisable = function(objCenso) {
        console.log ("censosController.censoDisable: ", objCenso.year, '-', objCenso.description);

        var bolAchou = false;
        var i = 0;
        // Faz busca linear e todas as variáveis da lista de tema, até encontrar ou até o fim.
        while ((i < $scope.parameters.censos.length) && (!bolAchou)) {
            if ($scope.parameters.censos[i].year == objCenso.year) {
                console.log ("vai Desabilitar",$scope.parameters.censos[i])
                // Encontrou. Desabilita (associa à classe de selecionado)
                $scope.parameters.censos[i].disabled = "option-selected";
                //$scope.data.censos[i].disabled = "";
                // Variável já existe na lista de selecionadas
                bolAchou = true;
            };
            i++;
        }
    }
    
    $scope.$on ("censoDisable", function(event, data) {
        console.log ("ON censosController.censoDisable: ", data.year, '-', data.description);
        $scope.censoDisable (data);
    })

    $scope.censoEnable = function(objCenso) {
        console.log ("censosController.censoEnable: ", objCenso.year, '-', objCenso.description);
        //console.log ($scope);

        var bolAchou = false;
        var i = 0;
        while ((i < $scope.parameters.censos.length) && (!bolAchou)) {
            if ($scope.parameters.censos[i].year == objCenso.year) {
                // Encontrou censo. Habilita.
                console.log ("vai habilitar",$scope.data.censos[i])
                $scope.parameters.censos[i].disabled = "";
                $scope.parameters.censos[i].checked = false;
                bolAchou = true;
            };
            i++;
        }
    }
    
    $scope.$on ("censoEnable", function(event, data) {
        console.log ("ON censosController.censoEnable: ", data.year, '-', data.description);
        $scope.censoEnable (data);
    })

}); // selectCensos.controller('censosController', function listCensos($scope, $http)


/**
 * selectedCensosController
 */
selectCensos.controller('selectedCensosController', ['$scope', '$rootScope', '$http', listSelectedCensos]); 
function listSelectedCensos ($scope, $rootScope, $http) {

    console.log ('Run selectedCensosController');

    $scope.removeCensoFromSelectedList = function(objCenso, objIndex){
        console.log("selectedCensosController.removeCensoFromSelectedList");

        console.log($scope.parameters);
        $scope.parameters.selectedCensos.splice (objIndex,1);

        // Verifica se censo está na lista de censos e reabilita.
        $rootScope.$broadcast ("censoEnable", objCenso);
    }

    $scope.removeAllCensosFromSelectedList = function(objCenso, objIndex){
        console.log("selectedCensosController.removeCensoFromSelectedList");
        while ($scope.parameters.selectedCensos [0] != null) {
            $rootScope.$broadcast ("censoEnable", $scope.parameters.selectedCensos [0]);
            $scope.parameters.selectedCensos.splice (0,1);
        }

    }

    $scope.$on ("onRemoveAllCensosFromSelectedList", function(event, data) {
        console.log ("ON censosController.RemoveAllCensosFromSelectedList: ", data.year, '-', data.description);
        $scope.removeAllCensosFromSelectedList (data);
    })

    
}; // selectCensos.controller('censosController', function listCensos($scope, $http)

/********* ***********************************************************************/
/********* ***********************************************************************/
