fetch("http://localhost:8088/food")
//the first then is always to convert the json to javascript data
  .then( (foodData) => foodData.json() )
//the second then is used to manipulate the data
    .then( (realData) => {
      console.table(realData)
      let foodList = document.querySelector("#foodlist");
      //realData is an array of objects (food is the object at each index)
      realData.forEach( (food) => {

        fetch(`https://world.openfoodfacts.org/api/v0/product/${food.barcode}.json`)
          .then( (factsData) => factsData.json() )
            .then( (usableFactsData) => {

              //determine calories correctly, based on country (kJ to kcal)
              let energy_value = usableFactsData.product.nutriments.energy_value
              let energy_serving = usableFactsData.product.nutriments.energy_serving
              let energy_unit = usableFactsData.product.nutriments.energy_unit
              let Calorie = 0;

              if (energy_serving === '') {
                if (energy_unit === "kJ") {
                  Calorie = Math.round(parseInt(energy_value)*0.239006);
                } else if (energy_unit === "kcal") {
                  Calorie = energy_value;
                }
              } else if (parseInt(energy_serving) > 0) {
                if (energy_unit === "kJ") {
                  Calorie = Math.round(parseInt(energy_serving)*0.239006);
                } else if (energy_unit === "kcal") {
                  Calorie = energy_serving;
                }
              } else {
                Calorie = "Error in kcal calculation"
              }

              let fat = usableFactsData.product.nutriments.fat_serving
              let sugar = usableFactsData.product.nutriments.sugars_serving

              //append results of fetch and calorie calculations to DOM
              foodList.innerHTML += `<section class="foods">
              <h1>${food.name}</h1>
              <div>Type: ${food.type}</div>
              <div>Ethnicity: ${food.ethnicity}</div>
              <div>Ingredients: ${usableFactsData.product.ingredients_text}</div>
              <div>Origin: ${usableFactsData.product.countries}</div>
              <div>Calories per serving: ${Calorie}</div>
              <div>Fat per serving: ${fat}</div>
              <div>Sugar per serving: ${sugar}</div>
              </section>`

            })
      })
    })