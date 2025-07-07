<?php
use app\controllers\Controller;
use app\controllers\ProductController;

use flight\Engine;
use flight\net\Router;

$url=Flight::get('flight.base_url');

$Controller=new Controller($url);
$router->get('/', [ $Controller, 'index']);  

$ProductController=new ProductController($url);
$router->get('/lister-produit', [ $ProductController, 'listerProduit']);  
$router->get('/filtrer-produit', [ $ProductController, 'filtrerProduit']); 
$router->post('/ajouter-produit', [ $ProductController, 'ajouterProduit']);  
$router->post('/modifier-produit', [ $ProductController, 'modifierProduit']);  
$router->get('/supprimer-produit', [ $ProductController, 'supprimerProduit']);  
