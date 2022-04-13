const URL_POST_LOGIN = "https://mock-api.driven.com.br/api/v6/uol/participants "
const URL_POST_KEEP_CONECT = "https://mock-api.driven.com.br/api/v6/uol/status"
const URL_GET_MENSSAGE = "https://mock-api.driven.com.br/api/v6/uol/messages"
const URL_SEND_MENSSAGE = "https://mock-api.driven.com.br/api/v6/uol/messages"

let postManutencao; // Variavel pra usar no ClearInterval para deslogar Usuario
let nameUser;





//INÍCIO DA FUNÇÃO QUE FAZ O LOGIN E MANTEM A CONEXÃO DO USER COM O setINTERVAL
function postLogInChat() {
    nameUser = document.querySelector('.InputNameUser').value
    console.log(nameUser)

    LogOutChat()//clearInterval limpa o clearInteval do objeto anterior , antes eu tava limpando só qunado clicava ai ficou sobrescrito os objetos

     let objetoName = {
        name: nameUser
    }

    let loginUser = axios.post(URL_POST_LOGIN, objetoName)

    loginUser.then(response => {
       // console.log(response.status)
       
        if (response.status === 200) {
            console.log("USUÁRIO ENTROU COM SUCESSO statusCode(200)")
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
   
    let message={
        from:nameUser,
        to:"Todos",
        text:mensageInput,
        type:"message"
    }


    let enviarMessage = axios.post(URL_SEND_MENSSAGE,message)

    enviarMessage.then(response=>{
       
        //console.log(response + 'sendChatMensage')
        
    }).catch(error=> console.log(error))
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

    let mensagem = axios.get(URL_GET_MENSSAGE)

    mensagem.then(response => {
        
        renderizarMessages(response)

        if (response.status === 200) {
           // console.log('deu certo --- 200')
        }
    }).catch(error => console.log(error))
}
//FIM DA FUNÇÃO QUE FAZ A REQUISIÇÃO DAS MENSAGEM 



function renderizarMessages(response){

    

    let caixaMensagens = document.querySelector('.caixa-mensagens')

    caixaMensagens.innerHTML = ''
    for(let i=95; i<response.data.length; i++){
        //console.log("entrou")
        let userAtual = response.data[i]
        caixaMensagens.innerHTML = caixaMensagens.innerHTML + `<li> ${userAtual.from}: ${userAtual.text}</li>`
    }
}


setInterval(getChatMessage,100)

