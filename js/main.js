import Introduction from './Introduction.js'
import StateStats from './StatesStats.js'
import PovertyInsecurity from './PovertyInsecurity.js'
import InsecurityUnemployment from './InsecurityUnemployment.js'

d3.csv('data/MMG_Master.csv',d3.autoType).then(data=>{
    

    const intro=Introduction('.intro-map','.absolute-force')
    const map=PovertyInsecurity('.poverty-insecurity','.chart2')
    const stats=StateStats('.state-stat')
    const unemp=InsecurityUnemployment('.unemployment-charts')

})