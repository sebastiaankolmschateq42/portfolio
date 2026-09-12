# Functioneel ontwerp

**Modules:** Client- en Server Technology, Security for Web Applications
**Auteur:** Sebastiaan Kolmschate

## 1. Inleiding

> TODO (eigen woorden): aanleiding, concept (Engelstalig portfolio met projecten +
> realtime gastenboek met moderatie), taalkeuze (site Engels voor internationale
> zichtbaarheid, documentatie Nederlands), esthetiek (minimalistisch, papier-look,
> EB Garamond via next/font — selfhosted, geen extern request).

## 2. Rollen en requirements

### 2.1 Rollen (RBAC)

| Rol                | Rechten                                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Bezoeker (anoniem) | Portfolio en projecten bekijken, contactformulier versturen, gastenboekbericht indienen, goedgekeurde berichten lezen (realtime) |
| Beheerder          | Inloggen/uitloggen, alle gastenboekberichten inzien, goedkeuren, verwijderen                                                     |

### 2.2 Functionele requirements

#### FR-PORT: Portfolio (F1)

- **FR-PORT-01**: De homepagina toont bio, vaardigheden en een projectoverzicht, chronologisch gesorteerd met het nieuwste project eerst.
- **FR-PORT-02**: Elk project heeft een detailpagina met titel, externe links, afbeeldingen en beschrijving.
- **FR-PORT-03**: Statische content staat in een TypeScript-bestand en wordt bij import gevalideerd met een Zod-schema.
- **FR-PORT-04**: De gebruiker kan navigeren tussen pagina's via een navigatiebalk die zich
bovenaan de pagina bevindt.

### 2.3 Niet-functionele requirements

- **NFR-PERF-01**: De portfolio-pagina's worden statisch gegenereerd
- **NFR-TEST-01**: Backend-logica wordt getest met Vitest; externe services worden gemockt.

## 3. Use cases

### UC1 — Portfolio en projecten bekijken (F1)

- **Actor**: Bezoeker (anoniem)
- **Preconditie**: Geen

**Hoofdscenario:**

1. Bezoeker opent een pagina.
2. Bovenaan de pagina bevindt zich een navigatiebalk met links naar de homepagina, de contactpagina en de gastenboekpagina.
3. Als de gebruiker op een link in de navigatiebalk klikt, wordt de gebruiker doorgestuurd naar de pagina die de link bevat.

**Alternatief scenario:**

- 3a. Bezoeker opent een URL met een onbekende slug: systeem toont de 404-pagina.
- 3b. De navigatiebalk toont zich nog steeds en werkt nog steeds.

**Acceptatiecriteria:**

- Alle content komt uit een gevalideerde TypeScript-bestand; niets is hardcoded in JSX.

### UC2 — Portfolio en projecten bekijken (F1)

- **Actor**: Bezoeker (anoniem)
- **Preconditie**: Geen

**Hoofdscenario:**

1. Bezoeker opent de homepagina.
2. Systeem toont bio, vaardigheden en het projectoverzicht (nieuwste eerst).
3. Bezoeker klikt op een projecttitel.
4. Systeem toont de detailpagina: titel, links, afbeeldingen, beschrijving.

**Alternatief scenario:**

- 3a. Bezoeker opent een URL met een onbekende slug: systeem toont de 404-pagina.

**Acceptatiecriteria:**

- Alle content komt uit het gevalideerde TS-bestand; niets is hardcoded in JSX.
- Pagina's zijn responsive.
- Detailpagina's worden statisch gegenereerd (zichtbaar in de build-output).