// auth.js
const { google } = require('googleapis');

async function getAuthSheets(id) {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({
    version: 'v4',
    auth: client,
  });

  const spreadsheetId = id;//'1xjlkqRENrP1Hphs3W9Gb8Pi6kHriaSX05V6LbdLlxmM';

  return {
    auth,
    client,
    googleSheets,
    spreadsheetId,
  };
}


module.exports = { getAuthSheets };
