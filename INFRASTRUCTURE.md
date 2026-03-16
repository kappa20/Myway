# Infrastructure Guide — Full Pipeline from Scratch

This guide walks you through deploying Myway on AWS with Kubernetes, from zero to a running application with an automated CI/CD pipeline.

**Stack:** Terraform (AWS infra) → Ansible (K8s setup) → GitHub Actions (CI/CD) → Kubernetes (runtime)

---

## Prerequisites

Install these tools on your local machine:

```bash
# Terraform
wget https://releases.hashicorp.com/terraform/1.7.0/terraform_1.7.0_linux_amd64.zip
unzip terraform_1.7.0_linux_amd64.zip && sudo mv terraform /usr/local/bin/

# Ansible
pip3 install ansible

# AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install

# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Verify
terraform --version && ansible --version && aws --version && kubectl version --client
```

You also need:
- An **AWS account** (free tier works — 2× t3.micro instances)
- A **DockerHub account** with a username and access token
- A **GitHub account** with this repo forked/cloned

---

## Step 1 — Generate an SSH Key

```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
```

This creates `~/.ssh/id_rsa` (private, never share) and `~/.ssh/id_rsa.pub` (public, uploaded to AWS).

---

## Step 2 — Configure AWS CLI

```bash
aws configure
# AWS Access Key ID: <your key>
# AWS Secret Access Key: <your secret>
# Default region: eu-west-1
# Default output format: json
```

Get your credentials from the AWS console: `IAM > Users > Your user > Security credentials > Create access key`.

---

## Step 3 — Deploy AWS Infrastructure with Terraform

```bash
cd terraform/

# Copy and fill in the variables file
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars if needed (region, key name, etc.)

# Initialize and deploy
terraform init
terraform plan    # preview what will be created
terraform apply   # create the infrastructure (~2 minutes)
```

**Save the output IPs** — you'll need them in the next step:

```
master_public_ip = "X.X.X.X"
worker_public_ip = "Y.Y.Y.Y"
```

You can always retrieve them later with `terraform output`.

**What gets created:** 1 VPC, 1 subnet, 1 internet gateway, 1 security group, 2 EC2 instances (master + worker).

---

## Step 4 — Configure Ansible Inventory

```bash
cd ansible/
```

Edit `inventory.ini` and replace the placeholders with your actual IPs:

```ini
[master]
k8s-master ansible_host=X.X.X.X ansible_user=ec2-user   # ← master_public_ip

[workers]
k8s-worker ansible_host=Y.Y.Y.Y ansible_user=ec2-user   # ← worker_public_ip
```

Test connectivity:

```bash
ansible all -m ping
# Expected: SUCCESS for both hosts
```

---

## Step 5 — Install Docker and Kubernetes with Ansible

Run the playbooks **in order**:

```bash
# 1. Install Docker on both nodes
ansible-playbook playbooks/01-install-docker.yml

# 2. Install kubeadm, kubelet, kubectl on both nodes
ansible-playbook playbooks/02-install-kubernetes.yml

# 3. Initialize the master node (creates the cluster)
ansible-playbook playbooks/03-init-master.yml

# 4. Join the worker to the cluster
ansible-playbook playbooks/04-join-worker.yml
```

Each playbook takes 2–5 minutes. **Do not skip steps.**

Verify the cluster is ready:

```bash
ssh -i ~/.ssh/id_rsa ec2-user@<MASTER_PUBLIC_IP>
kubectl get nodes
# Expected:
# NAME         STATUS   ROLES           VERSION
# k8s-master   Ready    control-plane   v1.29.0
# k8s-worker   Ready    <none>          v1.29.0
```

---

## Step 6 — Add GitHub Actions Secrets

Go to your GitHub repo → **Settings > Secrets and variables > Actions** → add these:

| Secret | Value |
|---|---|
| `DOCKERHUB_USERNAME` | Your DockerHub username |
| `DOCKERHUB_TOKEN` | Generate at hub.docker.com → Account Settings → Security |
| `SSH_PRIVATE_KEY` | Content of `~/.ssh/id_rsa` (run: `cat ~/.ssh/id_rsa`) |
| `MASTER_IP` | The `master_public_ip` from `terraform output` |

---

## Step 7 — Push and Let GitHub Actions Deploy

```bash
git add .
git commit -m "Deploy Myway infrastructure"
git push origin main
```

GitHub Actions will automatically:
1. **Run tests** — backend API tests + frontend build
2. **Build Docker images** — backend and frontend
3. **Push to DockerHub** — tagged `:latest` and `:<commit-sha>`
4. **Deploy to Kubernetes** — applies all k8s manifests on the master node

Monitor the pipeline in the **Actions** tab on GitHub.

---

## Step 8 — Access the Application

Once the pipeline succeeds:

| Service | URL |
|---|---|
| Frontend | `http://<WORKER_PUBLIC_IP>:30080` |
| Backend API | `http://<WORKER_PUBLIC_IP>:30500` |
| Health Check | `http://<WORKER_PUBLIC_IP>:30500/api/health` |
| Prometheus (optional) | `http://<WORKER_PUBLIC_IP>:30090` |
| Grafana (optional) | `http://<WORKER_PUBLIC_IP>:30030` |

---

## Cleanup — Stop AWS Resources

```bash
# Stop instances (keeps resources, saves costs while not testing)
aws ec2 stop-instances --instance-ids <master-id> <worker-id>

# Or destroy everything (cannot be undone)
cd terraform/
terraform destroy
```

---

## Troubleshooting

**Ansible cannot connect:**
```bash
ssh -i ~/.ssh/id_rsa ec2-user@<MASTER_IP>
# If this fails, check the security group allows port 22
```

**Master initialization fails:**
```bash
ssh ec2-user@<MASTER_IP>
journalctl -u kubelet -n 50
```

**Pods stuck in Pending:**
```bash
kubectl describe pod <pod-name> -n myway
```

**GitHub Actions deploy fails:**
- Check `SSH_PRIVATE_KEY` secret — it must include the full key with header/footer lines (`-----BEGIN RSA PRIVATE KEY-----` ... `-----END RSA PRIVATE KEY-----`)
- Check `MASTER_IP` matches the current IP (it changes if you stop/start the EC2 instance)
