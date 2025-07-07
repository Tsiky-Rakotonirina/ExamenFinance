<?php

use app\controllers\Controller;
use app\controllers\ProductController;
use app\controllers\gestionTypePret\GestionTypePretController;
use app\models\gestionTypePret\GestionTypePretModel;
use flight\Engine;
use flight\net\Router;

$url = Flight::get('flight.base_url');

$Controller = new Controller($url);
$router->get('/', [$Controller, 'index']);

$ProductController = new ProductController($url);
$router->get('/lister-produit', [$ProductController, 'listerProduit']);
$router->get('/filtrer-produit', [$ProductController, 'filtrerProduit']);
$router->post('/ajouter-produit', [$ProductController, 'ajouterProduit']);
$router->post('/modifier-produit', [$ProductController, 'modifierProduit']);
$router->get('/supprimer-produit', [$ProductController, 'supprimerProduit']);
$TypePretController = new GestionTypePretController($url);

flight::route('GET /lister-status-type-pret', function () use ($TypePretController) {
    $TypePretController->listerStatusTypePret();
});
flight::route('GET /filtrer-type-pret', function () use ($TypePretController) {
    $TypePretController->filtrerTypePret();
});
flight::route('PUT /modifier-type-pret', function () use ($TypePretController) {
    $TypePretController->modifierTypePret();
});

flight::route('GET /historique-type-pret', function () use ($TypePretController) {
    $TypePretController->historiqueTypePret();
});
$router->get('/lister-type-pret', [$TypePretController, 'listerTypePret']);
$router->get('/filtrer-type-pret', [$TypePretController, 'filtrerTypePret']);
$router->post('/ajouter-type-pret', [$TypePretController, 'ajouterTypePret']);
// $router->post('/modifier-type-pret', [$TypePretController, 'modifierTypePret']);
$router->get('/supprimer-type-pret', [$TypePretController, 'supprimerTypePret']);
