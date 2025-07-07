<link rel="stylesheet" href="css/gestionTypePret.css">
<script src="js/gestionTypePret.js"></script>

<div class="main-container">
    <div class="layout-container">
        <!-- Panel gauche : Ajout -->
        <div class="left-panel">
            <h3>Ajout Type de Prêt</h3>
            <form id="ajouter-type-pret">
                <input type="text" id="a_nom" placeholder="Nom" required>
                <input type="date" id="a_date_type_pret" placeholder="Date du type de prêt" required>
                <select id="a_status_type_pret_id" required></select>
                <input type="number" id="a_mois_max" placeholder="Durée max (mois)" required>
                <input type="number" id="a_montant_max" placeholder="Montant max" step="0.01" required>
                <input type="number" id="a_taux_annuel" placeholder="Taux annuel (%)" step="0.01" required>
                <input type="number" id="a_echeance_initiale" placeholder="Échéance initiale (entier)" required>
                <button id="btn-ajouter-type-pret" type="button">Ajouter</button>
            </form>
        </div>
        <!-- Panel droit : Filtres + Table -->
        <div class="right-panel">
            <div class="filter-section">
                <h3>Filtre Type de Prêt</h3>
                <div id="filtrer-type-pret" class="filter-row">
                    <label>Nom contient : <input type="text" id="f_nom" placeholder="Texte"></label>
                    <label>Date min : <input type="date" id="f_date_type_pret_min"></label>
                    <label>Date max : <input type="date" id="f_date_type_pret_max"></label>
                    <label>Statut :
                        <select id="f_status_type_pret_id">
                            <option value="">-- Tous --</option>
                        </select>
                    </label>
                    <label>Durée max min : <input type="number" id="f_mois_max_min" placeholder="Min"></label>
                    <label>Durée max max : <input type="number" id="f_mois_max_max" placeholder="Max"></label>
                    <label>Montant max min : <input type="number" id="f_montant_max_min" step="0.01" placeholder="Min"></label>
                    <label>Montant max max : <input type="number" id="f_montant_max_max" step="0.01" placeholder="Max"></label>
                    <label>Taux annuel min : <input type="number" id="f_taux_annuel_min" step="0.01" placeholder="Min"></label>
                    <label>Taux annuel max : <input type="number" id="f_taux_annuel_max" step="0.01" placeholder="Max"></label>
                    <label>Échéance initiale min : <input type="number" id="f_echeance_initiale_min" placeholder="Min"></label>
                    <label>Échéance initiale max : <input type="number" id="f_echeance_initiale_max" placeholder="Max"></label>
                    <button id="btn-filtrer-type-pret" type="button">Filtrer</button>
                </div>
            </div>
            <div class="table-section">
                <h3>Liste des Types de Prêt</h3>
                <div class="table-scroll">
                    <table id="lister-type-pret">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom</th>
                                <th>Date</th>
                                <th>Statut</th>
                                <th>Durée mois max</th>
                                <th>Montant max</th>
                                <th>Taux annuel (%)</th>
                                <th>Échéance initiale</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Généré par JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modale modification -->
<div id="modifier-type-pret-div" class="modal">
    <span id="btn-fermer-modification" class="close-btn">&times;</span>
    <h3>Fiche de modification de Type de Pret</h3>
    <form id="modifier-type-pret">
        <input type="hidden" id="m_id_type_pret">
        <input type="text" id="m_nom" required>
        <input type="date" id="m_date_type_pret" required>
        <select id="m_status_type_pret_id" required></select>
        <input type="number" id="m_mois_max" required>
        <input type="number" id="m_montant_max" step="0.01" required>
        <input type="number" id="m_taux_annuel" step="0.01" required>
        <input type="number" id="m_echeance_initiale" placeholder="Échéance initiale (entier)" required>
        <button id="btn-modifier-type-pret" type="submit">Valider</button>
    </form>
</div>

<!-- Modale historique -->
<div id="historique-type-pret-div" class="modal">
    <span id="btn-fermer-historique" class="close-btn">&times;</span>
    <h3>Historique du type de prêt</h3>
    <table id="table-historique-type-pret">
        <thead>
            <tr>
                <th>Date</th>
                <th>Statut</th>
                <th>Durée mois max</th>
                <th>Montant max</th>
                <th>Taux annuel</th>
                <th>Échéance initiale</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</div>