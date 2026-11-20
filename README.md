# Mijn Routine

Een kindvriendelijke PWA waarmee kinderen zelfstandig door hun ochtend- of avondroutine gaan. Eén taak tegelijk, grote knoppen, vrolijke iconen en een kleine beloning als een taak klaar is.

Geen account, geen backend: taken en voortgang worden lokaal op het apparaat opgeslagen.

## Functies

- **Overzicht per routine** – kies bijvoorbeeld Ochtend of Avond en zie direct wat er nog moet gebeuren.
- **Eén-taak-focus** – een taak opent schermvullend met een groot icoon, de taaktitel en een grote **Klaar!**-knop.
- **Optionele timer** – per taak instelbaar, met aftellen, pauzeren en opnieuw starten.
- **Beloning** – confetti en een ster of beker als een taak (of de hele routine) klaar is.
- **Voortgang per dag** – vinkjes worden per dag bewaard en resetten automatisch de volgende dag.
- **Instellingen zonder pincode** – routines, taken, emoji's en timers zijn direct aanpasbaar.
- **PWA** – installeerbaar op telefoon en tablet, met offline ondersteuning via een service worker.
- **Privacyvriendelijk** – alles blijft in `localStorage` op het apparaat.

## Snel starten

Vereisten: Node.js 20.19+ of 22.12+ (bijv. Node 22 LTS).

```bash
npm install
npm run dev
```

Open de URL die Vite toont (standaard `http://localhost:5173`).

Productiebuild en lokaal testen:

```bash
npm run build
npm run preview
```

## Implementatie op GitHub Pages

Deze repository staat op [github.com/jeroen-org/kidsroutine](https://github.com/jeroen-org/kidsroutine) en gebruikt GitHub Actions voor GitHub Pages.

De workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) bouwt de app en publiceert de inhoud van `dist/` naar [https://jeroen-org.github.io/kidsroutine/](https://jeroen-org.github.io/kidsroutine/).

1. Ga naar **Settings → Pages**.
2. Kies bij **Source** voor **GitHub Actions**.
3. Push naar `main` of start de workflow handmatig via **Actions → Deploy to GitHub Pages**.

De Vite-`base` staat op `./`. Daardoor werken de assets en het manifest zowel in een projectmap (`/kidsroutine/`) als op een eigen domein. Voor GitHub Pages hoef je de repositorynaam dus niet in de configuratie te zetten.

Een alternatief is zelf bouwen en de map `dist/` uploaden naar een statische host.

## De app installeren

- **Android / Chrome:** open het browsermenu en kies **App installeren** of **Toevoegen aan startscherm**.
- **iPhone / iPad / Safari:** tik op het deel-icoon en kies **Zet op beginscherm**.
- **Desktop:** gebruik het installatie-icoon in de adresbalk of het browsermenu.

In de app staat onder **Instellingen → App & installatie** ook een installatieknop of uitleg.

De app werkt offline nadat de service worker de bestanden heeft gecachet. De eerste keer heb je dus nog een internetverbinding nodig.

## Gegevens en privacy

Alle routines, taken en voortgang worden opgeslagen onder de key `mijn-routine:v1` in `localStorage`. Er worden geen gegevens naar een server verstuurd.

- **Voortgang van vandaag wissen:** Instellingen → Voortgang → Opnieuw.
- **Alles terugzetten:** Instellingen → Standaardwaarden herstellen.
- **Browsergegevens wissen:** via de browserinstellingen; daarna maakt de app weer de standaardroutines aan.

## Aanpassen

- **Standaardroutines en taken:** [`src/data.ts`](src/data.ts).
- **Kleurenpalet voor taken:** `TASK_PALETTE` in [`src/data.ts`](src/data.ts).
- **Emoji-keuze in de instellingen:** `EMOJI_CHOICES` in [`src/data.ts`](src/data.ts).
- **Appnaam, icoon en kleuren:** [`vite.config.ts`](vite.config.ts) (manifest) en [`index.html`](index.html) (titel en meta).
- **Iconen opnieuw genereren:** `npm run icons` (gebruikt `sharp` en `scripts/generate-icons.mjs`).

## Projectstructuur

```text
.
├── public/                  # statische bestanden en PWA-iconen
├── scripts/
│   └── generate-icons.mjs   # genereert de PNG-iconen uit een SVG-ontwerp
├── src/
│   ├── components/          # schermen, formulieren en dialogen
│   ├── App.tsx              # schermkeuze en state
│   ├── data.ts              # standaardroutines, kleuren en emoji's
│   ├── hooks.ts             # installatieprompt, online-status en datum
│   ├── storage.ts           # laden, opslaan en saneren van localStorage
│   ├── types.ts             # gedeelde types
│   └── utils.ts             # datum-, emoji- en hulpfuncties
├── vite.config.ts           # Vite, Tailwind en PWA-configuratie
└── .github/workflows/
    └── deploy.yml           # build en deploy naar GitHub Pages
```

## Technische stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- `vite-plugin-pwa` (Workbox)
- `canvas-confetti` voor de beloningsanimatie
- `lucide-react` voor iconen
- Fredoka (lokaal meegebundeld via Fontsource) voor de kindvriendelijke typografie

## Problemen oplossen

- **Lege pagina op GitHub Pages:** controleer of de workflow is geslaagd en of de `dist/`-map is gepubliceerd. Door de relatieve `base` zou dit normaal niet door de repositorynaam moeten komen.
- **PWA niet installeerbaar:** de app moet via HTTPS of `localhost` worden geopend. Op iOS Safari is installeren alleen via **Zet op beginscherm** mogelijk.
- **Oude versie na deploy:** de service worker werkt met `autoUpdate`. Sluit de app volledig af en open hem opnieuw; harde verversing kan ook helpen.
- **Voortgang verdwenen:** controleer of de browser geen sitegegevens wist en of de app niet in een privévenster of incognitomodus staat.