---
date: '2026-04-08T18:03:00+01:00'
title: 'Top Down - Room bases'
weight: 1
---

# Room bases
## Inspirations

Ça fait un long moment que j'ai envie de faire un jeu en vue Top-Down avec une DA similaire à Tunic, un jeu que j'aime beaucoup. Mais atteindre un tel niveau de qualité a dû prendre pas mal de temps au développeur, et donc pour moi qui reste un débutant en 3D, ça risque d'être compliqué.

Alors, comme je l'ai dit, ça fait un moment que j'ai envie de reproduire le style de Tunic, et je m'y suis déjà essayé à plusieurs reprises. Mais à chaque fois que je m'y ressaye, j'ai tout oublié... Donc je vais faire des posts pour MOI et moi seulement, qui vont me permettre de m'y retrouver plus tard.

## Blender

Je suis parti d'un cube sur Blender. En `Edit Mode` j'ai simplement renversé les normals avec `Shift-n` et `inverse normals`, et ensuite j'ai activé le backface culling dans la vue `solid`.
Pour activer le backface culling dans la vue `material`, il faut assigner un `material` et activer dans `Settings > Surface > Backface culling` check `camera`.

Ensuite on peut modifier le mesh comme on veut, ajouter des lumières et autres...

Attention cependant, la conversion des lumières de Blender à Godot n'est (vraiment) pas parfaite. La puissance des lumières est bien plus faible sur Godot, et la couleur n'est pas retranscrite.

## Ombres

Si on regarde sur Tunic

![Tunic room](/images/top_down_lightmaps_tunic_example.png)

On voit qu'il y a une forte lumière qui entre dans la pièce. Cette lumière projette aussi l'ombre du renard. Pour faire ça, je n'ai pas trouvé mieux que de retirer la face qui fait office de porte, d'activer pour le mesh `Cast Shadow > Double-Sided` et de laisser la magie de Godot opérer.

Une autre solution (un peu débile) que j'avais trouvé, était de dupliquer le mesh de la pièce, corriger les normals pour qu'elles soit dans le bon sens, et dans Godot on choisi `Cast Shadow > Shadows Only`.

En fait le problème que j'avais était que l'ombre n'était pas projeté quand elle provient de faces qui sont *cullé*. Normal en vrai, mais du coup ça ne faisait pas ce que je voulais.

![Résultat](/images/top_down_lightmaps_result_1.png)

Bon par contre il va falloir que je trouve comment éviter que la lumière passe à travers le mesh...