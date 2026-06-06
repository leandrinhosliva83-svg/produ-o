(function() {
  function aguardar(n) {
    if (n <= 0) return;
    if (typeof dwr === 'undefined' || !dwr.engine || !dwr.engine._scriptSessionId) {
      setTimeout(function() { aguardar(n - 1); }, 1000);
      return;
    }
    iniciar();
  }

  var btn = document.createElement('div');
  btn.id = 'tm-btn';
  btn.style.cssText = 'position:fixed;top:340px;right:0;z-index:2147483646;background:#00d4ff;color:#000;font-weight:bold;font-size:11px;letter-spacing:1px;padding:12px 5px;border-radius:4px 0 0 4px;cursor:pointer;writing-mode:vertical-rl;box-shadow:-2px 0 10px rgba(0,212,255,0.4)';
  btn.textContent = 'VELOC';
  btn.onclick = function() {
    var p = document.getElementById('tm');
    if (!p) return;
    var aberto = p.style.display !== 'none';
    p.style.display = aberto ? 'none' : 'flex';
    btn.style.right = aberto ? '0' : '260px';
    btn.style.background = aberto ? '#00d4ff' : '#0a1520';
    btn.style.color = aberto ? '#000' : '#00d4ff';
  };
  document.body.appendChild(btn);

  function soarAlarme() {
    try {
      var volEl = document.getElementById('tm-vol');
      var vol = volEl ? (parseInt(volEl.value)||5)/10 : 0.5;
      if (vol === 0) return;
      if (!_audioCtx) return;
      if (_audioCtx.state === 'suspended') _audioCtx.resume();
      [0, 0.3, 0.6, 0.9, 1.2].forEach(function(t) {
        var osc = _audioCtx.createOscillator();
        var gain = _audioCtx.createGain();
        osc.connect(gain);
        gain.connect(_audioCtx.destination);
        osc.frequency.value = 1200;
        gain.gain.value = vol;
        osc.start(_audioCtx.currentTime + t);
        osc.stop(_audioCtx.currentTime + t + 0.2);
      });
    } catch(e) {}
  }

  function popupAlerta(titulo, nome) {
    var old = document.getElementById('tm-popup');
    if (old) old.remove();
    var a = document.createElement('div');
    a.id = 'tm-popup';
    a.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#ff0000;color:#fff;padding:20px 30px;border-radius:8px;font-family:monospace;font-size:16px;font-weight:bold;z-index:2147483647;box-shadow:0 0 40px rgba(255,0,0,0.8);text-align:center;min-width:300px;border:3px solid #fff;cursor:pointer';
    a.innerHTML = '<div style="font-size:20px;margin-bottom:8px">ALERTA!</div><div style="font-size:15px;margin-bottom:6px">' + titulo + '</div><div style="font-size:13px">' + nome + '</div><div style="font-size:11px;margin-top:8px;opacity:0.8">' + new Date().toLocaleTimeString('pt-BR') + '</div><div style="font-size:10px;margin-top:8px;opacity:0.6">Clique para fechar</div>';
    a.onclick = function() { a.remove(); };
    document.body.appendChild(a);
    setTimeout(function() { if (a.parentNode) a.remove(); }, 10000);
    soarAlarme();
  }

  var _audioCtx = null;

  var CERCA_POLY = [[-21.8666,-48.1311],[-21.84557,-48.15754],[-21.84302,-48.1699],[-21.84843,-48.18123],[-21.83824,-48.20114],[-21.82421,-48.21522],[-21.80015,-48.2123],[-21.79282,-48.21917],[-21.69173,-48.34534],[-21.66764,-48.34637],[-21.61913,-48.34396],[-21.57508,-48.3419],[-21.52143,-48.34053],[-21.36421,-48.32954],[-21.32584,-48.32748],[-21.2433,-48.35838],[-21.22794,-48.34534],[-21.19209,-48.3371],[-21.17673,-48.2959],[-21.1588,-48.27393],[-21.16905,-48.24646],[-21.15368,-48.22998],[-21.14087,-48.19702],[-21.12294,-48.15582],[-21.08066,-48.12149],[-21.03067,-48.12424],[-20.96016,-48.13522],[-20.93322,-48.03635],[-20.92809,-47.9924],[-20.98837,-47.96356],[-21.01273,-47.9306],[-21.064,-47.96631],[-21.07425,-47.9306],[-21.064,-47.87292],[-21.06656,-47.84031],[-21.06656,-47.84082],[-21.06656,-47.84048],[-21.07945,-47.79963],[-21.07793,-47.7901],[-21.1556,-47.60513],[-21.1287,-47.56239],[-21.11525,-47.53252],[-21.12117,-47.52823],[-21.13222,-47.51827],[-21.15864,-47.51759],[-21.20058,-47.49819],[-21.2337,-47.41837],[-21.27338,-47.36652],[-21.29945,-47.36069],[-21.30937,-47.34627],[-21.31896,-47.31983],[-21.3268,-47.3243],[-21.33127,-47.32361],[-21.33687,-47.32035],[-21.35542,-47.31709],[-21.37236,-47.31434],[-21.38675,-47.31091],[-21.39698,-47.31005],[-21.40257,-47.31108],[-21.41328,-47.31073],[-21.42383,-47.31485],[-21.42718,-47.31056],[-21.4315,-47.3037],[-21.43837,-47.29958],[-21.44572,-47.30387],[-21.45802,-47.30696],[-21.45738,-47.30215],[-21.44588,-47.29889],[-21.443,-47.2946],[-21.44284,-47.28584],[-21.44684,-47.27606],[-21.45035,-47.26267],[-21.45946,-47.25529],[-21.47543,-47.24533],[-21.49301,-47.23452],[-21.51632,-47.20894],[-21.54187,-47.20825],[-21.56997,-47.21512],[-21.5936,-47.22954],[-21.62552,-47.2419],[-21.65424,-47.27074],[-21.67402,-47.27417],[-21.6922,-47.27726],[-21.71613,-47.2776],[-21.73782,-47.2752],[-21.84063,-47.21786],[-21.84365,-47.37648],[-21.85831,-47.49321],[-21.89798,-47.56891],[-21.92824,-47.58471],[-22.00242,-47.67311],[-22.03855,-47.75551],[-22.06401,-47.80975],[-22.06257,-47.85336],[-22.05271,-47.88769],[-22.04364,-47.91756],[-21.9768,-47.97798],[-21.96342,-47.99858],[-21.89782,-48.08578]];

  function dentroDoPoligono(lat, lng, poly) {
    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], yi = poly[i][1];
      var xj = poly[j][0], yj = poly[j][1];
      var intersect = ((yi > lng) !== (yj > lng)) && (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function iniciar() {
    var old = document.getElementById('tm');
    if (old) { old.remove(); clearInterval(window._tmT); }

    var p = document.createElement('div');
    p.id = 'tm';
    p.style.cssText = 'position:fixed;top:0;right:0;width:260px;height:100vh;background:#050a0f;border-left:2px solid #00d4ff;z-index:2147483647;display:flex;flex-direction:column;font-family:monospace;color:#c8e8f0;box-shadow:-4px 0 20px rgba(0,212,255,0.15)';

    var html = '';
    html += '<div style="background:#0a1520;padding:8px 12px;border-bottom:1px solid #0f3a52;display:flex;justify-content:space-between;align-items:center;flex-shrink:0">';
    html += '<b style="color:#00d4ff;font-size:11px;letter-spacing:1px">TRACK MONITOR</b>';
    html += '<div style="display:flex;gap:4px;align-items:center">';
    html += '<button id="tm-som" style="background:#ff9900;color:#000;border:none;padding:4px 8px;cursor:pointer;border-radius:3px;font-size:11px;font-weight:bold">🔔 ATIVAR SOM</button>';
    html += '<button id="tm-close" style="background:#ff3333;color:#fff;border:none;padding:4px 8px;cursor:pointer;border-radius:3px;font-size:12px;font-weight:bold">X</button>';
    html += '</div></div>';
    html += '<div style="padding:6px 12px;border-bottom:1px solid #0f3a52;background:#0a1520;flex-shrink:0">';
    html += '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">';
    html += '<span style="color:#4a7a8a;font-size:10px">FILTRO VEL:</span>';
    html += '<input type="range" id="tmr" min="0" max="150" value="0" style="flex:1;accent-color:#00d4ff">';
    html += '<span id="tmfv" style="color:#00d4ff;font-size:11px;min-width:50px">0 km/h</span>';
    html += '</div>';
    html += '<input type="text" id="tmb" placeholder="Buscar veiculo..." style="width:100%;background:#0d1e2d;border:1px solid #0f3a52;padding:4px 8px;color:#c8e8f0;font-size:11px;outline:none;border-radius:2px;box-sizing:border-box;margin-bottom:4px">';
    html += '<div style="display:flex;align-items:center;gap:6px">';
    html += '<span style="color:#4a7a8a;font-size:10px">INTERVALO:</span>';
    html += '<input type="number" id="tm-intervalo" min="10" max="300" value="30" style="width:50px;background:#0d1e2d;border:1px solid #0f3a52;padding:3px 6px;color:#00d4ff;font-size:11px;outline:none;border-radius:2px;text-align:center">';
    html += '<span style="color:#4a7a8a;font-size:10px">seg</span>';
    html += '<button id="tm-aplicar" style="background:#00d4ff;color:#000;border:none;padding:3px 8px;cursor:pointer;border-radius:2px;font-size:10px;font-weight:bold">OK</button>';
    html += '</div></div>';
    html += '<div style="display:flex;align-items:center;gap:6px;padding:4px 12px;border-bottom:1px solid #0f3a52;background:#0a1520;flex-shrink:0">';
    html += '<span style="color:#4a7a8a;font-size:10px">VOL:</span>';
    html += '<input type="range" id="tm-vol" min="0" max="10" value="5" style="flex:1;accent-color:#ff9900">';
    html += '<span id="tm-vol-val" style="color:#ff9900;font-size:10px;min-width:20px">5</span>';
    html += '<button id="tm-mudo" style="background:#333;color:#aaa;border:1px solid #4a7a8a;padding:2px 6px;cursor:pointer;border-radius:2px;font-size:10px">MUDO</button>';
    html += '</div>';
    html += '<div style="display:flex;padding:5px 12px;border-bottom:1px solid #0f3a52;gap:4px;flex-shrink:0">';
    html += '<div style="flex:1;text-align:center;background:#0a1520;border:1px solid #0f3a52;padding:3px;border-radius:2px"><div id="tmm" style="color:#00ff88;font-size:1rem;font-weight:bold">0</div><div style="color:#4a7a8a;font-size:8px">MOVENDO</div></div>';
    html += '<div style="flex:1;text-align:center;background:#0a1520;border:1px solid #0f3a52;padding:3px;border-radius:2px"><div id="tmp" style="color:#4a7a8a;font-size:1rem;font-weight:bold">0</div><div style="color:#4a7a8a;font-size:8px">PARADOS</div></div>';
    html += '<div style="flex:1;text-align:center;background:#0a1520;border:1px solid #0f3a52;padding:3px;border-radius:2px"><div id="tma" style="color:#ff3333;font-size:1rem;font-weight:bold">0</div><div style="color:#4a7a8a;font-size:8px">ACIMA</div></div>';
    html += '</div>';
    html += '<div style="padding:4px 12px;border-bottom:1px solid #ff3333;flex-shrink:0;background:#1a0505">';
    html += '<div style="color:#ff3333;font-size:9px;letter-spacing:1px;margin-bottom:3px">FORA DO PERIMETRO CANA (<span id="tm-cerca-total">0</span>)</div>';
    html += '<div id="tm-cerca-lista" style="font-size:10px;color:#ff9900;max-height:60px;overflow-y:auto">aguardando...</div>';
    html += '</div>';
    html += '<div style="padding:4px 12px;border-bottom:1px solid #0f3a52;flex-shrink:0;background:#0a1520">';
    html += '<div style="color:#00d4ff;font-size:9px;letter-spacing:1px;margin-bottom:4px">SEM SINAL</div>';
    html += '<div style="display:flex;gap:4px;margin-bottom:4px">';
    html += '<button id="tms12" style="flex:1;background:#f59e0b;color:#000;border:none;padding:3px;cursor:pointer;border-radius:2px;font-size:10px;font-weight:700">12-24h</button>';
    html += '<button id="tms24" style="flex:1;background:#1f2937;color:#94a3b8;border:none;padding:3px;cursor:pointer;border-radius:2px;font-size:10px;font-weight:700">24-48h</button>';
    html += '<button id="tms48" style="flex:1;background:#1f2937;color:#94a3b8;border:none;padding:3px;cursor:pointer;border-radius:2px;font-size:10px;font-weight:700">+48h</button>';
    html += '</div>';
    html += '<div id="tm-sinal-lista" style="font-size:10px;max-height:80px;overflow-y:auto;color:#f59e0b">aguardando...</div>';
    html += '</div>';
    html += '<div id="tms" style="padding:4px 12px;font-size:10px;color:#00ff88;background:#0a1520;flex-shrink:0">INICIANDO...</div>';
    html += '<div id="tml" style="overflow-y:auto;flex:1;padding:4px 12px"></div>';
    html += '<div id="tmlog" style="padding:4px 12px;font-size:10px;color:#4a7a8a;border-top:1px solid #0f3a52;background:#0a1520;flex-shrink:0">carregando...</div>';

    p.innerHTML = html;
    document.body.appendChild(p);

    document.getElementById('tm-som').addEventListener('click', function() {
      _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.textContent = '🔔 SOM ON';
      this.style.background = '#00ff88';
      this.style.color = '#000';
      soarAlarme();
    });
    document.getElementById('tm-close').addEventListener('click', function() {
      document.getElementById('tm').style.display = 'none';
      document.getElementById('tm-btn').style.right = '0';
      document.getElementById('tm-btn').style.background = '#00d4ff';
      document.getElementById('tm-btn').style.color = '#000';
    });
    document.getElementById('tm-vol').addEventListener('input', function() {
      document.getElementById('tm-vol-val').textContent = this.value;
    });
    document.getElementById('tm-mudo').addEventListener('click', function() {
      var vol = document.getElementById('tm-vol');
      if (vol.value > 0) {
        vol.dataset.prev = vol.value; vol.value = 0;
        document.getElementById('tm-vol-val').textContent = '0';
        this.textContent = 'SOM'; this.style.color = '#ff3333';
      } else {
        vol.value = vol.dataset.prev || 5;
        document.getElementById('tm-vol-val').textContent = vol.value;
        this.textContent = 'MUDO'; this.style.color = '#aaa';
      }
    });
    document.getElementById('tm-aplicar').addEventListener('click', function() {
      var seg = parseInt(document.getElementById('tm-intervalo').value) || 30;
      if (seg < 10) seg = 10;
      if (window._tmT) clearInterval(window._tmT);
      window._tmT = setInterval(ciclo, seg * 1000);
      document.getElementById('tms').textContent = 'Intervalo: ' + seg + 's';
    });

    // SEM SINAL
    var _filtroSinal = 12;
    var _dataHoras = {};
    function _horasAtras(dh) {
      if (!dh) return 9999;
      var pt = dh.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+):(\d+)/);
      if (!pt) return 9999;
      return (Date.now() - new Date(pt[3],pt[2]-1,pt[1],pt[4],pt[5],pt[6]).getTime()) / 3600000;
    }
    function _renderSinal() {
      var lista = [];
      Object.keys(_dataHoras).forEach(function(id) {
        var h = _horasAtras(_dataHoras[id].dh);
        var ok = false;
        if (_filtroSinal === 12 && h >= 12 && h < 24) ok = true;
        if (_filtroSinal === 24 && h >= 24 && h < 48) ok = true;
        if (_filtroSinal === 48 && h >= 48) ok = true;
        if (ok) lista.push({n:_dataHoras[id].n, h:Math.floor(h)});
      });
      var el = document.getElementById('tm-sinal-lista');
      if (!el) return;
      el.innerHTML = lista.length === 0
        ? '<div style="color:#16a34a">Nenhum nesta faixa</div>'
        : lista.sort(function(a,b){return b.h-a.h}).map(function(v){
            return '<div style="padding:2px 0;border-bottom:1px solid #1a2a3a">&#x26A1; '+v.n+' '+v.h+'h</div>';
          }).join('');
    }
    function _setFiltroSinal(h) {
      _filtroSinal = h;
      [12,24,48].forEach(function(v) {
        var b = document.getElementById('tms'+v);
        if(b){b.style.background=v===h?'#f59e0b':'#1f2937';b.style.color=v===h?'#000':'#94a3b8';}
      });
      _renderSinal();
    }
    document.getElementById('tms12').addEventListener('click', function(){_setFiltroSinal(12);});
    document.getElementById('tms24').addEventListener('click', function(){_setFiltroSinal(24);});
    document.getElementById('tms48').addEventListener('click', function(){_setFiltroSinal(48);});

    var VV = [{"id":"123513","n":"110021 - CAM SUPRIMENTOS"},{"id":"123477","n":"110022 - CAM OFICINA"},{"id":"125482","n":"110025 - CAM OFICINA"},{"id":"124391","n":"110122 - CAM TRANSBORDO"},{"id":"129054","n":"110125 - CAM BOMBEIRO"},{"id":"126114","n":"110224 - CAM OFICINA"},{"id":"130254","n":"110225 - BASCULANTE"},{"id":"123959","n":"110322 - CAM BASCULANTE"},{"id":"128196","n":"110324 - CAM OFICINA"},{"id":"130776","n":"110422 - CAM COMBOIO"},{"id":"126118","n":"110424 - CAM OFICINA"},{"id":"123954","n":"1105 - FIAT STRADA"},{"id":"123514","n":"110522 - BORRACHEIRO"},{"id":"124246","n":"110523 - CAVALO MEC"},{"id":"124401","n":"110622 - CAM TRANSBORDO"},{"id":"122489","n":"110722 - CAM BORRACHEIRO"},{"id":"122538","n":"110822 - CAM BOMBEIRO"},{"id":"122550","n":"110922 - CAM BOMBEIRO"},{"id":"122540","n":"111022 - CALDA PRONTA"},{"id":"122871","n":"111122 - CALDA PRONTA"},{"id":"123962","n":"111322 - CAM COMBOIO"},{"id":"123485","n":"111323 - APLIC CALCARIO"},{"id":"124663","n":"111423 - CAVALO MEC"},{"id":"125463","n":"111522 - CAM BOMBEIRO"},{"id":"125464","n":"111523 - CAM BOMBEIRO"},{"id":"125474","n":"111622 - CAM BOMBEIRO"},{"id":"125475","n":"111623 - CAM BOMBEIRO"},{"id":"122488","n":"111722 - CAM COMBOIO"},{"id":"125208","n":"111723 - CAM OFICINA"},{"id":"127837","n":"111922 - CARGA SECA"},{"id":"130256","n":"1154 - AMBULANCIA"},{"id":"124668","n":"13033 - MUNK"},{"id":"106272","n":"13037 - CAM BOMBEIRO"},{"id":"106268","n":"13046 - BORRACHEIRO"},{"id":"106289","n":"13054 - CAM BOMBEIRO"},{"id":"106281","n":"13055 - PLATAFORMA"},{"id":"106245","n":"13063 - CAVALO MEC"},{"id":"106241","n":"13064 - CAVALO MEC"},{"id":"106283","n":"13066 - CAVALO MEC"},{"id":"114241","n":"13069 - CAVALO MEC"},{"id":"106320","n":"13071 - CAVALO MEC"},{"id":"106334","n":"13072 - CAVALO MEC"},{"id":"106276","n":"13073 - CAVALO MEC"},{"id":"114328","n":"13076 - CAVALO MEC"},{"id":"106322","n":"13079 - CAVALO MEC"},{"id":"114322","n":"13082 - CAVALO MEC"},{"id":"106287","n":"13083 - PLATAFORMA"},{"id":"106339","n":"13084 - PLATAFORMA"},{"id":"106275","n":"13085 - PLATAFORMA"},{"id":"106254","n":"13087 - CAVALO MEC"},{"id":"106250","n":"13088 - CAM BASCULANTE"},{"id":"106288","n":"13128 - MUNK"},{"id":"116597","n":"13140 - CAM BOMBEIRO"},{"id":"120336","n":"13141 - PLATAFORMA"},{"id":"107228","n":"13142 - CAVALO MEC"},{"id":"107233","n":"13143 - CAVALO MEC"},{"id":"107232","n":"13144 - CAVALO MEC"},{"id":"108358","n":"13145 - CAVALO MEC"},{"id":"108361","n":"13146 - CAVALO MEC"},{"id":"125445","n":"13147 - CAVALO MEC"},{"id":"131476","n":"13226 - ONIBUS"},{"id":"131439","n":"13535 - ONIBUS"},{"id":"130255","n":"13541 - ONIBUS"},{"id":"130122","n":"13542 - ONIBUS"},{"id":"130045","n":"13546 - MICRO ONIBUS"},{"id":"129857","n":"136 - CAM TERCEIRO"},{"id":"106316","n":"13711 - CAM OFICINA"},{"id":"106278","n":"13715 - CAM SUPRIMENTOS"},{"id":"126115","n":"13718 - CAM BOMBEIRO"},{"id":"120027","n":"13723 - MUNK"},{"id":"110319","n":"13724 - CAM SUPRIMENTOS"},{"id":"125476","n":"13817 - CALDA PRONTA"},{"id":"131474","n":"13822 - TRANSP TUBOS"},{"id":"106228","n":"13826 - CALDA PRONTA"},{"id":"123061","n":"13833 - CALDA PRONTA"},{"id":"108648","n":"13834 - APLIC CALCARIO"},{"id":"108652","n":"13835 - CAM COMBOIO"},{"id":"108921","n":"13836 - APLIC CALCARIO"},{"id":"110393","n":"13838 - CAM BOMBEIRO"},{"id":"110397","n":"13839 - CAM BOMBEIRO"},{"id":"110846","n":"13841 - CAM BOMBEIRO"},{"id":"110843","n":"13843 - CAM BOMBEIRO"},{"id":"110842","n":"13844 - CAM BOMBEIRO"},{"id":"106227","n":"168 - GM S10"},{"id":"122341","n":"170125 - STRADA END"},{"id":"131891","n":"170126"},{"id":"122307","n":"170325 - STRADA END"},{"id":"125468","n":"170724 - SPIN LTZ"},{"id":"122353","n":"170924 - SPIN LTZ"},{"id":"133567","n":"171024 - SPIN LTZ CTA"},{"id":"130052","n":"171125 - FIAT STRADA"},{"id":"130125","n":"171225 - VW SAVEIRO"},{"id":"126346","n":"171324 - SPIN LTZ"},{"id":"130124","n":"171325 - VW SAVEIRO"},{"id":"123023","n":"171424 - SPIN LTZ"},{"id":"130128","n":"171425 - VW SAVEIRO"},{"id":"126327","n":"171524 - SPIN LTZ"},{"id":"130127","n":"171525 - VW SAVEIRO"},{"id":"126116","n":"171624 - SPIN LTZ"},{"id":"126353","n":"171724 - SPIN LTZ"},{"id":"130046","n":"171725 - SPIN LTZ"},{"id":"126444","n":"171824 - SPIN LTZ"},{"id":"126363","n":"171924 - SPIN LTZ"},{"id":"130253","n":"171925 - STRADA FREE"},{"id":"126366","n":"172024 - SPIN LTZ"},{"id":"126216","n":"172124 - SPIN LTZ"},{"id":"126445","n":"172224 - SPIN LTZ"},{"id":"126475","n":"172324 - VW POLO"},{"id":"122009","n":"172424 - VW POLO"},{"id":"126438","n":"172524 - VW POLO"},{"id":"126436","n":"172624 - VW POLO"},{"id":"126441","n":"172724 - VW POLO"},{"id":"126439","n":"172824 - VW POLO"},{"id":"126435","n":"172924 - VW POLO"},{"id":"126437","n":"173024 - VW POLO"},{"id":"126440","n":"173124 - VW POLO"},{"id":"126442","n":"173224 - VW POLO"},{"id":"126443","n":"173324 - VW POLO"},{"id":"126434","n":"173424 - VW POLO"},{"id":"126859","n":"173524 - VW POLO"},{"id":"126857","n":"173624 - VW POLO"},{"id":"126855","n":"173724 - VW POLO"},{"id":"126896","n":"173824 - VW POLO"},{"id":"126892","n":"173924 - VW POLO"},{"id":"126854","n":"174024 - FIAT CRONOS"},{"id":"122369","n":"174124 - STRADA END"},{"id":"126898","n":"174224 - STRADA FREE"},{"id":"122342","n":"174324 - STRADA FREE"},{"id":"122371","n":"174424 - STRADA FREE"},{"id":"123958","n":"174524 - STRADA FREE"},{"id":"122469","n":"174624 - STRADA FREE"},{"id":"126860","n":"174724 - STRADA FREE"},{"id":"122014","n":"174824 - STRADA FREE"},{"id":"130047","n":"174924 - STRADA FREE"},{"id":"131455","n":"175024 - STRADA FREE"},{"id":"122326","n":"175224 - STRADA END"},{"id":"126890","n":"175324 - STRADA END"},{"id":"128149","n":"175524 - STRADA END"},{"id":"122368","n":"175624 - STRADA END"},{"id":"122476","n":"175724 - STRADA END"},{"id":"106232","n":"176 - GM S10"},{"id":"128140","n":"176024 - STRADA END"},{"id":"124673","n":"176124 - STRADA END"},{"id":"128189","n":"176224 - STRADA END"},{"id":"122471","n":"176324 - STRADA FREE"},{"id":"124675","n":"176424 - STRADA END"},{"id":"128197","n":"176524 - STRADA END"},{"id":"129294","n":"176624 - STRADA END"},{"id":"128144","n":"176724 - FIAT CRONOS"},{"id":"126853","n":"176824 - NISSAN FRONTIER"},{"id":"106233","n":"184 - CAM OFICINA"},{"id":"115120","n":"19125 - CAM BOMBEIRO"},{"id":"118844","n":"19222 - CAM OFICINA"},{"id":"125446","n":"19226 - CAVALO MEC"},{"id":"120033","n":"19229 - CAVALO MEC"},{"id":"125465","n":"19230 - CAVALO MEC"},{"id":"125480","n":"19240 - CAVALO MEC"},{"id":"119169","n":"19277 - CAM BOMBEIRO"},{"id":"119170","n":"19278 - CAM BOMBEIRO"},{"id":"124388","n":"19287 - CAVALO MEC"},{"id":"120373","n":"19288 - CAM COMBOIO"},{"id":"117989","n":"195 - CAM OFICINA"},{"id":"118143","n":"196 - CAM OFICINA"},{"id":"124653","n":"220024 - EMPILHADEIRA"},{"id":"5346","n":"23030 - Caminhao"},{"id":"106957","n":"23308 - CAM SUPRIMENTOS"},{"id":"106734","n":"83138 - CAM COMBOIO"},{"id":"131900","n":"RUT 8G85 - ONIBUS"},{"id":"131896","n":"UFJ 2J85 - ONIBUS"},{"id":"131895","n":"UFJ 6B35 - ONIBUS"}];

    var vels = {}, cid = 1, alertados = {};
    var lista = document.getElementById('tml');

    VV.forEach(function(v) {
      var r = document.createElement('div');
      r.id = 'tv' + v.id;
      r.style.cssText = 'display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #0f3a52;font-size:11px';
      r.innerHTML = '<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + v.n + '</span><span id="vs' + v.id + '" style="color:#4a7a8a;min-width:55px;text-align:right">0 km/h</span>';
      lista.appendChild(r);
    });

    document.getElementById('tmr').addEventListener('input', tmF);
    document.getElementById('tmb').addEventListener('input', tmF);

    function tmF() {
      var fv = parseInt(document.getElementById('tmr').value) || 0;
      var fb = document.getElementById('tmb').value.toLowerCase();
      document.getElementById('tmfv').textContent = fv + ' km/h';
      var mov = 0, par = 0, alt = 0;
      VV.forEach(function(v) {
        var row = document.getElementById('tv' + v.id); if (!row) return;
        var vel = vels[v.id] || 0;
        var ok = v.n.toLowerCase().indexOf(fb) >= 0 && (fv === 0 || vel >= fv);
        row.style.display = ok ? 'flex' : 'none';
        if (vel > 0) mov++; else par++;
        if (vel > fv && fv > 0) alt++;
      });
      document.getElementById('tmm').textContent = mov;
      document.getElementById('tmp').textContent = par;
      document.getElementById('tma').textContent = alt;
    }

    function mkBody(id) {
      return ['callCount=1','page=/calarcom/ControleRastreamento2?veiid='+id,'httpSessionId=','scriptSessionId='+dwr.engine._scriptSessionId,'c0-scriptName=controlerastreamento2Ajax','c0-methodName=buscarDadosVeiculos','c0-id=0','c0-e1=string:'+id,'c0-param0=Array:[reference:c0-e1]','c0-param1=boolean:false','batchId='+(cid++)].join('\n');
    }

    async function ciclo() {
      document.getElementById('tms').textContent = 'BUSCANDO...';
      var ok = 0, err = 0;
      for (var i = 0; i < VV.length; i += 10) {
        var g = VV.slice(i, i + 10);
        await Promise.all(g.map(async function(v) {
          try {
            var r = await fetch('/calarcom/dwr/call/plaincall/controlerastreamento2Ajax.buscarDadosVeiculos.dwr', {
              method: 'POST', headers: {'Content-Type': 'text/plain'}, body: mkBody(v.id)
            });
            var t = await r.text();
            var m = t.match(/velocidadeInt=(\d+)/);
            var vel = m ? parseInt(m[1]) : 0;
            var fv = parseInt(document.getElementById('tmr').value) || 0;
            if (fv > 0 && vel >= fv && !alertados[v.id]) {
              alertados[v.id] = true;
              popupAlerta('VELOCIDADE ALTA!', v.n + ' - ' + vel + ' km/h');
              soarAlarme();
            } else if (vel < fv) {
              alertados[v.id] = false;
            }
            var mc = t.match(/dentroCerca=(\w+)/);
            var mc2 = t.match(/cerid=(\d+)/);
            var cerid = mc2 ? parseInt(mc2[1]) : 0;
            var dentroCerca = mc ? mc[1] === "true" : true;
            if (cerid > 0 && !dentroCerca && !alertados['cerca_' + v.id]) {
              alertados['cerca_' + v.id] = true;
              popupAlerta('FORA DA CERCA!', v.n);
            } else if (dentroCerca) {
              alertados['cerca_' + v.id] = false;
            }
            var mdh = t.match(/datahora="([^"]+)"/);
            if (mdh) { _dataHoras[v.id] = {n:v.n, dh:mdh[1]}; }
            vels[v.id] = vel;
            vels['cerca_' + v.id] = dentroCerca;
            var mlat = t.match(/s0\.latitude=([^;]+)/);
            var mlng = t.match(/s0\.longitude=([^;]+)/);
            if (mlat && mlng) {
              var lat = parseFloat(mlat[1]);
              var lng = parseFloat(mlng[1]);
              if (lat !== 0 && lng !== 0) {
                vels['lat_' + v.id] = lat;
                vels['lng_' + v.id] = lng;
                var dentro = dentroDoPoligono(lat, lng, CERCA_POLY);
                vels['cerca_' + v.id] = dentro;
                if (!dentro && !alertados['cerca_' + v.id]) {
                  alertados['cerca_' + v.id] = true;
                  popupAlerta('FORA DO PERIMETRO CANA!', v.n);
                  soarAlarme();
                } else if (dentro) {
                  alertados['cerca_' + v.id] = false;
                }
              }
            }
            var el = document.getElementById('vs' + v.id);
            if (el) { el.textContent = vel + ' km/h'; el.style.color = vel===0?'#4a7a8a':vel<60?'#00ff88':vel<100?'#ff9900':'#ff3333'; }
            ok++;
          } catch(e) { err++; }
        }));
        await new Promise(function(r) { setTimeout(r, 200); });
      }
      _renderSinal();
      document.getElementById('tms').textContent = 'AO VIVO';
      document.getElementById('tmlog').textContent = new Date().toLocaleTimeString('pt-BR') + ' - ' + ok + ' ok / ' + err + ' erro';
      var foraLista = VV.filter(function(v) { return vels['cerca_' + v.id] === false; });
      var totalEl = document.getElementById('tm-cerca-total');
      var listaEl = document.getElementById('tm-cerca-lista');
      if (totalEl) totalEl.textContent = foraLista.length;
      if (listaEl) listaEl.innerHTML = foraLista.length === 0 ? '<span style="color:#4a7a8a">Nenhum</span>' : foraLista.map(function(v) {
        var lat = vels['lat_' + v.id];
        var lng = vels['lng_' + v.id];
        var url = (lat && lng) ? 'https://www.google.com/maps?q=' + lat + ',' + lng : '#';
        return '<div style="padding:3px 0;border-bottom:1px solid #3a0000"><a href="' + url + '" target="_blank" style="color:#ff9900;text-decoration:none;display:block">⚠ ' + v.n + ' 📍</a></div>';
      }).join('');
      tmF();
    }

    ciclo();
    window._tmT = setInterval(ciclo, 30000);
  }

  aguardar(20);
})();
