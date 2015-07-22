function Dessert(name){
    if (!(this instanceof Dessert)) return new Dessert(name);
    this.name = name;
}

module.exports = [
    { name: "main", type: String },
    { name: "dessert", type: Dessert },
    { name: "courses", type: Number }
];
