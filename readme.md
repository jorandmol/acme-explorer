# ACME Explorer API

## Team members

- Jorge Andrea Molina
- Juan Carlos Cortés Muñoz
- Carlos Núñez Arenas

## API endpoints

BASE_ENDPOINT: `/api/v2`

### actors

- `GET     /actors`
- `POST    /actors`
- `GET     /actors/{id}`
- `PUT     /actors/{id}`
- `DELETE  /actors/{id}`
- `PATCH   /actors/{id}/ban`
- `PATCH   /actors/{id}/unban`
- `POST    /login`

### trips

- `GET     /trips`
- `POST    /trips`
- `GET     /search ?keyword ?minPrice ?maxPrice ?minDate ?maxDate`
- `GET     /trips/{id}`
- `PUT     /trips/{id}`
- `DELETE  /trips/{id}`
- `GET     /trips/{id}/applications`
- `POST    /trips/{id}/applications`
- `PATCH   /trips/{id}/publish`
- `PATCH   /trips/{id}/cancel`

### sponsorships

- `GET     /sponsorships`
- `POST    /sponsorships`
- `GET     /sponsorships/{id}`
- `PUT     /sponsorships/{id}`
- `DELETE  /sponsorships/{id}`
- `PATCH   /sponsorships/{id}/pay`

### applications

- `GET   /applications`
- `POST  /applications`
- `GET   /applications/{id}`
- `PATCH /applications/{id}/accept`
- `PATCH /applications/{id}/reject`
- `PATCH /applications/{id}/cancel`
- `PATCH /applications/{id}/pay`
- `PATCH /applications/{id}/comment`

### dashboard

- `GET   /dashboard`
- `GET   /dashboard/latest`
- `PATCH /dashboard/rebuild-period`
- `POST  /dashboard/explorers-by-spent-money`
- `POST  /dashboard/spent-money-by-explorer`

### config

- `GET   /config`
- `PUT   /config`

### data loader

- `POST   /loader/insertMany ?model ?sourceFile `

## UML Class Diagram

[UML Class Diagram PDF file](./docs/acme-explorer-model.pdf)

## Tests de carga

[Diagnóstico](./gatling/diagnosis.md)
