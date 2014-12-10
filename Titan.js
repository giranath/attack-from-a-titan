/**
 * L'objet représentant le bras d'un titan
 */
function TitanArm()  
{
  this.position = new Vector2(0, 0);

  // La position du bras relativement au titan
  this.relativePosition = new Vector2(10, 330);

  this.titan = null;
  this.points = [new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0)];
  
  var parentNode = null;
  

  // La position des doigts
  var FINGER_POSITIONS = [
    new Vector2(-15, -47),
    new Vector2(-3,  -50),
    new Vector2( 9,  -48),
    new Vector2( 23, -40),
    new Vector2(-30, -30)
  ];
  
  // Définition des différentes parties du bras
  var upperarm = null,
      forearm  = null,
      elbow    = null,
      shoulder = null,
      hand     = null;

  this.handAngle = 0;

  /**
   * Construit le titan dans le canvas SVG
   */
  this.onCreate = function(parentElement) 
  {
    // Construction du bras
    upperarm = document.createElementNS("http://www.w3.org/2000/svg", "line");
    upperarm.setAttribute("name", "upperarm");
    upperarm.setAttribute("style", "stroke:rgb(221, 160, 106);stroke-width:70");
    
    forearm = document.createElementNS("http://www.w3.org/2000/svg", "line");
    forearm.setAttribute("name", "forearm");
    forearm.setAttribute("style", "stroke:rgb(221, 160, 106);stroke-width:70");
   
    elbow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    elbow.setAttribute("name", "elbow");
    elbow.setAttribute("style", "fill:rgb(221, 160, 106);");
    elbow.setAttribute("r", "35");
    
    shoulder = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    shoulder.setAttribute("name", "shoulder");
    shoulder.setAttribute("style", "fill:rgb(221, 160, 106);");
    shoulder.setAttribute("r", "35");
     
    // Construction de la main
    hand = document.createElementNS("http://www.w3.org/2000/svg", "g");
    hand.setAttribute("style", "stroke:rgb(0, 0, 0);");
  
    var fingers = [];
    for(var i = 0; i < 5; i++)
    {
      var finger = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
      finger.setAttribute("cx", FINGER_POSITIONS[i].x);
      finger.setAttribute("cy", FINGER_POSITIONS[i].y);
      finger.setAttribute("rx", 5);
      finger.setAttribute("ry", 20);
      finger.setAttribute("style", "fill:rgb(221, 160, 106)");

      fingers.push(finger);      
    }
    
    var palm = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    palm.setAttribute("cx", 0);
    palm.setAttribute("cy", 0);
    palm.setAttribute("rx", 36);
    palm.setAttribute("ry", 40);
    palm.setAttribute("style", "fill:rgb(221, 160, 106)");
   
    hand.appendChild(palm);
     
    // Assemblage des doigts 
    for(var i = 0; i < 5; i++)
    {
      hand.appendChild(fingers[i]);
    } 
    
    // Assemblage des différents éléments du bras
    parentElement.appendChild(upperarm);
    parentElement.appendChild(forearm);
    parentElement.appendChild(shoulder);
    parentElement.appendChild(elbow);
    parentElement.appendChild(hand);
     
    parentNode = parentElement;
  };

  /**
   * Met à jour le bras du titan
   */
  this.onUpdate = function(dt)
  {
    shoulder.setAttribute("cx", this.relativePosition.x);
    shoulder.setAttribute("cy", this.relativePosition.y);

    upperarm.setAttribute("x1", this.relativePosition.x);
    upperarm.setAttribute("y1", this.relativePosition.y);
    
    upperarm.setAttribute("x2", this.points[1].x);
    upperarm.setAttribute("y2", this.points[1].y);

    elbow.setAttribute("cx", this.points[1].x);
    elbow.setAttribute("cy", this.points[1].y);

    forearm.setAttribute("x1", this.points[1].x);
    forearm.setAttribute("y1", this.points[1].y);
    forearm.setAttribute("x2", this.points[2].x);
    forearm.setAttribute("y2", this.points[2].y);     
  
    hand.setAttribute("transform", "translate(" + this.points[2].x + "," + this.points[2].y + ") rotate(" + this.handAngle + ")");
  };
  
}

/**
 * L'objet représentant le titan
 */
