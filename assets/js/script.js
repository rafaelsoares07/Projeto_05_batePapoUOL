const URL_POST_LOGIN = "https://mock-api.driven.com.br/api/v6/uol/participants "
const URL_POST_KEEP_CONECT = "https://mock-api.driven.com.br/api/v6/uol/status"
const URL_GET_MENSSAGE = "https://mock-api.driven.com.br/api/v6/uol/messages"
const URL_SEND_MENSSAGE = "https://mock-api.driven.com.br/api/v6/uol/messages"
const URL_GET_USERS_ACTIVE = "https://mock-api.driven.com.br/api/v6/uol/participants"


let postManutencao; // Variavel pra usar no ClearInterval para deslogar Usuario
let nameUser;
let objetoName;




//Eventos
document.addEventListener('keypress', (element)=>{
    if(element.key ===  'Enter'){
        sendChatMessage()
    }
})

//Animações
function exibirMenu(){
    console.log('clicou')

     let el = document.querySelector('aside')

     el.classList.add('toggleAnimation')

     el.style.display = 'block'

}

function ocultarMenu(){
    el = document.querySelector('aside')
    el.classList.remove('toggleAnimation')

    el.style.display = 'none'
}






//INÍCIO DA FUNÇÃO QUE FAZ O LOGIN E MANTEM A CONEXÃO DO USER COM O setINTERVAL
function postLogInChat() {

    

    nameUser = document.querySelector('.InputNameUser').value
    console.log(nameUser)

    LogOutChat()//clearInterval limpa o clearInteval do objeto anterior , antes eu tava limpando só qunado clicava ai ficou sobrescrito os objetos

     objetoName = {
        name: nameUser
    }

    let loginUser = axios.post(URL_POST_LOGIN, objetoName)

    loginUser.then(response => {
       // console.log(response.status)
       
        if (response.status === 200) {
            console.log("USUÁRIO ENTROU COM SUCESSO statusCode(200)")
            document.querySelector('.telaEntrada').style.display = 'none'
        }
        postManutencao = setInterval(function () {
            axios.post(URL_POST_KEEP_CONECT, objetoName).then(response => {
                //console.log(response)
                console.log(objetoName)

              //  console.log('CONEXÃO MANTIDA COM SUCESSO')
            }).catch(error => console.log(error))
        }, 3000)


    }).catch(error => {
        if (error.response.status == 400) {
        alert("JÁ EXISTE UM USUARIO ATIVO COM ESSE NOME statusCode(400)")
        }
    })
}
//FIM DA FUNÇÃO QUE FAZ O LOGIN E MANTEM A CONEXÃO DO USER COM O setINTERVAL




//INICÍO DA FUNÇÃO QUE FAZ O ENVIO DE MENSAGENS
function sendChatMessage() {

    let mensageInput = document.querySelector('.InputMessageUser').value
    //console.log(mensageInput)

    document.querySelector('.InputMessageUser').value =''


    let message={
        from:nameUser,
        to:"Todos",
        text:mensageInput,
        type:"message"
    }


    let enviarMessage = axios.post(URL_SEND_MENSSAGE,message)

    enviarMessage.then(response=>{
       
        //console.log(response + 'sendChatMensage')
        
    }).catch(error=> {
        window.location.reload()
    })
}

//FIM DA FUNCÃO QUE FAZ O ENVIO DAS MENSAGENS




// funcao de fazer o log out
function LogOutChat(){
    clearInterval(postManutencao)
    console.log('fez o log out')
}
// funcao de fazer o log out




//INÍCIO DA FUNÇÃO QUE FAZ A REQUISIÇÃO DAS MENSAGEM 
function getChatMessage() {

    getActiveUser()

    let mensagem = axios.get(URL_GET_MENSSAGE)

    mensagem.then(response => {
        
        
        renderizarMessages(response)

        if (response.status === 200) {
           // console.log('deu certo --- 200')
        }
    }).catch(error => console.log(error))
}

setInterval(getChatMessage,1000)
//FIM DA FUNÇÃO QUE FAZ A REQUISIÇÃO DAS MENSAGEM 



function renderizarMessages(response){
    

    let caixaMensagens = document.querySelector('.caixa-mensagens')
    

    caixaMensagens.innerHTML = ''
    for(let i=50; i<response.data.length; i++){
        //console.log("entrou")
        let userAtual = response.data[i]

        caixaMensagens.innerHTML = caixaMensagens.innerHTML + formataCaixaMessage(userAtual)

    }
}


function formataCaixaMessage(response){

    if(response.text === "entra na sala..."){
        return `<li class="box-menssage entrou">
        <div class="message">
            <span class='spanHours'>(${response.time}) </span> ${response.from}: ${response.text}
        </div>
    </li>`
    }

    else if(response.text === "sai da sala..."){
        return `<li class="box-menssage saiu">
        <div class="message">
            <span class='spanHours'>(${response.time}) </span> ${response.from}: ${response.text}
        </div>
    </li>`
    }

    else{
        return `<li class="box-menssage">
        <div class="message">
            <span class='spanHours'>(${response.time}) </span> ${response.from}: ${response.text}
        </div>
    </li>`

    }
}


//Fução para pegar usuarios ativos

function getActiveUser(){

    let UserActive = axios.get(URL_GET_USERS_ACTIVE)

    UserActive.then(response =>{
        
        renderizarUsuariosAtivos(response.data)

    }).catch(error => console.log(error))
}

function renderizarUsuariosAtivos(response){
    
    let UsersActive = document.querySelector('.UsersAtivos')

    UsersActive.innerHTML = ''
    for(let i = 0; i<response.length; i++){
        let nameUser = response[i].name

        UsersActive.innerHTML +=
    ` <div class="row-user">
        <img src="assets/img/Vector(3).png" alt="">
        <p>${nameUser}</p>
     </div>`
    }
}


