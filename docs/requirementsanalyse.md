# Requirementsanalyse

Portfoliowebsite met profielpagina, contactpagina en showcase "Ask Me Anything"

Modules: Client- en Server Technology, Security for Web Applications
Auteur: Sebastiaan Kolmschate

## 1. Distributie

| Versie | Datum      | Wijzigingen             | Auteur                |
| ------ | ---------- | ----------------------- | --------------------- |
| 1.0    | 19-10-2026 | Eerste volledige versie | Sebastiaan Kolmschate |

## 2. Inleiding

Het doel van het product is het verbinden van een geïnteresseerde en de student-webdeveloper.

Het product is een persoonlijke portfoliowebsite. Het bestaat uit drie delen:

- UC1 Profielpagina: de geïnteresseerde bekijkt het CV van de student-webdeveloper (gegeven door school).
- UC2 Contactpagina: de geïnteresseerde stuurt een bericht via een formulier (gegeven door school).
- Showcase: bezoekers maken een account aan en loggen in met 2FA. Op de pagina "Ask Me Anything" stellen ingelogde gebruikers vragen. De beheerder beantwoordt ze. Wijzigingen verschijnen live bij iedereen die de pagina open heeft (UC3 t/m UC8).

Dit document is als volgt opgebouwd. Hoofdstuk 3 bevat de requirements, per use case gegroepeerd. Hoofdstuk 4 bevat de risk assessment in vier stappen: assets, risico's, schatting en security-maatregelen. In de bijlage staat het verslag van het interview met de opdrachtgever (IV1). Alle requirements zijn daarop of op de opdracht van school terug te voeren.

Voor de navolgbaarheid krijgt elk onderdeel een ID: IV (interview), UC (use case), FR (functionele requirement), NFR (niet-functionele requirement), AS (asset), RSK (risico) en SM (security-maatregel). Het Functioneel Ontwerp en het Technisch Ontwerp gebruiken dezelfde ID's.

## 3. Requirements

Per requirement staat de bron, het type of de asset, de prioriteit (MoSCoW) en de test die aantoont dat de requirement is gehaald. De bron is IV1 (het interview) of "Opdracht (school)" (de requirements die school voorschrijft). De eerste regel van elke tabel is de user story.

Bij Testen verwijst "Vitest" naar een bestand in `tests/` en "Cypress" naar een bestand in `cypress/e2e/` of `cypress/component/`. "Handmatig" betekent dat de requirement met de hand is gecontroleerd.

### 3.1 UC1 Bekijken CV (profielpagina)

