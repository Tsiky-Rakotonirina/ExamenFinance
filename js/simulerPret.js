document.addEventListener('DOMContentLoaded', function() {
    chargerTypesPretFormulaire();
    chargerComptesFormulaire();
    chargerPeriodesFormulaire();
    chargerPrets();
    document.getElementById('ajouter-pret').addEventListener('submit', function(e) {
        e.preventDefault();
        ajouterSimulation();
    });

    document.getElementById('btn-comparer').addEventListener('click', comparerPrets);

    document.querySelectorAll('.btn-tri').forEach(button => {
        button.addEventListener('click', function() {
            const colonne = this.dataset.col;
            const direction = document.getElementById('tri_direction').value;
            trierPrets(colonne, direction);
        });
    });
});

function chargerPrets() {
    ajax('GET', '/simulerPret/api/lister', null, data => {
        if (data.succes) {
            afficherPrets(data.data);
        }
    });
}

function afficherPrets(prets) {
    const tbody = document.querySelector('#lister-pret tbody');
    tbody.innerHTML = '';
    prets.forEach(pret => {
        const row = document.createElement('tr');
        
        // Récupérer les noms des types et comptes depuis les données
        const typeName = pret.type_pret ? pret.type_pret.nom : `Type #${pret.type_pret_id}`;
        const compteName = pret.compte ? `${pret.compte.client.nom} - Compte #${pret.compte.id_compte}` : `Compte #${pret.compte_id}`;
        
        row.innerHTML = `
            <td><input type="checkbox" class="checkbox-compare" value="${pret.id_simulation_pret}"></td>
            <td>${pret.id_simulation_pret}</td>
            <td class="date-cell">${pret.date_pret}</td>
            <td>
                <span class="type-name">${typeName}</span>
                ${pret.type_pret ? `<small class="type-details">${pret.type_pret.taux_annuel}% - ${pret.type_pret.description || ''}</small>` : ''}
            </td>
            <td>
                <span class="compte-name">${compteName}</span>
                ${pret.compte ? `<small class="compte-details-table">Solde: ${parseFloat(pret.compte.solde).toFixed(2)}€</small>` : ''}
            </td>
            <td class="montant-cell">${parseFloat(pret.montant).toFixed(2)}€</td>
            <td>${pret.duree}</td>
            <td>${pret.pourcentage_assurance}</td>
            <td><button class="btn-fiche" data-id="${pret.id_simulation_pret}">Voir fiche</button></td>
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

function comparerPrets() {
    const checked = document.querySelectorAll('.checkbox-compare:checked');
    if (checked.length !== 2) {
        alert('Veuillez sélectionner exactement 2 prêts à comparer.');
        return;
    }

    const id1 = checked[0].value;
    const id2 = checked[1].value;

    afficherFicheComparaison(id1, id2);
}



function afficherFicheComparaison(id1, id2) {
    Promise.all([
        new Promise(resolve => ajax('GET', `/simulerPret/fichePret/${id1}`, null, resolve)),
        new Promise(resolve => ajax('GET', `/simulerPret/fichePret/${id2}`, null, resolve))
    ]).then(([res1, res2]) => {
        if (!res1.succes || !res2.succes) {
            alert('Erreur dans la récupération des prêts.');
            return;
        }

        const ficheHTML1 = genererContenuFichePret(res1.data, 'fiche-gauche');
        const ficheHTML2 = genererContenuFichePret(res2.data, 'fiche-droite');

        const container = document.getElementById('fiche-pret-container') || document.createElement('div');
        container.id = 'fiche-pret-container';
        container.classList.add('fiche-visible');

        container.innerHTML = `
            <div class="fiche-overlay">
                <div class="fiche-modal comparaison">
                    <div class="fiche-header">
                        <h3>Comparaison de prêts</h3>
                        <button class="btn-fermer-fiche" onclick="fermerFiche()">×</button>
                    </div>
                    <div class="fiche-content-comparaison">
                        <div class="fiche-col">${ficheHTML1}</div>
                        <div class="fiche-col">${ficheHTML2}</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(container);
        document.body.style.overflow = 'hidden';
    });
}
function genererContenuFichePret(pret, classe = '') {
    const compte = pret.compte || {};
    const client = compte.client || {};
    const typePret = pret.type_pret || {};
    const periode = pret.periode || {};
    const remboursements = pret.remboursements || [];

    let html = `
        <div class="fiche-info ${classe}">
            <div class="info-row">
                <span class="info-label">Client :</span>
                <span class="info-value">${client.nom || 'N/A'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Compte :</span>
                <span class="info-value">#${compte.id_compte || 'N/A'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Date :</span>
                <span class="info-value">${pret.date_pret}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Type de prêt :</span>
                <span class="info-value">${typePret.nom || ''} (${typePret.taux_annuel || ''}% taux)</span>
            </div>
            <div class="info-row">
                <span class="info-label">Période :</span>
                <span class="info-value">${periode.nom || ''} (${periode.nombre_mois || ''} mois)</span>
            </div>
            <div class="info-row">
                <span class="info-label">Durée :</span>
                <span class="info-value">${pret.duree}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Pourcentage assurance :</span>
                <span class="info-value">${pret.pourcentage_assurance} %</span>
            </div>
            <div class="info-row">
                <span class="info-label">Montant :</span>
                <span class="info-value montant-principal">${parseFloat(pret.montant).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
            </div>
        </div>

        <div class="fiche-remboursements">
            <h4>Remboursements (${periode.libelle || 'Mensualité'}) :</h4>
            <div class="table-container-fiche">
                <table class="table-fiche">
                    <thead>
                        <tr>
                            <th>Période</th>
                            <th>Base</th>
                            <th>Intérêt</th>
                            <th>Amortissement</th>
                            <th>Mensualité</th>
                            <th>Assurance</th>
                            <th>A Payer</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    remboursements.forEach(r => {
        html += `
            <tr>
                <td>${r.periode_label}</td>
                <td class="montant">${parseFloat(r.base).toFixed(2)} €</td>
                <td class="montant">${parseFloat(r.interet).toFixed(2)} €</td>
                <td class="montant">${parseFloat(r.amortissement).toFixed(2)} €</td>
                <td class="montant mensualite">${parseFloat(r.mensualite).toFixed(2)} €</td>
                <td class="montant mensualite">${parseFloat(r.assurance).toFixed(2)} €</td>
                <td class="montant mensualite">${parseFloat(r.a_payer).toFixed(2)} €</td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    return html;
}


