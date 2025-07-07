document.addEventListener('DOMContentLoaded', function() {
    // Charger les données initiales
    chargerTypesPret();
    chargerTypesPretFormulaire();
    chargerComptes();
    chargerComptesFormulaire();
    chargerPeriodesFormulaire();
    chargerPrets();

    // Gestion du formulaire d'ajout de prêt
    document.getElementById('ajouter-pret').addEventListener('submit', function(e) {
        e.preventDefault();
        ajouterPret();
    });

    // Gestion du filtre
    document.getElementById('filtre-prets').addEventListener('submit', function(e) {
        e.preventDefault();
        filtrerPrets();
    });

    // Reset du filtre
    document.getElementById('reset-filtre').addEventListener('click', function() {
        document.getElementById('filtre-prets').reset();
        chargerPrets();
    });

    // Gestion du tri
    document.querySelectorAll('.btn-tri').forEach(button => {
        button.addEventListener('click', function() {
            const colonne = this.dataset.col;
            const direction = document.getElementById('tri_direction').value;
            trierPrets(colonne, direction);
        });
    });
});

// Helper pour préfixer les URLs API
function apiUrl(path) {
    let base = window.BASE_URL || '';
    if (base.endsWith('/')) base = base.slice(0, -1);
    if (!path.startsWith('/')) path = '/' + path;
    return base + path;
}

