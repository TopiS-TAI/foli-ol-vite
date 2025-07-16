# Fölin reittivertailusovellus
## OpenLayers + Vite

Sovelluksen tarkoitus on mahdollistaa Turun seudun Föli-käyttäjille seuraavat toiminnot:
- Käyttäjä voi valita kartalta useita pisteitä
- Sovellus näyttää valittujen pisteiden lähimmät pysäkit
- Sovellus näyttää pysäkkejä käyttävät Föli-reitit

Nice-to-havet:
- Aikataulujen huomioiminen

## Teknologiat

### Vite
https://vite.dev/

### Ol-NPM-kirjasto
https://www.npmjs.com/package/ol

### Ol-Vite -startteri:

    npx create-ol-app my-app --template vite

Kehityspalvelimen käynnistäminen:

    npm start

Tuotantokääntö:

    npm run build

Komento kääntää sovelluksen kansioon `dist`.
