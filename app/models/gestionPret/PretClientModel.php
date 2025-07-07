<?php

namespace app\models\gestionPret;

use app\models\BaseModel;
use DateTime;

class PretClientModel extends BaseModel
{
    public function ajouterPret($data)
    {
        $champsObligatoires = ['type_pret_id', 'montant', 'duree', 'compte_id', 'periode_id'];
        foreach ($champsObligatoires as $champ) {
            if (!isset($data[$champ]) || $data[$champ] === '') {
                return ['succes' => false, 'message' => "Champ obligatoire manquant ou vide : $champ"];
            }
        }

        $typePret = $this->chercherDonnee('type_pret', ['id_type_pret' => $data['type_pret_id']]);
        if (empty($typePret['data'][0])) {
            return ['succes' => false, 'message' => 'Type de prêt introuvable.'];
        }
        $type = $typePret['data'][0];

        if ($data['montant'] > $type['montant_max'] || $data['duree'] > $type['mois_max']) {
            return ['succes' => false, 'message' => 'Montant ou durée dépasse les limites autorisées.'];
        }

        $periodeInfo = $this->chercherDonnee('periode', ['id_periode' => $data['periode_id']]);
        if (empty($periodeInfo['data'][0])) {
            return ['succes' => false, 'message' => 'Période invalide.'];
        }
        $nbMoisParPeriode = $periodeInfo['data'][0]['nombre_mois'];

        $dataPret = [
            'type_pret_id' => $data['type_pret_id'],
            'montant' => $data['montant'],
            'duree' => $data['duree'],
            'compte_id' => $data['compte_id'],
            'periode_id' => $data['periode_id'],
            'date_pret' => $data['date_pret'] ?? date('Y-m-d')
        ];

        $resultPret = $this->insererDonnee('pret', $dataPret);
        if (!$resultPret['succes']) return $resultPret;

        $pretId = $resultPret['lastInsertId'];
        $tableau = self::genererTableauAnnuitesConstantes(
            $data['montant'],
            $type['taux_annuel'],
            $data['duree'],
            $nbMoisParPeriode
        );

        $dateEcheance = new DateTime($dataPret['date_pret']);
        $remboursementModel = new RemboursementClientModel($this->db);

        foreach ($tableau as $ligne) {
            $moisTotal = (($ligne['periode'] - 1) * $nbMoisParPeriode) + $type['echeance_initiale'];
            $dateEcheanceLigne = (clone $dateEcheance)->modify('+' . $moisTotal . ' months');
            $remboursementModel->ajouterRemboursement([
                'pret_id' => $pretId,
                'numero_periode' => $ligne['periode'],
                'base' => $ligne['capital_debut'],
                'interet' => $ligne['interet'],
                'amortissement' => $ligne['amortissement'],
                'a_payer' => $ligne['annuite'],
                'date_remboursement' => null,
                'date_echeance' => $dateEcheanceLigne->format('Y-m-d')
            ]);
        }

        return $resultPret;
    }

    public static function genererTableauAnnuitesConstantes($capitalInitial, $tauxAnnuel, $dureeEnMois, $nbMoisParPeriode)
    {
        $nbPeriodes = ceil($dureeEnMois / $nbMoisParPeriode);
        $tauxPeriodique = self::tauxPeriodique($tauxAnnuel, 12 / $nbMoisParPeriode);
        $annuite = self::calculerAnnuite($capitalInitial, $tauxPeriodique, $nbPeriodes);
        $resultat = [];
        $capitalRestant = $capitalInitial;

        for ($periode = 1; $periode <= $nbPeriodes; $periode++) {
            $interet = round($capitalRestant * ($tauxPeriodique / 100), 2);
            $amortissement = round($annuite - $interet, 2);
            $capitalDebut = round($capitalRestant, 2);
            $capitalRestant -= $amortissement;
            if ($capitalRestant < 0) $capitalRestant = 0;

            $resultat[] = [
                'periode' => $periode,
                'capital_debut' => $capitalDebut,
                'interet' => $interet,
                'amortissement' => $amortissement,
                'annuite' => round($annuite, 2),
                'capital_fin' => round($capitalRestant, 2)
            ];
        }

        return $resultat;
    }

    public static function tauxPeriodique($tauxAnnuel, $periodesParAn)
    {
        return round($tauxAnnuel / $periodesParAn, 6);
    }

    public static function calculerAnnuite($capital, $tauxPeriodique, $nbPeriodes)
    {
        if ($tauxPeriodique <= 0) return round($capital / $nbPeriodes, 2);
        $i = $tauxPeriodique / 100;
        return round(($capital * $i) / (1 - pow(1 + $i, -$nbPeriodes)), 2);
    }

    public function listerPrets($conditions = [], $orderBy = null, $direction = 'ASC')
    {
        $result = $this->selectionnerDonnee('pret', $conditions);
        if ($orderBy && $result['succes'] && !empty($result['data'])) {
            usort($result['data'], function ($a, $b) use ($orderBy, $direction) {
                if ($a[$orderBy] == $b[$orderBy]) return 0;
                return (strtoupper($direction) === 'DESC') ? ($a[$orderBy] <=> $b[$orderBy]) * -1 : ($a[$orderBy] <=> $b[$orderBy]);
            });
        }
        return $result;
    }

    public function getPretById($id)
    {
        return $this->chercherDonnee('pret', ['id_pret' => $id]);
    }

    public function modifierPret($id, $data)
    {
        return $this->modifierDonnee('pret', $data, ['id_pret' => $id]);
    }

    public function supprimerPret($id)
    {
        return $this->supprimerDonnee('pret', ['id_pret' => $id]);
    }

    public function listerTypesPret()
    {
        return $this->selectionnerDonnee('vue_type_pret_actif');
    }

    public function listerComptes()
    {
        return $this->selectionnerDonnee('vue_compte_detail');
    }

    public function listerPeriodes()
    {
        return $this->selectionnerDonnee('vue_periode');
    }
}
