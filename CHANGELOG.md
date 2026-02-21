# Changelog

---
FR
---

Toutes les modifications notables de Daisynon sont documentées ici.
Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

---

## [1.1.1] - 2026-02-xx

### Ajouté
- Description et texte d'explication du projet et de son utilisation.

---

## [1.1.0] - 2026-02-xx

### Corrigé
- Prise en compte d'exceptions dans le XML, si levelX n'existe pas ou si certains éléments important sont hors bodymatter

---

## [1.0.1] - 2025-xx-xx

### Ajouté
- Génération d'IDs uniques par hash SHA-1 pour chaque élément (ancres stables)
- Sommaire de navigation accessible (`<nav aria-label="Table des matières">`)
- Amélioration de la compatibilité NVDA : `role="main"`, `tabindex="-1"`
- Réécriture des numéros de page : `<pagenum>` → `page X` pour une lecture naturelle par NVDA

### Corrigé
- Affichage des éléments imbriqués (paragraphes, notes, sections)

---

## [1.0.0] - 2025-xx-xx

### Ajouté
- Première version publique
- Lecture des fichiers `.xml` au format DAISY Text (DTBook)
- Conversion dynamique XML → HTML lisible dans Firefox
- Compatible NVDA et lecteurs d'écran
- Fonctionne entièrement hors ligne (fichiers locaux `file://`)

---
EN
---

## [1.1.1] - 2026-02-xx

### Added
- Project description and explanatory text about its usage.

---

## [1.1.0] - 2026-02-xx

### Fixed
- Handling of exceptions in the XML when levelX does not exist or when certain important elements are outside the bodymatter.

---

## [1.0.1] - 2025-xx-xx

### Added
- Generation of unique IDs using SHA-1 hash for each element (stable anchors)
- Accessible navigation table of contents (`<nav aria-label="Table of contents">`)
- Improved NVDA compatibility: `role="main"`, `tabindex="-1"`
- Page number rewriting: `<pagenum>` → `page X` for natural reading by NVDA

### Fixed
- Display of nested elements (paragraphs, notes, sections)

---

## [1.0.0] - 2025-xx-xx

### Added
- First public release
- Reading of `.xml` files in DAISY Text (DTBook) format
- Dynamic XML → HTML conversion readable in Firefox
- Compatible with NVDA and screen readers
- Fully offline operation (local `file://` files)