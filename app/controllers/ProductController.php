<?php

namespace app\controllers;

use Flight;
use app\models\ProductModel;

class ProductController
{
    protected $url;
    protected $productModel;

    public function __construct($url)
    {
        $this->url = $url;
    }

    public function listerProduit()
    {
        $data = ['folder' => '', 'page' => 'product', 'url' => $this->url,];

        Flight::render('template', $data);
    }

    public function filtrerProduit()
    {
        $params = $_GET;
        $output = Flight::ProductModel()->selectionnerDonnee('produit', $params);
        Flight::json($output);
    }

    public function ajouterProduit()
    {
        $input = Flight::request()->data->getData();
        $output = Flight::ProductModel()->insererDonnee('produit', $input);
        Flight::json($output);
    }

    public function modifierProduit()
    {
        $input = Flight::request()->data->getData();
        $id = $input['id_produit'] ?? null;
        unset($input['id_produit']);
        if (!$id) {
            Flight::json(['succes' => false]);
            return;
        }
        $output = Flight::ProductModel()->modifierDonnee('produit', $input, ['id_produit' => $id]);
        Flight::json($output);
    }

    public function supprimerProduit()
    {
        $id = $_GET['id_produit'] ?? null;
        if (!$id) {
            Flight::json(['succes' => false]);
            return;
        }
        $output = Flight::ProductModel()->supprimerDonnee('produit', ['id_produit' => $id]);
        Flight::json($output);
    }
}
