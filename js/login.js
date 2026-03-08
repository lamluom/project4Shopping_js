let useremail = document.querySelector("#email")
let password = document.querySelector("#password")

let loginBtn = document.querySelector("#sign_in")

let getUser = localStorage.getItem("email")
let getPassword = localStorage.getItem("password")

loginBtn.addEventListener ("click" , function(e){
    e.preventDefault()
    if (useremail.value==="" || password.value===""){
        alert("please fill data ")
    } else {
        if ( (getUser && getUser.trim() === useremail.value.trim() && getPassword && getPassword === password.value )  )
        {
            setTimeout ( () => {
                window.location = "index.html"
            } , 1500)
        } else {
            console.log("username or password is wrong ")
        }
    }
})