function Titan(arm) 
{
  // La position de la main du titan
  var hand_position = new Vector2(100, 500);
  var mouth = null;

  this.position = new Vector2(370, 50); // 270, 50

  // Variables pour gérer le déplacement de la main 
  var target_position = new Vector2(0, 0),
      hand_moved_callback = function() {}, 
      hand_moving = false,
      arm_speed = 0.1; 

  // Variable pour gérer le déplacement du titan
  var move_to_position = new Vector2(0, 0),
      moved_callback = function(){},
      moving = false;

  this.speed = 1.2;

  this.getArm = function() 
  {
    return arm;
  };
  
  /**
   * Déplace le bras du titan à une position
   */
  this.move_arm_to = function(targetx, targety) 
  {
    var cal   = new calcul(),
        res   = cal.calculAllPoint(arm.relativePosition.x, arm.relativePosition.y, targetx - this.position.x, targety - this.position.y); 
    
    for(var i = 0; i < res.length; i++)
    {
      arm.points[i].x = res[i].x;
      arm.points[i].y = res[i].y;
    }

    arm.handAngle = res[2].theta;
  };

  /**
   * Quoi faire à la création de l'entité
   */
  this.onCreate = function(parentElement) 
  {
    var head_group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    head_group.setAttribute("transform", "translate(7)"); 

    var head = document.createElementNS("http://www.w3.org/2000/svg", "use");
    head.setAttribute("name", "head");
    head.setAttributeNS("http://www.w3.org/1999/xlink", "href", "assets/head.svg#crane");

    mouth = document.createElementNS("http://www.w3.org/2000/svg", "use"); 
    mouth.setAttribute("name", "head");
    mouth.setAttributeNS("http://www.w3.org/1999/xlink", "href", "assets/head.svg#bouche");
    
    head_group.appendChild(head);
    head_group.appendChild(mouth);
    
    var body = document.createElementNS("http://www.w3.org/2000/svg", "use");
    head.setAttribute("name", "body");
    body.setAttributeNS("http://www.w3.org/1999/xlink", "href", "assets/body.svg#corps");
    body.setAttribute("transform", "translate(0, 250)"); 

    parentElement.appendChild(body);
    parentElement.appendChild(head_group);
  }
  
  /**
   * Met à jour l'entité
   */
  this.onUpdate = function(dt) 
  {
    var self = this;
    var sync_arm = function()
    {
      var difference = vector_sub(target_position, hand_position),
          direction = difference.unit(),
          displacement = vector_mul(direction, dt * arm_speed); 

      if(difference.length() >= displacement.length())
      {
        hand_position = vector_add(hand_position, displacement);      
      }
      else 
      {
        hand_position.x = target_position.x;
        hand_position.y = target_position.y;
      }

      self.move_arm_to(hand_position.x, hand_position.y);
    
      if((hand_position.x == target_position.x && hand_position.y == target_position.y) || 
        (direction.x == 0 && direction.y == 0)) 
      {
        hand_moving = false;
        hand_moved_callback();     
      }
    };

    arm.position.x = this.position.x;
    arm.position.y = this.position.y;

    if(moving)
    {
      var difference = vector_sub(move_to_position, this.position),
          direction = difference.unit(),
          deplacement = vector_mul(direction, this.speed);

      if(difference.length() > deplacement.length())
      {
        this.position.x += deplacement.x;
        this.position.y += deplacement.y;
      }
      else 
      {
        this.position.x = move_to_position.x;
        this.position.y = move_to_position.y;

        moving = false;
        moved_callback(true);
      }

      self.move_arm_to(hand_position.x, hand_position.y);
    }

    if(hand_moving) 
    {
      sync_arm(); 
    }
  };

  /**
   * Déplace le bras du titan vers une position et appèle une fonction passé lorsque le bras atteind sa destination
   * @param targetx - La position x à atteindre
   * @param targety - La position y à atteindre
   * @param cb  - La fonction appelée lorsque le bras atteind sa destination
   */
  this.move_arm_to_async = function(targetx, targety, cb) 
  {
    target_position.x = targetx;
    target_position.y = targety;     
     
    hand_moved_callback = cb;
    hand_moving = true;
  };

  /**
   * Déplace le titan à une endroit
   * @param targetX la position où aller en X
   * @param targetY La position en Y
   * @param cb La fonction à appeler lorsque le déplacement est réalisé
   */
  this.go_to = function(targetX, targetY, cb)
  {
    move_to_position.x = targetX;
    move_to_position.y = targetY;
    
    moving = true;
    moved_callback = cb;
  };

}
