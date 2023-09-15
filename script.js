class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(arr) {
    arr = [...new Set(arr)]; // Remove duplicates
    arr.sort((a, b) => a - b); // Sort the array
    this.root = this.buildTree(arr);
  }

  buildTree(arr) {
    if (!arr.length) return null;

    let mid = Math.floor(arr.length / 2);
    let root = new Node(arr[mid]);

    root.left = this.buildTree(arr.slice(0, mid));
    root.right = this.buildTree(arr.slice(mid + 1));

    return root;
  }

  insert(value) {
    const newNode = new Node(value);

    if (this.root === null) {
      this.root = newNode;
      return;
    }
    let current = this.root;
    while (true) {
      if (value < current.data) {
        if (current.left === null) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else if (value > current.data) {
        if (current.right === null) {
          current.right = newNode;
          return;
        }
        current = current.right;
      } else {
        return;
      }
    }
  }

  delete(value) {
    this.root = this.deleteNode(this.root, value);
  }

  _deleteNode(node, key) {
    if (node === null) return node; //if the tree is empty
    if (key < node.data) {
      //if the key to be deleted is smaller than the root's key
      node.left = this.deleteNode(node.left, key);
      return node;
    }
    if (key > node.data) {
      //if the key to be deleted is greater than the root's key
      node.right = this.deleteNode(node.right, key);
      return node;
    }
    //if key is same as root's key, then this is the node to be deleted

    //node with only one child or no child
    if (node.left === null) return node.right;
    if (node.right === null) return node.left;

    //node with two children
    //Get the smallest value in the right subtree, set it as current node, and delete the value in the right subtree
    node.data = this._findMinNode(node.right).data;
    node.right = this._deleteNode(node.right, node.data);
    return node;
  }

  _findMinNode(node) {
    if (node.left === null) return node;
    else return this._findMinNode(node.left);
  }

  find(value) {
    let currentNode = this.root;

    while (currentNode) {
      if (value === currentNode.data) {
        return currentNode; //Found the node
      } else if (value < currentNode.data) {
        currentNode = currentNode.left; //Go left
      } else {
        currentNode = currentNode.right; //Go right
      }
    }
    return null; //If we get here, we didn't find it
  }
  // Ordering Methods
  levelOrder(fn) {
    if (!this.root) return []; //If the tree is empty, return an empty array

    let result = [];
    let queue = [this.root]; //Start with the root node

    function processQueue(queue) {
      if (!queue.length) return; //If the queue is empty, we're done

      let currentNode = queue.shift();

      if (fn) {
        //If a function was passed in, call it on the node
        fn(currentNode);
      } else {
        result.push(currentNode.data); //Otherwise, just push the value into the array
      }

      if (currentNode.left) queue.push(currentNode.left); //Add the left and right children to the queue
      if (currentNode.right) queue.push(currentNode.right); //They will be processed in the next iteration of the loop

      processQueue(queue);
    }

    processQueue(queue); //Start the loop

    return fn ? undefined : result; //If a function was passed in, return undefined
  }

  inorder(fn) {
    let values = [];
    function traverse(node) {
      if (node) {
        traverse(node.left);
        if (fn) fn(node.data);
        else values.push(node.data);
        traverse(node.right);
      }
    }
    traverse(this.root);
    return fn ? undefined : values;
  }

  preorder(fn) {
    let values = [];
    function traverse(node) {
      if (node) {
        if (fn) fn(node.data);
        else values.push(node.data);
        traverse(node.left);
        traverse(node.right);
      }
    }
    traverse(this.root);
    return fn ? undefined : values;
  }

  postorder(fn) {
    let values = [];
    function traverse(node) {
      if (node) {
        traverse(node.left);
        traverse(node.right);
        if (fn) fn(node.data);
        else values.push(node.data);
      }
    }
    traverse(this.root);
    return fn ? undefined : values;
  }
  // Height and Depth
  height(node) {
    if (!node) return -1; // If node doesn't exist, height is -1
    return 1 + Math.max(height(node.left), height(node.right));
  }

  depth(node) {
    let depth = -1;
    let current = this.root;
    while (current) {
      depth++;
      if (node.data === current.data) return depth;
      else if (node.data < current.data) current = current.left;
      else current = current.right;
    }
    return -1; // If node doesn't exist in the tree
  }
  // Balance the Tree
  isBalanced() {
    function checkBalance(node) {
      if (!node) return { height: -1, balanced: true };

      let left = checkBalance(node.left);
      let right = checkBalance(node.right);

      let balanced =
        left.balanced &&
        right.balanced &&
        Math.abs(left.height - right.height) <= 1;
      let height = 1 + Math.max(left.height, right.height);

      return { height, balanced };
    }
    return checkBalance(this.root).balanced;
  }

  rebalance() {
    let values = this.inorder();
    this.root = this.buildTree(values);
  }
}

// Function that will console.log the tree in a structured format
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

function getRandomNumbersArray(length) {
  let arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * 100));
  }
  return arr;
}

// Create a binary search tree from an array of random numbers < 100
// and visualize it using the prettyPrint function
const randomNumbers = getRandomNumbersArray(15);
const bst = new Tree(randomNumbers);
console.log("Random Numbers", randomNumbers);

// Confirm the tree is balanced
console.log("Is balanced?", bst.isBalanced());

//Print out all elements in level, pre, post, and in order
console.log("Level Order", bst.levelOrder());
console.log("Pre Order", bst.preorder());
console.log("In Order", bst.inorder());
console.log("Post Order", bst.postorder());

// Unbalance the tree by adding several numbers > 100
bst.insert(101);
bst.insert(133);
bst.insert(169);
bst.insert(766);

// Confirm the tree is unbalanced
console.log("Is balanced after adding big numbers?", bst.isBalanced());

// Balance the tree
bst.rebalance();

// Confirm the tree is balanced
console.log("Is balanced after rebalancing?", bst.isBalanced());

// Print out all elements in level, pre, post, and in order
console.log("Level Order", bst.levelOrder());
console.log("Pre Order", bst.preorder());
console.log("In Order", bst.inorder());
console.log("Post Order", bst.postorder());
