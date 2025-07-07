<?php

// PDO::FETCH_ASSOC : récupère les résultats sous forme de tableau associatif.
// PDO::FETCH_OBJ : récupère les résultats sous forme d'objet.
// PDO::PARAM_INT : pour lier un paramètre comme un entier.
// PDO::PARAM_STR : pour lier un paramètre comme une chaîne de caractères.
// PDO::ATTR_ERRMODE : définir le mode d'erreur 
// (par défaut PDO::ERRMODE_SILENT, mais on peut choisir PDO::ERRMODE_WARNING ou PDO::ERRMODE_EXCEPTION).

    function connect() {
        try {
          # MS SQL Server and Sybase with PDO_DBLIB
          $DBH = new PDO("mysql:host=$host;dbname=$dbname, $user, $pass");
          $DBH = new PDO("sybase:host=$host;dbname=$dbname, $user, $pass");
         
          # MySQL with PDO_MYSQL
          $DBH = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
         
          # SQLite Database
          $DBH = new PDO("sqlite:my/database/path/database.db");
          $DBH->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        catch(PDOException $e) {
            echo $e->getMessage();
        }
    }

    function close_connection(){
        $DBH = null;
      }   

    function simpleRequest() {
        $query = 'SELECT * FROM utilisateurs';
        $stmt = $pdo->query($query);
    
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            echo $row['nom'] . ' ' . $row['prenom'] . '<br>';
        }
    }

    function paramRequest() {
        //named 
        $query = 'SELECT * FROM utilisateurs WHERE id = :id';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $id = 1;
        $stmt->execute();
        //or
        $data = ['id'=>1] ;
        $stmt->execute($data);

        //unamed
        $query = 'SELECT * FROM utilisateurs WHERE id = ?';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(1, $id, PDO::PARAM_INT);
        $id = 1;
        $stmt->execute();
        //or
        $data = [1] ;
        $stmt->execute($data);
    }

    function multipleRequest() {
        $query = 'UPDATE utilisateurs SET email = :email WHERE id = :id';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':id', $id);

        $email = 'nouveau1.email@example.com';
        $id = 1;
        $stmt->execute();

        $email = 'nouveau2.email@example.com';
        $id = 2;
        $stmt->execute();

        $email = 'nouveau3.email@example.com';
        $id = 3;
        $stmt->execute();
    }

    function transactionRequest() {
        try {
            // Début de la transaction
            $pdo->beginTransaction();
        
            // Exécution de plusieurs requêtes
            $pdo->exec('UPDATE utilisateurs SET solde = solde - 100 WHERE id = 1');
            $pdo->exec('UPDATE utilisateurs SET solde = solde + 100 WHERE id = 2');
        
            // Validation de la transaction
            $pdo->commit();
        } catch (Exception $e) {
            // Annulation de la transaction en cas d'erreur
            $pdo->rollBack();
            echo "Erreur : " . $e->getMessage();
        }
    }

    function oneRow() {
        $query = 'SELECT * FROM utilisateurs WHERE id = :id';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id', $id);
        $id = 1;
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        echo $row['nom'];

        $row = $stmt->fetch(PDO::FETCH_OBJ);
        echo $row->nom;
    }

    function multipleRows() {
        class utilisateurs {
            public $nom;
            public $prenom;
            function __construct() {
                
            }
        }
        
        $query = 'SELECT * FROM utilisateurs';
        $stmt = $pdo->query($query);
        $rows = $stmt->fetchAll(PDO::FETCH_CLASS, 'utilisateurs');
        
        foreach ($rows as $row) {
            echo $row->nom . ' - ' . $row->prenom . '<br>';
        }
    }

    function numberRows() {
        $query = 'DELETE FROM utilisateurs WHERE id = :id';
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);

        $id = 1;
        $stmt->execute();
        echo $stmt->rowCount();
    }

    function some_other_useful_methods(){
        # Transaction Processing
        $DBH->beginTransaction();
        $DBH->commit();
        $DBH->rollBack();
        
        # retrieves the id field for the last insert query
        # (should be called inside transaction, if there is any transaction in place)
        $DBH->lastInsertId();
        
        # exec() for operations that can not return data other then the affected rows.
        $DBH->exec('DELETE FROM folks WHERE 1');
        $DBH->exec("SET time_zone = '-8:00'");
        
        # quotes strings so they are safe to use in queries.
        # This is your fallback if you're not using prepared statements.!!!
        $safe = $DBH->quote($unsafe);
        
        # returns an integer indicating the number of rows affected by an operation.
        $rows_affected = $STH->rowCount();
        # in a known version of PDO, rowCount() doesn't work for select statements,
        # if so, you can use following code instead:
        $sql = "SELECT COUNT(*) FROM folks";
        if ($STH = $DBH->query($sql)) {
            # check the row count
            if ($STH->fetchColumn() > 0) {
         
            # issue a real select here, because there's data!
            }
            else {
                echo "No rows matched the query.";
            }
        }
    }
?>

