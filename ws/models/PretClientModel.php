<?php
require_once __DIR__ . '/BaseModel.php';

class PretClientModel extends BaseModel
{
    public static function genererTableauAnnuitesConstantes($capitalInitial, $tauxAnnuel, $duree, $nbMoisParPeriode)
    {
        // Calculer le nombre total de mois (durée * nbMoisParPeriode)
        $nbMoisTotal = $duree * $nbMoisParPeriode;

        // Taux mensuel pour le calcul de la mensualité
        $tauxMensuel = $tauxAnnuel / 12;
        $i = $tauxMensuel / 100;

        // Calcul de la mensualité constante
        $mensualite = ($capitalInitial * $i) / (1 - pow(1 + $i, -$nbMoisTotal));
        $mensualite = round($mensualite, 2); // arrondi à 2 chiffres après la virgule

        $resultat = [];
        $capitalRestant = $capitalInitial;

        // Générer le tableau pour chaque mois
        for ($mois = 1; $mois <= $nbMoisTotal; $mois++) {
            $capitalDebut = round($capitalRestant, 2);
            $interet = round($capitalDebut * $i, 2);
            $amortissement = round($mensualite - $interet, 2);
            $capitalRestant = round($capitalRestant - $amortissement, 2);
            
            $resultat[] = [
                'mois' => $mois,
                'capital_debut' => $capitalDebut,
                'interet' => $interet,
                'amortissement' => $amortissement,
                'mensualite' => $mensualite, // Renommé pour plus de clarté
                'capital_fin' => $capitalRestant
            ];
        }

        return $resultat;
    }

    public static function ajouterRemboursement($data) {
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
        $result = self::insererDonnee('remboursement', $dataRemb);
        if (!$result['succes']) {
            error_log('[Remboursement] Erreur insertion: ' . ($result['message'] ?? 'Erreur inconnue') . ' | Data: ' . json_encode($dataRemb));
        }
        return $result;
    }

    public static function ajouterPret($data){
        $champsObligatoires = ['type_pret_id', 'montant', 'duree', 'compte_id', 'periode_id'];
        foreach ($champsObligatoires as $champ) {
            if (!isset($data[$champ]) || $data[$champ] === '') {
                return ['succes' => false, 'message' => "Champ obligatoire manquant ou vide : $champ"];
            }
        }

        $typePret = self::chercherDonnee('type_pret', ['id_type_pret' => $data['type_pret_id']]);
        if (empty($typePret['data'][0])) {
            return ['succes' => false, 'message' => 'Type de prêt introuvable.'];
        }
        $type = $typePret['data'][0];

        $periodeInfo = self::chercherDonnee('periode', ['id_periode' => $data['periode_id']]);
        if (empty($periodeInfo['data'][0])) {
            return ['succes' => false, 'message' => 'Période invalide.'];
        }
        $nbMoisParPeriode = $periodeInfo['data'][0]['nombre_mois'];

        // Validation des limites basée sur le nombre total de mois
        $nbMoisTotal = $data['duree'] * $nbMoisParPeriode;
        if ($data['montant'] > $type['montant_max'] || $nbMoisTotal > $type['mois_max']) {
            return ['succes' => false, 'message' => 'Montant ou durée dépasse les limites autorisées.'];
        }

        $dataPret = [
            'type_pret_id' => $data['type_pret_id'],
            'montant' => $data['montant'],
            'duree' => $data['duree'],
            'compte_id' => $data['compte_id'],
            'periode_id' => $data['periode_id'],
            'date_pret' => $data['date_pret'] ?? date('Y-m-d')
        ];

        $resultPret = self::insererDonnee('pret', $dataPret);

        $pretId = $resultPret['lastInsertId'];
        
        // Générer le tableau des mensualités
        $tableau = self::genererTableauAnnuitesConstantes(
            $data['montant'],
            $type['taux_annuel'],
            $data['duree'],
            $nbMoisParPeriode
        );

        // Calculer la première date d'échéance : date du prêt + echeance_initiale mois
        $dateEcheance = new DateTime($dataPret['date_pret']);
        $dateEcheance->modify('+' . $type['echeance_initiale'] . ' months');

        // Insérer chaque ligne du tableau dans la base
        foreach ($tableau as $ligne) {
            self::ajouterRemboursement([
                'pret_id' => $pretId,
                'numero_periode' => $ligne['mois'],
                'base' => $ligne['capital_debut'],
                'interet' => $ligne['interet'],
                'amortissement' => $ligne['amortissement'],
                'a_payer' => $ligne['mensualite'], // Utiliser 'mensualite' au lieu de 'annuite'
                'date_remboursement' => null,
                'date_echeance' => $dateEcheance->format('Y-m-d')
            ]);
            
            // Décaler la date d'échéance d'un mois pour la prochaine mensualité
            $dateEcheance->modify('+1 month');
        }

        return $resultPret;
    }



