export default {
  firstConfig:localStorage.getItem('firstConfig') || false,
  computerName: localStorage.getItem('computerName') || 'Computer Name',
  startModule: localStorage.getItem('startModule') || 'Chords',
  licenseKey: localStorage.getItem('licenseKey') || '8f34040046be6c8b46171fda6de1a6d0c9fd9c5bce8f3261531fdb11c125eb7fZelCSMrQ1ZOJW2NI1XPjNTSiFzNfrXTHWFhG09i2DYRYhpgEiqBe0euxCdARV8iO',
  licenseName: localStorage.getItem('licenseName') || 'User',
  licenseEmail: localStorage.getItem('licenseEmail') || 'demo@worshipstudio.app',
  licenseType: localStorage.getItem('licenseType') || 'Demo',
  validUntil: localStorage.getItem('validUntil') || '2025-12-31',
  licenseExpired: localStorage.getItem('licenseExpired') || true,
  displayName: localStorage.getItem('displayName') || 'Demo User',
  organizationName: localStorage.getItem('organizationName') || 'Demo Organization',
  organizationID: localStorage.getItem('organizationID') || 'rdHA04vE7IYc0vYtYb6b',
  email: localStorage.getItem('email') || null,
  loggedIn: localStorage.getItem('loggedIn') || false,
  networkEnabled: localStorage.getItem('networkEnabled') || false,
  mobileFirstConfig:localStorage.getItem('mobileFirstConfig') || false,
  internet: localStorage.getItem('internet') || 'offline',

  moduleChords: JSON.parse(localStorage.getItem('moduleChords')) || null,

  songsLocalSettings: JSON.parse(localStorage.getItem('songsLocalSettings')) || {},

  slideTemplates: JSON.parse(localStorage.getItem('slideTemplates')) || {},

  padLibrary: JSON.parse(localStorage.getItem('padLibrary')) || {},
}
