# ═══════════════════════════════════════════════════════════════════
# OUTPUTS TERRAFORM
# ═══════════════════════════════════════════════════════════════════
# Les outputs = les infos que Terraform affiche après "terraform apply".
# Utile pour récupérer les IPs des VMs → les coller dans ansible/inventory.ini
# Voir à tout moment avec : terraform output

# ─── Master Node ─────────────────────────────────────────────────

output "master_instance_id" {
  description = "ID de l'instance EC2 du master (ex: i-0abc123def456)"
  value       = aws_instance.k8s_master.id
}

output "master_public_ip" {
  description = "IP publique du master → à mettre dans ansible/inventory.ini"
  value       = aws_instance.k8s_master.public_ip
}

output "master_private_ip" {
  description = "IP privée du master (communication interne entre noeuds K8s)"
  value       = aws_instance.k8s_master.private_ip
}

# ─── Worker Node ─────────────────────────────────────────────────

output "worker_instance_id" {
  description = "ID de l'instance EC2 du worker"
  value       = aws_instance.k8s_worker.id
}

output "worker_public_ip" {
  description = "IP publique du worker → les apps seront accessibles via cette IP"
  value       = aws_instance.k8s_worker.public_ip
}

output "worker_private_ip" {
  description = "IP privée du worker"
  value       = aws_instance.k8s_worker.private_ip
}

# ─── Commandes SSH prêtes à l'emploi ─────────────────────────────
# Copie-colle directement ces commandes pour te connecter aux VMs

output "ssh_command_master" {
  description = "Commande SSH pour se connecter au master"
  value       = "ssh -i ~/.ssh/id_rsa ec2-user@${aws_instance.k8s_master.public_ip}"
}

output "ssh_command_worker" {
  description = "Commande SSH pour se connecter au worker"
  value       = "ssh -i ~/.ssh/id_rsa ec2-user@${aws_instance.k8s_worker.public_ip}"
}

# ─── URLs de l'application (disponibles après déploiement K8s) ──

output "myway_frontend_url" {
  description = "URL pour accéder à l'interface Myway (React + Nginx)"
  value       = "http://${aws_instance.k8s_worker.public_ip}:30080"
}

output "myway_backend_url" {
  description = "URL pour accéder à l'API backend Myway (Express.js)"
  value       = "http://${aws_instance.k8s_worker.public_ip}:30500"
}

output "myway_health_check" {
  description = "Health check de l'API → doit retourner {status: ok, message: Myway API is running}"
  value       = "http://${aws_instance.k8s_worker.public_ip}:30500/api/health"
}

output "grafana_url" {
  description = "URL Grafana - dashboards monitoring (login: admin / see terraform.tfvars)"
  value       = "http://${aws_instance.k8s_worker.public_ip}:30030"
}

output "prometheus_url" {
  description = "URL Prometheus - collecte de métriques"
  value       = "http://${aws_instance.k8s_worker.public_ip}:30090"
}
