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
var STEP_DURATION = 50,
    TITAN_UP_SPEED = 2.2,
    TITAN_DOWN_SPEED = 1.2;


//==================================================================================
// GLOBALES 
//==================================================================================
// Définition des sons
var sounds = {
  miam : new Audio("assets/sounds/miam.wav"),
  background : new Audio("assets/sounds/guren_no_yumiya.mp3")
};

//==================================================================================
// PROGRAMME PRINCIPAL 
//==================================================================================


/**
 * Crée un humain dans le monde
 * @param posx La position en x
 * @param posy La position en y
 * @param world Le monde dans lequel créé l'humain
 */
function createHuman(posx, posy, world)
{
    var human = new Human();
    human.position.x = posx;
    human.position.y = posy;
    human.speed = Math.random() * 7 + 3;
    human.tag = "human";
  
    human.go_to(Math.random() * 800, human.position.y, function(succeed)
    {
      // Quoi faire lorque l'humain s'est déplacé 
    });

    world.addEntity(human, true);
    return human;
}


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

  arm.tag = "arm";

  // On joue la musique de fond
  sounds.background.volume = 0.4;
  //sounds.background.play();

  // Gestion du titan et de ses proies
  var titan_target = null,
      first_to_eat  = true,
      titan_callback = function(titan_p, action)
  {

    if(action == "pick")
    {
      // Le titan choisi l'humain le plus proche de lui
      return function() 
      {
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
          // L'humain est trop loin, il se cache pour les tromper
          else 
          {
            titan_callback(titan_p, "hide")();
          }
        }
        else
        {
          titan_callback(titan_p, "hide")();
          // Le titan a mangé toute l'humanité!
          for(var i = 0; i < 10; i++)
          {
            var newBorn = createHuman((Math.random() < 0.5) ? -50 : 850,(Math.random() * 30) + 510,world);
            newBorn.state = HUMAN_STATES.FROZEN;
          }
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
          // S'il s'agit du premier humain mangé alors tous s'enfuient
          if(first_to_eat) 
          {
            first_to_eat = false;

            world.eachWithTag("human", function(index, human) 
            {
              if(human.state != HUMAN_STATES.FROZEN)
              {
                if(Math.random() > 0.1)
                {
                  human.state = HUMAN_STATES.HIDING;
                }
                else
                {
                  human.state = HUMAN_STATES.PANIC;
                }
              }
            });
          }

          world.removeEntity(world.find(titan_target));
          titan_p.move_arm_to_async(titan_p.position.x + 120, titan_p.position.y + 230, function() 
          {
            titan_p.manger();
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
    
    // Le titan se montre
    else if(action == "show")
    {
      return function()
      {
        window.setTimeout(function()
        {
          world.eachWithTag("human", function(index, entity)
          {
            if(Math.random() > 0.1)
            {
              human.state = HUMAN_STATES.HIDING;
            }
            else
            {
              human.state = HUMAN_STATES.PANIC;
            }
          });
        }, 1000);

        titan_p.speed = TITAN_UP_SPEED;
        titan_p.go_to(titan_p.position.x, 0, function()
        {
          titan_p.move_arm_to_async(titan_p.position.x, titan_p.position.y + 430, function() 
          {
            var id = world.find(titan_p.getArm());
          
            world.changeLayerOf(id, true);
            titan_callback(titan_p, "pick")();
          });
        });
      }
    }
    
    // Le titan se cache
    else if(action == "hide")
    {
      return function()
      {
        // Personne n'est proche, le titan doit se cacher
        titan_p.speed = TITAN_DOWN_SPEED;
        titan_p.move_arm_to_async(titan_p.position.x - 20, titan_p.position.y + 430, function() 
        {
          var id = world.find(titan_p.getArm());
          world.changeLayerOf(id, false);

          titan_p.move_arm_to_async(titan_p.position.x - 20, 800, function()
          {
            titan_p.go_to(titan_p.position.x, 600, function()
            {
              // Le titan est caché alors les humains se sentent en sécurité
              world.eachWithTag("human", function(index, entity)
              {
                entity.state = HUMAN_STATES.SECURED;
              });
                  
              // Le titan réapparait pour attraper plus de personnes
              window.setTimeout(function()
              {
                titan_callback(titan_p, "show")();
              }, 5000 + Math.random() * 5000);
            });
          });
        });
      };
    }
    else if(action == "intro") 
    {
      return function()
      {
        titan_p.move_arm_to_async(titan.position.x - 260, 430, function() 
        {
          titan_p.go_to(titan.position.x, 0, function() 
          { 
            window.setTimeout(function() 
            {
              var id = world.find(titan_p.getArm());
              world.changeLayerOf(id, true);
        
              titan_callback(titan_p, "pick")();
            }, 1000);
          });
        });
      };
    }
  };

  // Gestion de l'introduction
  window.setTimeout(function()
  {
    titan_callback(titan, "intro")(); 
  }, 5000);
  
  // Ajout du titan dans le monde 
  world.addEntity(titan, false);
  
  // Ajout du bras dans le monde
  world.addEntity(arm, false);
  
  // On spawn 20 humains
  for(var i = 0; i < 1; i++)
  {
    createHuman(Math.random() * 800, 540 - i * 2.6, world);
  }
}

//----------------------------------------------------------------------------------
function setup()
//----------------------------------------------------------------------------------
/**
 * @brief Met en place les éléments nécéssaire au bon fonctionnement de l'application
 */
{
  var world = new World("canvas");         // on s'instancie un monde
 
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
