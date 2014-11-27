/**
 * L'objet représentant le titan
 */
function Titan(id) {
  // La position de la main du titan
  var hand_position = new Vector2(100, 500);

  this.position = new Vector2(270, 50);

  // La position où le titan dirige sa main
  var target_position = new Vector2(0, 0),
      moved_callback = function() {}, 
      hand_moving = false,
      arm_speed = 0.2;
  
  /**
   * Déplace le bras du titan à une position
   */
  this.move_arm_to = function(targetx, targety) 
  {
    var cal   = new calcul(),
        res   = cal.calculAllPoint(10, 330, targetx - this.position.x, targety - this.position.y), 
        up    = document.getElementById("upperarm"),
        elbow = document.getElementById("elbow"),
        fore  = document.getElementById("forearm"),
        hand  = document.getElementById("entity-main");

    up.setAttribute("x2",res[1].x);
    up.setAttribute("y2",res[1].y);

    elbow.setAttribute("cx",res[1].x);
    elbow.setAttribute("cy",res[1].y);

    fore.setAttribute("x1",res[1].x);
    fore.setAttribute("y1",res[1].y);
    fore.setAttribute("x2",res[2].x);
    fore.setAttribute("y2",res[2].y);

    hand.setAttribute("transform", "translate(" + res[2].x + "," + res[2].y + ") rotate(" + res[2].theta + ")");
  };

  /**
   * Met à jour l'entité
   */
  this.onUpdate = function(dt) 
  {
    if(hand_moving) 
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

      this.move_arm_to(hand_position.x, hand_position.y);
    
      if((hand_position.x == target_position.x && hand_position.y == target_position.y) || 
        (direction.x == 0 && direction.y == 0)) 
      {
        hand_moving = false;
        moved_callback();     
      }
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
     
    moved_callback = cb;
    hand_moving = true;
  };

}
