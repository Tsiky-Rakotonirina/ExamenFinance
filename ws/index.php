<?php
require 'vendor/autoload.php';
require 'db.php';
require 'routes/gestionFondRoutes.php';
require 'routes/gestionTypePretRoutes.php';
require 'routes/gestionPretClientRoutes.php';
require 'routes/etudiant_routes.php';
require 'routes/StatistiqueInteretRoutes.php';

Flight::start();
