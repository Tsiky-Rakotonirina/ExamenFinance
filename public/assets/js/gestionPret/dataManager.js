// ==========================================
// DataManager - Gestion des données pour les prêts
// ==========================================

// Variables globales pour les données
let allPrets = []; // Pour stocker tous les prêts
let originalPrets = []; // Pour garder les données originales
let typesPretMap = new Map(); // Map pour stocker id -> nom des types de prêt
let comptesMap = new Map(); // Map pour stocker id -> nom des comptes

// Variables de pagination/filtrage
let currentPage = 1;
let itemsPerPage = 10;
let totalItems = 0;

// ==========================================
// FONCTIONS UTILITAIRES
// ==========================================

// Helper pour préfixer les URLs API
function apiUrl(path) {
    let base = window.BASE_URL || 'http://localhost/ExamenFinance/ws';
    if (base.endsWith('/')) base = base.slice(0, -1);
    if (!path.startsWith('/')) path = '/' + path;
    return base + path;
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

// ==========================================
// CHARGEMENT DES DONNÉES
// ==========================================

// Charger les types de prêt pour les filtres et mappings
function chargerTypesPret() {
    return fetch(apiUrl('/gestionPret/listerTypesPret'))
        .then(response => response.json())
        .then(data => {
            if (data.succes) {
                // Remplir le mapping des types de prêt
                typesPretMap.clear();
                
                data.data.forEach(type => {
                    // Stocker dans le mapping
                    typesPretMap.set(type.id_type_pret.toString(), type.nom);
                });
                
                console.log(`Types de prêt chargés: ${typesPretMap.size} éléments`);
                return data.data;
            }
            throw new Error(data.message || 'Erreur lors du chargement des types de prêt');
        })
        .catch(error => {
            console.error('Erreur lors du chargement des types de prêt:', error);
            throw error;
        });
}

// Charger les comptes pour les filtres et mappings
function chargerComptes() {
    return fetch(apiUrl('/gestionPret/listerComptes'))
        .then(response => response.json())
        .then(data => {
            if (data.succes) {
                // Remplir le mapping des comptes
                comptesMap.clear();
                
                data.data.forEach(compte => {
                    // Stocker dans le mapping
                    const compteLabel = `Compte ${compte.id_compte} - ${compte.client_nom || 'N/A'}`;
                    comptesMap.set(compte.id_compte.toString(), compteLabel);
                });
                
                console.log(`Comptes chargés: ${comptesMap.size} éléments`);
                return data.data;
            }
            throw new Error(data.message || 'Erreur lors du chargement des comptes');
        })
        .catch(error => {
            console.error('Erreur lors du chargement des comptes:', error);
            throw error;
        });
}

// Charger la liste des prêts
function chargerPrets() {
    console.log('Chargement des prêts...');
    return fetch(apiUrl('/gestionPret/api/lister'))
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
                console.log(`${data.data.length} prêts chargés`);
                return data.data;
            } else {
                throw new Error(data.message || 'Réponse non successful');
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement des prêts:', error);
            throw error;
        });
}

// Charger les périodes
function chargerPeriodes() {
    return fetch(apiUrl('/gestionPret/listerPeriodes'))
        .then(response => response.json())
        .then(data => {
            if (data.succes) {
                console.log(`Périodes chargées: ${data.data.length} éléments`);
                return data.data;
            }
            throw new Error(data.message || 'Erreur lors du chargement des périodes');
        })
        .catch(error => {
            console.error('Erreur lors du chargement des périodes:', error);
            throw error;
        });
}

// ==========================================
// GESTION DES DONNÉES
// ==========================================

// Ajouter un prêt
function ajouterPret(formData) {
    return fetch(apiUrl('/gestionPret/ajouter'), {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
    })
    .then(data => {
        if (data.succes) {
            console.log('Prêt ajouté avec succès');
            return data;
        } else {
            throw new Error(data.message || 'Erreur lors de l\'ajout');
        }
    })
    .catch(error => {
        console.error('Erreur lors de l\'ajout du prêt:', error);
        throw error;
    });
}

// ==========================================
// FILTRAGE ET TRI
// ==========================================

// Filtrer les prêts
function filtrerPrets(filtres) {
    const { typePretId, compteId, montantMin, montantMax } = filtres;
    
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
    
    console.log(`Filtrage appliqué: ${totalItems} prêts trouvés sur ${originalPrets.length} total`);
    return allPrets;
}

// Trier les prêts
function trierPrets(colonne, direction) {
    console.log(`=== DÉBUT TRI ===`);
    console.log(`Tri appliqué: colonne=${colonne}, direction=${direction}`);
    console.log(`Nombre d'éléments à trier: ${allPrets.length}`);
    
    if (allPrets.length === 0) {
        console.warn('Aucun prêt à trier');
        return allPrets;
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
    console.log('=== FIN TRI ===');
    
    return allPrets;
}

// Réinitialiser les filtres
function reinitialiserFiltres() {
    // Restaurer les données originales et réinitialiser la pagination
    allPrets = [...originalPrets];
    totalItems = allPrets.length;
    currentPage = 1;
    
    console.log('Filtres réinitialisés - affichage de tous les prêts');
    return allPrets;
}

// ==========================================
// PAGINATION
// ==========================================

// Obtenir les données pour la page courante
function obtenirDonneesPageCourante() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allPrets.slice(startIndex, endIndex);
}

// Aller à une page spécifique
function allerALaPage(page) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        return true;
    }
    return false;
}

// Changer le nombre d'éléments par page
function changerItemsParPage(nouveauNombre) {
    itemsPerPage = parseInt(nouveauNombre);
    currentPage = 1;
    return true;
}

// ==========================================
// GETTERS POUR L'ÉTAT
// ==========================================

// Obtenir l'état de pagination
function obtenirEtatPagination() {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    return {
        currentPage,
        totalPages,
        itemsPerPage,
        totalItems,
        startItem,
        endItem,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
    };
}

// Obtenir les mappings pour l'affichage
function obtenirMappings() {
    return {
        typesPretMap,
        comptesMap
    };
}

// ==========================================
// FONCTIONS DE DEBUG
// ==========================================

// Fonction de débogage pour vérifier l'état du système
function debuggerDataStatus() {
    console.log('=== DEBUG DATA STATUS ===');
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

// Exposer les fonctions globalement pour les tests
window.debugDataStatus = debuggerDataStatus;
window.testTriData = testTri;
