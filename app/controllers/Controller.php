<?php

namespace app\controllers;

use Flight;
use app\models\BaseModel;

class Controller
{
    protected $url;

    public function __construct($url)
    {
        $this->url = $url;
    }

    public function index()
    {
        // $data = ['folder'=>'', 'page'=>'', 'url'=>$this->url, ];
        Flight::redirect("/lister-produit");
    }
}
