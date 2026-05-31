# 🚀 EventZone – Rezervační systém pro kulturní akce

Webová aplikace postavená na architektuře **MVC** (Model-View-Controller) v prostředí **Node.js / Express**, která slouží ke správě a rezervaci kulturních, sportovních a společenských akcí. Projekt plně splňuje požadavky pro týmovou práci (3 členové) včetně implementace 4 databázových modelů a 3 uživatelských rolí.

---

## 🛠️ Použité technologie
* **Backend:** Node.js, Express.js
* **Databáze:** MongoDB (Mongoose ODM)
* **Frontend:** EJS (Embedded JavaScript templates), custom dark-mode CSS
* **Autentizace & Bezpečnost:** Express-Session, bcryptjs
* **Ostatní knihovny:** Multer (upload obrázků/plakátů)

---

## 🔑 Klíčové vlastnosti & Role v systému
Aplikace striktně rozlišuje **3 uživatelské role**:
1. **User (Běžný uživatel):** Může si prohlížet dostupné akce, zobrazovat detaily a přihlašovat/odhlašovat se z nich (Attendance).
2. **Organizátor (Správce):** Má kompletní práva (CRUD) nad akcemi (včetně nahrávání plakátů) a místy konání.
3. **Admin (Administrátor):** Má všechna práva organizátora + exkluzivní přístup do **Admin Panelu**, kde může dynamicky měnit systémové role ostatním uživatelům.

---

## 🚀 Návod ke spuštění (Instalace)

Níže je popsán postup pro lokální zprovoznění aplikace po stažení z GitHubu.

### 1. Klonování repozitáře a instalace závislostí
Otevřete terminál v adresáři, kam chcete projekt umístit, a spusťte:
```bash
# Klonování projektu
git clone <URL_VÁŠHO_REPOZITÁŘE>

# Přesun do složky projektu
cd pws_project_mvc

# Instalace potřebných balíčků (stáhne node_modules)
npm install