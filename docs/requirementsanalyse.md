# Ask me anything

# Requirementsanalyse

Portfolio website met profielpagina, contactpagina en showcase "Ask Me Anything"

Sebastiaan Kolmschate (S1148925)
HBO-ICT, Windesheim
Client- en Server Technology
20-10-2026

## 1. Distributie

| Versie | Datum      | Wijzigingen             | Auteur                |
| ------ | ---------- | ----------------------- | --------------------- |
| 1.0    | 20-10-2026 | Eerste volledige versie | Sebastiaan Kolmschate |

## 2. Inleiding

Het doel van het product is iemand die in mij geïnteresseerd is in contact te brengen met mij, de student-webdeveloper.

Het product is een persoonlijke portfoliowebsite die bestaat uit drie delen:

- UC1 Profielpagina: de bezoeker bekijkt mijn CV.
- UC2 Contactpagina: de bezoeker stuurt mij een bericht via een formulier.
- UC3 t/m UC8 Showcase: bezoekers maken een account aan en loggen in met 2FA. Op de pagina "Ask Me Anything" stellen ingelogde gebruikers vragen en de beheerder beantwoordt ze. Wijzigingen verschijnen live bij iedereen die de pagina open heeft.

Hoofdstuk 3 bevat de requirements, per use case. Hoofdstuk 4 bevat de risk assessment in vier stappen: assets, risico's, schatting en security-maatregelen. In de bijlage staat het verslag van het interview met de opdrachtgever (IV1).

Elk onderdeel heeft een ID: IV (interview), UC (use case), FR (functionele requirement), NFR (niet-functionele requirement), AS (asset), RSK (risico) en SM (security-maatregel). Het functioneel en technisch ontwerp gebruiken dezelfde ID's.

## 3. Requirements

Per requirement staan de bron, het type of de asset, de prioriteit (MoSCoW) en hoe de requirement is getest. De bron is het interview (IV1) of de opdracht van school. De eerste regel van elke tabel is de user story.

In de kolom Testen betekent:

- **Back-end:** een geautomatiseerde test van de server (Vitest).
- **E2e:** een geautomatiseerde test in de browser tegen de echte website (Cypress).
- **Component:** een geautomatiseerde test van één onderdeel van de pagina (Cypress).
- **Handmatig:** met de hand gecontroleerd.

### 3.1 UC1 Bekijken CV (profielpagina)

| #    | Bron              | Beschrijving                                                                                                                     | Asset/Type  | MoSCoW | Testen         |
| ---- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------ | -------------- |
| UC1  | IV1               | Als geïnteresseerde wil ik het CV van de student-webdeveloper bekijken, zodat ik me kan oriënteren voordat ik contact leg        | Functioneel | Must   | E2e            |
| FR1  | Opdracht (school) | De profielpagina toont naam, foto en introductie                                                                                 | Functioneel | Must   | E2e            |
| FR2  | Opdracht (school) | De profielpagina toont skills                                                                                                    | Functioneel | Must   | E2e            |
| FR3  | Opdracht (school) | De profielpagina toont opleidingen                                                                                               | Functioneel | Must   | E2e            |
| FR4  | IV1               | De profielpagina toont projecten, elk met een eigen pagina                                                                       | Functioneel | Should | E2e            |
| NFR1 | IV1               | Profielgegevens zijn niet via de website te beheren                                                                              | Beperking   | Must   | Handmatig      |
| NFR2 | IV1               | Pagina's laden binnen 1 seconde                                                                                                  | Kwaliteit   | Must   | Handmatig      |
| NFR3 | Opdracht (school) | Semantische HTML, mobile first en responsive, op alle pagina's                                                                   | Kwaliteit   | Must   | E2e, component |
| NFR4 | Opdracht (school) | Een privacymelding (GDPR); de keuze wordt bewaard; de melding staat er alleen zolang er geen keuze is; de stijl past bij de site | Beperking   | Must   | E2e, component |

