🧩 components/

Tous les composants UI réutilisables (Button, Modal, etc.)
Chacun dans son propre dossier, avec ses styles, tests, variantes.

⸻

🗺️ pages/

Chaque vue principale de l’app (Home, Login, etc.)
Elle assemble les composants, sans logique métier lourde.

⸻

⚙️ hooks/

Mes custom hooks (useAuth, useForm, etc.) vivent ici.
Ça garde mes composants plus simples et plus lisibles sans logique complexe.

⸻

🔌 services/

Tous les appels API centralisés ici.
Pas de fetch() sauvage dans les composants.

⸻

🌐 contexts/

Pour le state global (auth, thème, panier…).
Utilisé quand c’est vraiment utile.

⸻

🧠 utils/

Fonctions utilitaires (formatage, validation, etc.)
Ça évite les copier coller dans plusieurs fichiers.

⸻

🏷️ types/

Mes types TypeScript centralisés ici. Grâce à ça, l’IA comprends mieux mon code.

⸻

🧾 constants/

Couleurs, messages, rôles…
Fini les chaînes de caractères magiques dans le code.
