/* ******************************************************************
 * Constantes de configuration
 */
const apiKey2 = "8eaa8eb9-298b-4ff8-a3f3-1aad4aeed2ae";
const serverUrl = "https://lifap5.univ-lyon1.fr";  /*"http://localhost:3000";*/

/* ******************************************************************
 * Gestion des tabs "Voter" et "Toutes les citations"
 ******************************************************************** */

/**
 * Affiche/masque les divs "div-duel" et "div-tout"
 * selon le tab indiqué dans l'état courant.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majTab(etatCourant) {
  console.log("CALL majTab");
  const dDuel = document.getElementById("div-duel");
  const dTout = document.getElementById("div-tout");
  const dAjout = document.getElementById("div-ajout");

  const tDuel = document.getElementById("tab-duel");
  const tTout = document.getElementById("tab-tout");
  const tAjout = document.getElementById("tab-ajout");


  if (etatCourant.tab === "duel") {
    dDuel.style.display = "flex";
    tDuel.classList.add("is-active");

    dTout.style.display = "none";
    tTout.classList.remove("is-active");

    dAjout.style.display = "none";
    tAjout.classList.remove("is-active");

  } else if(etatCourant.tab === "tout")
  {
    dTout.style.display = "flex";
    tTout.classList.add("is-active");

    dDuel.style.display = "none";
    tDuel.classList.remove("is-active");

    dAjout.style.display = "none";
    tAjout.classList.remove("is-active");
  }
  else
  {
    dAjout.style.display = "flex";
    tAjout.classList.add("is-active");

    dDuel.style.display = "none";
    tDuel.classList.remove("is-active");

    dTout.style.display = "none";
    tTout.classList.remove("is-active");
  }
}

/**
 * Mets au besoin à jour l'état courant lors d'un click sur un tab.
 * En cas de mise à jour, déclenche une mise à jour de la page.
 *
 * @param {String} tab le nom du tab qui a été cliqué
 * @param {Etat} etatCourant l'état courant
 */
function clickTab(tab, etatCourant) {
  console.log(`CALL clickTab(${tab},...)`);
  if (etatCourant.tab !== tab) {
    etatCourant.tab = tab;
    majPage(etatCourant);
  }
}

/**
 * Enregistre les fonctions à utiliser lorsque l'on clique
 * sur un des tabs.
 *
 * @param {Etat} etatCourant l'état courant
 */
function registerTabClick(etatCourant) {
  console.log("CALL registerTabClick");
  document.getElementById("tab-duel").onclick = () =>
    clickTab("duel", etatCourant);
  document.getElementById("tab-tout").onclick = () =>
    clickTab("tout", etatCourant);
  document.getElementById("tab-ajout").onclick = () =>
    clickTab("ajout", etatCourant);
}

/* ******************************************************************
 * Gestion de la boîte de dialogue (a.k.a. modal) d'affichage de
 * l'utilisateur.
 * ****************************************************************** */

/**
 * Fait une requête GET authentifiée sur /whoami
 * @returns une promesse du login utilisateur ou du message d'erreur
 */
function fetchWhoami(etatCourant) {
  return fetch(serverUrl + "/whoami", { headers: { "x-api-key": etatCourant.apiKey } })
    .then((response) => response.json())
      .then((jsonData) => {
        if (jsonData.status && Number(jsonData.status) != 200) {
          return { err: jsonData.message };
        }
        return jsonData;
      })
    .catch((erreur) => ({ err: erreur }));
}

/**
 * Affiche ou masque la fenêtre modale de login en fonction de l'état courant.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majModalLogin(etatCourant) {
  const modalClasses = document.getElementById("mdl-login").classList;
  if (etatCourant.loginModal) {
    modalClasses.add("is-active");
  } else {
    modalClasses.remove("is-active");
  }
}

/**
 * Déclenche l'affichage de la boîte de dialogue du nom de l'utilisateur.
 * @param {Etat} etatCourant
 */
function clickFermeModalLogin(etatCourant) {
  etatCourant.loginModal = false;
  majPage(etatCourant);
}

/**
 * Déclenche la fermeture de la boîte de dialogue du nom de l'utilisateur.
 * @param {Etat} etatCourant
 */
function clickOuvreModalLogin(etatCourant) {
  etatCourant.loginModal = true;
  majPage(etatCourant);
}

