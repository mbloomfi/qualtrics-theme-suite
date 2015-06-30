var brandDropDown = {
	populate: function(){
		var brandName = el("#brandName");
		brandName.append(
			el("+div").addClass("dropdown").append(
				el.join([
					el("+div#searchBrandsContainer").append(
						el("+input#searchBrands").text("serch brands")
					),
					el("+div#recentBrands").text("recent brands"),
					el("+div#newBrand").text("brand")
				])
			)
		);
		console.log("lpd",localPersistentData);
	}
};