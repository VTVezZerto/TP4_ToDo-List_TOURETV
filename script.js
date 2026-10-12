/** Création liste vide **/
let listeTaches = [];

const elInputTache = document.getElementById('task-input');
const elBoutonAjouter = document.getElementById('add-btn');
const elListeConteneur = document.getElementById('task-list');
const elCompteur = document.getElementById('task-counter');

/** fonction qui va interragir avec une constante pour voir si elle n'est pas terminé **/
function mettreAJourCompteur() {
    const tachesRestantes = listeTaches.filter(tache => !tache.terminee);
    elCompteur.textContent = tachesRestantes.length;
}

/** fonction d'affichage **/
function afficherListeTaches() {
    elListeConteneur.innerHTML = ''; /** affichage vide **/

    listeTaches.forEach(tache => { /** affichage  avec forEach parcours et affichage de chaque tache **/
    const li = document.createElement('li');
        li.className = 'task-item';
        if (tache.terminee) { /** si tâche terminée return 'completed' **/
            li.classList.add('completed');
        }

        const divGauche = document.createElement('div');
        divGauche.className = 'task-item-left';         /** **/

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';         /** **/
        checkbox.className = 'task-checkbox';
        checkbox.checked = tache.terminee;
            /** création d'un événement au changement de statut du boutton lorsqu'il est cliqué(boutton)**/
        checkbox.addEventListener('change', () => changerStatutTache(tache.id));

        const spanTexte = document.createElement('span');         /** **/
        spanTexte.className = 'task-text';
        spanTexte.textContent = tache.texte;
        /** **/
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

        elListeConteneur.appendChild(li);         /** **/
    });

    mettreAJourCompteur();
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
    elInputTache.value = '';         /** **/
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
    if (evenement.key === 'Enter') { /** si on appuie sur la touche 'entrée' celle-ci
                                        rajoutera une tâche comme le 'click' **/
        ajouterNouvelleTache();
    }
});

afficherListeTaches();
