# Qualtrics Theme Suite (QTS)
An OS X app for managing, creating, editing, and uploading Qualtrics survey themes.


### <span id="UserSettings">USER SETTINGS</span>

Description Here

#####Update `user-settings.json`
| **Method** |  **`core.userSettingsFile.update()`** |
| ----------------------- | ------------------------- |
| Description |  Updates the user settings file based on the core.localData.userSettings |
<br>
#####Read `user-settings.json`
| **Method** |  **`core.userSettingsFile.read()`** |
| ----------------------- | ------------------------- |
| Description |  Updates the user settings file based on the core.localData.userSettings |

***NOTE:*** To read the user settings into the local data object, use the Local Data Methods instead relating to user settings


<br>

### <span id="PersistentData">PERSISTENT DATA</span>

The Persistent Data File (local/persistent-data.json) stores data that will carry over form session to session

#####Update `persistent-data.json`
| **Method** |  **`core.persistentDataFile.update()`** |
| ----------------------- | ------------------------- |
| Description |  Updates the user settings file based on the core.localData.userSettings |
<br>
#####Read `persistent-data.json`
| **Method** |  **`core.persistentDataFile.read()`** |
| ----------------------- | ------------------------- |
| Description |  Updates the user settings file based on the core.localData.userSettings |

***NOTE:*** To read the persistent data into the local data object, use the Local Data Methods instead relating to persistent data

<br>

### <span id="LocalData">Local Data</span>

The Persistent Data File (local/persistent-data.json) stores data that will carry over form session to session

#####Objects within Local Data
- recentBrands - stores the last 5 opened brands
- brandList - stores a list of all of the brands
- userSettings - stores a local copy of the user-settings.json file
- currentBrand - the currently opened brand


#####Update Local User Settings from `user-settings.json` (occurs *once*, on start-up)
| **Method** |  **`core.localData.initUserSettings()`** |
| ----------------------- | ------------------------- |
| Description |  Updates the user settings file based on the core.localData.userSettings |
<br>
#####Update the Recent Brand List
| **Method** |  **`core.localData.updateRecentBrands()`** |
| ----------------------- | ------------------------- |
| Description |  Updates the user settings file based on the core.localData.userSettings |
<br>
#####Update the Brand List
| **Method** |  **`core.localData.updateBrandList()`** |
| ----------------------- | ------------------------- |
| Description |  Updates the user settings file based on the core.localData.userSettings |
<br>
#####Get a Filtered Brand List
| **Method** |  **`core.localData.filterBrands()`** |
| ----------------------- | ------------------------- |
| Description |  Updates the user settings file based on the core.localData.userSettings |
<br>
#####Update *All* of `LocalData`'s Objects
| **Method** |  **`core.localData.filterBrands()`** |
| ----------------------- | ------------------------- |
| Description |  Updates the user settings file based on the core.localData.userSettings |



<br>




<sub>Built with ❤ on [Electron](https://github.com/atom/electron) using node.js / io.js</sub>
