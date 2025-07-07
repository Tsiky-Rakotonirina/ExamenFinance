<?php
    // nombre de elements
    count($array);

    // fusionner
    $merged = array_merge($array1, $array2);

    // spprimer un element
    unset($array[1]); 

    //  boolean sur existance existe
    in_array('value', $array);

    // trier par ordre croissant
    sort($array);

    // filtre par fonction
    $filtered = array_filter($array, function($value) {
        return $value > 2;
    });

    // melanger
    shuffle($array);

    // Retourne ['Hello', 'World']
    explode(' ', 'Hello World'); 

    // Retourne 'Hello World'
    implode(' ', ['Hello', 'World']); 

    // lire un fichier
    $file = fopen('fichier.txt', 'r');
    while ($line = fgets($file)) {
        echo $line;
    }
    fclose($file);

    // ajouter du contenu a un fichier
    file_put_contents('fichier.txt', 'Contenu à ajouter', FILE_APPEND);

    // liste les fichiers
    scandir('/chemin/vers/repertoire');

    // date actuel
    date('Y-m-d H:m:s');
    
    // date actuel en timestamp
    time(); 

    // verification de types
    is_array($array); // Retourne true si $array est un tableau
    is_string('Hello'); // Retourne true
    is_int(10); // Retourne true

    // arrondissement
    is_int(10); // Retourne true

    // racine
    sqrt(16); // Retourne 4

    // random
    rand(1, 100); 

    //  variable vide
    empty($var); // Retourne true si la variable est vide

    // redirection
    header('Location: http://www.example.com');
?>