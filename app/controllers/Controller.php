<?php

namespace app\controllers;
use Flight;
use app\models\BaseModel;

class Controller {
    protected $url;

	public function __construct($url) {
        $this->url=$url;
	}

    public function index() {
        $data = ['folder'=>'', 'page'=>'', 'url'=>$this->url, ];
        Flight::render("index", $data);
    }

    public function gestionFond() {
        $data = ['folder'=>'gestionFond/', 'page'=>'gestion-fond', 'url'=>$this->url, ];
        Flight::render("template", $data);
    }
}