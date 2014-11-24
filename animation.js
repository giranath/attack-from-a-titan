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
  var entity = new Entity();
  entity.velocity.x = 0.2;
  entity.velocity.y = 0.2;
  
  entity.position.x = 50;
  entity.position.y = 50;

  var test = world.addEntity(entity);  

  
  window.setInterval(function() {
    armmove(entity.position.x, entity.position.y);
  
    if(entity.position.x > 750 || entity.position.x < 50) {
      entity.velocity.x *= -1;
    }

    if(entity.position.y > 550 || entity.position.y < 50) {
      entity.velocity.y *= -1;
    }
    
  }, STEP_DURATION);
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
