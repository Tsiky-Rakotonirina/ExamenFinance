<?php
require_once __DIR__ . '/../models/SimulerPretModel.php';
require_once __DIR__ . '/../helpers/Utils.php';

class SimulerPretController
{
    // Ajouter un prêt
    public function ajouterSimuler()
    {
        $input = Flight::request()->data->getData();
        $result = SimulerPretModel::ajouterPret($input);
        Flight::json($result);
    }


     public function ajouterPret()
    {
        $input = Flight::request()->data->getData();
        $result = SimulerPretModel::ajouterPretPret($input);
        Flight::json($result);
    }

    // Récupérer un prêt par ID
    public function getPret($id)
    {
        $result = SimulerPretModel::getPretById($id);
        Flight::json($result);
    }

    public function listerTypesPret()
    {
        $result = SimulerPretModel::listerTypesPret();
        Flight::json($result);
    }

    public function listerComptes()
    {
        $result = SimulerPretModel::listerComptes();
        Flight::json($result);
    }

    public function listerPeriodes()
    {
        $result = SimulerPretModel::listerPeriodes();
        Flight::json($result);
    }

    // API : liste des prêts en JSON pour le JS
    public function listerPretsApi()
    {
        $prets = SimulerPretModel::listerPrets();
        Flight::json($prets);
    }

    public function getPretCompletById($id) {
        $pret = SimulerPretModel::getPretCompletById($id);
        if ($pret) {
            Flight::json(['succes' => true, 'data' => $pret]);
        } else {
            Flight::json(['succes' => false, 'message' => 'Prêt introuvable']);
        }
    }
}
