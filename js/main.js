import Introduction from './Introduction'
import StateStats from './StatesStats'
import PovertyInsecurity from './PovertyInsecurity'
import InsecurityUnemployment from './InsecurityUnemployment'

d3.csv('data/MMG_Master.csv',d3.autoType).then(data=>{
    console.log(data)

    const intro=Introduction('.intro-Chart')
    const map=PovertyInsecurity('.poverty-insecurity')
    const stats=StateStats('.state-stat')
    const unemp=InsecurityUnemployment('.unemployment')

})