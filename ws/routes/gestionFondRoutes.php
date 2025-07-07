<?php
require_once __DIR__ . '/../controllers/GestionFondController.php';
$GestionFondController = new GestionFondController();

Flight::route('GET /filtrer-fond',  [$GestionFondController, 'filtrerFond']); 
Flight::route('POST /ajouter-fond', [$GestionFondController, 'ajouterFond']);  