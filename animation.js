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
  var arm = new TitanArm(),
      titan = new Titan(arm),
      arm2 = new TitanArm(),
      titan2 = new Titan(arm2),
      arm3 = new TitanArm(),
      titan3 = new Titan(arm3);

  titan2.position.x = 50;
  titan3.position.x = 600;
 
  var titan_callback = function(titan_p)
  {
    return function() {
      var posX = Math.random() * 800;
      var posY = Math.random() * 100 + 500;

      titan_p.move_arm_to_async(posX, posY, titan_callback(titan_p));
    };
  };
 
  titan.move_arm_to_async(500, 500, titan_callback(titan)); 
  titan2.move_arm_to_async(400, 400, titan_callback(titan2)); 
  titan3.move_arm_to_async(400, 400, titan_callback(titan3)); 
  
  var test = world.addEntity(titan, false);
  world.addEntity(arm, true);

  world.addEntity(titan2, false);
  world.addEntity(arm2, true);
  
  world.addEntity(titan3, false);
  world.addEntity(arm3, true);
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
