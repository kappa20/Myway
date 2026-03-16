# ═══════════════════════════════════════════════════════════════════
# VARIABLES TERRAFORM
# ═══════════════════════════════════════════════════════════════════
# Les variables = les paramètres configurables de ton infrastructure.
# C'est comme des variables d'environnement.
# Au lieu d'écrire "eu-west-1" 10 fois dans le code, on le définit UNE FOIS ici.
# Si tu veux changer de région, tu modifies UNE SEULE ligne.

# ─── Région AWS ───────────────────────────────────────────────────
# La région = le datacenter AWS que tu utilises.
# eu-west-1 = Irlande (le plus proche pour l'Afrique du Nord).
variable "aws_region" {
  description = "Région AWS où les ressources seront créées"
  type        = string
  default     = "eu-west-1"
}

# ─── Type d'instance EC2 ──────────────────────────────────────────
# Le type d'instance = la puissance de ta VM (CPU + RAM).
# t3.micro = 1 vCPU + 1 GB RAM → FREE TIER (gratuit 750h/mois pendant 12 mois).
# Si tu veux plus de puissance : t3.small (2GB), t3.medium (4GB) → payant.
variable "instance_type" {
  description = "Type d'instance EC2 (t3.micro est éligible au free tier)"
  type        = string
  default     = "t3.micro"
}

# ─── Nom de la clé SSH ────────────────────────────────────────────
# Le nom qui sera affiché dans la console AWS pour cette clé SSH.
# Ce nom est utilisé dans main.tf pour associer la clé aux VMs.
variable "key_name" {
  description = "Nom de la paire de clés SSH sur AWS"
  type        = string
  default     = "devops-myway-key"
}

# ─── Chemin vers la clé publique SSH ─────────────────────────────
# La clé PUBLIQUE (.pub) est uploadée sur AWS.
# AWS l'utilise pour vérifier ton identité quand tu te connectes en SSH.
# La clé PRIVÉE (sans .pub) reste sur ta machine et ne doit JAMAIS être partagée.
# Génère une clé avec : ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
variable "public_key_path" {
  description = "Chemin vers le fichier de clé SSH publique (.pub)"
  type        = string
  default     = "~/.ssh/id_rsa.pub"
}

# ─── Nom du projet ────────────────────────────────────────────────
# Utilisé pour nommer toutes les ressources AWS (VPC, instances, etc.)
# Ex: project_name = "myway" → VPC s'appellera "myway-vpc", etc.
# Utile pour retrouver facilement tes ressources dans la console AWS.
variable "project_name" {
  description = "Nom du projet (utilisé pour tagger toutes les ressources AWS)"
  type        = string
  default     = "myway"
}
