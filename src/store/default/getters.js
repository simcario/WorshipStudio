export function getDisplayName(state) {
    return state.displayName
}
export function getEmail(state) {
    return state.email
}
export function getLoggedIn(state) {
    return state.loggedIn
}
export function getOrganizationName(state) {
    return state.organizationName
}
export function getOrganizationID(state) {
    return state.organizationID
}
export function getStartModule(state) {
    return state.startModule
}

export function getComputerType(state) {
    return state.computerType
}
export function getComputerName(state) {
    return state.computerName
}

export function getLicenseType(state) {
    return state.licenseType
}
export function getLicenseKey(state) {
    return state.licenseKey
}
export function getFirstConfig(state) {
    return state.firstConfig
}
export function getNetworkEnabled(state) {
    return state.networkEnabled
}

export function getMobileFirstConfig(state){
    return state.mobileFirstConfig
}

export function getValidUntil(state){
    return state.validUntil
}

export function getInternetStatus(state){
    return state.internet
}

export function getLicenseExpired(state){
    return state.licenseExpired < 0
}

export function getSongs(state){
    return state.songs
}
export function getSongList(state){
    return state.songList
}

export function getModuleChords(state){
    return state.moduleChords
}

export function getSongsLocalSettings(state){
    return state.songsLocalSettings
}

export function getSlideTemplates(state){
    return state.slideTemplates
}