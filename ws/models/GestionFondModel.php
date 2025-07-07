<?php
require_once __DIR__ . '/BaseModel.php';

class GestionFondModel extends BaseModel {

    public static function fondActuel() {
        $result = 0;
        $query = "SELECT SUM(montant) FROM fond";
        $fondTotal = self::executeQuery($query, []);
        $fondTotal = $fondTotal['data'][0][0];
        $query = "SELECT SUM(montant) FROM pret";
        $pretTotal = self::executeQuery($query, []);
        $pretTotal = $pretTotal['data'][0][0];
        $result = $fondTotal - $pretTotal;
        return $result;
    }
}