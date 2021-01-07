//  BAR
var pointsrecus = 0; // Track overall donations
var maxpoints = 1; // Overall goal
var percent = doPercent( pointsrecus, maxpoints ); // Percentage of donations out of a current goal segment
var fields;
var dictionnaire=[];
var pollActive=false;
var widgetsDansLaRondeFinale=[]


var rondeAFaire=0;
//    # 0= début du jeu
//    # 1= Ronde A
//    # 2= Ronde B
//    # 3= Ronde C


var widgetNumber = 4
//    # 1= coin supérieur gauche
//    # 2= coin supérieur droite
//    # 3= coin inférieur gauche
//    # 4= coin inférieur droite
//    # 5= duel gauche
//    # 6= duel droite

var overrideUserBar= -1

var userBar = 0
//   # 0 correspond au keyword #1
//   # 1 correspond au keyword #2
//   # 2 correspond au keyword #3
//   # 3 correspond au keyword #4

  let artistesDuJeu=[
    "deborah kadabra",
    "tony tequila",
    "aliss love",
    "nicole kidcat",
    "lady monrose",
    "crystal starr",
    "sarah poannaco",
    "robin brutal"
    ];

var gagnantA =[];
var gagnantB =[];

var listOfUsersInGame

console.log("hello world!");
let userOptions = {
    channelName: "",
    wordTimer: "",
    wordsLimit: "",
    firstLetter: "", //if you want to limit just to hashtags or username mentions use # or @
    onlyUniqueUsers: "", //Allow users to have just one vote only
};
let words = reinitiateWords(); //Il faut changer ça pour une fonction qui réinitialise la liste des words.
let users = [];
createddictionnary();
let nombrePourLaRondeFinale=2;


//** LOAD IN INITIAL WIDGET DATA
//*
//*
window.addEventListener('onWidgetLoad', function (obj) {
  // Get base data
  let data = obj["detail"]["session"]["data"];
  const fieldData = obj["detail"]["fieldData"];
  fields = fieldData;
  // Set goal live
  reloadBar()
  cacherWidget()
  
  
  
  userOptions["channelName"] = obj["detail"]["channel"]["username"];

});


window.addEventListener('onEventReceived', function (obj) {
    if (obj.detail.listener !== "message") return;
  	console.log('words : ');
  	console.log(words);
    let data = obj.detail.event.data;
    let message = html_encode(data["text"]);
  	message = message.toLowerCase();
  	console.log('message then type of message ');
  	console.log(message);
  	console.log(typeof message);
    let user = data["displayName"];
    let userstate = {
        "mod": parseInt(data.tags.mod),
        "badges": {
            "broadcaster": (user === userOptions["channelName"])
        }
    };
    if (userstate.mod==true || userstate.badges.broadcaster==true) { //Si on a un message
      						//!resetpoll ET que la personne qui l'écrit est soit modérateur ou Bro
        if (dictionnaire.includes(message)){
      	    console.log("le message est dans le dictionnaire");
 	       if ((message)==='!resetpoll'){
    	  		words = reinitiateWords();
        		users = [];
    	  		console.log("poll resetted");
             	maxpoints=1;
             	reloadBar();
             	cacherWidget();
        		return;
      	   } else if ((message)==='!a'){
    	  		console.log("!a");
             	apparaitreWidget();
        		return;
           } else if ((message)==='première ronde!'){
             	console.log("première ronde if statement passed")
             	premiereRonde();
             	words = reinitiateWords();
           } else if ((message)==='deuxième ronde!'){
             	console.log("deuxieme ronde if statement passed")
             	deuxiemeRonde();
             	words = reinitiateWords();
           } else if ((message)==="c'est le temps pour la ronde finale!"){
             	console.log("troisieme ronde if statement passed")
             	rondeFinaleADeux();
           } else if ((message)==='ronde à trois!'){
             	console.log("troisieme ronde if statement passed")
             	rondeFinaleATrois();
           } else if ((message)==='ronde finale à quatre!'){
             	console.log("troisieme ronde if statement passed")
             	rondeFinaleAQuatre()
           } else if (message.includes("vous pouvez maintenant voter pour")==true){
             	console.log("vous pouvez maintenant passed")
             	startPoll();
           } else if (message.includes("a gagné la ronde!")==true ||
                     message.includes("nous avons deux gagnants à cette ronde!")==true ||
                     message.includes("nous avons trois gagnants à cette ronde!")==true ||
                     message.includes("a gagné la finale!")==true){
             	showWinner();
           } else if (message.includes("à la prochaine bataille!")==true ||
                     message.includes("c'était le lipsync battle")==true){
             	console.log("cacher widget est cense avoir runné")
             	cacherWidget();
             	setTimeout(() => {words = reinitiateWords();
        						  users = [];
    	  						  console.log("poll resetted");
             					  maxpoints=1;
             					  reloadBar();   }, 2100);
           } else if (message.includes("bravo à tous les participant.e.s et merci pour vos votes!")==true){
             	stopPoll();
           }
        }
      	
    }
  	if (pollActive==true) {
      	console.log("####pollactive = true")
    	let parts = message.split(" ");
    	for (let i in parts) {
    	    poll(parts[i])
   	     }
    }

});

