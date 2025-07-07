<?php

namespace app\models\gestionPret;

use app\models\BaseModel;

class RemboursementClientModel extends BaseModel {
    // Ajouter un remboursement avec validation stricte et debug
    public function ajouterRemboursement($data) {
        // Champs obligatoires pour la table remboursement
        $champsObligatoires = ['pret_id', 'numero_periode', 'base', 'interet', 'amortissement', 'a_payer', 'date_echeance'];
        foreach ($champsObligatoires as $champ) {
            if (!isset($data[$champ]) || $data[$champ] === '' || $data[$champ] === null) {
                $msg = "[Remboursement] Champ obligatoire manquant ou vide : $champ | Data: " . json_encode($data);
                error_log($msg);
                return [
                    'succes' => false,
                    'message' => $msg
                ];
            }
        }
        // On ne garde que les champs attendus pour la table remboursement
        $champsRemb = ['pret_id', 'numero_periode', 'base', 'interet', 'amortissement', 'a_payer', 'date_remboursement', 'date_echeance'];
        $dataRemb = [];
        foreach ($champsRemb as $champ) {
            if (array_key_exists($champ, $data)) $dataRemb[$champ] = $data[$champ];
        }
        $result = $this->insererDonnee('remboursement', $dataRemb);
        if (!$result['succes']) {
            error_log('[Remboursement] Erreur insertion: ' . ($result['message'] ?? 'Erreur inconnue') . ' | Data: ' . json_encode($dataRemb));
        }
        return $result;
    }

    // Lister les remboursements (avec conditions optionnelles)
    public function listerRemboursements($conditions = [], $orderBy = null, $direction = 'ASC') {
        $result = $this->selectionnerDonnee('remboursement', $conditions);
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

    // Obtenir un remboursement par son id
    public function getRemboursementById($id) {
        return $this->chercherDonnee('remboursement', ['id_remboursement' => $id]);
    }

    // Modifier un remboursement
    public function modifierRemboursement($id, $data) {
        return $this->modifierDonnee('remboursement', $data, ['id_remboursement' => $id]);
    }

    // Supprimer un remboursement
    public function supprimerRemboursement($id) {
        return $this->supprimerDonnee('remboursement', ['id_remboursement' => $id]);
    }

    // Lister les remboursements d'un prêt donné
    public function listerRemboursementsParPret($pretId) {
        return $this->selectionnerDonnee('remboursement', ['pret_id' => $pretId]);
    }
}
