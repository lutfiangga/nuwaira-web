# UML - Sequence Dynamic CRUD Rendering

```mermaid
sequenceDiagram
  participant L as Panel Layout
  participant R as RBAC Service
  participant D as DB
  participant P as Panel Page
  participant F as Form Builder
  participant T as Table Builder

  L->>R: getVisiblePanelMenus(accessProfile)
  R->>D: select active panel_module ordered by sort_order
  D-->>R: module rows + menu permission code
  R-->>L: filtered menus by granted permission

  P->>F: render form schema (module forms/*)
  P->>T: render table schema (module columns)
```
