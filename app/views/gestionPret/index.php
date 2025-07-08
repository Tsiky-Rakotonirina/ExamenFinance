<!-- Inclusion du CSS spécifique -->
<link rel="stylesheet" href="<?=$url ?>/public/assets/css/gestionPret/index.css">

<!-- Expose base_url pour JS -->
<script>window.BASE_URL = "<?=$url?>";</script>

<!-- Inclusion des JS spécifiques -->
<script src="<?=$url ?>/public/assets/js/gestionPret/dataManager.js" defer></script>
<script src="<?=$url ?>/public/assets/js/gestionPret/uiManager.js" defer></script>

<div class="gestion-pret-layout">
  <div class="col-gauche">
    <h2>Filtrer les prêts</h2>
    <div class="content-zone">
    <form id="filtre-prets">
        <div class="form-group">
            <label for="filtre_type_pret_id">Type de prêt :</label>
            <select id="filtre_type_pret_id" name="type_pret_id">
                <option value="">Tous</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="filtre_compte_id">Compte :</label>
            <select id="filtre_compte_id" name="compte_id">
                <option value="">Tous</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="filtre_montant_min">Montant min :</label>
            <input type="number" id="filtre_montant_min" name="montant_min" step="0.01" placeholder="0.00">
        </div>
        
        <div class="form-group">
            <label for="filtre_montant_max">Montant max :</label>
            <input type="number" id="filtre_montant_max" name="montant_max" step="0.01" placeholder="999999.99">
        </div>
        
        <div class="filtre-actions">
            <button type="submit" class="btn-primary">Filtrer</button>
            <button type="button" id="reset-filtre" class="btn-secondary">Reset</button>
        </div>
    </form>
    <div class="tri-container">
        <span>Trier par :</span>
        <div class="tri-buttons">
            <button type="button" class="btn-tri" data-col="date_pret">Date</button>
            <button type="button" class="btn-tri" data-col="montant">Montant</button>
            <button type="button" class="btn-tri" data-col="duree">Durée</button>
        </div>
        <div class="tri-direction-group">
            <label for="tri_direction">Sens :</label>
            <select id="tri_direction" name="tri_direction">
                <option value="ASC">Ascendant</option>
                <option value="DESC">Descendant</option>
            </select>
        </div>
    </div>
    <h2>Liste des prêts</h2>
    <div class="table-container">
        <table id="lister-pret">
            <thead>
                <tr>
                    <th>ID Prêt</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Compte</th>
                    <th>Montant</th>
                    <th>Durée</th>
                </tr>
            </thead>
            <tbody>
                <!-- Les prêts seront affichés ici par JS -->
            </tbody>
        </table>
        
        <!-- Pagination -->
        <div class="pagination-container">
            <div class="pagination-info">
                <span id="pagination-info-text">Affichage de 0 à 0 sur 0 prêts</span>
            </div>
            <div class="pagination-controls">
                <button type="button" id="pagination-first" class="pagination-btn">
                    <i class="fas fa-angle-double-left"></i>
                </button>
                <button type="button" id="pagination-prev" class="pagination-btn">
                    <i class="fas fa-angle-left"></i>
                </button>
                <div id="pagination-numbers" class="pagination-numbers">
                    <!-- Les numéros de page seront générés ici -->
                </div>
                <button type="button" id="pagination-next" class="pagination-btn">
                    <i class="fas fa-angle-right"></i>
                </button>
                <button type="button" id="pagination-last" class="pagination-btn">
                    <i class="fas fa-angle-double-right"></i>
                </button>
            </div>
            <div class="pagination-size">
                <label for="pagination-size-select">Lignes par page :</label>
                <select id="pagination-size-select" class="pagination-size-select">
                    <option value="5">5</option>
                    <option value="10" selected>10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                </select>
            </div>
        </div>
    </div>
    </div>
  </div>
  <div class="col-droite">
    <h2>Ajouter un prêt</h2>
    <div class="content-zone">
    <form id="ajouter-pret" action="/ajouter-pret" method="post">
        <div class="form-group">
            <label for="date_pret">Date du prêt :</label>
            <input type="date" id="date_pret" name="date_pret" required>
        </div>

        <div class="form-group bg-loan-type">
            <label for="type_pret_id">Type de prêt :</label>
            <div class="types-pret-container" id="types-pret-container">
                <!-- Les types de prêt seront chargés ici par JS -->
            </div>
        </div>

        <div class="form-row">
            <div class="form-group bg-period">
                <label for="periode_id">Période de remboursement :</label>
                <select id="periode_id" name="periode_id" required>
                    <option value="">Sélectionner...</option>
                    <!-- Les périodes seront chargées ici par JS -->
                </select>
            </div>
            <div class="form-group bg-period">
                <label for="duree">Durée (mois) :</label>
                <input type="number" id="duree" name="duree" required placeholder="12">
            </div>
        </div>

        <div class="form-group bg-account">
            <label for="compte_id">Compte :</label>
            <div class="comptes-container" id="comptes-container">
                <!-- Les comptes seront chargés ici par JS -->
            </div>
        </div>

        <div class="form-group bg-money">
            <label for="montant">Montant :</label>
            <input type="number" step="0.01" id="montant" name="montant" required placeholder="0.00">
        </div>

        <button type="submit" id="btn-ajouter-pret" class="btn-primary">Ajouter le prêt</button>
    </form>
    </div>
  </div>
</div>