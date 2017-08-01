module.exports = [
  {
    resource: "PlotForms",
    relatedTo: "Counties",
    direct: true,
    source_column: "CountyID",
    target_column: "CountyId"
  },
  {
    resource: "PlotForms",
    relatedTo: "Crops",
    direct: true,
    source_column: "CropID",
    target_column: "CropID"
  },
  {
    resource: "PlotForms",
    relatedTo: "States",
    direct: false,
    through: "Counties",
    source_column: "CountyID",
    intermediate_target_column: "StateID",
    intermediate_source_column: "CountyID",
    target_column: "StateID",
  },
  {
    resource: "States",
    relatedTo: "PlotForms",
    direct: false,
    through: "Counties",
    source_column: "StateID",
    intermediate_target_column: "CountyID",
    intermediate_source_column: "StateID",
    target_column: "CountyID",
  },
]
