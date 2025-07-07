-- Table : fond
CREATE TABLE fond (
    id_fond INT AUTO_INCREMENT PRIMARY KEY,
    date_fond DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    montant DECIMAL(15,2) NOT NULL
);


-- Table : status_type_pret
CREATE TABLE status_type_pret (
    id_type_pret INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- Table : type_pret
CREATE TABLE type_pret (
    id_type_pret INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    date_type_pret DATE NOT NULL,
    status_type_pret_id INT NOT NULL,
    mois_max INT NOT NULL,
    montant_max DECIMAL(15,2) NOT NULL,
    taux_annuel DECIMAL(5,2) NOT NULL,
    echeance_initiale INT NOT NULL,
    FOREIGN KEY (status_type_pret_id) REFERENCES status_type_pret(id_type_pret)
);

-- Table : historique_type_pret
CREATE TABLE historique_type_pret (
    id_historique_type_pret INT AUTO_INCREMENT PRIMARY KEY,
    type_pret_id INT NOT NULL,
    date_type_pret DATE NOT NULL,
    status_type_pret INT NOT NULL,
    mois_max INT NOT NULL,
    montant_max DECIMAL(15,2) NOT NULL,
    taux_annuel DECIMAL(5,2) NOT NULL,
    echeance_initiale INT NOT NULL,
    FOREIGN KEY (type_pret_id) REFERENCES type_pret(id_type_pret),
    FOREIGN KEY (status_type_pret) REFERENCES status_type_pret(id_type_pret)
    
);

-- Table : client
CREATE TABLE client (
    id_client INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    date_ajout DATE NOT NULL
);

-- Table : status_compte
CREATE TABLE status_compte (
    id_status INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- Table : compte
CREATE TABLE compte (
    id_compte INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    status_compte_id INT NOT NULL,
    solde DECIMAL(15,2) NOT NULL DEFAULT 0.0,
    FOREIGN KEY (client_id) REFERENCES client(id_client),
    FOREIGN KEY (status_compte_id) REFERENCES status_compte(id_status)
);

-- Table : pret
CREATE TABLE pret (
    id_pret INT AUTO_INCREMENT PRIMARY KEY,
    date_pret DATE NOT NULL,
    type_pret_id INT NOT NULL,
    compte_id INT NOT NULL,
    montant DECIMAL(15,2) NOT NULL,
    duree INT NOT NULL,
    FOREIGN KEY (type_pret_id) REFERENCES type_pret(id_type_pret),
    FOREIGN KEY (compte_id) REFERENCES compte(id_compte)
);
