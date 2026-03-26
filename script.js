
document.addEventListener("DOMContentLoaded", carregar);
const localStorageKey = 'enderecos'


function limpa_formulário_cep() {
    //Limpa valores do formulário de cep.
    document.getElementById('rua').value = ("");
    document.getElementById('numero').value = ("");
    document.getElementById('bairro').value = ("");
    document.getElementById('cidade').value = ("");
    document.getElementById('uf').value = ("");

}

function meu_callback(conteudo) {
    if (!("erro" in conteudo)) {
        //Atualiza os campos com os valores que vem da API.
        document.getElementById('rua').value = (conteudo.logradouro);
        document.getElementById('bairro').value = (conteudo.bairro);
        document.getElementById('cidade').value = (conteudo.localidade);
        document.getElementById('uf').value = (conteudo.uf);
    }
    else {
        limpa_formulário_cep();
        alert("CEP não encontrado.");
    }
}

function pesquisacep(valor) {

    //verifica se o cep so tem numeros.
    var cep = valor.replace(/\D/g, '');

    //Verifica se campo cep possui valor .
    if (cep != "") {

        //Nova verificação do cep.
        var validacep = /^[0-9]{8}$/;

        //Valida o formato do CEP.
        if (validacep.test(cep)) {

            //Preenche os campos com "..." enquanto consulta webservice.
            document.getElementById('rua').value = "...";
            document.getElementById('bairro').value = "...";
            document.getElementById('cidade').value = "...";
            document.getElementById('uf').value = "...";


            //Cria um elemento javascript.
            var script = document.createElement('script');

            //Sincroniza com o callback.
            script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=meu_callback';

            //Insere script no documento e carrega o conteúdo.
            document.body.appendChild(script);

        }
        else {

            limpa_formulário_cep();
            alert("Formato de CEP inválido.");
        }
    }
    else {

        limpa_formulário_cep();
    }
};

document.querySelector("form").addEventListener("submit", salvarte);

function salvarte(event) {
event.preventDefault();

    let arrayPessoas = JSON.parse(localStorage.getItem("enderecos")) || [];

    let dados = {
        cep: document.getElementById('cep').value.replace(/\D/g, ''),
        rua: document.getElementById('rua').value,
        numero: document.getElementById('numero').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('uf').value
    };

    if (indexEdicao !== null) {
        
        arrayPessoas[indexEdicao] = dados;
        alert("Endereço atualizado com sucesso!");
        indexEdicao = null; 
        document.querySelector("input[type='submit']").value = "Salvar"; 
    } else {
        
        arrayPessoas.push(dados);
        alert("Endereço salvo com sucesso!");
    }

    localStorage.setItem("enderecos", JSON.stringify(arrayPessoas));
    limpa_formulário_cep();
    carregar();
}

function carregar() {
    let dados = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    let div = document.querySelector("#teste");

    div.innerHTML = "";

    dados.forEach(item => {
        let p = document.createElement("p");
        p.innerHTML = `
        <input type="radio" id="html" name="end_completo" 
            value ="${item.cep} - ${item.rua} - ${item.numero} - ${item.bairro} - ${item.cidade} - ${item.estado}">
         ${item.cep} - ${item.rua} - ${item.numero} - ${item.bairro} - ${item.cidade} - ${item.estado} </input>
         <input type="button" id='remover' onclick="removerEndereco(this)" value="Remover"></input>
         
         `;
        div.appendChild(p);
    });
}
let indexEdicao = null;
function selecionar() {
    let dados = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    let radios = document.querySelectorAll('input[type="radio"]');
    let selectedValue;

    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            selectedValue = radios[i].value;

            for (let j = 0; j < dados.length; j++) {
                let valorItem = `${dados[j].cep} - ${dados[j].rua} - ${dados[j].numero} - ${dados[j].bairro} - ${dados[j].cidade} - ${dados[j].estado}`;

                if (valorItem.trim() === selectedValue.trim()) {
                    
                    document.getElementById('cep').value = dados[j].cep;
                    document.getElementById('rua').value = dados[j].rua;
                    document.getElementById('numero').value = dados[j].numero;
                    document.getElementById('bairro').value = dados[j].bairro;
                    document.getElementById('cidade').value = dados[j].cidade;
                    document.getElementById('uf').value = dados[j].estado;

                    indexEdicao = j; 
                    
                    document.querySelector("input[type='submit']").value = "Atualizar Endereço";
                    
                    break;
                }
            }
            break;
        }
    }
}

function removerEndereco(button) {
    let dados = JSON.parse(localStorage.getItem(localStorageKey)) || [];

    let radio = button.parentNode.querySelector('input[type="radio"]');

    let selectedValue = radio.value;

    let novosDados = dados.filter(item => {
        let valorItem = `${item.cep} - ${item.rua} - ${item.numero} - ${item.bairro} - ${item.cidade} - ${item.estado}`;
        return valorItem.trim() !== selectedValue.trim();
    });

    localStorage.setItem(localStorageKey, JSON.stringify(novosDados));

    alert("Endereço removido!");

    carregar();
}
