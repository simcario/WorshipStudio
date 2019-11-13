export function destroySession (state) {
    localStorage.setItem('displayName',null);
    localStorage.setItem('organizationName',null);
    localStorage.setItem('organizationID',null);
    //localStorage.setItem('licenseKey',null);
    localStorage.setItem('licenseEmail',null);
    localStorage.setItem('LicenseType',null);
    localStorage.setItem('email',null);
    localStorage.setItem('loggedIn',false);
    localStorage.setItem('licenseName',null);
    localStorage.setItem('validUntil',null);
    state.loggedIn = null;
    state.displayName = '';
    state.organizationName = '';
    //state.licenseKey = '';
    state.organizationID = null;
    state.email = null;
    state.licenseEmail = null;
    state.licenseName = null;
    state.licenseEmail = null;
    state.licenseType = null;
    state.validUntil = null;
}

export function retrieveUser (state, user) {
    state.loggedIn = true;
    state.displayName = user.displayName;
    state.organizationName = user.organizationName;
    state.email = user.email;
    state.organizationID = user.organizationID;
    state.licenseKey = user.licenseKey
    state.licenseName = user.licenseName;
    state.licenseType = user.licenseType;
    state.licenseEmail = user.licenseEmail;
    state.validUntil = user.validUntil;
    state.startModule = user.startModule;
    state.networkEnabled = user.networkEnabled;
}

export function retrieveSettings (state, settings) {
    state.computerName = settings.computerName;
    state.startModule = settings.startModule;
    state.licenseName = settings.licenseName;
    state.licenseType = settings.licenseType;
    state.licenseEmail = settings.licenseEmail;
    state.validUntil = settings.validUntil;
    if(settings.moduleChords){
        state.moduleChords =  JSON.parse(settings.moduleChords)
    }
    

}

export function retrieveMobileSettings (state, settings) {
    state.serverAddress = settings.serverAddress;
    state.mobileFirstConfig = settings.mobileFirstConfig
}

export function retrieveInternetStatus(state, status){
    state.internet = status
}
export function retrieveServerAddress(state, serverAddress){
    state.host = serverAddress
}

export function retrieveLicenseExpired(state, expired){
    state.licenseExpired = expired
}

export function retrieveSongs(state, songs){
    state.songs = JSON.parse(songs)
}
export function retrieveSongList(state, songList){
    state.songList = JSON.parse(songList)
}

export function retrieveSongsLocalSettings (state, settings){
    state.songsLocalSettings = settings
}

export function retrieveSlideTemplates (state, templates){
    state.slideTemplates = templates
}