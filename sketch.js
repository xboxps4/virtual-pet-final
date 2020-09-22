var happyDog;
var dog,database,foodS;
var foodStock;
var milk;
var fedTime,lastFed,currentTime;
var foodObj;
var bimg,wimg,gimg;
var dead , sadDog;
var gameState,readState;

function preload()
{
  dog = loadImage("Dog.png");
  happyDog = loadImage("happy dog.png");
  milk = loadImage("Milk.png");
  bimg = loadImage("Bed Room.png");
  wimg = loadImage("Wash Room.png");
  gimg = loadImage("Garden.png");
  dead = loadImage("deadDog.png");
  sadDog = loadImage("Lazy.png")
}

function setup() {
	createCanvas(500,500);
  
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  feed = createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFood);

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  });

}


function draw() {  
  background(46,139,87)
  drawSprites();
  
  text("Press up arrow to feed the dog"),450,450;

  fill(255,255,254)
  textSize(15);
  if(lastFed = 12)
  {
    text("Last Feed : " + lastFed % 12 + " PM",350,30)
  }
  else if(lastFed === 0)
  {
    text("Last feed : 12 AM",350,30);
  }
  else
  {
    text("Last feed : " + lastFed + "AM",350,30)
  }

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  food.display();

  if(gameState != "Hungry")
  {
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else
  {
    feed.show();
    addFood.show();
    dog.addImage(sadDog)
  }

  currentTime = hour();
  if(currentTime === (lastFed + 1))
  {
    update("Playing");
    foodObj.garden();
  }

  else if(currentTime === (lastFed + 2))
  {
    update("Sleepimg");
    foodObj.bedroom();
  }

  else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4))
  {
    update("Bathing");
    foodObj.bathroom();
  }

  else
  {
    update("Hungry");
    foodObj.display();
  }
}

function readStock(data)
{
  foodS = data.val();
}

function writeStock(x)
{
  database.ref('/').update({
    Food : x
  })
}

function addFoods()
{
  foodS++;
  database.ref('/').update({
    food : foodS
  })
}

function feedDog()
{
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

function update(state)
{
  database.ref('/').update({
    gameState : state
  })
}