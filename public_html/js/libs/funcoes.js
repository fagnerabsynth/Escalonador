





function alteraStatus(proximo, atual, tempo, todos) {


    atual = parseInt(atual);
    proximo = parseInt(proximo) + 1;
    for (var n in todos) {
        $("#idx" + (n + 1)).html("<div style=\"background-color:#d1d1d1;text-align:center;color:white;font-weight:bolder;\">Espera</div>");
    }
    var t = parseInt(tempo) * 1000 / 2;
    $("#idx" + proximo).html("<div style=\"background-color:#d1d1d1;text-align:center;color:white;font-weight:bolder;\">Espera</div>");
    window.setTimeout(function () {
        $("#idx" + proximo).html("<div style=\"background-color:yellow;text-align:center;color:white;font-weight:bolder;\">Pronto</div>");
    }, t);
    $("#idx" + (atual + 1)).html("<div style=\"background-color:green;text-align:center;color:white;font-weight:bolder;\" id=\"exe\">Execução</div>");
}

function iniciaCircular(p, i) {

    var mx = i;
    libera++;
    var tempo = parseInt(p[mx]['tempo']);
    var limite = parseInt(p[mx]['limite']);

    var html = "<table class=\"table table-condensed table-hover\"><thead>";
    html += "<tr><td>Nº</td><td>Nome</td><td>Prioridade</td><td>Tempo</td><td>Status</td></tr>";

    html += "</thead><tbody>";
    var status = "";
    var ids = new Array();
    for (var x in p) {
        ids.push({id: i, x: (parseInt(x) + 1), t: p[x]['limite']});
        if (p.length === 1) {
            if (x === i) {
                status = "<div style=\"background-color:green;text-align:center;color:white;font-weight:bolder;\" id=\"exe\">Execução</div>";
            } else if (status === "<div style=\"background-color:green;text-align:center;color:white;font-weight:bolder;\" id=\"exe\">Execução</div>") {
                status = "<div style=\"background-color:yellow;text-align:center;color:white;font-weight:bolder;\">Pronto</div>";
            } else {
                status = "<div style=\"background-color:#d1d1d1;text-align:center;color:white;font-weight:bolder;\">Espera</div>";
            }
        } else {
            status = "<div style=\"background-color:#d1d1d1;text-align:center;color:white;font-weight:bolder;\">Espera</div>";
        }
        html += "<tr><td>" + (parseInt(x) + 1) + "</td><td>" + p[x]["processo"] + "</td><td>" + p[x]["prioridade"] + "</td><td>" + p[x]["total"] + "</td><td><div id=\"idx" + (parseInt(x) + 1) + "\" class=\"exe\">" + status + "</div></td></tr>";


        if (x == i) {
            html += "<tr>\n\
<td colspan='5' id='campox'>\n\
<div class=\"progress\">\n\
<div class=\"progress-bar progress-bar-success progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\" id=\"xtempo\"></div>\n\
</div>\n\
</td>\n\
</tr>";
        }

    }
    html += "</tbody></table>";
    $("#conteudos").html(html);
    if (libera === 1) {
        trocaStatus(p, i, 0);
        return;
    }


    contaTempoLimite(tempo.toString(), limite.toString(), p[i]['carregado']);

    $('#idx' + (i + 1)).html("<div style=\"background-color:green;text-align:center;color:white;font-weight:bolder;\" id=\"exe\">Execução</div>");

    p[i]['carregado'] += parseInt(p[i]['limite']);
    p[i]["tempo"] = parseInt(p[i]["tempo"]);
    p[i]["limite"] = parseInt(p[i]["limite"]);






    if (p[i]["tempo"] > 0) {
        p[i]["tempo"] -= p[i]["limite"];
        if (p[i]["tempo"] < 0) {
            p[i]["tempo"] = 0;
        }


        var ex = false;
        for (var m in p) {
            if (p[m]["tempo"] > 0) {
                ex = true;
                break;
            }
        }



        if (ex) {



            if (p.length - 1 > i) {
                i++;
            } else {
                i = 0;
            }

            if (p[i]["tempo"] <= 0) {
                for (var m in p) {
                    if (p[m]["tempo"] > 0) {
                        i = m;
                        break;
                    }
                }
            }


            if (p.length > 1) {
                if (parseInt(i) === parseInt(mx)) {

                } else {
                    alteraStatus(parseInt(i), parseInt(mx), parseInt(p[i]["tempo"]), p);
                }
            }


            window.setTimeout(function () {
                if (p.length > 1) {

                    if (parseInt(i) !== parseInt(mx)) {
                        iniciaCircular(p, i);
                    } else {
                        trocaStatus(p, parseInt(mx), 0);
                    }

                } else {
                    if (p.length <= 1) {
                        trocaStatus(p, parseInt(mx), 0);
                    }
                }
            }, tempo * 1000);

        } else {
            $("#idx" + (i + 1)).html("<div style=\"background-color:green;text-align:center;color:white;font-weight:bolder;\" id=\"exe\">Execução</div>");

            window.setTimeout(function () {
                travaProcesso = true;
                $('#xtempo').html("Processo finalizado!");
                $('#xtempo').removeClass("active");
                $('#exe').html("<div style=\"background-color:#d1d1d1;text-align:center;color:white;font-weight:bolder;\">Espera</div>");
            }, tempo * 1050);
        }

    }



}