// Charger les types de prêt pour les filtres
function chargerTypesPret() {
    fetch(apiUrl('/gestionPret/listerTypesPret'))
        .then(response => response.json())
        .then(data => {
            if (data.succes) {
                const selectFiltre = document.getElementById('filtre_type_pret_id');
                selectFiltre.innerHTML = '<option value="">Tous</option>';
                
                data.data.forEach(type => {
                    const option = document.createElement('option');
                    option.value = type.id_type_pret;
                    option.textContent = type.nom;
                    selectFiltre.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Erreur lors du chargement des types de prêt:', error));
}

// Charger les comptes
function chargerComptes() {
    fetch(apiUrl('/gestionPret/listerComptes'))
        .then(response => response.json())
        .then(data => {
            if (data.succes) {
                // Pour le filtre seulement
                const selectFiltre = document.getElementById('filtre_compte_id');
                selectFiltre.innerHTML = '<option value="">Tous</option>';
                
                data.data.forEach(compte => {
                    // Option pour le filtre
                    const optionFiltre = document.createElement('option');
                    optionFiltre.value = compte.id_compte;
                    optionFiltre.textContent = `Compte ${compte.id_compte} - ${compte.client_nom || 'N/A'}`;
                    selectFiltre.appendChild(optionFiltre);
                });
            }
        })
        .catch(error => console.error('Erreur lors du chargement des comptes:', error));
}

// Charger les périodes
function chargerPeriodes() {
    fetch(apiUrl('/gestionPret/listerPeriodes'))
        .then(response => response.json())
        .then(data => {
            if (data.succes) {
                const select = document.getElementById('periode_id');
                select.innerHTML = '<option value="">Sélectionner...</option>';
                
                data.data.forEach(periode => {
                    const option = document.createElement('option');
                    option.value = periode.id_periode;
                    option.textContent = `${periode.nom} (${periode.nombre_mois} mois)`;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Erreur lors du chargement des périodes:', error));
}

// Charger la liste des prêts
function chargerPrets() {
    fetch(apiUrl('/gestionPret/api/lister'))
        .then(response => response.json())
        .then(data => {
            if (data.succes) {
                afficherPrets(data.data);
            }
        })
        .catch(error => console.error('Erreur lors du chargement des prêts:', error));
}

// Afficher les prêts dans le tableau
function afficherPrets(prets) {
    const tbody = document.querySelector('#lister-pret tbody');
    tbody.innerHTML = '';
    
    prets.forEach(pret => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pret.id_pret}</td>
            <td>${pret.date_pret}</td>
            <td>${pret.type_pret_id}</td>
            <td>${pret.compte_id}</td>
            <td>${parseFloat(pret.montant).toFixed(2)}€</td>
            <td>${pret.duree} mois</td>
        `;
        tbody.appendChild(row);
    });
}

// Ajouter un prêt
function ajouterPret() {
    const formData = new FormData(document.getElementById('ajouter-pret'));
    
    fetch('/gestionPret/ajouter', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.succes) {
            alert('Prêt ajouté avec succès!');
            document.getElementById('ajouter-pret').reset();
            chargerPrets(); // Recharger la liste
        } else {
            alert('Erreur: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Erreur lors de l\'ajout du prêt:', error);
        alert('Erreur lors de l\'ajout du prêt');
    });
}

// Filtrer les prêts
function filtrerPrets() {
    // Implementation du filtrage côté client ou serveur
    // Pour l'instant, on recharge simplement la liste
    chargerPrets();
}

// Trier les prêts
function trierPrets(colonne, direction) {
    // Implementation du tri côté client
    const tbody = document.querySelector('#lister-pret tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        let valA, valB;
        
        switch(colonne) {
            case 'date_pret':
                valA = new Date(a.cells[1].textContent);
                valB = new Date(b.cells[1].textContent);
                break;
            case 'montant':
                valA = parseFloat(a.cells[4].textContent.replace('€', ''));
                valB = parseFloat(b.cells[4].textContent.replace('€', ''));
                break;
            case 'duree':
                valA = parseInt(a.cells[5].textContent);
                valB = parseInt(b.cells[5].textContent);
                break;
            default:
                valA = a.cells[0].textContent;
                valB = b.cells[0].textContent;
        }
        
        if (direction === 'DESC') {
            return valA > valB ? -1 : valA < valB ? 1 : 0;
        } else {
            return valA < valB ? -1 : valA > valB ? 1 : 0;
        }
    });
    
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}

// Charger les types de prêt pour le formulaire d'ajout
function chargerTypesPretFormulaire() {
    const container = document.getElementById('types-pret-container');
    if (!container) return;
    container.innerHTML = '<p>Chargement...</p>';
    fetch(apiUrl('/gestionPret/listerTypesPret'))
        .then(response => {
            if (!response.ok) throw new Error('Erreur réseau: ' + response.status);
            return response.json();
        })
        .then(data => {
            if (data.succes && data.data && data.data.length > 0) {
                container.innerHTML = '';
                data.data.forEach(type => {
                    const typeOption = document.createElement('div');
                    typeOption.className = 'type-pret-option';
                    typeOption.innerHTML = `
                        <input type="radio" id="type_pret_${type.id_type_pret}" 
                               name="type_pret_id" value="${type.id_type_pret}" required>
                        <label for="type_pret_${type.id_type_pret}" class="type-pret-label">
                            <div class="type-pret-header">
                                <strong>${escapeHtml(type.nom)}</strong>
                            </div>
                            <div class="type-pret-details">
                                <span>Montant max: ${parseFloat(type.montant_max).toLocaleString('fr-FR', {minimumFractionDigits: 2})} €</span>
                                <span>Durée max: ${type.mois_max} mois</span>
                                <span>Taux: ${type.taux_annuel}%</span>
                            </div>
                        </label>
                    `;
                    container.appendChild(typeOption);
                });
            } else {
                container.innerHTML = '<p style="color:red">Aucun type de prêt disponible ou erreur API</p>';
            }
        })
        .catch(error => {
            container.innerHTML = `<p style="color:red">Erreur lors du chargement des types de prêt : ${error.message}</p>`;
        });
}

// Charger les comptes pour le formulaire d'ajout
function chargerComptesFormulaire() {
    const container = document.getElementById('comptes-container');
    if (!container) return;
    container.innerHTML = '<p>Chargement...</p>';
    fetch(apiUrl('/gestionPret/listerComptes'))
        .then(response => {
            if (!response.ok) throw new Error('Erreur réseau: ' + response.status);
            return response.json();
        })
        .then(data => {
            if (data.succes && data.data && data.data.length > 0) {
                container.innerHTML = '';
                data.data.forEach(compte => {
                    const compteOption = document.createElement('div');
                    compteOption.className = 'compte-option';
                    compteOption.innerHTML = `
                        <input type="radio" id="compte_${compte.id_compte}" 
                               name="compte_id" value="${compte.id_compte}" required>
                        <label for="compte_${compte.id_compte}" class="compte-label">
                            <div class="compte-header">
                                <strong>Compte #${compte.id_compte}</strong>
                            </div>
                            <div class="compte-details">
                                <span>Client: ${escapeHtml(compte.client_nom || 'N/A')}</span>
                                <span>Status: ${escapeHtml(compte.status_nom || 'N/A')}</span>
                            </div>
                        </label>
                    `;
                    container.appendChild(compteOption);
                });
            } else {
                container.innerHTML = '<p style="color:red">Aucun compte disponible ou erreur API</p>';
            }
        })
        .catch(error => {
            container.innerHTML = `<p style="color:red">Erreur lors du chargement des comptes : ${error.message}</p>`;
        });
}

// Charger les périodes pour le formulaire d'ajout
function chargerPeriodesFormulaire() {
    const select = document.getElementById('periode_id');
    if (!select) return;
    select.innerHTML = '<option value="">Sélectionner...</option>';
    fetch(apiUrl('/gestionPret/listerPeriodes'))
        .then(response => response.json())
        .then(data => {
            if (data.succes && data.data && data.data.length > 0) {
                data.data.forEach(periode => {
                    const option = document.createElement('option');
                    option.value = periode.id_periode;
                    option.textContent = `${periode.nom} (${periode.nombre_mois} mois)`;
                    select.appendChild(option);
                });
            } else {
                select.innerHTML = '<option value="">Aucune période disponible</option>';
            }
        })
        .catch(error => {
            select.innerHTML = `<option value="">Erreur lors du chargement des périodes</option>`;
        });
}

// Fonction utilitaire pour échapper le HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}
