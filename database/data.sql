-- =====================================================
-- JEU DE DONNEES COMPLET POUR LE SYSTEME DE CREDIT
-- =====================================================

-- Donnees pour la table status_type_pret
INSERT INTO status_type_pret (nom) VALUES
('Actif'),
('Inactif');

-- Donnees pour la table fond (Capital disponible pour les prêts)
INSERT INTO fond (date_fond, montant) VALUES
('2025-01-01', 1000000.00),
('2025-02-15', 800000.00),
('2025-03-01', 1500000.00),
('2025-04-10', 1200000.00),
('2025-05-01', 2000000.00),
('2025-06-01', 1800000.00),
('2025-07-01', 2200000.00);

-- Donnees pour la table type_pret
INSERT INTO type_pret (nom, date_type_pret, status_type_pret_id, mois_max, montant_max, taux_annuel, echeance_initiale) VALUES
('Pret Personnel', '2025-04-01', 1, 24, 50000.00, 5.50, 1),
('Pret Immobilier', '2025-04-05', 1, 240, 1500000.00, 3.80, 2),
('Pret Etudiant', '2025-04-10', 1, 60, 25000.00, 2.50, 3),
('Pret Auto', '2025-04-15', 1, 84, 80000.00, 4.20, 1),
('Pret Entreprise', '2025-04-20', 1, 120, 500000.00, 6.00, 2),
('Credit Revolving', '2025-04-25', 1, 12, 15000.00, 8.50, 1),
('Pret Travaux', '2025-05-01', 1, 120, 200000.00, 4.80, 2);

-- Historique des modifications des types de prêts
INSERT INTO historique_type_pret (type_pret_id, date_type_pret, nom, status_type_pret_id, mois_max, montant_max, taux_annuel, echeance_initiale) VALUES
(1, '2025-03-01', 'Pret Personnel', 1, 24, 45000.00, 6.00, 1),
(2, '2025-03-15', 'Pret Immobilier', 1, 240, 1200000.00, 4.20, 2),
(3, '2025-03-20', 'Pret Etudiant', 2, 60, 20000.00, 3.00, 3);

-- Donnees pour la table client
INSERT INTO client (nom, email, mot_de_passe, date_ajout) VALUES
('Jean Dupont', 'jean.dupont@example.com', '$2y$10$example123', '2025-01-15'),
('Sophie Martin', 'sophie.martin@example.com', '$2y$10$example456', '2025-02-10'),
('Ali Randria', 'ali.randria@example.com', '$2y$10$example789', '2025-02-25'),
('Marie Dubois', 'marie.dubois@example.com', '$2y$10$example101', '2025-03-05'),
('Pierre Moreau', 'pierre.moreau@example.com', '$2y$10$example102', '2025-03-12'),
('Fatima Hassan', 'fatima.hassan@example.com', '$2y$10$example103', '2025-03-20'),
('Michel Bernard', 'michel.bernard@example.com', '$2y$10$example104', '2025-04-02'),
('Laure Petit', 'laure.petit@example.com', '$2y$10$example105', '2025-04-15'),
('Ahmed Karim', 'ahmed.karim@example.com', '$2y$10$example106', '2025-05-01'),
('Catherine Roux', 'catherine.roux@example.com', '$2y$10$example107', '2025-05-18');

-- Donnees pour la table status_compte
INSERT INTO status_compte (nom) VALUES
('Actif'),
('Inactif');

-- Donnees pour la table compte
INSERT INTO compte (client_id, status_compte_id, solde) VALUES
(1, 1, 15000.00),
(2, 1, 8500.00),
(3, 1, 12000.00),
(4, 1, 25000.00),
(5, 1, 3500.00),
(6, 2, 0.00),
(7, 1, 45000.00),
(8, 1, 18000.00),
(9, 2, 5000.00),
(10, 1, 32000.00);

-- Donnees pour la table periode
INSERT INTO periode (nom, nombre_mois, libelle) VALUES
('Mensuel', 1, 'Mensualite'),
('Bimestriel', 2, 'Bimestrialite'),
('Trimestriel', 3, 'Trimestrialite'),
('Semestriel', 6, 'Semestrialite'),
('Annuel', 12, 'Annuite');

-- Donnees pour la table pret (Prêts accordés)
INSERT INTO pret (date_pret, type_pret_id, compte_id, montant, duree, periode_id, pourcentage_assurance) VALUES
(NOW(), 1, 1, 25000.00, 24, 1, 0.50),
(NOW(), 2, 4, 350000.00, 240, 1, 0.25),
(NOW(), 3, 3, 15000.00, 48, 1, 0.30),
(NOW(), 4, 7, 45000.00, 60, 1, 0.40),
(NOW(), 1, 8, 18000.00, 18, 1, 0.50),
(NOW(), 7, 10, 85000.00, 96, 1, 0.35);

-- Donnees pour la table simulation_pret (Simulations effectuées)
INSERT INTO simulation_pret (date_pret, type_pret_id, compte_id, montant, duree, periode_id, pourcentage_assurance) VALUES
(NOW(), 1, 2, 30000.00, 24, 1, 0.50),
(NOW(), 2, 5, 280000.00, 180, 1, 0.25),
(NOW(), 4, 6, 35000.00, 48, 1, 0.40),
(NOW(), 3, 9, 12000.00, 36, 1, 0.30),
(NOW(), 7, 1, 65000.00, 84, 1, 0.35),
(NOW(), 5, 4, 150000.00, 60, 3, 0.60),
(NOW(), 6, 8, 8000.00, 12, 1, 1.00);

-- Exemples de remboursements pour le premier pret (ID 1 - 25000 sur 24 mois)
INSERT INTO remboursement (pret_id, numero_periode, base, interet, amortissement, mensualite, assurance, a_payer, date_echeance) VALUES
(1, 1, 25000.00, 114.58, 1031.94, 1146.52, 10.42, 1156.94, '2025-06-15'),
(1, 2, 23968.06, 109.81, 1036.71, 1146.52, 10.42, 1156.94, '2025-07-15'),
(1, 3, 22931.35, 105.02, 1041.50, 1146.52, 10.42, 1156.94, '2025-08-15'),
(1, 4, 21889.85, 100.20, 1046.32, 1146.52, 10.42, 1156.94, '2025-09-15'),
(1, 5, 20843.53, 95.37, 1051.15, 1146.52, 10.42, 1156.94, '2025-10-15');

-- Exemples de simulations de remboursement
INSERT INTO simulation_remboursement (pret_id, numero_periode, base, interet, amortissement, mensualite, assurance, a_payer, date_echeance) VALUES
(1, 1, 30000.00, 137.50, 1237.50, 1375.00, 12.50, 1387.50, '2025-08-01'),
(1, 2, 28762.50, 131.62, 1243.38, 1375.00, 12.50, 1387.50, '2025-09-01'),
(1, 3, 27519.12, 125.71, 1249.29, 1375.00, 12.50, 1387.50, '2025-10-01'),
(2, 1, 280000.00, 886.67, 513.33, 1400.00, 58.33, 1458.33, '2025-08-02'),
(2, 2, 279486.67, 885.06, 514.94, 1400.00, 58.33, 1458.33, '2025-09-02');

