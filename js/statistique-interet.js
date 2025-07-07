const urlBase = 'http://localhost:9443/ExamenFinance/ws';

function ajax(method, url, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, urlBase + url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    callback(JSON.parse(xhr.responseText));
                } catch (e) {
                    console.error('Erreur lors du parsing JSON :', e.message);
                    alert('Erreur lors du traitement de la réponse du serveur.');
                }
            } else {
                console.error('Erreur réseau :', xhr.status, xhr.statusText);
                alert('Erreur réseau lors de la communication avec le serveur.');
            }
        }
    };
    xhr.send(data);
}

document.addEventListener('DOMContentLoaded', () => {
    const btnFiltrer = document.querySelector('#btn-filtrer-statistiques');
    const moisMinSelect = document.querySelector('#mois_min');
    const anneeMinSelect = document.querySelector('#annee_min');
    const moisMaxSelect = document.querySelector('#mois_max');
    const anneeMaxSelect = document.querySelector('#annee_max');

    // Vérifier que tous les éléments existent
    if (!moisMinSelect || !anneeMinSelect || !moisMaxSelect || !anneeMaxSelect) {
        console.error('Erreur : un ou plusieurs éléments du formulaire ne sont pas trouvés dans le DOM.');
        return;
    }

    // Fonction pour charger les années disponibles
    function chargerAnneesDisponibles() {
        ajax('GET', '/annees-disponibles', null, (json) => {
            console.log('Réponse API /annees-disponibles :', json);
            if (json.succes && json.data && Array.isArray(json.data)) {
                anneeMinSelect.innerHTML = '<option value="">-- Année --</option>';
                anneeMaxSelect.innerHTML = '<option value="">-- Année --</option>';
                json.data.forEach(item => {
                    const anneeValue = item.annee;
                    const optionMin = document.createElement('option');
                    optionMin.value = anneeValue;
                    optionMin.textContent = anneeValue;
                    anneeMinSelect.appendChild(optionMin);
                    const optionMax = document.createElement('option');
                    optionMax.value = anneeValue;
                    optionMax.textContent = anneeValue;
                    anneeMaxSelect.appendChild(optionMax);
                });
            } else {
                console.error('Erreur lors du chargement des années :', json.message || 'Aucune donnée reçue');
                anneeMinSelect.innerHTML = '<option value="">Aucune année disponible</option>';
                anneeMaxSelect.innerHTML = '<option value="">Aucune année disponible</option>';
            }
        });
    }

    // Événement pour le bouton Filtrer
    btnFiltrer.addEventListener('click', () => {
        const moisMin = moisMinSelect.value.trim();
        const anneeMin = anneeMinSelect.value.trim();
        const moisMax = moisMaxSelect.value.trim();
        const anneeMax = anneeMaxSelect.value.trim();

        if (!moisMin || !anneeMin || !moisMax || !anneeMax) {
            alert('Veuillez sélectionner un mois et une année pour la date de début et de fin.');
            return;
        }

        // Vérifier que la date de fin est postérieure ou égale à la date de début
        const dateDebut = new Date(anneeMin, moisMin - 1);
        const dateFin = new Date(anneeMax, moisMax - 1);
        if (dateFin < dateDebut) {
            alert('La date de fin doit être postérieure ou égale à la date de début.');
            return;
        }

        const data = `mois_min=${encodeURIComponent(moisMin)}&annee_min=${encodeURIComponent(anneeMin)}&mois_max=${encodeURIComponent(moisMax)}&annee_max=${encodeURIComponent(anneeMax)}`;
        
        ajax('GET', '/interets-par-mois?' + data, data, (json) => {
            console.log('Réponse API /interets-par-mois :', json);
            if (json.succes && json.data) {
                for (let mois = 1; mois <= 12; mois++) {
                    const cellule = document.querySelector(`#interet-${mois}`);
                    const interet = json.data[mois] !== undefined ? parseFloat(json.data[mois]) : 0.00;
                    cellule.textContent = interet.toFixed(2);
                }
            } else {
                alert(json.message || 'Erreur lors du chargement des statistiques.');
                for (let mois = 1; mois <= 12; mois++) {
                    document.querySelector(`#interet-${mois}`).textContent = '0.00';
                }
            }
        });
    });

    // Charger les années au démarrage
    chargerAnneesDisponibles();
});