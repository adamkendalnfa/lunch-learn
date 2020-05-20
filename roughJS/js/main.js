
$(function() {

	const rc = rough.canvas(document.getElementById('canvas'));

	//line and rectangle
	rc.rectangle(10, 10, 100, 100);
	rc.rectangle(140, 10, 100, 100, {
	  fill: 'rgba(255,0,0,0.2)',
	  fillStyle: 'solid',
	  roughness: 2
	});
	rc.rectangle(10, 130, 100, 100, {
	  fill: 'red',
	  stroke: 'blue',
	  hachureAngle: 60,
	  hachureGap: 10,
	  fillWeight: 5,
	  strokeWidth: 5
	});



	// rc.circle(50, 50, 80, { fill: 'red' }); // fill with red hachure
	// rc.rectangle(120, 15, 80, 80, { fill: 'red' });
	// rc.circle(50, 150, 80, {
	//   fill: "rgb(10,150,10)",
	//   fillWeight: 3 // thicker lines for hachure
	// });
	// rc.rectangle(220, 15, 80, 80, {
	//   fill: 'red',
	//   hachureAngle: 60, // angle of hachure,
	//   hachureGap: 8
	// });
	// rc.rectangle(120, 105, 80, 80, {
	//   fill: 'rgba(255,0,200,0.2)',
	//   fillStyle: 'solid' // solid fill
	// });


	// rc.rectangle(15, 15, 120, 120, { roughness: 0.5, fill: 'red' });
	// rc.rectangle(150, 15, 120, 120, { roughness: 2.8, fill: 'blue',  });
	// rc.rectangle(280, 15, 120, 120, { bowing: 6, stroke: 'green', strokeWidth: 3 });

	// rc.circle(80, 220, 50); // centerX, centerY, diameter
	rc.ellipse(400, 300, 250, 280, { bowing: 6, stroke: 'green', strokeWidth: 3, roughness: 100, fill: 'blue', fillStyle: 'zigzag-line'  }); // centerX, centerY, width, height
	rc.line(80, 420, 100, 250); // x1, y1, x2, y2

	// rc.ellipse(100, 400, 50, 80, { bowing: 6, stroke: 'green', strokeWidth: 3, roughness: 3, fill: 'blue', fillStyle: 'dots'  });
	rc.ellipse(300, 500, 100, 130, { bowing: 6, stroke: 'green', strokeWidth: 3, roughness: 1, fill: 'purple', fillStyle: 'zigzag'  }); // centerX, centerY, width, height
	rc.ellipse(100, 600, 100, 100, { bowing: 6, stroke: 'green', strokeWidth: 3, roughness: 1, fill: 'teal', fillStyle: 'cross-hatch'  }); // centerX, centerY, width, height

})
