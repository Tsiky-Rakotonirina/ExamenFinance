<?php
require_once __DIR__ . '/../controllers/GestionTypePretController.php';

Flight::route('GET /lister-status-type-pret',  [ 'GestionTypePretController', 'filtrerFond']);
Flight::route('GET /filtrer-type-pret', [ 'GestionTypePretController', 'filtrerTypePret']);
Flight::route('PUT /modifier-type-pret', [ 'GestionTypePretController', 'modifierTypePret']);
Flight::route('GET /historique-type-pret',[ 'GestionTypePretController', 'historiqueTypePret']);
