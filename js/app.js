// carregamento AJAX
let ajax = new XMLHttpRequest();

ajax.open("GET", "./dados.json", true);

ajax.send();

// monitorar o retorno da request
ajax.onreadystatechange = function () {
    // especificar o container que recebe o conteudo gerado neste arquivo
    let content = document.getElementById("content");

    if (this.readyState == 4 && this.status == 200) {
        let data_json = JSON.parse(ajax.responseText);

        if (data_json.length == 0) {
            content.innerHTML = '<div class="alert alert-warning role="alert">Desculpe. Ainda não há brinquedos cadastrados!</div>';
        } else {

            let html_content = "";

            for (let i = 0; i < data_json.length; i++) {

                html_content += '<div class="row"><div class="col-12"><h2><span></span>' + data_json[i].categoria + '</h2></div></div>';

                if (data_json[i].brinquedos.length == 0) {
                    html_content += '<div class="row"><div class="col-12"><div class="alert alert-warning role="alert">Desculpe. Não temos brinquedos nesta categoria!</div></div></div>';
                } else {
                    html_content += '<div class="row">';

                    for (let j = 0; j < data_json[i].brinquedos.length; j++) {
                        html_content += card_brinquedo(
                            data_json[i].brinquedos[j].nome,
                            data_json[i].brinquedos[j].imagem,
                            data_json[i].brinquedos[j].whatsapp,
                            data_json[i].brinquedos[j].valor,
                        )
                    }

                    html_content += '</div>';
                }
            }

            content.innerHTML = html_content;
            cache_dinamico(data_json);
        }
    }
}

// template do card do brinquedo

var card_brinquedo = function(nome, imagem, whatsapp, valor) {
    return '<div class="col-lg-4">' +
                '<div class="card">' +
                    '<img src="'+imagem+'" class="card-img-top" alt="'+nome+'">' +
                    '<div class="card-body">' +
                        '<h5 class="card-title">'+nome+'</h5>' +
                        '<p class="card-text"><strong>Valor:</strong>'+valor+'</p>' +
                        '<a href="https://api.whatsapp.com/send?phone=55'+whatsapp+'&text=Olá gostaria de informações sobre o brinquedo: '+nome+'" target="_blank" class="btn btn-info btn-block">Contato</a>' +
                    '</div>' +
                '</div>' +
            '</div>';
}

// construir o cache dinâmico

var cache_dinamico = function(data_json) {
    const CHAVE_CHAVE_DINAMICO = 'brinquedo-app-dinamico';

    if('caches' in window) {
        console.log('Deletando cache dinamico antigo');

        caches.delete(CHAVE_CHAVE_DINAMICO).then(() => {
            if (data_json.length > 0) {
                var files = ['dados.json'];

                for (let i = 0; i < data_json.length; i++) {
                    for (let j = 0; j < data_json[i].brinquedos.length; j++) {
                        const alreadyExistsOnCache = files.indexOf(data_json[i].brinquedos[j].imagem) != -1;

                        if (!alreadyExistsOnCache) {
                            files.push(data_json[i].brinquedos[j].imagem)
                        }
                    }
                }
            }

            caches.open(CHAVE_CHAVE_DINAMICO).then(cache => {
                cache.addAll(files).then(() => console.log("Novo cache dinamico adicionado com sucesso"))
            })
        })
    }
}

// botao de instalação
let disparoInstalacao = null;
const btInstall = document.getElementById('btInstall');

let inicializarInstalacao = function() {
    btInstall.removeAttribute("hidden");
    btInstall.addEventListener('click', (event) => {
        disparoInstalacao.prompt();

        disparoInstalacao.userChoice.then(choice => {
            if (choice.outcome === 'accepted') {
                console.log('Usuario realizou instalação');
                btInstall.attributes('hidden') = true;

            } else {
                console.log('Usuario não realizou instalação');
            }
        })
    })
};

window.addEventListener('beforeinstallprompt', gravarDisparo);

function gravarDisparo(event) {
    disparoInstalacao = event;
}
