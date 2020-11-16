import Introduction from './Introduction'


d3.csv('data/MMG_Master.csv',d3.autoType).then(data=>{
    console.log(data)

    const intro=Introduction('.intro-Chart')
    

})