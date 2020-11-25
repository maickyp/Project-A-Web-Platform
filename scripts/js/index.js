(function(){
    'use strict';

 if (sessionStorage.getItem("userType") == 2) {
     let hide = document.querySelectorAll(".admin");
     hide.forEach(element => {
         element.style.display = "none";
     })
 }

})();
 
 
 
