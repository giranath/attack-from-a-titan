

// Insère un noeud avant un autre
function insert_before(toInsert, reference) 
{
  reference.parentNode.insertBefore(toInsert, reference);
}

// Insère un noeud après un autre
function insert_after(toInsert, target) 
{
  var parentNode = target.parentNode;
  if(parentNode.lastChild == target)
  {
    parentNode.appendChild(toInsert);
  }
  else 
  {
    parentNode.insertBefore(toInsert, target.nextSibling);
  }
}
