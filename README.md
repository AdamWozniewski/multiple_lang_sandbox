# Kubernetes — ściąga

## Klaster

```bash
minikube start                          # uruchom klaster
minikube start --nodes=3                # klaster z 3 nodami
minikube stop                           # zatrzymaj
minikube delete                         # usuń klaster całkowicie
minikube status                         # status klastra
minikube ssh                            # wejdź do VM minikube
eval $(minikube docker-env)             # buduj obrazy prosto do minikube
```

## Namespace

```bash
kubectl get ns                                              # lista namespace'ów
kubectl create ns sandbox                                   # stwórz namespace
kubectl delete namespace sandbox                            # usuń namespace + WSZYSTKO w nim
kubectl config set-context --current --namespace=sandbox     # ustaw domyślny namespace
```

## Apply / Delete

```bash
kubectl apply -f k8s/plik.yaml              # zastosuj jeden plik
kubectl apply -f k8s/                       # zastosuj WSZYSTKIE yamle z folderu
kubectl delete -f k8s/plik.yaml             # usuń zasoby z pliku
```

## Pody

```bash
kubectl get pods                            # lista podów (w domyślnym ns)
kubectl get pods -n sandbox                 # lista podów w namespace
kubectl get pods -o wide                    # + IP i node
kubectl get pods -w                         # watch — obserwuj zmiany na żywo
kubectl get pods --show-all                 # pokaż też Completed/Error

kubectl describe pod <nazwa-poda>           # szczegóły + eventy
kubectl describe pod -l app=postgres        # po labelu

kubectl logs <nazwa-poda>                   # logi kontenera
kubectl logs <nazwa-poda> -f                # follow — na żywo
kubectl logs <nazwa-poda> -c <kontener>     # konkretny kontener (multi-container pod)
kubectl logs <nazwa-poda> --all-containers  # logi ze wszystkich kontenerów
kubectl logs deployment/<nazwa>             # logi z deploymentu

kubectl exec -it <nazwa-poda> -- sh         # wejdź do kontenera (shell)
kubectl exec -it <nazwa-poda> -- bash       # wejdź do kontenera (bash)

kubectl delete pod <nazwa-poda>                     # usuń pod (Deployment postawi nowy)
kubectl delete pod <nazwa-poda> --grace-period=0    # usuń natychmiast
```

## Deploymenty

```bash
kubectl get deploy                          # lista deploymentów
kubectl describe deploy <nazwa>             # szczegóły

kubectl scale deploy <nazwa> --replicas=3   # skaluj do 3 replik
kubectl rollout restart deploy <nazwa>      # restart podów (np. po nowym obrazie)
kubectl rollout status deploy <nazwa>       # status rolling update
kubectl rollout history deploy <nazwa>      # historia wersji
kubectl rollout undo deploy <nazwa>         # cofnij do poprzedniej wersji

kubectl set image deploy <nazwa> <kontener>=<obraz:tag>   # zmień obraz
```

## Serwisy

```bash
kubectl get svc                             # lista serwisów
kubectl get endpoints <nazwa-svc>           # sprawdź czy Service trafia do podów
                                            # <none> = selector nie pasuje!

minikube service <nazwa-svc> -n sandbox     # otwórz NodePort w przeglądarce
kubectl port-forward svc/<nazwa> 8080:80    # tuneluj port na localhost
```

## Sekrety i ConfigMapy

```bash
kubectl get secret                          # lista sekretów
kubectl get configmap                       # lista configmap
kubectl describe secret <nazwa>             # klucze (wartości ukryte)
kubectl get secret <nazwa> -o jsonpath='{.data}'   # klucze (base64)

echo -n "tekst" | base64                    # zakoduj do base64
echo "dGVrc3Q=" | base64 -d                 # odkoduj z base64
```

## CronJoby i Joby

```bash
kubectl get cronjob                         # lista CronJobów (harmonogramy)
kubectl get jobs                            # lista wykonanych Jobów

# Ręczne odpalenie CronJoba (bez czekania na schedule):
kubectl create job <nazwa-jobu> --from=cronjob/<nazwa-cronjoba>

# Logi z Joba:
kubectl logs job/<nazwa-jobu>                       # domyślny kontener
kubectl logs job/<nazwa-jobu> -c <kontener>         # konkretny kontener
kubectl logs job/<nazwa-jobu> --all-containers      # wszystkie kontenery
kubectl logs -f -l job-name=<nazwa-jobu>            # follow po labelu

kubectl delete job <nazwa-jobu>             # usuń job
```

## Debugging

```bash
kubectl get all -n sandbox                  # WSZYSTKO w namespace
kubectl get events -n sandbox               # eventy (co się dzieje)

kubectl describe pod <nazwa>                # na dole sekcja Events = przyczyna błędu

kubectl run test --rm -it --image=busybox:1.36 -- sh              # tymczasowy pod do testów
kubectl run dns-test --rm -it --image=busybox:1.36 -- nslookup <serwis>   # test DNS
```

## PersistentVolumeClaim

```bash
kubectl get pvc                             # lista wolumenów
kubectl describe pvc <nazwa>                # szczegóły (Bound = OK)
```

## RBAC

```bash
kubectl get serviceaccount                  # lista service accounts
kubectl get role                            # lista ról
kubectl get rolebinding                     # lista powiązań rola↔konto
```

## Nody (multi-node)

```bash
kubectl get nodes                           # lista nodów
kubectl get nodes --show-labels             # nody + labele
kubectl label nodes <node> tier=database    # dodaj label do noda
kubectl describe node <node>                # szczegóły noda (zasoby, pody)
```

## Częste statusy podów

| Status | Znaczenie |
|---|---|
| `Running` | Działa ✅ |
| `Completed` | Zakończył się (Job) ✅ |
| `Pending` | Czeka na zasoby lub scheduling |
| `ContainerCreating` | Ściąga obraz / montuje volume |
| `Init:0/1` | InitContainer jeszcze nie skończył |
| `CrashLoopBackOff` | Crashuje → restart → crashuje → ... |
| `ErrImageNeverPull` | `imagePullPolicy: Never` ale obraz nie istnieje |
| `CreateContainerConfigError` | Brak Secret/ConfigMap lub złe klucze |
| `ImagePullBackOff` | Nie może ściągnąć obrazu z registry |

## Makefile

```bash
make kubernetes-init                        # start + deploy wszystkiego
```
