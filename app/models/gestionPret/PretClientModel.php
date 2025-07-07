<?php

namespace app\models\gestionPret;

use app\models\BaseModel;

class PretClientModel extends BaseModel {
    public function ajouterPret($data) {
        // Vérification des contraintes du type de prêt
        if (!isset($data['type_pret_id'], $data['montant'], $data['duree'])) {
            return [
                'succes' => false,
                'message' => 'Type de prêt, montant ou durée manquant.'
            ];
        }
        $typePret = $this->chercherDonnee('type_pret', ['id_type_pret' => $data['type_pret_id']]);
        if (empty($typePret['data'][0])) {
            return [
                'succes' => false,
                'message' => 'Type de prêt introuvable.'
            ];
        }
        $type = $typePret['data'][0];
        if ($data['montant'] > $type['montant_max']) {
            return [
                'succes' => false,
                'message' => 'Le montant dépasse le montant maximal autorisé pour ce type de prêt.'
            ];
        }
        if ($data['duree'] > $type['duree_max']) {
            return [
                'succes' => false,
                'message' => 'La durée dépasse la durée maximale autorisée pour ce type de prêt.'
            ];
        }
        return $this->insererDonnee('pret', $data);
    }

    public function listerPrets($conditions = [], $orderBy = null, $direction = 'ASC') {
        // Filtrage
        $result = $this->selectionnerDonnee('pret', $conditions);
        // Tri côté SQL si demandé
        if ($orderBy && $result['succes'] && !empty($result['data'])) {
            usort($result['data'], function($a, $b) use ($orderBy, $direction) {
                if ($a[$orderBy] == $b[$orderBy]) return 0;
                if (strtoupper($direction) === 'DESC') {
                    return ($a[$orderBy] < $b[$orderBy]) ? 1 : -1;
                } else {
                    return ($a[$orderBy] > $b[$orderBy]) ? 1 : -1;
                }
            });
        }
        return $result;
    }

    public function getPretById($id) {
        return $this->chercherDonnee('pret', ['id_pret' => $id]);
    }

    public function modifierPret($id, $data) {
        return $this->modifierDonnee('pret', $data, ['id_pret' => $id]);
    }

    public function supprimerPret($id) {
        return $this->supprimerDonnee('pret', ['id_pret' => $id]);
    }

    public function listerTypesPret() {
        return $this->selectionnerDonnee('type_pret');
    }

    public function listerComptes() {
        return $this->selectionnerDonnee('compte');
    }
}