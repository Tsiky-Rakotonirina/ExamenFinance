<?php $url = Flight::request()->base; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <title></title>
    <link rel="icon" type="image/x-icon" href="<?=$url ?>"/>
    <link rel="stylesheet" href="<?=$url ?>/public/assets/css/template.css">
    <link rel="stylesheet" href="<?=$url ?>/public/assets/css/styles.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" >
    <script>const urlBase = '<?= $url ?>'; </script>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="<?=$url ?>/public/assets/js/index.js"></script>
</head>
<body>
    <header>
        <div class="header-content">
            <!-- <a href="<?=$url ?>/" class="logo">ExamenFinance</a> -->
            <nav>
                <!-- <a href="<?=$url ?>/gestionPret" class="active">Gestion des Prêts</a>
                <a href="<?=$url ?>/product">Produits</a>
                <a href="<?=$url ?>/">Accueil</a> -->
            </nav>
        </div>
    </header>
    <main>
        <?php include($folder.$page.".php") ?>    
    </main>
    <footer>
        <!-- <p>&copy; 2025 ExamenFinance - Système d'Information de Gestion des Prêts</p> -->
    </footer>
</body>
</html>