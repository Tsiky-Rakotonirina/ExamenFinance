// Variables globales pour la gestion des prêts
let currentPage = 1;
let itemsPerPage = 10;
let totalItems = 0;
let allPrets = []; // Pour stocker tous les prêts
let originalPrets = []; // Pour garder les données originales

// Variables globales pour les mappings
let typesPretMap = new Map(); // Map pour stocker id -> nom des types de prêt
let comptesMap = new Map(); // Map pour stocker id -> nom des comptes

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé - Initialisation des gestionnaires d\'événements');
    
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
    const formAjoutPret = document.getElementById('ajouter-pret');
    if (formAjoutPret) {
        formAjoutPret.addEventListener('submit', function(e) {
            e.preventDefault();
            ajouterPret();
        });
    } else {
        console.warn('Formulaire ajouter-pret non trouvé');
    }

    // Gestion du filtre
    const formFiltre = document.getElementById('filtre-prets');
    if (formFiltre) {
        formFiltre.addEventListener('submit', function(e) {
            e.preventDefault();
            filtrerPrets();
        });
    } else {
        console.warn('Formulaire filtre-prets non trouvé');
    }

    // Reset du filtre
    const btnReset = document.getElementById('reset-filtre');
    if (btnReset) {
        btnReset.addEventListener('click', function() {
            document.getElementById('filtre-prets').reset();
            
            // Enlever la classe active de tous les boutons de tri
            document.querySelectorAll('.btn-tri').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Réinitialiser la direction de tri
            const triDirection = document.getElementById('tri_direction');
            if (triDirection) {
                triDirection.value = 'ASC';
            }
            
            // Restaurer les données originales et réinitialiser la pagination
            allPrets = [...originalPrets];
            totalItems = allPrets.length;
            currentPage = 1;
            afficherPageCourante();
            
            console.log('Filtres réinitialisés - affichage de tous les prêts');
        });
    } else {
        console.warn('Bouton reset-filtre non trouvé');
    }

    // Gestion du tri avec vérification améliorée
    const boutonsTri = document.querySelectorAll('.btn-tri');
    console.log(`Nombre de boutons de tri trouvés: ${boutonsTri.length}`);
    
    boutonsTri.forEach((button, index) => {
        console.log(`Bouton ${index}: data-col="${button.dataset.col}"`);
        button.addEventListener('click', function() {
            console.log(`Clic sur bouton de tri: ${this.dataset.col}`);
            
            // Vérifier que l'élément direction existe
            const directionSelect = document.getElementById('tri_direction');
            if (!directionSelect) {
                console.error('Élément tri_direction manquant dans le DOM');
                return;
            }
            
            // Enlever la classe active de tous les boutons
            document.querySelectorAll('.btn-tri').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            console.log(`Bouton activé: ${this.dataset.col}`);
            
            const colonne = this.dataset.col;
            const direction = directionSelect.value;
            console.log(`Appel trierPrets avec colonne=${colonne}, direction=${direction}`);
            trierPrets(colonne, direction);
        });
    });
    
    // Ajouter un gestionnaire sur le select de direction pour réappliquer le tri
    const directionSelect = document.getElementById('tri_direction');
    if (directionSelect) {
        directionSelect.addEventListener('change', function() {
            const activeButton = document.querySelector('.btn-tri.active');
            if (activeButton) {
                const colonne = activeButton.dataset.col;
                const direction = this.value;
                console.log(`Changement de direction: ${direction}, re-tri sur ${colonne}`);
                trierPrets(colonne, direction);
            }
        });
    }

    // Gestion de la pagination avec vérification
    const paginationFirst = document.getElementById('pagination-first');
    const paginationPrev = document.getElementById('pagination-prev');
    const paginationNext = document.getElementById('pagination-next');
    const paginationLast = document.getElementById('pagination-last');
    const paginationSizeSelect = document.getElementById('pagination-size-select');
    
    if (paginationFirst) {
        paginationFirst.addEventListener('click', () => allerALaPage(1));
    }
    if (paginationPrev) {
        paginationPrev.addEventListener('click', () => allerALaPage(currentPage - 1));
    }
    if (paginationNext) {
        paginationNext.addEventListener('click', () => allerALaPage(currentPage + 1));
    }
    if (paginationLast) {
        paginationLast.addEventListener('click', () => allerALaPage(Math.ceil(totalItems / itemsPerPage)));
    }
    if (paginationSizeSelect) {
        paginationSizeSelect.addEventListener('change', function() {
            itemsPerPage = parseInt(this.value);
            currentPage = 1;
            afficherPageCourante();
        });
    }
    
    console.log('Gestionnaires d\'événements initialisés');
});