| #    | Bron              | Beschrijving                                                                                                                               | Asset/Type  | MoSCoW | Testen                                       |
| ---- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------- | ------ | -------------------------------------------- |
| UC1  | IV1               | Als geïnteresseerde wil ik het CV van de student-webdeveloper kunnen bekijken, zodat ik me kan oriënteren voordat ik contact leg           | Functioneel | Must   | Cypress: profile.cy.ts                       |
| FR1  | Opdracht (school) | De profielpagina toont naam, foto en introductie                                                                                           | Functioneel | Must   | Cypress: profile.cy.ts                       |
| FR2  | Opdracht (school) | De profielpagina toont skills                                                                                                              | Functioneel | Must   | Cypress: profile.cy.ts                       |
| FR3  | Opdracht (school) | De profielpagina toont opleidingen                                                                                                         | Functioneel | Must   | Cypress: profile.cy.ts                       |
| FR4  | IV1               | De profielpagina toont projecten, elk met een detailpagina                                                                                 | Functioneel | Should | Cypress: profile.cy.ts                       |
| NFR1 | IV1               | Profielgegevens zijn niet via de website te beheren                                                                                        | Beperking   | Must   | Handmatig                                    |
| NFR2 | IV1               | Pagina's laden binnen 1 seconde                                                                                                            | Kwaliteit   | Must   | Handmatig                                    |
| NFR3 | Opdracht (school) | Semantische HTML, mobile first en responsive (geldt voor alle pagina's)                                                                    | Kwaliteit   | Must   | Cypress: profile.cy.ts, Field.cy.tsx         |
| NFR4 | Opdracht (school) | GDPR-melding; de keuze wordt opgeslagen in localStorage; de melding is alleen zichtbaar zolang er geen keuze is; de stijl past bij de site | Beperking   | Must   | Cypress: ConsentBanner.cy.tsx, profile.cy.ts |

NFR1 is gecontroleerd door na te gaan dat er geen route of formulier is om profielgegevens te wijzigen. De inhoud staat in een TypeScript-bestand en wordt bij het laden gecontroleerd met een Zod-schema. NFR2 is gemeten met de netwerktab van de browser op de productieomgeving.

### 3.2 UC2 Contact opnemen (contactpagina)

| #    | Bron                   | Beschrijving                                                                                                                                                                                                       | Asset/Type  | MoSCoW | Testen                                                                |
| ---- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- | ------ | --------------------------------------------------------------------- |
| UC2  | IV1                    | Als geïnteresseerde wil ik een bericht kunnen sturen aan de student-webdeveloper, zodat ik in contact kan komen met de student-webdeveloper                                                                        | Functioneel | Must   | Cypress: contact.cy.ts                                                |
| FR5  | IV1, Opdracht (school) | Contactformulier met voornaam, achternaam, e-mail, telefoon, onderwerp en bericht                                                                                                                                  | AS1         | Must   | Vitest: contact.test.ts; Cypress: contact.cy.ts                       |
| FR6  | Opdracht (school)      | Een verstuurd bericht komt als e-mail in de Mailtrap-inbox van de developer                                                                                                                                        | AS1         | Must   | Vitest: contact.test.ts, mail.test.ts; Handmatig (Mailtrap)           |
| FR7  | Opdracht (school)      | Het contactformulier heeft een captcha (som)                                                                                                                                                                       | Functioneel | Must   | Vitest: captcha.test.ts, contact.test.ts; Cypress: ContactForm.cy.tsx |
| FR8  | IV1                    | De bezoeker krijgt feedback over het versturen: spinner, daarna flashmelding                                                                                                                                       | Functioneel | Must   | Cypress: contact.cy.ts                                                |
| NFR5 | Opdracht (school)      | Na succesvol versturen is het contactformulier leeg                                                                                                                                                                | Beperking   | Must   | Cypress: contact.cy.ts, ContactForm.cy.tsx                            |
| NFR6 | Opdracht (school)      | Contactgegevens worden niet opgeslagen                                                                                                                                                                             | Beperking   | Must   | Handmatig                                                             |
| NFR7 | Opdracht (school), IV1 | Invoerlimieten, client- én serverside: voornaam 60, achternaam 60, e-mail 80 (contact) of 254 (account), telefoon 20, onderwerp 200, bericht 600, vraag 500, antwoord 2000, wachtwoord 12 tot 128, weergavenaam 50 | Beperking   | Must   | Vitest: contact.test.ts; Cypress: ContactForm.cy.tsx                  |

NFR6 is gecontroleerd in het databaseschema (`prisma/schema.prisma`): daarin staat geen tabel voor contactberichten. De gegevens gaan alleen in de e-mail mee. NFR7 geldt ook voor UC3, UC5 en UC7. De limieten voor het contactformulier komen uit het schoolontwerp. De andere limieten heb ik zelf gekozen.

### 3.3 Showcase UC3 t/m UC8 (accounts en Ask Me Anything)

| #     | Bron                   | Beschrijving                                                                                                            | Asset/Type    | MoSCoW | Testen                                                               |
| ----- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------- | ------ | -------------------------------------------------------------------- |
| UC3   | IV1                    | Als geïnteresseerde wil ik een account kunnen aanmaken, zodat ik vragen kan stellen aan de student-webdeveloper         | Functioneel   | Must   | Vitest: auth-register.test.ts                                        |
| FR9   | IV1                    | Account registreren met e-mailadres, weergavenaam en wachtwoord; e-mailadres bevestigen met een eenmalige code          | AS2, AS5      | Must   | Vitest: auth-register.test.ts, auth-codes.test.ts                    |
| UC4   | IV1                    | Als gebruiker wil ik veilig kunnen inloggen en uitloggen, zodat niemand anders onder mijn naam vragen stelt             | Functioneel   | Must   | Cypress: login.cy.ts                                                 |
| FR10  | Opdracht (school)      | Inloggen met wachtwoord plus een eenmalige e-mailcode (2FA)                                                             | AS2, AS3, AS5 | Must   | Vitest: auth-login.test.ts, auth-codes.test.ts; Cypress: login.cy.ts |
| FR11  | IV1                    | Uitloggen                                                                                                               | AS3           | Must   | Vitest: auth-login.test.ts                                           |
| UC5   | IV1                    | Als gebruiker wil ik een vraag kunnen stellen aan de student-webdeveloper, zodat ik meer te weten kom over zijn werk    | Functioneel   | Must   | Cypress: ask.cy.ts                                                   |
| FR12  | IV1                    | Een ingelogde gebruiker stelt een vraag                                                                                 | AS4           | Must   | Vitest: questions.test.ts; Cypress: ask.cy.ts                        |
| UC6   | IV1                    | Als gebruiker wil ik mijn eigen vraag kunnen bewerken of verwijderen, zodat ik een fout kan herstellen                  | Functioneel   | Should | Cypress: ask.cy.ts                                                   |
| FR13  | IV1                    | Een gebruiker bewerkt zijn eigen vraag zolang die onbeantwoord is, en verwijdert zijn eigen vraag                       | AS4           | Should | Vitest: questions.test.ts; Cypress: ask.cy.ts                        |
| UC7   | IV1                    | Als beheerder wil ik vragen kunnen beantwoorden of verwijderen, zodat de pagina actueel en netjes blijft                | Functioneel   | Must   | Vitest: questions.test.ts                                            |
| FR14  | IV1                    | De beheerder beantwoordt een vraag (ook antwoord wijzigen) en verwijdert elke vraag                                     | AS4           | Must   | Vitest: questions.test.ts; Cypress: ask.cy.ts                        |
| UC8   | IV1                    | Als bezoeker wil ik nieuwe vragen en antwoorden zien zonder de pagina te herladen, zodat ik direct zie wat er verandert | Functioneel   | Must   | Cypress: ask.cy.ts                                                   |
| FR15  | Opdracht (school), IV1 | Iedereen ziet vragen en antwoorden; nieuwe en gewijzigde vragen verschijnen zonder herladen                             | AS4           | Must   | Vitest: realtime.test.ts; Cypress: ask.cy.ts                         |
| FR16  | Opdracht (school)      | Twee rollen met verschillende rechten: gebruiker en beheerder                                                           | AS2, AS3      | Must   | Vitest: questions.test.ts; Cypress: ask.cy.ts                        |
| NFR8  | Opdracht (school)      | Back-end is programmatisch getest (Vitest); externe diensten (mail) worden gemockt                                      | Kwaliteit     | Must   | Vitest: alle 10 bestanden (65 tests)                                 |
| NFR9  | Opdracht (school)      | Front-end is getest met Cypress: e2e, netwerk-stubs met fixtures, componenttests                                        | Kwaliteit     | Must   | Cypress: 17 e2e-tests en 10 componenttests                           |
| NFR10 | Opdracht (school)      | Deployment via OTAP: lokaal, CI (GitHub Actions), staging en productie op Railway                                       | Kwaliteit     | Must   | CI: .github/workflows/ci.yml; Handmatig (Railway)                    |
| NFR11 | Opdracht (school)      | Communicatie via HTTPS; sessiecookie httpOnly, Secure en SameSite=Strict                                                | AS3           | Must   | Vitest: auth-register.test.ts; Handmatig (HTTPS)                     |

Toelichting bij de rollen. Een bezoeker (niet ingelogd) kan vragen en antwoorden lezen. Een gebruiker (rol USER) kan daarnaast vragen stellen en zijn eigen vragen beheren. De beheerder (rol ADMIN) kan elke vraag beantwoorden en verwijderen. Het beheerdersaccount wordt alleen via een seed-script aangemaakt, niet via de website.

### 3.4 Afwijkingen van het gegeven ontwerp

Op twee punten wijk ik bewust af van het ontwerp van school:

- **Personalia (UC1).** Het wireframe van de profielpagina heeft een blok Personalia. Ik toon alleen mijn naam. Wie contact wil, gebruikt het contactformulier. Zo staan er geen extra persoonsgegevens zoals adres of telefoonnummer openbaar op de site (dataminimalisatie).
- **Berichtveld (UC2).** Het ontwerp staat een beperkte set HTML-elementen toe in het bericht (koppen, opsommingen, strong). Ik sta alleen platte tekst toe: HTML en links worden geweigerd, zowel in het formulier als op de server. Dat is strenger dan het ontwerp en sluit scriptinjectie via het bericht helemaal uit.

## 4. Risk assessment

De risk assessment volgt de vier stappen uit de aanpak van school: assets vaststellen, risico's identificeren, risico's schatten en security-maatregelen kiezen. Kans en impact zijn geschat met de factoren van de OWASP Risk Rating Methodology, zonder ze te scoren. Het risico is kans maal impact. Voor elk risico met een middelmatig of hoog risico is een maatregel gekozen. De risico's verwijzen naar de hoofdstukken van OWASP ASVS.

### 4.1 Stap 1: Assets

| #   | Asset                                                    | Bron          | Koppeling   | Security-maatregelen     |
| --- | -------------------------------------------------------- | ------------- | ----------- | ------------------------ |
| AS1 | Contactgegevens van de bezoeker (naam, e-mail, telefoon) | FR5, FR6      | UC2         | SM1, SM2, SM3, SM5       |
| AS2 | Accountgegevens (e-mailadres, wachtwoordhash, rol)       | FR9, FR16     | UC3, UC4    | SM2, SM4, SM6, SM7       |
| AS3 | Sessie (JWT in cookie)                                   | FR10, FR11    | UC4 t/m UC7 | SM9, SM11, SM12          |
| AS4 | Vragen en antwoorden                                     | FR12 t/m FR15 | UC5 t/m UC8 | SM1, SM3, SM4, SM8, SM10 |
| AS5 | Eenmalige codes (registratie en inloggen)                | FR9, FR10     | UC3, UC4    | SM6                      |

AS1 wordt niet opgeslagen (NFR6). Het risico op een datalek van contactgegevens is daardoor klein. De gegevens bestaan alleen in het verzoek en in de e-mail.

### 4.2 Stap 2 en 3: Risico's identificeren en schatten

| #     | ASVS-hoofdstuk | Beschrijving                                                                                                                    | Kans   | Impact | Risico | Maatregel |
| ----- | -------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------ | ------ | ------ | --------- |
| RSK1  | V5             | Lange invoer leidt tot een crash of een volle database                                                                          | Hoog   | Groot  | Hoog   | SM1       |
| RSK2  | V5             | Invoer is invalide doordat data niet strong typed is                                                                            | Hoog   | Groot  | Hoog   | SM2       |
| RSK3  | V5             | Injectie van scripts (XSS) via het contactbericht, een vraag of een antwoord                                                    | Hoog   | Groot  | Hoog   | SM3       |
| RSK4  | V5             | SQL-injectie via invoervelden of de id in de URL                                                                                | Middel | Groot  | Hoog   | SM4       |
| RSK5  | V2             | Bots versturen spam via het contactformulier                                                                                    | Hoog   | Middel | Hoog   | SM5       |
| RSK6  | V2             | Een wachtwoord of eenmalige code wordt geraden, of wachtwoorden lekken uit de database                                          | Middel | Groot  | Hoog   | SM6       |
| RSK7  | V2             | Een aanvaller ontdekt welke e-mailadressen een account hebben (account-enumeratie)                                              | Middel | Middel | Middel | SM7       |
| RSK8  | V4             | Een gebruiker wijzigt of verwijdert andermans vraag, of voert beheerdersacties uit (IDOR, privilege-escalatie, mass assignment) | Hoog   | Groot  | Hoog   | SM8       |
| RSK9  | V3             | Een sessie wordt gestolen of misbruikt via XSS of CSRF                                                                          | Middel | Groot  | Hoog   | SM9       |
| RSK10 | V8, V13        | De realtime-stream of de vragenlijst lekt inhoud of e-mailadressen aan bezoekers zonder rechten                                 | Middel | Middel | Middel | SM10      |
| RSK11 | V9, V14        | Verkeer gaat over HTTP of de site is te misbruiken via clickjacking of MIME-sniffing                                            | Middel | Middel | Middel | SM11      |
| RSK12 | V14            | Geheimen lekken via de repository, zijn gelijk in alle omgevingen, of mail faalt ongemerkt                                      | Middel | Groot  | Hoog   | SM12      |

Restrisico: er is geen rate limiting per IP-adres. Het aantal pogingen is wel beperkt per eenmalige code (vijf) en per captcha-token (één).

### 4.3 Stap 4: Security-maatregelen

| #    | Beschrijving                                                                                                                                                   | Test                                                                                          | Status     |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------- |
| SM1  | Maximale lengtes op alle invoer, client- en serverside (Zod), tegen lange invoer                                                                               | Vitest: contact.test.ts; Cypress: ContactForm.cy.tsx                                          | Uitgevoerd |
| SM2  | Invoer strong typed en gevalideerd met Zod-schema's; ongeldige invoer geeft 400, tegen invalide data                                                           | Vitest: contact.test.ts, auth-register.test.ts, questions.test.ts                             | Uitgevoerd |
| SM3  | Geen HTML of links in het contactbericht; React escapet alle output, tegen XSS                                                                                 | Vitest: contact.test.ts; Cypress: ContactForm.cy.tsx, contact.cy.ts                           | Uitgevoerd |
| SM4  | Database-toegang via Prisma met parameters, tegen SQL-injectie                                                                                                 | Vitest: questions.test.ts (id die geen uuid is geeft 404); Handmatig: code bevat geen raw SQL | Uitgevoerd |
| SM5  | Captcha: som met HMAC-ondertekend token, 10 minuten geldig, één poging per token, tegen bots en spam                                                           | Vitest: captcha.test.ts, contact.test.ts; Cypress: contact.cy.ts                              | Uitgevoerd |
| SM6  | Wachtwoorden met bcrypt (cost 12); codes als HMAC opgeslagen, 5 minuten geldig, max 5 pogingen, eenmalig, tegen raden en datalek                               | Vitest: auth-codes.test.ts, auth-register.test.ts                                             | Uitgevoerd |
| SM7  | Geen account-enumeratie: zelfde antwoord en vergelijkbare tijd (dummy-hash) bij onbekend e-mailadres                                                           | Vitest: auth-login.test.ts, auth-register.test.ts; Cypress: login.cy.ts                       | Uitgevoerd |
| SM8  | Autorisatie in de datalaag: auteur en rol uit de sessie; andermans vraag 403; auteur-id uit body genegeerd, tegen IDOR, privilege-escalatie en mass assignment | Vitest: questions.test.ts; Cypress: ask.cy.ts                                                 | Uitgevoerd |
| SM9  | Sessie als HS256-JWT in httpOnly, Secure, SameSite=Strict cookie, 1 dag geldig, tegen sessiediefstal en CSRF                                                   | Vitest: session.test.ts, auth-register.test.ts, auth-login.test.ts                            | Uitgevoerd |
| SM10 | Realtime-stream stuurt alleen type en id, geen inhoud; pagina wordt per bezoeker opnieuw gerenderd met diens rechten, tegen datalek via de stream              | Vitest: realtime.test.ts, questions.test.ts; Cypress: ask.cy.ts                               | Uitgevoerd |
| SM11 | Security headers: CSP (o.a. frame-ancestors 'none'), HSTS, nosniff, Referrer-Policy; geen x-powered-by                                                         | Handmatig: response-headers van de productieomgeving bekeken                                  | Uitgevoerd |
| SM12 | Geheimen alleen via omgevingsvariabelen, per omgeving verschillend; mail in productie faalt zonder transport                                                   | Vitest: mail.test.ts; Handmatig: .env.example bevat alleen namen                              | Uitgevoerd |

Wat de tests concreet aantonen:

- **SM1 en SM2:** `contact.test.ts` stuurt te lange en ongeldige velden en verwacht een 400 met foutmeldingen per veld. Er wordt dan geen mail verstuurd. `ContactForm.cy.tsx` laat zien dat het formulier een te lang onderwerp al tijdens het typen afwijst.
- **SM3:** `contact.test.ts` verstuurt HTML en een link in het bericht en verwacht een 400. De Cypress-tests controleren dezelfde foutmeldingen in het formulier.
- **SM5:** `captcha.test.ts` test dat het antwoord niet in de vraag of het token staat, dat een token maar één keer werkt (ook na een fout antwoord), na tien minuten verloopt en niet te vervalsen is.
- **SM6:** `auth-codes.test.ts` test dat alleen de hash van een code wordt opgeslagen, dat een code één keer werkt, na vijf foute pogingen blokkeert en na vijf minuten verloopt.
- **SM7:** de tests sturen een onbekend e-mailadres en verwachten hetzelfde antwoord als bij een fout wachtwoord.
- **SM8:** `questions.test.ts` test dat een gebruiker andermans vraag niet kan bewerken of verwijderen (403), geen vragen kan beantwoorden (403) en dat een meegestuurde auteur-id wordt genegeerd.
- **SM9:** `session.test.ts` test dat een aangepast, verlopen of met een ander geheim ondertekend token wordt geweigerd. `auth-register.test.ts` controleert de vlaggen HttpOnly en SameSite=Strict op de cookie. De vlag Secure staat alleen in productie aan, omdat lokaal over HTTP wordt gewerkt.
- **SM10:** `realtime.test.ts` test dat elke wijziging een event geeft en dat het event alleen type en id bevat. `questions.test.ts` test dat de lijst nooit e-mailadressen bevat.
- **SM12:** `mail.test.ts` test dat versturen in productie faalt als er geen mailtransport is ingesteld, zodat inlogcodes niet ongemerkt verdwijnen.

## Bijlage: Verslag interview opdrachtgever (IV1)

| Onderdeel     | Gegevens                                             |
| ------------- | ---------------------------------------------------- |
| Opdrachtgever | Sebastiaan Kolmschate (eigenaar van de website)      |
| Notulist      | Sebastiaan Kolmschate                                |
| Aanwezigen    | Sebastiaan Kolmschate                                |
| Onderwerp     | Verzamelen requirements portfoliowebsite en showcase |
| Datum         | TODO: echte datum invullen                           |
| Locatie       | TODO: locatie invullen                               |

Dit is het verslag van het interview met de opdrachtgever. In dit project ben ik zowel opdrachtgever (eigenaar van de site) als developer. Het gesprek is de basis voor de requirements.

**Profielpagina.** De opdrachtgever wil een website waarop bedrijven kunnen zien wat hij als developer kan. De site lijkt op een CV: een foto, een korte introductie, skills, opleidingen en projecten. Elk project krijgt een eigen pagina met meer uitleg. De gegevens veranderen weinig, dus een beheerpagina is niet nodig. De site moet snel zijn: een pagina laadt binnen één seconde. Hij wil zo weinig mogelijk persoonsgegevens openbaar zetten. Alleen zijn naam staat op de site; contact loopt via het formulier.

**Contactpagina.** Een geïnteresseerde moet een bericht kunnen sturen. Daarbij laat hij zijn voornaam, achternaam, e-mailadres en telefoonnummer achter. De opdrachtgever wil daarvan een e-mail ontvangen. Voor nu is het genoeg als die in Mailtrap te zien is. Hij wil geen spam en geen opmaak of links in berichten. De bezoeker moet zien dat het bericht wordt verstuurd en of dat gelukt is.

**Ask Me Anything.** Als extra wil de opdrachtgever een pagina waar bezoekers hem vragen kunnen stellen over zijn werk. Om misbruik te beperken kan alleen iemand met een account een vraag stellen. Bij registratie bevestigt de gebruiker zijn e-mailadres. Inloggen gebeurt met wachtwoord en een code per e-mail. Een gebruiker mag zijn eigen vraag aanpassen zolang die nog niet beantwoord is, en mag hem verwijderen. Alleen de opdrachtgever beantwoordt vragen en kan elke vraag verwijderen. Iedereen mag de vragen en antwoorden lezen, ook zonder account. Nieuwe vragen en antwoorden moeten verschijnen zonder dat de bezoeker de pagina herlaadt. E-mailadressen van gebruikers zijn nooit zichtbaar; bij een vraag staat alleen de weergavenaam.
