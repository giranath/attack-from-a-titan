/**
 * @brief Représente un entité dans le monde
 */
function Entity() {
  /**
   * La position de l'entité
   */
  this.position = {
    x : 0,
    y : 0
  };
  
  /**
   * La vélocité de l'entité
   */
  this.velocity = {
    x : 0,
    y : 0
  };
  
  var listeners = [];
  
  /**
   * @brief Ajoute un gestionnaire d'événement sur un entité
   * @param {string} name - Le nom de l'événement
   * @param {function} handler - Une fonction décrivant l'action à effectué lors de l'événement
   */
  this.addEventListener = function(name, handler) 
  {
    listeners[name] = handler;
  };
  
  /**
   * @brief Déclenche un événement
   * @param {string} name - Le nom de l'événement
   * @param {object} handler - L'objet contenant les informations de l'événement
   */
  this.triggerEvent = function(name, handler) 
  {
    var fn = listeners[name];
    
    if(fn) 
    {
      fn(handler);      // On lance le gestionnaire de l'événement
    }
  };
}

/**
 * @brief Met à jour l'état de l'entité
 * @param {number} dt - Le temp écoulé depuis la dernière appel
 */
Entity.prototype.onUpdate = function(dt) {

  // Mise à jour de la position
  this.position.x += this.velocity.x * dt;
  this.position.y += this.velocity.y * dt;
}