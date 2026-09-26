# Plan van aanpak

## 1. Aanleiding en doel

Voor de modules Client- en Server Technology en Security for Web Applications bouw ik een geïntegreerde webapplicatie: een persoonlijk portfolio met een realtime gastenboek.

Doel: aantonen dat ik client- en servertechnologie, authenticatie/autorisatie en realtime communicatie kan combineren in één werkende, veilige applicatie.

## 2. Scope

- Portfolio over mezelf
- Contactformulier dat valideert en mailt
- Een interactief gedeelte (gastenboek)
- Meerdere rollen (beheerder, gebruiker)
  - Beveiligde beheeromgeving
- Realtime updates via Server-Sent Events

## 3. Aanpak en werkwijze

Elke feature is compleet (backend, frontend, tests, documentatie) in één pull request, en is na merge zelfstandig demonstreerbaar.
Zodat elke feature makkelijk te scheiden is en onafhankelijk demonstreerbaar is.

De logische volgorde van de features wordt:

- project setup
- portfolio pagina
- contact pagina
- auth/admin systeem
- gastenboek pagina
- realtime updates

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

Planning: iteratief zonder vaste data, wel met een harde deadline van 1 oktober voor het begin van schooljaar 2026-2026. Volgorde en Definition of Done bewaken de voortgang; elke afgeronde feature is inleverbaar tussenresultaat.

## 4. Tooling

| Keuze                              | Reden                                           |
| ---------------------------------- | ----------------------------------------------- |
| Next.js + TypeScript               | front- en backend                               |
| Vitest                             | unit testing                                    |
| Prettier + ESLint + GitHub Actions | basis kwaliteit afgedwongen bij elke push en PR |
| Vercel                             | deployment                                      |

## 5. Definition of Done

- Acceptatiecriteria aantoonbaar gehaald
- Lint, format-check en tests groen (lokaal én CI)
- Documentatiesectie geschreven
- Gemerged naar develop via PR
