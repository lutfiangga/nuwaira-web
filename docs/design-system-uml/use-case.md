# UML - Use Case Dynamic LMS

```mermaid
flowchart LR
  SA[Superadmin] --> UC1((Set Default Register Role))
  SA --> UC2((Manage Role Permission Matrix))
  SA --> UC3((Access Dynamic Panel Menu))

  ADMIN[Admin] --> UC3
  ADMIN --> UC4((CRUD Domain Modules by Permission))

  INS[Instructor] --> UC3
  INS --> UC4

  LEARNER[Learner] --> UC5((Register))
  LEARNER --> UC6((Access Allowed Learning Features))
```
