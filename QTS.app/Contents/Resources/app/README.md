# Qualtrics Theme Suite (QTS)
An OS X app for managing, creating, editing, and uploading Qualtrics survey themes.


## <span id="UserSettings">USER SETTINGS FILE &nbsp; *local/user-settings.json*</span>

Description Here

####Update the User Settings File
<table>
  <tr>
    <td colspan="2"><strong><code>core.userSettingsFile.update()</code></strong></td>
  </tr>
  <tr>
    <td>Description</td>
    <td>Updates the user settings file based on the core.localData.userSettings</td>
  </tr>
</table>  

####Read the User Settings File
<table>
  <tr>
    <td colspan="2"><strong><code>core.userSettingsFile.read()</code></strong></td>
  </tr>
  <tr>
    <td>Description</td>
    <td>Returns the contents of the user-settings.json file</td>
  </tr>
  <tr>
    <td>Note</td>
    <td>To read the user settings into the local data object, use the `localData` Methods</td>
  </tr>
</table>  

## <span id="PersistentData">PERSISTENT DATA FILE &nbsp; *local/persitent-data.json*</span>

The Persistent Data File stores data that will carry over form session to session.

####Update the Persistent Data File
<table>
  <tr>
    <td colspan="2"><strong><code>core.persistentDataFile.update()</code></strong></td>
  </tr>
  <tr>
    <td>Description</td>
    <td>Updates the persitent data file based on the core.localData</td>
  </tr>
</table>  
<br>
####Read the Persistent Data File
<table>
  <tr>
    <td colspan="2"><strong><code>core.persistentDataFile.read()</code></strong></td>
  </tr>
  <tr>
    <td>Description</td>
    <td>Returns the contents of the persistent data file</td>
  </tr>
  <tr>
    <td>Note</td>
    <td>To read the persistent data into the local data object, use the `localData` Methods instead</td>
  </tr>
</table>  

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
<table>
  <tr>
    <td colspan="2"><strong><code>core.localData.initUserSettings()</code></strong></td>
  </tr>
  <tr>
    <td>Description</td>
    <td>Reads the contents of *local/user-settings.json* and stores it on the Local Data Object</td>
  </tr>
  <tr>
    <td>Note</td>
    <td>The Local Uder Settings Data should only be copied from the User Settings File On start-up. Any time thereafter, the local settings will overwrite <i>user-settings.json<i> using <code>core.userSettingsFile.update()</code></td>
  </tr>
</table>
<br>
####Add a Brand to the Recent Brand List
<table>
  <tr>
    <td colspan="2"><strong><code>core.localData.addToRecentBrands(brand)</code></strong></td>
  </tr>
  <tr>
    <td>Description</td>
    <td>Pushes a brand to the front of the recent brands list and pops of the last brand</td>
  </tr>
</table>
<br>
####Update the Current Brand
<table>
  <tr>
    <td colspan="2"><strong><code>core.localData.setCurrentBrand(brand)</code></strong></td>
  </tr>
  <tr>
    <td>Description</td>
    <td>Will set the current brand</td>
  </tr>
  <tr>
    <td>Note</td>
    <td>This method should be run after <code>addToRecentBrands</code></td>
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
    <td>Updates the Local Brand List based on the path in <code>core.localData.userSettings.files.pathToBrands</code></td>
  </tr>
</table>
<br>
####Get a Filtered Brand List
<table>
  <tr>
    <td colspan="2"><strong><code>core.localData.filterBrands(criteria_string)</code></strong></td>
  </tr>
  <tr>
    <td>Description</td>
    <td>Returns a list of brands that start with the same letters of the given criteria</td>
  </tr>
</table>
<br>
####Update *All* of `LocalData`'s Objects (NOT currently used)
<table>
  <tr>
    <td colspan="2"><strong><code>core.localData.updateAll()</code></strong></td>
  </tr>
  <tr>
    <td>Description</td>
    <td>Updates the user settings file based on the core.localData.userSettings</td>
  </tr>
</table>
<br>
<br>




<sub>Built with ❤ on [Electron](https://github.com/atom/electron) using node.js / io.js</sub>