NFR1 is gecontroleerd door na te gaan dat er geen pagina of formulier is waarmee de profielgegevens te wijzigen zijn. De gegevens staan in de code en worden bij het bouwen van de site gecontroleerd. NFR2 is gemeten in de browser, op de productieomgeving.

### 3.2 UC2 Contact opnemen (contactpagina)

| #    | Bron                   | Beschrijving                                                                                         | Asset/Type  | MoSCoW | Testen              |
| ---- | ---------------------- | ---------------------------------------------------------------------------------------------------- | ----------- | ------ | ------------------- |
| UC2  | IV1                    | Als geïnteresseerde wil ik een bericht sturen aan de student-webdeveloper, zodat we in contact komen | Functioneel | Must   | E2e                 |
| FR5  | IV1, Opdracht (school) | Contactformulier met voornaam, achternaam, e-mail, telefoon, onderwerp en bericht                    | AS1         | Must   | Back-end, e2e       |
| FR6  | Opdracht (school)      | Een verstuurd bericht komt als e-mail in de Mailtrap-inbox van de developer                          | AS1         | Must   | Back-end, handmatig |
| FR7  | Opdracht (school)      | Het contactformulier heeft een captcha (een som)                                                     | Functioneel | Must   | Back-end, component |
| FR8  | IV1                    | De bezoeker ziet tijdens het versturen een spinner en daarna een melding of het gelukt is            | Functioneel | Must   | E2e                 |
| NFR5 | Opdracht (school)      | Na succesvol versturen is het formulier leeg                                                         | Beperking   | Must   | E2e, component      |
| NFR6 | Opdracht (school)      | Contactgegevens worden niet opgeslagen                                                               | Beperking   | Must   | Handmatig           |
| NFR7 | Opdracht (school), IV1 | Maximale lengtes, in het formulier én op de server (zie de tabel hieronder)                          | Beperking   | Must   | Back-end, component |

| Veld       | Maximum                     | Veld         | Maximum                   |
| ---------- | --------------------------- | ------------ | ------------------------- |
| Voornaam   | 60                          | Bericht      | 600                       |
| Achternaam | 60                          | Vraag        | 500                       |
| E-mail     | 80 (contact), 254 (account) | Antwoord     | 2000                      |
| Telefoon   | 20                          | Wachtwoord   | minimaal 12, maximaal 128 |
| Onderwerp  | 200                         | Weergavenaam | 50                        |

NFR6 is gecontroleerd in het databaseontwerp: er is geen tabel voor contactberichten. De gegevens gaan alleen mee in de e-mail. De limieten voor het contactformulier komen uit het ontwerp van school; de andere limieten heb ik zelf gekozen.

### 3.3 Showcase UC3 t/m UC8 (accounts en Ask Me Anything)

