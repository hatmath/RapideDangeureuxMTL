to do:
1. trouver le probleme de connection BD apres un nombre x de insertOne
2. format en minutes express.js -> console.log("En attente pendant " + timeoutDelay);

Cas 4: 
Données descriptives (5)

DT_ACCDN
    Date de l’accident (AAAA-MM-JJ).
BORNE_KM_ACCDN
    lieu est marquée par des bornes kilométriques, le numéro
    de la borne située le plus près du site de l’accident sera
    inscrit.
CD_LOCLN_ACCDN
    Localisation longitudinale (le long de la route) du premier fait 
    physique (impact).
CD_PNT_CDRNL_REPRR
    Code du point cardinal pour la distance du repère:
    L’accident est survenu au nord, au sud, à l’est ou à l’ouest du
    numéro d’immeuble, de la borne kilométrique, de l’intersection
    ou du repère.
CD_ASPCT_ROUTE
    Aspect de la route sur le lieu de l’accident au moment de Alph 2
    l’impact et dans son entourage immédiat en fonction du champ
    de vision d’un conducteur assis au volant de son véhicule.


Métriques d’agrégations (5)

    1. Le jour de la semaine (JR_SEMN_ACCDN) où il y a le plus d'accident et que CD_COND_METEO=Pluie/bruine
    2. Le jour de la semaine (JR_SEMN_ACCDN) où il y a le plus d'accident avec CD_GENRE_ACCDN=43(arbre)
    3. Le jour de la semaine (JR_SEMN_ACCDN) où il y a le plus d'accident et que GRAVITE=Léger
    4. Rue (RUE_ACCDN) où il y a le plus d'accident à Montréal
    5. Vitesse autorisée (VITESSE_AUTOR) où il y a le plus d'accident

Cas 5:
Le choix est dérivé de la Métriques d’agrégations "Rue (RUE_ACCDN) où il y a le plus d'accident à Montréal"
Un repère unique sur la rue en question sera placé sur la carte
   
