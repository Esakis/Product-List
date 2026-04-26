<div align="center">

# 🛒 Product-List

**Product catalog with a real-time list.**
ASP.NET Core 8 · Angular 18 · MSSQL · SignalR

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-18-DD0031?logo=angular&logoColor=white)
![MSSQL](https://img.shields.io/badge/MSSQL-LocalDB-CC2927?logo=microsoftsqlserver&logoColor=white)
![SignalR](https://img.shields.io/badge/SignalR-realtime-2C3E50)
![Tests](https://img.shields.io/badge/tests-96%20passing-brightgreen)

</div>

---

## ⚡ Quick start

> 💡 **Recommended on Windows — one click and you're done.**

```cmd
product-list.bat
```

The launcher:

- ✅ installs `dotnet-ef` if missing
- ✅ runs `npm install` if `node_modules` is empty
- ✅ opens **two terminals** — backend + frontend
- ✅ creates and seeds the database on first run

| Service       | URL                                                   |
| ------------- | ----------------------------------------------------- |
| 🌐 Frontend   | <http://localhost:4200>                               |
| 🔌 Backend    | <http://localhost:5271>                               |
| 📘 Swagger UI | <http://localhost:5271/swagger>                       |

---

## 🛠️ Manual run

```bash
# backend
cd backend/ProductList.Api && dotnet run

# frontend
cd frontend && npm install && npm start
```

---

## 🧱 Stack

| Layer    | Tech                                                          |
| -------- | ------------------------------------------------------------- |
| Backend  | ASP.NET Core 8 · EF Core · FluentValidation · SignalR         |
| Frontend | Angular 18 (standalone, signals) · RxJS · SignalR client      |
| Database | MSSQL via `(localdb)\MSSQLLocalDB`, code-first migrations     |
| Tests    | xUnit + FluentAssertions + NSubstitute · Karma + Jasmine      |

---

## 🔗 API

| Method | Route                                          | Purpose                |
| ------ | ---------------------------------------------- | ---------------------- |
| `GET`  | `/products`                                    | Full list              |
| `GET`  | `/products/search?code=&name=&page=&pageSize=` | Filter + paginate      |
| `POST` | `/products`                                    | Create a product       |

**Product model**

```jsonc
{ "id": 1, "code": "PRD-001", "name": "Whole Bean Coffee", "price": 49.99 }
```

**SignalR** — hub `/hubs/products` broadcasts `productAdded` to every connected client → list updates live in every open tab.

---

## 🧪 Tests

```bash
# backend
cd backend && dotnet test

# frontend
cd frontend && npx ng test --watch=false --browsers=ChromeHeadless
```
