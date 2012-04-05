;(function(window, document, undefined){

	if(!window.addEventListener)
		return;

	var self = window.Dust = {
		dusts: {},
		
		generateId: function(e) {
			var id=String(parseInt(e[0]))+String(parseInt(e[1]))+Math.round(e[2]*1000)+cutHex(e[3].toUpperCase());
			return id;
		},
		
		generateDust: function(e) {
			var canvas=document.createElement("canvas");
			if (!canvas.getContext) {
				return;
			} else {
				canvas.width=parseInt(e[0]);
				canvas.height=parseInt(e[1]);
			
				var ctx=canvas.getContext("2d"),
					  imgData = ctx.createImageData(canvas.width, canvas.height),
					  maxAlpha=e[2]*255;
					  
				for (var i=0; i<canvas.width*canvas.height; i++) {
					var x = ~~(Math.random()*canvas.width),
						  y = ~~(Math.random()*canvas.height),
						  index = (x + y * imgData.width) * 4;
				
					imgData.data[index    ] = hexToR(e[3]);                // red
					imgData.data[index + 1] = hexToG(e[3]);                // green
					imgData.data[index + 2] = hexToB(e[3]);                // blue
					imgData.data[index + 3] = ~~(Math.random()*maxAlpha);  // alpha
				}
				ctx.putImageData(imgData, 0, 0);
				return canvas.toDataURL('image/png');
			}
		},
		
		link: function(link) {
			try {
				if(link.rel !== 'stylesheet' || link.hasAttribute('data-nodust')) {
					return;
				}
			}
			catch(e) {
				return;
			}
			
			var url = link.href || link.getAttribute('data-href'),
			    xhr = new XMLHttpRequest();

			xhr.open('GET', url);
			xhr.onreadystatechange = function() {
				if(xhr.readyState === 4) {
					var css = xhr.responseText;
					if(css && link.parentNode) {
						css=self.addDust(css);
						self.inject(css,link);
					}
				}
			};
			xhr.send(null);
			link.setAttribute('data-inprogress', '');
		},
		
		styleElement: function(el) {
			el.textContent=self.addNoise(el.textContent);
		},
		
		styleAttribute: function(el) {
			el.setAttribute("style",self.addDust(el.getAttribute("style")));
		},
		
		addDust: function(css) {
			var matches=css.match(/dust\([^)]*\)/g);
			matches.forEach(function(e){
				var pars=e.slice(5,-1).split(" ");
				var id=self.generateId(pars);
				if (!self.dusts[id])
					self.dusts[id]=self.generateDust(pars);
				css=css.replace(e,"url("+self.dusts[id]+")");
			});
			return css;
		},
		
		inject: function(css,link) {
			var style = document.createElement('style');
			style.textContent = css;
			style.media = link.media;
			style.disabled = link.disabled;
			style.setAttribute('data-href', link.getAttribute('href'));
			
			document.head.insertBefore(style, link);
			document.head.removeChild(link);
		},
		
		process: function(){
			$('link[rel="stylesheet"]:not([data-inprogress])').forEach(Dust.link);
			$('style').forEach(Dust.styleElement);
			$('[style]').forEach(Dust.styleAttribute);
		}
	};

	(function(){
		setTimeout(function(){
			$('link[rel="stylesheet"]').forEach(Dust.link);
		}, 10);

		document.addEventListener('DOMContentLoaded', Dust.process, false);
	})();

	function $(expr, con) {
		return [].slice.call((con || document).querySelectorAll(expr));
	}
	
	function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
	function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
	function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
	function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
	
})(window, document);
