
```
.
├── .github/workflows/cicd.yml          ← Pipeline complet (MODIFIÉ)
├── sonar-project.properties            ← Config SonarCloud         [NOUVEAU]
├── security/
│   ├── trivy/
│   │   ├── .trivy.yml                  ← Config Trivy              [NOUVEAU]
│   │   └── .trivyignore                ← CVEs acceptées            [NOUVEAU]
│   └── zap/
│       └── zap-rules.tsv              ← Règles OWASP ZAP          [NOUVEAU]
└── k8s/
    ├── hpa/
    │   ├── backend-hpa.yml             ← Autoscaling backend       [NOUVEAU]
    │   └── frontend-hpa.yml            ← Autoscaling frontend      [NOUVEAU]
    └── monitoring/
        ├── prometheus.yml              ← Prometheus + RBAC + AlertRules [AMÉLIORÉ]
        └── grafana.yml                 ← Grafana + Dashboard auto   [AMÉLIORÉ]
```

# SETUP GUIDE – Configuration DevSecOps Myway
> **À faire par le propriétaire du repo **  
> Ce fichier ne contient aucune donnée sensible — il peut être commité sur GitHub.

---

## Checklist globale

| # | Tâche | Où | Fait ? |
|---|-------|----|--------|
| 1 | Ajouter les 5 secrets GitHub | GitHub → Settings → Secrets | ☐ |
| 2 | Configurer SonarCloud | sonarcloud.io | ☐ |
| 3 | Mettre à jour `sonar-project.properties` | fichier à la racine du repo | ☐ |
| 4 | Installer metrics-server sur le cluster K8s | SSH → master node | ☐ |
| 5 | Créer le secret Grafana sur K8s | SSH → master node | ☐ |
| 6 | Déployer monitoring + HPA | SSH → master node | ☐ |
| 7 | Faire un push sur `main` pour déclencher le pipeline | GitHub | ☐ |

---

## 1️ Secrets GitHub à ajouter

**Aller sur :**
```
GitHub repo → Settings → Secrets and variables → Actions → New repository secret
```

Ajouter ces 5 secrets **un par un** :

| Nom du secret | Valeur à mettre | Comment l'obtenir |
|---------------|-----------------|-------------------|
| `DOCKERHUB_USERNAME` | Ton username DockerHub | Ton compte DockerHub |
| `DOCKERHUB_TOKEN` | Token d'accès DockerHub | DockerHub → Account Settings → Security → New Access Token |
| `SONAR_TOKEN` | Token SonarCloud | Voir section 2 ci-dessous |
| `SSH_PRIVATE_KEY` | Contenu complet du fichier `.pem` | Ton fichier `.pem` AWS (copier TOUT le contenu, incluant `-----BEGIN RSA PRIVATE KEY-----`) |
| `MASTER_IP` | IP publique du master K8s | Console AWS → EC2 → ton instance master → Public IPv4 |

> **IMPORTANT :** Ces valeurs ne doivent JAMAIS être commitées dans le code.  
> Elles sont stockées uniquement dans GitHub Secrets, c'est sécurisé.

---

## 2️ Configuration SonarCloud

### Étape 1 — Créer le projet
```
1. Aller sur https://sonarcloud.io
2. Se connecter avec ton compte GitHub (kappa20)
3. Cliquer "+" en haut à droite → "Analyze new project"
4. Sélectionner le repo "Myway"
5. Cliquer "Set Up" → choisir "With GitHub Actions"
```

### Étape 2 — Récupérer les clés
Sur la page de configuration SonarCloud, noter :
```
Organization Key  → ex: kappa20
Project Key       → ex: kappa20_Myway
```

### Étape 3 — Mettre à jour sonar-project.properties
Ouvrir le fichier `sonar-project.properties` à la racine du repo et remplacer :
```properties
sonar.projectKey=<REMPLACER_PAR_TON_PROJECT_KEY>
sonar.organization=<REMPLACER_PAR_TON_ORGANIZATION_KEY>
```

