/**
 * @brief Décrit un monde dans lequel se déroule une simulation
 */
function World(svgId)
{
  var self = this;
  var state = 0;

  this.entities = [];
  this.svg = null;

  this.__autokey = 0;
 
  if(svgId != undefined) 
  {
    this.svg = document.getElementById(svgId);
  }
  
  /**
   * @brief Retourne l'état actuel du monde
   * @return {number} L'état actuel du monde
   */
  this.getState = function() 
  {
    return self.state;
  }

  /*
   * @brief Modifie l'état du jeu
   * @param {number} state - Le nouvel état du jeu 
   */
  this.setState = function(state)
  {
    var old = self.state;
    self.state = state;
    
    var event = {
      oldstate : old,
      newstate : state
    };
    
    // Lorsque l'état du monde change
    // On prévient tous les entités le peuplant
    this.each(function(index, entite)
    {
      if(entite["triggerEvent"]) 
      {
        entite.triggerEvent("statechange", event);
      }
    });
  }
}

/**
 * @brief Parcours tous les entités contenu dans le monde
 * @param {function} fn - La fonction appelée lors de l'accès de chaque entités
 */
World.prototype.each = function(fn)
{
  // On parcours tous les entités
  for(var index = 0; index < this.entities.length; index++) 
  {
    if(this.entities[index])
    {
      fn(index, this.entities[index]);      // On appel la fonction en envoyant l'index de l'entité et l'entité
    }
  }
};

/**
 * Retrouve tous les entité ayant un tag égal à celui passé en paramètre
 */
World.prototype.eachWithTag = function(tag, fn)
{
  for(var index = 0; index < this.entities.length; index++)
  {
    var entity = this.entities[index];
    
    if(entity && entity.tag != undefined && entity.tag == tag)
    {
      fn(index, entity);
    }
  }
};

/**
 * Retourne l'entité le plus proche de celui passé en paramètre avec un tag particulier
 * @param tag Le tag à rechercher
 * @param entity L'entité pour lequel il faut retrouver le plus proche
 * @return L'entité le plus proche ou null si aucun n'est trouvé 
 */
World.prototype.neirestWithTag = function(tag, entity)
{
  var neirest = null;
  var minDist = 1000000;

  this.eachWithTag(tag, function(index, f_entity) 
  {
    var distance = vector_sub(f_entity.position, entity.position).length();
    
    if(distance < minDist) 
    {
      neirest = f_entity;
      minDist = distance;
    }
  });

  return neirest;
}

/**
 * @brief Exécute une itération de la simulation
 * @param {number} dt - Le temps écoulés depuis la dernière itération
 */
World.prototype.step = function(dt) 
{
  // On parcours tous les entités et on les met à jours
  this.each(function(index, entite) 
  {
    if(entite["onUpdate"]) 
    {
      entite.onUpdate(dt);
    }
  });
};

/**
 * @brief Affiche l'état actuel du monde à l'écran
 * @param svgId L'identifiant du SVG
 */
World.prototype.draw = function()
{
  var self = this;

  this.each(function(index, entite) 
  {
    var element = self.svg.getElementById("entity_" + index);
    element.setAttribute("transform", "translate(" + entite.position.x + ", " + entite.position.y  + ")");
  
    if(entite.visible != undefined && entite.visible == false)
    {
      element.setAttribute("visibility", "hidden");
    }
    else
    {
      element.setAttribute("visibility", "visible");
    }
  });
};

/**
 * @brief Cherche un entité pour récupérer son identifiant
 * @param entity L'entité à rechercher
 * @return -1 si non trouvé ou l'identifiant de l'entité
 */
World.prototype.find = function(entity)
{
  var id = -1;

  this.each(function(index, it_entity)
  {
    if(entity == it_entity)
    {
      id = index;
    }
  });

  return id;
};

/**
 * @brief Ajoute un entité au monde
 * @param {Entity} entity - L'entité à ajouter
 * @return L'identifiant de l'entité
 */
World.prototype.addEntity = function(entity, after_wall)
{
  var is_after_wall = after_wall != undefined ? after_wall : true;
   
  var element = document.createElementNS("http://www.w3.org/2000/svg", "g");
  element.id = "entity_" + this.__autokey; 
  
  if(entity.onCreate != undefined) 
  {
    entity.onCreate(element);
  }

  var wall = this.svg.getElementById("wall");

  // On doit placer l'entité devant le mur
  if(is_after_wall)
  {
    insert_after(element, wall);
  }
  // On doit placer l'entité derrière le mur
  else 
  {
    insert_before(element, wall);
  }
   
  this.entities.push(entity);

  return this.__autokey++;
};

// Change le layer d'un entité
World.prototype.changeLayerOf = function(index, after_wall)
{
  var is_after_wall = after_wall != undefined ? after_wall : true;
  
  var wall = this.svg.getElementById("wall");
  var element = this.svg.getElementById("entity_" + index);
  
  if(is_after_wall)
  {
    //insert_after(element, wall);
    this.svg.appendChild(element);  
  }
  else
  {
    insert_before(element, wall);
  }
};

/**
 * @brief Vérifie l'existence d'un entité
 * @param {number} id - L'identifiant de l'entité
 * @return {boolean} true si existant ou false sinon 
 */
World.prototype.exists = function(id) 
{
  var exists = false;
  
  if(this.entities[id]) 
  {
    exists = true;
  }
  
  return exists;
};

/**
 * @brief Retire un entité du monde
 * @param {number} index - L'identifiant de l'entité
 * @return true si retiré ou false sinon
 */
World.prototype.removeEntity = function(index) 
{
  var removed = false;
  
  if(this.exists(index))
  {
    var element = this.svg.getElementById("entity_" + index);
    element.parentElement.removeChild(element);

    this.entities[index] = null;
    removed = true;
  }
  
  return removed;
};
