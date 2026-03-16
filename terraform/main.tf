# ═══════════════════════════════════════════════════════════════════
# TERRAFORM CONFIGURATION
# ═══════════════════════════════════════════════════════════════════
# Ce bloc dit à Terraform : "j'ai besoin du plugin AWS version 5.x"
# Terraform va télécharger ce plugin depuis registry.terraform.io
# C'est comme un package.json en Node.js — on déclare les dépendances
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws" # plugin officiel de Hashicorp pour AWS
      version = "~> 5.0"        # version 5.x (pas 4.x ni 6.x)
    }
  }
}

# ═══════════════════════════════════════════════════════════════════
# PROVIDER AWS
# ═══════════════════════════════════════════════════════════════════
# Le "provider" c'est le connecteur entre Terraform et AWS.
# Il utilise tes credentials AWS CLI (configurés avec 'aws configure')
# pour créer et gérer les ressources sur ton compte AWS.
provider "aws" {
  region = var.aws_region # la valeur vient de variables.tf (eu-west-1)
}

# ═══════════════════════════════════════════════════════════════════
# SSH KEY PAIR
# ═══════════════════════════════════════════════════════════════════
# Une "key pair" SSH sur AWS = paire de clés pour se connecter aux VMs.
# AWS garde la clé PUBLIQUE (.pub), toi tu gardes la clé PRIVÉE.
# Quand tu fais "ssh ec2-user@<IP>", AWS vérifie que ta clé privée
# correspond à la clé publique enregistrée → connexion autorisée.
resource "aws_key_pair" "myway_key" {
  key_name   = var.key_name                # nom de la clé sur AWS ("devops-myway-key")
  public_key = file(var.public_key_path)   # lit le contenu du fichier ssh/myway-key.pub

  tags = {
    Name    = "${var.project_name}-key" # "${var.project_name}" = "myway" → "myway-key"
    Project = var.project_name
  }
}

# ═══════════════════════════════════════════════════════════════════
# VPC (Virtual Private Cloud)
# ═══════════════════════════════════════════════════════════════════
# Un VPC = ton réseau privé isolé dans le cloud AWS.
# C'est comme si tu avais ton propre "switch réseau" dans AWS.
# Toutes tes VMs (EC2) vivront à l'intérieur de ce réseau privé.
# Sans VPC, tes machines ne peuvent pas communiquer entre elles.
resource "aws_vpc" "myway_vpc" {
  cidr_block           = "10.0.0.0/16"  # plage d'IP privées disponibles : 10.0.0.0 → 10.0.255.255
                                          # /16 = 65 536 adresses IP disponibles dans ce réseau
  enable_dns_hostnames = true            # permet de résoudre les noms DNS à l'intérieur du VPC
  enable_dns_support   = true            # active le support DNS dans le VPC

  tags = {
    Name    = "${var.project_name}-vpc"
    Project = var.project_name
  }
}

# ═══════════════════════════════════════════════════════════════════
# SUBNET (Sous-réseau)
# ═══════════════════════════════════════════════════════════════════
# Un subnet = une subdivision du VPC dans une zone géographique précise.
# Ex: le VPC fait 10.0.0.0/16 → le subnet fait 10.0.1.0/24 (256 IPs)
# "map_public_ip_on_launch = true" → chaque VM créée ici reçoit une IP publique automatiquement
# "availability_zone" → zone physique dans la région AWS (eu-west-1a = datacenter A en Irlande)
resource "aws_subnet" "myway_subnet" {
  vpc_id                  = aws_vpc.myway_vpc.id  # rattacher ce subnet à notre VPC
  cidr_block              = "10.0.1.0/24"          # plage d'IP : 10.0.1.0 → 10.0.1.255 (256 IPs)
  map_public_ip_on_launch = true                   # attribuer une IP publique à chaque VM automatiquement
  availability_zone       = "${var.aws_region}a"   # "eu-west-1a" = datacenter A en Irlande

  tags = {
    Name    = "${var.project_name}-subnet"
    Project = var.project_name
  }
}

