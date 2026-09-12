# Technisch ontwerp

**Modules:** Client- en Server Technology, Security for Web Applications
**Auteur:** Sebastiaan Kolmschate

## 1. Architectuur en stack

| Keuze                   | Rol                                     | Motivatie                                                             |
| ----------------------- | --------------------------------------- | --------------------------------------------------------------------- |
| Next.js 16 App Router   | Framework: client, server en API-routes | Eén type-veilige codebase voor front- en backend                      |
| TypeScript              | Taal                                    | Type-veiligheid, fouten bij compile-time in plaats van runtime        |
| Bun                     | Package manager                         | Snel, moderne lockfile                                                |
| Tailwind CSS 4          | Styling                                 | Snel itereren, geen losse stylesheets per component                   |
| Zod                     | Validatie (content, straks formulieren) | Eén schema als bron van waarheid, client- én server-side herbruikbaar |
| Vitest                  | Tests                                   | Snel, TypeScript out-of-the-box, mocking van externe services         |
| EB Garamond (next/font) | Typografie                              | Selfhosted bij build: geen extern request, geen layout shift          |
| Vercel                  | Deployment                              | Naadloze Next.js-integratie, previews per branch                      |

## 2. Projectstructuur

```
app/            → pagina's en layout (App Router)
  components/   → gedeelde UI-componenten (Navigation)
  projects/     → dynamische projectroute [slug]
lib/            → content- en datalaag (content.ts: schema's + gevalideerde content)
docs/           → projectdocumentatie
public/img/     → projectafbeeldingen
tests/          → Vitest-tests
```

## 3. Domeinmodel

Versie F1 — groeit per feature.

```
Portfolio
├── bio: string
├── skills: string[]
└── projects: Project[]
      ├── slug, title, date, summary
      ├── description: string[]
      ├── images: { src, alt }[]
      └── links: { label, url }[]
```

## 4. Rendering- en buildstrategie

- Portfolio-pagina's zijn volledig statisch: de homepagina en alle projectdetailpagina's
  worden bij build gegenereerd.
- Content wordt bij import gevalideerd: ongeldige content breekt
  de build in plaats van de bezoekerservaring.

## 5. Testplan

- Huidig: contentvalidatie-test (schema accepteert de echte content), smoke-test. Worden met
  CI/CD gevalideerd en de build breekt bij een fout.
- Wordt per feature uitgebreid; externe services worden gemockt.

## 6. CI/CD

- GitHub Actions bij elke push naar main/develop en elke PR: install (frozen lockfile),
  lint, format-check, tests.
- Branchstrategie: feature-branch → PR naar develop (merge alleen bij groene CI) →
  develop naar main via PR bij milestones.
