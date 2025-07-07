<link rel="stylesheet" href="<?=$url ?>/public/assets/css/index.css">
<script src="<?=$url ?>/public/assets/js/index.js"></script>

<div>
  <h3>Ajout Produit</h3>
  
  <form id="ajouter-produit">
    <input type="text" id="a_nom" placeholder="Nom" required>
    <input type="text" id="a_description" placeholder="Description" required>
    <input type="number" id="a_prix" placeholder="Prix" step="0.01" required>
    <input type="number" id="a_quantite_en_stock" placeholder="Quantité" required>
    <input type="date" id="a_date_ajout" required>
    <select id="a_est_actif" required>
      <option value="1">Actif</option>
      <option value="0">Inactif</option>
    </select>
    <button id="btn-ajouter-produit" type="button">Ajouter</button>
  </form>
</div>
<br>
<div>
  <h3>Filtre produit</h3>
  <div id="filtrer-produit" style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc;">
    <label>Description contient : <input type="text" id="f_description" placeholder="Texte"></label>
    <label>Prix min : <input type="number" id="f_prix_min" step="0.01" placeholder="Min"></label>
    <label>Prix max : <input type="number" id="f_prix_max" step="0.01" placeholder="Max"></label>
    <label>Quantité min : <input type="number" id="f_quantite_en_stock_min" placeholder="Min"></label>
    <label>Quantité max : <input type="number" id="f_quantite_en_stock_max" placeholder="Max"></label>
    <label>Date min : <input type="date" id="f_date_ajout_min"></label>
    <label>Date max : <input type="date" id="f_date_ajout_max"></label>
    <label>Statut :
      <select id="f_est_actif">
        <option value="">-- Tous --</option>
        <option value="1">Actif</option>
        <option value="0">Inactif</option>
      </select>
    </label>
    <button id="btn-filtrer-produit" type="button">Filtrer</button>
  </div>
</div>
<br>
<div>
  <table id="lister-produit">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nom</th>
        <th>Description</th>
        <th>Prix</th>
        <th>Quantité</th>
        <th>Date ajout</th>
        <th>Statut</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      
    </tbody>
  </table>
</div>
<br>
<div id="modifier-produit-div" style="display:none; position:fixed; top:20%; left:50%; transform:translateX(-50%); background:#fff; border:1px solid #ccc; padding:15px; z-index:1000;">
  <span id="btn-fermer-modification" class="close-btn" style="cursor:pointer; float:right; font-size:20px;">&times;</span>
  <h3>Fiche de modification de produit</h3>
  <form id="modifier-produit">
    <input type="hidden" id="m_id_produit">
    <input type="text" id="m_nom" required>
    <input type="text" id="m_description" required>
    <input type="number" id="m_prix" step="0.01" required>
    <input type="number" id="m_quantite_en_stock" required>
    <input type="date" id="m_date_ajout" required>
    <select id="m_est_actif" required>
      <option value="1">Actif</option>
      <option value="0">Inactif</option>
    </select>
    <button id="btn-modifier-produit" type="submit">Valider</button>
  </form>
</div>
