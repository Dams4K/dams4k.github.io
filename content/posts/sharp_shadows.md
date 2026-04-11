---
date: '2026-04-10T15:04:17Z'
draft: false
title: 'Sharp Shadows'
weight: 1
---

# Ombres nettes

En ce moment j'ai une obsession avec la lumière, et plus précisément, les ombres. "Comment faire pour avoir des ombres nettes ?" est la question que je me pose depuis quelques semaines déjà.

J'ai toujours trouvé que les ombres de Godot n'étaient pas "folles", un peu trop floues à mon goût, et quand je comparais avec les quelques vidéos que je regardais sur Unreal Engine, j'étais à chaque fois surpris de la netteté de leurs ombres.

Bon il est vrai que faire une comparaison Unreal Engine/Godot ressemble fortement à la comparaison Hydrogen Bomb/Coughing Baby, d'autant plus que même dans la vraie vie, les ombre ne sont pas nettes. Mais je ne cherche pas spécialement à faire du réalisme.

## DirectionalLight3D

### Shadow map size

Alors assez vite j'avais trouvé un paramètre intéressant dans Godot, `rendering/lights_and_shadows/directional_shadow/size` qui dictait la résolution de la *shadow map* (qui, si j'ai bien compris, est l'image qui va enregistrer les ombres). Donc assez naïvement on peut se dire "plus la résolution est élevée, plus l'ombre sera nette, car moins pixélisé" et c'est vrai !

Par défaut Godot utilise une taille de `4096`, si augmente la valeur à `16384` on peut voir une nette amélioration :

