import * as SQLite from 'expo-sqlite';
import { PunchRecord } from '../types/punch';

// Database name
const DATABASE_NAME = 'monheure.db';

// Table name
const TABLE_NAME = 'PunchLog';

// Database instance
let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize the database and create tables if they don't exist
 */
export const initDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      db = SQLite.openDatabase(DATABASE_NAME);
      
      db.transaction(
        (tx) => {
          // Create PunchLog table
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              date TEXT NOT NULL,
              punchIn TEXT,
              punchOut TEXT,
              notes TEXT
            )`,
            [],
            () => {
              console.log('Database initialized successfully');
              resolve();
            },
            (_, error) => {
              console.error('Error creating table:', error);
              reject(error);
              return false;
            }
          );
        },
        (error) => {
          console.error('Transaction error:', error);
          reject(error);
        },
        () => {
          console.log('Database transaction completed');
        }
      );
    } catch (error) {
      console.error('Database initialization error:', error);
      reject(error);
    }
  });
};

/**
 * Get database instance
 */
export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

/**
 * Add a new punch entry
 */
export const addPunchEntry = (entry: Omit<PunchRecord, 'id'>): Promise<number> => {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    
    database.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT INTO ${TABLE_NAME} (date, punchIn, punchOut, notes) VALUES (?, ?, ?, ?)`,
          [entry.date, entry.punchIn || null, entry.punchOut || null, entry.notes || null],
          (_, result) => {
            console.log('Punch entry added successfully, ID:', result.insertId);
            resolve(result.insertId || 0);
          },
          (_, error) => {
            console.error('Error adding punch entry:', error);
            reject(error);
            return false;
          }
        );
      },
      (error) => {
        console.error('Transaction error:', error);
        reject(error);
      }
    );
  });
};

/**
 * Update an existing punch entry
 */
export const updatePunchEntry = (id: number, updates: Partial<PunchRecord>): Promise<void> => {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    
    const updateFields: string[] = [];
    const values: any[] = [];
    
    if (updates.date !== undefined) {
      updateFields.push('date = ?');
      values.push(updates.date);
    }
    if (updates.punchIn !== undefined) {
      updateFields.push('punchIn = ?');
      values.push(updates.punchIn);
    }
    if (updates.punchOut !== undefined) {
      updateFields.push('punchOut = ?');
      values.push(updates.punchOut);
    }
    if (updates.notes !== undefined) {
      updateFields.push('notes = ?');
      values.push(updates.notes);
    }
    
    if (updateFields.length === 0) {
      resolve();
      return;
    }
    
    values.push(id);
    
    database.transaction(
      (tx) => {
        tx.executeSql(
          `UPDATE ${TABLE_NAME} SET ${updateFields.join(', ')} WHERE id = ?`,
          values,
          (_, result) => {
            console.log('Punch entry updated successfully');
            resolve();
          },
          (_, error) => {
            console.error('Error updating punch entry:', error);
            reject(error);
            return false;
          }
        );
      },
      (error) => {
        console.error('Transaction error:', error);
        reject(error);
      }
    );
  });
};

/**
 * Fetch punch entries for a specific day
 */
export const fetchEntriesForDay = (date: string): Promise<PunchRecord[]> => {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    
    database.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM ${TABLE_NAME} WHERE date = ? ORDER BY punchIn ASC`,
          [date],
          (_, result) => {
            const entries: PunchRecord[] = [];
            for (let i = 0; i < result.rows.length; i++) {
              const row = result.rows.item(i);
              entries.push({
                id: row.id.toString(),
                date: row.date,
                punchIn: row.punchIn,
                punchOut: row.punchOut,
                notes: row.notes,
                totalHours: row.punchIn && row.punchOut 
                  ? calculateHours(row.punchIn, row.punchOut)
                  : undefined
              });
            }
            console.log(`Fetched ${entries.length} entries for ${date}`);
            resolve(entries);
          },
          (_, error) => {
            console.error('Error fetching entries for day:', error);
            reject(error);
            return false;
          }
        );
      },
      (error) => {
        console.error('Transaction error:', error);
        reject(error);
      }
    );
  });
};

/**
 * Fetch punch entries for a date range
 */
export const fetchEntriesForRange = (startDate: string, endDate: string): Promise<PunchRecord[]> => {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    
    database.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM ${TABLE_NAME} WHERE date >= ? AND date <= ? ORDER BY date ASC, punchIn ASC`,
          [startDate, endDate],
          (_, result) => {
            const entries: PunchRecord[] = [];
            for (let i = 0; i < result.rows.length; i++) {
              const row = result.rows.item(i);
              entries.push({
                id: row.id.toString(),
                date: row.date,
                punchIn: row.punchIn,
                punchOut: row.punchOut,
                notes: row.notes,
                totalHours: row.punchIn && row.punchOut 
                  ? calculateHours(row.punchIn, row.punchOut)
                  : undefined
              });
            }
            console.log(`Fetched ${entries.length} entries for range ${startDate} to ${endDate}`);
            resolve(entries);
          },
          (_, error) => {
            console.error('Error fetching entries for range:', error);
            reject(error);
            return false;
          }
        );
      },
      (error) => {
        console.error('Transaction error:', error);
        reject(error);
      }
    );
  });
};

