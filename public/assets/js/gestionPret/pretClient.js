document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('#lister-pret tbody');
  const selectTypePret = document.getElementById('type_pret_id');
  const selectCompte = document.getElementById('compte_id');
  const filtreTypePret = document.getElementById('filtre_type_pret_id');
  const filtreCompte = document.getElementById('filtre_compte_id');
  const filtreMontantMin = document.getElementById('filtre_montant_min');
  const filtreMontantMax = document.getElementById('filtre_montant_max');
  const filtreForm = document.getElementById('filtre-prets');
  const resetFiltreBtn = document.getElementById('reset-filtre');
  const triDirectionSelect = document.getElementById('tri_direction'); // à ajouter dans le HTML si pas déjà présent
  let pretsOriginaux = [];
  let triCol = null;
  let triDir = 'ASC';
  // --- Ajout: stockage des contraintes métier par type de prêt ---
  let contraintesTypesPret = {};
  let contraintesTypePretCourant = null;

  // Remplir la liste déroulante des types de pret (pour filtre et ajout)
  function chargerTypesPret() {
    fetch(urlBase + '/gestionPret/listerTypesPret')
      .then(res => res.json())
      .then(json => {
        if (json.succes && Array.isArray(json.data)) {
          selectTypePret.innerHTML = '<option value="">Selectionner...</option>';
          filtreTypePret.innerHTML = '<option value="">Tous</option>';
          contraintesTypesPret = {};
          json.data.forEach(type => {
            const opt1 = document.createElement('option');
            opt1.value = type.id_type_pret;
            opt1.textContent = type.nom;
            selectTypePret.appendChild(opt1);
            const opt2 = document.createElement('option');
            opt2.value = type.id_type_pret;
            opt2.textContent = type.nom;
            filtreTypePret.appendChild(opt2);
            // Stocker les contraintes métier pour chaque type
            contraintesTypesPret[type.id_type_pret] = {
              montant_max: parseFloat(type.montant_max),
              duree_max: parseInt(type.duree_max)
            };
          });
        } else {
          selectTypePret.innerHTML = '<option value="">Aucun type</option>';
          filtreTypePret.innerHTML = '<option value="">Aucun type</option>';
        }
      })
      .catch(() => {
        selectTypePret.innerHTML = '<option value="">Erreur chargement</option>';
        filtreTypePret.innerHTML = '<option value="">Erreur chargement</option>';
      });
  }

  // --- Ajout: mettre à jour les contraintes du type sélectionné ---
  selectTypePret.addEventListener('change', function() {
    const id = this.value;
    contraintesTypePretCourant = contraintesTypesPret[id] || null;
  });

  // Remplir la liste déroulante des comptes (pour filtre et ajout)
  function chargerComptes() {
    fetch(urlBase + '/gestionPret/listerComptes')
      .then(res => res.json())
      .then(json => {
        if (json.succes && Array.isArray(json.data)) {
          selectCompte.innerHTML = '<option value="">Selectionner...</option>';
          filtreCompte.innerHTML = '<option value="">Tous</option>';
          json.data.forEach(compte => {
            const opt1 = document.createElement('option');
            opt1.value = compte.id_compte;
            opt1.textContent = 'Compte #' + compte.id_compte;
            selectCompte.appendChild(opt1);
            const opt2 = document.createElement('option');
            opt2.value = compte.id_compte;
            opt2.textContent = 'Compte #' + compte.id_compte;
            filtreCompte.appendChild(opt2);
          });
        } else {
          selectCompte.innerHTML = '<option value="">Aucun compte</option>';
          filtreCompte.innerHTML = '<option value="">Aucun compte</option>';
        }
      })
      .catch(() => {
        selectCompte.innerHTML = '<option value="">Erreur chargement</option>';
        filtreCompte.innerHTML = '<option value="">Erreur chargement</option>';
      });
  }

  // Fonction pour afficher la liste des prets
  function afficherPrets(prets) {
    tbody.innerHTML = '';
    prets.forEach(p => {
      const tr = document.createElement('tr');
      tr.id = `pret-${p.id_pret}`;
      tr.dataset.id = p.id_pret;
      tr.innerHTML = `
        <td>${p.id_pret}</td>
        <td>${p.date_pret ? p.date_pret.substr(0, 10) : ''}</td>
        <td>${p.type_pret_id}</td>
        <td>${p.compte_id}</td>
        <td>${parseFloat(p.montant).toFixed(2)}</td>
        <td>${p.duree}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Applique le filtre et le tri côté JS
  function filtrerEtTrierPrets() {
    let prets = [...pretsOriginaux];
    // Filtrage
    if (filtreTypePret.value) prets = prets.filter(p => p.type_pret_id == filtreTypePret.value);
    if (filtreCompte.value) prets = prets.filter(p => p.compte_id == filtreCompte.value);
    if (filtreMontantMin.value) prets = prets.filter(p => parseFloat(p.montant) >= parseFloat(filtreMontantMin.value));
    if (filtreMontantMax.value) prets = prets.filter(p => parseFloat(p.montant) <= parseFloat(filtreMontantMax.value));
    // --- Ajout : sens du tri selon le select ---
    if (triDirectionSelect && triDirectionSelect.value) {
      triDir = triDirectionSelect.value;
    }
    // Tri
    if (triCol) {
      prets.sort((a, b) => {
        if (a[triCol] == b[triCol]) return 0;
        if (triDir === 'DESC') return (a[triCol] < b[triCol]) ? 1 : -1;
        return (a[triCol] > b[triCol]) ? 1 : -1;
      });
    }
    afficherPrets(prets);
  }

  // Charger la liste des prets
  function chargerListePrets() {
    fetch(urlBase + '/gestionPret/api/lister')
      .then(res => res.json())
      .then(json => {
        if (json.succes) {
          pretsOriginaux = json.data || [];
          filtrerEtTrierPrets();
        } else {
          alert(json.message || 'Erreur chargement prets');
        }
      })
      .catch(err => alert('Erreur chargement prets : ' + err));
  }

  // Ajouter un pret
  document.querySelector('#ajouter-pret').addEventListener('submit', e => {
    e.preventDefault();
    const data = {
      date_pret: document.querySelector('#date_pret').value,
      type_pret_id: document.querySelector('#type_pret_id').value,
      compte_id: document.querySelector('#compte_id').value,
      montant: parseFloat(document.querySelector('#montant').value),
      duree: parseInt(document.querySelector('#duree').value)
    };
    if (!data.date_pret || isNaN(data.montant) || isNaN(data.duree)) {
      alert('Champs obligatoires manquants ou invalides');
      return;
    }
    // --- Vérification côté client des contraintes métier ---
    const contraintes = contraintesTypesPret[data.type_pret_id];
    if (contraintes) {
      if (data.montant > contraintes.montant_max) {
        alert('Montant maximum autorisé pour ce type de prêt : ' + contraintes.montant_max);
        return;
      }
      if (data.duree > contraintes.duree_max) {
        alert('Durée maximum autorisée pour ce type de prêt : ' + contraintes.duree_max);
        return;
      }
    }
    fetch(urlBase + '/gestionPret/ajouter', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
      alert(json.message || (json.succes ? 'Pret ajoute' : 'Erreur ajout'));
      if (json.succes) {
        document.querySelector('#ajouter-pret').reset();
        chargerListePrets();
      }
    })
    .catch(err => alert('Erreur ajout : ' + err));
  });

  // Gestion du filtre
  filtreForm.addEventListener('submit', e => {
    e.preventDefault();
    filtrerEtTrierPrets();
  });
  resetFiltreBtn.addEventListener('click', () => {
    filtreTypePret.value = '';
    filtreCompte.value = '';
    filtreMontantMin.value = '';
    filtreMontantMax.value = '';
    triCol = null;
    triDir = 'ASC';
    // Enlever les classes actives des boutons de tri
    document.querySelectorAll('.btn-tri').forEach(b => b.classList.remove('tri-actif'));
    if (triDirectionSelect) triDirectionSelect.value = 'ASC';
    filtrerEtTrierPrets();
  });
  document.querySelectorAll('.btn-tri').forEach(btn => {
    btn.addEventListener('click', () => {
      const col = btn.dataset.col;
      // Enlever la classe active de tous les boutons
      document.querySelectorAll('.btn-tri').forEach(b => b.classList.remove('tri-actif'));
      // Ajouter la classe active au bouton cliqué
      btn.classList.add('tri-actif');
      
      if (triCol === col) {
        triDir = triDir === 'ASC' ? 'DESC' : 'ASC';
      } else {
        triCol = col;
        triDir = 'ASC';
      }
      // Mettre à jour le select de direction
      if (triDirectionSelect) triDirectionSelect.value = triDir;
      filtrerEtTrierPrets();
    });
  });
  // Mettre à jour le tri quand on change le select ASC/DESC
  if (triDirectionSelect) {
    triDirectionSelect.addEventListener('change', () => {
      triDir = triDirectionSelect.value;
      filtrerEtTrierPrets();
    });
  }

  // Chargement initial : afficher tous les prets et remplir les listes deroulantes
  chargerTypesPret();
  chargerComptes();
  chargerListePrets();
});
