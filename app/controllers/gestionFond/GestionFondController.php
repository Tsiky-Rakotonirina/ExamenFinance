<?php

namespace app\controllers\gestionFond;

use Flight;
use app\models\gestionFond\GestionFondModel;

class GestionFondController{
    protected $url;

    public function __construct($url) {
        $this->url = $url;
    }

    public function filtrerFond() {
        $params = $_GET;
        $fonds = Flight::GestionFondModel()->selectionnerDonnee('fond', $params);
        $fondActuel = Flight::GestionFondModel()->fondActuel();
        $output = ['succes' => $fonds['succes'], 'message' => $fonds['message'], 'fonds' => $fonds['data'], 'fondActuel' => $fondActuel, ];
        Flight::json($output);
    }

    public function ajouterFond() {
        $input = Flight::request()->data->getData();
        $output = Flight::GestionFondModel()->insererDonnee('fond', $input);
        Flight::json($output);
    }

}
