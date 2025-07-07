document.addEventListener('DOMContentLoaded', function() {
    // Charger les données initiales dans le bon ordre
    // D'abord charger les types de prêt et comptes pour créer les mappings
    Promise.all([
        chargerTypesPret(),
        chargerComptes()
    ]).then(() => {
        // Ensuite charger les prêts une fois que les mappings sont prêts
        chargerPrets();
    });
    
    // Charger les données pour les formulaires
    chargerTypesPretFormulaire();
    chargerComptesFormulaire();
    chargerPeriodesFormulaire();

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
        
        // Enlever la classe active de tous les boutons de tri
        document.querySelectorAll('.btn-tri').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Réinitialiser la direction de tri
        document.getElementById('tri_direction').value = 'ASC';
        
        // Recharger tous les prêts et réinitialiser la pagination
        chargerPrets();
    });

    // Gestion du tri
    document.querySelectorAll('.btn-tri').forEach(button => {
        button.addEventListener('click', function() {
            // Enlever la classe active de tous les boutons
            document.querySelectorAll('.btn-tri').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            const colonne = this.dataset.col;
            const direction = document.getElementById('tri_direction').value;
            trierPrets(colonne, direction);
        });
    });

    // Gestion de la pagination
    document.getElementById('pagination-first').addEventListener('click', () => allerALaPage(1));
    document.getElementById('pagination-prev').addEventListener('click', () => allerALaPage(currentPage - 1));
    document.getElementById('pagination-next').addEventListener('click', () => allerALaPage(currentPage + 1));
    document.getElementById('pagination-last').addEventListener('click', () => allerALaPage(Math.ceil(totalItems / itemsPerPage)));
    
    document.getElementById('pagination-size-select').addEventListener('change', function() {
        itemsPerPage = parseInt(this.value);
        currentPage = 1;
        afficherPageCourante();
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
    return fetch(apiUrl('/gestionPret/listerTypesPret'))
        .then(response => response.json())
        .then(data => {
            if (data.succes) {
                const selectFiltre = document.getElementById('filtre_type_pret_id');
                selectFiltre.innerHTML = '<option value="">Tous</option>';
                
                // Remplir le mapping des types de prêt
                typesPretMap.clear();
                
                data.data.forEach(type => {
                    // Stocker dans le mapping
                    typesPretMap.set(type.id_type_pret.toString(), type.nom);
                    
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
    return fetch(apiUrl('/gestionPret/listerComptes'))
        .then(response => response.json())
        .then(data => {
            if (data.succes) {
                // Pour le filtre seulement
                const selectFiltre = document.getElementById('filtre_compte_id');
                selectFiltre.innerHTML = '<option value="">Tous</option>';
                
                // Remplir le mapping des comptes
                comptesMap.clear();
                
                data.data.forEach(compte => {
                    // Stocker dans le mapping
                    const compteLabel = `Compte ${compte.id_compte} - ${compte.client_nom || 'N/A'}`;
                    comptesMap.set(compte.id_compte.toString(), compteLabel);
                    
                    // Option pour le filtre
                    const optionFiltre = document.createElement('option');
                    optionFiltre.value = compte.id_compte;
                    optionFiltre.textContent = compteLabel;
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
    console.log('Chargement des prêts...');
    fetch(apiUrl('/gestionPret/api/lister'))
        .then(response => {
            console.log('Réponse reçue:', response.status, response.statusText);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Données reçues:', data);
            if (data.succes) {
                allPrets = data.data; // Stocker tous les prêts
                totalItems = allPrets.length;
                currentPage = 1;
                afficherPageCourante();
                console.log(`${data.data.length} prêts chargés`);
            } else {
                console.error('Erreur API:', data.message || 'Réponse non successful');
                const tbody = document.querySelector('#lister-pret tbody');
                tbody.innerHTML = '<tr><td colspan="6">Erreur lors du chargement des prêts</td></tr>';
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement des prêts:', error);
            const tbody = document.querySelector('#lister-pret tbody');
            tbody.innerHTML = '<tr><td colspan="6">Erreur de connexion</td></tr>';
        });
}

// Afficher les prêts dans le tableau
function afficherPrets(prets) {
    const tbody = document.querySelector('#lister-pret tbody');
    tbody.innerHTML = '';
    
    prets.forEach(pret => {
        // Récupérer les noms à partir des mappings
        const typePretNom = typesPretMap.get(pret.type_pret_id.toString()) || `Type ${pret.type_pret_id}`;
        const compteNom = comptesMap.get(pret.compte_id.toString()) || `Compte ${pret.compte_id}`;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pret.id_pret}</td>
            <td>${pret.date_pret}</td>
            <td>${typePretNom}</td>
            <td>${compteNom}</td>
            <td>${parseFloat(pret.montant).toFixed(2)}€</td>
            <td>${pret.duree} mois</td>
        `;
        tbody.appendChild(row);
    });
}

// Ajouter un prêt
function ajouterPret() {
    const formData = new FormData(document.getElementById('ajouter-pret'));
    fetch(apiUrl('/gestionPret/ajouter'), {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
    })
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
        alert('Erreur lors de l\'ajout du prêt: ' + error.message);
    });
}

// Filtrer les prêts
function filtrerPrets() {
    // Récupérer les valeurs du formulaire de filtre
    const typePretId = document.getElementById('filtre_type_pret_id').value;
    const compteId = document.getElementById('filtre_compte_id').value;
    const montantMin = parseFloat(document.getElementById('filtre_montant_min').value) || 0;
    const montantMax = parseFloat(document.getElementById('filtre_montant_max').value) || Infinity;
    
    // Filtrer tous les prêts
    const pretsFiltres = allPrets.filter(pret => {
        let afficher = true;
        
        // Filtre par type de prêt
        if (typePretId && pret.type_pret_id != typePretId) {
            afficher = false;
        }
        
        // Filtre par compte
        if (compteId && pret.compte_id != compteId) {
            afficher = false;
        }
        
        // Filtre par montant
        const montant = parseFloat(pret.montant) || 0;
        if (montant < montantMin || montant > montantMax) {
            afficher = false;
        }
        
        return afficher;
    });
    
    // Mettre à jour les données filtrées et réinitialiser la pagination
    allPrets = pretsFiltres;
    totalItems = allPrets.length;
    currentPage = 1;
    afficherPageCourante();
}

// Trier les prêts
function trierPrets(colonne, direction) {
    // Trier directement les données
    allPrets.sort((a, b) => {
        let valA, valB;
        
        switch(colonne) {
            case 'date_pret':
                valA = new Date(a.date_pret);
                valB = new Date(b.date_pret);
                break;
            case 'montant':
                valA = parseFloat(a.montant);
                valB = parseFloat(b.montant);
                break;
            case 'duree':
                valA = parseInt(a.duree);
                valB = parseInt(b.duree);
                break;
            default:
                valA = a.id_pret;
                valB = b.id_pret;
        }
        
        if (direction === 'DESC') {
            return valA > valB ? -1 : valA < valB ? 1 : 0;
        } else {
            return valA < valB ? -1 : valA > valB ? 1 : 0;
        }
    });
    
    // Réafficher la page courante avec les données triées
    afficherPageCourante();
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
                                <span>${parseFloat(type.montant_max).toLocaleString('fr-FR', {minimumFractionDigits: 2})} € max</span>
                                <span>${type.mois_max} mois max</span>
                                <span>Taux ${type.taux_annuel}%</span>
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
                                <span>${escapeHtml(compte.client_nom || 'N/A')}</span>
                                <span>${escapeHtml(compte.status_nom || 'N/A')}</span>
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

// Variables globales pour la pagination
let currentPage = 1;
let itemsPerPage = 10;
let totalItems = 0;
let allPrets = []; // Pour stocker tous les prêts

// Variables globales pour les mappings
let typesPretMap = new Map(); // Map pour stocker id -> nom des types de prêt
let comptesMap = new Map(); // Map pour stocker id -> nom des comptes

// ============== PAGINATION ==============

// Afficher la page courante
function afficherPageCourante() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pretsPage = allPrets.slice(startIndex, endIndex);
    
    afficherPrets(pretsPage);
    mettreAJourPagination();
}

// Aller à une page spécifique
function allerALaPage(page) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        afficherPageCourante();
    }
}

// Mettre à jour l'interface de pagination
function mettreAJourPagination() {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Mettre à jour les boutons de navigation
    document.getElementById('pagination-first').disabled = currentPage === 1;
    document.getElementById('pagination-prev').disabled = currentPage === 1;
    document.getElementById('pagination-next').disabled = currentPage === totalPages;
    document.getElementById('pagination-last').disabled = currentPage === totalPages;
    
    // Mettre à jour l'information de pagination
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    document.getElementById('pagination-info-text').textContent = 
        `Affichage de ${startItem} à ${endItem} sur ${totalItems} prêts`;
    
    // Générer les numéros de page
    genererNumerosDePage(totalPages);
}

// Générer les numéros de page
function genererNumerosDePage(totalPages) {
    const paginationNumbers = document.getElementById('pagination-numbers');
    paginationNumbers.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Calculer la plage de pages à afficher
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    // Ajuster la plage si nécessaire
    if (endPage - startPage < 4) {
        if (startPage === 1) {
            endPage = Math.min(totalPages, startPage + 4);
        } else if (endPage === totalPages) {
            startPage = Math.max(1, endPage - 4);
        }
    }
    
    // Ajouter les numéros de page
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.type = 'button';
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => allerALaPage(i));
        paginationNumbers.appendChild(pageBtn);
    }
    
    // Ajouter des points de suspension si nécessaire
    if (startPage > 1) {
        const firstBtn = document.createElement('button');
        firstBtn.type = 'button';
        firstBtn.className = 'pagination-btn';
        firstBtn.textContent = '1';
        firstBtn.addEventListener('click', () => allerALaPage(1));
        paginationNumbers.insertBefore(firstBtn, paginationNumbers.firstChild);
        
        if (startPage > 2) {
            const dotsSpan = document.createElement('span');
            dotsSpan.textContent = '...';
            dotsSpan.style.padding = '0 var(--space-sm)';
            dotsSpan.style.color = 'var(--neutral-500)';
            paginationNumbers.insertBefore(dotsSpan, paginationNumbers.children[1]);
        }
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dotsSpan = document.createElement('span');
            dotsSpan.textContent = '...';
            dotsSpan.style.padding = '0 var(--space-sm)';
            dotsSpan.style.color = 'var(--neutral-500)';
            paginationNumbers.appendChild(dotsSpan);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.type = 'button';
        lastBtn.className = 'pagination-btn';
        lastBtn.textContent = totalPages;
        lastBtn.addEventListener('click', () => allerALaPage(totalPages));
        paginationNumbers.appendChild(lastBtn);
    }
}
