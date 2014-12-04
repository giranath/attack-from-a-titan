var angle_global = 0;
var svg_Soleil = 0;
var incrementer_angle = 0;
var centre_x = 400;
var centre_y = 500;

function position_soleil(id)
{
  svg_Soleil = document.getElementById(id);
  var date = new Date();
  var heure = date.getHours();
  var minute = date.getMinutes();
  var seconde = date.getSeconds();
  var heure_seconde = (heure*60+minute)*60+seconde;
  var total_seconde = 24*60*60;
  var frequence_temps = 7.5;
  
  incrementer_angle = 360/total_seconde*frequence_temps;  // 360/(nombre de secondes dans un jour)
  angle_global = (heure_seconde/total_seconde)*360

  svg_Soleil.setAttribute('transform', 'rotate('+angle_global+' 400 500)');
  
  setInterval(function()
              {
                angle_global += incrementer_angle;
                svg_Soleil.setAttribute('transform', 'rotate('+angle_global+' 400 500)');
              }, frequence_temps*1000); //*1000, car c'est le temps en milliseconde
}

