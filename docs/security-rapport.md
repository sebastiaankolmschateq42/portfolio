# Security-rapport

**Module:** Security for Web Applications
**Auteur:** Sebastiaan Kolmschate

Opzet: maatregelen gegroepeerd naar OWASP ASVS-hoofdstukken. Dit rapport groeit per
feature mee; per iteratie wordt beschreven welke risico's erbij komen en hoe ze zijn
gemitigeerd.

## 1. Aanpak

## 2. Huidige status

De portfolio-kant is volledig statisch: geen gebruikersinvoer, geen server-logica, geen
opslag, geen sessies. Het aanvalsoppervlak is daarmee minimaal.

- Content is type-gevalideerd bij build (Zod) ; een contentfout breekt de build
  en bereikt nooit de bezoeker.
- Externe links op projectpagina's openen met `rel="noopener noreferrer"`.

Voor dit stadium zijn er nog weinig aanvallen mogelijk en staat de website ook niet in productie.

- .env-bestanden staan buiten git; .env.example bevat uitsluitend variabelnamen.
