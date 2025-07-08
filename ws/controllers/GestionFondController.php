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
        $data = [
            'montant' => isset($input['montant']) ? $input['montant'] : null,
            'date_fond' => isset($input['date_fond']) ? $input['date_fond'] : null
        ];
        if ($data['montant'] === null || !is_numeric($data['montant'])) {
            Flight::json(['succes' => false, 'message' => 'Montant obligatoire et numérique.']);
            return;
        }
        $output = GestionFondModel::insererDonnee('fond', $data);
        Flight::json($output);
    }

}
