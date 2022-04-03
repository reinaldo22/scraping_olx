const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
//https://am.olx.com.br/imoveis/venda?pe=200000&ps=90000&ret=1040&ret=1020&sf=1
const sitealvo = 'https://am.olx.com.br/imoveis/venda?pe=200000&ps=90000&ret=1040&ret=1020&sf=1';

const dados = [];

const dadosruto = async ()=> {
    try {
        const resultado = await axios.get(sitealvo)
        return resultado.data
    } catch (error) {
        console.log("================>>>>>>>>>>>>>",error)
    }
}

const listalinks = async ()=>{
    const html = await dadosruto();
    const $ = await cheerio.load(html)
    $('.sc-1fcmfeb-2').contents().each(function(i, lnk){
        dados[i] = $(lnk).attr('href');
        
    })
    console.log(">>>>>>>>>>>>",dados)
    return dados;
}


const coletaDados = async(pg = sitealvo)=>{
    try {
        const res = await axios.get(pg);
        const html = await res.data
        const $ = await cheerio.load(html);

        let nomeproduto = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-6.gFNxVM > div > div > h1').text()
        let valor = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-6.iYWWXj > div > div > div > div > div.sc-hmzhuo.sc-1wimjbb-2.dghGmZ.sc-jTzLTM.iwtnNi > div').text()
        let datapublicada = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-6.hzUJDA > div > div > div > span.sc-1oq8jzc-0.jvuXUB.sc-ifAKCX.fizSrB').text()
        let codigoproduto = $('#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.jAHFXn > div.h3us20-6.hzUJDA > div > div > div > span.sc-16iz3i7-0.qJvUT.sc-ifAKCX.fizSrB').text()

        const resultados = `
        <h1>Produto: ${nomeproduto}</h1>
        <h3>Valor: ${valor}</h3>
        <h3>data: ${datapublicada}</h3>
        <h3>codigo: ${codigoproduto}</h3>
        <h3>Link: <a href="${pg}">Produto</a></h3>
        <br>
        `
        await gravahtml(resultados)
    } catch (error) {
        console.log("Algo deu errado==>>", error)
    }
}

const gravahtml = async(resultados)=>{
    fs.writeFileSync('./index.html', resultados, {flag: 'a+'},function(err){
        if(err){
            console.log('Algo deu errado!')
        }
    })

}


const apresentadados = async()=> {

    const links = await listalinks();
    links.map(function(link){
        coletaDados(link);
    })
}

const main = async ()=>{
    await apresentadados();
}

main();