require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

const CUSTOM_OBJECT_TYPE = '2-205881454'; // sostituirai questo con il tuo Object Type ID reale (Fase 10)

const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  'Content-Type': 'application/json',
};

app.get('/', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=name,ingredienti,prezzo`;
  try {
    const resp = await axios.get(url, { headers });
    const pizze = resp.data.results;
    res.render('homepage', { title: 'Custom Object Table', pizze: pizze });
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).send('Errore nel recupero dei dati da HubSpot. Controlla il token e il CUSTOM_OBJECT_TYPE.');
  }
});

app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

app.post('/update-cobj', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
  const data = {
    properties: {
      name: req.body.name,
      ingredienti: req.body.ingredienti,
      prezzo: req.body.prezzo,
    },
  };
  try {
    await axios.post(url, data, { headers });
    res.redirect('/');
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).send('Errore nella creazione del record su HubSpot.');
  }
});

app.listen(PORT, () => {
  console.log(`App in ascolto su http://localhost:${PORT}`);
});
