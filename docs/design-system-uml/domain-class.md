# UML - Domain Class Dynamic LMS

```mermaid
classDiagram
  class ModuleRegistry {
    +resource
    +route
    +menuMeta
    +crudConfig
  }

  class Role {
    +id
    +name
  }

  class Permission {
    +code
    +resource
    +action
  }

  class RolePermission {
    +roleId
    +permissionCode
  }

  class AppSetting {
    +key
    +value
  }

  class FormSchema {
    +fields[]
    +layout[]
  }

  class TableSchema {
    +columns[]
    +filters[]
  }

  ModuleRegistry --> FormSchema
  ModuleRegistry --> TableSchema
  Role "1" --> "*" RolePermission
  Permission "1" --> "*" RolePermission
```