function html_encode(e) {
    return e.replace(/[\<\>\"\^]/g, function (e) {
        return "&#" + e.charCodeAt(0) + ";";  
    });
}

function poll(word) {
    if (userOptions.firstLetter !== "" && userOptions.firstLetter !== word.charAt(0)) return false;
    
  	for (let i=0; i<words.length; i++) {
      console.log(i)
      if (words[i].word.includes(word) == true){
        console.log("ispresent")
        words[i]['count']++;
        reloadBar();
      }
    }
    return true;
}



//#################################################################################################
//RAJOUT
function reinitiateWords() {
  	console.log("reinitiate words function started")
  	let i = 0;
  	let dragList=[
	      ["#1"],
	      ["#2"],
	      ["#3"],
	      ["#4"]];
    let wordlist = [];
    if (rondeAFaire==3){    
      	console.log("draglist pour ronde3")
      	dragList=dragListRondeFinale
    } 
  	while (dragList[i]){
       	wordlist.push({
          		word: dragList[i],
          		count: 0,});
      	i++
  	  }
  	return wordlist;
}

//** CALCULATION FUNCTIONS FOR DONATIONS BAR
//
//
function reloadBar() {
  maxpoints= checkmaxpoints();
  // What's the current dono bar total, then?
  // Get goal segment amount
  pointsrecus=words[userBar]['count'];
  var strmaxpoints=maxpoints.toString();
  $('#progress .endgame .amount').text(strmaxpoints ); //Ici le $ dans la fonction text correspon au chiffre affiché sur l'étiquette
  // Set percent
  percent = doPercent( pointsrecus, maxpoints );
  // Update goal bar
  $('#progress .loading .amount').text(pointsrecus); //ici le $ dans la fonction text correspond au signe de $ affiché sur l'étiquette
  //### ALTERNATIVE $('#progress .loading .amount').text(pointsrecus.toFixed(2) ); //ici le $ dans la fonction text correspond au signe de $ affiché sur l'étiquette
  
  $('#progress .loading').css(
    {
      'width': percent + '%'
    });
}

function premiereRonde(){
  console.log("première ronde function")
  rondeAFaire=1;  
  if (widgetNumber <= 4) {
    userBar=widgetNumber-1;
    apparaitreWidget()
  }   
}

function deuxiemeRonde(){
  console.log("deuxième ronde function")
  rondeAFaire=2;  
  if (widgetNumber <= 4) {
    userBar=widgetNumber-1;
    apparaitreWidget()
  }     
}

function rondeFinaleADeux(){
  rondeAFaire=3;
  nombrePourLaRondeFinale=2;
  dragListRondeFinale=[['#1'],
                       ['#2']];
  if (widgetNumber >=5){
        userBar=widgetNumber-5;
        apparaitreWidget();
  }
}

function rondeFinaleATrois(){
  rondeAFaire=3;
  nombrePourLaRondeFinale=3;
  dragListRondeFinale=[["#1"],
	                   ["#2"],
	                   ["#3"]];
  if (widgetNumber <=3){
	 	       userBar=widgetNumber;
		       apparaitreWidget();
  }
}
 
