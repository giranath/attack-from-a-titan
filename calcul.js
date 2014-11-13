function point(_x,_y)
{
  var this.x = _x!=undefined ? _x : 0;
  var this.y = _y!=undefined ? _y : 0;
}

function calcul()
{
  var this.forearm_size = 10;
  var this.upperarm_size = 10;


  this.distanceBetweenPoint(x1, y1, x2, y2)
  {
    var c2 = pow(x2-x1,2)+pow(y2-y1,2);
    return sqrt(c2);
  }

  //x1 et y1 sont les point de l'epaule
  //x2 et y2 sont le point objectif
  this.PointCoude(x1,y1,x2,y2)
  {
    var coude = new point();
    if(this.distanceBetweenPoint(x1,y1,x2,y2) > (forearm_size+upperarm_size))
  }

  //Retourne l'angle a l'inverse du segment c
  this.angleTriangle(a,b,c)
  {
    return Math.acos(((c*c)-((a*a)+(b*b)))/(-2*a*b));
  }


  this.calculAllPoint(x1,y1,x2,y2)
  {
    var dx = x2-x1;
    var dy = y2-y1;

    var dist = sqrt((dx*dx)+(dy*dy));

    var theta = Math.atan2(dy,dx);

    var totalsize = forearm_size + upperarm_size;

    if(dist < totalsize)
    {
      var theta1 = Math.acos(dist / totalsize) + theta;
      dx = dx - upperarm_size * Math.cos(theta1);
      dy = dy - forearm_size * Math.sin(theta1);
      var theta2 = Math.atan2(dy,dx);
    }
    else
    {
      theta1 = theta2 = theta;
    }
   
    var p0 = new point(x1,y1); 
    var p1 = new point(x1 + Math.cos(theta1)*upperarm_size, y1+Math.sin(theta1)*upperarm_size);
    var p2 = new point(p1.x + Math.cos(theta2)*forearm_size, p1.y+Math.sin(theta2)*forearm_size);

    return [p0, p1, p2];
  }
}
