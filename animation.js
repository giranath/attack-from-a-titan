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
      titan = new Titan(arm);

  titan.tag = "titan";
  titan.position.y = 600;
  titan.move_arm_to(0, 800);

  arm.tag = "arm";

  // Définition des sons
  var sounds = {
    miam : new Audio("assets/sounds/miam.wav"),
    background : new Audio("assets/sounds/guren_no_yumiya.mp3")
  };

  // On joue la musique de fond
  sounds.background.volume = 0.4;
  sounds.background.play();

  // Gestion du titan et de ses proies
  var titan_target = null,
      titan_callback = function(titan_p, action)
  {

    if(action == "pick")
    {
      // Le titan choisi l'humain le plus proche de lui
      return function() 
      {
        var posX = Math.random() * 800;
        var posY = Math.random() * 100 + 500;
     
        // Le titan dirige son bras vers l'humain le plus près
        titan_target = world.neirestWithTag("human", titan);

        if(titan_target != null)
        {
          var distance = vector_sub(titan_target.position, vector_add(titan_p.position, new Vector2(10, 330))).length();

          // Si l'humain n'est pas trop loin il le mange 
          if(distance <= 250)
          {
            titan_target.state = HUMAN_STATES.FROZEN;
        
            titan_p.move_arm_to_async(titan_target.position.x, titan_target.position.y, titan_callback(titan_p, "eat"));
          }
          else 
          {
            // Personne n'est proche, le titan doit se cacher
            titan_p.move_arm_to_async(titan_p.position.x, titan_p.position.y + 330, function() 
            {
              var id = world.find(titan_p.getArm());
              world.changeLayerOf(id, false);

              titan_p.move_arm_to_async(titan_p.position.x + 10, 600, function()
              {
                titan_p.go_to(titan_p.position.x, 600, function()
                {
                  // Le titan est caché
                  world.eachWithTag("human", function(index, entity)
                  {
                    entity.go_to(Math.random() * 800, Math.random() * 30 + 520, function()
                    {
                      
                    });
                  });
                  
                  // Le titan réapparait pour attraper plus de personnes
                  window.setTimeout(function() 
                  {
                    titan_p.go_to(titan_p.position.x, 0, function(){
                      world.changeLayerOf(id, true);
                      titan_callback(titan_p, "pick")();
                    });
                  }, Math.random() * 5000);
                });
              });
            });
          }
        }
        else
        {
          // Le titan a mangé toute l'humanité!
        }
      };
    }

    // Le titan déplace sa main vers sa bouche
    else if(action == "eat")
    {
      return function() 
      {
        if(titan_target != null)
        {
          world.removeEntity(world.find(titan_target));
          titan_p.move_arm_to_async(titan_p.position.x + 120, titan_p.position.y + 230, function() 
          {
            sounds.miam.play();
            
            window.setTimeout(function()
            {
              titan_callback(titan_p, "pick")();
            }, 1000);
          });
          titan_target = null;
        }
      };
    }
  };
 
  window.setTimeout(function()
  {
    titan.go_to(titan.position.x, 0, function() 
    {
      window.setTimeout(function() 
      {
        var id = world.find(titan.getArm());
        world.changeLayerOf(id, true);
        
        titan_callback(titan, "pick")();
      }, 1000);
    });
  }, 5000);

  // Ajout du titan dans le monde 
  world.addEntity(titan, false);
  
  // Ajout du bras dans le monde
  world.addEntity(arm, false);
  
  // On spawn 20 humains
  for(var i = 0; i < 20; i++)
  {
    var human = new Human();
    human.position.x = Math.random() * 800;
    human.position.y = (Math.random() * 30) + 510;
    human.speed = Math.random() * 10;
    human.tag = "human";
  
    human.go_to(Math.random() * 800, (Math.random() * 30) + 510, function(succeed)
    {
      // Quoi faire lorque l'humain s'est déplacé 
    });

    world.addEntity(human, true);
  }
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
  window.setInterval(function()            // On met à jour le monde toutes les 16 ms
  {
    world.step(STEP_DURATION);
    world.draw();
  }, STEP_DURATION);
  
  // Initialisation du monde
  initWorld(world);  
  
  position_soleil("soleil_lune");
}
