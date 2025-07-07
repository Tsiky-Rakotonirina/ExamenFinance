<?php

require_once __DIR__ . '/../models/StatistiqueInteretModel.php';
require_once __DIR__ . '/../helpers/Utils.php';

class StatistiqueInteretController
{
    public static function afficherStatistiques()
    {
        $data = ['folder' => '', 'page' => 'statistiques_interets', 'url' => Flight::get('base_url')];
        Flight::render('gestionTypePret/statistiques_interets', $data);
    }

    public static function getAnneesDisponibles()
    {
        $sql = "SELECT DISTINCT YEAR(date_echeance) AS annee 
                FROM remboursement 
                ORDER BY annee DESC";
        $result = BaseModel::executeQuery($sql, []);
        $formattedResult = [
            'succes' => $result['succes'],
            'data' => array_map(fn($row) => ['annee' => (int)$row['annee']], $result['data']),
            'message' => $result['message']
        ];
        Flight::json($formattedResult);
    }

    public static function getInteretsParMois()
    {
        $moisMin = $_GET['mois_min'] ?? null;
        $anneeMin = $_GET['annee_min'] ?? null;
        $moisMax = $_GET['mois_max'] ?? null;
        $anneeMax = $_GET['annee_max'] ?? null;

        if (
            !$moisMin || !is_numeric($moisMin) || !$anneeMin || !is_numeric($anneeMin) ||
            !$moisMax || !is_numeric($moisMax) || !$anneeMax || !is_numeric($anneeMax)
        ) {
            Flight::json(['succes' => false, 'message' => 'Paramètres de date non valides']);
            return;
        }

        // Vérifier que la date de fin est postérieure ou égale à la date de début
        $dateDebut = new DateTime("$anneeMin-$moisMin-01");
        $dateFin = new DateTime("$anneeMax-$moisMax-01");
        $dateFin->modify('last day of this month');
        if ($dateFin < $dateDebut) {
            Flight::json(['succes' => false, 'message' => 'La date de fin doit être postérieure ou égale à la date de début']);
            return;
        }

        $sql = "
            SELECT 
                MONTH(r.date_echeance) AS mois,
                SUM(r.interet / p.nombre_mois) AS interet_mensuel
            FROM remboursement r
            JOIN periode p ON r.periode_id = p.id_periode
            WHERE r.date_echeance >= :date_debut
            AND r.date_echeance <= :date_fin
            GROUP BY MONTH(r.date_echeance)
            UNION
            SELECT 
                m.mois + n.n AS mois,
                SUM(r.interet / p.nombre_mois) AS interet_mensuel
            FROM remboursement r
            JOIN periode p ON r.periode_id = p.id_periode
            CROSS JOIN (SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) n
            CROSS JOIN (SELECT 1 AS mois UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 
                        UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12) m
            WHERE p.nombre_mois > 1
            AND r.date_echeance >= :date_debut
            AND r.date_echeance <= :date_fin
            AND m.mois + n <= 12
            AND m.mois + n >= MONTH(r.date_echeance)
            AND m.mois < MONTH(r.date_echeance) + p.nombre_mois
            GROUP BY m.mois + n
        ";
        $params = [
            'date_debut' => $dateDebut->format('Y-m-d'),
            'date_fin' => $dateFin->format('Y-m-d')
        ];
        $result = BaseModel::executeQuery($sql, $params);

        // Initialiser un tableau avec 0 pour chaque mois
        $interets = array_fill(1, 12, 0.00);
        if ($result['succes'] && !empty($result['data'])) {
            foreach ($result['data'] as $row) {
                $mois = (int)$row['mois'];
                $interets[$mois] = round((float)$row['interet_mensuel'], 2);
            }
        }

        Flight::json(['succes' => true, 'data' => $interets]);
    }
}
