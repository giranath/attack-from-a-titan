var HUMAN_STATES = {
  CALM : 0,
  HIDING : 1,
  FROZEN : 2,
};

var COLOUR_VARIETY = 15;

function Human()
{
  this.state = HUMAN_STATES.CALM;
   
  this.position = new Vector2(0, 0);
  this.velocity = new Vector2(0, 0);    
  this.speed = 0.2;                     // Défini la vitesse de l'humain 

  // Les paramètres pour gérer le déplacement de l'humain
  var target = new Vector2(0, 0),
      walking = false,
      walked_cb = function(){};
  
  /**
   * Déplace le personnage vers une position précise
   * @param targetX  La position X à atteindre
   * @param targetY  La position Y à atteindre
   * @param cb La fonction appelée lorsque l'humain s'est rendu à l'endroit (la fonction renvoi en paramètre vrai s'il est arrivé ou faux s'il n'y ai pas arrivé)
   */
  this.go_to = function(targetX, targetY, cb) 
  {
    target.x = targetX;
    target.y = targetY;
    walking = true;
    walked_cb = cb;
  };

  // Annule le déplacement de l'entité
  var cancel_walk = function()
  {
    walking = false;
    walked_cb(false);
  }

  /**
   * Crée l'élément dans le canvas SVG
   */
  this.onCreate = function(element)
  {
    //var circle = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    //circle.setAttribute("rx", "10");
    //circle.setAttribute("ry", "30");
    //element.appendChild(circle);
    var r = Math.round((Math.random() * COLOUR_VARIETY) * (255/COLOUR_VARIETY-1));
    var g = Math.round((Math.random() * COLOUR_VARIETY) * (255/COLOUR_VARIETY-1));
    var b = Math.round((Math.random() * COLOUR_VARIETY) * (255/COLOUR_VARIETY-1));
    var str = r.toString()+","+g.toString()+","+b.toString();
    var people = document.createElementNS("http://www.w3.org/2000/svg", "use");
    people.setAttributeNS("http://www.w3.org/1999/xlink", "href","assets/people.svg#little_pepole" );
    people.setAttribute("style", "fill:rgb("+str+");stroke:rgb(0,0,0);");
    //debugger;
    element.appendChild(people);
  }

  /**
   * Met à jour l'état de l'humain
   * dt Le temps écoulé
   */
  this.onUpdate = function(dt)
  {
    // Machine à états finis pour savoir comment réagit l'humain en fonction de son état
    switch(this.state)
    {
      case HUMAN_STATES.CALM:
        // S'il était en train de se déplacer, il continu
        if(walking)
        {
          var difference = vector_sub(target, this.position),
              direction = difference.unit(),
              deplacement = vector_mul(direction, this.speed);

          if(difference.length() > deplacement.length())
          {
            this.position.x += deplacement.x;
            this.position.y += deplacement.y;
          }
          else 
          {
            this.position.x = target.x;
            this.position.y = target.y;

            walking = false;
            walked_cb(true);
          }
        }
        break;
      case HUMAN_STATES.HIDING:
        // Lancer la procédure pour se cacher 
        
        var PanicSide = 1;

        if(Math.random() % 2)
        {
          PanicSide = PanicSide * -1;
        }
        if(walking)
        {
          var difference = vector_sub(target, this.position),
              direction = difference.unit(),
              deplacement = vector_mul(direction, this.speed);

          if(difference.length() > deplacement.length())
          {
            this.position.x += deplacement.x;
            this.position.y += deplacement.y;
          }
          else 
          {
            this.position.x = target.x;
            this.position.y = target.y;

            walking = false;
            walked_cb(true);
          }
        }
        else
        {
          go_to(0,0,function(){alert('lol');});
        }

        break;
      case HUMAN_STATES.FROZEN:
        if(walking)
        {
          cancel_walk();
        }
        break;
    }
  };
}
