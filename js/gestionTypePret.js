document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('#lister-type-pret tbody');

  // Fonction pour afficher la liste dans le tableau
  function afficherTypesPret(types) {
    tbody.innerHTML = '';
    types.forEach(t => {
      const tr = document.createElement('tr');
      tr.id = `type-pret-${t.id_type_pret}`;
      tr.dataset.id = t.id_type_pret;
      tr.innerHTML = `
        <td>${t.id_type_pret}</td>
        <td>${t.nom}</td>
        <td>${t.date_type_pret ? t.date_type_pret.substr(0, 10) : ''}</td>
        <td>${t.status_nom || t.status_type_pret_id}</td>
        <td>${t.mois_max}</td>
        <td>${parseFloat(t.montant_max).toFixed(2)}</td>
        <td>${parseFloat(t.taux_annuel).toFixed(2)}</td>
        <td>${t.echeance_initiale}</td>
        <td>
          <button class="btn-fiche-type-pret" data-id="${t.id_type_pret}">Modifier</button>
          <button class="btn-historique-type-pret" data-id="${t.id_type_pret}">Historique</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Fonction pour charger la liste selon filtres
  function chargerListeTypesPret(params = {}) {
    const query = new URLSearchParams(params).toString();
    fetch(urlBase + '/filtrer-type-pret' + (query ? '?' + query : '') , {
      method: 'GET',})
      .then(res => res.json())
      .then(json => {
      if (json.succes) {
        afficherTypesPret(json.data || []);
        attachEventListeners();
      } else {
        alert(json.message || 'Erreur chargement types de prêt');
      }
    })
    .catch(err => alert('Erreur chargement types de prêt : ' + err));
  }

  // Événement bouton Filtrer
 document.querySelector('#btn-filtrer-type-pret').addEventListener('click', () => {
   const params = {
    nom: document.querySelector('#f_nom').value,
    date_type_pret_min: document.querySelector('#f_date_type_pret_min').value,
    date_type_pret_max: document.querySelector('#f_date_type_pret_max').value,
    echeance_initiale_min: document.querySelector('#f_echeance_initiale_min').value,
    echeance_initiale_max: document.querySelector('#f_echeance_initiale_max').value,
    status_type_pret_id: document.querySelector('#f_status_type_pret_id').value,
    mois_max_min: document.querySelector('#f_mois_max_min').value,
    mois_max_max: document.querySelector('#f_mois_max_max').value,
    montant_max_min: document.querySelector('#f_montant_max_min').value,
    montant_max_max: document.querySelector('#f_montant_max_max').value,
    taux_annuel_min: document.querySelector('#f_taux_annuel_min').value,
    taux_annuel_max: document.querySelector('#f_taux_annuel_max').value,
  };
  Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
  chargerListeTypesPret(params);
});

  // Événement bouton Ajouter
  document.querySelector('#btn-ajouter-type-pret').addEventListener('click', () => {
    const data = {
    nom: document.querySelector('#a_nom').value.trim(),
    status_type_pret_id: parseInt(document.querySelector('#a_status_type_pret_id').value),
    mois_max: parseInt(document.querySelector('#a_mois_max').value),
    montant_max: parseFloat(document.querySelector('#a_montant_max').value),
    taux_annuel: parseFloat(document.querySelector('#a_taux_annuel').value),
    echeance_initiale: parseInt(document.querySelector('#a_echeance_initiale').value)
  };
    if (!data.nom || isNaN(data.montant_max) || isNaN(data.taux_annuel)) {
      alert('Nom, montant max et taux_annuel valides obligatoires');
      return;
    }

    fetch(urlBase + '/ajouter-type-pret', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
      alert(json.message || (json.succes ? 'Type de prêt ajouté' : 'Erreur ajout'));
      if (json.succes) {
        document.querySelector('#ajouter-type-pret').reset();
        chargerListeTypesPret();
      }
    })
    .catch(err => alert('Erreur ajout : ' + err));
  });

  // Ouvrir formulaire modification et pré-remplir
  function ouvrirFicheModification(id) {
    fetch(urlBase + '/filtrer-type-pret?id_type_pret=' + id)
      .then(res => res.json())
      .then(json => {
        if (!json.succes || !json.data || json.data.length === 0) {
          return alert('Type de prêt introuvable');
        }
        const t = json.data[0];
        document.querySelector('#modifier-type-pret-div').style.display = 'block';
        document.querySelector('#m_id_type_pret').value = t.id_type_pret;
        document.querySelector('#m_nom').value = t.nom;
        document.querySelector('#m_status_type_pret_id').value = t.status_type_pret_id;
        document.querySelector('#m_mois_max').value = t.mois_max;
        document.querySelector('#m_montant_max').value = t.montant_max;
        document.querySelector('#m_taux_annuel').value = t.taux_annuel;
        document.querySelector('#m_echeance_initiale').value = t.echeance_initiale;
      })
      .catch(err => alert('Erreur chargement type de prêt : ' + err));
  }

  // Événement modification (submit)
  document.querySelector('#modifier-type-pret').addEventListener('submit', e => {
    e.preventDefault();
    const data = {
      id_type_pret: document.querySelector('#m_id_type_pret').value,
      nom: document.querySelector('#m_nom').value.trim(),
      status_type_pret_id: parseInt(document.querySelector('#m_status_type_pret_id').value),
      mois_max: parseInt(document.querySelector('#m_mois_max').value),
      montant_max: parseFloat(document.querySelector('#m_montant_max').value),
      taux_annuel: parseFloat(document.querySelector('#m_taux_annuel').value),
      echeance_initiale: parseInt(document.querySelector('#m_echeance_initiale').value)
    };
    if (!data.nom || isNaN(data.montant_max) || isNaN(data.taux_annuel)) {
      alert('Nom, montant max et taux_annuel valides obligatoires');
      return;
    }

    fetch(urlBase + '/modifier-type-pret', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
      alert(json.message || (json.succes ? 'Type de prêt modifié' : 'Erreur modification'));
      if (json.succes) {
        document.querySelector('#modifier-type-pret-div').style.display = 'none';
        chargerListeTypesPret();
      }
    })
    .catch(err => alert('Erreur modification : ' + err));
  });

  // Fermer la fiche modification
  document.querySelector('#btn-fermer-modification').addEventListener('click', () => {
    document.querySelector('#modifier-type-pret-div').style.display = 'none';
  });



  // Attacher événements Modifier/Supprimer aux boutons
  function attachEventListeners() {
    document.querySelectorAll('.btn-fiche-type-pret').forEach(btn => {
      btn.onclick = () => ouvrirFicheModification(btn.dataset.id);
    });
  }
   // Charger la liste des statuts dans le filtre
  function chargerListeStatusTypePret() {
    fetch(urlBase + '/lister-status-type-pret',{method: 'GET'})
      .then(res => res.json())
      .then(json => {
        const select = document.querySelector('#a_status_type_pret_id');
        const selectModify = document.querySelector('#m_status_type_pret_id');
        const selectFilter = document.querySelector('#f_status_type_pret_id');
        if (!select) return;
        // Vider les options sauf la première
        select.innerHTML = '<option value="">-- Tous --</option>';
        if (json.data && Array.isArray(json.data)) {
          json.data.forEach(status => {
            const opt = document.createElement('option');
            opt.value = status.id_type_pret;
            opt.textContent = status.nom;
            select.appendChild(opt);
          });
        }
        if (!selectModify) return;
        // Vider les options sauf la première
        selectModify.innerHTML = '<option value="">-- Tous --</option>';
        if (json.data && Array.isArray(json.data)) {
          json.data.forEach(status => {
            const opt = document.createElement('option');
            opt.value = status.id_type_pret;
            opt.textContent = status.nom;
            selectModify.appendChild(opt);
          });
        }
        if (!selectFilter) return;
        // Vider les options sauf la première
        selectFilter.innerHTML = '<option value="">-- Tous --</option>';
        if (json.data && Array.isArray(json.data)) {
          json.data.forEach(status => {
            const opt = document.createElement('option');
            opt.value = status.id_type_pret;
            opt.textContent = status.nom;
            selectFilter.appendChild(opt);
          });
        }
      })
      .catch(err => console.error('Erreur chargement statuts :', err));
  }
  
  function afficherHistoriqueTypePret(id) {
  fetch(urlBase + '/historique-type-pret?id_type_pret=' + id, {method: 'GET'})
    .then(res => res.json())
    .then(json => {
      const div = document.querySelector('#historique-type-pret-div');
      const tbody = document.querySelector('#table-historique-type-pret tbody');
      tbody.innerHTML = '';
      if (json.data && json.data.length > 0) {
        json.data.forEach(h => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${h.date_type_pret ? h.date_type_pret.substr(0,10) : ''}</td>
          <td>${h.nom}</td>
          <td>${h.status_nom || h.status_type_pret_id}</td>
          <td>${h.mois_max}</td>
          <td>${parseFloat(h.montant_max).toFixed(2)}</td>
          <td>${parseFloat(h.taux_annuel).toFixed(2)}</td>
          <td>${h.echeance_initiale}</td>
        `;
          tbody.appendChild(tr);
        });
      } else {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="5" style="text-align:center;">Aucun historique</td>`;
        tbody.appendChild(tr);
      }
      div.style.display = 'block';
    })
    .catch(err => alert('Erreur chargement historique : ' + err));
  }

// Fermer la modale historique
document.querySelector('#btn-fermer-historique').addEventListener('click', () => {
  document.querySelector('#historique-type-pret-div').style.display = 'none';
});

// Attacher le bouton historique dans attachEventListeners
function attachEventListeners() {
  document.querySelectorAll('.btn-fiche-type-pret').forEach(btn => {
    btn.onclick = () => ouvrirFicheModification(btn.dataset.id);
  });
  document.querySelectorAll('.btn-historique-type-pret').forEach(btn => {
    btn.onclick = () => afficherHistoriqueTypePret(btn.dataset.id);
  });
}

  // Appel au chargement
  chargerListeStatusTypePret();

  // Chargement initial : afficher tous les types de prêt
  chargerListeTypesPret();

  
});