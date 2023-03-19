# ACME Explorer API

## Team members

- Jorge Andrea Molina
- Juan Carlos Cortés Muñoz
- Carlos Núñez Arenas

## API endpoints

BASE_ENDPOINT: `/api/v1`

### actors

- `POST  /actors`
- `GET   /actors`
- `GET   /actors/{id}`
- `PUT   /actors/{id}`
- `PATCH /actors/{id}/ban`
- `PATCH /actors/{id}/unban`

### trips

- `GET     /trips`
- `POST    /trips`
- `POST    /trips/{id}/applications`
- `GET     /search ?keyword ?minPrice ?maxPrice ?minDate ?maxDate`
- `GET     /trips/{id}`
- `GET     /trips/{id}/applications`
- `PATCH   /trips/{id}/publish`
- `PATCH   /trips/{id}/cancel`
- `PUT     /trips/{id}`
- `DELETE  /trips/{id}`

### sponsorships

- `GET     /sponsorships`
- `POST    /sponsorships`
- `GET     /sponsorships/{id}`
- `PUT     /sponsorships/{id}`
- `PATCH   /sponsorships/{id}/pay`
- `DELETE  /sponsorships/{id}`

### applications

- `GET   /applications`
- `GET   /applications/{id}`
- `PATCH /applications/{id}/accept`
- `PATCH /applications/{id}/reject`
- `PATCH /applications/{id}/cancel`
- `PATCH /applications/{id}/pay`
- `PATCH /applications/{id}/comment`

### finder

- `GET   /finders/{explorerId}`
- `PUT   /finders/{explorerId}`

### dashboard

- `POST  /dashboard/spent-money-by-explorer`
- `POST  /dashboard/explorers-by-spent-money`
- `GET   /dashboard`
- `GET   /dashboard/latest`
- `PATCH /dashboard/rebuild-period`

### config

- `GET   /config`
- `PUT   /config`

## UML Class Diagram

[UML Class Diagram PDF file](./docs/acme-explorer-model.pdf)

## Tests de carga

[Diagnóstico](./gatling/diagnosis.md)