# ═══════════════════════════════════════════════════════════════════
# INTERNET GATEWAY
# ═══════════════════════════════════════════════════════════════════
# L'Internet Gateway = la "porte" entre ton VPC (réseau privé) et Internet.
# Sans ça, tes VMs peuvent communiquer entre elles mais PAS accéder à Internet.
# Exemple: sans IGW, tu ne peux pas faire "apt install docker" sur tes VMs.
resource "aws_internet_gateway" "myway_igw" {
  vpc_id = aws_vpc.myway_vpc.id  # attacher cette porte à notre VPC

  tags = {
    Name    = "${var.project_name}-igw"
    Project = var.project_name
  }
}

# ═══════════════════════════════════════════════════════════════════
# ROUTE TABLE (Table de routage)
# ═══════════════════════════════════════════════════════════════════
# La route table = le "GPS" du réseau. Elle dit :
# "Tout le trafic vers 0.0.0.0/0 (= tout Internet) → passe par l'Internet Gateway"
# Sans cette règle, même avec un IGW, les paquets ne savent pas où aller.
resource "aws_route_table" "myway_rt" {
  vpc_id = aws_vpc.myway_vpc.id

  route {
    cidr_block = "0.0.0.0/0"                     # pour TOUTE destination (tout Internet)
    gateway_id = aws_internet_gateway.myway_igw.id # → envoyer via l'Internet Gateway
  }

  tags = {
    Name    = "${var.project_name}-rt"
    Project = var.project_name
  }
}

# ═══════════════════════════════════════════════════════════════════
# ROUTE TABLE ASSOCIATION
# ═══════════════════════════════════════════════════════════════════
# Connecter la route table au subnet.
# Sans ça, la route table existe mais n'est appliquée à aucun réseau.
# C'est comme créer un GPS mais ne pas le brancher dans la voiture.
resource "aws_route_table_association" "myway_rta" {
  subnet_id      = aws_subnet.myway_subnet.id  # notre subnet
  route_table_id = aws_route_table.myway_rt.id # notre route table
}

# ═══════════════════════════════════════════════════════════════════
# SECURITY GROUP (Pare-feu)
# ═══════════════════════════════════════════════════════════════════
# Le Security Group = le pare-feu de tes VMs.
# Il définit quels ports sont OUVERTS (ingress = trafic entrant)
# et quels ports sont autorisés en sortie (egress = trafic sortant).
# Par défaut AWS bloque TOUT → on doit explicitement autoriser ce qu'on veut.
resource "aws_security_group" "myway_sg" {
  name        = "${var.project_name}-sg"
  description = "Security group for Myway DevOps infrastructure"
  vpc_id      = aws_vpc.myway_vpc.id

  # ─── TRAFIC ENTRANT (INGRESS) ─────────────────────────────────

  # Port 22 = SSH (connexion à distance à la VM depuis ton terminal)
  # "0.0.0.0/0" = depuis n'importe quelle IP (pour simplifier, sinon mettre ton IP fixe)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH depuis partout"
  }

  # Port 6443 = API Kubernetes (kubectl parle à ce port pour gérer le cluster)
  # kubectl get pods → envoie une requête HTTP sur le port 6443 du master
  ingress {
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Kubernetes API Server"
  }

  # Port 30080 = Myway Frontend (React + Nginx) accessible depuis le navigateur
  # NodePort = port fixe sur chaque noeud Kubernetes qui redirige vers le pod
  # http://<IP_worker>:30080 → pod myway-frontend → Nginx → React app
  ingress {
    from_port   = 30080
    to_port     = 30080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Myway Frontend - NodePort"
  }

  # Port 30500 = Myway Backend API (Express.js)
  # http://<IP_worker>:30500/api/health → pod myway-backend → Express → SQLite
  ingress {
    from_port   = 30500
    to_port     = 30500
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Myway Backend API - NodePort"
  }

  # Port 30090 = Prometheus (monitoring - optionnel)
  # Prometheus collecte les métriques de tes pods (CPU, mémoire, requêtes...)
  ingress {
    from_port   = 30090
    to_port     = 30090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Prometheus - monitoring (optionnel)"
  }

  # Port 30030 = Grafana (dashboards - optionnel)
  # Grafana affiche les métriques de Prometheus sous forme de graphiques
  ingress {
    from_port   = 30030
    to_port     = 30030
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Grafana - dashboards (optionnel)"
  }

  # Communication interne entre le master et le worker (TCP)
  # "self = true" = autoriser le trafic entre toutes les VMs qui ont CE security group
  # Kubernetes a besoin que master et worker se parlent sur plein de ports internes
  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    self        = true
    description = "Communication interne Kubernetes (TCP)"
  }

  # Communication interne entre noeuds (UDP) - pour Flannel CNI (réseau des pods)
  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "udp"
    self        = true
    description = "Communication interne Kubernetes (UDP)"
  }

  # ─── TRAFIC SORTANT (EGRESS) ──────────────────────────────────
  # Autoriser TOUT le trafic sortant (pour que les VMs puissent télécharger des packages, etc.)
  # protocol = "-1" = tous les protocoles (TCP + UDP + ICMP...)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name    = "${var.project_name}-sg"
    Project = var.project_name
  }
}

