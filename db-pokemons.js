const pokemons = [
 {
  id: 1,
  name: "Bulbizarre",
  hp: 25,
  cp: 5,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
  types: ["Plante", "Poison"],
  created: new Date()
 },
 {
  id: 2,
  name: "Salamèche",
  hp: 28,
  cp: 6,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
  types: ["Feu"],
  created: new Date()
 },
 {
  id: 3,
  name: "Carapuce",
  hp: 21,
  cp: 4,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
  types: ["Eau"],
  created: new Date()
 },
 {
  id: 4,
  name: "Aspicot",
  hp: 16,
  cp: 2,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png",
  types: ["Insecte", "Poison"],
  created: new Date()
 },
 {
  id: 5,
  name: "Roucool",
  hp: 30,
  cp: 7,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png",
  types: ["Normal", "Vol"],
  created: new Date()
 },
 {
  id: 6,
  name: "Rattata",
  hp: 18,
  cp: 6,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png",
  types: ["Normal"],
  created: new Date()
 },
 {
  id: 7,
  name: "Piafabec",
  hp: 14,
  cp: 5,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/21.png",
  types: ["Normal", "Vol"],
  created: new Date()
 },
 {
  id: 8,
  name: "Abo",
  hp: 16,
  cp: 4,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/23.png",
  types: ["Poison"],
  created: new Date()
 },
 {
  id: 9,
  name: "Pikachu",
  hp: 21,
  cp: 7,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  types: ["Electrik"],
  created: new Date()
 },
 {
  id: 10,
  name: "Sabelette",
  hp: 19,
  cp: 3,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/27.png",
  types: ["Normal"],
  created: new Date()
 },
 {
  id: 11,
  name: "Mélofée",
  hp: 25,
  cp: 5,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png",
  types: ["Fée"],
  created: new Date()
 },
 {
  id: 12,
  name: "Groupix",
  hp: 17,
  cp: 8,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/37.png",
  types: ["Feu"],
  created: new Date()
 },
 {
  id: 13,
  name: "Nosferapti",
  hp: 20,
  cp: 5,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/41.png",
  types: ["Poison", "Vol"],
  created: new Date()
 },
 {
  id: 14,
  name: "Miaouss",
  hp: 22,
  cp: 6,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png",
  types: ["Normal"],
  created: new Date()
 },
 {
  id: 15,
  name: "Psykokwak",
  hp: 24,
  cp: 5,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png",
  types: ["Eau"],
  created: new Date()
 },
 {
  id: 16,
  name: "Caninos",
  hp: 23,
  cp: 7,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/58.png",
  types: ["Feu"],
  created: new Date()
 },
 {
  id: 17,
  name: "Ptitard",
  hp: 20,
  cp: 4,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/60.png",
  types: ["Eau"],
  created: new Date()
 },
 {
  id: 18,
  name: "Abra",
  hp: 16,
  cp: 9,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/63.png",
  types: ["Psy"],
  created: new Date()
 },
 {
  id: 19,
  name: "Machoc",
  hp: 28,
  cp: 6,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/66.png",
  types: ["Combat"],
  created: new Date()
 },
 {
  id: 20,
  name: "Chétiflor",
  hp: 19,
  cp: 5,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/69.png",
  types: ["Plante", "Poison"],
  created: new Date()
 },
 {
  id: 21,
  name: "Tentacool",
  hp: 21,
  cp: 4,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/72.png",
  types: ["Eau", "Poison"],
  created: new Date()
 },
 {
  id: 22,
  name: "Racaillou",
  hp: 30,
  cp: 3,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png",
  types: ["Roche", "Sol"],
  created: new Date()
 },
 {
  id: 23,
  name: "Ponyta",
  hp: 26,
  cp: 7,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/77.png",
  types: ["Feu"],
  created: new Date()
 },
 {
  id: 24,
  name: "Ramoloss",
  hp: 31,
  cp: 4,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/79.png",
  types: ["Eau", "Psy"],
  created: new Date()
 },
 {
  id: 25,
  name: "Magnéti",
  hp: 18,
  cp: 8,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/81.png",
  types: ["Electrik", "Acier"],
  created: new Date()
 },
 {
  id: 26,
  name: "Canarticho",
  hp: 19,
  cp: 6,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/83.png",
  types: ["Normal", "Vol"],
  created: new Date()
 },
 {
  id: 27,
  name: "Otaria",
  hp: 24,
  cp: 5,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/86.png",
  types: ["Eau"],
  created: new Date()
 },
 {
  id: 28,
  name: "Krabby",
  hp: 21,
  cp: 5,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/98.png",
  types: ["Eau"],
  created: new Date()
 },
 {
  id: 29,
  name: "Voltorbe",
  hp: 17,
  cp: 7,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/100.png",
  types: ["Electrik"],
  created: new Date()
 },
 {
  id: 30,
  name: "Kokiyas",
  hp: 18,
  cp: 4,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/90.png",
  types: ["Eau"],
  created: new Date()
 },
 {
  id: 31,
  name: "Evoli",
  hp: 23,
  cp: 8,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png",
  types: ["Normal"],
  created: new Date()
 },
 {
  id: 32,
  name: "Minidraco",
  hp: 20,
  cp: 9,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/147.png",
  types: ["Dragon"],
  created: new Date()
 },
 {
  id: 33,
  name: "Mew",
  hp: 35,
  cp: 10,
    picture: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png",
  types: ["Psy"],
  created: new Date()
 }
]

module.exports = pokemons;	

