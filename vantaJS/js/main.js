// Get mouse position relative to the canvas
let mouseX = 0
let mouseY = 0

window.addEventListener('mousemove', function(event){
	mouseX = event.pageX - (window.innerWidth/2)
	mouseY = event.pageY - (window.innerHeight/2)
})

// const wave = VANTA.WAVES({
// 	el: "#BG",
// 	mouseControls: true,
// 	touchControls: true,
// 	minHeight: 200.00,
// 	minWidth: 200.00,
// 	scale: 1.00,
// 	scaleMobile: 1.00,
// 	waveHeight: 10.00
// })


// let time = 0;

// const animation = function(){
// 	time += 0.01
// 	let waveSin = Math.abs(Math.sin(time)) * 50
// 	let waveMin = Math.max(10, waveSin)
// 	console.log(waveSin)

// 	wave.setOptions({
// 		// waveHeight: waveSin
// 	})

// 	window.requestAnimationFrame(animation);
// }

// window.requestAnimationFrame(animation);


// VANTA.TRUNK({
// 	el: "#trunkBG",
// 	mouseControls: true,
// 	touchControls: true,
// 	minHeight: 200.00,
// 	minWidth: 200.00,
// 	scale: 1.00,
// 	scaleMobile: 1.00,
// 	spacing: 1.00
// })



const halo = VANTA.HALO({
  el: "#vantaBG",
  mouseControls: false,
  touchControls: true,
  minHeight: 200.00,
  minWidth: 200.00,
  amplitudeFactor: 0.10,
  size: 0.30
})



const animation = function(){

	let absY = Math.max(0.3, Math.abs(mouseY *0.003))
	let absX = Math.abs(mouseX * 0.01)
	console.log(absX)
	halo.setOptions({
		size:absY,
		amplitudeFactor: absX
	})
	window.requestAnimationFrame(animation)
}

window.requestAnimationFrame(animation)











