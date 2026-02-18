# Changelog

Toutes les modifications notables de Daisynon sont documentées ici.
Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

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
