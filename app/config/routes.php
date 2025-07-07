<?php
use app\controllers\gestionPret\PretClientController;
use flight\Engine;
use flight\net\Router;

$url = Flight::get('flight.base_url');

$PretClientController = new PretClientController($url);
$router->get('/', [ $PretClientController, 'index']);
$router->get('/gestionPret/lister', [ $PretClientController, 'index']);
$router->post('/gestionPret/ajouter', [ $PretClientController, 'ajouterPret']);
$router->get('/gestionPret/{id}', [ $PretClientController, 'getPret']);
$router->get('/gestionPret/listerTypesPret', [ $PretClientController, 'listerTypesPret' ]);
$router->get('/gestionPret/listerComptes', [ $PretClientController, 'listerComptes' ]);
$router->get('/gestionPret/api/lister', [ $PretClientController, 'listerPretsApi' ]);