/**
 * Enregistre les actions à effectuer lors d'un click sur les boutons
 * d'ouverture/fermeture de la boîte de dialogue affichant l'utilisateur.
 * @param {Etat} etatCourant
 */

function registerLoginModalClick(etatCourant) {
  document.getElementById("btn-close-login-modal1").onclick = () =>
    clickFermeModalLogin(etatCourant);
  document.getElementById("btn-close-login-modal2").onclick = () =>
    clickFermeModalLogin(etatCourant);
  document.getElementById("btn-open-login-modal").onclick = () =>
    clickOuvreModalLogin(etatCourant);
}

/* ******************************************************************
 * Initialisation de la page et fonction de mise à jour
 * globale de la page.
 * ****************************************************************** */

/**
 * Mets à jour la page (contenu et événements) en fonction d'un nouvel état.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majPage(etatCourant) {
  console.log("CALL majPage");
  majTab(etatCourant);
  majModalLogin(etatCourant);
  majConnection(etatCourant);
  registerTabClick(etatCourant);
  registerLoginModalClick(etatCourant);
  registerAddQuoteClick(etatCourant);
  registerConnectionClick(etatCourant);
  registerVoteClick(etatCourant);
  registerSetQuote(etatCourant);
}

/**
 * Appelé après le chargement de la page.
 * Met en place la mécanique de gestion des événements
 * en lançant la mise à jour de la page à partir d'un état initial.
 */
function initClientCitations() {
  console.log("CALL initClientCitations");
  const etatInitial = {
    tab: "duel",
    loginModal: false,
    loginConnection:false,
    apiKey: undefined,
    loginName: undefined,
    idCitation: undefined,
  };
  trouver_deux_citations(etatInitial);
  lanceCitationsEtInsereCitations(etatInitial);
  majPage(etatInitial);
}

// Appel de la fonction init_client_duels au après chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  console.log("Exécution du code après chargement de la page");
  initClientCitations();
});


/* ******************************************************************
 * Affichage de l'ensemble de citation de l'onglet
 * "Toutes les citations"
 * ****************************************************************** */

/**
 * Récupère toutes les citations du serveur, puis convertit 
 * les données JSON reçues en tableau 
 * @param {Etat} etatCourant l'état courant
 */

function fetchCitation()
{
  return fetch(serverUrl + "/citations")
    .then((response) => response.json())
      .then((jsonData) => {
        if (jsonData.status && Number(jsonData.status) != 200) {
          return { err: jsonData.message };
        }
        return jsonData;
      })
    .catch((erreur) => ({ err: erreur }));
}

/**
 * Retourne les données passer en paramètre (tableau de citation)
 * sous formes d'un tableau HTML
 * @param {JSON} jsonData le tableau de citations au format JSON
 */
function listeCitations(jsonData,etatCourant)
{
  const liste_citations= jsonData.map( (x , index) => 
                                      `<tr>
                                       <th>${index +1}</th>
                                       <td>${x["character"]}</td>
                                       <td>${x["quote"]}</td>
                                       <td><input type="button" class="button is-primary is-small" style="color:black" value="Détails"
                                            id=${x["_id"]} onclick="showDetails(this.getAttribute('id'))">
                                       </td>
                                       `+((x["addedBy"]!==undefined && etatCourant.loginName===x["addedBy"])
                                       ? `<td><input id=${x["_id"]} type="button" class="button is-primary is-small" style="color:black" value="Modifier" 
                                               onclick="showSetDetails(this.getAttribute('id'))">
                                          </td></tr>`
                                       : '</tr>')).join(" ");                 
  return liste_citations;
}

/**
 * Fait un appel à fetchCitation(etatCourant),
 * puis à listeCitations(jsonData),
 * modifie le body du tableau pour incrusté les citations obtenues
 * @param {Etat} etatCourant l'état courant
 */
function lanceCitationsEtInsereCitations(etatCourant)
{
  console.log("lanceCitationsEtInsereCitations");
   fetchCitation().then((data) => {
    const tbody = document.getElementById("tabCitations");
    const ok = data.err === undefined;
    if(!ok)
    {
       tbody.innerHTML = `<span class="is-error">${data.err}</span>`;
    }
    else
    {
      tab_citation = listeCitations(data,etatCourant);
      tbody.innerHTML = "<tbody>"+tab_citation+"</tbody>"; 
    }
    return ok;
  });
}

/* ******************************************************************
 * Affichage du détails d'une citation
 * ****************************************************************** */

