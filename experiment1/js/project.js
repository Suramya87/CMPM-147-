// project.js - This is for the first experiment for CMPM 147 making the scam glue ads
// Author: Suramya Shakya
// Date: 04/05/2025

// NOTE: This is how we might start a basic JavaaScript OOP project

function main() {
  const fillers = {
    fakeTech:["Atomic memory reversal compound",
              "Nano bot array",
              "Deep fracture rewriting solution",
              "Graphene infused struture"],
    name:["OctoGRIP",
          "Tiny Friends",
          "Merge serum",
          "Super DE Troper Glue",
          "Glue the second edition"],
    item1:["vase",
           "slug",
           "elephant",
           "pencil",
           "boat",
           "phone",
           "wall"], 
    item2:["the wall",
           "the ceiling", 
           "the floor",
           "a rock",
           "a bicycle", 
           "a tree",
           "a cat",
           "a house"],
    brandSlogan:["got the grip",
                 "will stick it and more", 
                 "will make you wish you can break it again",
                 "will hold anything","we will litterally pay you if you somehow break it", 
                 "glue so strong we legally only sell it as a one time use pack"], 
    impossibleClaim:["a true chemical fusion of the materials in sub-atomoic levels making them truly as one.",
                     "the ability to create an electromagentic field that holds the bond in a higher dimension making it impossible to sperate in our reality. Yes we have tried",
                     "better than fresh results, a real vase would look broken next to ones glued using our product","almost unbreakable bonds, its so strong you would wise it was impossible so you could give up trying to break it",
                     "a near world ending accident if you spill it on the floor as the earth will be glued to the point in space. Luckily we disabled that for our dear customers, we hope you can understand"],
    item3:[  "a car bumper",
    "your hopes and dreams",
    "a ceiling fan",
    "a broomstick",
    "a medieval shield",
    "a taxidermy squirrel",
    "an action figure",
    "a hoverboard",
    "a banana peel",
    "a microwave door",
    "a neon sign",
    "a dinosaur bone",
    "a broken keyboard key",
    "a fish tank lid",
    "a superhero mask"], 
    item4:[  "a toaster",
    "a garden gnome",
    "a skateboard",
    "your broken dignity",
    "a drone wing",
    "a cracked phone case",
    "a haunted doll",
    "a busted guitar",
    "a coffee mug handle",
    "a rubber duck",
    "a vampire fang",
    "a space helmet",
    "a cursed amulet",
    "a 3D printer part",
    "an old VHS tape"], 
  };
  
  const template = `This podcast was sponsered by $name
  
  Broke something? Or need to glue a $item1 to $item2? $name $brandSlogan
  
  With our revolutionary $fakeTech, we can achieve $impossibleClaim. You can glue $item3. You can glue $item4. Heck, you can even glue them all at once`;
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    // box.innerText = story;
    $("#box").text(story);
  }
  
  /* global clicker */
  // clicker.onclick = generate;
  $("#clicker").click(generate);
  
  generate();
}

// let's get this party started - uncomment me
main();