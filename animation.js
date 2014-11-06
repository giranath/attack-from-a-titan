var gWorld = null;

/**
 * @brief Met en place les éléments nécéssaire au bon fonctionnement de l'application
 */
function setup()
{
  gWorld = new World();                 // On s'instancie un monde
  
  window.setInterval(function()         // On met à jour le monde toutes les 16 ms
  {
    gWorld.step(16);
    gWorld.draw("canvas");
  }, 16);
  
  var test = gWorld.addEntity(new Entity());
}