/**
 * Fetch all punch entries
 */
export const fetchAllEntries = (): Promise<PunchRecord[]> => {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    
    database.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM ${TABLE_NAME} ORDER BY date DESC, punchIn DESC`,
          [],
          (_, result) => {
            const entries: PunchRecord[] = [];
            for (let i = 0; i < result.rows.length; i++) {
              const row = result.rows.item(i);
              entries.push({
                id: row.id.toString(),
                date: row.date,
                punchIn: row.punchIn,
                punchOut: row.punchOut,
                notes: row.notes,
                totalHours: row.punchIn && row.punchOut 
                  ? calculateHours(row.punchIn, row.punchOut)
                  : undefined
              });
            }
            console.log(`Fetched ${entries.length} total entries`);
            resolve(entries);
          },
          (_, error) => {
            console.error('Error fetching all entries:', error);
            reject(error);
            return false;
          }
        );
      },
      (error) => {
        console.error('Transaction error:', error);
        reject(error);
      }
    );
  });
};

/**
 * Delete a punch entry by ID
 */
export const deletePunchEntry = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    
    database.transaction(
      (tx) => {
        tx.executeSql(
          `DELETE FROM ${TABLE_NAME} WHERE id = ?`,
          [id],
          (_, result) => {
            console.log('Punch entry deleted successfully');
            resolve();
          },
          (_, error) => {
            console.error('Error deleting punch entry:', error);
            reject(error);
            return false;
          }
        );
      },
      (error) => {
        console.error('Transaction error:', error);
        reject(error);
      }
    );
  });
};

/**
 * Get a single punch entry by ID
 */
export const getPunchEntry = (id: number): Promise<PunchRecord | null> => {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    
    database.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT * FROM ${TABLE_NAME} WHERE id = ?`,
          [id],
          (_, result) => {
            if (result.rows.length > 0) {
              const row = result.rows.item(0);
              const entry: PunchRecord = {
                id: row.id.toString(),
                date: row.date,
                punchIn: row.punchIn,
                punchOut: row.punchOut,
                notes: row.notes,
                totalHours: row.punchIn && row.punchOut 
                  ? calculateHours(row.punchIn, row.punchOut)
                  : undefined
              };
              resolve(entry);
            } else {
              resolve(null);
            }
          },
          (_, error) => {
            console.error('Error getting punch entry:', error);
            reject(error);
            return false;
          }
        );
      },
      (error) => {
        console.error('Transaction error:', error);
        reject(error);
      }
    );
  });
};

/**
 * Calculate hours between two timestamps
 */
const calculateHours = (punchIn: string, punchOut: string): number => {
  const start = new Date(punchIn);
  const end = new Date(punchOut);
  const diffMs = end.getTime() - start.getTime();
  return diffMs / (1000 * 60 * 60); // Convert to hours
};

/**
 * Clear all data from the database
 */
export const clearAllData = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    
    database.transaction(
      (tx) => {
        tx.executeSql(
          `DELETE FROM ${TABLE_NAME}`,
          [],
          (_, result) => {
            console.log('All data cleared successfully');
            resolve();
          },
          (_, error) => {
            console.error('Error clearing data:', error);
            reject(error);
            return false;
          }
        );
      },
      (error) => {
        console.error('Transaction error:', error);
        reject(error);
      }
    );
  });
};

/**
 * Get database statistics
 */
export const getDatabaseStats = (): Promise<{ totalEntries: number; totalHours: number }> => {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    
    database.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT COUNT(*) as totalEntries FROM ${TABLE_NAME}`,
          [],
          (_, result) => {
            const totalEntries = result.rows.item(0).totalEntries;
            
            // Get total hours
            tx.executeSql(
              `SELECT punchIn, punchOut FROM ${TABLE_NAME} WHERE punchIn IS NOT NULL AND punchOut IS NOT NULL`,
              [],
              (_, hoursResult) => {
                let totalHours = 0;
                for (let i = 0; i < hoursResult.rows.length; i++) {
                  const row = hoursResult.rows.item(i);
                  totalHours += calculateHours(row.punchIn, row.punchOut);
                }
                
                resolve({ totalEntries, totalHours });
              },
              (_, error) => {
                console.error('Error calculating total hours:', error);
                reject(error);
                return false;
              }
            );
          },
          (_, error) => {
            console.error('Error getting database stats:', error);
            reject(error);
            return false;
          }
        );
      },
      (error) => {
        console.error('Transaction error:', error);
        reject(error);
      }
    );
  });
}; 