// ==========================================
// UIManager - Gestion de l'affichage pour les prêts
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé - Initialisation des gestionnaires d\'événements UI');
    
    // Initialiser l'interface utilisateur
    initialiserUI();
});

// ==========================================
// INITIALISATION DE L'INTERFACE
// ==========================================

function initialiserUI() {
    // Charger les données initiales dans le bon ordre
    Promise.all([
        chargerTypesPret(),
        chargerComptes()
    ]).then(() => {
        // Mettre à jour les select de filtres
        mettreAJourSelectsFiltres();
        
        // Ensuite charger les prêts une fois que les mappings sont prêts
        return chargerPrets();
    }).then(() => {
        // Afficher la première page
        afficherPageCourante();
    }).catch(error => {
        console.error('Erreur lors de l\'initialisation:', error);
        afficherErreur('Erreur lors du chargement des données');
    });
    
    // Charger les données pour les formulaires
    chargerDonneesFormulaires();
    
    // Initialiser les gestionnaires d'événements
    initialiserGestionnairesEvenements();
    
    console.log('Interface utilisateur initialisée');
}

// ==========================================
// GESTION DES ÉVÉNEMENTS
// ==========================================

function initialiserGestionnairesEvenements() {
    // Gestion du formulaire d'ajout de prêt
    const formAjoutPret = document.getElementById('ajouter-pret');
    if (formAjoutPret) {
        formAjoutPret.addEventListener('submit', function(e) {
            e.preventDefault();
            gererAjoutPret();
        });
    } else {
        console.warn('Formulaire ajouter-pret non trouvé');
    }

    // Gestion du filtre
    const formFiltre = document.getElementById('filtre-prets');
    if (formFiltre) {
        formFiltre.addEventListener('submit', function(e) {
            e.preventDefault();
            gererFiltrage();
        });
    } else {
        console.warn('Formulaire filtre-prets non trouvé');
    }

    // Reset du filtre
    const btnReset = document.getElementById('reset-filtre');
    if (btnReset) {
        btnReset.addEventListener('click', gererResetFiltre);
    } else {
        console.warn('Bouton reset-filtre non trouvé');
    }

    // Gestion du tri
    initialiserGestionnairesTri();
    
    // Gestion de la pagination
    initialiserGestionnairesPagination();
    
    console.log('Gestionnaires d\'événements initialisés');
}

// Initialiser les gestionnaires de tri
function initialiserGestionnairesTri() {
    const boutonsTri = document.querySelectorAll('.btn-tri');
    console.log(`Nombre de boutons de tri trouvés: ${boutonsTri.length}`);
    
    boutonsTri.forEach((button, index) => {
        console.log(`Bouton ${index}: data-col="${button.dataset.col}"`);
        button.addEventListener('click', function() {
            gererTri(this.dataset.col, this);
        });
    });
    
    // Ajouter un gestionnaire sur le select de direction pour réappliquer le tri
    const directionSelect = document.getElementById('tri_direction');
    if (directionSelect) {
        directionSelect.addEventListener('change', function() {
            const activeButton = document.querySelector('.btn-tri.active');
            if (activeButton) {
                gererTri(activeButton.dataset.col, activeButton);
            }
        });
    }
}

// Initialiser les gestionnaires de pagination
function initialiserGestionnairesPagination() {
    const paginationFirst = document.getElementById('pagination-first');
    const paginationPrev = document.getElementById('pagination-prev');
    const paginationNext = document.getElementById('pagination-next');
    const paginationLast = document.getElementById('pagination-last');
    const paginationSizeSelect = document.getElementById('pagination-size-select');
    
    if (paginationFirst) {
        paginationFirst.addEventListener('click', () => gererChangementPage(1));
    }
    if (paginationPrev) {
        paginationPrev.addEventListener('click', () => {
            const etat = obtenirEtatPagination();
            gererChangementPage(etat.currentPage - 1);
        });
    }
    if (paginationNext) {
        paginationNext.addEventListener('click', () => {
            const etat = obtenirEtatPagination();
            gererChangementPage(etat.currentPage + 1);
        });
    }
    if (paginationLast) {
        paginationLast.addEventListener('click', () => {
            const etat = obtenirEtatPagination();
            gererChangementPage(etat.totalPages);
        });
    }
    if (paginationSizeSelect) {
        paginationSizeSelect.addEventListener('change', function() {
            changerItemsParPage(this.value);
            afficherPageCourante();
        });
    }
}

// ==========================================
// GESTIONNAIRES D'ACTIONS
// ==========================================

// Gérer l'ajout d'un prêt
function gererAjoutPret() {
    const formData = new FormData(document.getElementById('ajouter-pret'));
    
    ajouterPret(formData)
        .then(data => {
            afficherMessage('Prêt ajouté avec succès!', 'success');
            document.getElementById('ajouter-pret').reset();
            
            // Recharger les données et rafraîchir l'affichage
            return chargerPrets();
        })
        .then(() => {
            afficherPageCourante();
        })
        .catch(error => {
            afficherMessage('Erreur lors de l\'ajout du prêt: ' + error.message, 'error');
        });
}

