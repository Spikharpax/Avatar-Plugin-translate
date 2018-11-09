# Traduction

**2 modes de traduction sont proposés:**
- Mode local par l'application eSpeak
	- Voir la documentation de l'application dans le répertoire du plugin plugins/translate/eSpeak/docs
- Mode en ligne par Voice RSS
	- Ce mode nécessite un enregistrement sur le site (gratuit) et la récupération d'une clé API


### Par eSpeak:
Vous pouvez changer la voix, masculine ou féminine, dans le fichier c:\Dossier d'install du serveur\plugins\translate\translate.prop
Les variantes de la propriété voice sont:

+m1 +m2 +m3 +m4 +m5 +m6 +m7 pour les voix masculines 
+f1 +f2 +f3 +f4 pour les voix féminines
.Plus vous montez le chiffre, plus la voix est aigue.

Vous pouvez aussi augmenter ou réduire la vitesse de prononciation par la propriété speed, 175 étant la valeur par défaut.

### Par Voice RSS:
La vocalisation de la traduction dans la langue voulue est meilleure dans ce mode. Je vous conseille vivement de vous enregistrer sur le site.


Après vous êtes enregistré sur le site de Voice RSS et avoir récupérez votre clé API,
ajoutez-la dans le fichier de propriétés du plugin  \translate\translate.prop dans la propriété key.

**Exemple:**
"key" : "975abfa85256841415b843c749556da3363",

Le passage entre eSpeak et Voice RSS est automatique.
Si le plugin voit une clé API pour Voice RSS, le mode est utilisé automatiquement sinon le mode eSpeak est utilisé.


### Utilisation
Syntaxe de phrase à prononcer:  **traduit en [langage] [Phrase]**

**Exemples:**

Vous: traduit en Anglais bonjour je m'appelle Avatar et je suis à votre service
Avatar: Hello my name is Avatar and i am at your service


Vous: tu peux traduire en italien bonjour je m'appelle Avatar et je suis à votre service
Avatar: Ciao mi chiamo avatar e io sono al vostro servizio


Vous: est-ce que tu pourrais traduire en allemand bonjour je m'appelle Avatar et je suis à votre service
Avatar:  hallo mein name ist avatar und ich bin zu deinem dienst
    
<br><br><br><br>