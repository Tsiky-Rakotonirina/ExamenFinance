<?php

namespace app\controllers\gestionCompte;

use Flight;
use app\models\gestionFond\GestionCompteModel;

class GestionCompteController{
    protected $url;

    public function __construct($url) {
        $this->url = $url;
    }

}
