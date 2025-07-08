<?php
function getDB()
{
    $host = 'localhost';
    $dbname = 'db_s2_ETU03256';
    $username = 'ETU003256';
    $password = 'hKziofbP';

    try {
        return new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
    } catch (PDOException $e) {
        die(json_encode(['error' => $e->getMessage()]));
    }
}
