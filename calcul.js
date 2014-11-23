function point(_x,_y,_theta)
{
  this.x = _x != undefined ? _x : 0;
  this.y = _y != undefined ? _y : 0;
  this.theta = _theta != undefined ? _theta : 0;
}

function calcul()
{
  var self = this;
  this.forearm_size = 125;
  this.upperarm_size = 125;

  this.calculAllPoint = function(x1,y1,x2,y2)
  {
    var dx = x2-x1;
    var dy = y2-y1;

    var dist = Math.sqrt((dx*dx)+(dy*dy));

    var theta = Math.atan2(dy,dx);

    var totalsize = self.forearm_size + self.upperarm_size;

    var theta1 =0, theta2 = 0;

    if(dist < totalsize)
    {
      theta1 = Math.acos(dist / totalsize) + theta;
      dx = dx - (self.upperarm_size * Math.cos(theta1));
      dy = dy - (self.forearm_size * Math.sin(theta1));
      theta2 = Math.atan2(dy,dx);
    }
    else
    {
      theta1 = theta2 = theta;
    }
   
    var p0 = new point(x1,y1,theta*(180/Math.PI)+90); 
    var p1 = new point(x1 + (Math.cos(theta1)*self.upperarm_size), y1+(Math.sin(theta1)*self.upperarm_size),theta1);
    var p2 = new point(p1.x + (Math.cos(theta2)*self.forearm_size), p1.y+(Math.sin(theta2)*self.forearm_size),theta2*(180/Math.PI)+90);

    return [p0, p1, p2];
  };
}
