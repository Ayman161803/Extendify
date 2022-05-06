const fs  = require("fs-extra")
const config = require("./neutralino.config.json")
const {Command} = require("commander")
const {exec} = require("child_process")

let addExtension = (name) => {
    if(!config.extensions){
        config.extensions = []
    }
    let tobeadded = {
        "id":"extensions."+name,
        "command":"node extensions/"+name+"/index.js"
    }
    config.extensions.push(tobeadded)
    console.log(config.extensions)

    fs.writeFile("neutralino.config.json",JSON.stringify(config,null,2))
}
let setEnableExtensionToTrue = ()=>{
    config.enableExtensions = true
}

let addExtensionsToNativeAllowList = ()=>{
    if(!config.nativeAllowList.includes("extensions.*")){
        config.nativeAllowList.push("extensions.*")
    }
}
const {mainfile} = require("./constants")
let generateMainFile = (name)=>{
    fs.writeFileSync(`extensions/${name}/index.js`,mainfile.replace("extension-name","extensions."+name)) 
}


let createpackage = async (name)=> {
    await exec("mkdir -p extensions/"+name)
    await exec("cd extensions/"+name+" && npm init -y && npm i uuid websocket")
    generateMainFile(name)
 }


 let generateExtension = (name) =>{
    createpackage(name)

    setEnableExtensionToTrue()
    addExtensionsToNativeAllowList()
    
    addExtension(name)
 }
 
 let register = (program) => {
     program
         .command('create <extensionName>')
         .description('adds an extension to a neutralino App')
         .action( (extensionName) => {
             generateExtension(extensionName);
         });
 }
 
 const program = new Command()
 register(program)
 program.parse(process.argv);