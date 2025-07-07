<?php
namespace app\models\gestionFond;

use app\models\BaseModel;

class GestionFondModel extends BaseModel {

    public function fondActuel() {
        $result = 0;
        $query = "SELECT SUM(montant) FROM fond";
        $fondTotal = $this->executeQuery($query, []);
        $fondTotal = $fondTotal['data'][0][0];
        $query = "SELECT SUM(montant) FROM pret";
        $pretTotal = $this->executeQuery($query, []);
        $pretTotal = $pretTotal['data'][0][0];
        $result = $fondTotal - $pretTotal;
        return $result;
    }
}