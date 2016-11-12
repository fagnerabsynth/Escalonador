function modal(c) {

    switch (c) {
        case "Criar processo":
            var r = criarProcesso();
            $('#titulo').html(r.titulo);
            $('#campo').html(r.campo);
            $('#botoes').html(r.botoes);
            break;
        default:
            $('#titulo').html('');
            $('#campo').html('');
            $('#botoes').html('');
    }


    if ($('#titulo').html().trim() !== "")
        $('#modal').modal('show');
}


function criarProcesso() {
    var html = "";
    html += "<label for=\"processo\">Criar processo</label>";
    html += "<input type=\"text\" placeholder=\"Nome do processo\" class=\"form-control\" id=\"processo\" >";
    html += "<label for=\"prioridade\">Prioridade</label>";
    html += "<input type=\"number\" class=\"form-control\" id=\"prioridade\" >";
    html += "<label for=\"tempo\">Tempo de execução</label>";
    html += "<input type=\"number\" class=\"form-control\" id=\"tempo\" >";
    html += "<label for=\"limite\">Limite* <small><small>Caso você utilize o metódo circular.</small></small></label>";
    html += "<input type=\"number\" class=\"form-control\" id=\"limite\" >";
    var btn = "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Fechar</button>\n\
<button type=\"button\" onclick=\"salvaProcesso()\" class=\"btn btn-primary\">Salvar alterações</button>";
    return {titulo: "Criar processo", campo: html, botoes: btn};
}

var processos = new Array();
function salvaProcesso() {
    var processo = $('#processo').val().trim();
    var prioridade = $('#prioridade').val().trim().replace("/[^0-9]/g", "");
    var tempo = $('#tempo').val().trim().replace("/[^0-9]/g", "");
    var limite = $('#limite').val().trim().replace("/[^0-9]/g", "");
    var erro = false;
    var mensagem = "";
    if (processo === "") {
        erro = true;
        mensagem += "Por favor, digite o nome do processo!";
    }

    if (tempo <= 0) {
        erro = true;
        if (mensagem.length > 0) {
            mensagem += "\n";
        }
        mensagem += "Por favor, insira um tempo válido!";
    }


    if (!(prioridade > 0 && prioridade <= 5)) {
        erro = true;
        if (mensagem.length > 0) {
            mensagem += "\n";
        }
        mensagem += "Por favor, prioridade entre 1 e 5!";
    }

    if (limite === 0) {
        limite = tempo;
    }
    if (erro) {
        alert(mensagem);
    } else {
        var ok = true;
        if (processos.length > 0) {


            for (var m in processos) {
                if (processos[m].processo === processo) {
                    processos[m].processo = processo;
                    processos[m].tempo = tempo;
                    processos[m].prioridade = prioridade;
                    processos[m].limite = limite;
                    $('#processo').attr({"readonly": "readonly"});
                    alert('dados atualizados com sucesso!');
                    ok = false;
                    break;
                }
            }
            if (ok) {
                processos.push({prioridade: prioridade, tempo: tempo, processo: processo, limite: limite});
            }

        } else {
            processos.push({prioridade: prioridade, tempo: tempo, processo: processo, limite: limite});
        }


        listarProcessos();
        $('#modal').modal('hide');

    }
}



function listarProcessos() {
    var html = "";
    if (processos.length > 0) {
        var i = 1;
        html += "<table class='table table-condensed table-hover'><thead><tr><th></th><th>Processo:</th></th><th>Prioridade</th><th></th><th></th></tr></head><tbody>";
        for (var item in processos) {
            html += "<tr><td>" + i + "</td><td>" + processos[item].processo + "</td><td>" + processos[item].prioridade + "</td><td title='Editar'><a href=\"javascript:void(0)\" onclick=\"editarProcesso('" + item + "');\" >E</a></td><td><a href=\"javascript:void(0)\" onclick=\"apagaProcesso('" + item + "')\" >X</a></td></tr>";
        }
        html += "</tbody></table>";

        html += "<select class=\"btn btn-danger form-control\" id=\"select\"><option value=\"\">Selecione o algoritmo</option>\n\
<option value=\"fifo\">Fifo</option>\n\
<option value=\"circular\">Circular</option>\n\
<option value=\"stf\">STF</option>\n\
</select>";

        html += "<input type=\"button\" value=\"Inciar Processo\" class=\"btn btn-primary form-control\" onclick=\"processa()\">";

    }
    jQuery("#processosCadastrados").html(html);
}

