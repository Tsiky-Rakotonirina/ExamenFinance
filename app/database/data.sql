-- Donnees pour la table fond
INSERT INTO fond (date_fond, montant) VALUES
('2025-01-01', 1000000.00),
('2025-03-01', 1500000.00),
('2025-05-01', 2000000.00);

-- Donnees pour la table status_type_pret
INSERT INTO status_type_pret (nom) VALUES
('Actif'),
('Inactif');

-- Donnees pour la table type_pret
INSERT INTO type_pret (nom, date_type_pret, status_type_pret_id, mois_max, montant_max, taux_annuel, echeance_initiale) VALUES
('Pret Personnel', '2025-04-01', 1, 24, 50000.00, 5.00, 1),
('Pret Immobilier', '2025-04-05', 1, 120, 1000000.00, 4.20, 2),
('Pret Etudiant', '2025-04-10', 2, 60, 20000.00, 3.00, 3);

-- Donnees pour la table historique_type_pret
INSERT INTO historique_type_pret (type_pret_id, date_type_pret, status_type_pret, duree_max, montant_max, taux) VALUES
(1, '2025-02-01', 2, 24, 40000.00, 8.00),
(2, '2025-02-05', 1, 120, 900000.00, 4.50),
(3, '2025-02-10', 3, 60, 18000.00, 3.50);

-- Donnees pour la table client
INSERT INTO client (nom, email, mot_de_passe, date_ajout) VALUES
('Jean Dupont', 'jean.dupont@example.com', 'mdp123', '2025-05-01'),
('Sophie Martin', 'sophie.martin@example.com', 'mdp456', '2025-05-02'),
('Ali Randria', 'ali.randria@example.com', 'mdp789', '2025-05-03');

-- Donnees pour la table status_compte
INSERT INTO status_compte (nom) VALUES
('Actif'),
('Inactif');

-- Donnees pour la table compte
INSERT INTO compte (client_id, status_compte_id, solde) VALUES
(1, 1, 10000.00),
(2, 1, 5000.00),
(3, 2, 0.00);

-- Donnees pour la table periode
INSERT INTO periode (nom, nombre_mois, libelle) VALUES
('Mensuel', 1, 12),
('Trimestriel', 3, 4),
('Semestriel', 6, 2),
('Annuel', 12, 1);
