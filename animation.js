//==================================================================================
// FICHIER: animation.js
// AUTEUR : Nathan Giraldeau
// DATE   : 12 novembre 2014
//----------------------------------------------------------------------------------
// DESCIPTION:
// Gère l'animation du géant
//==================================================================================

//==================================================================================
// CONSTANTES
//==================================================================================
var STEP_DURATION = 50;

//==================================================================================
// PROGRAMME PRINCIPAL 
//==================================================================================

//----------------------------------------------------------------------------------
function initWorld(world) 
//----------------------------------------------------------------------------------
/**
 * Initialise un monde
 * @param world Le monde à initialiser
 */
{
  var titan = new Titan("entity-titan");
 
  var callback = function() {
    var posX = Math.random() * 800;
    var posY = Math.random() * 600;

    titan.move_arm_to_async(posX, posY, callback);
  };
  
  titan.move_arm_to_async(500, 500, callback); 
  
  var test = world.addEntity(titan);
}

//----------------------------------------------------------------------------------
function setup()
//----------------------------------------------------------------------------------
/**
 * @brief Met en place les éléments nécéssaire au bon fonctionnement de l'application
 */
{

  var world = new World("canvas");         // On s'instancie un monde
 
  // Définition de la boucle principale 
  window.setInterval(function()         // On met à jour le monde toutes les 16 ms
  {
    world.step(STEP_DURATION);
    world.draw();
  }, STEP_DURATION);
  
  // Initialisation du monde
  initWorld(world);  
}