    public static function listerPrets($conditions = [], $orderBy = null, $direction = 'ASC')
    {
        $result = self::selectionnerDonnee('pret', $conditions);
        if ($orderBy && $result['succes'] && !empty($result['data'])) {
            usort($result['data'], function ($a, $b) use ($orderBy, $direction) {
                if ($a[$orderBy] == $b[$orderBy]) return 0;
                return (strtoupper($direction) === 'DESC') ? ($a[$orderBy] <=> $b[$orderBy]) * -1 : ($a[$orderBy] <=> $b[$orderBy]);
            });
        }
        return $result;
    }

    public static function getPretById($id)
    {
        return self::chercherDonnee('pret', ['id_pret' => $id]);
    }

    public static function modifierPret($id, $data)
    {
        return self::modifierDonnee('pret', $data, ['id_pret' => $id]);
    }

    public static function supprimerPret($id)
    {
        return self::supprimerDonnee('pret', ['id_pret' => $id]);
    }

    public static function listerTypesPret()
    {
        return self::selectionnerDonnee('vue_type_pret_actif');
    }

    public static function listerComptes()
    {
        return self::selectionnerDonnee('vue_compte_detail');
    }

    public static function listerPeriodes()
    {
        return self::selectionnerDonnee('vue_periode');
    }

    

    // Lister les remboursements (avec conditions optionnelles)
    public static function listerRemboursements($conditions = [], $orderBy = null, $direction = 'ASC') {
        $result = self::selectionnerDonnee('remboursement', $conditions);
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
    public static function getRemboursementById($id) {
        return self::chercherDonnee('remboursement', ['id_remboursement' => $id]);
    }


    // Lister les remboursements d'un prêt donné
    public static function listerRemboursementsParPret($pretId) {
        return self::selectionnerDonnee('remboursement', ['pret_id' => $pretId]);
    }

    public static function getPretCompletById($id) {
        $db = getDB();

        // 1. Prêt de base
        $stmt = $db->prepare("SELECT * FROM pret WHERE id_pret = :id");
        $stmt->execute(['id' => $id]);
        $pret = $stmt->fetch();
        if (!$pret) return null;

        // 2. Type de prêt
        $stmt = $db->prepare("SELECT * FROM type_pret WHERE id_type_pret = :id");
        $stmt->execute(['id' => $pret['type_pret_id']]);
        $pret['type_pret'] = $stmt->fetch();

        // 3. Période
        $stmt = $db->prepare("SELECT * FROM periode WHERE id_periode = :id");
        $stmt->execute(['id' => $pret['periode_id']]);
        $pret['periode'] = $stmt->fetch();

        // 4. Compte
        $stmt = $db->prepare("SELECT * FROM compte WHERE id_compte = :id");
        $stmt->execute(['id' => $pret['compte_id']]);
        $compte = $stmt->fetch();

        // 5. Client
        if ($compte) {
            $stmt = $db->prepare("SELECT * FROM client WHERE id_client = :id");
            $stmt->execute(['id' => $compte['client_id']]);
            $compte['client'] = $stmt->fetch();
        }
        $pret['compte'] = $compte;

        // 6. Remboursements
        $stmt = $db->prepare("SELECT * FROM remboursement WHERE pret_id = :id ORDER BY numero_periode ASC");
        $stmt->execute(['id' => $pret['id_pret']]);
        $remboursements = $stmt->fetchAll();

        $nbParPeriode = $pret['periode']['nombre_mois'] ?? 1;
        $remboursements_groupes = [];
        $groupe_index = 1;

        for ($i = 0; $i < count($remboursements); $i += $nbParPeriode) {
            $groupe = array_slice($remboursements, $i, $nbParPeriode);
            $somme_base = 0;
            $somme_interet = 0;
            $somme_amortissement = 0;
            $somme_a_payer = 0;

            foreach ($groupe as $r) {
                $somme_base += floatval($r['base']);
                $somme_interet += floatval($r['interet']);
                $somme_amortissement += floatval($r['amortissement']);
                $somme_a_payer += floatval($r['a_payer']);
            }

            $remboursements_groupes[] = [
                'periode_label' => $pret['periode']['libelle'] . ' ' . $groupe_index,
                'base' => round($somme_base, 2),
                'interet' => round($somme_interet, 2),
                'amortissement' => round($somme_amortissement, 2),
                'a_payer' => round($somme_a_payer, 2)
            ];

            $groupe_index++;
        }

        $pret['remboursements'] = $remboursements_groupes;

        return $pret;
    }

}
