//variables
var images = ['url("img/fondo.png")', 'url("img/fondo.png")', 'url("img/druida.jpg")', 'url("img/cazador.jpg")', 'url("img/mago.jpg")', 'url("img/paladin.jpg")',
    'url("img/sacerdote.jpg")', 'url("img/picaro.jpg")', 'url("img/chaman.jpg")', 'url("img/brujo.jpg")', 'url("img/guerrero.jpg")'];
var atributosInteresantes = ["artist", "cardClass", "cost", "flavor", "name", "rarity", "text", "type"]; //los atributos mas interesantes de la carta a buscar
var traducirAtributosInteresantes = ["Artista", "Clase de carta", "Coste de mana", "Comentario", "Nombre de la carta", "Rareza", "Descripcion", "Tipo"];
var contenedor = document.getElementById("contenedor");
var httReq = new XMLHttpRequest(); //crear objeto ajax
var nombreCarta = document.getElementById("nombreCarta");
var buscoFiltrado = document.getElementById("buscarFiltro");
httReq.open("GET", "http://localhost/hearthstone/servirCarta.php", true); //crear la peticion
httReq.send(); //enviar la peticion
httReq.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) { //estado 4 es que se ha finalizado la petcion y 200 que el servidor responde
        var datos = this.responseText; //guardar los datos
        var objeto = JSON.parse(datos); //convierte el resultado en un json
        console.log(objeto);
        var buscar = document.getElementById("buscar");
        /********************************************************************************/
        /***********************BUSCAR CARTA POR NOMBRE**********************************/
        /********************************************************************************/
        /**Busca cualquier carta que contenga la palabra o caracteres introducidos,
         * no importa si se pone en mayusculas o minusculas
         */
        buscar.addEventListener("click", function () { //Buscar carta por nombre
            contenedor.textContent = ""; //limpiar el contenedor
            var buscarNombre = document.getElementById("nombreCarta").value;
            for (carta of objeto) {
                var nombre = carta.name.toUpperCase();
                if (nombre.includes(buscarNombre.toUpperCase())) { //si en el nombre coincide lo buscado
                    mostrarCarta(carta);
                }
            }
        });

        /********************************************************************************/
        /***************CAMBIAR FONDO DE LA ZONA FILTRO AL SITUARSE Y QUITARSE***********/
        /********************************************************************************/
        /**
         * Para destacar el td filtro al situarse sobre el
         */
        buscoFiltrado.addEventListener("mouseover", function () {
            buscoFiltrado.style.backgroundColor = "red";
        });
        buscoFiltrado.addEventListener("mouseout", function () {
            buscoFiltrado.style.backgroundColor = "";
        });
        /********************************************************************************/
        /********************TODO TIPO DE FILTROS****************************************/
        /********************************************************************************/
        /**Una funccion que segun el select que tengamos pulsado
         * o la combinacion de distintos select nos filtra las cartas
         * que corresponden a los select, si el select se deja vacio
         * el filtro no tiene en cuenta el campo
         */
        buscoFiltrado.addEventListener("click", function () {
            contenedor.textContent = ""; //limpiar el contenedor
            limpiarNombre();
            //obtener el valor de la opcion seleccionada en cada select
            var coste = document.querySelectorAll("select")[0].children[document.querySelectorAll("select")[0].selectedIndex].value;
            var rareza = document.querySelectorAll("select")[1].children[document.querySelectorAll("select")[1].selectedIndex].value;
            var indiceClase = document.querySelectorAll("select")[2].selectedIndex;
            var clase = document.querySelectorAll("select")[2].children[indiceClase].value;
            var tipo = document.querySelectorAll("select")[3].children[document.querySelectorAll("select")[3].selectedIndex].value;
            fondoClase(indiceClase);
            //este if es para poder dejar el coste en el select sin vacio y para que se filtren cartas de todos los costes si no se ha seleccionado nada
            if (coste != "") {
                for (carta of objeto) {
                    if (carta.cost == coste && carta.rarity.includes(rareza) && carta.cardClass.includes(clase) && carta.type.includes(tipo)) { //si en el nombre coincide lo buscado
                        mostrarCarta(carta); //funccion que pinta la carta encontrada
                    }
                }
            } else if (coste == 11) { //si la carta tiene un coste superior a 10
                for (carta of objeto) {
                    if ((carta.cost >= 11) && carta.rarity.includes(rareza) && carta.cardClass.includes(clase) && carta.type.includes(tipo)) { //si en el nombre coincide lo buscado
                        //pintar la carta
                        mostrarCarta(carta); //funccion que pinta la carta encontrada
                    }
                }
            } else {
                for (carta of objeto) { //si no se ha seleccionado ningun coste
                    if (carta.rarity.includes(rareza) && carta.cardClass.includes(clase) && carta.type.includes(tipo)) { //si en el nombre coincide lo buscado
                        mostrarCarta(carta); //funccion que pinta la carta encontrada
                    }
                }
            }
        });
        /********************************************************************************/
        /********************Ver los esbirros mas optimos*********************************/
        /********************************************************************************/
        /*calcula si es 
        *economico o no un esbirro y saca solo aquellos que lo son, 
        *para eso se divide el ataque + la salud entre dos y si 
        *el coste es menor que el resultado nos muestra las cartas*/
        document.getElementById("verMejores").addEventListener("click", function () {
            contenedor.textContent = "";
            for (carta of objeto) {
                if (carta.type == "MINION" && Number(carta.cost < ((carta.attack + carta.health) / 2))) {
                    mostrarCarta(carta);
                }
            }
        });
    }
}
/********************************************************************************/
/********************Cambiar fondo segun la clase*********************************/
/********************************************************************************/
/**funccion que cambia el fondo de la web segun
 *  la opcion que tenemos seleccionada en el select "Clase"
 */
