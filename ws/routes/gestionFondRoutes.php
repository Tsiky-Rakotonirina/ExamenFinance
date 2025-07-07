<?php
require_once __DIR__ . '/../controllers/StatistiqueInteretController.php';

Flight::route('GET /filtrer-fond', [ 'GestionFondController', 'filtrerFond']); 
Flight::route('POST /ajouter-fond', [ 'GestionFondController', 'ajouterFond']);  