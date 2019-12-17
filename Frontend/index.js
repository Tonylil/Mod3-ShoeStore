// Code your solution here
let allShoes, currentShoe;
document.addEventListener('DOMContentLoaded', () => {
	//var getting the basic elements on the DOM.
	let shoeList = document.getElementById("shoe-list")
	let mainShoe = document.getElementById("main-shoe")
	const shoeReviewTag = mainShoe.querySelector("#reviews-list")
	
	//*********** Functions ***********
	//Adds a Single Shoe to the side bar
	const addItemToShoeList = shoe => {
		//Create new Li Element & Adding details
		const newShoeLi = document.createElement("li");
		newShoeLi.className = "list-group-item";
		newShoeLi.innerText = shoe.name;

		shoeList.append(newShoeLi);
	}

	//Adds a review to the current main shoe reviews list
	const addReviewToReviewList = review => {
		//Create new Li Element & Adding details
		const newReviewLi = document.createElement("li")
		newReviewLi.className = "list-group-item";
		newReviewLi.innerText = review.content

		shoeReviewTag.append(newReviewLi);
	}

	//Changes the main shoe by a json of a single shoe
	const changeMainShoe = shoe => {
		currentShoe = shoe
		//Getting all the elements I need
		const shoeImg = mainShoe.querySelector("#shoe-image")
		const shoeName = mainShoe.querySelector("#shoe-name")
		const shoeDescription = mainShoe.querySelector("#shoe-description")
		const shoePrice = mainShoe.querySelector("#shoe-price")
		const shoeFormDiv = mainShoe.querySelector("#form-container")
		

		//Changing the data on HTML of main shoe
		shoeImg.src = shoe.image
		shoeName.innerText = shoe.name
		shoeDescription.innerText = shoe.description
		shoePrice.innerText = shoe.price

		//Adding the Form here
		shoeFormDiv.innerHTML = 
		`<form id="new-review">
  			<div class="form-group">
    			<textarea class="form-control" id="review-content" rows="3"></textarea>
    			<input type="submit" class="btn btn-primary"></input>
  			</div>
		</form>`

		//Adding Functionality to form
		const shoeForm = shoeFormDiv.querySelector("#new-review");
		shoeForm.addEventListener("submit", (event) => {
			//Stop Refreshing the page
			event.preventDefault()
			//Getting the content of the review
			const newReviewDetails = event.target["review-content"].value;
			//Added a check to see if newReviewDetails is empty
			if (newReviewDetails === "")
			{
				alert("Content must be filled");
				return;
			}

			//Creating a new review
			fetch(`http://localhost:3000/shoes/${currentShoe.id}/reviews`, {
				method:'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({
			      content: newReviewDetails
			    })
			}).then(respond => respond.json())
			.then(review => {
				//Adding review to current Shoe
				addReviewToReviewList(review);
				//Updating the allShoe Json with the newest review
				getAllShoeDataFromServer();
			})
		})
		//Show Reviews here
		shoeReviewTag.querySelectorAll('*').forEach(n => n.remove());
		shoe.reviews.forEach(review => addReviewToReviewList(review))
	}


	//**********  Fetching/Populating Screen  ***************
	//Populating the Side Bar
	const getAllShoeDataFromServer = () => 
	{
		fetch("http://localhost:3000/shoes")
			.then( respond => respond.json())
			.then( json => {
				//Storing the data to a global varible so we don't have to find data everytime
				allShoes = json;
				//Populating the side Bar
				json.forEach(addItemToShoeList)
			})
	}
	//Calling it immediently to get the data
	getAllShoeDataFromServer()

	//Populating the main selected Shoes
	fetch("http://localhost:3000/shoes/1")
		.then(respond => respond.json())
		.then(json => changeMainShoe(json))

	//*********** Main/Run *************
    //Adding Event Listener to Side Bar
    shoeList.addEventListener("click", (event) =>{
    	const target = event.target
    	if (target.tagName === "LI")
    	{
    		//Find the target data in the json
     		//fetch("http://localhost:3000/shoes")
			// .then( respond => respond.json())
			// .then( json => {
			// 	//const found = array1.find(element => element > 10);
			// 	const found = json.find(shoe => target.innerText === shoe.name)
			// 	changeMainShoe(found);
			// })

			//A different way to do the above, without getting new data everytime
			const found = allShoes.find(shoe => target.innerText === shoe.name)
			changeMainShoe(found);
    	}
    })

});