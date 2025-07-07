<?php

namespace app\controllers\gestionTypePret;

use Flight;
use app\models\gestionTypePret\GestionTypePretModel;

class GestionTypePretController
{
    protected $url;
    protected $typePretModel;

    public function __construct($url)
    {
        $this->url = $url;
    }

    // public function index()
    // {
    //     // $data = ['folder'=>'', 'page'=>'', 'url'=>$this->url, ];
    //     Flight::redirect("/list-type-pret");
    // }
    public function listerTypePret()
    {
        $data = ['folder' => '', 'page' => 'type-Pret', 'url' => $this->url];
        Flight::render('gestionTypePret/index', $data);
    }
    public function listerStatusTypePret()
    {
        $output = Flight::GestionTypePretModel()->selectionnerDonnee('status_type_pret');
        Flight::json($output);
    }
    public function historiqueTypePret()
    {
        $output = Flight::GestionTypePretModel()->selectionnerDonnee('historique_type_pret');
        Flight::json($output);
    }
    public function filtrerTypePret()
    {
        $params = $_GET;
        $output = Flight::GestionTypePretModel()->selectionnerDonnee('type_pret', $params);
        Flight::json($output);
    }

    public function ajouterTypePret()
    {
        $input = Flight::request()->data->getData();
        $output = Flight::GestionTypePretModel()->insererDonnee('type_pret', $input);
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
        $typePret = Flight::GestionTypePretModel()->selectionnerDonnee('type_pret', ['id_type_pret' => $id]);
        if (empty($typePret['data'][0])) {
            Flight::json(['succes' => false, 'message' => 'Type de prêt introuvable']);
            return;
        }
        $row = $typePret['data'][0];

        // 2. Insérer dans historique_type_pret
        $historiqueData = [
            'type_pret_id'    => $row['id_type_pret'],
            'date_type_pret'  => $row['date_type_pret'],
            'status_type_pret' => $row['status_type_pret_id'],
            'mois_max'       => $row['mois_max'],
            'montant_max'     => $row['montant_max'],
            'taux_annuel'            => $row['taux_annuel'],
            'echeance_initiale'            => $row['echeance_initiale'],
        ];
        Flight::GestionTypePretModel()->insererDonnee('historique_type_pret', $historiqueData);

        // 3. Faire l'UPDATE
        $output = Flight::GestionTypePretModel()->modifierDonnee('type_pret', $input, ['id_type_pret' => $id]);
        Flight::json($output);
    }

    public function supprimerTypePret()
    {
        $id = $_GET['id_type_pret'] ?? null;
        if (!$id) {
            Flight::json(['succes' => false, 'message' => 'ID type prêt manquant']);
            return;
        }
        $output = Flight::GestionTypePretModel()->supprimerDonnee('type_pret', ['id_type_pret' => $id]);
        Flight::json($output);
    }
}
