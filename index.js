#!/usr/bin/env node

const axios = require('axios')
const program = require('commander')
const translate = require('translate')
const inquirer = require('inquirer')

program
    .version("1.0.0")
    .option('-c, --category','voir les catégories')
    .option('-g, --geography','quiz geo')
    .option('-h, --history','quiz histoiry')
    .option('-a, --animal','quiz animal')
    .option('-s, --sport','quiz sport')
    .parse(process.argv)

const URL_category = "https://opentdb.com/api_category.php"
const URL_questions = "https://opentdb.com/api.php?amount=10&category="
let obj_category = {}
let obj_question = {}
let question = []
let reponse = []




// fonction récuperant mes différentes catégories via l'api
function getCategory() {
    axios.get(URL_category)
    .then((reponse)=> {
        obj_category = reponse.data['trivia_categories']
        for (let i=0; i<obj_category.length;i++){
            if (i==12 || i==13 || i==14|| i ==18 ){
                console.log(obj_category[i].name)
            }
        }
    })
    .catch((err)=>{
        console.log('Api introuvable' , err)
    })
    
    
}


function getQuestion (nbCategory){
    axios.get(URL_questions+nbCategory)
    .then((reponse)=> {
        obj_question = reponse.data['results']
        for (let i=0; i<obj_question.length;i++){
            const langue = ( async () =>{
                question[i]= await translate(obj_question[i].question, {to : 'fr', engine : 'yandex', key : 'trnsl.1.1.20181111T151055Z.43b2a61f442036a3.658009077cf972df0337578c1d8158c2225f502f'})
                reponse[i]= obj_question[i].correct_answer
                
            })()
        }
        quiz()
    })
    .catch((err)=>{
        console.log('Api introuvable' , err)
    })

}


function quiz(){
    let score = 0
    for(let i = 0; i < question.length; i++){
        let nbQuestion = i +1 
        question[i] = {
            type: 'input',
            message: `Question n°${nbQuestion} : ${question[i].question}\n`,
            name: `reponse${nbQuestion}`
        }
        if(question[i].correct_answer == 'False'){
            reponse[i] = 'Faux'
        }
        else{
            reponse[i] = 'Vrai'
        }
    }
   inquirer.prompt(question).then((answer)=>{
       for(let i = 1; i < question.length -1; i++){
           if(answer[`reponse${i}`][0] == reponse[i]){
               score++
               console.log('Reponse n°'+i+' : Correct !!')
           }
           else{
               console.log('Reponse n°'+i+' : FAUUUUUX !!')
           }
       }
       console.log('Votre score est :'+score+'/10')
       console.log('Bien joué')
   })
}

if (program.category){
    getCategory()
}
else if (program.geography){
    getQuestion(22)
}
else if (program.history){
    getQuestion(23)
}
else if (program.animal){
    getQuestion(27)
}
else if (program.sport){
    getQuestion(21)
}