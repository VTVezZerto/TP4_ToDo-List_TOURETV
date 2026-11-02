/** Récupération de la liste : on récupère les données sauvegardées**/
let listeTaches = JSON.parse(localStorage.getItem('Tâches Sauvegardées')) || [];

const elInputTache = document.getElementById('task-input');
const elBoutonAjouter = document.getElementById('add-btn');
const elListeConteneur = document.getElementById('task-list');
const elCompteur = document.getElementById('task-counter');
/** Sélection de tous les boutons de filtrage présents dans le HTML **/
const elBoutonsFiltre = document.querySelectorAll('.filter-btn');

/** Variable globale pour savoir quel filtre est actif. Par défaut, on affiche 'all' (Toutes) **/
let filtreActuel = 'all';

/** fonction qui va interragir avec une constante pour voir si elle n'est pas terminé **/
function mettreAJourCompteur() {
    const tachesRestantes = listeTaches.filter(tache => !tache.terminee);
    elCompteur.textContent = tachesRestantes.length;
}

/** fonction d'affichage **/
function afficherListeTaches() {
    elListeConteneur.innerHTML = ''; /** affichage vide **/

    /** Filtrage des tâches selon la valeur de la variable filtreActuel avant de lancer la boucle d'affichage **/
    let listeFiltree = listeTaches;
    if (filtreActuel === 'active') {
        /** En cours : on filtre pour ne garder que les tâches dont la propriété terminee est fausse **/
        listeFiltree = listeTaches.filter(tache => !tache.terminee);
    } else if (filtreActuel === 'completed') {
        /** Terminées : on filtre pour ne garder que les tâches qui sont marquees comme terminees **/
        listeFiltree = listeTaches.filter(tache => tache.terminee);
    }

    listeFiltree.forEach(tache => { /** affichage avec forEach parcours et affichage de chaque tache filtreé **/
    const li = document.createElement('li');
        li.className = 'task-item';
        if (tache.terminee) { /** si tâche terminée return 'completed' **/
        li.classList.add('completed');
        }

        const divGauche = document.createElement('div');
        divGauche.className = 'task-item-left';         /** création d'un div conteneur pour aligner le texte et la case à cocher sur la gauche **/

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';         /** déclaration du type input en tant que case à cocher (checkbox) **/
        checkbox.className = 'task-checkbox';
        checkbox.checked = tache.terminee;
        /** création d'un événement au changement de statut du boutton lorsqu'il est cliqué(boutton)**/
        checkbox.addEventListener('change', () => changerStatutTache(tache.id));

        const spanTexte = document.createElement('span');         /** création de l'élément span qui va contenir le libellé textuel de notre tâche **/
        spanTexte.className = 'task-text';
        spanTexte.textContent = tache.texte;
        /** imbrication des éléments enfants (la case et le texte) dans notre div de gauche **/
        divGauche.appendChild(checkbox);
        divGauche.appendChild(spanTexte);

        const boutonSupprimer = document.createElement('button');
        boutonSupprimer.className = 'delete-btn';
        boutonSupprimer.textContent = 'Supprimer'; /** Création d'un boutton 'Supprimer'
         (pour supprimer les tâches faites ou alors celle mise par erreur**/

        boutonSupprimer.addEventListener('click', () => supprimerTache(tache.id));
        /** ajout de l'événement Listener pour le boutton quand la souris 'click' cela supprime la tâche sélectionner **/
        li.appendChild(divGauche);
        li.appendChild(boutonSupprimer);

        elListeConteneur.appendChild(li);         /** insertion finale de la ligne de tâche complète (li) dans la liste HTML principale **/
    });

    mettreAJourCompteur();

    /** Sauvegarde de la liste mise à jour dans le stockage local du navigateur sous format texte approprié (JSON) **/
    localStorage.setItem('Tâches Sauvegardées', JSON.stringify(listeTaches));
}
/** fonction d'ajout d'une nouvelle tâche. **/
function ajouterNouvelleTache() {
    const texteSaisie = elInputTache.value.trim();
    /** trim éviter les espaces inutiles avant le champ de saisie et après **/

    if (texteSaisie === '') {
        return; /** afin d'éviter les tâches sans champ de texte (vide) **/
    }
    /** Ici une constante si on écrit bien dans le champ de saisie.**/
    const nouvelleTache = {
        id: Date.now(),
        texte: texteSaisie, /** champ de saisie **/
        terminee: false /** vu qu'on ajoute une tâche, elle n'est pas
         fini, alors elle est automatiquement mis en 'false'**/
    };

    listeTaches.push(nouvelleTache);
    elInputTache.value = '';         /** réinitialisation du champ de saisie (vide) pour pouvoir écrire une nouvelle tâche proprement **/
    afficherListeTaches();
}

/** fonction changerStatutTache : **/
function changerStatutTache(idTache) {
    listeTaches = listeTaches.map(tache => {
        if (tache.id === idTache) {
            return { ...tache, terminee: !tache.terminee };
        } /** On a une fonction avec une condition if ou avec map,
         on va parcourir toute la liste puis dès qu'on trouve l'élément concerné (ID),
         on crée une copie de la tâche en inversant son état (!==),
         tout en ne touchant pas au reste des tâches de la liste. **/
        return tache;
    });

    afficherListeTaches();
}

function supprimerTache(idTache) {
    listeTaches = listeTaches.filter(tache => tache.id !== idTache);
    afficherListeTaches(); /** 'filter' filtre les éléments d'un tableau, puis en créé un nouveau
     en insérant les données/éléments qui valident la condition : tache.id !== idTache (contraire de sa valeur grâce au !==)**/
}

elBoutonAjouter.addEventListener('click', ajouterNouvelleTache);/** ajout d'un event listener sur
 le boutonAjouter, comme ça le 'click' de la souris peut ajouter
 une nouvelle tâche si le champ de saisie est rempli**/

elInputTache.addEventListener('keydown', (evenement) => {
    if (evenement.key === 'Enter') { /** si on appuie sur la touche 'entrée' celle-ci rajoutera une tâche comme le 'click' **/
    ajouterNouvelleTache();
    }
});

/** Parcours de chaque bouton de filtre pour y ajouter un événement au clic de la souris **/
elBoutonsFiltre.forEach(bouton => {
    bouton.addEventListener('click', (evenement) => {
        /**On retire la classe 'active' de tous les boutons pour réinitialiser leur apparence visuelle **/
        elBoutonsFiltre.forEach(b => b.classList.remove('active'));

        /** On ajoute la classe 'active' uniquement sur le bouton qui vient d'être cliqué **/
        evenement.target.classList.add('active');

        /** On met à jour notre variable globale avec la valeur de l'attribut data-filter du bouton cliqué **/
        filtreActuel = evenement.target.getAttribute('data-filter');

        afficherListeTaches();
    });
});

afficherListeTaches();
