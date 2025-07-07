<?php
require_once __DIR__ . '/../models/GestionTypePretModel.php';
require_once __DIR__ . '/../helpers/Utils.php';

class GestionTypePretController
{
    public function listerStatusTypePret()
    {
        $output = GestionTypePretModel::selectionnerDonnee('status_type_pret');
        Flight::json($output);
    }
    public function historiqueTypePret()
    {
        $output = GestionTypePretModel::selectionnerDonnee('historique_type_pret');
        Flight::json($output);
    }
    public function filtrerTypePret()
    {
        $params = $_GET;
        $output = GestionTypePretModel::selectionnerDonnee('type_pret', $params);
        Flight::json($output);
    }

    public function ajouterTypePret()
    {
        $input = Flight::request()->data->getData();
        $output = GestionTypePretModel::insererDonnee('type_pret', $input);
        Flight::json($output);
    }

    public function modifierTypePret()
    {
        $input = Flight::request()->data->getData();
        $id = $input['id_type_pret'] ?? null;
        unset($input['id_type_pret']);
        if (!$id) {
            Flight::json(['succes' => false, 'message' => 'ID type prêt manquant']);
            return;
        }

        // 1. Récupérer la ligne actuelle
        $typePret = GestionTypePretModel::selectionnerDonnee('type_pret', ['id_type_pret' => $id]);
        if (empty($typePret['data'][0])) {
            Flight::json(['succes' => false, 'message' => 'Type de prêt introuvable']);
            return;
        }
        $row = $typePret['data'][0];

        // 2. Insérer dans historique_type_pret
        $historiqueData = [
            'nom' => $row['nom'],
            'type_pret_id'    => $row['id_type_pret'],
            'date_type_pret'  => $row['date_type_pret'],
            'status_type_pret_id' => $row['status_type_pret_id'],
            'mois_max'       => $row['mois_max'],
            'montant_max'     => $row['montant_max'],
            'taux_annuel'            => $row['taux_annuel'],
            'echeance_initiale'            => $row['echeance_initiale'],
        ];
        $output0 = GestionTypePretModel::insererDonnee('historique_type_pret', $historiqueData);

        // 3. Faire l'UPDATE
        $output = GestionTypePretModel::modifierDonnee('type_pret', $input, ['id_type_pret' => $id]);
        Flight::json($output);
    }

    public function supprimerTypePret()
    {
        $id = $_GET['id_type_pret'] ?? null;
        if (!$id) {
            Flight::json(['succes' => false, 'message' => 'ID type prêt manquant']);
            return;
        }
        $output = GestionTypePretModel::supprimerDonnee('type_pret', ['id_type_pret' => $id]);
        Flight::json($output);
    }
}