/**
 * Récupère une citation avec l'id passé en paramètre
 * @param {string} id 
 */

function fetchCitationId(id)
{
   return fetch(serverUrl + `/citations/`+id)
    .then((response) => response.json())
      .then((jsonData) => {
        if (jsonData.status && Number(jsonData.status) != 200) {
          return { err: jsonData.message };
        }
        return jsonData;
      })
    .catch((erreur) => ({ err: erreur }));
}

/**
 * Récupère l'id passé en paramètre pour appeler fetchCitationsId
 * qui retourne les infos de la citations que l'on affiche
 * @param {string} id 
 */

function showDetails(id)
{
  fetchCitationId(id).then((jsonData) =>{
    document.getElementById("citation-details").classList.add("is-active");
    if(jsonData["addedBy"]!==undefined)
    {
      document.getElementById("dAddedBy").innerHTML=jsonData["addedBy"];
    }
    else{
      document.getElementById("dAddedBy").innerHTML="Les Profs";
    }
    document.getElementById("dCharacter").innerHTML=`<p>${jsonData["character"]}</p>`
    document.getElementById("dQuote").innerHTML=`<p>${jsonData["quote"]}</p>`;
    document.getElementById("dOrigin").innerHTML=`<p>${jsonData["origin"]}</p>`;
    document.getElementById("dImage").innerHTML=`<img class="is centered" src="${jsonData["image"]}">`;
    let dCharacterDirec=document.getElementById("dCharacterDirection");
    dCharacterDirec.innerHTML=`<p>${jsonData["characterDirection"]}</p>`;
  })
}

/**
 * ferme la fenêtre du détails d'une citation
 */
function clickFermeDetailsCitationClick() 
{
  document.getElementById("citation-details").classList.remove("is-active");
  document.getElementById("setButton").style.display="none";
}



/**********************************************************
 * Debut de la fonctionnalité modifier citation
 *********************************************************/

/**
 * renvoie la liste du select pour le regard du personnage
 * @param {string} characterDirection 
 * @returns 
 */
function getSelectSetDetails(characterDirection)
{
  if(characterDirection === "Left" )
  {
    other_option="Right";
  }else{
    other_option="Left";
  }
  return `<div class="select is-primary">
  <select id="sCharacterDirection">
    <option>${characterDirection}</option>
    <option>${other_option}</option>
  </select>
  </div>`
 }

/**
 * Récupère l'id passé en paramètre pour appeler fetchCitationsId
 * qui retourne les infos de la citations que l'on affiche
 * avec des inputs pour pouvoir modifier les infos
 * @param {string} id 
 */
 function showSetDetails(id){
  document.getElementById("sId").innerHTML=id;
  fetchCitationId(id).then((jsonData)=>{
  document.getElementById("setButton").style.display="flex";
  document.getElementById("citation-details").classList.add("is-active");
  document.getElementById("dAddedBy").innerHTML=jsonData["addedBy"];
  document.getElementById("dCharacter").innerHTML=
    `<input id="sCharacter" class="input is-primary" type="text" value="${jsonData["character"]}">`;
  document.getElementById("dQuote").innerHTML=
    `<textarea id="sQuote" class="textarea is-primary" cols="30" rows="3" >${jsonData["quote"]}</textarea>`
  document.getElementById("dOrigin").innerHTML=
    `<input id="sOrigin"class="input is-primary" type="text" value="${jsonData["origin"]}">`;
  document.getElementById("dImage").innerHTML=
    `<input id="sImage" class="input is-primary is-centered"  type="text" value="${jsonData["image"]}">`;
  document.getElementById("dCharacterDirection").innerHTML= 
    getSelectSetDetails(jsonData["characterDirection"]);})
}

/**
 * Enregistre les actions à effectuer lors d'un click sur le bouton
 * modifier de la boite de dialogue de modification d'une citation
 * @param {Etat} etatCourant l'état courant
 */
function registerSetQuote(etatCourant)
{
  document.getElementById("setDetails").onclick = () => 
    setQuote(etatCourant);
}

/**
 * Recupère le formulaire de la boite de dialogue 
 * de modification d'une citation
 */
function getSetForm()
{
  return form={
         quote:document.getElementById("sQuote").value,
         character:document.getElementById("sCharacter").value,
         image:document.getElementById("sImage").value,
         characterDirection:document.getElementById("sCharacterDirection").value,
         origin:document.getElementById("sOrigin").value,
        };
}

