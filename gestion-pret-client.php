<script src="js/gestionPretClient.js" defer></script>
<link rel="stylesheet" href="css/gestionPretClient.css">
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
            <button type="submit">Filtrer</button>
            <button type="button" id="reset-filtre">Reset</button>
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
                    <th>Pourcentage Assurance</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <!-- Les prêts seront affichés ici par JS -->
            </tbody>
        </table>
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

        <div class="form-group" style="background:#e3f2fd;padding:12px;border-radius:8px;margin-bottom:12px;">
            <label for="type_pret_id">Type de prêt :</label>
            <div class="types-pret-container" id="types-pret-container">
                <!-- Les types de prêt seront chargés ici par JS -->
            </div>
        </div>

        <div class="form-row" style="display:flex;gap:16px;align-items:flex-end;margin-bottom:12px;">
            <div class="form-group" style="flex:1;background:#fff3e0;padding:12px;border-radius:8px;">
                <label for="periode_id">Période de remboursement :</label>
                <select id="periode_id" name="periode_id" required>
                    <option value="">Sélectionner...</option>
                    <!-- Les périodes seront chargées ici par JS -->
                </select>
            </div>
            <div class="form-group" style="flex:1;background:#fff3e0;padding:12px;border-radius:8px;">
                <label for="duree">Nombre de periode :</label>
                <input type="number" id="duree" name="duree" required placeholder="12">
            </div>
        </div>

        <div class="form-group" style="background:#e8f5e9;padding:12px;border-radius:8px;margin-bottom:12px;">
            <label for="compte_id">Compte :</label>
            <div class="comptes-container" id="comptes-container">
                <!-- Les comptes seront chargés ici par JS -->
            </div>
        </div>

        <div class="form-group" style="background:#e8f5e9;padding:12px;border-radius:8px;margin-bottom:12px;">
            <label for="pourcentage_assurance">Pourcentage Assurance :</label>
            <input type="number" step="0.01" id="pourcentage_assurance" name="pourcentage_assurance" required placeholder="0">
        </div>

        <div class="form-group bg-money">
            <label for="montant">Montant :</label>
            <input type="number" step="0.01" id="montant" name="montant" required placeholder="0.00">
        </div>

        <button type="submit" id="btn-ajouter-pret">Ajouter le prêt</button>
    </form>
    </div>
  </div>
</div>