document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('#lister-fond tbody');

  // Tri dynamique des lignes du tableau
  let sortState = {
    date_fond: null,
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

    document.querySelector('#th-date-fond').textContent = 'Date fond';
    document.querySelector('#th-montant').textContent = 'Montant';
    if (colonne === 'date_fond') {
      document.querySelector('#th-date-fond').textContent += sens === 'asc' ? ' ↑' : ' ↓';
    } else {
      document.querySelector('#th-montant').textContent += sens === 'asc' ? ' ↑' : ' ↓';
    }
  }

  document.querySelector('#th-date-fond').addEventListener('click', () => {
    trierTableauPar('date_fond');
  });
  document.querySelector('#th-montant').addEventListener('click', () => {
    trierTableauPar('montant');
  });

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

  function chargerDonneesPage(params = {}) {
    const query = new URLSearchParams(params).toString();
    ajax('GET', '/filtrer-fond' + (query ? '?' + query : ''), null, json => {
      if (json.succes) {
        afficherFonds(json.fonds || []);
        document.querySelector('#fond-actuel').textContent =
          'Fond actuel : ' + parseFloat(json.fondActuel).toFixed(2) + ' €';
      } else {
        alert(json.message || 'Erreur chargement fonds');
      }
    });
  }

  document.querySelector('#btn-filtrer-fond').addEventListener('click', () => {
    const params = {
      montant_min: document.querySelector('#f_montant_min').value,
      montant_max: document.querySelector('#f_montant_max').value,
      date_fond_min: document.querySelector('#f_date_ajout_min').value,
      date_fond_max: document.querySelector('#f_date_ajout_max').value,
    };
    Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
    chargerDonneesPage(params);
  });

  document.querySelector('#btn-ajouter-fond').addEventListener('click', () => {
    const montant = parseFloat(document.querySelector('#a_montant').value);
    if (isNaN(montant)) {
      alert('Montant invalide');
      return;
    }

    const now = new Date();
    const dateFond = now.toISOString().slice(0, 10);
    const data = { 'montant': montant, 'date_fond': dateFond };
    ajax('POST', '/ajouter-fond', JSON.stringify(data), json => {
      alert(json.message || (json.succes ? 'Fond ajouté' : 'Erreur ajout'));
      if (json.succes) {
        document.querySelector('#ajouter-fond').reset();
        chargerDonneesPage();
      }
    });
  });

  chargerDonneesPage();
});
