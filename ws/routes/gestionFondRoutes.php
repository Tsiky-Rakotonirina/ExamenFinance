<?php
require_once __DIR__ . '/../controllers/StatistiqueInteretController.php';

Flight::route('GET /filtrer-fond', callback: [ 'GestionFondController', 'filtrerFond']); 
Flight::route('POST /ajouter-fond', [ 'GestionFondController', 'ajouterFond']);  