# ═══════════════════════════════════════════════════════════════════
# EC2 INSTANCES (Les VMs sur AWS)
# ═══════════════════════════════════════════════════════════════════
# EC2 = Elastic Compute Cloud = les serveurs virtuels (VMs) d'AWS.
# On crée 2 VMs :
#   - k8s-master : le cerveau du cluster Kubernetes (gère les déploiements)
#   - k8s-worker : le muscle du cluster (fait tourner les pods/containers)

# ─── VM 1 : Kubernetes Master Node ───────────────────────────────
resource "aws_instance" "k8s_master" {
  ami           = data.aws_ami.amazon_linux_2.id     # image OS (Amazon Linux 2) — défini plus bas
  instance_type = var.instance_type                  # t3.micro = free tier (1 vCPU, 1GB RAM)
  key_name      = aws_key_pair.myway_key.key_name    # clé SSH pour se connecter
  subnet_id     = aws_subnet.myway_subnet.id         # dans quel réseau mettre cette VM
  vpc_security_group_ids = [aws_security_group.myway_sg.id] # pare-feu à appliquer

  # Disque dur de la VM
  root_block_device {
    delete_on_termination = true   # supprimer le disque quand on détruit la VM (évite des frais)
    volume_type           = "gp2"  # type SSD standard d'AWS
    volume_size           = 20     # 20 GB de stockage
  }

  tags = {
    Name    = "k8s-master"
    Role    = "master"
    Project = var.project_name
  }

  # Si on doit recréer la VM, créer la nouvelle AVANT de supprimer l'ancienne
  # (évite une coupure de service)
  lifecycle {
    create_before_destroy = true
  }
}

# ─── VM 2 : Kubernetes Worker Node ───────────────────────────────
resource "aws_instance" "k8s_worker" {
  ami           = data.aws_ami.amazon_linux_2.id
  instance_type = var.instance_type
  key_name      = aws_key_pair.myway_key.key_name
  subnet_id     = aws_subnet.myway_subnet.id
  vpc_security_group_ids = [aws_security_group.myway_sg.id]

  root_block_device {
    delete_on_termination = true
    volume_type           = "gp2"
    volume_size           = 20
  }

  tags = {
    Name    = "k8s-worker"
    Role    = "worker"
    Project = var.project_name
  }

  lifecycle {
    create_before_destroy = true
  }
}

# ═══════════════════════════════════════════════════════════════════
# DATA SOURCE : Amazon Linux 2 AMI
# ═══════════════════════════════════════════════════════════════════
# Un "data source" = lire une info existante sur AWS (pas créer quelque chose).
# Ici on cherche l'AMI (Amazon Machine Image) la plus récente d'Amazon Linux 2.
# AMI = l'image/template du système d'exploitation de la VM (comme une ISO Linux).
# Au lieu de hardcoder un ID d'AMI (qui change par région), on le cherche dynamiquement.
# → Terraform interroge AWS et récupère l'ID correct pour ta région (eu-west-1).
data "aws_ami" "amazon_linux_2" {
  most_recent = true        # prendre la version la plus récente
  owners      = ["amazon"]  # seulement les images officielles d'Amazon (éviter les fakes)

  # Filtre 1: le nom de l'image doit correspondre au pattern d'Amazon Linux 2
  # "amzn2-ami-hvm-*-x86_64-gp2" → ex: "amzn2-ami-hvm-2.0.20241031.0-x86_64-gp2"
  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }

  # Filtre 2: utiliser la virtualisation HVM (plus performante que paravirtual)
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}