// Helper pour préfixer les URLs API
function apiUrl(path) {
    // Utiliser une URL de base par défaut basée sur l'URL actuelle
    let base = window.BASE_URL || 'http://localhost/ExamenFinance/ws';
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
                originalPrets = [...data.data]; // Sauvegarder les données originales
                allPrets = [...data.data]; // Copie pour les manipulations
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
    // Récupérer les valeurs du formulaire de filtre avec validation
    const typePretSelect = document.getElementById('filtre_type_pret_id');
    const compteSelect = document.getElementById('filtre_compte_id');
    const montantMinInput = document.getElementById('filtre_montant_min');
    const montantMaxInput = document.getElementById('filtre_montant_max');
    
    if (!typePretSelect || !compteSelect || !montantMinInput || !montantMaxInput) {
        console.error('Éléments de filtre manquants dans le DOM');
        return;
    }
    
    const typePretId = typePretSelect.value;
    const compteId = compteSelect.value;
    const montantMin = parseFloat(montantMinInput.value) || 0;
    const montantMax = parseFloat(montantMaxInput.value) || Infinity;
    
    console.log('Filtres appliqués:', { typePretId, compteId, montantMin, montantMax });
    
    // Filtrer à partir des données originales
    const pretsFiltres = originalPrets.filter(pret => {
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
    allPrets = [...pretsFiltres]; // Copie des données filtrées
    totalItems = allPrets.length;
    currentPage = 1;
    afficherPageCourante();
    
    console.log(`Filtrage appliqué: ${totalItems} prêts trouvés sur ${originalPrets.length} total`);
}

// Trier les prêts
function trierPrets(colonne, direction) {
    console.log(`=== DÉBUT TRI ===`);
    console.log(`Tri appliqué: colonne=${colonne}, direction=${direction}`);
    console.log(`Nombre d'éléments à trier: ${allPrets.length}`);
    
    if (allPrets.length === 0) {
        console.warn('Aucun prêt à trier');
        return;
    }
    
    // Sauvegarder l'état avant tri pour debug
    const avant = allPrets.map(p => ({ id: p.id_pret, valeur: p[colonne] })).slice(0, 3);
    console.log('Premiers éléments avant tri:', avant);
    
    // Trier directement les données
    allPrets.sort((a, b) => {
        let valA, valB;
        
        switch(colonne) {
            case 'date_pret':
                valA = new Date(a.date_pret);
                valB = new Date(b.date_pret);
                console.log(`Comparaison dates: ${a.date_pret} vs ${b.date_pret}`);
                break;
            case 'montant':
                valA = parseFloat(a.montant);
                valB = parseFloat(b.montant);
                console.log(`Comparaison montants: ${valA} vs ${valB}`);
                break;
            case 'duree':
                valA = parseInt(a.duree);
                valB = parseInt(b.duree);
                console.log(`Comparaison durées: ${valA} vs ${valB}`);
                break;
            default:
                valA = a.id_pret;
                valB = b.id_pret;
                console.log(`Comparaison IDs: ${valA} vs ${valB}`);
        }
        
        let resultat;
        if (direction === 'DESC') {
            resultat = valA > valB ? -1 : valA < valB ? 1 : 0;
        } else {
            resultat = valA < valB ? -1 : valA > valB ? 1 : 0;
        }
        
        return resultat;
    });
    
    // Vérifier l'état après tri
    const apres = allPrets.map(p => ({ id: p.id_pret, valeur: p[colonne] })).slice(0, 3);
    console.log('Premiers éléments après tri:', apres);
    
    // Réafficher la page courante avec les données triées
    afficherPageCourante();
    console.log('=== FIN TRI ===');
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

// Fonction de débogage pour vérifier l'état du système
function debuggerStatus() {
    console.log('=== DEBUG STATUS ===');
    console.log('Original prêts:', originalPrets.length);
    console.log('Prêts filtrés:', allPrets.length);
    console.log('Page courante:', currentPage);
    console.log('Items par page:', itemsPerPage);
    console.log('Total items:', totalItems);
    console.log('Types prêt map:', typesPretMap.size);
    console.log('Comptes map:', comptesMap.size);
    console.log('================');
}

// Fonction de test pour le tri (accessible depuis la console)
function testTri(colonne = 'montant', direction = 'DESC') {
    console.log(`=== TEST TRI MANUEL ===`);
    console.log(`Test avec colonne: ${colonne}, direction: ${direction}`);
    console.log(`Données disponibles: ${allPrets.length} prêts`);
    
    if (allPrets.length === 0) {
        console.error('Aucune donnée disponible pour le test');
        return false;
    }
    
    // Afficher quelques exemples avant tri
    console.log('Avant tri - premiers éléments:');
    allPrets.slice(0, 3).forEach((pret, i) => {
        console.log(`  ${i+1}. ID:${pret.id_pret}, ${colonne}: ${pret[colonne]}`);
    });
    
    // Effectuer le tri
    trierPrets(colonne, direction);
    
    // Afficher quelques exemples après tri
    console.log('Après tri - premiers éléments:');
    allPrets.slice(0, 3).forEach((pret, i) => {
        console.log(`  ${i+1}. ID:${pret.id_pret}, ${colonne}: ${pret[colonne]}`);
    });
    
    console.log(`=== FIN TEST TRI ===`);
    return true;
}

// Exposer les fonctions de test globalement
window.testTri = testTri;
window.debugGestionPret = debuggerStatus;
