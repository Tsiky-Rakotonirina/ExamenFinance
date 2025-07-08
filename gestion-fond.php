<link rel="stylesheet" href="css/gestionFond.css">
<script src="js/gestionFond.js"></script>

<div class="main-container">
    <h1>Gestion de fonds</h1>
    
    <div class="layout-container">
        <!-- Section gauche - FIXE -->
        <div class="left-panel">
            <h3>Ajout de fond</h3>
            <form id="ajouter-fond">
                <label for="montant">Montant :</label><br>
                <input type="number" id="a_montant" placeholder="Ex : 200000" min="0" step="1" required><br><br>
                <button type="button" id="btn-ajouter-fond">Ajouter</button><br>
            </form>
            <h5 id="fond-actuel">Total des fonds</h5>
        </div>
        
        <!-- Section droite -->
        <div class="right-panel">
            <!-- Partie haute - FIXE -->
            <div class="filter-section">
                <h3>Critères de filtre de fonds</h3>
                <form action="filtrer-fond">
                    <div class="filter-row">
                        <div>
                            <label for="montant_min">Montant min :</label>
                            <input type="number" id="f_montant_min" min="0" step="1">
                        </div>
                        <div>
                            <label for="montant_max">Montant max :</label>
                            <input type="number" id="f_montant_max" min="0" step="1">
                        </div>
                    </div>
                    <div class="filter-row">
                        <div>
                            <label for="date_ajout_min">Date ajout min :</label>
                            <input type="date" id="f_date_ajout_min">
                        </div>
                        <div>
                            <label for="date_ajout_max">Date ajout max :</label>
                            <input type="date" id="f_date_ajout_max">
                        </div>
                    </div>
                    <button type="button" id="btn-filtrer-fond">Filtrer</button>
                </form>
            </div>
            
            <!-- Partie basse - AVEC SCROLL -->
            <div class="table-section">
                <h3>Liste de fonds</h3>
                <div class="table-scroll">
                    <table id="lister-fond">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th id="th-date-fond" style="cursor: pointer;">Date fond ↑↓</th>
                                <th id="th-montant" style="cursor: pointer;">Montant ↑↓</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>