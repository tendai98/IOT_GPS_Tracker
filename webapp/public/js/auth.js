function showPrompt(){
    let username = window.prompt("Userame", "")
    let password = window.prompt("Password","")

    $.getJSON(`http://${window.location.host}/login?username=${username}&password=${password}`, (response) => {
        if(response.message.includes("client") || response.message.includes("driver")){
            window.location.href = response.message
        }else{
            alert(response.message)
            window.location.href = '/'
        }
    })
}

showPrompt() 