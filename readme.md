# ACME Explorer API
## Team members:
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
- `GET   /managers/{id}/trips`
- `GET   /managers/{id}/applications`
- `GET   /explorers/{id}/applications`
- `GET   /sponsors/{id}/sponsorships`


### trips
- `POST    /trips`
- `POST    /trips/{id}/applications`
- `GET     /trips ?keyword ?minPrice ?maxPrice ?minDate ?maxDate`
- `GET     /trips/{id}`
- `GET     /trips/{id}/applications`
- `PATCH   /trips/{id}/publish`
- `PATCH   /trips/{id}/cancel`
- `PATCH   /trips/{id}/sponsor`
- `PUT     /trips/{id}`
- `DELETE  /trips/{id}`


### sponsorships
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


### onfig
- `GET   /config`
- `PUT   /config`

 
 ## UML Class Diagram
 [UML Class Diagram PDF file](./docs/acme-explorer-model.pdf)
