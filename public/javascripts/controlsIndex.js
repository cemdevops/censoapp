function disableGera () {
    document.getElementById("btnGeraArq").disabled = true;
    //document.getElementById("arqGerado").style.display = "inline-block";
}

function initGera () {
    document.getElementById("btnGeraArq").disabled = true;
    //document.getElementById("arqGerado").style.display = "none";
}

function EnableGera () {
    document.getElementById("btnGeraArq").disabled = false;
}

function changeCenso () {
    /*
     document.getElementById("colecao").selectedIndex = 0;
     document.getElementById("estado").selectedIndex = 0;
     */
    initGera ();
}

function changeCollection () {
    strCol = $('input[name="typeSel"]:checked').val();
    if (document.getElementById("colecao").value != strCol) {
        document.getElementById("colecao").value = strCol;
        console.log ("JS-Change Collection:", strCol);
        angular.element(document.getElementById('colecao')).triggerHandler('change');
        changeFkCollection();
        initGera ();
    }
}

function changeFkCollection () {
    console.log ("JS-Change FK Coll");
}

function clickCenso(intAno) {
    if (document.getElementById("ano").value != intAno) {
        document.getElementById("ano").value = intAno;
        console.log ("JS-Change-Censo", intAno);
        angular.element(document.getElementById('ano')).triggerHandler('change');
    }
}

function changeTheme () {
    console.log ("onChangeTheme - index.html");
}

function changeUF () {
    initGera ();
}

function varSelect () {
    console.log ("VarSelect");
}

function myfunc(div) {
    /*
    var className = div.getAttribute("class");
    var classDisable = div.getAttribute("class");
    console.log ("MyFunc",div,className)
    console.log ("CLASSNAME",className)
    if(className == "option-selected") {
      div.className = "";
    }
    else{
      div.className = "option-selected";
    }
    */
}

/**
    Function to filter table
**/
function functionFilterCategory() {
  // Declare variables 
  var input, filter, table, tr, td, i;
  input = document.getElementById("inputFilterCategory");
  filter = input.value.toUpperCase();
  table = document.getElementById("tabFilterCategory");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    } 
  }
  //var cbSelectAll = document.getElementById("selectFilterAllCheckbox");
  //cbSelectAll.indeterminate = true;
}
