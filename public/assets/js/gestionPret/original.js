// Variables globales pour la gestion des prêts
let currentPage = 1;
let itemsPerPage = 10;
let totalItems = 0;
let allPrets = []; // Pour stocker tous les prêts
let originalPrets = []; // Pour garder les données originales

// Variables globales pour les mappings
let typesPretMap = new Map(); // Map pour stocker id -> nom des types de prêt
let comptesMap = new Map(); // Map pour stocker id -> nom des comptes

// ==========================================
// FONCTION AJAX UTILITAIRE
// ==========================================

// Fonction AJAX simplifiée
function ajax(method, url, data, callback) {
    // Construire l'URL complète
    const baseUrl = window.BASE_URL || '';
    const fullUrl = baseUrl + url;
    
    const xhr = new XMLHttpRequest();
    xhr.open(method, fullUrl, true);
    
    if (method === 'POST') {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    callback(response);
                } catch (e) {
                    console.error('Erreur parsing JSON:', e);
                    callback({ succes: false, message: 'Erreur de parsing' });
                }
            } else {
                console.error('Erreur AJAX:', xhr.status, xhr.statusText);
                callback({ succes: false, message: 'Erreur réseau: ' + xhr.status });
            }
        }
    };
    
    xhr.send(data);
}

document.addEventListener('DOMContentLoaded', function() {
    // Charger les données initiales dans le bon ordre
    Promise.all([
        chargerTypesPret(),
        chargerComptes()
    ]).then(() => {
        // Ensuite charger les prêts une fois que les mappings sont prêts
        chargerPrets();
    }).catch(error => {
        console.error('Erreur lors de l\'initialisation:', error);
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
    }

    // Gestion du filtre
    const formFiltre = document.getElementById('filtre-prets');
    if (formFiltre) {
        formFiltre.addEventListener('submit', function(e) {
            e.preventDefault();
            filtrerPrets();
        });
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
        });
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

    // Gestion de la pagination
    const paginationFirst = document.getElementById('first-page');
    const paginationPrev = document.getElementById('prev-page');
    const paginationNext = document.getElementById('next-page');
    const paginationLast = document.getElementById('last-page');
    const paginationSizeSelect = document.getElementById('items-per-page');
    
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
});

function chargerTypesPret() {
    ajax('GET', '/gestionPret/listerTypesPret', null, data => {
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
    });
}

function chargerComptes() {
    ajax('GET', '/gestionPret/listerComptes', null, data => {
        if (data.succes) {
            const selectFiltre = document.getElementById('filtre_compte_id');
            selectFiltre.innerHTML = '<option value="">Tous</option>';
            
            // Remplir le mapping des comptes
            comptesMap.clear();
            
            data.data.forEach(compte => {
                // Stocker dans le mapping
                const compteLabel = `Compte ${compte.id_compte} - ${compte.client_nom || 'N/A'}`;
                comptesMap.set(compte.id_compte.toString(), compteLabel);
                
                const optionFiltre = document.createElement('option');
                optionFiltre.value = compte.id_compte;
                optionFiltre.textContent = compteLabel;
                selectFiltre.appendChild(optionFiltre);
            });
        }
    });
}

function chargerPeriodes() {
    ajax('GET', '/gestionPret/listerPeriodes', null, data => {
        const select = document.getElementById('periode_id');
        select.innerHTML = '<option value="">Sélectionner...</option>';
        if (data.succes) {
            data.data.forEach(periode => {
                const option = document.createElement('option');
                option.value = periode.id_periode;
                option.textContent = `${periode.nom} (${periode.nombre_mois} mois)`;
                select.appendChild(option);
            });
        }
    });
}

function chargerPrets() {
    console.log('Chargement des prêts...');
    ajax('GET', '/gestionPret/api/lister', null, data => {
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
    });
}

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

document.querySelector('#lister-pret tbody').addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('btn-fiche')) {
        const id = e.target.dataset.id;
        afficherFichePret(id);
    }
});


