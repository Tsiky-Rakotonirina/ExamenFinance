document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('#lister-fond tbody');

    // Tri dynamique des lignes du tableau
  let sortState = {
    date_fond: null,   // null | 'asc' | 'desc'
    montant: null
  };

  function trierTableauPar(colonne) {
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const keyIndex = {
      'date_fond': 1,
      'montant': 2
    };
    const index = keyIndex[colonne];

    const sens = sortState[colonne] === 'asc' ? 'desc' : 'asc';
    sortState[colonne] = sens;

    // Réinitialiser l'autre colonne
    for (let c in sortState) {
      if (c !== colonne) sortState[c] = null;
    }

    rows.sort((a, b) => {
      let valA = a.children[index].textContent;
      let valB = b.children[index].textContent;

      if (colonne === 'montant') {
        valA = parseFloat(valA);
        valB = parseFloat(valB);
      } else {
        valA = new Date(valA);
        valB = new Date(valB);
      }

      return sens === 'asc' ? valA - valB : valB - valA;
    });

    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));

    // Mettre à jour les icônes
    document.querySelector('#th-date-fond').textContent = 'Date fond';
    document.querySelector('#th-montant').textContent = 'Montant';
    if (colonne === 'date_fond') {
      document.querySelector('#th-date-fond').textContent += sens === 'asc' ? ' ↑' : ' ↓';
    } else {
      document.querySelector('#th-montant').textContent += sens === 'asc' ? ' ↑' : ' ↓';
    }
  }

  // Ajouter les événements de tri
  document.querySelector('#th-date-fond').addEventListener('click', () => {
    trierTableauPar('date_fond');
  });
  document.querySelector('#th-montant').addEventListener('click', () => {
    trierTableauPar('montant');
  });


  // Afficher la liste des fonds dans le tableau
  function afficherFonds(fonds) {
    tbody.innerHTML = '';
    fonds.forEach(f => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${f.id_fond}</td>
        <td>${f.date_fond ? f.date_fond.substr(0, 10) : ''}</td>
        <td>${parseFloat(f.montant).toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Charger la liste des fonds avec filtres
  function chargerDonneesPage(params = {}) {
  const query = new URLSearchParams(params).toString();
  fetch(urlBase + '/filtrer-fond' + (query ? '?' + query : ''))
    .then(res => res.json())
    .then(json => {
      if (json.succes) {
        afficherFonds(json.fonds || []);
        document.querySelector('#fond-actuel').textContent =
          'Fond actuel : ' + parseFloat(json.fondActuel).toFixed(2) + ' Ar';
      } else {
        alert(json.message || 'Erreur chargement fonds');
      }
    })
    .catch(err => alert('Erreur chargement fonds : ' + err));
}


  // Bouton Filtrer
  document.querySelector('#btn-filtrer-fond').addEventListener('click', () => {
    const params = {
      montant_min: document.querySelector('#f_montant_min').value,
      montant_max: document.querySelector('#f_montant_max').value,
      date_fond_min: document.querySelector('#f_date_ajout_min').value,
      date_fond_max: document.querySelector('#f_date_ajout_max').value,
    };
    // Nettoyer les champs vides
    Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
    chargerDonneesPage(params);
  });

  // Bouton Ajouter
  document.querySelector('#btn-ajouter-fond').addEventListener('click', () => {
    const montant = parseFloat(document.querySelector('#a_montant').value);
    if (isNaN(montant)) {
      alert('Montant invalide');
      return;
    }

    fetch(urlBase + '/ajouter-fond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ montant })
    })
    .then(res => res.json())
    .then(json => {
      alert(json.message || (json.succes ? 'Fond ajouté' : 'Erreur ajout'));
      if (json.succes) {
        document.querySelector('#ajouter-fond').reset();
        chargerDonneesPage();
      }
    })
    .catch(err => alert('Erreur ajout fond : ' + err));
  });

  // Chargement initial des fonds
  chargerDonneesPage();
});
