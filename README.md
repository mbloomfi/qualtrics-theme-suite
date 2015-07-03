# Qualtrics Theme Suite (QTS)
An OS X app for managing, creating, editing, and uploading Qualtrics survey themes.


## <span id="UserSettings">USER SETTINGS</span>

Description Here

####Update `user-settings.json`
| **Method** |  **`core.userSettingsFile.update()`** |
| ----------------------- | ------------------------- |
| Description |  Updates the user settings file based on the core.localData.userSettings |
<br>
####Read `user-settings.json`
| **Method** |  **`core.userSettingsFile.read()`** |
| ----------------------- | ------------------------- |
| Description |  Updates the user settings file based on the core.localData.userSettings |

***NOTE:*** To read the user settings into the local data object, use the Local Data Methods instead relating to user settings


<br>

## <span id="PersistentData">PERSISTENT DATA</span>

The Persistent Data File (*local/persistent-data.json*) stores data that will carry over form session to session.

####Update `persistent-data.json`
| **Method** |  **`core.persistentDataFile.update()`** |
| ----------------------- | ------------------------- |
| Description |  Updates the user settings file based on the core.localData.userSettings |
<br>
####Read `persistent-data.json`
| **Method** |  **`core.persistentDataFile.read()`** |
| ----------------------- | ------------------------- |
| Description |  Updates the user settings file based on the core.localData.userSettings |

***NOTE:*** To read the persistent data into the local data object, use the Local Data Methods instead relating to persistent data

<br>

## <span id="LocalData">LOCAL DATA &nbsp; `core.localData`</span>

The Local Data Object is primarily used to store data that will most likely be written to a file. Mirroring the files with the Local Data Object, instead of directly reading data from the files, allows for less file reading/writing, which makes the app quicker and less likely purge imoprtant data.

####Objects within Local Data
| Object | Description | Associated File |
| ------ | ----------- | --------------- |
| recentBrands | stores the last 5 opened brands | persistent-data.json -> `recentBrands` |
| brandList | stores a list of all of the brands | persistent-data.json -> `brandList` |
| userSettings | stores a local copy of the entire user-settings.json file | user-settings.json |
| currentBrand | the currently opened brand | persistent-data.json -> `recentBrands[0]` |

<br>

####Update Local User Settings from `user-settings.json` (occurs *once*, on start-up)
| **Method** |  **`core.localData.initUserSettings()`** |
| ----------------------- | ------------------------- |
| Description | Reads the contents of *local/user-settings.json* and stores it on the Local Data Object |
| Note | The Local Uder Settings Data should only be copied from the User Settings File On start-up. Any time thereafter, the local settings will overwrite *user-settings.json* using `core.userSettingsFile.update()` |
<br>
####Update the Recent Brand List
<table>
  <tr>
    <td colspan="2"><strong><code>core.localData.updateRecentBrands()</code></strong></td>
  </tr>
  <tr>
    <td>Description</td>
    <td>Updates the user settings file based on the core.localData.userSettings</td>
  </tr>
</table>
<br>
####Update the Brand List
<table>
  <tr>
    <td colspan="2"><strong><code>core.localData.updateBrandList()</code></strong></td>
  </tr>
  <tr>
    <td>Description</td>
    <td>Updates the user settings file based on the core.localData.userSettings</td>
  </tr>
</table>
<br>
####Get a Filtered Brand List
<table>
  <tr>
    <td colspan="2"><strong><code>core.localData.filterBrands()</code></strong></td>
  </tr>
  <tr>
    <td>Description</td>
    <td>Updates the user settings file based on the core.localData.userSettings</td>
  </tr>
</table>
<br>
####Update *All* of `LocalData`'s Objects
<table>
  <tr>
    <td colspan="2"><strong><code>core.localData.filterBrands()</code></strong></td>
  </tr>
  <tr>
    <td>Description</td>
    <td>Updates the user settings file based on the core.localData.userSettings</td>
  </tr>
</table>
<br>
<br>




<sub>Built with ❤ on [Electron](https://github.com/atom/electron) using node.js / io.js</sub>