function afficherFichePret(id) {
    ajax('GET', `/gestionPret/fichePret/${id}`, null, data => {
        if (!data || !data.succes) {
            alert("Erreur lors de la récupération du prêt.");
            return;
        }

        const pret = data.data;
        const compte = pret.compte || {};
        const client = compte.client || {};
        const typePret = pret.type_pret || {};
        const periode = pret.periode || {};
        const remboursements = pret.remboursements || [];

        // Création HTML
        let ficheHTML = `
            <h3>Fiche du prêt #${pret.id_pret}</h3>
            <p><strong>Client :</strong> ${client.nom || 'N/A'}</p>
            <p><strong>Compte :</strong> #${compte.id_compte || 'N/A'}</p>
            <p><strong>Date :</strong> ${pret.date_pret}</p>
            <p><strong>Type de prêt :</strong> ${typePret.nom} (${typePret.taux_annuel}% taux)</p>
            <p><strong>Période :</strong> ${periode.nom} (${periode.nombre_mois} mois)</p>
            <p><strong>Durée :</strong> ${pret.duree} mois</p>
            <p><strong>Montant :</strong> ${parseFloat(pret.montant).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</p>
            <h4>Remboursements (${periode.libelle || 'Mensualité'}) :</h4>
            <table style="border-collapse: collapse; width: 100%; margin-top:10px;">
                <thead>
                    <tr style="background:#f0f0f0">
                        <th style="padding:6px;border:1px solid #ccc;">Période</th>
                        <th style="padding:6px;border:1px solid #ccc;">Base</th>
                        <th style="padding:6px;border:1px solid #ccc;">Intérêt</th>
                        <th style="padding:6px;border:1px solid #ccc;">Amortissement</th>
                        <th style="padding:6px;border:1px solid #ccc;">${periode.libelle}</th>
                    </tr>
                </thead>
                <tbody>
        `;

        remboursements.forEach(r => {
            ficheHTML += `
                <tr>
                    <td style="padding:6px;border:1px solid #ccc;">${r.periode_label}</td>
                    <td style="padding:6px;border:1px solid #ccc;">${parseFloat(r.base).toFixed(2)} €</td>
                    <td style="padding:6px;border:1px solid #ccc;">${parseFloat(r.interet).toFixed(2)} €</td>
                    <td style="padding:6px;border:1px solid #ccc;">${parseFloat(r.amortissement).toFixed(2)} €</td>
                    <td style="padding:6px;border:1px solid #ccc;">${parseFloat(r.a_payer).toFixed(2)} €</td>
                </tr>
            `;
        });

        ficheHTML += `
                </tbody>
            </table>
        `;

        const container = document.getElementById('fiche-pret-container');
        if (container) {
            container.innerHTML = ficheHTML;
            container.scrollIntoView({ behavior: 'smooth' });
        } else {
            alert("Aucun conteneur prévu pour afficher la fiche du prêt.");
            console.log(ficheHTML);
        }
    });
}

function ajouterPret() {
    const form = document.getElementById('ajouter-pret');
    const formData = new FormData(form);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
        params.append(key, value);
    }

    ajax('POST', '/gestionPret/ajouter', params.toString(), function(data) {
        if (data.succes) {
            console.log(data);
            alert('Prêt ajouté avec succès!');
            form.reset();
            chargerPrets(); // Recharger la liste
        } else {
            console.log(data);
            alert('Erreur: ' + data.message);
        }
    });
}


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

