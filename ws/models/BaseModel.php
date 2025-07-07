<?php

require_once __DIR__ . '/../db.php';

class BaseModel
{
    public  static function executeQuery(string $query, array $parameters): array
    {
        $db = getDB();
        if (!$db) {
            return [
                'succes' => false,
                'data' => null,
                'message' => 'Pas de connexion active.'
            ];
        }
        try {
            $stmt = $db->prepare($query);
            if ($parameters) {
                $stmt->execute($parameters);
            } else {
                $stmt->execute();
            }
            $results = $stmt->fetchAll();
            return [
                'succes' => true,
                'data' => $results,
                'message' => 'Requete executee avec succes.'
            ];
        } catch (\PDOException $e) {
            return [
                'succes' => false,
                'data' => null,
                'message' => 'Erreur lors de l execution de la requete : ' . $e->getMessage()
            ];
        }
    }

    public static function executeUpdate(string $query, array $parameters): array
    {
        $db = getDB();
        if (!$db) {
            return [
                'succes' => false,
                'message' => 'Pas de connexion active.'
            ];
        }
        try {
            $stmt = $db->prepare($query);
            if ($parameters) {
                $stmt->execute($parameters);
            } else {
                $stmt->execute();
            }
            return [
                'succes' => true,
                'message' => 'Mise a jour effectuee avec succes.'
            ];
        } catch (\PDOException $e) {
            return [
                'succes' => false,
                'message' => 'Erreur lors de l execution de la mise a jour : ' . $e->getMessage()
            ];
        }
    }

    public static function insererDonnee(string $table, array $data): array
    {
        if (empty($data)) {
            return [
                'succes' => false,
                'message' => 'Aucune donnee fournie pour insertion.'
            ];
        }
        $colonnes = array_keys($data);
        $placeholders = array_map(fn($col) => ':' . $col, $colonnes);
        $sql = "INSERT INTO `$table` (" . implode(', ', $colonnes) . ") VALUES (" . implode(', ', $placeholders) . ")";
        return self::executeUpdate($sql, $data);
    }

    public function supprimerDonnee(string $table, array $data): array
    {
        $clauses = [];
        foreach ($data as $col => $val) {
            $clauses[] = "$col = :$col";
        }
        $where = implode(' AND ', $clauses);
        $sql = "DELETE FROM `$table` WHERE $where";
        return self::executeUpdate($sql, $data);
    }

    public function modifierDonnee(string $table, array $data, array $conditions): array
    {
        if (empty($data)) {
            return [
                'succes' => false,
                'message' => 'Aucune donnee a modifier.'
            ];
        }
        $setClauses = [];
        foreach ($data as $col => $val) {
            $setClauses[] = "$col = :set_$col";
        }
        $whereClauses = [];
        foreach ($conditions as $col => $val) {
            $whereClauses[] = "$col = :cond_$col";
        }
        $sql = "UPDATE `$table` SET " . implode(', ', $setClauses) . " WHERE " . implode(' AND ', $whereClauses);
        $parameters = [];
        foreach ($data as $col => $val) {
            $parameters['set_' . $col] = $val;
        }
        foreach ($conditions as $col => $val) {
            $parameters['cond_' . $col] = $val;
        }
        return self::executeUpdate($sql, $parameters);
    }

    public static function selectionnerDonnee(string $table, array $conditions = []): array
    {
        $where = [];
        $parameters = [];
        foreach ($conditions as $key => $val) {
            if (!str_ends_with($key, '_min') && !str_ends_with($key, '_max')) {
                if (is_string($val)) {
                    $where[] = "$key LIKE :$key";
                    $parameters[$key] = "%$val%";
                    continue;
                }
                if (is_numeric($val)) {
                    $where[] = "$key = :$key";
                    $parameters[$key] = $val;
                    continue;
                }
            }
            if (str_ends_with($key, '_min')) {
                $col = substr($key, 0, -4);
                $where[] = "$col >= :$key";
                $parameters[$key] = $val;
            }
            if (str_ends_with($key, '_max')) {
                $col = substr($key, 0, -4);
                $where[] = "$col <= :$key";
                $parameters[$key] = $val;
            }
        }
        $sql = "SELECT * FROM `$table`";
        if (!empty($where)) {
            $sql .= " WHERE " . implode(' AND ', $where);
        }
        return self::executeQuery($sql, $parameters);
    }

    public static function chercherDonnee(string $table, array $conditions = []): array
    {
        $where = [];
        $parameters = [];
        foreach ($conditions as $col => $val) {
            $where[] = "$col = :$col";
            $parameters[$col] = $val;
        }
        $sql = "SELECT * FROM `$table`";
        if (!empty($where)) {
            $sql .= " WHERE " . implode(' AND ', $where);
        }
        return self::executeQuery($sql, $parameters);
    }

    public static function ordronnerDonnee(string $table, string $orderBy, string $direction = 'ASC'): array
    {
        $dir = strtoupper($direction);
        if (!in_array($dir, ['ASC', 'DESC'])) {
            $dir = 'ASC';
        }
        $sql = "SELECT * FROM `$table` ORDER BY `$orderBy` $dir";
        return self::executeQuery($sql, []);
    }
}