function apagaProcesso(i) {
    var c = processos[i];
    if (confirm("Você deseja apagar o processo \"" + c.processo + "\"?")) {
        processos.splice(i, 1);
        if (processos.length > 0) {
            var temp = new Array();
            for (var x in processos) {
                temp.push(processos[x])
            }
            processos = new Array();
            processos = temp;
        }
        listarProcessos();
    }
}




function editarProcesso(i) {
    if (processos.length > 0) {
        modal("Criar processo");

        $('#processo').val(processos[i]["processo"]).attr({"readonly": "readonly"});
        $('#prioridade').val(processos[i]["prioridade"]);
        $('#tempo').val(processos[i]["tempo"]);
        $('#limite').val(processos[i]["limite"]);

    }
}

function processa() {
    var d = $('#select').val();
    switch (d) {
        case 'fifo':
            fifo();
            break;
        default:
            alert("Por favor selecione um algoritmo!");
    }
}



var dadosProcesso;
var travaProcesso = true;
function fifo() {
    if (travaProcesso) {
        travaProcesso = false;
        iniciaFifo(processos, 0);
    }
}

function contaTempo(t) {
    t = parseInt(t) * 1000;
    $('#xtempo').css({width: "0%"});
    $('#xtempo').animate({width: "100%"}, {
        queue: false,
        duration: t
    }, function () {
        $('#xtempox').html("Execução concluída!");
    });
}


var para;
function iniciaFifo(p, i) {
    var tempo = parseInt(p[i]['tempo']);

    var html = "<table class=\"table table-condensed table-hover\"><thead>";
    html += "<tr><td>Nº</td><td>Nome</td><td>Prioridade</td><td>Tempo</td><td>Status</td></tr>";

    html += "</thead><tbody>";
    var status;
    for (var x in p) {

        if (x == i) {
            status = "<div style=\"background-color:green;text-align:center;color:white;font-weight:bolder;\" id=\"exe\">Execução</div>";
        } else if (status === "<div style=\"background-color:green;text-align:center;color:white;font-weight:bolder;\" id=\"exe\">Execução</div>") {
            status = "<div style=\"background-color:yellow;text-align:center;color:white;font-weight:bolder;\">Pronto</div>";
        } else {
            status = "<div style=\"background-color:#d1d1d1;text-align:center;color:white;font-weight:bolder;\">Espera</div>";
        }

        html += "<tr><td>" + (parseInt(x) + 1) + "</td><td>" + p[x]["processo"] + "</td><td>" + p[x]["prioridade"] + "</td><td>" + p[x]["tempo"] + "</td><td>" + status + "</td></tr>";
        if (x == i) {
            html += "<tr><td colspan='5' id='campo'>\n\<div class=\"progress\"><div class=\"progress-bar progress-bar-success progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\" id=\"xtempo\"></div></div></td></tr>";
        }
    }
    html += "</tbody></table>";
    $("#conteudo").html(html);
    contaTempo(tempo.toString());
    i++;
    if (p.length > i) {
        para = window.setTimeout(function () {
            iniciaFifo(p, i);
        }, tempo * 1000);
    } else {
        travaProcesso = true;
        para = window.setTimeout(function () {
            $('#xtempo').html("Processo finalizado!");
            $('#xtempo').removeClass("active");
            $('#exe').html("<div style=\"background-color:#d1d1d1;text-align:center;color:white;font-weight:bolder;\">Espera</div>");

        }, tempo * 1050);

    }
}

