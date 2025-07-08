<link rel="stylesheet" href="css/gestionTypePret.css">
<script src="js/gestionTypePret.js"></script>

<div class="main-container">
    <h1>Gestion de types de prets</h1>
    <div class="layout-container">
        <!-- Panel gauche : Ajout -->
        <div class="left-panel">
            <h3>Ajout Type de Prêt</h3>
            <form id="ajouter-type-pret">
                <label for="nom">Nom :</label>
                <input type="text" id="a_nom" placeholder="Nom" required>
                <label for="status_pret">Status pret :</label>
                <select id="a_status_type_pret_id" required></select>
                <label for="Mois max">Mois max :</label>
                <input type="number" id="a_mois_max" placeholder="Durée max (mois)" required>
                <label for="montant_max">Montant max :</label>
                <input type="number" id="a_montant_max" placeholder="Montant max" step="1" required>
                <label for="taux_annuel">Taux annuel :</label>
                <input type="number" id="a_taux_annuel" placeholder="Taux annuel (%)" step="1" required>
                <label for="echeance_initiale">Echeance initiale :</label>
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
                    <label>Statut :
                        <select id="f_status_type_pret_id">
                            <option value="">-- Tous --</option>
                        </select>
                    </label>
                    <label>Date min : <input type="date" id="f_date_type_pret_min"></label>
                    <label>Date max : <input type="date" id="f_date_type_pret_max"></label>
                    <label>Durée max min : <input type="number" id="f_mois_max_min" placeholder="Min"></label>
                    <label>Durée max max : <input type="number" id="f_mois_max_max" placeholder="Max"></label>
                    <label>Montant max min : <input type="number" id="f_montant_max_min" step="1" placeholder="Min"></label>
                    <label>Montant max max : <input type="number" id="f_montant_max_max" step="1" placeholder="Max"></label>
                    <label>Taux annuel min : <input type="number" id="f_taux_annuel_min" step="1" placeholder="Min"></label>
                    <label>Taux annuel max : <input type="number" id="f_taux_annuel_max" step="1" placeholder="Max"></label>
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
                                <th>Mois max</th>
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
        <label for="nom">Nom :</label>
        <input type="text" id="m_nom" required>
        <label for="status_pret">Status pret :</label>
        <select id="m_status_type_pret_id" required></select>
        <label for="Mois max">Mois max :</label>
        <input type="number" id="m_mois_max" required>
        <label for="montant_max">Montant max :</label>
        <input type="number" id="m_montant_max" step="1" required>
        <label for="taux_annuel">Taux annuel :</label>
        <input type="number" id="m_taux_annuel" step="1" required>
        <label for="echeance_initiale">Echeance initiale :</label>
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
                <th>Nom</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Mois max</th>
                <th>Montant max</th>
                <th>Taux annuel</th>
                <th>Échéance initiale</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>
</div>