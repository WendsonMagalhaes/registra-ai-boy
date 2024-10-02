const express = require('express');
const router = express.Router();
const API_KEY = 'AIzaSyB_rfYHUzFP0hF5dmQPUVxK88BoVF74HJo'; // Substitua 'YOUR_API_KEY' pela sua chave da API

router.get('/', (req, res) => {
    if (req.session.login) {
        res.render('registrados', { login: req.session.login });
    } else {
        res.redirect('/');
    }
});

module.exports = router;

