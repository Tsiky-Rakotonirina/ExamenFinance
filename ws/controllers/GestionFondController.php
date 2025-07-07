<?php
require_once __DIR__ . '/../models/GestionFondModel.php';
require_once __DIR__ . '/../helpers/Utils.php';

class GestionFondController{

    public function filtrerFond() {
        $params = $_GET;
        $fonds = GestionFondModel::selectionnerDonnee('fond', $params);
        $fondActuel = GestionFondModel::fondActuel();
        $output = ['succes' => $fonds['succes'], 'message' => $fonds['message'], 'fonds' => $fonds['data'], 'fondActuel' => $fondActuel, ];
        Flight::json($output);
    }

    public function ajouterFond() {
        $input = Flight::request()->data->getData();
        $output = GestionFondModel::insererDonnee('fond', $input);
        Flight::json($output);
    }

}
