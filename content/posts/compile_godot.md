---
date: '2026-05-03T13:11:48Z'
draft: false
title: 'Compiler Godot'
---
Les templates de base de Godot sont bien quand on développe, mais si on veut publier pour de vrai notre jeu, c'est toujours mieux de recompiler soi-même les différents templates en désactivant ce qui n'est pas nécessaire (par exemple, la VR).

Alors Godot a déjà une [documentation](https://docs.godotengine.org/en/4.6/engine_details/development/compiling/index.html) qui explique comment compiler le moteur. Elle explique aussi quels sont les différentes dépendances nécessaires à la compilation. Mais ça fait un moment que j'en ai marre d'installer à chaque fois plein de packages, et c'est pour ça que Docker existe. Bonne nouvelle, Godot a déjà des [images Docker](https://github.com/godotengine/build-containers) qu'on peut compiler nous-mêmes.

```bash
git clone https://github.com/godotengine/build-containers.git --depth 1
# Désactiver dans le fichier build.sh les podman_build qu'on ne veut pas : #podman_build windows
./build.sh 4.6 f43 # Génère une image nommée 4.6-f43
git clone https://github.com/godotengine/godot.git --branch 4.6 --depth 1
cd godot
podman run --rm -v $(pwd):/godot:z -w /godot godot-linux:master-f43 bash -c 'export PATH=$GODOT_SDK_LINUX_X86_64/bin:$PATH && scons'
```

On peut aussi, avant de build, suivre les conseils de la documentation : créer un fichier custom.py dans le dossier godot/, et désactiver certaines parties du moteur

```python
platform="linuxbsd"
target="template_release"
arch="x86_64"

production=True

optimize="speed"
lto="full"

deprecated=False

accesskit=False

disable_physics_2d=True
disable_navigation_2d=True

disable_xr=True

engine_update_check=False

module_multiplayer_enabled=False
module_navigation_2d_enabled=False
module_objectdb_profiler_enabled=False
module_openxr_enabled=False
module_visual_shader_enabled=False
module_webrtc_enabled=False
module_websocket_enabled=False
module_webxr_enabled=False
module_xatlas_unwrap_enabled=False
```