| #     | Bron                   | Beschrijving                                                                                                                | Asset/Type    | MoSCoW | Testen                   |
| ----- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------- | ------ | ------------------------ |
| UC3   | IV1                    | Als geïnteresseerde wil ik een account aanmaken, zodat ik vragen kan stellen aan de student-webdeveloper                    | Functioneel   | Must   | Back-end                 |
| FR9   | IV1                    | Account aanmaken met e-mailadres, weergavenaam en wachtwoord; het e-mailadres bevestigen met een code per mail              | AS2, AS5      | Must   | Back-end                 |
| UC4   | IV1                    | Als gebruiker wil ik veilig in- en uitloggen, zodat niemand anders onder mijn naam vragen stelt                             | Functioneel   | Must   | E2e                      |
| FR10  | Opdracht (school)      | Inloggen met wachtwoord plus een eenmalige code per mail (2FA)                                                              | AS2, AS3, AS5 | Must   | Back-end, e2e            |
| FR11  | IV1                    | Uitloggen                                                                                                                   | AS3           | Must   | Back-end                 |
| UC5   | IV1                    | Als gebruiker wil ik een vraag stellen aan de student-webdeveloper, zodat ik meer te weten kom over zijn werk               | Functioneel   | Must   | E2e                      |
| FR12  | IV1                    | Een ingelogde gebruiker stelt een vraag                                                                                     | AS4           | Must   | Back-end, e2e            |
| UC6   | IV1                    | Als gebruiker wil ik mijn eigen vraag bewerken of verwijderen, zodat ik een fout kan herstellen                             | Functioneel   | Should | E2e                      |
| FR13  | IV1                    | Een gebruiker bewerkt zijn eigen vraag zolang die onbeantwoord is, en verwijdert zijn eigen vraag                           | AS4           | Should | Back-end, e2e            |
| UC7   | IV1                    | Als beheerder wil ik vragen beantwoorden of verwijderen, zodat de pagina actueel en netjes blijft                           | Functioneel   | Must   | Back-end                 |
| FR14  | IV1                    | De beheerder beantwoordt een vraag (ook een antwoord wijzigen) en verwijdert elke vraag                                     | AS4           | Must   | Back-end, e2e            |
| UC8   | IV1                    | Als bezoeker wil ik nieuwe vragen en antwoorden zien zonder te herladen, zodat ik direct zie wat er verandert               | Functioneel   | Must   | E2e                      |
| FR15  | Opdracht (school), IV1 | Iedereen ziet vragen en antwoorden; nieuwe en gewijzigde vragen verschijnen zonder herladen                                 | AS4           | Must   | Back-end, e2e            |
| FR16  | Opdracht (school)      | Twee rollen met verschillende rechten: gebruiker en beheerder                                                               | AS2, AS3      | Must   | Back-end, e2e            |
| NFR8  | Opdracht (school)      | De back-end is geautomatiseerd getest; externe diensten (mail) worden nagebootst                                            | Kwaliteit     | Must   | Back-end (65 tests)      |
| NFR9  | Opdracht (school)      | De front-end is getest met Cypress: e2e, nagebootste server met vaste testdata, en componenttests                           | Kwaliteit     | Must   | E2e (17), component (10) |
| NFR10 | Opdracht (school)      | Deployment via OTAP: lokaal, automatische controles, staging en productie                                                   | Kwaliteit     | Must   | Handmatig                |
| NFR11 | Opdracht (school)      | Communicatie via HTTPS; de sessiecookie is niet leesbaar voor scripts, gaat alleen via HTTPS en niet mee vanaf andere sites | AS3           | Must   | Back-end, handmatig      |

Over de rollen: een bezoeker (niet ingelogd) kan vragen en antwoorden lezen. Een gebruiker kan daarnaast vragen stellen en zijn eigen vragen beheren. De beheerder kan elke vraag beantwoorden en verwijderen. Het beheerdersaccount wordt niet via de website aangemaakt.

### 3.4 Afwijkingen van het gegeven ontwerp

Op twee punten wijk ik bewust af van het ontwerp van school:

- **Personalia (UC1).** Het wireframe heeft een blok Personalia. Ik toon alleen mijn naam. Wie contact wil, gebruikt het contactformulier. Zo staan er geen extra persoonsgegevens, zoals adres of telefoonnummer, openbaar op de site (dataminimalisatie).
- **Berichtveld (UC2).** Het ontwerp staat een beperkte set opmaak toe in het bericht. Ik sta alleen platte tekst toe: opmaak en links worden geweigerd, in het formulier én op de server. Dat is strenger dan het ontwerp en voorkomt dat er via een bericht code wordt ingevoegd.

## 4. Risk assessment

De risk assessment volgt de vier stappen van school: assets vaststellen, risico's identificeren, risico's schatten en maatregelen kiezen. Het risico is kans maal impact. Voor elk middelmatig of hoog risico is een maatregel gekozen. De risico's verwijzen naar de hoofdstukken van OWASP ASVS.

### 4.1 Stap 1: Assets

