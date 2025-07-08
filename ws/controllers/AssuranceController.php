<?php
require_once __DIR__ . '/../models/AssuranceModel.php';
require_once __DIR__ . '/../helpers/Utils.php';

class AssuranceController
{


    public function ajouterAssurance()
    {
        $input = Flight::request()->data->getData();
        $output = GestionTypePretModel::insererDonnee('Assurance', $input);
        Flight::json($output);
    }
}
