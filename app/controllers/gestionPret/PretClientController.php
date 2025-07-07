<?php

namespace app\controllers\gestionPret;

use Flight;
use app\models\gestionPret\PretClientModel;

class PretClientController {
    protected $url;
    protected $pretClientModel;

    public function __construct($url) {
        $this->url = $url;
        $this->pretClientModel = new PretClientModel(Flight::db());
    }

    // Afficher la liste des prêts
    public function index() {
        $prets = $this->pretClientModel->listerPrets();
        $periodes = $this->pretClientModel->listerPeriodes();
        $data = [
            'prets' => $prets['data'],
            'periodes' => $periodes['data'],
            'url' => $this->url,
            'folder' => 'gestionPret/',
            'page' => 'index'
        ];
        Flight::render('template', $data);
    }

    // Ajouter un prêt
    public function ajouterPret() {
        $input = Flight::request()->data->getData();
        $result = $this->pretClientModel->ajouterPret($input);
        Flight::json($result);
    }

    // Modifier un prêt
    public function modifierPret($id) {
        $input = Flight::request()->data->getData();
        $result = $this->pretClientModel->modifierPret($id, $input);
        Flight::json($result);
    }

    // Supprimer un prêt
    public function supprimerPret($id) {
        $result = $this->pretClientModel->supprimerPret($id);
        Flight::json($result);
    }

    // Récupérer un prêt par ID
    public function getPret($id) {
        $result = $this->pretClientModel->getPretById($id);
        Flight::json($result);
    }

    public function listerTypesPret() {
        $result = $this->pretClientModel->listerTypesPret();
        Flight::json($result);
    }

    public function listerComptes() {
        $result = $this->pretClientModel->listerComptes();
        Flight::json($result);
    }

    public function listerPeriodes() {
        $result = $this->pretClientModel->listerPeriodes();
        Flight::json($result);
    }

    // API : liste des prêts en JSON pour le JS
    public function listerPretsApi() {
        $prets = $this->pretClientModel->listerPrets();
        Flight::json($prets);
    }
}