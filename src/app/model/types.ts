export const RefrigerationTypes = [
  {id: 'walkin_refrigerator', name: 'Walk-In Refrigerator'},
  {id: 'walkin_freezer', name: 'Walk-In Freezer'},
  {id: 'refrigerator', name: 'Refrigerator'},
  {id: 'freezer', name: 'Freezer'},
  {id: 'walkin_coolbot', name: 'Walk-In Cooler Box'}, // [sic]
];

export const PlugloadApplianceTypes = [
  {id: 'combination_oven', name: 'Combination Oven'},
  {id: 'convection_oven', name: 'Convection Oven'},
  {id: 'conveyor_oven', name: 'Conveyor Oven'},
  {id: 'fryer', name: 'Fryer'},
  {id: 'icemaker', name: 'Ice Maker'},
  {id: 'rack_oven', name: 'Rack Oven'},
  {id: 'steam_cooker', name: 'Steam Cooker'},
  {id: 'griddle', name: 'Griddle'},
  {id: 'hot_food_cabinet', name: 'Hot Food Cabinet'},
  {id: 'conveyor_broiler', name: 'Conveyor Broiler'},
  {id: 'dishwasher', name: 'Dish Washer'},
  {id: 'pre_rinse_spray', name: 'Pre Rinse Spray'},
  {id: 'sample_appliance', name: 'Sample Appliance'},
];

export const LightingTypes = [
  {id: 'halogen', name: 'Halogen'},
  {id: 'cfl', name: 'CFL'},
  {id: 'linearfluorescent', name: 'Linear Fluorescent'},
  {id: 'incandescent', name: 'Incandescent'},
  {id: 'hpsodium', name: 'High Pressure Sodium'},
  {id: 'lpsodium', name: 'Low Pressure Sodium'},
];

export const Types = [
  {id: 'plugload', name: 'Plugload', subTypes: PlugloadApplianceTypes},
  {id: 'hvac', name: 'HVAC'},
  {id: 'hotwater', name: 'WaterHeater'},
  {id: 'refrigeration', name: 'Refrigeration', subTypes: RefrigerationTypes},
  {id: 'lighting', name: 'Lighting', subTypes: LightingTypes},
  {id: 'motors', name: 'Motors'},
  {id: 'others', name: 'Others'},
];
