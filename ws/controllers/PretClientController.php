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

    // Modifier un prêt
    public function modifierPret($id) {
        $input = Flight::request()->data->getData();
        $result = PretClientModel::modifierPret($id, $input);
        Flight::json($result);
    }

    // Supprimer un prêt
    public function supprimerPret($id) {
        $result = PretClientModel::supprimerPret($id);
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
}