### Étape 4 — Générer le SONAR_TOKEN
```
sonarcloud.io → cliquer sur ton avatar (en haut à droite)
→ My Account
→ onglet "Security"
→ Generate Token → donner le nom : "github-actions-myway"
→ COPIER le token affiché (il ne sera affiché qu'une seule fois !)
```

### Étape 5 — Ajouter le token dans GitHub Secrets
```
GitHub repo → Settings → Secrets and variables → Actions
→ New repository secret
→ Name  : SONAR_TOKEN
→ Value : coller le token copié à l'étape 4
```

---

## 3️ Configuration sur le cluster Kubernetes (via SSH)

Se connecter sur le **master node** via SSH :
```bash
ssh -i <ton-fichier.pem> ec2-user@<MASTER_IP>
```

### Étape 1 — Installer metrics-server (obligatoire pour HPA)
```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# Attendre 1 minute puis vérifier :
kubectl get deployment metrics-server -n kube-system
# Doit afficher : READY 1/1
```

### Étape 2 — Créer le namespace si pas encore fait
```bash
kubectl apply -f /tmp/k8s-myway/namespace.yml
# ou directement :
kubectl create namespace myway --dry-run=client -o yaml | kubectl apply -f -
```

### Étape 3 — Créer le secret Grafana
```bash
# Remplacer 'TON_MOT_DE_PASSE' par un vrai mot de passe fort
kubectl create secret generic grafana-secret \
  --from-literal=admin-password='TON_MOT_DE_PASSE' \
  -n myway

# Vérifier :
kubectl get secret grafana-secret -n myway
# Doit afficher : grafana-secret   Opaque   1
```

> Note le mot de passe quelque part — il sera nécessaire pour se connecter à Grafana.

### Étape 4 — Déployer le monitoring et le HPA
```bash
# Cloner ou mettre à jour le repo sur le master
cd /tmp
git clone https://github.com/kappa20/Myway.git k8s-myway
cd k8s-myway

# Déployer Prometheus (avec règles d'alerte)
kubectl apply -f k8s/monitoring/prometheus.yml

# Déployer Grafana (avec dashboard automatique)
kubectl apply -f k8s/monitoring/grafana.yml

# Déployer l'autoscaling (HPA)
kubectl apply -f k8s/hpa/backend-hpa.yml
kubectl apply -f k8s/hpa/frontend-hpa.yml
```

### Étape 5 — Vérifier que tout tourne
```bash
# Voir tous les pods
kubectl get pods -n myway

# Voir le HPA (autoscaling)
kubectl get hpa -n myway

# Voir les services et leurs ports
kubectl get svc -n myway
```

### Étape 6 — Accéder aux dashboards
```
Prometheus : http://<MASTER_IP>:30090
Grafana    : http://<MASTER_IP>:30030
             login    : admin
             password : TON_MOT_DE_PASSE (défini à l'étape 3)
```

---

## 4️ Déclencher le pipeline

Une fois toutes les étapes ci-dessus terminées, faire un push sur `main` :
```bash
git add .
git commit -m "feat: add DevSecOps pipeline improvements"
git push origin main
```

Le pipeline se lance automatiquement sur :
```
GitHub repo → Actions → "Myway DevSecOps Pipeline"
```

Les 6 jobs doivent s'exécuter dans l'ordre :
```
Tests → SonarCloud → Docker Build → Trivy → ZAP → Deploy
```

---

## En cas de problème

| Problème | Solution |
|----------|----------|
| Job SonarCloud échoue avec "Invalid token" | Vérifier que SONAR_TOKEN est bien dans GitHub Secrets |
| Job Deploy échoue avec "Permission denied" | Vérifier que SSH_PRIVATE_KEY contient bien TOUT le contenu du .pem |
| HPA affiche `<unknown>` pour CPU | metrics-server pas installé → refaire l'étape 3.1 |
| Grafana inaccessible | Vérifier `kubectl get pods -n myway` → pod grafana doit être Running |
| Trivy bloque le pipeline | Des vulnérabilités CRITICAL ont été trouvées → voir les logs du job pour les détails |
