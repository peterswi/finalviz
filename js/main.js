import Introduction from './Introduction.js'
import StateStats from './StatesStats.js'
import PovertyInsecurity from './PovertyInsecurity.js'
import InsecurityUnemployment from './InsecurityUnemployment.js'
import FirstMap from './firstMap'

d3.csv('data/MMG_Master.csv',d3.autoType).then(data=>{
    

    const intro=Introduction('.absolute-force')
    const firstMap=FirstMap('.intro-map')
    const map=PovertyInsecurity('.poverty-insecurity','.chart2')
    const stats=StateStats('.state-stat')
    const unemp=InsecurityUnemployment('.unemployment-charts')

})