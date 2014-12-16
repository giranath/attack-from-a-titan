var angle_global = 0;
var svg_Soleil = 0;
var centre_x = 400;
var centre_y = 500;
var svg_Background = "";

/**
*Détermine la saison actuelle
*@return La saison actuelle
*/
function detecter_saison()
{
  var aujourdhui = new Date();
  var printemp = new Date(aujourdhui.getFullYear(), 2, 21);
  var ete = new Date(aujourdhui.getFullYear(), 5, 21);
  var automne = new Date(aujourdhui.getFullYear(), 8, 21);
  var hiver = new Date(aujourdhui.getFullYear(), 11, 21);
  var saison = "";

  if(aujourdhui.getMonth() < printemp.getMonth() || aujourdhui.getMonth() >= hiver.getMonth())
  {
    saison="hiver";
  }
  else if(aujourdhui.getMonth() < ete.getMonth())
  {
    saison="printemp";
  }
  else if(aujourdhui.getMonth() < automne.getMonth())
  {
    saison="ete";
  }
  else
  {
    saison="automne";
  }
  
  return saison;
}  


/**
*Détermine une position selon la saison
*@param la saison actuelle
*@return une position x 
*/
function selection_saison(saison)
{
  var position_x = 0;

  switch(saison)
  {
    case "ete":
      position_x = -800;
      break;
    case "automne":
      position_x = -1600;
      break;
    case "hiver":
      position_x = -2400;
      break;
    default:
      position_x = 0;
  }
  
  return position_x;
}

function position_soleil(id_soleil, id_background)
{
  svg_Background = document.getElementById(id_background);
  var frequence_temps = 7.5;
  svg_Soleil = document.getElementById(id_soleil);
  
  var move_time = function()
  {  
    var date = new Date();
    var heure = date.getHours();
    var minute = date.getMinutes();
    var seconde = date.getSeconds();
    var heure_seconde = (heure*60+minute)*60+seconde;
    var total_seconde = 24*60*60;

    angle_global = (heure_seconde/total_seconde)*360

    svg_Soleil.setAttribute('transform', 'rotate('+angle_global+' 400 500)');
    svg_Background.setAttribute('x', selection_saison(detecter_saison()));
  }
  
  move_time();
  setInterval(move_time, frequence_temps*1000); //*1000, car c'est le temps en milliseconde
}

