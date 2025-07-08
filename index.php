<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Système de Gestion Financière</title>
    <link rel="stylesheet" href="css/index.css">
    <!-- Font Awesome pour les icônes -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="main-container">
        <h1 class="page-title">Système de Gestion Financière</h1>
        
        <div class="buttons-grid">
            <a href="template.php?page=gestion-fond" class="menu-button">
                <div class="button-icon">
                    <i class="fas fa-coins"></i>
                </div>
                <div class="button-title">Gestion des Fonds</div>
                <div class="button-description">Gérer les fonds disponibles et les allocations</div>
            </a>
            
            <a href="template.php?page=gestion-type-pret" class="menu-button">
                <div class="button-icon">
                    <i class="fas fa-list-alt"></i>
                </div>
                <div class="button-title">Types de Prêts</div>
                <div class="button-description">Configurer les différents types de prêts</div>
            </a>
            
            <a href="template.php?page=gestion-pret-client" class="menu-button">
                <div class="button-icon">
                    <i class="fas fa-users"></i>
                </div>
                <div class="button-title">Prêts Clients</div>
                <div class="button-description">Gérer les prêts accordés aux clients</div>
            </a>
            
            <a href="template.php?page=statistique-interet" class="menu-button">
                <div class="button-icon">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="button-title">Statistiques</div>
                <div class="button-description">Analyser les intérêts et performances</div>
            </a>
        </div>
    </div>
</body>
</html>
