export class RecipeModel {
    constructor
      (
        public id: string,
        public Name: string,
        public Image: string,
        public Ingredients: string,
        public Method: string,
        public Notes: string,
        public Tools: string,
        public Date: string
      )
    {}   
}