<?php
require_once __DIR__ . '/../controllers/StatistiqueInteretController.php';
$StatistiquesController = new StatistiqueInteretController();

Flight::route('GET /annees-disponibles', [$StatistiquesController, 'getAnneesDisponibles']);
Flight::route('GET /statistiques-interets', [$StatistiquesController, 'afficherStatistiques']);
Flight::route('GET /interets-par-mois', [$StatistiquesController, 'getInteretsParMois']);