/**
 * Envoie les modifications d'une citation
 * au serveur 
 * @param {Form} form les nouvelles infos à envoyer
 * @param {Etat} etatCourant l'état courant
 * @param {string} id l'id de la citation
 */

function fetchSetCitation(form,etatCourant,id)
{
  console.log(form);
  fetch(serverUrl + "/citations/"+id,{method: "PUT",
        headers: { "x-api-key":etatCourant.apiKey, "Content-Type": "application/json" },
        body:form})
  .then((response) => response.json())
    .then((jsonData) => {
      if (jsonData.status && Number(jsonData.status) != 200) {
        return { err: jsonData.message };
      } 
        return jsonData;
    })
      .then(()=>{
        clickFermeDetailsCitationClick();
        lanceCitationsEtInsereCitations(etatCourant)
      })
    .catch((erreur) => ({ err: erreur }));
}

/**
 * Modifie les valeurs d'une citation
 * @param {Etat} etatCourant l'état courant
 */
function setQuote(etatCourant)
{
  const form=convertFieldToJson(getSetForm());
  const id=document.getElementById("sId").innerText;
  fetchSetCitation(form,etatCourant,id);
}


/* ******************************************************************
 * Ajout d'une citation
 * ****************************************************************** */

/**
 * Recupère uniquement les champs obligatoires sous forme de tableau
 */
function getFieldsRequired()
{
  const donnees_champs=new Array(
   document.getElementById("quote").value,
   document.getElementById("character").value,
   document.getElementById("origin").value,
  )
  return donnees_champs; 
}

/**
 * Vérifie que les champs obligatoires sont bien renseignés
 */
function checkFields()
{
  const format=getFieldsRequired().reduce((acc,n) => acc+(n==="" ? 1 : 0),0);
  return format;
}

/**
 * Recupère tout le formulaire sous forme d'objet
 */
function getForm()
{
  const donnees_champs={
    quote: document.getElementById("quote").value,
    character: document.getElementById("character").value,
    image: document.getElementById("image").value,
    characterDirection: document.getElementById("characterDirection").value,
    origin: document.getElementById("origin").value
  }
  return donnees_champs;
}

/**
 * Converti un formulaire passé en paramètre au format JSON
 * @param {Form} form le formulaire
 */
function convertFieldToJson(form)
{
  return JSON.stringify(form);
}

/**
 * Envoie une citation au serveur
 * @param {Etat} etatCourant l'état courant
 * @param {JSON} jsonData formulaire au format JSON
 */
function fetchPostCitation(jsonData,etatCourant)
{
  return fetch(serverUrl + "/citations",
               {headers: { "x-api-key":etatCourant.apiKey, "Content-Type": "application/json" }, 
                method: "POST",
                body:jsonData});
}

/**
 * Ajoute une notification avant une le formulaire
 */
function ajoutNotification(id)
{
  let nouvelNotif = document.createElement("div");
  nouvelNotif.innerHTML = `<button class="delete" aria-label="close" 
                            onclick=this.closest('div').remove()>
                            </button>`;
  let parentDiv= document.getElementById(id).parentNode;
  let formulaire = document.getElementById(id);
  parentDiv.insertBefore(nouvelNotif, formulaire);
  return nouvelNotif;
}


/**
 * Ajoute un texte dans une notification
 * @param {string} phrase le texte
 * @param {boolean} type si vrai la notification apparait en vert,sinon en rouge
 * @param {Element} elt l'element de notification
 */
function ajoutTextNotification(phrase,type,elt)
{
  elt.appendChild(document.createTextNode(phrase));
  if(!type)
  {
    elt.setAttribute("class","notification is-danger is-centered");
  }
  else{
    elt.setAttribute("class","notification is-success is-centered");
  }

}

/**
 * Ajoute une nouvelle citation
 * @param {Etat} etatCourant l'état courant
 */
function AddQuote(etatCourant)
{
  const elt=ajoutNotification("formulaire");
  if(checkFields())
  {
    ajoutTextNotification("Certains champs sont mal remplis !",false,elt);

  }else{ 
    const jsonData=convertFieldToJson(getForm());
    fetchPostCitation(jsonData,etatCourant).then((data) => {
      if(!data.ok)
      {
        let phrase="Vous devez être connecté pour pouvoir envoyer une citation";
        ajoutTextNotification(phrase,false,elt);
      }
      else
      {
        ajoutTextNotification("Citation ajouté avec succes !",true,elt);
        lanceCitationsEtInsereCitations(etatCourant);
      }
      return data;
    }).catch((erreur) => ({ err: erreur }));
  }
}

