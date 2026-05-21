# Overlay layout

This repo uses ArgoCD as the deployment entrypoint.

## Directories

- `argocd/`: ArgoCD itself plus the `Application` resources it manages.
- `clusters/<cluster>/`: cluster-level infrastructure for a target cluster, such as Traefik configuration and shared ingress middleware.
- `apps/<app>/`: one application overlay per deployable app. App-specific SOPS secrets live next to the app overlay that consumes them.
- `azure/`, `matrix/`, `monitoring/`: older stack overlays that have not yet been split into the `apps/` and `clusters/` layout.

## Common commands

Render a cluster overlay:

```sh
just test clusters/hetzner
```

Render an app overlay:

```sh
just test apps/outline
```

Render ArgoCD and all active `Application` resources:

```sh
just test argocd
```
