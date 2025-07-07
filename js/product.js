document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('#lister-produit tbody');

  // Fonction pour afficher la liste dans le tableau
  function afficherProduits(produits) {
    tbody.innerHTML = '';
    produits.forEach(p => {
      const tr = document.createElement('tr');
      tr.id = `produit-${p.id_produit}`;
      tr.dataset.id = p.id_produit;
      tr.innerHTML = `
        <td>${p.id_produit}</td>
        <td>${p.nom}</td>
        <td>${p.description}</td>
        <td>${parseFloat(p.prix).toFixed(2)}</td>
        <td>${p.quantite_en_stock}</td>
        <td>${p.date_ajout ? p.date_ajout.substr(0, 10) : ''}</td>
        <td>${p.est_actif == 1 ? 'Actif' : 'Inactif'}</td>
        <td>
          <button class="btn-fiche-produit" data-id="${p.id_produit}">Modifier</button>
          <button class="btn-supprimer-produit" data-id="${p.id_produit}">Supprimer</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Fonction pour charger la liste selon filtres (paramètres)
  function chargerListeProduits(params = {}) {
    const query = new URLSearchParams(params).toString();
    fetch(urlBase + '/filtrer-produit' + (query ? '?' + query : ''))
      .then(res => res.json())
      .then(json => {
        if (json.succes) {
          afficherProduits(json.data || []);
          attachEventListeners();
        } else {
          alert(json.message || 'Erreur chargement produits');
        }
      })
      .catch(err => alert('Erreur chargement produits : ' + err));

  }

  // Événement bouton Filtrer
  document.querySelector('#btn-filtrer-produit').addEventListener('click', () => {
    const params = {
      description: document.querySelector('#f_description').value,
      prix_min: document.querySelector('#f_prix_min').value,
      prix_max: document.querySelector('#f_prix_max').value,
      quantite_en_stock_min: document.querySelector('#f_quantite_en_stock_min').value,
      quantite_en_stock_max: document.querySelector('#f_quantite_en_stock_max').value,
      date_ajout_min: document.querySelector('#f_date_ajout_min').value,
      date_ajout_max: document.querySelector('#f_date_ajout_max').value,
      est_actif: document.querySelector('#f_est_actif').value,
    };
    // Supprimer clés vides
    Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
    chargerListeProduits(params);
  });

  // Événement bouton Ajouter
  document.querySelector('#btn-ajouter-produit').addEventListener('click', () => {
    const data = {
      nom: document.querySelector('#a_nom').value.trim(),
      description: document.querySelector('#a_description').value.trim(),
      prix: parseFloat(document.querySelector('#a_prix').value),
      quantite_en_stock: parseInt(document.querySelector('#a_quantite_en_stock').value),
      date_ajout: document.querySelector('#a_date_ajout').value,
      est_actif: parseInt(document.querySelector('#a_est_actif').value),
    };
    if (!data.nom || isNaN(data.prix)) {
      alert('Nom et prix valides obligatoires');
      return;
    }

    fetch(urlBase + '/ajouter-produit', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
      alert(json.message || (json.succes ? 'Produit ajouté' : 'Erreur ajout'));
      if (json.succes) {
        document.querySelector('#ajouter-produit').reset();
        chargerListeProduits(); 
      }
    })
    .catch(err => alert('Erreur ajout : ' + err));
  });

  // Ouvrir formulaire modification et pré-remplir
  function ouvrirFicheModification(id) {
    fetch(urlBase + '/filtrer-produit?id_produit=' + id)
      .then(res => res.json())
      .then(json => {
        if (!json.succes || !json.data || json.data.length === 0) {
          return alert('Produit introuvable');
        }
        const p = json.data[0];
        document.querySelector('#modifier-produit-div').style.display = 'block';
        document.querySelector('#m_id_produit').value = p.id_produit;
        document.querySelector('#m_nom').value = p.nom;
        document.querySelector('#m_description').value = p.description;
        document.querySelector('#m_prix').value = p.prix;
        document.querySelector('#m_quantite_en_stock').value = p.quantite_en_stock;
        document.querySelector('#m_date_ajout').value = p.date_ajout ? p.date_ajout.substr(0, 10) : '';
        document.querySelector('#m_est_actif').value = p.est_actif;
      })
      .catch(err => alert('Erreur chargement produit : ' + err));
  }

  // Événement modification (submit)
  document.querySelector('#modifier-produit').addEventListener('submit', e => {
    e.preventDefault();
    const data = {
      id_produit: document.querySelector('#m_id_produit').value,
      nom: document.querySelector('#m_nom').value.trim(),
      description: document.querySelector('#m_description').value.trim(),
      prix: parseFloat(document.querySelector('#m_prix').value),
      quantite_en_stock: parseInt(document.querySelector('#m_quantite_en_stock').value),
      date_ajout: document.querySelector('#m_date_ajout').value,
      est_actif: parseInt(document.querySelector('#m_est_actif').value),
    };
    if (!data.nom || isNaN(data.prix)) {
      alert('Nom et prix valides obligatoires');
      return;
    }

    fetch(urlBase + '/modifier-produit', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
      alert(json.message || (json.succes ? 'Produit modifié' : 'Erreur modification'));
      if (json.succes) {
        document.querySelector('#modifier-produit-div').style.display = 'none';
        chargerListeProduits();
      }
    })
    .catch(err => alert('Erreur modification : ' + err));
  });

  // Fermer la fiche modification
  document.querySelector('#btn-fermer-modification').addEventListener('click', () => {
    document.querySelector('#modifier-produit-div').style.display = 'none';
  });

  // Supprimer un produit
  function supprimerProduit(id) {
    if (!confirm('Confirmer la suppression ?')) return;

    fetch(urlBase + `/supprimer-produit?id_produit=${id}`, {
      method: 'GET',
    })
    .then(res => res.json())
    .then(json => {
      alert(json.message || (json.succes ? 'Produit supprimé' : 'Erreur suppression'));
      if (json.succes) {
        chargerListeProduits();
      }
    })
    .catch(err => alert('Erreur suppression : ' + err));
  }

  // Attacher événements Modifier/Supprimer aux boutons
  function attachEventListeners() {
    document.querySelectorAll('.btn-fiche-produit').forEach(btn => {
      btn.onclick = () => ouvrirFicheModification(btn.dataset.id);
    });
    document.querySelectorAll('.btn-supprimer-produit').forEach(btn => {
      btn.onclick = () => supprimerProduit(btn.dataset.id);
    });
  }

  // Chargement initial : afficher tous les produits
  chargerListeProduits();
});
