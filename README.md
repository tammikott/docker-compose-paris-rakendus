# Docker Compose TODO Rakendus - otammik

## Mida tegin:
- Lõin 4-konteinerset TODO rakendust
- Teenused mida kasutasin: Nginx, React frontend, Node.js API, PostgreSQL
- Kõik konteinerid käivituvad ühe käsuga: `docker compose up --build`
- Rakendus töötab port 8000 peal
- Andmed jäävad püsima andmebaasi volum-es'isse

## Mida õppisin:
- Multi-container arhitektuur - iga teenus oma konteineris
- Docker Compose DNS - konteinerid suhtlevad nimede kaudu
- Nginx reverse proxy seadistamine
- Multi-stage Docker build'id vähendavad image suurust
- Terve rakenduse käivitamine ühe käsuga