function fondoClase(opcion) {  
    var fondo = document.querySelector("body");
    switch (opcion) {
        case 2:
            fondo.style.backgroundImage = images[2];
            break;
        case 3:
            fondo.style.backgroundImage = images[3];
            break;
        case 4:
            fondo.style.backgroundImage = images[4];
            break;
        case 5:
            fondo.style.backgroundImage = images[5];
            break;
        case 6:
            fondo.style.backgroundImage = images[6];
            break;
        case 7:
            fondo.style.backgroundImage = images[7];
            break;
        case 8:
            fondo.style.backgroundImage = images[8];
            break;
        case 9:
            fondo.style.backgroundImage = images[9];
            break;
        case 10:
            fondo.style.backgroundImage = images[10];
            break;
        default:
            fondo.style.backgroundImage = images[0];
    }
}
/********************************************************************************/
/********************FUNCCION MOSTRAR CARTA***************************************/
/********************************************************************************/
/**Muestra la carta y traduce los atributos que mas pueden interesar
 * a los jugadores, tambien tiene en cuenta de que tipo es cada carta
 * y si la carta es un esbirro (tienen ataque y salud) tambien lo pinta
 */
function mostrarCarta(carta) {//pinta la carta encontrada y traduce sus atributos 
    var atributosTraducidos = 0;
    var h2 = document.createElement("h2");
    h2.style.color = "orange";
    h2.style.marginLeft = "40vw";
    h2.style.marginBottom = "0";
    h2.style.textShadow = " 2px 2px 0 #4074b5, 2px -2px 0 #4074b5, -2px 2px 0 #4074b5, -2px -2px 0 #4074b5, 2px 0px 0 #4074b5, 0px 2px 0 #4074b5, -2px 0px 0 #4074b5, 0px -2px 0 #4074b5";
    h2.textContent = carta.name;
    contenedor.appendChild(h2);
    var ul = document.createElement("ul");
    for (atributo of atributosInteresantes) { //ver los atributos mas importantes de la carta
        var li = document.createElement("li");
        li.textContent = traducirAtributosInteresantes[atributosTraducidos] + ": " + carta[atributo];
        ul.appendChild(li);
        atributosTraducidos++;
    }
    if (carta.type == "MINION") { //SI LA CARTA ES UN MONSTRUO TIENE ATRIBUTOS DE SALUD Y ATAQUE
        var li = document.createElement("li");
        li.textContent = "Ataque: " + carta.attack + "/Salud: " + carta.health;
        ul.appendChild(li);

    }
    contenedor.appendChild(ul);
}
/********************************************************************************/
/********************Limpiar el texto al buscar carta****************************/
/********************************************************************************/
nombreCarta.addEventListener("click", limpiarNombre());
function limpiarNombre() {
    nombreCarta.value = "";
}


