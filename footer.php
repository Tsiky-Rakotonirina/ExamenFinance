<?php
// Footer pour l'application ExamenFinance
$currentYear = date('Y');
?>

<footer class="main-footer">
    <div class="footer-container">
        <div class="footer-section">
            <div class="footer-brand">
                <h3><i class="fas fa-university"></i> ExamenFinance</h3>
                <p>Système de Gestion Financière</p>
            </div>
        </div>
        
        <div class="footer-section">
            <h4>Modules</h4>
            <ul class="footer-links">
                <li><a href="template.php?page=gestion-fond"><i class="fas fa-coins"></i> Gestion des Fonds</a></li>
                <li><a href="template.php?page=gestion-type-pret"><i class="fas fa-list-alt"></i> Types de Prêts</a></li>
                <li><a href="template.php?page=gestion-pret-client"><i class="fas fa-users"></i> Prêts Clients</a></li>
                <li><a href="template.php?page=statistique-interet"><i class="fas fa-chart-line"></i> Statistiques</a></li>
            </ul>
        </div>
        
        <div class="footer-section">
            <h4>Navigation</h4>
            <ul class="footer-links">
                <li><a href="index.php"><i class="fas fa-home"></i> Accueil</a></li>
                <li><a href="#" onclick="window.history.back()"><i class="fas fa-arrow-left"></i> Retour</a></li>
                <li><a href="#" onclick="window.location.reload()"><i class="fas fa-refresh"></i> Actualiser</a></li>
            </ul>
        </div>
        
        <div class="footer-section">
            <h4>Informations</h4>
            <ul class="footer-info">
                <li><i class="fas fa-calendar"></i> Année: <?php echo $currentYear; ?></li>
                <li><i class="fas fa-code"></i> Version: 1.0.0</li>
                <li><i class="fas fa-server"></i> Serveur: <?php echo $_SERVER['SERVER_NAME'] ?? 'localhost'; ?></li>
                <li><i class="fas fa-clock"></i> <span id="footer-time"><?php echo date('H:i:s'); ?></span></li>
            </ul>
        </div>
    </div>
    
    <div class="footer-bottom">
        <div class="footer-container">
            <div class="footer-copyright">
                <p>&copy; <?php echo $currentYear; ?> ExamenFinance - Système de Gestion Financière. Tous droits réservés.</p>
            </div>
            <div class="footer-tech">
                <span class="tech-badge">PHP</span>
                <span class="tech-badge">JavaScript</span>
                <span class="tech-badge">HTML5</span>
                <span class="tech-badge">CSS3</span>
            </div>
        </div>
    </div>
</footer>

<script>
// Mettre à jour l'heure toutes les secondes
function updateFooterTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('fr-FR');
    const timeElement = document.getElementById('footer-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// Mise à jour initiale et interval
updateFooterTime();
setInterval(updateFooterTime, 1000);
</script>
