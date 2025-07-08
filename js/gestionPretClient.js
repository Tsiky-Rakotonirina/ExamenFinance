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

    document.querySelectorAll('.btn-tri').forEach(button => {
        button.addEventListener('click', function() {
            const colonne = this.dataset.col;
            const direction = document.getElementById('tri_direction').value;
            trierPrets(colonne, direction);
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
        row.innerHTML = `
            <td>${pret.id_pret}</td>
            <td>${pret.date_pret}</td>
            <td>${pret.type_pret_id}</td>
            <td>${pret.compte_id}</td>
            <td>${parseFloat(pret.montant).toFixed(2)}€</td>
            <td>${pret.duree} mois</td>
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
