# Structure

Apart from the shared library, all of the projects follow a similar structure. In short:

- The page components follow a nested folder structure that represents the actual route paths, i.e. `app/ => app/page/ => app/page/nested-page/`, etc.
- All components used within a page are kept in a `shared` folder, i.e. for `page/` we use `page/shared/`
  - Shared components that are used by multiple pages operating on the same context level or path, are placed in their respective `shared` folder up in the structure
  - The same rules for folder nesting are applied to components within `shared`
- The data model is kept in `model` folders
- The state management and API calls are residing in `data-access` folders. They are placed in the root or within their given context
- `api` folders represent the API layer where the actual requests are performed and the data is mapped to the local model

## Mocked API-s

As stated in the main README, the templates are operating with mocked API data. This can be disabled from the respective `app.config.ts`-s. This way, the template will perform network calls to your specified API URL set in `environment/`. Note that API-s already have a predefined design that can be explored both at the API layers or the mocks. Your API should follow that design or, alternatively, update the template API layer so that it suits your specific needs.
