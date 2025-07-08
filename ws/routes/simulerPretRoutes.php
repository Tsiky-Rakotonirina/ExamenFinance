<?php
require_once __DIR__ . '/../controllers/SimulerPretController.php';
$SimulerPretController = new SimulerPretController();

Flight::route('POST /simulerPret/ajouter', [ $SimulerPretController, 'ajouterSimuler']);
Flight::route('POST /simulerPret/ajouterPret', [ $SimulerPretController, 'ajouterPret']);
Flight::route('GET /simulerPret/listerTypesPret', [ $SimulerPretController, 'listerTypesPret' ]);
Flight::route('GET /simulerPret/listerComptes', [ $SimulerPretController, 'listerComptes' ]);
Flight::route('GET /simulerPret/listerPeriodes', [ $SimulerPretController, 'listerPeriodes' ]);
Flight::route('GET /simulerPret/api/lister', [ $SimulerPretController, 'listerPretsApi' ]);
Flight::route('GET /simulerPret/fichePret/@id', [ $SimulerPretController, 'getPretCompletById' ]);
