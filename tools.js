const config = {
  svg: {width: 900, height: 500}
};
config.margin = {top: 20, right: 20, bottom: 40, left: 20};
config.plot = {
	width: config.svg.width - config.margin.left - config.margin.right,
	height: config.svg.height - config.margin.top - config.margin.bottom
};

function translate(x,y) {
  return "translate (" + x + "," + y + ")";
};