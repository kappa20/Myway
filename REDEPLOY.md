# Redeploy from Scratch

Full flow: infrastructure → cluster → app.

---

## 1. Terraform — Provision AWS Infrastructure

```bash
cd terraform
terraform apply
```

Note the output IPs:
```bash
terraform output master_public_ip   # e.g. 1.2.3.4
terraform output worker_public_ip   # e.g. 5.6.7.8
```

---

## 2. Update IPs

**`ansible/inventory.ini`** — replace old IPs:
```ini
[master]
1.2.3.4 ansible_user=ec2-user ansible_ssh_private_key_file=../ssh/myway-key

[workers]
5.6.7.8 ansible_user=ec2-user ansible_ssh_private_key_file=../ssh/myway-key
```

**GitHub secret `MASTER_IP`** — update to new master IP:
> GitHub → repo Settings → Secrets → `MASTER_IP` → update value

---

## 3. Ansible — Provision the Cluster

```bash
cd ansible

# Test connectivity first
ansible all -i inventory.ini -m ping

# Run playbooks in order
ansible-playbook -i inventory.ini playbooks/01-install-docker.yml
ansible-playbook -i inventory.ini playbooks/02-install-kubernetes.yml
ansible-playbook -i inventory.ini playbooks/03-init-master.yml
ansible-playbook -i inventory.ini playbooks/04-join-worker.yml
```

---

## 4. Refresh Local kubeconfig

```bash
NEW_IP=1.2.3.4  # master IP

ssh -i ssh/myway-key ec2-user@$NEW_IP \
  "sudo cp /etc/kubernetes/admin.conf /tmp/admin.conf && sudo chmod 644 /tmp/admin.conf"

scp -i ssh/myway-key ec2-user@$NEW_IP:/tmp/admin.conf ~/.kube/myway-config
chmod 600 ~/.kube/myway-config

ssh -i ssh/myway-key ec2-user@$NEW_IP "sudo rm /tmp/admin.conf"

# Fix TLS (cert only covers internal IPs)
kubectl config set-cluster kubernetes \
  --insecure-skip-tls-verify=true \
  --kubeconfig ~/.kube/myway-config
```

Verify:
```bash
kubectl --kubeconfig ~/.kube/myway-config get nodes
```

---

## 5. Deploy the App — Push to main

```bash
cd Myway
git add .
git commit -m "redeploy"
git push origin main
```

The CI/CD pipeline (`cicd.yml`) will:
1. Run tests
2. Build & push Docker images to DockerHub
3. SSH into master and apply Kubernetes manifests

---

## 6. Verify

```bash
# App URLs (replace with new master IP)
curl http://1.2.3.4:30500/api/health   # backend
open http://1.2.3.4:30080              # frontend

# Cluster status
kubectl --kubeconfig ~/.kube/myway-config get pods -n myway
```

---

## Estimated Time

| Step | Time |
|---|---|
| Terraform apply | ~2 min |
| Ansible playbooks | ~10 min |
| CI/CD pipeline | ~5 min |
| **Total** | **~17 min** |