function afficherFichePret(id) {
    ajax('GET', `/simulerPret/fichePret/${id}`, null, data => {
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

        // Création HTML avec style moderne
        let ficheHTML = `
            <div class="fiche-overlay">
                <div class="fiche-modal">
                    <div class="fiche-header">
                        <h3>Fiche du prêt #${pret.id_simulation_pret}</h3>
                        <button class="btn-fermer-fiche" onclick="fermerFiche()">×</button>
                    </div>
                    <div class="fiche-ajout-form">
                        <form class="form-ajouter-pret" onsubmit="event.preventDefault(); ajouterPretDepuisFiche(this);">
                            <input type="hidden" name="id_simulation_pret" value="${pret.id_simulation_pret}">
                            <input type="hidden" name="date_pret" value="${pret.date_pret}">
                            <input type="hidden" name="type_pret_id" value="${typePret.id_type_pret}">
                            <input type="hidden" name="periode_id" value="${periode.id_periode}">
                            <input type="hidden" name="duree" value="${pret.duree}">
                            <input type="hidden" name="compte_id" value="${compte.id_compte}">
                            <input type="hidden" name="pourcentage_assurance" value="${pret.pourcentage_assurance}">
                            <input type="hidden" name="montant" value="${pret.montant}">
                            <button type="submit" class="btn-ajouter-pret" style="margin-top: 12px;">➕ Ajouter ce prêt</button>
                        </form>
                    </div>

                    <div class="fiche-content">
                        <div class="fiche-info">
                            <div class="info-row">
                                <span class="info-label">Client :</span>
                                <span class="info-value">${client.nom || 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Compte :</span>
                                <span class="info-value">#${compte.id_compte || 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Date :</span>
                                <span class="info-value">${pret.date_pret}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Type de prêt :</span>
                                <span class="info-value">${typePret.nom} (${typePret.taux_annuel}% taux)</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Période :</span>
                                <span class="info-value">${periode.nom} (${periode.nombre_mois} mois)</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Durée :</span>
                                <span class="info-value">${pret.duree}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Pourcentage assurance :</span>
                                <span class="info-value">${pret.pourcentage_assurance} %</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Montant :</span>
                                <span class="info-value montant-principal">${parseFloat(pret.montant).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
                            </div>
                        </div>
                        
                        <div class="fiche-remboursements">
                            <h4>Remboursements (${periode.libelle || 'Mensualité'}) :</h4>
                            <div class="table-container-fiche">
                                <table class="table-fiche">
                                    <thead>
                                        <tr>
                                            <th>Période</th>
                                            <th>Base</th>
                                            <th>Intérêt</th>
                                            <th>Amortissement</th>
                                            <th>Mensualité</th>
                                            <th>Assurance</th>
                                            <th>A Payer</th>
                                        </tr>
                                    </thead>
                                    <tbody>
        `;

        remboursements.forEach(r => {
            ficheHTML += `
                <tr>
                    <td>${r.periode_label}</td>
                    <td class="montant">${parseFloat(r.base).toFixed(2)} €</td>
                    <td class="montant">${parseFloat(r.interet).toFixed(2)} €</td>
                    <td class="montant">${parseFloat(r.amortissement).toFixed(2)} €</td>
                    <td class="montant mensualite">${parseFloat(r.mensualite).toFixed(2)} €</td>
                    <td class="montant mensualite">${parseFloat(r.assurance).toFixed(2)} €</td>
                    <td class="montant mensualite">${parseFloat(r.a_payer).toFixed(2)} €</td>
                </tr>
            `;
        });

        ficheHTML += `
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Créer ou mettre à jour le conteneur flottant
        let container = document.getElementById('fiche-pret-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'fiche-pret-container';
            document.body.appendChild(container);
        }
        
        container.innerHTML = ficheHTML;
        container.classList.add('fiche-visible');
        
        // Empêcher le scroll du body
        document.body.style.overflow = 'hidden';
    });
}

function ajouterPretDepuisFiche(form) {
    const formData = new FormData(form);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
        params.append(key, value);
    }

    ajax('POST', '/simulerPret/ajouterPret', params.toString(), function(data) {
        if (data.succes) {
            alert('Pret ajouté avec succès!');
            chargerPrets(); // recharge la liste si nécessaire
        } else {
            alert('Erreur: ' + data.message);
        }
    });
}


// Fonction pour fermer la fiche
function fermerFiche() {
    const container = document.getElementById('fiche-pret-container');
    if (container) {
        container.classList.remove('fiche-visible');
        container.innerHTML = '';
        document.body.style.overflow = 'auto';
    }
}

function ajouterSimulation() {
    const form = document.getElementById('ajouter-pret');
    const formData = new FormData(form);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
        params.append(key, value);
    }

    ajax('POST', '/simulerPret/ajouter', params.toString(), function(data) {
        if (data.succes) {
            console.log(data);
            alert('Simulation ajouté avec succès!');
            form.reset();
            chargerPrets();
        } else {
            console.log(data);
            alert('Erreur: ' + data.message);
        }
    });
}


function filtrerPrets() {
    chargerPrets();
}

function trierPrets(colonne, direction) {
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
        return direction === 'DESC' ? valB - valA : valA - valB;
    });
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}

function chargerTypesPretFormulaire() {
    const container = document.getElementById('types-pret-container');
    if (!container) return;
    container.innerHTML = '<p>Chargement...</p>';
    ajax('GET', '/simulerPret/listerTypesPret', null, data => {
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
                            <span>Montant max: ${parseFloat(type.montant_max).toLocaleString('fr-FR', {minimumFractionDigits: 2})} €</span>
                            <span>Durée max: ${type.mois_max} mois</span>
                            <span>Taux: ${type.taux_annuel}%</span>
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
    ajax('GET', '/simulerPret/listerComptes', null, data => {
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
                            <span>Client: ${escapeHtml(compte.client_nom || 'N/A')}</span>
                            <span>Status: ${escapeHtml(compte.status_nom || 'N/A')}</span>
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
    ajax('GET', '/simulerPret/listerPeriodes', null, data => {
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

// Gestion de la fermeture par clic sur l'overlay
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('fiche-overlay')) {
        fermerFiche();
    }
});

// Gestion de la fermeture par touche Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        fermerFiche();
    }
});
