# Kubernetes Dashboard — Setup & Access Guide

## Overview

The dashboard runs inside the cluster and is accessed from your local machine
via `kubectl proxy`. It is **never exposed publicly** — the proxy only binds to
`127.0.0.1:8001`, so only you can reach it.

```
Your Browser → localhost:8001 → kubectl proxy → TLS → AWS API Server → Dashboard Pod
```

The admin token is stored locally so you never have to regenerate it unless you
rotate it intentionally.

---

## Prerequisites — install standalone kubectl locally

Your system may have `kubectl` aliased to `minikube kubectl --`. Check first:

```bash
type kubectl
# If it says: kubectl is aliased to `minikube kubectl --'
# then you need a standalone kubectl:
```

Install standalone kubectl:
```bash
curl -LO "https://dl.k8s.io/release/$(curl -Ls https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/kubectl
```

Unalias for the current session (or remove from `~/.bashrc` / `~/.zshrc` permanently):
```bash
unalias kubectl
```

---

## 1 — Deploy the Dashboard (run once on the master node)

SSH into the master:
```bash
ssh -i ssh/myway-key ec2-user@18.200.244.174
```

Deploy the official dashboard:
```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
```

Deploy the admin user and token secret:
```bash
kubectl apply -f /tmp/k8s-myway/dashboard.yml
```

Verify the dashboard pod is running:
```bash
kubectl get pods -n kubernetes-dashboard
```

---

## 2 — Retrieve and save the token (run once on the master node)

```bash
kubectl get secret admin-user-token -n kubernetes-dashboard \
  -o jsonpath='{.data.token}' | base64 --decode
```

**Copy the output** and save it on your local machine:
```bash
# On your LOCAL machine
echo "PASTE_TOKEN_HERE" > ~/Documents/etude/master/cloud/devops_project/kubernetes_token.txt
chmod 600 ~/Documents/etude/master/cloud/devops_project/kubernetes_token.txt
```

> The token is long-lived — it stays valid until you delete the `admin-user-token` secret.

---

## 3 — Copy the kubeconfig (run once on your local machine)

The kubeconfig file is owned by root on the master, so copy it via a temp location:

```bash
# Step 1 — copy to a readable location on the master
ssh -i ssh/myway-key ec2-user@18.200.244.174 \
  "sudo cp /etc/kubernetes/admin.conf /tmp/admin.conf && sudo chmod 644 /tmp/admin.conf"

# Step 2 — scp to your local machine
scp -i ssh/myway-key ec2-user@18.200.244.174:/tmp/admin.conf ~/.kube/myway-config

# Step 3 — secure it locally and clean up the remote copy
chmod 600 ~/.kube/myway-config
ssh -i ssh/myway-key ec2-user@18.200.244.174 "sudo rm /tmp/admin.conf"
```

The kubeconfig server points to the internal IP by default. Disable TLS verification
so kubectl can connect via the public IP without a certificate mismatch:

```bash
kubectl config set-cluster kubernetes \
  --insecure-skip-tls-verify=true \
  --kubeconfig ~/.kube/myway-config
```

> **Why skip TLS?** The cluster certificate is issued for internal IPs
> (10.0.1.52, 10.96.0.1). Connecting via the public IP (18.200.244.174) causes
> a certificate mismatch. Skipping verification is safe here because the
> dashboard is only accessible locally through the proxy — it is never exposed
> to the internet.

---

## 4 — Access the dashboard (every time)

### Terminal 1 — start the proxy

```bash
kubectl --kubeconfig ~/.kube/myway-config proxy
```

Leave this terminal open. You should see:
```
Starting to serve on 127.0.0.1:8001
```

### Terminal 2 — get the token

```bash
cat ~/Documents/etude/master/cloud/devops_project/kubernetes_token.txt
```

### Browser — open the dashboard

```
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
```

Select **Token** on the login screen and paste the token.

---

## 5 — Rotate the token (optional)

```bash
# On the master node
kubectl delete secret admin-user-token -n kubernetes-dashboard
kubectl apply -f /tmp/k8s-myway/dashboard.yml

# Retrieve and save the new token (repeat Step 2)
kubectl get secret admin-user-token -n kubernetes-dashboard \
  -o jsonpath='{.data.token}' | base64 --decode
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `kubectl is aliased to minikube kubectl` | Run `unalias kubectl` and install standalone kubectl (see Prerequisites) |
| `cluster "minikube" does not exist` | The alias is active — run `unalias kubectl` |
| `Permission denied` copying admin.conf | Use the sudo+tmp workaround in Step 3 |
| `x509: certificate is valid for 10.0.1.52` | Run the `--insecure-skip-tls-verify` command in Step 3 |
| `is a directory` error for myway-config | Run `sudo rm -rf ~/.kube/myway-config` then redo the scp |
| Dashboard pod not running | `kubectl get pods -n kubernetes-dashboard` on the master |
| Proxy connection refused | Make sure `kubectl proxy` is still running in Terminal 1 |
| 403 Forbidden in dashboard | Reapply `dashboard.yml` on the master to restore ClusterRoleBinding |
