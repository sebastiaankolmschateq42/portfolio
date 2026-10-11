# Functioneel ontwerp

**Modules:** Client- en Server Technology, Security for Web Applications
**Auteur:** Sebastiaan Kolmschate

## 1. Inleiding

Mijn portfolio website wordt een simpel portfolio website met een gastenboek waar bezoekers
mijn projecten kunnen bekijken, contact met mij kunnen opnemen en in mijn gastenboek kunnen
schrijven om te delen hoe ik ben. Met ik, die als beheerder die gastenboek kan beheren, zodat er geen schadelijk materiaal de wereld in geslingerd kan worden.

Ik hou van less is more, dus de website zal minimalistisch zijn en in klassieke stijl. De site wordt
in het Engels geschreven voor internationale zichtbaarheid.

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
- **FR-PORT-04**: De gebruiker kan navigeren tussen pagina's via een navigatiebalk die zich
  bovenaan de pagina bevindt.

#### FR-CON: Contactpagina (F2)

- **FR-CON-01**: De contactpagina toont een een formulier met velden voor email, onderwerp en bericht en een knop om het formulier te versturen.
- **FR-CON-02**: De pagina toont een bericht dat het bericht probeert te worden verstuurd.
- **FR-CON-03**: De pagina toont een foutmelding als de gebruiker het formulier niet correct invult.
- **FR-CON-04**: De pagina toont een foutmelding als het bericht niet kan worden verstuurd.
- **FR-CON-05**: Een bericht wordt gemaild naar de inbox van de beheerder van de website

### 2.3 Niet-functionele requirements

- **NFR-PERF-01**: De portfolio-pagina's worden statisch gegenereerd
- **NFR-VAL-02**: Verstuurde data wordt gevalideerd

## 3. Use cases

### UC1 — Navigeren door de site (F1)

- **Actor**: Bezoeker (anoniem)
- **Preconditie**: Geen

**Hoofdscenario:**

1. Bezoeker opent een pagina.
2. Bovenaan de pagina bevindt zich een navigatiebalk met links naar de homepagina, de contactpagina en de gastenboekpagina.
3. Als de gebruiker op een link in de navigatiebalk klikt, wordt de gebruiker doorgestuurd naar de pagina die de link bevat.

**Alternatief scenario:**

- 3a. Bezoeker opent een URL met een onbekende slug: systeem toont de 404-pagina.
- 3b. De navigatiebalk toont zich nog steeds en werkt nog steeds.

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

### UC3 — Contactpagina gebruiken (F2)

- **Actor**: Bezoeker (anoniem)
- **Preconditie**: Geen

**Hoofdscenario:**

1. Bezoeker opent de contactpagina.
2. Systeem toont een formulier met velden voor email, onderwerp en bericht.
3. Bezoeker vult het formulier in en verstuurt het.
4. De verstuur knop toont dat het bericht probeert te worden verstuurd.
5. De pagina toont een tekst dat het bericht is verstuurd.

**Alternatief scenario:**

- 3a. Bezoeker vult het formulier in met een ongeldige email: de pagina toont een foutmelding.
- 3b. Bezoeker vult het formulier in met een ongeldig onderwerp: de pagina toont een foutmelding.
- 3c. Bezoeker vult het formulier in met een ongeldig bericht: de pagina toont een foutmelding.

- 4a. Het bericht wordt niet verstuurd: de pagina toont een foutmelding.
- 4b. De verstuur knop is klikbaar, de gebruiker kan nog een poging doen om het bericht te versturen.
- ga verder met scenario 4

**Acceptatiecriteria:**

- Het formulier wordt gevalideerd.
- Het bericht wordt verstuurd naar de mailbox van de beheerder van de website.
