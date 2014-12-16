//==================================================================================
// FICHIER: animation.js
// AUTEUR : Nathan Giraldeau & Luc Bossé
// DATE   : 12 novembre 2014
//----------------------------------------------------------------------------------
// DESCIPTION:
// Représente un être humain (Son affichage + logique) 
//==================================================================================
var HUMAN_STATES = {
  CALM : 0,
  HIDING : 1,
  FROZEN : 2,
  SECURED : 3,
  PANIC : 4
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
  
  var hidden = false;

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
    
    if(cb != null || cb != undefined)
    {
      walked_cb = cb;
    }
    else 
    {
      walked_cb = function(){};
    }
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
    var r = Math.round((Math.random() * COLOUR_VARIETY) * (255 / COLOUR_VARIETY - 1));
    var g = Math.round((Math.random() * COLOUR_VARIETY) * (255 / COLOUR_VARIETY - 1));
    var b = Math.round((Math.random() * COLOUR_VARIETY) * (255 / COLOUR_VARIETY - 1));
    var str = r.toString() + "," + g.toString() + "," + b.toString();
    var people = document.createElementNS("http://www.w3.org/2000/svg", "use");
    var r = Math.random() * 3;

    if(r<1)
    {
      people.setAttributeNS("http://www.w3.org/1999/xlink", "href","assets/people.svg#little_pepole" );
    }
    else if(r < 2)
    {
      people.setAttributeNS("http://www.w3.org/1999/xlink", "href","assets/people1.svg#little_pepole" );
    }
    else
    {
      people.setAttributeNS("http://www.w3.org/1999/xlink", "href","assets/people2.svg#little_pepole" );
    }
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
    var self = this;

    // Pour éviter la répétion de code 
    var move_sequence = function(speed_modifier)
    {
      var difference = vector_sub(target, self.position),
          direction = difference.unit(),
          speed_modif = speed_modifier ? speed_modifier : 1,
          deplacement = vector_mul(direction, self.speed * speed_modif);

      if(difference.length() > deplacement.length())
      {
        self.position.x += deplacement.x;
        self.position.y += deplacement.y;
      }
      else 
      {
        self.position.x = target.x;
        self.position.y = target.y;

        walking = false;
        walked_cb(true);
      }
    };

    // Machine à états finis pour savoir comment réagit l'humain en fonction de son état
    switch(this.state)
    {
      // L'humain est calme
      case HUMAN_STATES.CALM:
        // S'il était en train de se déplacer, il continu
        if(walking)
        {
          move_sequence();
        }
        else
        {

        }
        break;
      
      // Les humains se cachent 
      case HUMAN_STATES.HIDING:
        if(walking)
        {
          move_sequence();
        }
        else
        {
          if(hidden == false)
          {
            var hide_target = (Math.random() > 0.5) ? -100 : 900;

            this.go_to(hide_target, this.position.y, function()
            {
              hidden = true;
            });
          } 
        }

        break;
      
      // Les humains panic 
      case HUMAN_STATES.PANIC:
        if(walking)
        {
          move_sequence(1.5);
        }
        else
        {
          // Les humains paniquent et courent dans tous les sens
          var PanicSide = 1;
          if(Math.random() > 0.5)
          {
            PanicSide = -1;
          }

          this.go_to(this.position.x + PanicSide * 61 + Math.random() * 75, this.position.y);
        }

        break;

      // L'humain est figé par la peur
      case HUMAN_STATES.FROZEN:
        if(walking)
        {
          cancel_walk();
        }
        break;

      // L'humain se sent en sécurité et se déplace vers le centre
      case HUMAN_STATES.SECURED:
        hidden = false; 
        var self = this;
          
        if(walking)
        {
          move_sequence();
        }
        else
        {
          // Les humains se rassemble sur le mur
          this.go_to((Math.random() * 400)+200, this.position.y, function()
          {
            if(self.state == HUMAN_STATES.SECURED)
            {
              self.state = HUMAN_STATES.CALM;
            }
          });
        }
        break;
    }
  };
}
