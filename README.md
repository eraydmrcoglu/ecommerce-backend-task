# E-Commerce Backend API (NestJS)

Bu proje, NestJS ve TypeScript kullanılarak geliştirilmiş bir **E-Ticaret Backend API** uygulamasıdır.  
Uygulama; kullanıcı kimlik doğrulama, ürün yönetimi, sepet işlemleri ve sipariş oluşturma akışlarını kapsar.

Proje, modüler mimari, DTO tabanlı validation, ORM kullanımı ve Swagger (OpenAPI) dokümantasyonu prensiplerine uygun şekilde geliştirilmiştir.

## Projenin Amacı

Bu projenin amacı, modern backend geliştirme yaklaşımlarını kullanarak:
- Temiz ve sürdürülebilir bir API mimarisi kurmak
- Type-safe ORM ile veritabanı işlemlerini yönetmek
- Gerçek bir e-ticaret senaryosunun temel akışlarını (ürün, sepet, sipariş) gerçekleştirmektir

## Kullanılan Teknolojiler

- ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white) – Backend framework  
- ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) – Tip güvenliği  
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL%20(Neon)-4169E1?style=flat&logo=postgresql&logoColor=white) – Cloud PostgreSQL(Neon Database)
- ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white) – Veritabanı erişimi  
- ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) – Authentication  
- ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black) – API dokümantasyonu  

---

## Projeyi Çalıştırma

### Gereksinimler

- Node.js (v18 veya üzeri)
- PostgreSQL
- npm veya yarn

### Projenin Klonlama

```bash
git clone https://github.com/eraydmrcoglu/ecommerce-backend-task.git
cd ecommerce-backend-task
npm install
```

### Ortam Değişkenleri

Proje kök dizininde `.env` dosyası oluşturulmalıdır:

```bash
DATABASE_URL="postgresql://neondb_owner:npg_dbELT0O1Qsjz@ep-cool-term-ahhjhsrs-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
PORT=3000
NODE_ENV=development
JWT_SECRET=super-secret-key-123
JWT_EXPIRES_IN=1d
```

### Prisma Kurulumu ve Migration

```bash
npx prisma generate
npx prisma migrate dev
```

### Uygulamayı Çalıştırma 

```bash
npm run start:dev
```

Uygulama şu adreste çalışır: http://localhost:3000 <br/>
Swagger API dokümantasyonu: http://localhost:3000/api

---

## API Endpointleri

### Auth Modülü

| Method | Endpoint        | Açıklama                | Body (JSON) |
|------|-----------------|-------------------------|------------|
| POST | `/auth/register` | Kullanıcı kaydı         | `{ "email": "string", "password": "string" }` |
| POST | `/auth/login`    | Kullanıcı girişi        | `{ "email": "string", "password": "string" }` |
| GET  | `/auth/me`       | Giriş yapan kullanıcı   | — |

### Products Modülü

| Method | Endpoint            | Açıklama            | Body (JSON) |
|------|---------------------|---------------------|------------|
| GET  | `/products`         | Ürünleri listele    | — |
| GET  | `/products/:id`     | Ürün detayı         | — |
| POST | `/products`         | Ürün oluştur        | `{ "name": "string", "price": "number", "stock": "number" }` |

### Cart Modülü

| Method | Endpoint | Açıklama | Body (JSON) |
|------|---------|----------|------------|
| POST | `/cart` | Yeni sepet oluştur | `{ "userId": "uuid" }` |
| GET | `/cart/:cartId` | Sepeti getir | — |
| POST | `/cart/:cartId/items` | Sepete ürün ekle | `{ "productId": "uuid", "quantity": "number" }` |
| PATCH | `/cart/items/:itemId` | Sepet ürünü güncelle | `{ "quantity": "number" }` |
| DELETE | `/cart/items/:itemId` | Sepetten ürün sil | — |

### Not

- `cartId` → `/cart` endpoint’inden dönen **sepet ID**
- `productId` → `/products` endpoint’inden alınan **ürün ID**
- `itemId` → Sepet içindeki ürünün **CartItem ID**
- Korumalı endpointler için `Authorization: Bearer <JWT>` header’ı eklenmelidir

---

## Varsayımlar

- Her kullanıcıya ait tek bir aktif sepet vardır
- Sepete ürün eklenirken stok kontrolü yapılır
- Sipariş oluşturulduğunda sepet temizlenir
- Rol bazlı yetkilendirme (admin/user) eklenmemiştir

## Hata Yönetimi

Uygulamada karşılaşılabilecek yaygın hata senaryoları ve dönen HTTP cevapları aşağıdaki tabloda özetlenmiştir:

| HTTP Kodu | Hata Mesajı                 | Açıklama |
|----------|-----------------------------|----------|
| 400      | Quantity must be greater than zero | Sepet güncellenirken miktar 0 veya negatif gönderildiğinde |
| 400      | Insufficient stock          | Ürünün stok miktarı istenenden az olduğunda |
| 401      | Unauthorized                | JWT token gönderilmediğinde veya geçersiz olduğunda |
| 404      | User not found              | Kullanıcı bulunamadığında |
| 404      | Product not found           | Ürün ID’si veritabanında bulunamadığında |
| 404      | Cart not found              | Sepet ID’si geçersiz veya sepet oluşturulmamışsa |
| 404      | Cart item not found         | Sepette güncellenmek/silinmek istenen ürün bulunamadığında |
| 404      | Order not found             | Sipariş detayı istenirken geçersiz ID gönderildiğinde |
| 500      | Internal server error       | Beklenmeyen sunucu hatalarında |

Tüm hata cevapları NestJS `HttpException` mekanizması kullanılarak standart bir JSON formatında dönülmektedir.


## Geliştirilebilir Alanlar

- Endpoint’ler için **role-based authorization** eklenebilir.
- Ürün listeleme için **pagination ve filtreleme** yapılabilir.
- Sepet ve sipariş işlemleri **transaction** içerisine alınabilir.
- Unit ve integration testler eklenebilir.
- Refresh token yapısı ile JWT süresi yönetimi geliştirilebilir.

---

## Son Not

Bu proje, temel bir e-ticaret backend mimarisini göstermek amacıyla geliştirilmiştir. Kod yapısı okunabilirlik, modülerlik ve genişletilebilirlik göz önünde bulundurularak tasarlanmıştır.
