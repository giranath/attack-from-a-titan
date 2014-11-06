/**
 * @brief Décrit un monde dans lequel se déroule une simulation
 */
function World()
{
  var self = this;
  var state = 0;

  this.entities = [];
  
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
}

/**
 * @brief Affiche l'état actuel du monde à l'écran
 */
World.prototype.draw = function(svgId)
{
  var svg = document.getElementById(svgId);   // On récupère l'élément svg
  
  this.each(function(index, entite)
  {
    // On dessine l'entité
  });
}

/**
 * @brief Ajoute un entité au monde
 * @param {Entity} entity - L'entité à ajouter
 * @return L'identifiant de l'entité
 */
World.prototype.addEntity = function(entity)
{
  return this.entities.push(entity);
}

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
}

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
    this.entities[index] = null;
    removed = true;
  }
  
  return removed;
}