// Gérer le filtrage
function gererFiltrage() {
    // Récupérer les valeurs du formulaire de filtre avec validation
    const typePretSelect = document.getElementById('filtre_type_pret_id');
    const compteSelect = document.getElementById('filtre_compte_id');
    const montantMinInput = document.getElementById('filtre_montant_min');
    const montantMaxInput = document.getElementById('filtre_montant_max');
    
    if (!typePretSelect || !compteSelect || !montantMinInput || !montantMaxInput) {
        console.error('Éléments de filtre manquants dans le DOM');
        return;
    }
    
    const filtres = {
        typePretId: typePretSelect.value,
        compteId: compteSelect.value,
        montantMin: parseFloat(montantMinInput.value) || 0,
        montantMax: parseFloat(montantMaxInput.value) || Infinity
    };
    
    // Appliquer les filtres
    filtrerPrets(filtres);
    
    // Rafraîchir l'affichage
    afficherPageCourante();
}

// Gérer le reset du filtre
function gererResetFiltre() {
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
    
    // Restaurer les données originales
    reinitialiserFiltres();
    
    // Rafraîchir l'affichage
    afficherPageCourante();
}

// Gérer le tri
function gererTri(colonne, boutonClique) {
    console.log(`Clic sur bouton de tri: ${colonne}`);
    
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
    boutonClique.classList.add('active');
    console.log(`Bouton activé: ${colonne}`);
    
    const direction = directionSelect.value;
    console.log(`Appel trierPrets avec colonne=${colonne}, direction=${direction}`);
    
    // Appliquer le tri
    trierPrets(colonne, direction);
    
    // Rafraîchir l'affichage
    afficherPageCourante();
}

// Gérer le changement de page
function gererChangementPage(nouvellePage) {
    if (allerALaPage(nouvellePage)) {
        afficherPageCourante();
    }
}

// ==========================================
// AFFICHAGE DES DONNÉES
// ==========================================

// Afficher la page courante
function afficherPageCourante() {
    const pretsPage = obtenirDonneesPageCourante();
    afficherPrets(pretsPage);
    mettreAJourPagination();
}

// Afficher les prêts dans le tableau
function afficherPrets(prets) {
    const tbody = document.querySelector('#lister-pret tbody');
    
    if (!tbody) {
        console.error('Tableau des prêts non trouvé');
        return;
    }
    
    if (prets.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Aucun prêt trouvé</td></tr>';
        return;
    }
    
    const { typesPretMap, comptesMap } = obtenirMappings();
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

// Afficher une erreur
function afficherErreur(message) {
    const tbody = document.querySelector('#lister-pret tbody');
    if (tbody) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">${message}</td></tr>`;
    }
    console.error(message);
}