function rondeFinaleAQuatre(){
  rondeAFaire=3;
  nombrePourLaRondeFinale=4;
  dragListRondeFinale=[["#1"],
	                   ["#2"],
	                   ["#3"],
	                   ["#4"]];
  if (widgetNumber <=4){
 	       userBar=widgetNumber;
	       apparaitreWidget();
  }
}

function startPoll(){
  if (rondeAFaire==1 || rondeAFaire==2){
    if (widgetNumber <= 4){
      pollActive=true;
    }
  } else if (rondeAFaire==3){
    words=reinitiateWords();
    if (nombrePourLaRondeFinale==2){
      if (widgetNumber >=5){
        pollActive=true;
      }
    } else if (nombrePourLaRondeFinale==4){
 	     console.log("la ronde finale se fait à 4") 
      	if (widgetNumber <=4){
          pollActive=true;
        }
    } else if (nombrePourLaRondeFinale==3){
	      console.log("la ronde finale se fait à 3")
		  if (widgetNumber <=3){
               pollActive=true;
        }
    }
  }
}

function stopPoll(){
  console.log("function stopPoll à roulé");
  pollActive=false;
}

function showWinner(){  
  console.log("function showWinner à roulé (il y a rien dans la fonction)")
}
  
function doPercent( donated, maxpoints ) {
  var perc = donated / maxpoints;
  var amount = perc * 100;
  if ( amount < 10 ) {
    amount = 10;
  }
  if ( amount > 100 ) {
    amount = 100;
  }
  return amount;
}

function checkmaxpoints(){
  let max=1;
  let i=0;
  while (words[i]) {
    if (words[i]['count']>max) {
      max=words[i]['count']
    }
    i++
  }
  return max;
}


function createddictionnary(){
  let newcommand
  	for (let i=0; i<artistesDuJeu.length; i++){
      newcommand=artistesDuJeu[i]+" a gagné la ronde!";
      dictionnaire.push(newcommand);
      newcommand=artistesDuJeu[i]+" a gagné la finale!";
      dictionnaire.push(newcommand);
      newcommand="tout d'abord : "+artistesDuJeu[i];
      dictionnaire.push(newcommand);
      newcommand="et puis : "+artistesDuJeu[i];
      dictionnaire.push(newcommand);
      newcommand="dans le coin gauche : "+artistesDuJeu[i];
      newcommand="dans le coin droit : "+artistesDuJeu[i];
      newcommand="dans le coin supérieur gauche : "+artistesDuJeu[i];
      dictionnaire.push(newcommand);
      newcommand="dans le coin supérieur droit : "+artistesDuJeu[i];
      dictionnaire.push(newcommand);
      newcommand="dans le coin inférieur gauche : "+artistesDuJeu[i];
      dictionnaire.push(newcommand);
      newcommand="dans le coin inférieur droit : "+artistesDuJeu[i];
      dictionnaire.push(newcommand);
    }
  	dictionnaire.push("!resetpoll");
  	dictionnaire.push("!a");
  	dictionnaire.push("première ronde!");
  	dictionnaire.push("deuxième ronde!");
  	dictionnaire.push("c'est le temps pour la ronde finale!");
    dictionnaire.push("ronde à trois!")
  	dictionnaire.push("Ronde finale à quatre!")
  	dictionnaire.push("vous pouvez maintenant voter pour votre performance favorite. pour ce faire, entrez hashtag suivi du numéro du candidat.e choisi. par exemple : #8");
 	dictionnaire.push("bravo à tous les participant.e.s et merci pour vos votes!");
  	dictionnaire.push("nous avons deux gagnants à cette ronde!")
  	dictionnaire.push("nous avons trois gagnants à cette ronde!") 
  	dictionnaire.push("à la prochaine bataille!");
  	dictionnaire.push("c'était le lipsync battle!");
  	
}

console.log("goodbye cruel world!")


function cacherWidget(){
  $('*').css({"animation": "fadeOut ease 2s", "animation-fill-mode": "forwards"});
}

function apparaitreWidget(){
  $('*').css({"animation": "fadeIn ease 2s", "animation-fill-mode": "forwards"});
  console.log("testing2");
}

