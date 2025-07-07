<?php
use app\controllers\Controller;
use app\controllers\gestionCompte\GestionCompteController;
use app\controllers\gestionFond\GestionFondController;

use flight\Engine;
use flight\net\Router;

$url=Flight::get('flight.base_url');

$Controller=new Controller($url);
$router->get('/', [ $Controller, 'index']);  
$router->get('/gestion-fond', [ $Controller, 'gestionFond']);  

$GestionFondController = new GestionFondController($url);
Flight::route('GET /filtrer-fond', [ $GestionFondController, 'filtrerFond']); 
Flight::route('POST /ajouter-fond', [ $GestionFondController, 'ajouterFond']);  

$GestionCompteController = new GestionCompteController($url);
Flight::route('', [$GestionCompteController, ' ']);

// $ProductController=new ProductController($url);
// $router->get('/lister-produit', [ $ProductController, 'listerProduit']);  
// $router->get('/filtrer-produit', [ $ProductController, 'filtrerProduit']); 
// $router->post('/ajouter-produit', [ $ProductController, 'ajouterProduit']);  
// $router->post('/modifier-produit', [ $ProductController, 'modifierProduit']);  
// $router->get('/supprimer-produit', [ $ProductController, 'supprimerProduit']);  

