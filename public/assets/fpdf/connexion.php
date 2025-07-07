<?php
    $host='localhost';
    $dbname='pdf';
    $user='root';
    $pass='';
    $bdd = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $bdd->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
?>