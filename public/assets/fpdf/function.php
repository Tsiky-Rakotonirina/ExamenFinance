<?php
    function getStudentInfo() {
        include("connexion.php");
        $idEtudiant = 1;
        $request = "SELECT 
                e.idEtudiant, e.nom, e.prenom, e.naissance, e.lieu, e.inscription, e.classe, 
                n.semestre, n.Note, m.matiere, m.codematiere, n.credit, n.resultat
            FROM 
                etudiant e
            JOIN 
                note n ON e.idEtudiant = n.idEtudiant
            JOIN 
                matiere m ON n.idMatiere = m.idMatiere
            WHERE 
                e.idEtudiant = :idEtudiant 
                AND n.semestre IN (1, 2)
            ORDER BY 
                n.semestre, m.matiere";
        $stmt = $bdd->prepare($request);

        $stmt->execute([':idEtudiant' => $idEtudiant]);
        $studentInfo = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $studentInfo;
    }
?>