| #   | Asset                                                    | Bron          | Use cases   | Maatregelen              |
| --- | -------------------------------------------------------- | ------------- | ----------- | ------------------------ |
| AS1 | Contactgegevens van de bezoeker (naam, e-mail, telefoon) | FR5, FR6      | UC2         | SM1, SM2, SM3, SM5       |
| AS2 | Accountgegevens (e-mailadres, wachtwoord, rol)           | FR9, FR16     | UC3, UC4    | SM2, SM4, SM6, SM7       |
| AS3 | Sessie (inlogcookie)                                     | FR10, FR11    | UC4 t/m UC7 | SM9, SM11, SM12          |
| AS4 | Vragen en antwoorden                                     | FR12 t/m FR15 | UC5 t/m UC8 | SM1, SM3, SM4, SM8, SM10 |
| AS5 | Eenmalige codes (registreren en inloggen)                | FR9, FR10     | UC3, UC4    | SM6                      |

Contactgegevens (AS1) worden niet opgeslagen (NFR6). Het risico op een datalek daarvan is daardoor klein.

### 4.2 Stap 2 en 3: Risico's identificeren en schatten

| #     | ASVS    | Risico                                                                                        | Kans   | Impact | Risico | Maatregel |
| ----- | ------- | --------------------------------------------------------------------------------------------- | ------ | ------ | ------ | --------- |
| RSK1  | V5      | Extreem lange invoer laat de server vastlopen of de database vollopen                         | Hoog   | Groot  | Hoog   | SM1       |
| RSK2  | V5      | Invoer in een onverwacht formaat brengt de server in de war                                   | Hoog   | Groot  | Hoog   | SM2       |
| RSK3  | V5      | Een script in een bericht, vraag of antwoord wordt uitgevoerd bij andere bezoekers (XSS)      | Hoog   | Groot  | Hoog   | SM3       |
| RSK4  | V5      | SQL-injectie via een invoerveld of de URL                                                     | Middel | Groot  | Hoog   | SM4       |
| RSK5  | V2      | Bots versturen spam via het contactformulier                                                  | Hoog   | Middel | Hoog   | SM5       |
| RSK6  | V2      | Een wachtwoord of code wordt geraden, of wachtwoorden lekken uit de database                  | Middel | Groot  | Hoog   | SM6       |
| RSK7  | V2      | Iemand ontdekt welke e-mailadressen een account hebben                                        | Middel | Middel | Middel | SM7       |
| RSK8  | V4      | Een gebruiker wijzigt andermans vraag of doet zich voor als beheerder                         | Hoog   | Groot  | Hoog   | SM8       |
| RSK9  | V3      | Een sessie wordt gestolen of misbruikt vanaf een andere website                               | Middel | Groot  | Hoog   | SM9       |
| RSK10 | V8, V13 | De live-verbinding of de vragenlijst laat privégegevens zien aan wie daar geen recht op heeft | Middel | Middel | Middel | SM10      |
| RSK11 | V9, V14 | Verkeer gaat onversleuteld, of de site wordt in een andere site verstopt (clickjacking)       | Middel | Middel | Middel | SM11      |
| RSK12 | V14     | Geheimen lekken, zijn in alle omgevingen gelijk, of mail mislukt ongemerkt                    | Middel | Groot  | Hoog   | SM12      |

Restrisico: er is geen limiet op het aantal verzoeken per IP-adres. Het aantal pogingen is wel beperkt per inlogcode (vijf) en per som (één).

### 4.3 Stap 4: Security-maatregelen