/**
 * Enregistre les fonctions à utiliser lorsque l'on clique
 * sur un bouton du formulaire.
 * @param {Etat} etatCourant 
 */
function registerAddQuoteClick(etatCourant)
{
  document.getElementById("ajouter").onclick = () =>
  AddQuote(etatCourant);
}


/* ***************************************
 * Connexion Utilisateur
 * **************************************/
/**
 * Affiche/masque les boutons "connexion" et "connexion"
 * selon le loginConnection indiqué dans l'état courant.
 * @param {Etat} etatCourant l'état courant
 */
function majConnection(etatCourant)
{
  const btnConnection = document.getElementById("connection");
  const btnDisconnection = document.getElementById("disconnection");
  if(etatCourant.loginConnection){
    btnConnection.style.display = "none";
    btnDisconnection.style.display = "flex";
  }
  else{
    btnConnection.style.display = "flex";
    btnDisconnection.style.display = "none";

    const elt = document.getElementById("elt-affichage-login");
    if (etatCourant.apiKey === undefined) {
    elt.innerHTML = InserePassWord();
    } 
  }
}

/**
 * Enregistre les fonctions à utiliser lorsque l'on clique
 * sur un bouton connexion/deconnexion.
 * @param {Etat} etatCourant 
 */
function registerConnectionClick(etatCourant)
{
  document.getElementById("connection").onclick = () =>
  getPassWord(etatCourant);
  document.getElementById("disconnection").onclick = () =>
  Disconnection(etatCourant);
}

/**
 * @returns renvoie un champs mots de passe
 */
function InserePassWord()
{
  return `<input id="mp" type="password" class="input block" 
            placeholder="Mot de Passe">`;
}

/**
 * Fait une requête sur le serveur et insère le login dans
 * la modale d'affichage de l'utilisateur.
 * @returns Une promesse de mise à jour
 */
function lanceWhoamiEtInsereLogin(etatCourant) {
   fetchWhoami(etatCourant).then((data) => {
    const elt = document.getElementById("elt-affichage-login");
    const ok = data.err === undefined;
    if (!ok) {
      elt.innerHTML = `<div class="block">
                        <input id="mp" type="password" class="input is-danger" 
                          placeholder="Mot de Passe">
                        <p class="help is-danger">Votre mot de passe est invalide</p>
                       </div>`;
    } else {
      elt.innerHTML = `<p class="block" >Bonjour ${data.login}.</p>`;
      etatCourant.loginName=data.login;
      etatCourant.loginConnection=true;
      lanceCitationsEtInsereCitations(etatCourant);
    }
    majPage(etatCourant);
    return ok;
  });
}

/**
 * récupère le mot de passe saisie dans le champs password
 * et le met dans le champs apiKey de l'état courant
 * @param {Etat} etatCourant l'etat courant
 */
function getPassWord(etatCourant)
{
  etatCourant.apiKey =document.getElementById("mp").value;
  lanceWhoamiEtInsereLogin(etatCourant);
}

/**
 * Remet la clé apiKey à undefined Réinitialise la connexion
 * @param {Etat} etatCourant l'état Courant
 */
function Disconnection(etatCourant)
{
  console.log("Disconnection");
  etatCourant.apiKey=undefined;
  etatCourant.loginName=undefined;
  etatCourant.loginConnection=false;
  lanceCitationsEtInsereCitations(etatCourant);
  majPage(etatCourant);
}


/**********************************************************************
 * Affichage de battle de citation 
 * et vote
 *******************************************************************/


/** 
 * genere un nombre aléatoire avec MAthrandom(genere un nombre aléatoire entre 0 et 1)*
 * et math.floor( arondit )
 * @param {number} max
 * @returns {number}
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

/**
 * définit l'orientation de l'image en fonction de sa position (D ou G)
 * @param {string} citation 
 * @param {string} citation_id 
 * 
 */
function orientation_Image(citation,citation_id)
{
  if(citation_id === "citation_1")
  {
    if(citation.characterDirection === "Right")
      return "transform: scaleX(-1)";
    else
      return "transform: scaleX(1)";
  }
  else{
    if(citation.characterDirection === "Right")
      return "transform: scaleX(1)";
    else
      return "transform: scaleX(-1)";
  }
}

