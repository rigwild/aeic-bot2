# Table des matières
 - [Tutoriel](#tutoriel)
 - [Liste des commandes](#liste-des-commandes)
   - [`!afficherDevoir`](#afficherDevoir)
   - [`!afficherPlanning`](#afficherPlanning)
   - [`!aide`](#aide)
   - [`!ajouterDevoir`](#ajouterDevoir)
   - [`!ajouterDevoirTd`](#ajouterDevoirTd)
   - [`!choisirGroupeAnnee`](#choisirGroupeAnnee)
   - [`!choisirGroupeAsso`](#choisirGroupeAsso)
   - [`!choisirGroupeTp`](#choisirGroupeTp)
   - [`!trouverPersonne`](#trouverPersonne)

---

## Tutoriel
Pour lancer une commande, votre message doit commencer par `!`, suivi d'une commande existante.

Une commande peut nécessiter des arguments. Si un seul est nécessaire, vous pouvez taper votre commande suivie par l'argument à renseigner :
```sh
!unExemple monArgument
!unExemple ceci compte comme un seul argument
```

Dans le cas ou plusieurs arguments sont nécessaires, vous pouvez les séparer à l'aide de `--` :
```sh
!unExemple ceci compte comme un seul argument -- celui-ci est le deuxième argument
```

Les commandes et leurs arguments ne sont pas sensibles à la casse, les commandes suivantes provoqueront le même résultat :
```sh
!unExemple
!UnexEmpLe
```

## Liste des commandes
### `!afficherDevoir`
#### Description
Afficher les devoirs d'un groupe de TP

#### Arguments
| Minimum | Maximum |
| :-----: |  :----: |
| 0 | 0 |

#### Exemple(s)
```
!afficherDevoir
```

---

### `!afficherPlanning`
#### Description
Afficher le planning d'un groupe. Voir : <a href="https://planning-iut-calais.asauvage.fr" target="_blank" rel="noopener">https://planning-iut-calais.asauvage.fr</a>

#### Arguments
| Minimum | Maximum |
| :-----: |  :----: |
| 0 | 1 |

#### Exemple(s)
```
!afficherPlanning
```
```
!afficherPlanning tp1a
```
```
!afficherPlanning DUT1 TPA
```
```
!afficherPlanning DUT2 TD2
```
```
!afficherPlanning Apprentis info S4
```

---

### `!aide`
#### Description
Montrer le message d'aide du bot

#### Arguments
| Minimum | Maximum |
| :-----: |  :----: |
| 0 | 0 |

#### Exemple(s)
```
!aide
```

---

### `!ajouterDevoir`
#### Description
Ajouter un devoir à un groupe de TP

#### Arguments
| Minimum | Maximum |
| :-----: |  :----: |
| 3 | 3 |

#### Exemple(s)
```
!ajouterDevoir 2020-04-24 -- Java -- TP Breakout
```
```
!ajouterDevoir 2020-01-18 -- Maths -- DS Ould-Said
```

---

### `!ajouterDevoirTd`
#### Description
Ajouter un devoir à un groupe de TD

#### Arguments
| Minimum | Maximum |
| :-----: |  :----: |
| 5 | 5 |

#### Exemple(s)
```
!ajouterDevoirTd td1 -- dut1 -- 2020-04-24 -- Java -- TP Breakout
```
```
!ajouterDevoirTd td1 -- dut2 -- 2020-01-18 -- Maths -- DS Ould-Said
```

---

### `!choisirGroupeAnnee`
#### Description
Choisir le groupe d'année à rejoindre

#### Arguments
| Minimum | Maximum |
| :-----: |  :----: |
| 1 | 1 |

#### Exemple(s)
```
!choisirGroupeAnnee 1ère année
```
```
!choisirGroupeAnnee 1ere annee
```
```
!choisirGroupeAnnee 2ème année FI
```
```
!choisirGroupeAnnee 2ème année APP
```
```
!choisirGroupeAnnee 2eme annee app
```

---

### `!choisirGroupeAsso`
#### Description
Choisir le groupe d'association à rejoindre

#### Arguments
| Minimum | Maximum |
| :-----: |  :----: |
| 1 | 1 |

#### Exemple(s)
```
!choisirGroupeAsso asso1
```
```
!choisirGroupeAsso asso2
```

---

### `!choisirGroupeTp`
#### Description
Choisir le groupe de TP à rejoindre

#### Arguments
| Minimum | Maximum |
| :-----: |  :----: |
| 1 | 1 |

#### Exemple(s)
```
!choisirGroupeTp tp1a
```
```
!choisirGroupeTp tp2b
```

---

### `!trouverPersonne`
#### Description
Trouver un utilisateur sur eXo Platform et afficher ses données

#### Arguments
| Minimum | Maximum |
| :-----: |  :----: |
| 1 | 1 |

#### Exemple(s)
```
!trouverPersonne synave
```
```
!trouverPersonne antoine sauvage
```
```
!trouverPersonne contact@asauvage.fr
```
```
!trouverPersonne act@asauvage.f
```
```
!trouverPersonne ^antoine
```
```
!trouverPersonne @gmail.com
```