function trocaStatus(p, i, c) {
    var status = new Array();
    status[0] = "<div style=\"background-color:#d1d1d1;text-align:center;color:white;font-weight:bolder;\">Espera</div>";
    status[1] = "<div style=\"background-color:yellow;text-align:center;color:white;font-weight:bolder;\">Pronto</div>";
    status[2] = "<div style=\"background-color:green;text-align:center;color:white;font-weight:bolder;\" id=\"exe\">Execução</div>";
    $('#idx' + (i + 1)).html(status[c]);
    if (c < status.length) {
        window.setTimeout(function () {
            c++;
            trocaStatus(p, i, c);
        }, 1000);
    } else {
        iniciaCircular(p, i);
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



function contaTempoLimite(t, l, i) {
console.log(i);
    var p = ((parseInt(l) + parseInt(i)) * 100) / parseInt(t);

    if (p > 100) {
        p = 100;
    }

    i = ((parseInt(i)) * 100) / parseInt(t);
    t = parseInt(t) * 1000;

    $('#xtempo').css({width: i + "%"});
    $('#xtempo').animate({width: p + "%"}, {
        queue: false,
        duration: t
    }, function () {
        $('#xtempox').html("Execução concluída!");
    });

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
            html += "<tr>\n\
<td colspan='5' id='campox'>\n\
<div class=\"progress\">\n\
<div class=\"progress-bar progress-bar-success progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\" id=\"xtempo\"></div>\n\
</div>\n\
</td>\n\
</tr>";
        }

    }

    html += "</tbody></table>";
    $("#conteudos").html(html);
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


function stf() {
    if (travaProcesso) {
        travaProcesso = false;
        var tmp = new Array();
        for (var m in this.processos) {
            tmp.push(processos[m]);
        }
        var p = sorteioSTF(processos);
        this.processos = tmp;
        iniciaStf(processos, 0, p);
    }
}

function pegaPosicao(d, x) {
    for (var m in d) {
        if (d[m]['idx'] === x) {
            return  parseInt(d[m]['idx']) + 1;
        }
    }
}


var para;
function iniciaStf(p, i, d) {

    var tempo;

    var html = "<table class=\"table table-condensed table-hover\"><thead>";
    html += "<tr><td>Ordem</td><td>Nome</td><td>Prioridade</td><td>Tempo</td><td>Status</td></tr>";

    html += "</thead><tbody>";
    var status;



    for (var x in p) {
        if (p[x]['processo'] === d[i]['processo']) {
            tempo = parseInt(p[x]['tempo']);
            status = "<div style=\"background-color:green;text-align:center;color:white;font-weight:bolder;\" id=\"exe\">Execução</div>";
        } else if (i + 1 < p.length) {

            if (p[x]['processo'] === d[i + 1]['processo']) {
                status = "<div style=\"background-color:yellow;text-align:center;color:white;font-weight:bolder;\">Pronto</div>";
            } else {
                status = "<div style=\"background-color:#d1d1d1;text-align:center;color:white;font-weight:bolder;\">Espera</div>";
            }
        } else {
            status = "<div style=\"background-color:#d1d1d1;text-align:center;color:white;font-weight:bolder;\">Espera</div>";
        }
        html += "<tr><td>" + pegaPosicao(d, x) + "</td><td>" + p[x]["processo"] + "</td><td>" + p[x]["prioridade"] + "</td><td>" + p[x]["tempo"] + "</td><td>" + status + "</td></tr>";


        if (p[x]['processo'] === d[i]['processo']) {
            html += "<tr>\n\
<td colspan='5' id='campox'>\n\
<div class=\"progress\">\n\
<div class=\"progress-bar progress-bar-success progress-bar-striped active\" role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\" id=\"xtempo\"></div>\n\
</div>\n\
</td>\n\
</tr>";
        }

    }

    html += "</tbody></table>";
    $("#conteudos").html(html);
    contaTempo(tempo.toString());
    i++;
    if (p.length > i) {
        para = window.setTimeout(function () {
            iniciaStf(p, i, d);
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

function sorteioSTF(a) {
    var tmp = new Array();
    for (var x in a) {
        a[x]["idx"] = x;
        tmp.push(a[x]);
    }
    tmp.sort(ordena("prioridade"));
    return tmp;
}

function  ordena(campo) {
    return function (a, b) {
        var ax = a[campo], bx = b[campo];
        return ax < bx ? 1 : (ax > bx ? -1 : 0);

    };
}
