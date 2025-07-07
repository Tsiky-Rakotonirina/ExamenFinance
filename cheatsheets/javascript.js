// integration
<script type="text/javascript" src=".js"></script> // sans src si direct dans le code
 
// variables
let x = 10; // variable modifiable
const y = 20; // constante (non modifiable)
var z = 30; // variable globale (évitez de l'utiliser dans les nouveaux codes)

// fonction flechee et avec valeur par defaut
const sayHello = (name="Guest") => {
  console.log("Hello " + name);
};
sayHello(); // "Hello Guest"
sayHello("Alice");

//random 
let randomNum = Math.random(); // entre 0 et 1
let randomInt = Math.floor(Math.random() * 100); // entre 0 et 99

//arrays
let fruits = ["apple", "banana", "cherry"];
fruits.length;
fruits.join()	// combines	all	array	elements	into	a	string.	
fruits.unshift("mango"); // Ajouter un élément au début
fruits.push("orange"); // Ajouter un élément à la fin
fruits.shift(); // Retirer le premier élément
fruits.pop(); // Retirer le dernier élément
fruits.sort(); // Trie par ordre alphabétique
fruits.reverse(); // Inverse l'ordre du tableau
fruits.forEach(fruit => { //parcours
  console.log(fruit);
});
let numbers = [1, 2, 3, 4, 5];
let doubled = numbers.map(num => num * 2); // Crée un nouveau tableau avec les éléments doublés
let evens = numbers.filter(num => num % 2 === 0); // Filtre les éléments pairs
let sum = numbers.reduce((acc, num) => acc + num, 0); // Somme de tous les éléments

//DOM getElement
let element = document.getElementById("myId");
let elements = document.getElementsByClassName("myClass");
let queryElement = document.querySelector(".myClass"); // Sélectionne le premier élément correspondant
let queryAll = document.querySelectorAll(".myClass"); // Sélectionne tous les éléments correspondants

//DOM modifier les attributs et contenu et styles
element.innerHTML = "un <em>autre</em> contenu"; // interprete
element.textContent = "un <em>autre</em> contenu"; // non interprete
element.setAttribute("class", "newClass"); // Modifier un attribut
var taille = element.width;
element.width = taille + 100;
element.src = "images/joconde.jpg";
element.alt = "le tableau de la Joconde";
element.className = "gauche";
element.style.color = "red"; // Modifier la couleur
element.style.backgroundColor = "blue"; // Modifier l'arrière-plan
element.style.marginRight = "10px";
element.style.marginTop = "2%";


//DOM ajout element
let newElement = document.createElement("div");
newElement.textContent = "Hello";
document.body.appendChild(newElement); // Ajouter à la fin du body
document.body.removeChild(noeud);
document.body.replaceChild(remplacant,remplace);
document.body.insertBefore(noeudInsere,noeudReference) ;

//DOM event
element.addEventListener("click", function() {
  console.log("Clicked!");
});

function setupEvents(){
  var button=document.getElementById("button");
  button.addEventListener("click",afficherParite);
}
window.addEventListener("load",setupEvents);

// Ajax avec xhr
function get(){
  var xhr = new XMLHttpRequest();
  xhr.open("GET",".php?nb="+nb+"&value="+value,true);
  xhr.onreadystatechange = function() { 
    if (xhr.readyState == 4) { // L'état 4 signifie que la requête est terminée
      if (xhr.status == 200) { // Si le code de statut HTTP est 200 (OK)
        var table = JSON.parse(xhr.responseText);
        console.log(table);
      } else {
        console.error("Error code " + xhr.status); // Afficher un message d'erreur avec le code de statut
      }
    }
  }; 
  xhr.send();
}

function post(){
  var form=document.getElementById("form");
  var formData=new FormData(form);
  var xhr = new XMLHttpRequest();
  xhr.open("POST",".php",true);
  xhr.onreadystatechange = function() { 
    if (xhr.readyState == 4) { 
      if (xhr.status == 200) { 
        var table = JSON.parse(xhr.responseText);
        console.log(table); 
      } else {
        console.error("Error code " + xhr.status); 
      }
    }
  }; 
  xhr.send(formData); 
}

// Ajax avec fetch
function get(nb, value) {
  fetch(".php?nb=" + encodeURIComponent(nb) + "&value=" + encodeURIComponent(value))
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error:", error));
}

function post() {
  var form = document.getElementById("form");
  var formData = new FormData(form);
  fetch(".php", {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error("Error:", error));
}