// Afficher un message (success, error, info)
function afficherMessage(message, type = 'info') {
    // Créer ou récupérer le conteneur de messages
    let messageContainer = document.getElementById('message-container');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'message-container';
        messageContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 400px;
        `;
        document.body.appendChild(messageContainer);
    }
    
    // Créer le message
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    messageDiv.style.cssText = `
        margin-bottom: 10px;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    `;
    
    messageDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    messageContainer.appendChild(messageDiv);
    
    // Auto-supprimer après 5 secondes
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
    
    // Gérer la fermeture manuelle
    const closeBtn = messageDiv.querySelector('.btn-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => messageDiv.remove());
    }
}

// ==========================================
// MISE À JOUR DE L'INTERFACE
// ==========================================

// Mettre à jour les selects de filtres
function mettreAJourSelectsFiltres() {
    const { typesPretMap, comptesMap } = obtenirMappings();
    
    // Mettre à jour le select des types de prêt
    const selectTypePret = document.getElementById('filtre_type_pret_id');
    if (selectTypePret) {
        selectTypePret.innerHTML = '<option value="">Tous</option>';
        typesPretMap.forEach((nom, id) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = nom;
            selectTypePret.appendChild(option);
        });
    }
    
    // Mettre à jour le select des comptes
    const selectCompte = document.getElementById('filtre_compte_id');
    if (selectCompte) {
        selectCompte.innerHTML = '<option value="">Tous</option>';
        comptesMap.forEach((nom, id) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = nom;
            selectCompte.appendChild(option);
        });
    }
}

// Mettre à jour l'interface de pagination
function mettreAJourPagination() {
    const etat = obtenirEtatPagination();
    
    // Mettre à jour les boutons de navigation
    const btnFirst = document.getElementById('pagination-first');
    const btnPrev = document.getElementById('pagination-prev');
    const btnNext = document.getElementById('pagination-next');
    const btnLast = document.getElementById('pagination-last');
    
    if (btnFirst) btnFirst.disabled = !etat.hasPrev;
    if (btnPrev) btnPrev.disabled = !etat.hasPrev;
    if (btnNext) btnNext.disabled = !etat.hasNext;
    if (btnLast) btnLast.disabled = !etat.hasNext;
    
    // Mettre à jour l'information de pagination
    const infoText = document.getElementById('pagination-info-text');
    if (infoText) {
        infoText.textContent = `Affichage de ${etat.startItem} à ${etat.endItem} sur ${etat.totalItems} prêts`;
    }
    
    // Générer les numéros de page
    genererNumerosDePage(etat);
}

// Générer les numéros de page
function genererNumerosDePage(etat) {
    const paginationNumbers = document.getElementById('pagination-numbers');
    if (!paginationNumbers) return;
    
    paginationNumbers.innerHTML = '';
    
    if (etat.totalPages <= 1) return;
    
    // Calculer la plage de pages à afficher
    let startPage = Math.max(1, etat.currentPage - 2);
    let endPage = Math.min(etat.totalPages, etat.currentPage + 2);
    
    // Ajuster la plage si nécessaire
    if (endPage - startPage < 4) {
        if (startPage === 1) {
            endPage = Math.min(etat.totalPages, startPage + 4);
        } else if (endPage === etat.totalPages) {
            startPage = Math.max(1, endPage - 4);
        }
    }
    
    // Ajouter les numéros de page
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.type = 'button';
        pageBtn.className = `pagination-btn ${i === etat.currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => gererChangementPage(i));
        paginationNumbers.appendChild(pageBtn);
    }
    
    // Ajouter des points de suspension si nécessaire
    if (startPage > 1) {
        const firstBtn = document.createElement('button');
        firstBtn.type = 'button';
        firstBtn.className = 'pagination-btn';
        firstBtn.textContent = '1';
        firstBtn.addEventListener('click', () => gererChangementPage(1));
        paginationNumbers.insertBefore(firstBtn, paginationNumbers.firstChild);
        
        if (startPage > 2) {
            const dotsSpan = document.createElement('span');
            dotsSpan.textContent = '...';
            dotsSpan.style.padding = '0 var(--space-sm)';
            dotsSpan.style.color = 'var(--neutral-500)';
            paginationNumbers.insertBefore(dotsSpan, paginationNumbers.children[1]);
        }
    }
    
    if (endPage < etat.totalPages) {
        if (endPage < etat.totalPages - 1) {
            const dotsSpan = document.createElement('span');
            dotsSpan.textContent = '...';
            dotsSpan.style.padding = '0 var(--space-sm)';
            dotsSpan.style.color = 'var(--neutral-500)';
            paginationNumbers.appendChild(dotsSpan);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.type = 'button';
        lastBtn.className = 'pagination-btn';
        lastBtn.textContent = etat.totalPages;
        lastBtn.addEventListener('click', () => gererChangementPage(etat.totalPages));
        paginationNumbers.appendChild(lastBtn);
    }
}

// ==========================================
// CHARGEMENT DES DONNÉES POUR LES FORMULAIRES
// ==========================================

// Charger toutes les données nécessaires pour les formulaires
function chargerDonneesFormulaires() {
    chargerTypesPretFormulaire();
    chargerComptesFormulaire();
    chargerPeriodesFormulaire();
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
    
    chargerPeriodes()
        .then(periodes => {
            periodes.forEach(periode => {
                const option = document.createElement('option');
                option.value = periode.id_periode;
                option.textContent = `${periode.nom} (${periode.nombre_mois} mois)`;
                select.appendChild(option);
            });
        })
        .catch(error => {
            select.innerHTML = '<option value="">Erreur lors du chargement des périodes</option>';
            console.error('Erreur chargement périodes formulaire:', error);
        });
}

// ==========================================
// FONCTIONS DE DEBUG
// ==========================================

// Fonction de débogage pour vérifier l'état de l'UI
function debuggerUIStatus() {
    console.log('=== DEBUG UI STATUS ===');
    const etat = obtenirEtatPagination();
    console.log('État pagination:', etat);
    
    const { typesPretMap, comptesMap } = obtenirMappings();
    console.log('Types prêt mappings:', typesPretMap.size);
    console.log('Comptes mappings:', comptesMap.size);
    
    // Vérifier les éléments DOM
    const elements = [
        'lister-pret',
        'filtre-prets',
        'ajouter-pret',
        'types-pret-container',
        'comptes-container'
    ];
    
    elements.forEach(id => {
        const el = document.getElementById(id);
        console.log(`Élément ${id}:`, el ? 'trouvé' : 'MANQUANT');
    });
    
    console.log('================');
}

// Exposer les fonctions globalement pour les tests
window.debugUIStatus = debuggerUIStatus;
window.afficherMessage = afficherMessage;
