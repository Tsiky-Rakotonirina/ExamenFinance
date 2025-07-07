<?php
use flight\Engine;
use flight\database\PdoWrapper;
use flight\debug\database\PdoQueryCapture;
use Tracy\Debugger;
// use app\models\BaseModel;
use app\models\ProductModel;
use app\models\gestionFond\GestionFondModel;

 $dsn = 'mysql:host=' . $config['database']['host'] . ';dbname=' . $config['database']['dbname'] . ';charset=utf8mb4';
 $pdoClass = Debugger::$showBar === true ? PdoQueryCapture::class : PdoWrapper::class;
 $app->register('db', $pdoClass, [ $dsn, $config['database']['user'] ?? null, $config['database']['password'] ?? null ]);

// Flight::map('BaseModel', function () {
//     return new BaseModel(Flight::db());
// });

Flight::map('ProductModel', function () {
    return new ProductModel(Flight::db());
});

Flight::map('GestionFondModel', function () {
    return new GestionFondModel(Flight::db());
});
