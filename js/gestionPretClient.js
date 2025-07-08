document.addEventListener('DOMContentLoaded', function() {
    chargerTypesPret();
    chargerTypesPretFormulaire();
    chargerComptes();
    chargerComptesFormulaire();
    chargerPeriodesFormulaire();
    chargerPrets();

    document.getElementById('ajouter-pret').addEventListener('submit', function(e) {
        e.preventDefault();
        ajouterPret();
    });

    document.getElementById('filtre-prets').addEventListener('submit', function(e) {
        e.preventDefault();
        filtrerPrets();
    });

    document.getElementById('reset-filtre').addEventListener('click', function() {
        document.getElementById('filtre-prets').reset();
        chargerPrets();
    });

    // --- Tri sur clic direct sur l'en-tête du tableau ---
    document.querySelectorAll('#lister-pret thead th[data-col]').forEach(th => {
        th.style.cursor = 'pointer';
        th.addEventListener('click', function() {
            const colonne = this.dataset.col;
            if (!colonne) return;
            if (colonneTriee === colonne) {
                ordreAscendant = !ordreAscendant;
            } else {
                colonneTriee = colonne;
                ordreAscendant = true;
            }
            trierLignesParColonne(colonne, ordreAscendant);
        });
    });

    document.querySelectorAll('#lister-pret thead .tri-lien').forEach(span => {
        span.style.cursor = 'pointer';
        span.addEventListener('click', function() {
            const colonne = this.dataset.col;
            if (!colonne) return;
            if (colonneTriee === colonne) {
                ordreAscendant = !ordreAscendant;
            } else {
                colonneTriee = colonne;
                ordreAscendant = true;
            }
            trierLignesParColonne(colonne, ordreAscendant);
        });
    });
});

function chargerTypesPret() {
    ajax('GET', '/gestionPret/listerTypesPret', null, data => {
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
    });
}

