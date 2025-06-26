# SQLite Database Features

## Overview
The MonHeure app now uses SQLite database for persistent storage of punch records, providing better performance, data integrity, and query capabilities compared to AsyncStorage.

## Database Schema

### PunchLog Table
```sql
CREATE TABLE PunchLog (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  punchIn TEXT,
  punchOut TEXT,
  notes TEXT
);
```

**Fields:**
- `id`: Auto-incrementing primary key
- `date`: Date in YYYY-MM-DD format
- `punchIn`: ISO timestamp string for punch-in time
- `punchOut`: ISO timestamp string for punch-out time
- `notes`: Optional notes for the punch record

## Database Helper Methods

### Core CRUD Operations

#### `initDatabase()`
- Initializes the SQLite database
- Creates the PunchLog table if it doesn't exist
- Called automatically when the app starts

#### `addPunchEntry(entry)`
- Adds a new punch entry to the database
- Returns the auto-generated ID of the new record
- Parameters: `Omit<PunchRecord, 'id'>`

#### `updatePunchEntry(id, updates)`
- Updates an existing punch entry
- Parameters: `id` (number), `updates` (Partial<PunchRecord>)

#### `deletePunchEntry(id)`
- Deletes a punch entry by ID
- Parameters: `id` (number)

#### `getPunchEntry(id)`
- Retrieves a single punch entry by ID
- Returns `PunchRecord | null`

### Query Methods

#### `fetchEntriesForDay(date)`
- Fetches all punch entries for a specific date
- Parameters: `date` (string in YYYY-MM-DD format)
- Returns: `PunchRecord[]`

#### `fetchEntriesForRange(startDate, endDate)`
- Fetches punch entries for a date range
- Parameters: `startDate`, `endDate` (strings in YYYY-MM-DD format)
- Returns: `PunchRecord[]`

#### `fetchAllEntries()`
- Fetches all punch entries from the database
- Returns: `PunchRecord[]`
- Ordered by date (newest first) and punch-in time

### Utility Methods

#### `clearAllData()`
- Clears all data from the PunchLog table
- Used in Settings screen for data reset

#### `getDatabaseStats()`
- Returns database statistics
- Returns: `{ totalEntries: number, totalHours: number }`

## Integration with Screens

### Home Screen
- Uses `fetchEntriesForDay()` to load today's punch data
- Uses `addPunchEntry()` for new punch-ins
- Uses `updatePunchEntry()` for punch-outs and time edits

### History Screen
- Uses `fetchAllEntries()` to load all punch records
- Uses `updatePunchEntry()` and `deletePunchEntry()` for editing/deleting records
- Calendar view shows marked dates based on database data

### Report Screen
- Uses `fetchEntriesForRange()` to get data for selected date range
- Generates reports and PDFs based on database records

### Settings Screen
- Uses `clearAllData()` for the "Clear All Data" feature
- Maintains settings in AsyncStorage while punch data is in SQLite

## Sample Data Generation

### `generateSampleData()`
- Generates 30 days of sample punch data
- Skips weekends
- Creates 1-2 entries per workday
- Random work hours between 6-10 hours
- Random start times between 7 AM and 10 AM

### `generateSampleDataForRange(startDate, endDate)`
- Generates sample data for a specific date range
- Useful for testing and development

### `generateSampleDataForToday()`
- Generates a single sample entry for today
- Quick testing utility

## Error Handling

All database operations include comprehensive error handling:
- Database initialization errors
- Transaction errors
- SQL execution errors
- Data validation errors

Errors are logged to console and displayed to users via Alert dialogs.

## Performance Considerations

- Database operations are asynchronous
- Queries are optimized with proper indexing
- Large datasets are handled efficiently
- Memory usage is minimized through proper cursor management

## Migration from AsyncStorage

The app has been migrated from AsyncStorage to SQLite:
- Punch data is now stored in SQLite
- Settings remain in AsyncStorage for simplicity
- Existing data migration utilities are available
- Backward compatibility is maintained where possible

## Dependencies

- `expo-sqlite`: Core SQLite functionality
- TypeScript types for type safety
- Error handling and logging utilities

## Future Enhancements

Potential improvements for the database system:
- Data export/import functionality
- Backup and restore features
- Advanced querying and filtering
- Data analytics and reporting
- Multi-user support
- Cloud synchronization 