![Bien mieux avec 16k que 4k](/images/sharp_shadows/shadow_map_size.png#center)

Et lorsqu’on lit la documentation, on se dit qu’on est tombé sur le bon paramètre :
> "The directional shadow's size in pixels. Higher values will result in sharper shadows, at the cost of performance. The value is rounded up to the nearest power of 2.

Sauf qu’elle précise aussi que "de plus grandes valeurs détériorera les performances", et personnellement je ne suis pas du style à blamer les joueurs car ils n'ont pas les composants dernier cri pour jouer à mon jeu.

Il va donc falloir trouver autre chose. Mais on peut quand même garder à l'esprit que pour un preset graphique "Ultra" on pourrait augmenter la taille de la shadow map. Si le joueur peut se le permettre, on n'a aucune raison de l'y en empêcher.

### Les splits

#### Valeurs

Assez vite, j’ai trouvé un autre paramètre prometteur : les *splits*.

En gros, la vue de la caméra est découpée en plusieurs zones (2 ou 4 dans Godot), et chaque zone dispose de sa propre *shadow* map. L'idée n'est pas d'augmenter bêtement la résolution comme tout à l'heure, mais de mieux la répartir là où elle est vraiment utile.

Par exemple avec une shadow map en 4K et 4 splits, on crée en réalité 4 shadow maps. Par contre, la portion de scène couverte par chacune n'est pas la même : plus un split est éloigné de la caméra, plus la zone qu'il couvre est grande.

On va pouvoir ensuite jouer avec la taille de ces splits (par rapport à une distance max). Par défaut, Godot utilise une distribution (presque) logarithmique, ce qui n'est pas déconnant, mais nos ombres ne sont pas nettes...

Mais en changeant les valeurs des splits, a un bien meilleur résultat :

![Splits](/images/sharp_shadows/splits.png#center)

On est même plus net qu'en changeant la résolution de la shadow map ! Le seul problème c'est qu'on tient cette netteté sur 3 mètres. On n'a même plus d'ombre.

![Issue](/images/sharp_shadows/splits_issue.png#center)

Et le problème c'est qu'on demande au 

Le problème se voit assez bien si on active la vue `Perpective > Display Advanced > Directional Shadow Map`. Voici la comparaison avec les paramètres par défaut, et avec nos paramètres :

![Directional Shadow Map](/images/sharp_shadows/splits_debug_view.png#center)

Et en fait on se rend compte qu'avec nos splits, la quatrième zone va devoir gérer 94% du terrain visible par la caméra. Ce qui est beaucoup BEAUCOUP trop pour une shadow map en 4K (et même en 16k ça ne fonctionne pas).

Ce qu'on peut faire cependant pour essayer de pallier ça, c'est de diminuer la propriété `directional_shadow_max_distance`. De cette manière, on va diminuer la surface que prendra le dernier split, et on pourra ainsi voir les ombres jusqu'au bout. Cependant la qualité sera vraiment mauvaise car on a toujours une trop grande surface pour une shadow map trop petite. Le vrai problème ici, c'est d'avoir mis des valeurs absurdes pour les splits.

#### Max distance

Cependant, jouer avec la distance max des ombres reste une bonne idée. Par défaut cette valeur est à 100, on peut donc voir les ombres jusqu'à 100 mètres, après quoi elles auront totalement disparu. Mais on peut espérer que dans la plupart des scènes, il n'y a pas de ligne droite de 100m ou plus, et alors ce paramètre peut être diminué en fonction des scènes (pour ce que je veux faire, 50m devrait être suffisant)

### Lightmap GI

Mais si mettre une plus petite distance est un réel problème, il existe une solution, et on arrive enfin à la raison pour laquelle je fais ce post.

En testant un peu le noeud LightmapGI, je me suis rendu compte que je ne connaissais pas le paramètre `Shadowmask Mode`. Il avait échappé à ma curiosité. En fait il permet tout bêtement de précalculer les ombres. Eh bah heureusement que je le découvre avant que ce soit trop tard, car du coup ça veut dire qu'on peut créer une scène, modifier les splits si vraiment on a besoin, diminuer un peu comme on veut la distance max du DirectionalLight3D, je rajoute un LightmapGI, je choisis le mode `Replace` et quand je dépasse la distance max, le lightmap GI prend le relais, et affiche les ombres précalculées.

![LightmapGI with low distance max](/images/sharp_shadows/lightmap_shadow.png#center)

La distance max a été largement baissée pour qu'on puisse voir le résultat sans se détruire les yeux à regarder 4 pixels qui se battent sur un écran. On peut quand même trouver que la qualité de l'ombre n'est pas folle, et si c'est le cas, il suffit d'augmenter la résolution du LightmapGI avec `texel_scale` ou d'augmenter la densité directement sur le mesh avec `gi_lightmap_texel_scale`.

Si on a des objets qui se déplacent dans la scène, il suffit de changer le `gi_mode` en `DISABLED`, le lightmapGI l'ignorera.

Évidemment ça aura un coup en mémoire d'utiliser cette méthode, mais il n'y aura jamais de solution miracle (sinon elle serait déjà implémentée et utilisée par défaut dans le moteur)

## SpotLight3D & OmniLight3D

Pour eux, ils n'ont pas de splits. Leur système est différent et je ne me suis pas plus renseigné que ça, mais ils n'ont pas de distance max, donc un LightmapGI ne peut pas afficher des ombres précalculées quand on est trop loin. Cependant si on change leur `light_bake_mode` en `STATIC` alors là, la lumière ET l'ombre seront précalculée.

Mais de base leurs ombres sont assez bien définies. Si on veut vraiment avoir des ombres plus nettes, il faut jouer, soit avec la taille de l'atlas, mais on a les mêmes problèmes qu'avec la taille des shadows maps, soit on joue avec les subdivisions des quadrants de l'atlas. La [documentation](https://docs.godotengine.org/en/4.6/tutorials/3d/lights_and_shadows.html#shadow-atlas) semble assez claire à ce sujet, donc pas besoin de développer plus que ça.

## Vue orthogonale

### Mauvaise qualité

Quelque chose qui peut surprendre quand on passe à la vue orthogonale, c'est que soit on ne voit plus aucune ombre, soit elles sont vraiment moches. Pour régler ça, il faut fortement diminuer la property `far` (attention, pour la caméra de l'editeur il faut modifier dans `View > Settings...`)

![Top bar > View > Settings...](/images/sharp_shadows/editor_camera_far.png#center)

J'ai testé avec `far = 20`, et le résultat est très bien. Cependant il faut savoir qu'utiliser le mode `PSSM 4 Splits` n'est vraiment pas utile dans des jeux en vue orthographiques. Si on active la vue `Display Directional Splits`, on se rend compte qu'avec les valeurs des splits par défaut (i.e. 0.1, 0.2, 0.5), seulement 3 shadow map sont rellement utilisés, et encore, pas dans les mêmes proportions.

![Orthogonal Display Directional Splits](/images/sharp_shadows/ortho_directional_shadow_splits.png#center)

Et je ne pense pas que chercher des bonnes valeurs pour que chaque splits prennent un quart de l'écran soit la bonne solution. Non en vrai, ce qu'il faut faire, c'est utiliser le mode `Orthogonal` de la direction light. Dans ce cas précis d'utilisation, il n'y a aucune perte de qualitée visible.

### Shadow blur

Ce que j'aime bien faire dans cette projection orthogonale, c'est de diminuer fortement la valeur du paramètre `shadow_blur`, ça permet de rendre l'ombre encore plus nette. Alors attention, si la résolution de la shadow map est trop basse, il vaut mieux ne pas toucher à ce paramètre, mais avec la valeur par défaut (de 4K), le résultat me semble très correct. De toute façon, encore une fois, tout dépend du projet.

Par contre, attention à ne pas mettre 0, sinon on peut avoir des artefacts visuels dont je ne connais pas la raison.

![Shadow blur comparaison](/images/sharp_shadows/shadow_blur.png)

Ah et comme on a quasiment désactivé le blur, autant changer le paramètre `rendering/lights_and_shadows/directional_shadow/soft_shadow_filter_quality` à `Hard`, honnêtement je ne vois pas la différence.

## Conclusion

Il me semble personnelement que la meilleure solution pour avec des ombres nettes, c'est de changer le paramètre `directional_shadow_max_distance` à une valeur plus faible, et d'utiliser un LightmapGI pour precalculer les ombres quand on est trop loin. 

Pour les omni et spot lights, on peut jouer avec les subdivisions des 4 quadrants, peut-être qu'on peut modifier ça à la volée, pour avoir différents paramètres en fonction des scènes.

Et évidemment il faut quand même modifier la taille des shadow maps et des atlas, même s'il ne faut pas trop abuser sur les valeurs, on peut quand même avoir différents presets allant de `Low` à `Very high` avec différentes valeurs.

Putain avoir des ombres nettes c'est CHIANT ! Et si Unreal Engine arrive à avoir une ombre de bonne qualité facilement, c'est car ils utilisent des Virtual Shadow Maps, je ne me suis pas renseigné pour connaître les détails techniques.