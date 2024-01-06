'use strict'

async function main() {
	const adapter = await navigator.gpu?.requestAdapter();
	const device = await adapter?.requestDevice();
	if (!device) {
		fail('need a browser that supports WebGPU');
		return;
	}

	// Get a WebGPU context from the canvas and configure it
	const canvas = document.querySelector('canvas');
	const context = canvas.getContext('webgpu');
	const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
	context.configure({
		device,
		format: presentationFormat,
	});
	
	let code = await fetch('js/shaderberita.txt')
	code = await code.text()
	
	const module = device.createShaderModule({
		label: 'our hardcoded red triangle shaders',
		code,
	});
	/*
	const pipeline = device.createRenderPipeline({
		label: 'our hardcoded red triangle pipeline',
		layout: 'auto',
		vertex: {
			module,
			entryPoint: 'vs',
		},
		fragment: {
			module,
			entryPoint: 'fs',
			targets: [{ format: presentationFormat }],
		},
	});
	*/
	let arr = new Float32Array(2)
	let buf = device.createBuffer({
		label:'buffer kuuu',
		size:arr.byteLength,
		usage:
			GPUBufferUsage.STORAGE|
			GPUBufferUsage.COPY_SRC|
			GPUBufferUsage.COPY_DST
		,
	})
	
	const renderPassDescriptor = {
		label: 'our basic canvas renderPass',
		colorAttachments: [
			{
				// view: <- to be filled out when we render
				clearValue: [0.3, 0.3, 0.3, 1],
				loadOp: 'clear',
				storeOp: 'store',
			},
		],
	};
	/*
	let bindgroup = device.createBindGroup({
		label:'bindgroup ku',
		layout:pipeline.getBindGroupLayout(0),
		entries:[
			{binding:0,resource:{buffer:buf,},},
		],
	})
	
	*/
	
	
	
	
	
	let arr_pipebind = {}
	let pilihchannel = e=>{
		namachannel = e.currentTarget.getAttribute('frag')
	}
	for(let li of document.querySelectorAll('#berita > ul > li')){
		li.addEventListener('click',pilihchannel,)
		let frag = li.getAttribute('frag')
		let pipeline = device.createRenderPipeline({
			label: 'our hardcoded red triangle pipeline : '+frag,
			layout: 'auto',
			vertex: {
				module,
				entryPoint: 'vs',
			},
			fragment: {
				module,
				entryPoint: frag,
				targets: [{ format: presentationFormat }],
			},
		});
		let bindgroup = device.createBindGroup({
			label:'bindgroup ku : '+frag,
			layout:pipeline.getBindGroupLayout(0),
			entries:[
				{binding:0,resource:{buffer:buf,},},
			],
		})
		arr_pipebind[frag] = {pipeline,bindgroup,}
	}
	let namachannel = 'nosignal'
	
	
	
	
	
	
	function render(t) {
		arr[1] = t/1000
		device.queue.writeBuffer(buf,1*4,arr,1,1,)
		
		renderPassDescriptor.colorAttachments[0].view =
		context.getCurrentTexture().createView()
		
		const encoder = device.createCommandEncoder({ label: 'our encoder' });

		// make a render pass encoder to encode render specific commands
		const pass = encoder.beginRenderPass(renderPassDescriptor);
		let {
			pipeline	: pipe	,
			bindgroup	: bind	,
		} = arr_pipebind[namachannel]
		pass.setPipeline(pipe);
		pass.setBindGroup(0,bind,)
		pass.draw(3);	// call our vertex shader 3 times.
		pass.end();

		const commandBuffer = encoder.finish();
		device.queue.submit([commandBuffer]);
		requestAnimationFrame(render)
	}

	render(0);
}

function fail(msg) {
	// eslint-disable-next-line no-alert
	alert(msg);
}

main();
	
