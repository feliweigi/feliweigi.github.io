function toggleCam(target) {
    let matches = document.querySelectorAll("." + target);
    
    matches.forEach(function (match) {
        
        if (match.style.display == "none"){
            match.style.display = "";}
        else{
            match.style.display = "none";
            
        }
    });



    if(document.getElementById('btn_' + target).style.opacity == 0.5){
        document.getElementById('btn_' + target).style.opacity = 1.0;
}   
    else{
        document.getElementById('btn_' + target).style.opacity = 0.5;
}

}