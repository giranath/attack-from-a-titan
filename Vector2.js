/**
 * Représente un vecteur en 2D
 */
function Vector2(x, y) 
{
  this.x = x != undefined ? x : 0;
  this.y = y != undefined ? y : 0;
 
  /**
   * Retourne le vecteur unitaire
   */ 
  this.unit = function() 
  {
    var unitVect = new Vector2(0, 0);
    var length = this.length();
  
    if(length > 0) 
    {
      unitVect = new Vector2(this.x / length, this.y / length);
    }
    
    return unitVect;
  };

  /**
   * Retourne la longueur du vecteur
   */
  this.length = function() 
  {
    return Math.sqrt( y * y + x * x );
  };
};

// Additionne deux vecteurs
function vector_add(vec1, vec2) 
{
  return new Vector2(vec1.x + vec2.x, vec1.y + vec2.y);
};

// Soustrait deux vecteurs
function vector_sub(vec1, vec2) 
{
  return new Vector2(vec1.x - vec2.x, vec1.y - vec2.y);
};

// Multiplie un vecteur par un scalaire
function vector_mul(vec, scalar) 
{
  return new Vector2(vec.x * scalar, vec.y * scalar);
}
