<?php
require_once __DIR__ . '/../models/PretClientModel.php';
require_once __DIR__ . '/../helpers/Utils.php';

class PretClientController {
    // Ajouter un prêt
    public function ajouterPret() {
        $input = Flight::request()->data->getData();
        $result = PretClientModel::ajouterPret($input);
        Flight::json($result);
    }

    // Récupérer un prêt par ID
    public function getPret($id) {
        $result = PretClientModel::getPretById($id);
        Flight::json($result);
    }

    public function listerTypesPret() {
        $result = PretClientModel::listerTypesPret();
        Flight::json($result);
    }

    public function listerComptes() {
        $result = PretClientModel::listerComptes();
        Flight::json($result);
    }

    public function listerPeriodes() {
        $result = PretClientModel::listerPeriodes();
        Flight::json($result);
    }

    // API : liste des prêts en JSON pour le JS
    public function listerPretsApi() {
        $prets = PretClientModel::listerPrets();
        Flight::json($prets);
    }

    public function getPretCompletById($id) {
        $pret = PretClientModel::getPretCompletById($id);
        if ($pret) {
            Flight::json(['succes' => true, 'data' => $pret]);
        } else {
            Flight::json(['succes' => false, 'message' => 'Prêt introuvable']);
        }
    }
}