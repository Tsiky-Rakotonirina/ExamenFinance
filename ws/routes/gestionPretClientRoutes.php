<?php
require_once __DIR__ . '/../controllers/PretClientController.php';
$PretClientController = new PretClientController();

Flight::route('GET /gestionPret/lister', [ $PretClientController, 'index']);
$router->post('POST /gestionPret/ajouter', [ $PretClientController, 'ajouterPret']);
Flight::route('GET /gestionPret/{id}', [ $PretClientController, 'getPret']);
Flight::route('GET /gestionPret/listerTypesPret', [ $PretClientController, 'listerTypesPret' ]);
Flight::route('GET /gestionPret/listerComptes', [ $PretClientController, 'listerComptes' ]);
Flight::route('GET /gestionPret/listerPeriodes', [ $PretClientController, 'listerPeriodes' ]);
Flight::route('GET /gestionPret/api/lister', [ $PretClientController, 'listerPretsApi' ]);