/**
 * Détermine si il faut afficher l'image ou non
 * @param {Citation} citation la citation
 * @param {String} citation_id 
 * @returns 
 */
function ajoute_image(citation,citation_id)
{
  if(citation.image === "")
  {
    return " "
  }
  else{
   return `<img src=${citation.image}
            style= '${orientation_Image(citation,citation_id)}'
            />`
  }
}

/**
 * 
 * Change les données d'une citation a partir de son id.
 * @param {string} citation
 * @param {string} citation_id
 */
function modifier_affichage_citation(citation,citation_id)
{
  let elm = document.getElementById(citation_id);
  elm.innerHTML = `<div class="column is-8">
                      <p class="title">
                        ${citation.quote}
                      </p>
                      <p class="subtitle">${citation.character} dans ${citation.origin}</p>
                    </div>
                    <div class="column is-one-third">
                      <div class="card-image">
                        <figure class="image">
                          ${ajoute_image(citation,citation_id)}
                        </figure>
                      </div>
                    </div>`
}

/**
 * Change les donées liées au deux citatons dans le code html.
 * @param {string} citation_une
 * @param {string} citation_deux
 */
function afficher_deux_citations(citation_une,citation_deux)
{
  modifier_affichage_citation(citation_une,"citation_1");
  modifier_affichage_citation(citation_deux,"citation_2");
}

/**
 * Génere deux citation aléatoire
 * @param {Etat} etatCourant l'etat courant
 */
function trouver_deux_citations(etatCourant) {
  fetchCitation().then((resultat)=>{ // On récupère les citations sous forme de tableau dans {resultat}.
    let longueur_du_tableau = resultat.length;
    let citation_une = getRandomInt(longueur_du_tableau);
    let citation_deux = getRandomInt(longueur_du_tableau);
    if (citation_une === citation_deux) { citation_deux += 1;}
    citation_une = resultat[citation_une]; 
    citation_deux = resultat[citation_deux];
    etatCourant.idCitation={citation_gauche:citation_une._id,
                            citation_droite:citation_deux._id}
    afficher_deux_citations(citation_une,citation_deux);
  })
}

 /**
 * transmets des données au serveurs grace a methode POST
 * via la route /citation/duels
 * @param {JSON} jsDuel
 * @param {Etat} etatCourant
*/
function fetchDuels(etatCourant , jsDuel)
{
  return fetch(serverUrl + "/citations/duels",{method: "POST",
                                        headers: { "x-api-key":etatCourant.apiKey,
                                        "Content-Type": "application/json" }, 
                                        body:jsDuel})
    .then((data) => data.json())
      .then((jsonData) => {
        if (jsonData.status && Number(jsonData.status) != 200) {
          return { err: jsonData.message };
        } 
        return jsonData;
      })
      .catch((erreur) => ({ err: erreur }));
}

/**
 * Indique le resultat de la citation en fonction de la valeur de Bouton.
 * @param {Etat} etatCourant
 * @param {string} Bouton
 */
function clickVote(etatCourant,Bouton)
{
  let resultat;
  if(Bouton==="citationDroite"){
    resultat={ winner: etatCourant.idCitation.citation_droite,
               looser:etatCourant.idCitation.citation_gauche}
  }
  else{
    resultat={ winner: etatCourant.idCitation.citation_gauche,
               looser:etatCourant.idCitation.citation_droite}
  }
  const convertResultat= convertFieldToJson(resultat);
  fetchDuels(etatCourant,convertResultat).then((data)=>{
    console.log(data);
    if(data.err){
     let elt=ajoutNotification("div-duel")
     ajoutTextNotification("Vous devez être connecté pour pouvoir voter !",
                            false,elt);
    }else{
      trouver_deux_citations(etatCourant);}
    })
}

/**
 * Fais appel a clickVote.
 * Fais appel au deux cas possible lors de l'appui sur l'un des deux boutons de vote.
 * @param {Etat} etatCourant
 */
function registerVoteClick(etatCourant)
{ 
  document.getElementById("citationDroite").onclick= () =>
    clickVote(etatCourant, "citationDroite")
  document.getElementById("citationGauche").onclick= () =>
    clickVote(etatCourant, "citationGauche")
}