| #    | Maatregel                                                                                                                                              | Testen              | Status     |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- | ---------- |
| SM1  | Elk veld heeft een maximale lengte, in het formulier én op de server                                                                                   | Back-end, component | Uitgevoerd |
| SM2  | Elk verzoek wordt gecontroleerd tegen vaste regels; afwijkende invoer wordt geweigerd                                                                  | Back-end            | Uitgevoerd |
| SM3  | Berichten zijn alleen platte tekst, en de site toont invoer altijd als tekst, nooit als code                                                           | Back-end, component | Uitgevoerd |
| SM4  | De database krijgt invoer alleen als losse waarde, nooit als deel van de query                                                                         | Back-end            | Uitgevoerd |
| SM5  | Een som als captcha, ondertekend door de server, 10 minuten geldig en één keer te gebruiken                                                            | Back-end, e2e       | Uitgevoerd |
| SM6  | Wachtwoorden versleuteld opgeslagen (bcrypt); inlogcodes 5 minuten geldig, één keer bruikbaar, na 5 foute pogingen ongeldig                            | Back-end            | Uitgevoerd |
| SM7  | Bij een bekend en een onbekend e-mailadres geeft de server hetzelfde antwoord, even snel                                                               | Back-end, e2e       | Uitgevoerd |
| SM8  | De server haalt de gebruiker en zijn rol uit de sessie en controleert bij elke actie of die mag                                                        | Back-end, e2e       | Uitgevoerd |
| SM9  | De sessie is een ondertekend token in een cookie die scripts niet kunnen lezen, alleen via HTTPS gaat en niet meegaat vanaf andere sites; 1 dag geldig | Back-end            | Uitgevoerd |
| SM10 | De live-verbinding stuurt alleen een seintje, geen inhoud; elke bezoeker haalt de pagina zelf op met zijn eigen rechten                                | Back-end, e2e       | Uitgevoerd |
| SM11 | Security headers dwingen HTTPS af en verbieden insluiten in een andere site; de server vertelt niet welk framework hij gebruikt                        | Handmatig           | Uitgevoerd |
| SM12 | Geheimen staan alleen in omgevingsvariabelen, per omgeving verschillend; mislukt de mail in productie, dan geeft de server een fout                    | Back-end            | Uitgevoerd |

Hoe de tests de maatregelen aantonen, staat in het technisch ontwerp, hoofdstuk 7.

## Bijlage: Verslag interview opdrachtgever (IV1)

| Onderdeel     | Gegevens                                          |
| ------------- | ------------------------------------------------- |
| Opdrachtgever | Sebastiaan Kolmschate (eigenaar van de website)   |
| Notulist      | Sebastiaan Kolmschate                             |
| Aanwezigen    | Sebastiaan Kolmschate                             |
| Onderwerp     | Requirements voor de portfoliowebsite en showcase |
| Datum         | TODO: datum invullen                              |
| Locatie       | TODO: locatie invullen                            |

In dit project ben ik zowel opdrachtgever (eigenaar van de site) als developer. Dit gesprek is de basis voor de requirements.

**Profielpagina.** De opdrachtgever wil een website waarop bedrijven kunnen zien wat hij als developer kan. De site lijkt op een CV: een foto, een korte introductie, skills, opleidingen en projecten. Elk project krijgt een eigen pagina. De gegevens veranderen weinig, dus een beheerpagina is niet nodig. Een pagina moet binnen één seconde laden. Er komen zo weinig mogelijk persoonsgegevens op de site: alleen zijn naam. Contact loopt via het formulier.

**Contactpagina.** Een geïnteresseerde moet een bericht kunnen sturen, met zijn voornaam, achternaam, e-mailadres en telefoonnummer. De opdrachtgever wil daarvan een e-mail ontvangen; voor nu is het genoeg als die in Mailtrap staat. Hij wil geen spam en geen opmaak of links in berichten. De bezoeker moet zien dat het bericht wordt verstuurd en of het gelukt is.

**Ask Me Anything.** Als extra wil de opdrachtgever een pagina waar bezoekers hem vragen kunnen stellen over zijn werk. Alleen iemand met een account kan een vraag stellen. Bij registratie bevestigt de gebruiker zijn e-mailadres, en inloggen gebeurt met wachtwoord en een code per mail. Een gebruiker mag zijn eigen vraag aanpassen zolang die niet beantwoord is, en mag hem verwijderen. Alleen de opdrachtgever beantwoordt vragen en kan elke vraag verwijderen. Iedereen kan de vragen en antwoorden lezen, ook zonder account. Nieuwe vragen en antwoorden verschijnen zonder te herladen. E-mailadressen van gebruikers zijn nooit zichtbaar, alleen de weergavenaam.
