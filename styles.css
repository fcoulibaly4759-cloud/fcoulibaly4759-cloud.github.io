const factBtn = document.getElementById('fact-btn');
const factText = document.getElementById('fact-text');

const maliFacts = [
  'Mali was once home to the Mali Empire, one of the wealthiest medieval empires in West Africa.',
  'Timbuktu was a famous center for Islamic scholarship and a key stop on trans-Saharan trade routes.',
  'Malian music blends traditional instruments like the kora and balafon with contemporary sounds.',
  'Mud cloth known as bogolanfini is a traditional textile art made using fermented mud and natural dyes.',
  'Griots are storytellers and oral historians who pass on Mali’s history through song and poetry.',
  'The Niger River is a vital cultural artery, shaping farming, festivals, and daily life across Mali.',
  'The city of Djenné is home to the largest mud-brick building in the world, the Great Mosque of Djenné.',
  'Mali is known for its warm hospitality, where guests are welcomed with shared meals and respect.',
];

function randomFact() {
  const nextFact = maliFacts[Math.floor(Math.random() * maliFacts.length)];
  factText.textContent = nextFact;
}

factBtn.addEventListener('click', randomFact);

window.addEventListener('load', () => {
  if (factText) {
    factText.textContent = maliFacts[0];
  }
});