function chargerComptes() {
    ajax('GET', '/gestionPret/listerComptes', null, data => {
        if (data.succes) {
            const selectFiltre = document.getElementById('filtre_compte_id');
            selectFiltre.innerHTML = '<option value="">Tous</option>';
            data.data.forEach(compte => {
                const optionFiltre = document.createElement('option');
                optionFiltre.value = compte.id_compte;
                optionFiltre.textContent = `Compte ${compte.id_compte} - ${compte.client_nom || 'N/A'}`;
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
    ajax('GET', '/gestionPret/api/lister', null, data => {
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
        // Récupérer le nom du compte
        const compteName = pret.compte ? `${pret.compte.client.nom} - Compte #${pret.compte.id_compte}` : `Compte #${pret.compte_id}`;
        row.innerHTML = `
            <td>${pret.id_pret}</td>
            <td class="date-cell">${pret.date_pret}</td>
            <td>
                <span class="compte-name">${compteName}</span>
                ${pret.compte ? `<small class="compte-details-table">Solde: ${parseFloat(pret.compte.solde).toFixed(2)}€</small>` : ''}
            </td>
            <td class="montant-cell">${parseFloat(pret.montant).toFixed(2)}€</td>
            <td>${pret.duree}</td>
            <td>${pret.pourcentage_assurance}</td>
            <td><button class="btn-fiche" data-id="${pret.id_pret}">Voir fiche</button></td>
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

        let ficheHTML = `
            <div class="fiche-overlay">
                <div class="fiche-modal">
                    <div class="fiche-header">
                        <h3 style="color:white;">Fiche du prêt #${pret.id_pret}</h3>
                        <div class="fiche-header-buttons">
                            <button class="btn-exporter-pdf" onclick="exporterFicheEnPDF(${pret.id_pret})">Exporter en PDF</button>
                            <button class="btn-fermer-fiche" onclick="fermerFiche()">×</button>
                        </div>
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
                                <span class="info-value">${pret.date_pret || 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Type de prêt :</span>
                                <span class="info-value">${typePret.nom || 'N/A'} (${typePret.taux_annuel || '0'}% taux)</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Période :</span>
                                <span class="info-value">${periode.nom || 'N/A'} (${periode.nombre_mois || '0'} mois)</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Durée :</span>
                                <span class="info-value">${pret.duree || 'N/A'}</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Pourcentage assurance :</span>
                                <span class="info-value">${pret.pourcentage_assurance || '0'} %</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Montant :</span>
                                <span class="info-value montant-principal">${parseFloat(pret.montant || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
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
            const mensualite = r.mensualite ? parseFloat(r.mensualite).toFixed(2) : parseFloat(r.a_payer || 0).toFixed(2);
            const assurance = r.assurance ? parseFloat(r.assurance).toFixed(2) : '0.00';
            ficheHTML += `
                <tr>
                    <td>${r.periode_label || 'N/A'}</td>
                    <td class="montant">${parseFloat(r.base || 0).toFixed(2)} €</td>
                    <td class="montant">${parseFloat(r.interet || 0).toFixed(2)} €</td>
                    <td class="montant">${parseFloat(r.amortissement || 0).toFixed(2)} €</td>
                    <td class="montant mensualite">${mensualite} €</td>
                    <td class="montant mensualite">${assurance} €</td>
                    <td class="montant mensualite">${parseFloat(r.a_payer || 0).toFixed(2)} €</td>
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

        let container = document.getElementById('fiche-pret-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'fiche-pret-container';
            document.body.appendChild(container);
        }
        
        container.innerHTML = ficheHTML;
        container.classList.add('fiche-visible');
        document.body.style.overflow = 'hidden';
    });
}
function exporterFicheEnPDF(pretId) {
    ajax('GET', `/gestionPret/fichePret/${pretId}`, null, data => {
        if (!data || !data.succes) {
            alert("Erreur lors de la récupération des données du prêt pour l'exportation.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const pret = data.data;
        const compte = pret.compte || {};
        const client = compte.client || {};
        const typePret = pret.type_pret || {};
        const periode = pret.periode || {};
        const remboursements = pret.remboursements || [];

        let y = 20;
        
        // Titre
        doc.setFontSize(16);
        doc.text(`Fiche du prêt #${pret.id_pret}`, 20, y);
        y += 20;

        // Informations du prêt
        doc.setFontSize(12);
        doc.text(`Client : ${client.nom || 'N/A'}`, 20, y);
        y += 10;
        doc.text(`Compte : #${compte.id_compte || 'N/A'}`, 20, y);
        y += 10;
        doc.text(`Date : ${pret.date_pret || 'N/A'}`, 20, y);
        y += 10;
        doc.text(`Type de prêt : ${typePret.nom || 'N/A'} (${typePret.taux_annuel || '0'}% taux)`, 20, y);
        y += 10;
        doc.text(`Période : ${periode.nom || 'N/A'} (${periode.nombre_mois || '0'} mois)`, 20, y);
        y += 10;
        doc.text(`Durée : ${pret.duree || 'N/A'}`, 20, y);
        y += 10;
        doc.text(`Pourcentage assurance : ${pret.pourcentage_assurance || '0'} %`, 20, y);
        y += 10;
        doc.text(`Montant : ${parseFloat(pret.montant || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €`, 20, y);
        y += 20;

        // Tableau des remboursements
        doc.text(`Remboursements (${periode.libelle || 'Mensualité'}) :`, 20, y);
        y += 15;

        // En-tête du tableau
        const headers = ['Période', 'Base', 'Intérêt', 'Amortissement', 'Mensualité', 'Assurance', 'A Payer'];
        let x = 20;
        const colWidths = [25, 25, 25, 30, 25, 25, 25];
        
        headers.forEach((header, i) => {
            doc.text(header, x, y);
            x += colWidths[i];
        });
        y += 10;

        // Lignes du tableau
        remboursements.forEach((r, index) => {
            const mensualite = r.mensualite ? parseFloat(r.mensualite).toFixed(2) : parseFloat(r.a_payer || 0).toFixed(2);
            const assurance = r.assurance ? parseFloat(r.assurance).toFixed(2) : '0.00';
            
            const row = [
                r.periode_label || 'N/A',
                `${parseFloat(r.base || 0).toFixed(2)}`,
                `${parseFloat(r.interet || 0).toFixed(2)}`,
                `${parseFloat(r.amortissement || 0).toFixed(2)}`,
                `${mensualite}`,
                `${assurance}`,
                `${parseFloat(r.a_payer || 0).toFixed(2)}`
            ];
            
            x = 20;
            row.forEach((cell, i) => {
                doc.text(cell, x, y);
                x += colWidths[i];
            });
            y += 8;
            
            // Nouvelle page si nécessaire
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        });

        // Sauvegarder le PDF
        doc.save(`fiche_pret_${pret.id_pret}.pdf`);
    });
}
function fermerFiche() {
    const container = document.getElementById('fiche-pret-container');
    if (container) {
        container.classList.remove('fiche-visible');
        container.innerHTML = '';
        document.body.style.overflow = 'auto';
    }
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
            chargerPrets();
        } else {
            console.log(data);
            alert('Erreur: ' + data.message);
        }
    });
}

function filtrerPrets() {
    // Récupère les valeurs du formulaire de filtre
    const form = document.getElementById('filtre-prets');
    const formData = new FormData(form);
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
        if (value !== '') {
            // Pour montant_min et montant_max, filtrer sur le champ montant
            if (key === 'montant_min') {
                params.append('montant_min', value);
            } else if (key === 'montant_max') {
                params.append('montant_max', value);
            } else {
                params.append(key, value);
            }
        }
    }
    ajax('GET', '/gestionPret/api/lister?' + params.toString(), null, data => {
        if (data.succes) {
            afficherPrets(data.data);
        }
    });
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

document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('fiche-overlay')) {
        fermerFiche();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        fermerFiche();
    }
});

// Tri des lignes du tableau selon la colonne cliquée (tri ascendant, puis descend si re-cliqué)
let colonneTriee = null;
let ordreAscendant = true;

document.querySelectorAll('.btn-tri').forEach(button => {
    button.addEventListener('click', function() {
        const colonne = this.dataset.col;
        if (colonneTriee === colonne) {
            ordreAscendant = !ordreAscendant;
        } else {
            colonneTriee = colonne;
            ordreAscendant = true;
        }
        trierLignesParColonne(colonne, ordreAscendant);
    });
});

function trierLignesParColonne(colonne, asc = true) {
    const tbody = document.querySelector('#lister-pret tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    // Associer colonne à l'index du tableau
    let colIndex = 0;
    switch(colonne) {
        case 'id_pret': colIndex = 0; break;
        case 'date_pret': colIndex = 1; break;
        case 'type_pret': colIndex = 2; break;
        case 'compte': colIndex = 3; break;
        case 'montant': colIndex = 4; break;
        case 'duree': colIndex = 5; break;
        case 'pourcentage_assurance': colIndex = 6; break;
        default: colIndex = 0;
    }
    rows.sort((a, b) => {
        let valA = a.cells[colIndex].textContent.trim();
        let valB = b.cells[colIndex].textContent.trim();
        // Conversion pour tri numérique ou date si besoin
        if (colonne === 'montant' || colonne === 'duree' || colonne === 'id_pret' || colonne === 'pourcentage_assurance') {
            valA = parseFloat(valA.replace(/[^\d.-]/g, ''));
            valB = parseFloat(valB.replace(/[^\d.-]/g, ''));
        } else if (colonne === 'date_pret') {
            valA = new Date(valA);
            valB = new Date(valB);
        }
        if (valA < valB) return asc ? -1 : 1;
        if (valA > valB) return asc ? 1 : -1;
        return 0;
    });
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}

function exporterFicheEnPDF(pretId) {
    ajax('GET', `/gestionPret/fichePret/${pretId}`, null, data => {
        if (!data || !data.succes) {
            alert("Erreur lors de la récupération des données du prêt pour l'exportation.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const pret = data.data;
        const compte = pret.compte || {};
        const client = compte.client || {};
        const typePret = pret.type_pret || {};
        const periode = pret.periode || {};
        const remboursements = pret.remboursements || [];

        let y = 20;
        
        // Titre
        doc.setFontSize(16);
        doc.text(`Fiche du prêt #${pret.id_pret}`, 20, y);
        y += 20;

        // Informations du prêt
        doc.setFontSize(12);
        doc.text(`Client : ${client.nom || 'N/A'}`, 20, y);
        y += 10;
        doc.text(`Compte : #${compte.id_compte || 'N/A'}`, 20, y);
        y += 10;
        doc.text(`Date : ${pret.date_pret || 'N/A'}`, 20, y);
        y += 10;
        doc.text(`Type de prêt : ${typePret.nom || 'N/A'} (${typePret.taux_annuel || '0'}% taux)`, 20, y);
        y += 10;
        doc.text(`Période : ${periode.nom || 'N/A'} (${periode.nombre_mois || '0'} mois)`, 20, y);
        y += 10;
        doc.text(`Durée : ${pret.duree || 'N/A'}`, 20, y);
        y += 10;
        doc.text(`Pourcentage assurance : ${pret.pourcentage_assurance || '0'} %`, 20, y);
        y += 10;
        doc.text(`Montant : ${parseFloat(pret.montant || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €`, 20, y);
        y += 20;

        // Tableau des remboursements
        doc.text(`Remboursements (${periode.libelle || 'Mensualité'}) :`, 20, y);
        y += 15;

        // En-tête du tableau
        const headers = ['Période', 'Base', 'Intérêt', 'Amortissement', 'Mensualité', 'Assurance', 'A Payer'];
        let x = 20;
        const colWidths = [25, 25, 25, 30, 25, 25, 25];
        
        headers.forEach((header, i) => {
            doc.text(header, x, y);
            x += colWidths[i];
        });
        y += 10;
        // Lignes du tableau
        remboursements.forEach((r, index) => {
            const mensualite = r.mensualite ? parseFloat(r.mensualite).toFixed(2) : parseFloat(r.a_payer || 0).toFixed(2);
            const assurance = r.assurance ? parseFloat(r.assurance).toFixed(2) : '0.00';
            
            const row = [
                r.periode_label || 'N/A',
                `${parseFloat(r.base || 0).toFixed(2)}`,
                `${parseFloat(r.interet || 0).toFixed(2)}`,
                `${parseFloat(r.amortissement || 0).toFixed(2)}`,
                `${mensualite}`,
                `${assurance}`,
                `${parseFloat(r.a_payer || 0).toFixed(2)}`
            ];
            
            x = 20;
            row.forEach((cell, i) => {
                doc.text(cell, x, y);
                x += colWidths[i];
            });
            y += 8;
            
            // Nouvelle page si nécessaire
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        });

        // Sauvegarder le PDF
        doc.save(`fiche_pret_${pret.id_pret}.pdf`);
    });
}