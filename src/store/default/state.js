export default {
  songs:localStorage.getItem('songs') || [],
  songList:localStorage.getItem('songList') || [],
  firstConfig:localStorage.getItem('firstConfig') || false,
  computerName: localStorage.getItem('computerName') || 'Computer Name',
  startModule: localStorage.getItem('startModule') || '',
  licenseKey: localStorage.getItem('licenseKey') || null,
  licenseName: localStorage.getItem('licenseName') || null,
  licenseEmail: localStorage.getItem('licenseEmail') || null,
  licenseType: localStorage.getItem('licenseType') || null,
  validUntil: localStorage.getItem('validUntil') || null,
  licenseExpired: localStorage.getItem('licenseExpired') || true,
  displayName: localStorage.getItem('displayName') || null,
  organizationName: localStorage.getItem('organizationName') || null,
  organizationID: localStorage.getItem('organizationID') || null,
  email: localStorage.getItem('email') || null,
  loggedIn: localStorage.getItem('loggedIn') || false,
  networkEnabled: localStorage.getItem('networkEnabled') || false,
  mobileFirstConfig:localStorage.getItem('mobileFirstConfig') || false,
  internet: localStorage.getItem('internet') || 'offline',

  moduleChords: JSON.parse(localStorage.getItem('moduleChords')) || null,

  songsLocalSettings: JSON.parse(localStorage.getItem('songsLocalSettings')) || {},

  slideTemplates: JSON.parse(localStorage.getItem('slideTemplates')) || {},
}
