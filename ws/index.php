<?php
require 'vendor/autoload.php';
require 'db.php';
require 'routes/gestionFondRoutes.php';
require 'routes/gestionTypePretRoutes.php';
require 'routes/gestionPretClientRoutes.php';
require 'routes/StatistiqueInteretRoutes.php';
require 'routes/simulerPretRoutes.php';

Flight::start();
