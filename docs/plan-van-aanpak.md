# Ask me anything

# Plan van aanpak

Portfolio website met profielpagina, contactpagina en showcase "Ask Me Anything"

Sebastiaan Kolmschate (S1148925)
HBO-ICT, Windesheim
Client- en Server Technology
19-10-2026

## 1. Aanleiding en doel

Voor de modules Client- en Server Technology en Security for Web Applications bouw ik een geïntegreerde webapplicatie: een persoonlijk portfolio met een "Ask Me Anything"-pagina waar bezoekers met een account vragen stellen die ik live beantwoord.

Doel: aantonen dat ik client- en servertechnologie, authenticatie/autorisatie en realtime communicatie kan combineren in één werkende, veilige applicatie.

## 2. Scope

- Portfolio over mezelf
- Contactformulier dat valideert en mailt
- Een interactief gedeelte (Ask Me Anything)
- Accounts met tweestapsverificatie (wachtwoord en een code per mail)
- Meerdere rollen (gebruiker, beheerder)
  - Alleen de beheerder beantwoordt vragen
- Realtime updates via Server-Sent Events
- Front-end getest met Cypress

## 3. Aanpak en werkwijze

Elke feature is compleet (backend, frontend, tests, documentatie) in één pull request, en is na merge zelfstandig demonstreerbaar.
Zodat elke feature makkelijk te scheiden is en onafhankelijk demonstreerbaar is.

De logische volgorde van de features wordt:

- project setup
- portfolio pagina
- contact pagina
- gastenboek pagina (later vervangen door Ask Me Anything)
- accounts met 2FA en Ask Me Anything
- realtime updates
- Cypress-tests en deployment

Per feature bouwen we het volgens de volgende werkwijze:

- Acceptatiecriteria uit het ticket scherp krijgen
- Feature-branch vanaf develop
- Code development
- Documentatie up-to-date houden
- PR, mergen alleen bij groene CI

Git "niveau's":

1. `main` = opleverbaar, alleen via PR met groene checks.
2. `develop` = integratie.
3. Feature-branches per ticket.

Planning: iteratief zonder vaste data, met het aftekenmoment op 20 oktober 2026 als harde deadline. Volgorde en Definition of Done bewaken de voortgang; elke afgeronde feature is inleverbaar tussenresultaat.

## 4. Tooling

| Keuze                              | Reden                                           |
| ---------------------------------- | ----------------------------------------------- |
| Next.js + TypeScript               | front- en backend                               |
| PostgreSQL + Prisma                | accounts en vragen opslaan                      |
| Vitest                             | backend testing                                 |
| Cypress                            | frontend testing                                |
| Prettier + ESLint + GitHub Actions | basis kwaliteit afgedwongen bij elke push en PR |
| Mailtrap                           | mail versturen zonder echte inboxen             |
| Railway                            | deployment (staging en productie)               |

## 5. Definition of Done

- Acceptatiecriteria aantoonbaar gehaald
- Lint, format-check en tests groen (lokaal én CI)
- Documentatiesectie geschreven
- Gemerged naar develop via PR