function chargerTypesPretFormulaire() {
    const container = document.getElementById('types-pret-container');
    if (!container) return;
    container.innerHTML = '<p>Chargement...</p>';
    ajax('GET', '/gestionPret/listerTypesPret', null, data => {
        if (data.succes && data.data.length > 0) {
            container.innerHTML = '';
            data.data.forEach(type => {
                const typeOption = document.createElement('div');
                typeOption.className = 'type-pret-option';
                typeOption.innerHTML = `
                    <input type="radio" id="type_pret_${type.id_type_pret}" name="type_pret_id" value="${type.id_type_pret}" required>
                    <label for="type_pret_${type.id_type_pret}" class="type-pret-label">
                        <div class="type-pret-header">
                            <strong>${escapeHtml(type.nom)}</strong>
                        </div>
                        <div class="type-pret-details">
                            <span>${parseFloat(type.montant_max).toLocaleString('fr-FR', {minimumFractionDigits: 2})} € max</span>
                            <span>${type.mois_max} mois max</span>
                            <span>Taux ${type.taux_annuel}%</span>
                        </div>
                    </label>`;
                container.appendChild(typeOption);
            });
        } else {
            container.innerHTML = '<p style="color:red">Aucun type de prêt disponible ou erreur API</p>';
        }
    });
}

function chargerComptesFormulaire() {
    const container = document.getElementById('comptes-container');
    if (!container) return;
    container.innerHTML = '<p>Chargement...</p>';
    ajax('GET', '/gestionPret/listerComptes', null, data => {
        if (data.succes && data.data.length > 0) {
            container.innerHTML = '';
            data.data.forEach(compte => {
                const compteOption = document.createElement('div');
                compteOption.className = 'compte-option';
                compteOption.innerHTML = `
                    <input type="radio" id="compte_${compte.id_compte}" name="compte_id" value="${compte.id_compte}" required>
                    <label for="compte_${compte.id_compte}" class="compte-label">
                        <div class="compte-header">
                            <strong>Compte #${compte.id_compte}</strong>
                        </div>
                        <div class="compte-details">
                            <span>${escapeHtml(compte.client_nom || 'N/A')}</span>
                            <span>${escapeHtml(compte.status_nom || 'N/A')}</span>
                        </div>
                    </label>`;
                container.appendChild(compteOption);
            });
        } else {
            container.innerHTML = '<p style="color:red">Aucun compte disponible ou erreur API</p>';
        }
    });
}

function chargerPeriodesFormulaire() {
    const select = document.getElementById('periode_id');
    if (!select) return;
    select.innerHTML = '<option value="">Sélectionner...</option>';
    ajax('GET', '/gestionPret/listerPeriodes', null, data => {
        if (data.succes && data.data.length > 0) {
            data.data.forEach(periode => {
                const option = document.createElement('option');
                option.value = periode.id_periode;
                option.textContent = `${periode.nom} (${periode.nombre_mois} mois)`;
                select.appendChild(option);
            });
        } else {
            select.innerHTML = '<option value="">Aucune période disponible</option>';
        }
    });
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
    const btnFirst = document.getElementById('first-page');
    const btnPrev = document.getElementById('prev-page');
    const btnNext = document.getElementById('next-page');
    const btnLast = document.getElementById('last-page');
    
    if (btnFirst) btnFirst.disabled = currentPage === 1;
    if (btnPrev) btnPrev.disabled = currentPage === 1;
    if (btnNext) btnNext.disabled = currentPage === totalPages || totalPages === 0;
    if (btnLast) btnLast.disabled = currentPage === totalPages || totalPages === 0;
    
    // Mettre à jour l'information de pagination
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    const paginationInfo = document.getElementById('pagination-info');
    if (paginationInfo) {
        paginationInfo.textContent = `Affichage de ${startItem} à ${endItem} sur ${totalItems} prêts`;
    }
    
    // Mettre à jour l'info de page
    const pageInfo = document.getElementById('page-info');
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} sur ${totalPages || 1}`;
    }
}

// Générer les numéros de page (fonction simplifiée pour le template simple)
function genererNumerosDePage(totalPages) {
    // Cette fonction est optionnelle pour le template simple
    // La pagination de base est gérée par les boutons Premier/Précédent/Suivant/Dernier
    console.log(`Pages totales: ${totalPages}, Page courante: ${currentPage}`);
}

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

// ==========================================
// FONCTIONS DE DEBUG
// ==========================================

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
