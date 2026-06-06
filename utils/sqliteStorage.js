import { open } from "react-native-quick-sqlite";

// Открываем базу данных
const db = open({ name: "my_app_storage.db" });

// Создаем таблицу для хранения данных Zustand, если её ещё нет
db.execute(
    "CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY, value TEXT)",
);

const pendingOperations = new Map();
let flushTimer = null;

const scheduleFlush = () => {
    if (flushTimer) return;

    const flushQueue = () => {
        const operations = new Map(pendingOperations);
        pendingOperations.clear();
        flushTimer = null;

        try {
            operations.forEach((value, key) => {
                if (value === null) {
                    db.execute("DELETE FROM kv_store WHERE key = ?", [key]);
                } else {
                    db.execute(
                        "INSERT OR REPLACE INTO kv_store (key, value) VALUES (?, ?)",
                        [key, value],
                    );
                }
            });
        } catch (e) {
            console.error("SQLite batch write error:", e);
        }
    };

    if (typeof requestIdleCallback !== "undefined") {
        flushTimer = requestIdleCallback(flushQueue, { timeout: 100 });
    } else {
        flushTimer = setTimeout(flushQueue, 50);
    }
};

export const sqliteZustandStorage = {
    setItem: async (name, value) => {
        pendingOperations.set(name, value);
        scheduleFlush();
        return null;
    },

    getItem: (name) => {
        if (pendingOperations.has(name)) {
            const pendingValue = pendingOperations.get(name);
            return pendingValue === null ? null : pendingValue;
        }

        try {
            const result = db.execute(
                "SELECT value FROM kv_store WHERE key = ?",
                [name],
            );
            if (result.rows && result.rows.length > 0) {
                return result.rows.item(0).value;
            }
            return null;
        } catch (e) {
            console.error("SQLite getItem error:", e);
            return null;
        }
    },

    removeItem: async (name) => {
        pendingOperations.set(name, null);
        scheduleFlush();
        return null;
    },
};
