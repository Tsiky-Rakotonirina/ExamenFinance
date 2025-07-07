<?php
    if(isset($_FILE["image"])){
        $tailleMax = 500000;
        $taille = filesize($_FILES['image']['tmp_name']);
        $extensions = array('.png', '.gif', '.jpg', '.jpeg');
        $extension = strrchr($_FILES['image']['name'], '.');
        if(in_array($extension, $extensions) && $taille>$tailleMax) {
            $nom=time();
            $repertoire ='/public/assets/images/';
            $cheminBase =  $repertoire . $nom . $extension;
            $cheminDeplacement = $_SERVER['DOCUMENT_ROOT'] . $this->url . $cheminBase;
            if (move_uploaded_file($_FILES['image']['tmp_name'], $cheminDeplacement)) {

            }  else {

            }
        } else {

        }
    }
?>