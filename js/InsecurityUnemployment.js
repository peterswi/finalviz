//LUREIN

function InsecurityUnemployment(container){
    var v1Spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
        "vconcat": [
          {
            "data": {
                "url": "data/MMG_Master.csv"
            },
            "width": 1120,
            "height": 400,
            "mark": {"type": "area", "tooltip": true},
            "selection": {
                "brush": {"type": "interval"}
              },
            "encoding": {
              "x": {
                "field": "year",
                "timeUnit": "year"
              },
              "y": {
                "field": "FoodInsecurityRate",
                "aggregate": "sum",
                "type": "quantitative",
                "scale": {"zero": true},
                "title": "Sum of Food Insecurity Rate"
              },
              "color": {"field": "StateName", "type": "nominal"}
            }
          },
          {
            "data": {
                "url": "data/MMG_Master.csv"
            },
              "width": 1120,
              "transform": [
                {"filter": {"selection": "brush"}}
              ],
              "mark": "bar",
              "encoding": {
                "x": {
                  "field": "year",
                  "timeUnit": "year",
                  "type": "ordinal"
                },
              "y": {
                "field": "unemp",
                "type": "quantitative",
                "title": "National Unemployment Rate",
                "scale": {"domain": [0, 10]}
              },
            }
          }
        ]
        };
        vegaEmbed(container, v1Spec)
}
export default InsecurityUnemployment