# Kubernetes Dashboard — Setup & Access Guide

## Overview

The dashboard runs inside the cluster and is accessed from your local machine
via `kubectl proxy`. The admin token is stored locally so you never have to
regenerate it unless you rotate it intentionally.

---

## 1 — Deploy the Dashboard (run once on the master node)

SSH into the master:
```bash
ssh ec2-user@18.200.244.174
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

## 2 — Retrieve and save the token (run once, save locally)

On the master node, print the token:
```bash
kubectl get secret admin-user-token -n kubernetes-dashboard \
  -o jsonpath='{.data.token}' | base64 --decode
```

**Copy the output** and save it to your local machine:
```bash
# On your LOCAL machine — paste the token into this file
mkdir -p ~/.kube
echo "PASTE_TOKEN_HERE" > ~/.kube/dashboard-token.txt
chmod 600 ~/.kube/dashboard-token.txt
```

> The token is long-lived (tied to the Secret, not a temporary ServiceAccount
> token). It stays valid until you delete `admin-user-token` secret.

---

## 3 — Access the dashboard from your local machine

### Step 1 — copy the kubeconfig from the master

```bash
scp ec2-user@18.200.244.174:/etc/kubernetes/admin.conf ~/.kube/myway-config
chmod 600 ~/.kube/myway-config
export KUBECONFIG=~/.kube/myway-config
```

### Step 2 — start kubectl proxy

```bash
kubectl proxy
```

Leave this terminal open. Proxy listens on `http://127.0.0.1:8001`.

### Step 3 — open the dashboard in your browser

```
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
```

### Step 4 — paste the token

Select **Token** on the login screen, then:
```bash
cat ~/.kube/dashboard-token.txt
```
Copy the output and paste it into the browser.

---

## 4 — Quick access (after initial setup)

Every time you want to open the dashboard:

```bash
# Terminal 1 — start proxy
export KUBECONFIG=~/.kube/myway-config
kubectl proxy

# Terminal 2 — get the token if you forgot it
cat ~/.kube/dashboard-token.txt
```

Then open: http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/

---

## 5 — Rotate the token (optional)

To invalidate the current token and generate a new one:

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
| Dashboard pod not running | `kubectl describe pod -n kubernetes-dashboard` |
| Token login fails | Verify token has no trailing newline: `cat -A ~/.kube/dashboard-token.txt` |
| Proxy connection refused | Make sure `kubectl proxy` is still running in another terminal |
| 403 Forbidden in dashboard | Reapply `dashboard.yml` to ensure ClusterRoleBinding exists |
| kubeconfig permission denied | `chmod 600 ~/.kube/myway-config` |
