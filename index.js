var M_WIDTH=800, M_HEIGHT=450;
var app, game_res, game, objects={}, state="",my_role="", game_tick=0, my_turn=0, selected_figure=0, room_name = 'states2', move=0, game_id=0, connected = 1, LANG = 0;
var me_conf_play=0,opp_conf_play=0, any_dialog_active=0, h_state=0, game_platform="",activity_on=1, hidden_state_start = 0;
var WIN = 1, DRAW = 0, LOSE = -1, NOSYNC = 2;
g_board=[];
var players="", pending_player="";
var my_data={opp_id : ''},opp_data={};
var g_process=function(){};
let opp_figs = ['p','r','n','b','k','q'];
let my_figs = ['P','R','N','B','K','Q'];

let opp_eaten = {'P':0,'R':0,'N':0,'B':0,'Q':0};
let my_eaten = {'p':0,'r':0,'n':0,'b':0,'q':0};

let f_colors = ['w','b'];
var p = {'P':{res : 'wp'},'R':{res : 'wr'},'N':{res : 'wn'},'B':{res : 'wb'},'Q':{res : 'wq'},'K':{res : 'wk'},'p':{res : 'bp'},'r':{res : 'br'},'n':{res : 'bn'},'b':{res : 'bb'},'q':{res : 'bq'},'k':{res : 'bk'}}
var stockfish = new Worker('stockfish.js');
const chess = new Chess();

irnd = function (min,max) {	
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const rgb_to_hex = (r, g, b) => '0x' + [r, g, b].map(x => {
  const hex = x.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}).join('')

class player_mini_card_class extends PIXI.Container {

	constructor(x,y,id) {
		super();
		this.visible=false;
		this.id=id;
		this.uid=0;
		this.type = "single";
		this.x=x;
		this.y=y;
		this.bcg=new PIXI.Sprite(game_res.resources.mini_player_card.texture);
		this.bcg.interactive=true;
		this.bcg.buttonMode=true;
		this.bcg.pointerdown=function(){cards_menu.card_down(id)};
		this.bcg.pointerover=function(){this.bcg.alpha=0.5;}.bind(this);
		this.bcg.pointerout=function(){this.bcg.alpha=1;}.bind(this);
		this.bcg.width = 200;
		this.bcg.height = 100;
		
		this.avatar=new PIXI.Sprite();
		this.avatar.x=20;
		this.avatar.y=20;
		this.avatar.width=this.avatar.height=60;

		this.name="";
		this.name_text=new PIXI.BitmapText('...', {fontName: 'mfont',fontSize: 20});
		this.name_text.anchor.set(0.5,0.5);
		this.name_text.x=135;
		this.name_text.y=35;

		this.rating=0;
		this.rating_text=new PIXI.BitmapText('...', {fontName: 'mfont',fontSize: 25});
		this.rating_text.tint=0xffff00;
		this.rating_text.anchor.set(0.5,0.5);
		this.rating_text.x=135;
		this.rating_text.y=70;

		//аватар первого игрока
		this.avatar1=new PIXI.Sprite();
		this.avatar1.x=20;
		this.avatar1.y=20;
		this.avatar1.width=this.avatar1.height=60;

		//аватар второго игрока
		this.avatar2=new PIXI.Sprite();
		this.avatar2.x=120;
		this.avatar2.y=20;
		this.avatar2.width=this.avatar2.height=60;

		this.rating_text1=new PIXI.BitmapText('1400', {fontName: 'mfont',fontSize: 22});
		this.rating_text1.tint=0xffff00;
		this.rating_text1.anchor.set(0.5,0);
		this.rating_text1.x=50;
		this.rating_text1.y=70;

		this.rating_text2=new PIXI.BitmapText('1400', {fontName: 'mfont',fontSize: 22});
		this.rating_text2.tint=0xffff00;
		this.rating_text2.anchor.set(0.5,0);
		this.rating_text2.x=150;
		this.rating_text2.y=70;
		
		//
		this.rating_bcg = new PIXI.Sprite(game_res.resources.rating_bcg.texture);
		this.rating_bcg.width = 200;
		this.rating_bcg.height = 100;
		
		this.name1="";
		this.name2="";

		this.addChild(this.bcg,this.avatar, this.avatar1, this.avatar2, this.rating_bcg, this.rating_text,this.rating_text1,this.rating_text2, this.name_text);
	}

}

class lb_player_card_class extends PIXI.Container{

	constructor(x,y,place) {
		super();

		this.bcg=new PIXI.Sprite(game_res.resources.lb_player_card_bcg.texture);
		this.bcg.interactive=true;
		this.bcg.pointerover=function(){this.tint=0x55ffff};
		this.bcg.pointerout=function(){this.tint=0xffffff};


		this.place=new PIXI.BitmapText("", {fontName: 'mfont',fontSize: 25});
		this.place.tint=0xffff00;
		this.place.x=20;
		this.place.y=22;

		this.avatar=new PIXI.Sprite();
		this.avatar.x=43;
		this.avatar.y=10;
		this.avatar.width=this.avatar.height=48;


		this.name=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25});
		this.name.tint=0xdddddd;
		this.name.x=105;
		this.name.y=22;


		this.rating=new PIXI.BitmapText('', {fontName: 'mfont',fontSize: 25});
		this.rating.x=298;
		this.rating.tint=rgb_to_hex(255,242,204);
		this.rating.y=22;

		this.addChild(this.bcg,this.place, this.avatar, this.name, this.rating);
	}


}

var anim2 = {
		
	c1: 1.70158,
	c2: 1.70158 * 1.525,
	c3: 1.70158 + 1,
	c4: (2 * Math.PI) / 3,
	c5: (2 * Math.PI) / 4.5,
	empty_spr : {x:0,visible:false,ready:true, alpha:0},
		
	slot: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
	
	any_on : function() {
		
		for (let s of this.slot)
			if (s !== null)
				return true
		return false;		
	},
	
	linear: function(x) {
		return x
	},
	
	kill_anim: function(obj) {
		
		for (var i=0;i<this.slot.length;i++)
			if (this.slot[i]!==null)
				if (this.slot[i].obj===obj)
					this.slot[i]=null;		
	},
	
	easeOutBack: function(x) {
		return 1 + this.c3 * Math.pow(x - 1, 3) + this.c1 * Math.pow(x - 1, 2);
	},
	
	easeOutElastic: function(x) {
		return x === 0
			? 0
			: x === 1
			? 1
			: Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * this.c4) + 1;
	},
	
	easeOutSine: function(x) {
		return Math.sin( x * Math.PI * 0.5);
	},
	
	easeOutCubic: function(x) {
		return 1 - Math.pow(1 - x, 3);
	},
	
	easeInBack: function(x) {
		return this.c3 * x * x * x - this.c1 * x * x;
	},
	
	easeInQuad: function(x) {
		return x * x;
	},
	
	easeOutBounce: function(x) {
		const n1 = 7.5625;
		const d1 = 2.75;

		if (x < 1 / d1) {
			return n1 * x * x;
		} else if (x < 2 / d1) {
			return n1 * (x -= 1.5 / d1) * x + 0.75;
		} else if (x < 2.5 / d1) {
			return n1 * (x -= 2.25 / d1) * x + 0.9375;
		} else {
			return n1 * (x -= 2.625 / d1) * x + 0.984375;
		}
	},
	
	easeInCubic: function(x) {
		return x * x * x;
	},
	
	ease2back : function(x) {
		return Math.sin(x*Math.PI*2);
	},
	
	easeInOutCubic: function(x) {
		
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
	},
	
	shake : function(x) {
		
		return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
		
		
	},	
	
	add : function(obj, params, vis_on_end, time, func, anim3_origin) {
				
		//если уже идет анимация данного спрайта то отменяем ее
		anim2.kill_anim(obj);
		/*if (anim3_origin === undefined)
			anim3.kill_anim(obj);*/

		let f=0;
		//ищем свободный слот для анимации
		for (var i = 0; i < this.slot.length; i++) {

			if (this.slot[i] === null) {

				obj.visible = true;
				obj.ready = false;

				//добавляем дельту к параметрам и устанавливаем начальное положение
				for (let key in params) {
					params[key][2]=params[key][1]-params[key][0];					
					obj[key]=params[key][0];
				}
				
				//для возвратных функцие конечное значение равно начальному
				if (func === 'ease2back')
					for (let key in params)
						params[key][1]=params[key][0];					
					
				this.slot[i] = {
					obj: obj,
					params: params,
					vis_on_end: vis_on_end,
					func: this[func].bind(anim2),
					speed: 0.01818 / time,
					progress: 0
				};
				f = 1;
				break;
			}
		}
		
		if (f===0) {
			console.log("Кончились слоты анимации");	
			
			
			//сразу записываем конечные параметры анимации
			for (let key in params)				
				obj[key]=params[key][1];			
			obj.visible=vis_on_end;
			obj.alpha = 1;
			obj.ready=true;
			
			
			return new Promise(function(resolve, reject){					
			  resolve();	  		  
			});	
		}
		else {
			return new Promise(function(resolve, reject){					
			  anim2.slot[i].p_resolve = resolve;	  		  
			});			
			
		}

		
		

	},	
	
	process: function () {
		
		for (var i = 0; i < this.slot.length; i++)
		{
			if (this.slot[i] !== null) {
				
				let s=this.slot[i];
				
				s.progress+=s.speed;		
				
				for (let key in s.params)				
					s.obj[key]=s.params[key][0]+s.params[key][2]*s.func(s.progress);		
				
				//если анимация завершилась то удаляем слот
				if (s.progress>=0.999) {
					for (let key in s.params)				
						s.obj[key]=s.params[key][1];
					
					s.obj.visible=s.vis_on_end;
					if (s.vis_on_end === false)
						s.obj.alpha = 1;
					
					s.obj.ready=true;					
					s.p_resolve('finished');
					this.slot[i] = null;
				}
			}			
		}
		
	}
	
}

var sound = {
	
	on : 1,
	
	play : function(snd_res) {
		
		if (this.on === 0)
			return;
		
		if (game_res.resources[snd_res]===undefined)
			return;
		
		game_res.resources[snd_res].sound.play();	
		
	}
	
	
}

function add_message(text) {

	//воспроизводим звук
	sound.play('message');

	objects.message_text.text=text;

	anim2.add(objects.message_cont,{x:[-200, objects.message_cont.sx]},true,0.4,'easeOutBack');

	if (objects.message_cont.timer_id!==undefined)	clearTimeout(objects.message_cont.timer_id);


	//убираем сообщение через определенное время
	objects.message_cont.timer_id=setTimeout(()=>{
		anim2.add(objects.message_cont,{x:[objects.message_cont.x,-200]},false,0.4,'easeInBack');

	}, 6000);

}

var big_message = {
	
	p_resolve : 0,
		
	show: function(t1,t2, feedback_on) {
				
		if (t2!==undefined || t2!=="")
			objects.big_message_text2.text=t2;
		else
			objects.big_message_text2.text='**********';

		objects.big_message_text.text=t1;
		
		objects.feedback_button.visible = feedback_on;
		
		anim2.add(objects.big_message_cont,{y:[-180, objects.big_message_cont.sy]},true,0.4,'easeOutBack');

				
		return new Promise(function(resolve, reject){					
			big_message.p_resolve = resolve;	  		  
		});
	},

	feedback_down : async function () {
		
		if (objects.big_message_cont.ready===false || this.feedback_on === 0) {
			sound.play('locked');
			return;			
		}


		anim2.add(objects.big_message_cont,{y:[objects.big_message_cont.sy,450]}, false, 0.4,'easeInBack');	
		
		await feedback.show();
		
		this.p_resolve("close");
				
	},

	close : function() {
		
		if (objects.big_message_cont.ready===false)
			return;

		sound.play('close');
		anim2.add(objects.big_message_cont,{y:[objects.big_message_cont.y, 450]},false,0.4,'easeInBack');
		
		this.p_resolve("close");			
	}

}

var board_func={

	checker_to_move: "",
	target_point: 0,
	tex_2:0,
	tex_1:0,
	moves: [],
	move_end_callback: function(){},

	update_board: function() {

		//сначала скрываем все шашки
		objects.figures.forEach((c)=>{	c.visible=false});

		var ind=0;
		for (var x = 0; x < 8; x++) {
			for (var y = 0; y < 8; y++) {

				let t = g_board[y][x];
				if (t!=='x')
				{	
			
					
					let lcase_t = t.toLowerCase();					
					let my_figure = lcase_t !== t;
					let tex_id = '';
					if (my_figure === true)
						tex_id = f_colors[0] + lcase_t
					else
						tex_id = f_colors[1] + lcase_t	
					
					
					objects.figures[ind].texture = gres[tex_id].texture;

					objects.figures[ind].x = x * 50 + objects.board.x + 20;
					objects.figures[ind].y = y * 50 + objects.board.y + 10;

					objects.figures[ind].ix = x;
					objects.figures[ind].iy = y;
					objects.figures[ind].fig = t;
					objects.figures[ind].m_id = g_board[y][x];
					objects.figures[ind].alpha = 1;

					objects.figures[ind].visible = true;
					ind++;
				}
			}
		}

	},
	
	get_fen : function(brd) {
		
		let fen = "";
		
		for (var y = 0; y < 8; y++) {	
			
			let prv_f = '';
			let cnt_e = 0;
			
			for (var x = 0; x < 8; x++) {
				
				if (brd[y][x]==='x')				
					cnt_e ++;
					
				if (brd[y][x] !=='x') {
					
					if (cnt_e > 0 ) {
						fen = fen + cnt_e;
						cnt_e = 0;
					}

					fen = fen + brd[y][x]
				}
				
				if ( x === 7 && cnt_e > 0)					
					fen = fen + cnt_e;
			}
			
			if (y !== 7)
				fen = fen + '/';
		}	
		
		return fen;
		
	},

	get_checker_by_pos(x,y) {

		for (let c of objects.figures)
			if (c.ix===x && c.iy===y)
				return c;
		return 0;
	},
	
	get_moves_on_dir (brd, f, dx, dy, max_moves, figures_to_eat) {
				
		//текущее положение
		let cx = f.ix;
		let cy = f.iy;
		let valid_moves = [];

		for (let i = 1 ; i < max_moves; i++) {
			
			let tx = cx + i * dx;
			let ty = cy + i * dy;
			
			if ( tx > -1 && tx < 8 && ty > -1 && ty < 8 ) {
				if (brd[ty][tx] === 'x') {
					valid_moves.push(tx+'_'+ty)						
				} else {						
					if (figures_to_eat.includes(brd[ty][tx]) === true)
						valid_moves.push(tx+'_'+ty)
					break;
				}							
			}	
		}
		
		return valid_moves;
		
	},
	
	get_figure_pos(brd, f_name) {		
		
		for (var x = 0; x < 8; x++) {
			for (var y = 0; y < 8; y++) {

				let t = brd[y][x];
				if (t===f_name)
					return [x,y];
			}
		}	
	},
	
	get_valid_moves(brd, f, figures_to_eat) {
		
		let valid_moves =[];
		
		//создаем массив возможных ходов
		if (f.fig === 'P' || f.fig === 'p') {
							
			let dy =  f.fig === 'p' ? 1 : -1;
			
			//проверяем возможность хода вперед на одну клетку
			let cx = f.ix;
			let cy = f.iy;
			let tx = cx;
			let ty = cy + dy;				
			if (ty > -1 && ty < 8)
				if (brd[ty][tx] === 'x')				
					valid_moves.push(tx+'_'+ty)
			
			//проверяем возможность хода вперед на две клетки
			let iy =  f.fig === 'p' ? 1 : 6;
			tx = cx;
			ty = cy + dy + dy;				
			if (ty > -1 && ty < 8  && cy === iy)
				if (brd[ty][tx] === 'x' && brd[ty+1][tx] === 'x')				
					valid_moves.push(tx+'_'+ty)

			//проверяем возможность есть влево
			tx = cx - 1;
			ty = cy + dy;				
			if (ty > -1 && ty < 8 && tx > -1)
				if (figures_to_eat.includes(brd[ty][tx])  === true)				
					valid_moves.push(tx+'_'+ty)			
			
			//проверяем возможность есть вправо
			tx = cx + 1;
			ty = cy + dy;				
			if (ty > -1 && ty < 8 && tx < 8)
				if (figures_to_eat.includes(brd[ty][tx])  === true)				
					valid_moves.push(tx+'_'+ty)
							
			
			//проверяем возможность взятия пешки на проходе
			if (f.fig === 'P' && f.iy === 3 && pass_take !== -1) {
				
				tx = cx - 1;
				if (tx === pass_take)
					valid_moves.push(tx+'_'+2);				
				
				tx = cx + 1;
				if (tx === pass_take)
					valid_moves.push(tx+'_'+2);				
			}
			
				
			return valid_moves;
			
		}
		
		if (f.fig === 'R' || f.fig === 'r') {
			
			//текущее положение
			let cx = f.ix;
			let cy = f.iy;
			
			let m0 = this.get_moves_on_dir(brd,f, -1 , 0, 8, figures_to_eat);
			let m1 = this.get_moves_on_dir(brd,f, 1 , 0, 8, figures_to_eat);
			let m2 = this.get_moves_on_dir(brd,f, 0 , -1, 8, figures_to_eat);
			let m3 = this.get_moves_on_dir(brd,f, 0 , 1, 8, figures_to_eat);
			
			return [...m0,...m1,...m2,...m3];
			
		}
		
		if (f.fig === 'N' || f.fig === 'n') {
			
			//направления ходов коня [dx,dy]]
			let moves_dir = [[-2,-1],[-1,-2],[1,-2],[2,-1],[2,1],[1,2],[-1,2],[-2,1]];
			for ( let v = 0 ; v < 8 ; v++ ) {
				let tx = f.ix + moves_dir[v][0];
				let ty = f.iy + moves_dir[v][1];
				
				//заносим в перечень валадных ходов
				if ( tx > -1 && tx < 8 && ty > -1 && ty < 8) {
					
					if (brd[ty][tx] === 'x') {
						valid_moves.push(tx+'_'+ty)						
					} else {						
						if (figures_to_eat.includes(brd[ty][tx]) === true)
							valid_moves.push(tx+'_'+ty)
					}
				}		
			}
			
			return valid_moves;				
		}
		
		if (f.fig === 'B' || f.fig === 'b') {
			
			//текущее положение
			let cx = f.ix;
			let cy = f.iy;
			
			let m0 = this.get_moves_on_dir(brd,f, -1 , -1, 8, figures_to_eat);
			let m1 = this.get_moves_on_dir(brd,f, -1 , 1, 8, figures_to_eat);
			let m2 = this.get_moves_on_dir(brd,f, 1 , -1, 8, figures_to_eat);
			let m3 = this.get_moves_on_dir(brd,f, 1 , 1, 8, figures_to_eat);
			
			return [...m0,...m1,...m2,...m3];		
		
		}
		
		if (f.fig === 'K' || f.fig === 'k') {
			
			
			let m0 = this.get_moves_on_dir(brd,f, -1 , -1, 2, figures_to_eat);
			let m1 = this.get_moves_on_dir(brd,f, -1 , 1, 2, figures_to_eat);
			let m2 = this.get_moves_on_dir(brd,f, 1 , -1, 2, figures_to_eat);
			let m3 = this.get_moves_on_dir(brd,f, 1 , 1, 2, figures_to_eat);
			let m4 = this.get_moves_on_dir(brd,f, -1 , 0, 2, figures_to_eat);
			let m5 = this.get_moves_on_dir(brd,f, 1 , 0, 2, figures_to_eat);
			let m6 = this.get_moves_on_dir(brd,f, 0 , -1, 2, figures_to_eat);
			let m7 = this.get_moves_on_dir(brd,f, 0 , 1, 2, figures_to_eat);
			
			return [...m0,...m1,...m2,...m3,...m4,...m5,...m6,...m7];	
			
		}
		
		if (f.fig === 'Q' || f.fig === 'q') {
			
			//текущее положение
			let cx = f.ix;
			let cy = f.iy;
			
			let m0 = this.get_moves_on_dir(brd,f, -1 , -1, 8, figures_to_eat);
			let m1 = this.get_moves_on_dir(brd,f, -1 , 1, 8, figures_to_eat);
			let m2 = this.get_moves_on_dir(brd,f, 1 , -1, 8, figures_to_eat);
			let m3 = this.get_moves_on_dir(brd,f, 1 , 1, 8, figures_to_eat);
			let m4 = this.get_moves_on_dir(brd,f, -1 , 0, 8, figures_to_eat);
			let m5 = this.get_moves_on_dir(brd,f, 1 , 0, 8, figures_to_eat);
			let m6 = this.get_moves_on_dir(brd,f, 0 , -1, 8, figures_to_eat);
			let m7 = this.get_moves_on_dir(brd,f, 0 , 1, 8, figures_to_eat);
			
			return [...m0,...m1,...m2,...m3,...m4,...m5,...m6,...m7];		
			
		}

	},
	
	is_check(brd, king) {
		
		if (king === 'k') {
			
			//положение короля
			let king_pos = board_func.get_figure_pos(brd, king);
			king_pos = king_pos[0] + '_' + king_pos[1];
			
			//проверяем все фигуры - есть ли у них возможность есть короля
			for (var x = 0; x < 8; x++) {
				for (var y = 0; y < 8; y++) {				
					if(my_figs.includes(brd[y][x])) {
						
						let f = {ix:x, iy:y, fig : brd[y][x]};
						let v_moves = board_func.get_valid_moves(brd, f, opp_figs);						
						if (v_moves.includes(king_pos) === true)
							return true;									
						
					}				
				}
			}	
			return false;
		}
		
		if (king === 'K') {
			
			//положение короля
			let king_pos = board_func.get_figure_pos(brd, king);
			king_pos = king_pos[0] + '_' + king_pos[1];
			
			//проверяем все фигуры - есть ли у них возможность есть короля
			for (var x = 0; x < 8; x++) {
				for (var y = 0; y < 8; y++) {				
					if(opp_figs.includes(brd[y][x])) {
						
						let f = {ix:x, iy:y, fig : brd[y][x]};
						let v_moves = board_func.get_valid_moves(brd, f, my_figs);						
						if (v_moves.includes(king_pos) === true)
							return true;									
						
					}				
				}
			}	
			
			return false;
		}
		
	},

	check_fin(brd, fig) {
		
		//проверяем звершение игры
		let fen = board_func.get_fen(brd) + ' ' + fig + ' - - 1 1';
		chess.load(fen);
		let is_check = chess.in_check();
		let is_checkmate =  chess.in_checkmate();	
		let	is_stalemate = chess.in_stalemate();
				
		if (is_checkmate === true)
			return 'checkmate';		
		if (is_check === true)
			return 'check';
		if (is_stalemate === true)
			return 'stalemate';
		return '';
	}
}

var make_text = function (obj, text, max_width) {

	let sum_v=0;
	let f_size=obj.fontSize;

	for (let i=0;i<text.length;i++) {

		let code_id=text.charCodeAt(i);
		let char_obj=game_res.resources.m2_font.bitmapFont.chars[code_id];
		if (char_obj===undefined) {
			char_obj=game_res.resources.m2_font.bitmapFont.chars[83];
			text = text.substring(0, i) + 'S' + text.substring(i + 1);
		}

		sum_v+=char_obj.xAdvance*f_size/64;
		if (sum_v>max_width) {
			obj.text =  text.substring(0,i-1);
			return;
		}
	}

	obj.text =  text;
}

var mini_dialog = {
	
	type : 0,
	
	show : function (type) {
		
		if (objects.mini_dialog.visible === true || objects.big_message_cont.visible === true)	{
			sound.play('locked');
			return
		}
		
		this.type = type;
		
		sound.play('mini_dialog');
		
		if (type === 'giveup')
			objects.t5.text = 'Сдаетесь?'
		if (type === 'draw')
			objects.t5.text = 'Предложить ничью?'
		if (type === 'draw_request')
			objects.t5.text = 'Согласны на ничью?'
		
		anim2.add(objects.mini_dialog,{y:[450,objects.mini_dialog.sy]}, true, 0.3,'linear');
	},
	
	no : async function () {	
	
		
		if (objects.mini_dialog.ready === false || 	objects.big_message_cont.visible === true)	{
			sound.play('locked');
			return
		}
		
		sound.play('click');
				
		if (this.type === 'draw_request')	
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"DRAWNO",tm:Date.now(),data:{}});			
		
		this.close();
		
	},
		
	yes : function () {
		
		if (objects.mini_dialog.ready === false || 	objects.big_message_cont.visible === true)	{
			sound.play('locked');
			return
		}
		
		sound.play('click');
		
		if (this.type === 'giveup') {			
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"GIVEUP",tm:Date.now(),data:{}});		
			online_player.stop('player_gave_up');
		}
		
		if (this.type === 'draw')
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"DRAWREQ",tm:Date.now(),data:{}});
		
		if (this.type === 'draw_request') {
			firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"DRAWOK",tm:Date.now(),data:{}});		
			online_player.stop('draw');		
		}
		
		this.close();
	},
	
	close : function() {
		
		anim2.add(objects.mini_dialog,{y:[objects.mini_dialog.y,450]}, false, 0.3,'linear');
		//any_dialog_active--;
		
	}
	
}

var online_player = {
	
	start_time : 0,
	disconnect_time : 0,
	move_time_left : 0,
	timer_id : 0,
		
	send_move : function  (move_data) {
		
		//переворачиваем данные о ходе так как оппоненту они должны попасть как ход шашками №2
		move_data.x1=7-move_data.x1;
		move_data.y1=7-move_data.y1;
		move_data.x2=7-move_data.x2;
		move_data.y2=7-move_data.y2;

		//отправляем ход сопернику
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MOVE",tm:Date.now(),data:move_data});
	},
	
	calc_new_rating : function (old_rating, game_result) {
		
		
		if (game_result === NOSYNC)
			return old_rating;
		
		var Ea = 1 / (1 + Math.pow(10, ((opp_data.rating-my_data.rating)/400)));
		if (game_result === WIN)
			return Math.round(my_data.rating + 16 * (1 - Ea));
		if (game_result === DRAW)
			return Math.round(my_data.rating + 16 * (0.5 - Ea));
		if (game_result === LOSE)
			return Math.round(my_data.rating + 16 * (0 - Ea));
		
	},
	
	init : function (r) {
		
		objects.game_buttons_cont.visible=true;
		
		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		set_state({state : 'p'});
		
		//фиксируем врему начала игры
		this.start_time = Date.now();
		
		//обновляем время без связи
		this.disconnect_time = 0;
		
		//вычиcляем рейтинг при проигрыше и устанавливаем его в базу он потом изменится
		let lose_rating = this.calc_new_rating(my_data.rating, LOSE);
		if (lose_rating >100 && lose_rating<9999)
			firebase.database().ref("players/"+my_data.uid+"/rating").set(lose_rating);
		
		if (r === 'master')
			g_board = [['r','n','b','q','k','b','n','r'],['p','p','p','p','p','p','p','p'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['P','P','P','P','P','P','P','P'],['R','N','B','Q','K','B','N','R']];
		else
			g_board = [['r','n','b','k','q','b','n','r'],['p','p','p','p','p','p','p','p'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['P','P','P','P','P','P','P','P'],['R','N','B','K','Q','B','N','R']];
		/*
		if (r === 'master')
			g_board = [['r','n','b','q','k','b','n','r'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['R','N','B','Q','K','B','N','R']];
		else
			g_board = [['r','n','b','k','q','b','n','r'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['R','N','B','K','Q','B','N','R']];
*/

		//начинаем ежесекунжные проверки
		this.second_tick(15);

		board_func.update_board();
	},
	
	second_tick (t) {
		
		if (state !== 'p')
			return;
		
		this.move_time_left--;		
		
		if (t!==undefined)
			this.move_time_left = t;			

						
		if (this.move_time_left < 0 && my_turn === 1)	{
			
			if (me_conf_play === 1)
				this.stop('my_timeout');
			else
				this.stop('my_no_sync');
			
			return;
		}

		if (this.move_time_left < -5 && my_turn === 0)	{
						
			if (opp_conf_play === 1)
				this.stop('opp_timeout');
			else
				this.stop('opp_no_sync');
			
			return;
		}
				
		if (connected === 0) {
			this.disconnect_time ++;
			if (this.disconnect_time > 6) {
				this.stop('my_no_connection');
				return;				
			}
		}		
		
		//подсвечиваем красным если осталость мало времени
		if (this.move_time_left === 10) {
			objects.timer.tint=0xff0000;
			sound.play('clock');
		}
		
		//обновляем на табло
		if (this.move_time_left >= 0) {
			if ( this.move_time_left >9 )
				objects.timer.text = '0:'+this.move_time_left;
			else
				objects.timer.text = '0:0'+this.move_time_left;
		}
		
		//вызываем через секунду
		this.timer_id = setTimeout(function(){online_player.second_tick()}, 1000);		
	},
	
	stop : async function(final_state) {					
		
		//отключаем взаимодейтсвие с доской
		objects.board.pointerdown=null;
		
		//отключаем таймер
		clearTimeout(this.timer_id);	
		
		//элементы только для данного оппонента	
		objects.game_buttons_cont.visible=false;
				
		let res_db = {
			'my_no_connection' 		: ['Потеряна связь!\nИспользуйте надежное интернет соединение.', LOSE],
			'stalemate_to_opponent' : ['Пат!\nИгра закончилась ничьей.', DRAW],
			'stalemate_to_player' 	: ['Пат!\nИгра закончилась ничьей.', DRAW],
			'draw' 					: ['Игра закончилась ничьей.', DRAW],
			'checkmate_to_opponent' : ['Победа!\nВы поставили мат!', WIN],
			'checkmate_to_player' 	: ['Поражение!\nВам поставили мат!', LOSE],
			'opponent_gave_up' 		: ['Победа!\nСоперник сдался.', WIN],
			'player_gave_up' 		: ['Поражение!\nВы сдались.', LOSE],
			'opp_timeout' 			: ['Победа!\nСоперник не сделал ход.', WIN],
			'my_timeout' 			: ['Поражение!\nУ вас закончилось время.', LOSE],
			'opp_no_sync' 			: ['Похоже соперник не смог начать игру', NOSYNC],
			'my_no_sync' 			: ['Похоже Вы не смогли начать игру', NOSYNC],
			'draw_50' 				: ['Ничья!\nЗа последние 50 ходов не было взятий фигур и продвижения пешек', NOSYNC]	
		}
		
		let res_info = res_db[final_state];
		
		//обновляем рейтинг
		let old_rating = my_data.rating;
		my_data.rating = this.calc_new_rating (my_data.rating, res_info[1]);
		firebase.database().ref("players/"+my_data.uid+"/rating").set(my_data.rating);

		//обновляем даные на карточке
		objects.my_card_rating.text=my_data.rating;

		//играем звук
		game.play_finish_sound(res_info[1]);

		//записываем результат игры в базу данных
		if (res_info[1] === DRAW || res_info[1] === LOSE || res_info[1] === WIN) {
			
			//записываем результат в базу данных
			let duration = ~~((Date.now() - this.start_time)*0.001);
			firebase.database().ref("finishes/" + game_id + my_role).set({'player1':objects.my_card_name.text,'player2':objects.opp_card_name.text, 'res':res_info[1], 'fin_type':final_state,'duration':duration, 'ts':firebase.database.ServerValue.TIMESTAMP});
		
			//увеличиваем количество игр
			my_data.games++;
			firebase.database().ref("players/"+[my_data.uid]+"/games").set(my_data.games);	

			let check_players =[
				'ls3844970',
				'meZ2SiSr91BSgxoD763cGrZZww5sWo98rvrr9tARYj0=',
				'ls1807543',
				'ls3996035',
				'RPYlNOh4Dpv5g2IiZc+Sc6en0gy0InfpdsZwPHJzlbE=',
				'vk157725076',
				'4MqwsTmjkY9YTwsZP+VlTiS7Zi6+XwOERw8Bj+yfzmY=',
				'0bKUa5fOJS6hNU53qzI459VAbM7VCNluAMEXPcmFo6Q=',
				'JERga13Sq681XyhSDd6tns8piJi57EtPCsuXZ9jFOkg=',
				'ls9359789',
				'pqLNTN3nGPlhgHHzDZj9Oe+M6c1bqSZAHaNCfGWCZ4g=',
				'AWgYaqbra7yaWLwSKm27DiwZxgc4M1LIn+z7AxVT8us=',
				'NizqlONZS6sQge1lJTi9ytVjhJ4jqUWJmZZmnjqVghQ=',
				'QdHMDnRWAhSDuDV2yDm6f5jXUItmr0USiomyU4ga874=',
				'2ghP9ja8vONuZep9zxQj6IXUY7uFdp5ZAhjZ64Z8+bc=',
				'ls934420',
				'ls9152430',
				'jRD+TXmyb3wsZV8+34Z7ovZqQndV2SImUSy88rlVhZo=',
				'JzJ06g2JqepeWjD7U6vOBXaUFVSRGlhgA8ZF6uLlRjU=',
				'ls9894724'
			]
			
			if (check_players.includes(my_data.uid) || check_players.includes(opp_data.uid))
			{
				firebase.database().ref("finishes2").push({'player1':objects.my_card_name.text,'player2':objects.opp_card_name.text, 'res':res_info[1], 'fin_type':final_state,'duration':duration, 'ts':firebase.database.ServerValue.TIMESTAMP});
			}			
		
		}
		
		await big_message.show(res_info[0], `Рейтинг: ${old_rating} > ${my_data.rating}`, true);
				
		//останавливаем все остальное
		game.stop();		
	},
	
	reset_timer_when_move : function() {
		
		//обовляем время разъединения
		this.disconnect_time = 0;
		
		//перезапускаем таймер хода
		this.move_time_left = 45;
		
		//обновляем на табло
		objects.timer.text = '0:'+this.move_time_left;

		if (my_turn === 1)
			objects.timer.x = 225;
		else
			objects.timer.x = 575;

		objects.timer.tint = 0xffffff;
		
	}

};

var bot_player = {
		
	send_move : function  () {
				
		//формируем фен строку и запускаем поиск решения
		let fen = board_func.get_fen(g_board) + ' b';	
		stockfish.postMessage('position fen ' + fen);		
		stockfish.postMessage("go depth 5");
		
	},
	
	init : function () {
		
		//сообщения от стокфиша
		stockfish.addEventListener('message', bot_player.stockfish_response);
	
		stockfish.postMessage("ucinewgame");		
		
		if (my_data.rating>=0 && my_data.rating<1500 )
			stockfish.postMessage("setoption name Skill Level value 3");
		if (my_data.rating>=1500 && my_data.rating<1600 )
			stockfish.postMessage("setoption name Skill Level value 5");
		if (my_data.rating>=1600 && my_data.rating<1700 )
			stockfish.postMessage("setoption name Skill Level value 7");
		if (my_data.rating>=1700 && my_data.rating<1800 )
			stockfish.postMessage("setoption name Skill Level value 9");
		if (my_data.rating>=1800 && my_data.rating<1900 )
			stockfish.postMessage("setoption name Skill Level value 11");
		if (my_data.rating>=1900)
			stockfish.postMessage("setoption name Skill Level value 13");
		
		objects.stop_bot_button.visible=true;
		
		opp_data.uid = 'BOT';
		
		//обновляем на табло
		objects.timer.text = 'Мой ход';
		
		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		set_state({state : 'b'});
		
		//сначала скрываем все шашки
		g_board = [['r','n','b','q','k','b','n','r'],['p','p','p','p','p','p','p','p'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['P','P','P','P','P','P','P','P'],['R','N','B','Q','K','B','N','R']];
		//g_board = [['x','x','x','x','k','x','x','x'],['x','x','x','x','p','p','p','p'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['x','x','x','x','x','x','x','x'],['P','P','P','P','P','P','P','P'],['R','N','B','Q','K','B','N','R']];



		board_func.update_board();
	},
	
	check_time (t) {
		
		//подсвечиваем красным если осталость мало времени
		if (t === 5) {
			objects.timer.tint=0xff0000;
			sound.play('clock');
		}
	},
	
	stockfish_response : function (e) {
		
		//console.log(e.data);		
		
		if (e.data.substring(0, 8) !== 'bestmove')
			return
		
		let move_str = e.data.substring(9, 13);
		let pawn_replace = e.data.substring(13,14);

		let c1 = {'a':0,'b':1,'c':2,'d':3,'e':4,'f':5,'g':6,'h':7};
		
		let x1s=move_str[0];
		let y1s=move_str[1];
		let x2s=move_str[2];
		let y2s=move_str[3];
		
		let x1 = c1[x1s];
		let x2 = c1[x2s];
		let y1 = 8 - parseInt(y1s);
		let y2 = 8 - parseInt(y2s);
				
		let move_data={x1:x1, y1:y1, x2:x2, y2:y2};
		
		//проверяем замену пешки на новую фигуру
		if (opp_figs.includes(pawn_replace) === true)
			move_data.pawn_replace = pawn_replace;			
		
		game.receive_move(move_data);
	},
	
	stop : async function(final_state) {

						
		//отключаем комманды
		stockfish.removeEventListener('message', bot_player.stockfish_response);
						
		//отключаем взаимодейтсвие с доской
		objects.board.pointerdown=null;
						
		//элементы только для данного оппонента
		objects.stop_bot_button.visible = false;
		

		let t = ['Вы отменили игру',999]		
		
		if ( final_state === 'stalemate_to_opponent' || final_state === 'stalemate_to_player')
			t = ['Пат!\nИгра закончилась ничьей.',DRAW]		
				
		if (final_state === 'checkmate_to_opponent')
			t = ['Победа!\nВы поставили мат!',WIN]				
		
		if (final_state === 'checkmate_to_player')			
			t = ['Поражение!\nВам поставили мат!',LOSE]		
		
		if (final_state === 'draw_50')			
			t = ['Ничья!',DRAW]		
		
		game.play_finish_sound(t[1]);
		await big_message.show(t[0],'---)))---', true);
		
		game.stop();		
	},
	
	stop_down : function () {
		
		if (anim2.any_on() === true || objects.td_cont.visible === true || objects.big_message_cont.visible === true ||objects.req_cont.visible === true ||objects.invite_cont.visible === true)	{
			sound.play('locked');
			return
		};
		
		this.stop();		
	},
	
	switch_stop : function () {
		
		//это отключение при приграшении
		stockfish.removeEventListener('message', bot_player.stockfish_response);
		
		//отключаем взаимодейтсвие с доской
		objects.board.pointerdown = null;
		
		//отключаем таймер
		//timer.stop();		
						
		//элементы только для данного оппонента
		objects.stop_bot_button.visible=false;
		
	},
	
	reset_timer_when_move : function() {
		
		if (my_turn === 1)
			objects.timer.x = 225;
		else
			objects.timer.x = 575;		
	}
	
};

var game={

	valid_moves : 0,
	move_made : [0,0,0],
	player_under_check : 0,
	opponent : {},
	checker_is_moving : 0,
	draw_50: 0,
	state : 0,

	activate: function(role, opponent) {

		
		this.state = 'on';
		my_role=role;
		this.opponent = opponent;
		if (my_role==="master") {
			f_colors = ['w','b'];
			objects.timer.x=225;
			my_turn = 1;
		} else {
			f_colors = ['b','w'];
			objects.timer.x=575;
			my_turn = 0;
		}

		//если открыт лидерборд то закрываем его
		if (objects.lb_1_cont.visible===true)
			lb.close();		
		
		if (state === 'b')
			bot_player.switch_stop();

		//ни я ни оппонент пока не подтвердили игру
		me_conf_play=0;
		opp_conf_play=0;
		
		this.move_made = [0,0,0,0,0,0,0,0];
		this.player_under_check = 0;
		
		sound.play('note');
		
		//обновляем время без взятий и движения пешки
		this.draw_50 = 0;
			
		
		//инициируем все что связано с оппонентом
		this.opponent.init(my_role);
				
		//общие элементы для игры
		objects.timer.tint = 0xffffff;
		objects.selected_frame.visible=false;
		objects.board.visible=true;
		objects.my_card_cont.visible=true;
		objects.opp_card_cont.visible=true;		
		objects.my_eaten_cont.visible=true;
		objects.opp_eaten_cont.visible=true;		
		
		
		//никакая фигура не быбрана
		selected_figure=0;		

		//обозначаем какой сейчас ход
		move=0;
		objects.cur_move_text.visible=true;
		objects.cur_move_text.text="Ход: "+move;
		
		//включаем взаимодейтсвие с доской
		objects.board.pointerdown=game.mouse_down_on_board.bind(game);

		//счетчик времени
		objects.timer.visible=true;
		
		//устанавливаем начальное значение съеденных фигур
		opp_eaten = {'P':0,'R':0,'N':0,'B':0,'Q':0};
		my_eaten = {'p':0,'r':0,'n':0,'b':0,'q':0};
		objects.my_pn.text = objects.opp_pn.text = 0;
		objects.my_rn.text = objects.opp_rn.text = 0;
		objects.my_nn.text = objects.opp_nn.text = 0;
		objects.my_bn.text = objects.opp_bn.text = 0;
		objects.my_qn.text = objects.opp_qn.text = 0;			

	},
	
	mouse_down_on_board : function(e) {

		if (objects.big_message_cont.visible === true || objects.pawn_replace_dialog.visible === true || objects.req_cont.visible === true || this.checker_is_moving === 1)	{
			sound.play('locked');
			return
		}

		//проверяем что моя очередь
		if (my_turn === 0) {
			add_message("не твоя очередь");
			return;
		}
		
		//координаты указателя
		var mx = e.data.global.x/app.stage.scale.x;
		var my = e.data.global.y/app.stage.scale.y;

		//координаты указателя на игровой доске
		var new_x=Math.floor(8*(mx-objects.board.x-20)/400);
		var new_y=Math.floor(8*(my-objects.board.y-10)/400);

		//если фигура еще не выбрана
		if (selected_figure===0)
		{
			game.valid_moves = [];
			
			//проверяем что выбрана моя фигура а не оппонента или пустая клетка
			let fig = g_board[new_y][new_x];
			if (my_figs.includes(fig) === false) {
				return;			
			}			
						
			//находим шашку по координатам
			selected_figure=board_func.get_checker_by_pos(new_x,new_y);

			objects.selected_frame.x=selected_figure.x;
			objects.selected_frame.y=selected_figure.y;
			objects.selected_frame.visible=true;

			//воспроизводим соответствующий звук
			sound.play('move');
						
			game.valid_moves = board_func.get_valid_moves(g_board, selected_figure, opp_figs);
						

			return;
		}

		//если фигура выбрана
		if (selected_figure!==0)
		{
			
			//если нажали на выделенную шашку то отменяем выделение
			if (new_x===selected_figure.ix && new_y===selected_figure.iy)
			{
				sound.play('move');
				selected_figure=0;
				objects.selected_frame.visible=false;
				return;
			}				
			
			
			
			//если игрок хочет рокировку, проверяем....			
			let castling = 0;
			let castling_dir = Math.sign(new_x - selected_figure.ix);
			
			//где должен изначально стоять король
			let king_orig_x = my_role === 'master' ? 4 : 3
			
			//выбрана первая линия
			let c0 = selected_figure.iy === 7 && new_y === 7;
			
			//если выбрал короля
			let c1 = selected_figure.fig === 'K';
			
			//если выбрал ячейку где должен сначала стоять король и он там стоит
			let c2 = selected_figure.ix === king_orig_x;
			
			//если сделал ход на 0 или 7 и там ладья
			let c3 = (g_board[new_y][new_x] === 'R') && (new_x === 0 || new_x === 7)			


			if (c0 && c1 && c2 && c3) {
								
				
				//если король не делал ход
				let c4 = game.move_made[1] === 0;				
				if (c4 === false) {
					add_message("Рокировка невозможна. Король уже сделал ход.");				
					return;
				}					
			
				//если ладья не делала ход
				let c5 = game.move_made[new_x] === 0;	
				if (c5 === false) {
					add_message("Рокировка невозможна. Ладья уже сделала ход.");				
					return;
				}				
				
				//если нет шаха
				let c6 = game.player_under_check === 0;		
				if (c6 === false) {
					add_message("Рокировка невозможна. Вам Шах.");				
					return;
				}
				
				//проверяем наличие свободного поля между ладьей и королем
				if (king_orig_x === 4) {
					
					//проверяем длинную рокировку
					if (new_x === 0) {
						if (!(g_board[7][1] === 'x' && g_board[7][2] === 'x' && g_board[7][3] === 'x')) {
							add_message("Рокировка невозможна. Поле не свободно.");				
							return;
						}							
					}			
					
					//проверяем короткую рокировку
					if (new_x === 7) {
						if (!(g_board[7][5] === 'x' && g_board[7][6] === 'x')) {
							add_message("Рокировка невозможна. Поле не свободно.");				
							return;
						}								
					}			
					
				} else {
					
					//проверяем длинную рокировку
					if (new_x === 7) {
						if (!(g_board[7][4] === 'x' && g_board[7][5] === 'x' && g_board[7][6] === 'x')){
							add_message("Рокировка невозможна. Поле не свободно.");				
							return;
						}										
					}			

					//проверяем короткую рокировку
					if (new_x === 0) {
						if (!(g_board[7][1] === 'x' && g_board[7][2] === 'x')){
							add_message("Рокировка невозможна. Поле не свободно.");				
							return;
						}								
					}				
				}	
				
				//проверяем битое поле на пути короля
				let _new_x = selected_figure.ix + castling_dir;
				let _m_data={x1:selected_figure.ix,y1:selected_figure.iy,x2:_new_x, y2:new_y};	
				let {x1,y1,x2,y2}=_m_data;
				let _new_board = JSON.parse(JSON.stringify(g_board));			
				_new_board[y2][x2] = _new_board[y1][x1];
				_new_board[y1][x1] = 'x';
				
				let _is_check = board_func.is_check(_new_board, 'K');
				if (_is_check === true) {
					add_message("Рокировка невозможна. Битое поле на пути короля.");				
					return;
				}			
				

				castling = 1;
			}
			
			
			if (game.valid_moves.includes(new_x+'_'+new_y) === false && castling === 0) {				
				add_message("так ходить нельзя");
				return;
			}	
			
			
			//для проверки рокировки на шах указываем конечное назначение короля
			let old_new_x = new_x;
			if (castling === 1)
				new_x = selected_figure.ix + castling_dir * 2;				

			

			//формируем объект содержащий информацию о ходе
			let m_data={x1:selected_figure.ix,y1:selected_figure.iy,x2:new_x, y2:new_y};	
			

			//проверяем на шах
			let {x1,y1,x2,y2}=m_data;
			let new_board = JSON.parse(JSON.stringify(g_board));			
			new_board[y2][x2] = new_board[y1][x1];
			new_board[y1][x1] = 'x';
			
			let is_check = board_func.is_check(new_board, 'K');
			if (is_check === true) {
				castling === 1 ? add_message("Рокировка невозможна.Так вам шах") : add_message("Так вам шах");				
				return;
			}		
						
			//указываем что король или ладья сделали движение и рокировка больше невозможна
			if (x1 === 0 && y1 === 7)
				game.move_made[0] = 1			
			if (x1 === 7 && y1 === 7)
				game.move_made[7] = 1
			if (selected_figure.fig === 'K')
				game.move_made[1] = 1;
			
		
			//возвращаем после предварительной рокировки
			m_data.x2 = old_new_x;
			
			sound.play('click');

			//убираем выделение с фигуры
			objects.selected_frame.visible=false;

			//отменяем выделение
			selected_figure=0;		

			//дальнейшая обработка хода
			game.process_my_move(m_data, castling);

		}

	},

	process_my_move : async function (move_data, castling) {

		//обновляем счетчик хода
		move++;
		objects.cur_move_text.text="Ход: "+move;
		let {x1,y1,x2,y2}=move_data;
					
		
		//перемещаем мою фигуру и обновляем доску	
		this.checker_is_moving = 1;		
		if (castling === 1)
			await this.make_castling_on_board(move_data);
		else
			await this.make_move_on_board(move_data);
		this.checker_is_moving = 0;		
		
		sound.play('move');
				
		//диалог выбора фигуры
		if (g_board[y2][x2] === 'P' && y2 === 0) {
			g_board[y2][x2] = await pawn_replace_dialog.show();		
			move_data.pawn_replace = g_board[y2][x2].toLowerCase();	
			board_func.update_board();			
		}	
		
		//перезапускаем таймер хода и кто ходит			
		my_turn = 0;			
		this.opponent.reset_timer_when_move();	
		
		//отпрравляем ход оппоненту
		this.opponent.send_move(move_data);		
				
		//проверяем звершение игры
		let final_state = board_func.check_fin(g_board,'b');		
					
		if (final_state === 'check')
			add_message("Вы объявили шах!");
		
		if (final_state === 'checkmate' || final_state === 'stalemate' )
			this.opponent.stop(final_state + '_to_opponent');		
		
		//проверяем 50 ходов для ничьи		
		if (my_role === 'slave') {
			
			let moves_notaken_nopawnmove = Math.floor(this.draw_50/2);			
			console.log(moves_notaken_nopawnmove);
			if (moves_notaken_nopawnmove >= 50) {
				this.opponent.stop('draw_50');
				return;				
			}		

			if (moves_notaken_nopawnmove === 30 || moves_notaken_nopawnmove === 35 || moves_notaken_nopawnmove === 40 || moves_notaken_nopawnmove >= 45)
				add_message(`Ходов до ничьи: ${50-moves_notaken_nopawnmove}. Если не будет взятий или движения пешек.`)
		}
		
		
		
		//обозначаем что я сделал ход и следовательно подтвердил согласие на игру
		me_conf_play=1;

	},
	
	make_move_on_board : async function ( move_data ) {
		
		if (state === 'o')
			return;
			
		let {x1,y1,x2,y2} = move_data;
		
		
		//фиксируем если это взятие на проходе (пешка съела пустое поле)
		let pass_taken_pawn_pos_y = 0;
		if (g_board[y1][x1] === 'P' && x1 !== x2 && g_board[y2][x2] === 'x')
			pass_taken_pawn_pos_y = 3;		
		if (g_board[y1][x1] === 'p' && x1 !== x2 && g_board[y2][x2] === 'x')
			pass_taken_pawn_pos_y = 4;
		
	
		//медленно убираем съеденную фигуру если она имеется
		if (g_board[y2][x2] !=='x') {
			sf=board_func.get_checker_by_pos(x2,y2);
			anim2.add(sf,{alpha:[1,0]}, false, 0.06,'linear');
		}
		
		//определяем взятие пешки на проходе		
		if (pass_taken_pawn_pos_y !== 0) {
			sf=board_func.get_checker_by_pos(x2,pass_taken_pawn_pos_y);
			anim2.add(sf,{alpha:[1,0]}, false, 0.06,'linear');
		}
		
		
		
		//подготавливаем данные для перестановки
		let fig=board_func.get_checker_by_pos(move_data.x1,move_data.y1);
		
		let x1p=move_data.x1*50+objects.board.x+20;
		let y1p=move_data.y1*50+objects.board.y+10;
		let x2p=move_data.x2*50+objects.board.x+20;
		let y2p=move_data.y2*50+objects.board.y+10;
		
		activity_on = 1;	
		await anim2.add(fig,{x:[x1p,x2p],y:[y1p,y2p]}, true, 0.25,'easeInOutCubic');
		activity_on = 0;
		
		
		let eaten_figure = g_board[y2][x2];
		if (pass_taken_pawn_pos_y !== 0)
			eaten_figure = g_board[pass_taken_pawn_pos_y][x2];
		
		//увеличиваем количество ходов без взятия и движения пешек
		this.draw_50++;
		
		if (eaten_figure!=='x') {
			
			this.draw_50 = 0;
			sound.play('eaten');
			
			if (my_eaten[eaten_figure] !== undefined) {
				my_eaten[eaten_figure]++;		
				objects.my_pn.text = my_eaten.p;
				objects.my_rn.text = my_eaten.r;
				objects.my_nn.text = my_eaten.n;
				objects.my_bn.text = my_eaten.b;
				objects.my_qn.text = my_eaten.q;	
			}
			
			if (opp_eaten[eaten_figure] !== undefined) {
				opp_eaten[eaten_figure]++;			
				objects.opp_pn.text = opp_eaten.P;
				objects.opp_rn.text = opp_eaten.R;
				objects.opp_nn.text = opp_eaten.N;
				objects.opp_bn.text = opp_eaten.B;
				objects.opp_qn.text = opp_eaten.Q;	
			}
		}
		
		//проверяем что это движение пешки
		if (g_board[y1][x1] === 'p' || g_board[y1][x1] === 'P')
			this.draw_50 = 0;
		
		//обновляем доску
		g_board[y2][x2] = g_board[y1][x1];
		g_board[y1][x1] = 'x'	
		
		if (pass_taken_pawn_pos_y !== 0)
			g_board[pass_taken_pawn_pos_y][x2] = 'x';
		
		//если производится замена пешки
		if (move_data.pawn_replace !== undefined) 
			g_board[y2][x2] = move_data.pawn_replace;	
			
			
		
		board_func.update_board();
	},
	
	make_castling_on_board : async function ( move_data ) {
		
		if (state === 'o')
			return;
			
		let {x1,y1,x2,y2} = move_data;
				
		let y = 0;
		let king_x1 = 0;
		let king_x2 = 0;
		let rook_x1 = 0;
		let rook_x2 = 0;
		let castling_short = (Math.abs( x2 - x1 ) === 3);
		let castling_dir = Math.sign( x2 - x1 );
		
		//моя короткая
		if (y1 === 7 && castling_short === true) {			
			y = 7;
			king_x1 = x1;
			king_x2 = x1 + castling_dir * 2;
			rook_x1 = x2;
			rook_x2 = x2 - castling_dir * 2;
		}
				
		//моя длинная
		if (y1 === 7  && castling_short === false) {			
			y = 7;
			king_x1 = x1;
			king_x2 = x1 + castling_dir * 2;
			rook_x1 = x2;
			rook_x2 = x2 - castling_dir * 3;
		}
		
		//оппонента короткая
		if (y1 === 0 && castling_short === true) {			
			y = 0;
			king_x1 = x1;
			king_x2 = x1 + castling_dir * 2;
			rook_x1 = x2;
			rook_x2 = x2 - castling_dir * 2;
		}
		
		//оппонента длинная
		if (y1 === 0 && castling_short === false) {			
			y = 0;
			king_x1 = x1;
			king_x2 = x1 + castling_dir * 2;
			rook_x1 = x2;
			rook_x2 = x2 - castling_dir * 3;
		}
	
		//подготавливаем данные для перестановки
		let king_fig=board_func.get_checker_by_pos(move_data.x1,move_data.y1);
		let rook_fig=board_func.get_checker_by_pos(move_data.x2,move_data.y2);
		
		
		let king_x1p = king_x1*50 + objects.board.x+20;
		let king_y1p = y*50 + objects.board.y+10;		
		let king_x2p = king_x2*50 + objects.board.x+20;
		let king_y2p = y*50 + objects.board.y+10;
		
		let rook_x1p = rook_x1*50 + objects.board.x+20;
		let rook_y1p = y*50 + objects.board.y+10;		
		let rook_x2p = rook_x2*50 + objects.board.x+20;
		let rook_y2p = y*50 + objects.board.y+10;
		
		activity_on = 1;	
		
		await Promise.all([anim2.add(king_fig,{x:[king_x1p,king_x2p]}, true, 0.3,'easeInOutCubic'), anim2.add(rook_fig,{x:[rook_x1p,rook_x2p]}, true, 0.3,'easeInOutCubic')]);

		activity_on = 0;
							
		
		//обновляем доску
		g_board[y][rook_x2] = g_board[y][rook_x1] ;
		g_board[y][king_x2] = g_board[y][king_x1] ;
		
		//убираем старые
		g_board[y][rook_x1] = 'x';		
		g_board[y][king_x1] = 'x';	
		
					
		board_func.update_board();
	},
	
	receive_move : async function (move_data) {
		
		//воспроизводим уведомление о том что соперник произвел ход
		sound.play('receive_move');

		let {x1,y1,x2,y2} = move_data;
		
		//проверяем что это рокировку
		let castling = 0;
		if (g_board[y1][x1] === 'k' && g_board[y2][x2] === 'r' )
			castling = 1;
		
		//если это движение пешки через клетку, то фиксируем это, чтобы взять потом на проходе
		if (g_board[y1][x1] === 'p' && y1 === 1 && y2 === 3)
			pass_take = x2;
		else
			pass_take = -1;
		
		//перезапускаем таймер хода и кто ходит	
		my_turn = 1;			
		this.opponent.reset_timer_when_move();			
		
		//перемещаем мою фигуру и обновляем доску
		this.checker_is_moving = 1;		
		if (castling === 1)
			await this.make_castling_on_board(move_data);
		else
			await this.make_move_on_board(move_data);
		this.checker_is_moving = 0;
				


		//обозначаем что соперник сделал ход и следовательно подтвердил согласие на игру
		opp_conf_play=1;		
		
		//проверяем звершение игры
		let final_state = board_func.check_fin(g_board,'w');		
						
		if (final_state === 'checkmate' || final_state === 'stalemate' ) {
			this.opponent.stop(final_state + '_to_player');			
			return;
		}
		
		//проверяем 50 ходов для ничьи		
		if (my_role === 'master') {
			
			let moves_notaken_nopawnmove = Math.floor(this.draw_50/2);			
			console.log(moves_notaken_nopawnmove);
			if (moves_notaken_nopawnmove >= 50) {
				this.opponent.stop('draw_50');
				return;				
			}		

			if (moves_notaken_nopawnmove === 30 || moves_notaken_nopawnmove === 35 || moves_notaken_nopawnmove === 40 || moves_notaken_nopawnmove >= 45)
				add_message(`Ходов до ничьи: ${50-moves_notaken_nopawnmove}. Если не будет взятий или движения пешек.`)
			
		}
		
		//поверяем шах
		if (final_state === 'check') {
			add_message("Шах!");			
			this.player_under_check = 1;			
		} else {
			this.player_under_check = 0;
		}
		
	
	},
		
	play_finish_sound : function(result) {
		
		if (result === LOSE )
			sound.play('lose');
		if (result === WIN )
			sound.play('win');
		if (result === DRAW || result === NOSYNC)
			sound.play('draw');
		
	},
		
	stop : async function () {
					
		//теперь уже можно принимать приглашения
		req_dialog.reject_all_game_val = 0;
		
		//общие элементы для игры
		objects.timer.visible=false;
		objects.board.visible=false;
		objects.stickers_cont.visible=false;
		objects.cur_move_text.visible=false;
		objects.opp_card_cont.visible=false;
		objects.my_card_cont.visible=false;
		objects.my_eaten_cont.visible=false;
		objects.opp_eaten_cont.visible=false;	
		objects.selected_frame.visible=false;		
		objects.pawn_replace_dialog.visible=false;		
		objects.mini_dialog.visible=false;	
		objects.figures.forEach((c)=>{	c.visible = false});		
				
		opp_data.uid = '';
		
		move=0;		
		
		//показываем социальную панель
		if (game_platform === 'VK')
			if (Math.random()>0.75)
				social_dialog.show();
		
		show_ad();
		
		main_menu.activate();
		
		//устанавливаем статус в базе данных а если мы не видны то установливаем только скрытое состояние
		set_state({state : 'o'});		
		
	}

}

var feedback = {
		
	keys_data : [[50,180,80,218.33,'1'],[90,180,120,218.33,'2'],[130,180,160,218.33,'3'],[170,180,200,218.33,'4'],[210,180,240,218.33,'5'],[250,180,280,218.33,'6'],[290,180,320,218.33,'7'],[330,180,360,218.33,'8'],[370,180,400,218.33,'9'],[410,180,440,218.33,'0'],[450,180,550,218.33,'<'],[70,227.9,100,266.23,'Й'],[110,227.9,140,266.23,'Ц'],[150,227.9,180,266.23,'У'],[190,227.9,220,266.23,'К'],[230,227.9,260,266.23,'Е'],[270,227.9,300,266.23,'Н'],[310,227.9,340,266.23,'Г'],[350,227.9,380,266.23,'Ш'],[390,227.9,420,266.23,'Щ'],[430,227.9,460,266.23,'З'],[470,227.9,500,266.23,'Х'],[510,227.9,540,266.23,'Ъ'],[90,275.8,120,314.13,'Ф'],[130,275.8,160,314.13,'Ы'],[170,275.8,200,314.13,'В'],[210,275.8,240,314.13,'А'],[250,275.8,280,314.13,'П'],[290,275.8,320,314.13,'Р'],[330,275.8,360,314.13,'О'],[370,275.8,400,314.13,'Л'],[410,275.8,440,314.13,'Д'],[450,275.8,480,314.13,'Ж'],[490,275.8,520,314.13,'Э'],[70,323.8,100,362.13,'!'],[110,323.8,140,362.13,'Я'],[150,323.8,180,362.13,'Ч'],[190,323.8,220,362.13,'С'],[230,323.8,260,362.13,'М'],[270,323.8,300,362.13,'И'],[310,323.8,340,362.13,'Т'],[350,323.8,380,362.13,'Ь'],[390,323.8,420,362.13,'Б'],[430,323.8,460,362.13,'Ю'],[470,323.8,500,362.13,')'],[510,323.8,540,362.13,'?'],[30,371.7,180,410.03,'ЗАКРЫТЬ'],[190,371.7,420,410.03,'_'],[430,371.7,570,410.03,'ОТПРАВИТЬ']],
	p_resolve : 0,
	MAX_SYMBOLS : 50,
	
	show : function() {
		
		objects.feedback_msg.text ='';
		objects.feedback_control.text = `0/${this.MAX_SYMBOLS}`
				
		anim2.add(objects.feedback_cont,{y:[-400, objects.feedback_cont.sy]}, true, 0.4,'easeOutBack');	
		return new Promise(function(resolve, reject){					
			feedback.p_resolve = resolve;	  		  
		});
		
	},
	
	close : function() {
			
		anim2.add(objects.feedback_cont,{y:[objects.feedback_cont.y,450]}, false, 0.4,'easeInBack');		
		
	},
	
	get_texture_for_key (key) {
		
		if (key === '<') return gres.hl_key1.texture;
		if (key === 'ЗАКРЫТЬ' || key === 'ОТПРАВИТЬ') return gres.hl_key2.texture;
		if (key === '_') return gres.hl_key3.texture;
		return gres.hl_key0.texture;
	},
	
	pointerdown : function(e) {
		
		let mx = e.data.global.x/app.stage.scale.x - objects.feedback_cont.x;
		let my = e.data.global.y/app.stage.scale.y- objects.feedback_cont.y;;
		let key = -1;
		let key_x = 0;
		let key_y = 0;
		for (let k of this.keys_data) {			
			if (mx > k[0] && mx <k[2] && my > k[1] && my < k[3]) {
				key = k[4];
				key_x = k[0];
				key_y = k[1];
				break;
			}
		}
		
		//не нажата кнопка
		if (key === -1) return;			
				
		//подсвечиваем клавишу
		objects.hl_key.x = key_x - 10;
		objects.hl_key.y = key_y - 10;		
		objects.hl_key.texture = this.get_texture_for_key(key);
		anim2.add(objects.hl_key,{alpha:[1, 0]}, false, 0.5,'linear');
				
		
		if (key === '<') {
			objects.feedback_msg.text=objects.feedback_msg.text.slice(0, -1);
			key ='';
		}			
		
		if (objects.feedback_msg.text.length >= this.MAX_SYMBOLS)  {
			sound.play('locked');
			return;			
		}
		
		if (key === '_') {
			objects.feedback_msg.text += ' ';	
			key ='';
		}			
		
		if (key === 'ЗАКРЫТЬ') {
			this.close();
			this.p_resolve("close");	
			key ='';
		}	
		
		if (key === 'ОТПРАВИТЬ') {
			
			if (objects.feedback_msg.text === '') return;
			
			let fb_id = irnd(0,15);
			firebase.database().ref("fb/"+opp_data.uid+"/"+fb_id).set([objects.feedback_msg.text, firebase.database.ServerValue.TIMESTAMP, my_data.name]);
			this.close();
			this.p_resolve("sent");	
			key ='';
		}	
		

		sound.play('keypress');
		
		objects.feedback_msg.text += key;	
		objects.feedback_control.text = `${objects.feedback_msg.text.length}/${this.MAX_SYMBOLS}`		
		
	}
	
}

var keep_alive= function() {
	
	if (h_state === 1) {		
		
		//убираем из списка если прошло время с момента перехода в скрытое состояние		
		let cur_ts = Date.now();	
		let sec_passed = (cur_ts - hidden_state_start)/1000;		
		if ( sec_passed > 100 )	firebase.database().ref(room_name +"/"+my_data.uid).remove();
		return;		
	}


	firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);
	firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();
	firebase.database().ref(room_name+"/"+my_data.uid).onDisconnect().remove();

	set_state({});
}

var process_new_message=function(msg) {

	//проверяем плохие сообщения
	if (msg===null || msg===undefined)
		return;

	//принимаем только положительный ответ от соответствующего соперника и начинаем игру
	if (msg.message==="ACCEPT"  && pending_player===msg.sender && state !== "p") {
		//в данном случае я мастер и хожу вторым
		game_id=msg.game_id;
		cards_menu.accepted_invite();
	}

	//принимаем также отрицательный ответ от соответствующего соперника
	if ( pending_player===msg.sender) {
		
		if (msg.message==="REJECT")
			cards_menu.rejected_invite('Соперник отказался от игры!');
		if (msg.message==="REJECT_ALL")
			cards_menu.rejected_invite('Соперник пока не принимает приглашения!');
		
		
	}

	//получение сообщение в состояни игры
	if (state==="p") {

		//учитываем только сообщения от соперника
		if (msg.sender===opp_data.uid) {

			//получение отказа от игры
			if (msg.message==="REFUSE")
				confirm_dialog.opponent_confirm_play(0);

			//получение согласия на игру
			if (msg.message==="CONF")
				confirm_dialog.opponent_confirm_play(1);

			//получение стикера
			if (msg.message==="MSG")
				stickers.receive(msg.data);

			//получение сообщение с сдаче
			if (msg.message==="GIVEUP" )
				online_player.stop('opponent_gave_up');
				
			//запрос на ничью
			if (msg.message==="DRAWREQ" )
				mini_dialog.show('draw_request');
				
			//согласие на ничью
			if (msg.message==="DRAWOK" )
				online_player.stop('draw');
			
			
			//согласие на ничью
			if (msg.message==="TIME" )
				online_player.stop('opp_timeout');
				
			//отказ от ничьи
			if (msg.message==="DRAWNO" )
				add_message("Соперник отказался от ничьи");
				
			//получение сообщение с ходом игорка
			if (msg.message==="MOVE")
				game.receive_move(msg.data);
		}
	}

	//приглашение поиграть
	if(state==="o" || state==="b") {
					
		
		if (msg.message==="INV") {
			req_dialog.show(msg.sender);
		}
		if (msg.message==="INV_REM") {
			//запрос игры обновляет данные оппонента поэтому отказ обрабатываем только от актуального запроса
			if (msg.sender === req_dialog._opp_data.uid)
				req_dialog.hide(msg.sender);
		}
	}
}

var req_dialog = {
	
	_opp_data : {} ,
	reject_all_game_val : 0,
	
	show(uid) {		
	
	
		if (state === 'b' && req_dialog.reject_all_game_val === 1) {
			
			firebase.database().ref("inbox/"+uid).set({sender:my_data.uid,message:"REJECT_ALL",tm:Date.now()});
			return;
		}
	
		firebase.database().ref("players/"+uid).once('value').then((snapshot) => {

			//не показываем диалог если мы в игре
			if (state === 'p')
				return;

			player_data=snapshot.val();

			//показываем окно запроса только если получили данные с файербейс
			if (player_data===null) {
				//console.log("Не получилось загрузить данные о сопернике");
			}	else	{

				//так как успешно получили данные о сопернике то показываем окно
				sound.play('receive_sticker');
				anim2.add(objects.req_cont,{y:[-200, objects.req_cont.sy]},true,0.5,'easeOutElastic');

				//Отображаем  имя и фамилию в окне приглашения
				req_dialog._opp_data.name = player_data.name;
				make_text(objects.req_name,player_data.name,200);
				objects.req_rating.text = player_data.rating;
				req_dialog._opp_data.rating = player_data.rating;

				//throw "cut_string erroor";
				req_dialog._opp_data.uid=uid;
				
				
				//кнопки в соответсвии с состоянием
				if (state === 'b') {			
					objects.req_ok_w.visible=false;	
					objects.req_deny_w.visible=false;					
					objects.req_ok.visible=true;	
					objects.req_deny.visible=true;		
					objects.req_deny_all_game.visible=true;				
				} else {
					objects.req_ok.visible=false;	
					objects.req_deny.visible=false;		
					objects.req_deny_all_game.visible=false;	
					objects.req_ok_w.visible=true;	
					objects.req_deny_w.visible=true;	
					
				}

				//загружаем фото
				this.load_photo(player_data.pic_url);

			}
		});
	},

	load_photo: function(pic_url) {


		//сначала смотрим на загруженные аватарки в кэше
		if (PIXI.utils.TextureCache[pic_url]===undefined || PIXI.utils.TextureCache[pic_url].width===1) {

			//console.log("Загружаем текстуру "+objects.mini_cards[id].name)
			var loader = new PIXI.Loader();
			loader.add("inv_avatar", pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});
			loader.load((loader, resources) => {
				objects.req_avatar.texture=loader.resources.inv_avatar.texture;
			});
		}
		else
		{
			//загружаем текустуру из кэша
			//console.log("Ставим из кэша "+objects.mini_cards[id].name)
			objects.req_avatar.texture=PIXI.utils.TextureCache[pic_url];
		}

	},

	reject: function() {

		if (objects.req_cont.ready===false)
			return;
		
		
		anim2.add(objects.req_cont,{y:[objects.req_cont.y, -260]},false,0.4,'easeInBack');
		firebase.database().ref("inbox/"+req_dialog._opp_data.uid).set({sender:my_data.uid,message:"REJECT",tm:Date.now()});
	},
	
	reject_all_game: function() {

		if (objects.req_cont.ready===false)
			return;
		
		add_message("Приглашения отключены до конца игры");
		req_dialog.reject_all_game_val = 1;
		anim2.add(objects.req_cont,{y:[objects.req_cont.y, -260]},false,0.4,'easeInBack');
		firebase.database().ref("inbox/"+req_dialog._opp_data.uid).set({sender:my_data.uid,message:"REJECT_ALL",tm:Date.now()});
	},

	accept: function() {

		if (anim2.any_on()===true || objects.big_message_cont.visible === true || objects.pawn_replace_dialog.visible === true) {
			sound.play('locked');
			return;			
		}


		any_dialog_active=0;
		
		//устанавливаем окончательные данные оппонента
		opp_data=req_dialog._opp_data;


		anim2.add(objects.req_cont,{y:[objects.req_cont.y, -260]},false,0.4,'easeInBack');

		//отправляем информацию о согласии играть с идентификатором игры
		game_id=~~(Math.random()*599);
		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"ACCEPT",tm:Date.now(),game_id:game_id});

		//заполняем карточку оппонента
		make_text(objects.opp_card_name,opp_data.name,150);
		objects.opp_card_rating.text=objects.req_rating.text;
		objects.opp_avatar.texture=objects.req_avatar.texture;

		main_menu.close();
		cards_menu.close();
		game.activate("slave" , online_player );

	},

	hide: function() {

		//если диалог не открыт то ничего не делаем
		if (objects.req_cont.ready===false || objects.req_cont.visible===false)
			return;

		anim2.add(objects.req_cont,{y:[objects.req_cont.y, -260]},false,0.4,'easeInBack');
	}

}

var	show_ad=function(){
		
	if (game_platform==="YANDEX") {			
		//показываем рекламу
		window.ysdk.adv.showFullscreenAdv({
		  callbacks: {
			onClose: function() {}, 
			onError: function() {}
					}
		})
	}
	
	if (game_platform==="VK") {
				 
		vkBridge.send("VKWebAppShowNativeAds", {ad_format:"interstitial"})
		.then(data => console.log(data.result))
		.catch(error => console.log(error));	
	}		
}

var social_dialog = {
	
	show : function() {
		
		anim2.add(objects.social_cont,{x:[800,objects.social_cont.sx]}, true, 0.06,'linear');
		
		
	},
	
	invite_down : function() {
		
		if (objects.social_cont.ready !== true)
			return;
		
		sound.play('click');
		vkBridge.send('VKWebAppShowInviteBox');
		social_dialog.close();
		
	},
	
	share_down: function() {
		
		if (objects.social_cont.ready !== true)
			return;
		
		sound.play('click');
		vkBridge.send('VKWebAppShowWallPostBox', {"message": `Мой рейтинг в игре шахматы-блиц ${my_data.rating}. Сможешь победить меня?`,
		"attachments": "https://vk.com/app7991685"});
		social_dialog.close();
	},
	
	close_down: function() {
		if (objects.social_cont.ready !== true)
			return;
		
		sound.play('click');
		social_dialog.close();
	},
	
	close : function() {
		
		anim2.add(objects.social_cont,{x:[objects.social_cont.x,800]}, false, 0.06,'linear');
				
	}
	
}

var main_menu= {


	activate: function() {

		//просто добавляем контейнер с кнопками
		objects.main_buttons_cont.visible=true;
		objects.desktop.visible=true;
		objects.desktop.texture=game_res.resources.desktop.texture;
		
		

	},

	close : function() {

		objects.main_buttons_cont.visible=false;
		objects.desktop.visible=false;

	},

	play_button_down: function () {

		if (any_dialog_active===1 || activity_on===1 || anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		this.close();
		cards_menu.activate();

	},

	lb_button_down: function () {

		if (any_dialog_active===1 || anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		this.close();
		lb.show();

	},

	rules_button_down: function () {

		if (any_dialog_active===1 || anim2.any_on()===true) {
			sound.play('locked');
			return
		};

		sound.play('click');

		anim2.add(objects.rules_cont,{y:[-450, objects.rules_cont.sy]},true,0.4,'easeOutBack');

	},

	rules_ok_down: function () {
		any_dialog_active=0;
		anim2.add(objects.rules_cont,{y:[objects.rules_cont.y, -450]},false,0.4,'easeInBack');
	}

}

var lb={

	cards_pos: [[370,10],[380,70],[390,130],[380,190],[360,250],[330,310],[290,370]],

	show: function() {

		objects.desktop.visible=true;
		objects.desktop.texture=game_res.resources.lb_bcg.texture;

		anim2.add(objects.lb_1_cont,{x:[-150,objects.lb_1_cont.sx]},true,0.4,'easeOutBack');
		anim2.add(objects.lb_2_cont,{x:[-150,objects.lb_2_cont.sx]},true,0.45,'easeOutBack');
		anim2.add(objects.lb_3_cont,{x:[-150,objects.lb_3_cont.sx]},true,0.5,'easeOutBack');
		anim2.add(objects.lb_cards_cont,{x:[450,0]},true,0.5,'easeOutCubic');
		
		

		objects.lb_cards_cont.visible=true;
		objects.lb_back_button.visible=true;

		for (let i=0;i<7;i++) {
			objects.lb_cards[i].x=this.cards_pos[i][0];
			objects.lb_cards[i].y=this.cards_pos[i][1];
			objects.lb_cards[i].place.text=(i+4)+".";

		}


		this.update();

	},

	close: function() {


		objects.lb_1_cont.visible=false;
		objects.lb_2_cont.visible=false;
		objects.lb_3_cont.visible=false;
		objects.lb_cards_cont.visible=false;
		objects.lb_back_button.visible=false;

	},

	back_button_down: function() {

		if (any_dialog_active===1 || objects.lb_1_cont.ready===false) {
			sound.play('locked');
			return
		};


		sound.play('click');
		this.close();
		main_menu.activate();

	},

	update: function () {

		firebase.database().ref("players").orderByChild('rating').limitToLast(25).once('value').then((snapshot) => {

			if (snapshot.val()===null) {
			  //console.log("Что-то не получилось получить данные о рейтингах");
			}
			else {

				var players_array = [];
				snapshot.forEach(players_data=> {
					if (players_data.val().name!=="" && players_data.val().name!=='' && players_data.val().name!==undefined)
						players_array.push([players_data.val().name, players_data.val().rating, players_data.val().pic_url]);
				});


				players_array.sort(function(a, b) {	return b[1] - a[1];});

				//создаем загрузчик топа
				var loader = new PIXI.Loader();

				var len=Math.min(10,players_array.length);

				//загружаем тройку лучших
				for (let i=0;i<3;i++) {
					
					if (i >= len) break;		
					if (players_array[i][0] === undefined) break;	
					
					let fname = players_array[i][0];
					make_text(objects['lb_'+(i+1)+'_name'],fname,180);					
					objects['lb_'+(i+1)+'_rating'].text=players_array[i][1];
					loader.add('leaders_avatar_'+i, players_array[i][2],{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 3000});
				};

				//загружаем остальных
				for (let i=3;i<10;i++) {
					
					if (i >= len) break;	
					if (players_array[i][0] === undefined) break;	
					
					let fname=players_array[i][0];

					make_text(objects.lb_cards[i-3].name,fname,180);

					objects.lb_cards[i-3].rating.text=players_array[i][1];
					loader.add('leaders_avatar_'+i, players_array[i][2],{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE});
				};

				loader.load();

				//показываем аватар как только он загрузился
				loader.onProgress.add((loader, resource) => {
					let lb_num=Number(resource.name.slice(-1));
					if (lb_num<3)
						objects['lb_'+(lb_num+1)+'_avatar'].texture=resource.texture
					else
						objects.lb_cards[lb_num-3].avatar.texture=resource.texture;
				});

			}

		});

	}

}

var pawn_replace_dialog = {
		
	p_resolve : 0,
	
	show : async function () {
		
		sound.play('pawn_replace_dialog');
		let s = objects.pawn_replace_dialog;
		await anim2.add(s,{y:[-300,s.sy]}, true, 0.25,'easeOutBack');

		
		return new Promise(function(resolve, reject){					
			pawn_replace_dialog.p_resolve = resolve;	  		  
		});
	},
	
	close : async function () {
		
		let s = objects.pawn_replace_dialog;
		await anim2.add(s,{y:[s.y,-300]}, false, 0.25,'easeInBack');
		any_dialog_active = 0;			
	}, 
	
	down : function (figure) {
		
		if (anim2.any_on()===true || objects.big_message_cont.visible === true  || objects.req_cont.visible === true)	{
			sound.play('locked');
			return
		};
				
		this.close();
		sound.play('pawn_replace');
		this.p_resolve(figure);

	}
	
}

var cards_menu={

	_opp_data : {},
	uid_pic_url_cache : {},
	
	cards_pos: [
				[0,0],[0,90],[0,180],[0,270],
				[190,0],[190,90],[190,180],[190,270],
				[380,0],[380,90],[380,180],[380,270],
				[570,0],[570,90],[570,180]

				],

	activate: function () {

		objects.cards_cont.visible=true;
		objects.back_button.visible=true;

		objects.desktop.visible=true;
		objects.desktop.texture=game_res.resources.cards_bcg.texture;

		//расставляем по соответствующим координатам
		for(let i=0;i<15;i++) {
			objects.mini_cards[i].x=this.cards_pos[i][0];
			objects.mini_cards[i].y=this.cards_pos[i][1];
		}


		//отключаем все карточки
		this.card_i=1;
		for(let i=1;i<15;i++)
			objects.mini_cards[i].visible=false;

		//добавляем карточку ии
		this.add_cart_ai();

		//включаем сколько игроков онлайн
		objects.players_online.visible=true;

		//подписываемся на изменения состояний пользователей
		firebase.database().ref(room_name).on('value', (snapshot) => {cards_menu.players_list_updated(snapshot.val());});

	},

	players_list_updated: function(players) {

		//если мы в игре то не обновляем карточки
		if (state==="p" || state==="b")
			return;


		//это столы
		let tables = {};
		
		//это свободные игроки
		let single = {};


		//делаем дополнительный объект с игроками и расширяем id соперника
		let p_data = JSON.parse(JSON.stringify(players));
		
		//создаем массив свободных игроков
		for (let uid in players){			
			if (players[uid].state !== 'p' && players[uid].hidden === 0)
				single[uid] = players[uid].name;						
		}
		
		//console.table(single);
		
		//убираем не играющие состояние
		for (let uid in p_data)
			if (p_data[uid].state !== 'p')
				delete p_data[uid];
		
		
		//дополняем полными ид оппонента
		for (let uid in p_data) {			
			let small_opp_id = p_data[uid].opp_id;			
			//проходимся по соперникам
			for (let uid2 in players) {	
				let s_id=uid2.substring(0,10);				
				if (small_opp_id === s_id) {
					//дополняем полным id
					p_data[uid].opp_id = uid2;
				}							
			}			
		}
				
		
		//определяем столы
		//console.log (`--------------------------------------------------`)
		for (let uid in p_data) {
			let opp_id = p_data[uid].opp_id;
			let name1 = p_data[uid].name;
			let rating = p_data[uid].rating;
			let hid = p_data[uid].hidden;
			
			if (p_data[opp_id] !== undefined) {
				
				if (uid === p_data[opp_id].opp_id && tables[uid] === undefined) {
					
					tables[uid] = opp_id;					
					//console.log(`${name1} (Hid:${hid}) (${rating}) vs ${p_data[opp_id].name} (Hid:${p_data[opp_id].hidden}) (${p_data[opp_id].rating}) `)	
					delete p_data[opp_id];				
				}
				
			} else 
			{				
				//console.log(`${name1} (${rating}) - одиночка `)					
			}			
		}
					
		
		
		//считаем и показываем количество онлайн игроков
		let num = 0;
		for (let uid in players)
			if (players[uid].hidden===0)
				num++
		objects.players_online.text='Игроков онлайн: ' + num + '   ( комната: ' +room_name +' )';
		
		
		//считаем сколько одиночных игроков и сколько столов
		let num_of_single = Object.keys(single).length;
		let num_of_tables = Object.keys(tables).length;
		let num_of_cards = num_of_single + num_of_tables;
		
		//если карточек слишком много то убираем столы
		if (num_of_cards > 14) {
			let num_of_tables_cut = num_of_tables - (num_of_cards - 14);			
			
			let num_of_tables_to_cut = num_of_tables - num_of_tables_cut;
			
			//удаляем столы которые не помещаются
			let t_keys = Object.keys(tables);
			for (let i = 0 ; i < num_of_tables_to_cut ; i++) {
				delete tables[t_keys[i]];
			}
		}


		
		//убираем карточки пропавших игроков и обновляем карточки оставшихся
		for(let i=1;i<15;i++) {			
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {				
				let card_uid = objects.mini_cards[i].uid;				
				if (single[card_uid] === undefined)					
					objects.mini_cards[i].visible = false;
				else
					this.update_existing_card({id:i, state:players[card_uid].state , rating:players[card_uid].rating});
			}
		}



		
		//определяем новых игроков которых нужно добавить
		new_single = {};		
		
		for (let p in single) {
			
			let found = 0;
			for(let i=1;i<15;i++) {			
			
				if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'single') {					
					if (p ===  objects.mini_cards[i].uid) {
						
						found = 1;							
					}	
				}				
			}		
			
			if (found === 0)
				new_single[p] = single[p];
		}
		

		
		//убираем исчезнувшие столы (если их нет в новом перечне) и оставляем новые
		for(let i=1;i<15;i++) {			
		
			if (objects.mini_cards[i].visible === true && objects.mini_cards[i].type === 'table') {
				
				let uid1 = objects.mini_cards[i].uid1;	
				let uid2 = objects.mini_cards[i].uid2;	
				
				let found = 0;
				
				for (let t in tables) {
					
					let t_uid1 = t;
					let t_uid2 = tables[t];				
					
					if (uid1 === t_uid1 && uid2 === t_uid2) {
						delete tables[t];
						found = 1;						
					}							
				}
								
				if (found === 0)
					objects.mini_cards[i].visible = false;
			}	
		}
		
		
		//размещаем на свободных ячейках новых игроков
		for (let uid in new_single)			
			this.place_new_cart({uid:uid, state:players[uid].state, name : players[uid].name,  rating : players[uid].rating});

		//размещаем новые столы сколько свободно
		for (let uid in tables) {			
			let n1=players[uid].name
			let n2=players[tables[uid]].name
			
			let r1= players[uid].rating
			let r2= players[tables[uid]].rating
			this.place_table({uid1:uid,uid2:tables[uid],name1: n1, name2: n2, rating1: r1, rating2: r2});
		}
		
	},

	get_state_tint: function(s) {

		switch(s) {

			case "o":
				return 0x559955;
			break;

			case "b":
				return 0x376f37;
			break;

			case "p":
				return 0x344472;
			break;

			case "w":
				return 0x990000;
			break;
		}
	},

	place_table : function (params={uid1:0,uid2:0,name1: "XXX",name2: "XXX", rating1: 1400, rating2: 1400}) {
				
		for(let i=1;i<15;i++) {

			//это если есть вакантная карточка
			if (objects.mini_cards[i].visible===false) {

				//устанавливаем цвет карточки в зависимости от состояния
				objects.mini_cards[i].bcg.tint=this.get_state_tint(params.state);
				objects.mini_cards[i].state=params.state;

				objects.mini_cards[i].type = "table";
				
				
				objects.mini_cards[i].bcg.texture = gres.mini_player_card_table.texture;
				objects.mini_cards[i].bcg.tint=this.get_state_tint('p');
				
				//присваиваем карточке данные
				//objects.mini_cards[i].uid=params.uid;
				objects.mini_cards[i].uid1=params.uid1;
				objects.mini_cards[i].uid2=params.uid2;
												
				//убираем элементы свободного стола
				objects.mini_cards[i].rating_text.visible = false;
				objects.mini_cards[i].avatar.visible = false;
				objects.mini_cards[i].name_text.visible = false;

				//Включаем элементы стола 
				objects.mini_cards[i].rating_text1.visible = true;
				objects.mini_cards[i].rating_text2.visible = true;
				objects.mini_cards[i].avatar1.visible = true;
				objects.mini_cards[i].avatar2.visible = true;
				objects.mini_cards[i].rating_bcg.visible = true;

				objects.mini_cards[i].rating_text1.text = params.rating1;
				objects.mini_cards[i].rating_text2.text = params.rating2;
				
				objects.mini_cards[i].name1 = params.name1;
				objects.mini_cards[i].name2 = params.name2;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid1, tar_obj:objects.mini_cards[i].avatar1});
				
				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid2, tar_obj:objects.mini_cards[i].avatar2});


				objects.mini_cards[i].visible=true;


				break;
			}
		}
		
	},

	update_existing_card: function(params={id:0, state:"o" , rating:1400}) {

		//устанавливаем цвет карточки в зависимости от состояния(имя и аватар не поменялись)
		objects.mini_cards[params.id].bcg.tint=this.get_state_tint(params.state);
		objects.mini_cards[params.id].state=params.state;

		objects.mini_cards[params.id].rating=params.rating;
		objects.mini_cards[params.id].rating_text.text=params.rating;
		objects.mini_cards[params.id].visible=true;
	},

	place_new_cart: function(params={uid:0, state: "o", name: "XXX", rating: rating}) {

		for(let i=1;i<15;i++) {

			//это если есть вакантная карточка
			if (objects.mini_cards[i].visible===false) {

				//устанавливаем цвет карточки в зависимости от состояния
				objects.mini_cards[i].bcg.texture = gres.mini_player_card.texture;
				objects.mini_cards[i].bcg.tint=this.get_state_tint(params.state);
				objects.mini_cards[i].state=params.state;

				objects.mini_cards[i].type = "single";

				//присваиваем карточке данные
				objects.mini_cards[i].uid=params.uid;

				//убираем элементы стола так как они не нужны
				objects.mini_cards[i].rating_text1.visible = false;
				objects.mini_cards[i].rating_text2.visible = false;
				objects.mini_cards[i].avatar1.visible = false;
				objects.mini_cards[i].avatar2.visible = false;
				objects.mini_cards[i].rating_bcg.visible = false;
				
				//включаем элементы свободного стола
				objects.mini_cards[i].rating_text.visible = true;
				objects.mini_cards[i].avatar.visible = true;
				objects.mini_cards[i].name_text.visible = true;

				objects.mini_cards[i].name=params.name;
				make_text(objects.mini_cards[i].name_text,params.name,110);
				objects.mini_cards[i].rating=params.rating;
				objects.mini_cards[i].rating_text.text=params.rating;

				objects.mini_cards[i].visible=true;

				//стираем старые данные
				objects.mini_cards[i].avatar.texture=PIXI.Texture.EMPTY;

				//получаем аватар и загружаем его
				this.load_avatar2({uid:params.uid, tar_obj:objects.mini_cards[i].avatar});

				//console.log(`новая карточка ${i} ${params.uid}`)
				break;
			}
		}

	},

	get_texture : function (pic_url) {
		
		return new Promise((resolve,reject)=>{
			
			//меняем адрес который невозможно загрузить
			if (pic_url==="https://vk.com/images/camera_100.png")
				pic_url = "https://i.ibb.co/fpZ8tg2/vk.jpg";

			//сначала смотрим на загруженные аватарки в кэше
			if (PIXI.utils.TextureCache[pic_url]===undefined || PIXI.utils.TextureCache[pic_url].width===1) {

				//загружаем аватарку игрока
				//console.log(`Загружаем url из интернети или кэша браузера ${pic_url}`)	
				let loader=new PIXI.Loader();
				loader.add("pic", pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});
				loader.load(function(l,r) {	resolve(l.resources.pic.texture)});
			}
			else
			{
				//загружаем текустуру из кэша
				//console.log(`Текстура взята из кэша ${pic_url}`)	
				resolve (PIXI.utils.TextureCache[pic_url]);
			}
		})
		
	},
	
	get_uid_pic_url : function (uid) {
		
		return new Promise((resolve,reject)=>{
						
			//проверяем есть ли у этого id назначенная pic_url
			if (this.uid_pic_url_cache[uid] !== undefined) {
				//console.log(`Взяли pic_url из кэша ${this.uid_pic_url_cache[uid]}`);
				resolve(this.uid_pic_url_cache[uid]);		
				return;
			}

							
			//получаем pic_url из фб
			firebase.database().ref("players/" + uid + "/pic_url").once('value').then((res) => {

				pic_url=res.val();
				
				if (pic_url === null) {
					
					//загрузить не получилось поэтому возвращаем случайную картинку
					resolve('https://avatars.dicebear.com/v2/male/'+irnd(10,10000)+'.svg');
				}
				else {
					
					//добавляем полученный pic_url в кэш
					//console.log(`Получили pic_url из ФБ ${pic_url}`)	
					this.uid_pic_url_cache[uid] = pic_url;
					resolve (pic_url);
				}
				
			});		
		})
		
	},
	
	load_avatar2 : function (params = {uid : 0, tar_obj : 0, card_id : 0}) {
		
		//получаем pic_url
		this.get_uid_pic_url(params.uid).then(pic_url => {
			return this.get_texture(pic_url);
		}).then(t=>{			
			params.tar_obj.texture=t;			
		})	
	},

	add_cart_ai: function() {

		//убираем элементы стола так как они не нужны
		objects.mini_cards[0].rating_text1.visible = false;
		objects.mini_cards[0].rating_text2.visible = false;
		objects.mini_cards[0].avatar1.visible = false;
		objects.mini_cards[0].avatar2.visible = false;
		objects.mini_cards[0].rating_bcg.visible = false;

		objects.mini_cards[0].bcg.tint=0x777777;
		objects.mini_cards[0].visible=true;
		objects.mini_cards[0].uid="BOT";
		objects.mini_cards[0].name="Бот";
		objects.mini_cards[0].name_text.text="Бот";
		objects.mini_cards[0].rating_text.text="1400";
		objects.mini_cards[0].rating=1400;
		objects.mini_cards[0].avatar.texture=game_res.resources.pc_icon.texture;
	},
	
	card_down : function ( card_id ) {
		
		if (objects.mini_cards[card_id].type === 'single')
			this.show_invite_dialog(card_id);
		
		if (objects.mini_cards[card_id].type === 'table')
			this.show_table_dialog(card_id);
				
	},
	
	show_table_dialog : function (card_id) {
		
		if (anim2.any_on()===true || objects.td_cont.visible === true || objects.big_message_cont.visible === true ||objects.req_cont.visible === true)	{
			sound.play('locked');
			return
		};


		sound.play('click');
		
		anim2.add(objects.td_cont,{y:[-150,objects.td_cont.sy]},true,0.4,'easeOutBack');

		
		objects.td_avatar1.texture = objects.mini_cards[card_id].avatar1.texture;
		objects.td_avatar2.texture = objects.mini_cards[card_id].avatar2.texture;
		
		objects.td_rating1.text = objects.mini_cards[card_id].rating_text1.text;
		objects.td_rating2.text = objects.mini_cards[card_id].rating_text2.text;
		
		make_text(objects.td_name1, objects.mini_cards[card_id].name1, 150);
		make_text(objects.td_name2, objects.mini_cards[card_id].name2, 150);
		
	},
		
	close_table_dialog : function () {
		
		if (objects.td_cont.ready === false)
			return;
		
		any_dialog_active--;	
		
		sound.play('close');
		
		anim2.add(objects.td_cont,{y:[objects.td_cont.y,400]},false,0.4,'easeInBack');

		
		
	},

	show_invite_dialog: function(cart_id) {


		if (anim2.any_on()===true || objects.invite_cont.visible === true || 	objects.big_message_cont.visible === true ||objects.req_cont.visible === true)	{
			sound.play('locked');
			return
		};


		objects.invite_feedback.text = '';

		pending_player="";

		sound.play('click');

		//показыаем кнопку приглашения
		objects.invite_button.texture=game_res.resources.invite_button.texture;


		anim2.add(objects.invite_cont,{y:[-150,objects.invite_cont.sy]},true,0.4,'easeOutBack');

		//копируем предварительные данные
		cards_menu._opp_data = {uid:objects.mini_cards[cart_id].uid,name:objects.mini_cards[cart_id].name,rating:objects.mini_cards[cart_id].rating};

		this.show_feedbacks(cards_menu._opp_data.uid);

		let invite_available = 	cards_menu._opp_data.uid !== my_data.uid;
		invite_available=invite_available && (objects.mini_cards[cart_id].state==="o" || objects.mini_cards[cart_id].state==="b");
		invite_available=invite_available || cards_menu._opp_data.uid==="BOT";

		//показыаем кнопку приглашения только если это допустимо
		objects.invite_button.visible=objects.invite_button_title.visible = invite_available;
		objects.invite_button_title.text = ['Пригласить','Invite'][LANG];

		//заполняем карточу приглашения данными
		objects.invite_avatar.texture=objects.mini_cards[cart_id].avatar.texture;
		make_text(objects.invite_name,cards_menu._opp_data.name,230);
		objects.invite_rating.text=objects.mini_cards[cart_id].rating_text.text;

	},

	show_feedbacks: async function(uid) {
		
		//получаем фидбэки
		let _fb = await firebase.database().ref("fb/" + uid).once('value');
		let fb_obj =_fb.val();
		if (fb_obj === null) {
			objects.invite_feedback.text = '***нет отзывов***'
			return;
		}
		var fb = Object.keys(fb_obj).map((key) => [fb_obj[key][0],fb_obj[key][1],fb_obj[key][2]]);
		
		//выбираем последние отзывы
		fb.sort(function(a,b) {
			return b[1]-a[1]
		});
		
		let fb_cnt = fb.length;
		
		fb_cnt = Math.min(fb_cnt, 7);
				
		for (let i = 0 ; i < fb_cnt;i++) {
			let sender_name =  fb[i][2] || 'Неизв.';
			if (sender_name.length > 10) sender_name = sender_name.substring(0, 10);			
			objects.invite_feedback.text +=(sender_name + ': ');
			objects.invite_feedback.text +=fb[i][0];
			objects.invite_feedback.text +='\n';	
		}
				
	},

	close: function() {

		objects.cards_cont.visible=false;
		objects.back_button.visible=false;
		objects.desktop.visible=false;

		if (objects.invite_cont.visible === true)
			this.hide_invite_dialog();
		
		if (objects.td_cont.visible === true)
			this.close_table_dialog();

		//больше ни ждем ответ ни от кого
		pending_player="";

		//убираем сколько игроков онлайн
		objects.players_online.visible=false;

		//подписываемся на изменения состояний пользователей
		firebase.database().ref(room_name).off();

	},

	hide_invite_dialog: function() {

		if (objects.invite_cont.ready === false)
			return;
		
		sound.play('close');

		//отправляем сообщение что мы уже не заинтересованы в игре
		if (pending_player!=="") {
			firebase.database().ref("inbox/"+pending_player).set({sender:my_data.uid,message:"INV_REM",tm:Date.now()});
			pending_player="";
		}

		anim2.add(objects.invite_cont,{y:[objects.invite_cont.y,400]},false,0.4,'easeInBack');
	},

	send_invite: function() {


		if (anim2.any_on()===true || 	objects.big_message_cont.visible === true ||objects.req_cont.visible === true)	{
			sound.play('locked');
			return
		}

		if (cards_menu._opp_data.uid==="BOT")
		{
			cards_menu._opp_data.rating = 1400;
			
			make_text(objects.opp_card_name,cards_menu._opp_data.name,160);
			objects.opp_card_rating.text='1400';
			objects.opp_avatar.texture=objects.invite_avatar.texture;				
			
			this.close();
			game.activate('master', bot_player );
		}
		else
		{
			sound.play('click');
			objects.invite_button_title.text = ['Ждите ответ...','Waiting...'][LANG];
			firebase.database().ref("inbox/"+cards_menu._opp_data.uid).set({sender:my_data.uid,message:"INV",tm:Date.now()});
			pending_player=cards_menu._opp_data.uid;
		}



	},

	rejected_invite: function(rej_text) {

		pending_player="";
		cards_menu._opp_data={};
		this.hide_invite_dialog();
		big_message.show(rej_text,'(((', false);

	},

	accepted_invite: function() {

		//убираем запрос на игру если он открыт
		req_dialog.hide();
		
		//устанаваем окончательные данные оппонента
		opp_data=cards_menu._opp_data;
		
		//сразу карточку оппонента
		make_text(objects.opp_card_name,opp_data.name,160);
		objects.opp_card_rating.text=opp_data.rating;
		objects.opp_avatar.texture=objects.invite_avatar.texture;		

		cards_menu.close();
		game.activate("master" , online_player );
	},

	back_button_down: function() {

		if (objects.td_cont.visible === true || objects.big_message_cont.visible === true ||objects.req_cont.visible === true ||objects.invite_cont.visible === true)	{
			sound.play('locked');
			return
		};



		sound.play('click');

		this.close();
		main_menu.activate();

	}

}

var stickers={

	show_panel: function() {


		if (any_dialog_active===1) {
			sound.play('locked');
			return
		};
		any_dialog_active=1;

		if (objects.stickers_cont.ready===false)
			return;
		sound.play('click');


		//ничего не делаем если панель еще не готова
		if (objects.stickers_cont.ready===false || objects.stickers_cont.visible===true || state!=="p")
			return;

		//анимационное появление панели стикеров
		anim2.add(objects.stickers_cont,{y:[450,objects.stickers_cont.sy]},true,0.4,'easeOutBack');
	},

	hide_panel: function() {

		sound.play('close');

		if (objects.stickers_cont.ready===false)
			return;

		any_dialog_active=0;

		//убираем панель стикеров
		anim2.add(objects.stickers_cont,{y:[objects.stickers_cont.y,450]},false,0.4,'easeOutBack');

	},

	send : function(id) {

		if (objects.stickers_cont.ready===false)
			return;

		this.hide_panel();

		firebase.database().ref("inbox/"+opp_data.uid).set({sender:my_data.uid,message:"MSG",tm:Date.now(),data:id});
		add_message("Стикер отправлен сопернику");

		//показываем какой стикер мы отправили
		objects.sent_sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;
		anim2.add(objects.sent_sticker_area,{alpha:[0, 0.5]},true,0.4,'linear');
		//objects.sticker_area.visible=true;
		//убираем стикер через 5 секунд
		if (objects.sent_sticker_area.timer_id!==undefined)
			clearTimeout(objects.sent_sticker_area.timer_id);
															
		objects.sent_sticker_area.timer_id=setTimeout(()=>{anim2.add(objects.sent_sticker_area,{alpha:[0.5, 0]},false,0.4,'linear')}, 3000);

	},

	receive: function(id) {

		//воспроизводим соответствующий звук
		sound.play('receive_sticker');

		objects.rec_sticker_area.texture=game_res.resources['sticker_texture_'+id].texture;

		anim2.add(objects.rec_sticker_area,{x:[-150, objects.rec_sticker_area.sx]},true,0.4,'easeOutBack')

		//убираем стикер через 5 секунд
		if (objects.rec_sticker_area.timer_id!==undefined)
			clearTimeout(objects.rec_sticker_area.timer_id);
															
		objects.rec_sticker_area.timer_id=setTimeout(()=>{anim2.add(objects.rec_sticker_area,{x:[objects.rec_sticker_area.x, -150]},false,0.4,'easeInBack')}, 5000);

	}


}

var auth = function() {
	
	return new Promise((resolve, reject)=>{

		let help_obj = {

			loadScript : function(src) {
			  return new Promise((resolve, reject) => {
				const script = document.createElement('script')
				script.type = 'text/javascript'
				script.onload = resolve
				script.onerror = reject
				script.src = src
				document.head.appendChild(script)
			  })
			},

			vkbridge_events: function(e) {

				if (e.detail.type === 'VKWebAppGetUserInfoResult') {

					my_data.name 	= e.detail.data.first_name + ' ' + e.detail.data.last_name;
					my_data.uid 	= "vk"+e.detail.data.id;
					my_data.pic_url = e.detail.data.photo_100;

					//console.log(`Получены данные игрока от VB MINIAPP:\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);
					help_obj.process_results();
				}
			},

			init: function() {

				g_process=function() { help_obj.process()};

				let s = window.location.href;

				//-----------ЯНДЕКС------------------------------------
				if (s.includes("yandex")) {
					Promise.all([
						this.loadScript('https://yandex.ru/games/sdk/v2')
					]).then(function(){
						help_obj.yandex();
					});
					return;
				}


				//-----------ВКОНТАКТЕ------------------------------------
				if (s.includes("vk.com")) {
					Promise.all([
						this.loadScript('https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js')

					]).then(function(){
						help_obj.vk()
					});
					return;
				}


				//-----------ЛОКАЛЬНЫЙ СЕРВЕР--------------------------------
				if (s.includes("192.168")) {
					help_obj.debug();
					return;
				}


				//-----------НЕИЗВЕСТНОЕ ОКРУЖЕНИЕ---------------------------
				help_obj.unknown();

			},

			get_random_name : function(e_str) {
				
				let rnd_names = ['Gamma','Жираф','Зебра','Тигр','Ослик','Мамонт','Волк','Лиса','Мышь','Сова','Hot','Енот','Кролик','Бизон','Super','ZigZag','Magik','Alpha','Beta','Foxy','Fazer','King','Kid','Rock'];
				let chars = '+0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
				if (e_str !== undefined) {
					
					let e_num1 = chars.indexOf(e_str[0]) + chars.indexOf(e_str[1]) + chars.indexOf(e_str[2]) +	chars.indexOf(e_str[3]);
					e_num1 = Math.abs(e_num1) % (rnd_names.length - 1);					
					let e_num2 = chars.indexOf(e_str[4]).toString()  + chars.indexOf(e_str[5]).toString()  + chars.indexOf(e_str[6]).toString() ;	
					e_num2 = e_num2.substring(0, 3);
					return rnd_names[e_num1] + e_num2;					
					
				} else {

					let rnd_num = irnd(0, rnd_names.length - 1);
					let rand_uid = irnd(0, 999999)+ 100;
					let name_postfix = rand_uid.toString().substring(0, 3);
					let name =	rnd_names[rnd_num] + name_postfix;				
					return name;
				}							

			},	

			yandex: function() {

				game_platform="YANDEX";
				if(typeof(YaGames)==='undefined')
				{
					help_obj.local();
				}
				else
				{
					//если sdk яндекса найден
					YaGames.init({}).then(ysdk => {

						//фиксируем SDK в глобальной переменной
						window.ysdk=ysdk;

						//запрашиваем данные игрока
						return ysdk.getPlayer();


					}).then((_player)=>{

						my_data.name 	= _player.getName();
						my_data.uid 	= _player.getUniqueID().replace(/\//g, "Z");
						my_data.pic_url = _player.getPhoto('medium');

						//console.log(`Получены данные игрока от яндекса:\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);

						//если нет данных то создаем их
						if (my_data.name=="" || my_data.name=='')
							my_data.name = help_obj.get_random_name(my_data.uid);


						help_obj.process_results();

					}).catch((err)=>{

						//загружаем из локального хранилища если нет авторизации в яндексе
						help_obj.local();

					})
				}
			},

			vk: function() {

				game_platform="VK";
				vkBridge.subscribe((e) => this.vkbridge_events(e));
				vkBridge.send('VKWebAppInit');
				vkBridge.send('VKWebAppGetUserInfo');

			},

			debug: function() {

				game_platform = "debug";
				let uid = prompt('Отладка. Введите ID', 100);

				my_data.name = my_data.uid = "debug" + uid;
				my_data.pic_url = "https://sun9-73.userapi.com/impf/c622324/v622324558/3cb82/RDsdJ1yXscg.jpg?size=223x339&quality=96&sign=fa6f8247608c200161d482326aa4723c&type=album";

				help_obj.process_results();

			},

			local: function(repeat = 0) {

				game_platform="YANDEX";

				//ищем в локальном хранилище
				let local_uid = localStorage.getItem('uid');

				//здесь создаем нового игрока в локальном хранилище
				if (local_uid===undefined || local_uid===null) {

					//console.log("Создаем нового локального пользователя");
					let rand_uid=Math.floor(Math.random() * 9999999);
					my_data.rating 		= 	1400;
					my_data.uid			=	"ls"+rand_uid;
					my_data.name 		=	 help_obj.get_random_name(my_data.uid);					
					my_data.pic_url		=	'https://avatars.dicebear.com/v2/male/'+irnd(10,10000)+'.svg';

					try {
						localStorage.setItem('uid',my_data.uid);
					} catch (e) {
						console.log(e);
					}
					
					help_obj.process_results();
				}
				else
				{
					//console.log(`Нашли айди в ЛХ (${local_uid}). Загружаем остальное из ФБ...`);
					
					my_data.uid = local_uid;	
					
					//запрашиваем мою информацию из бд или заносим в бд новые данные если игрока нет в бд
					firebase.database().ref("players/"+my_data.uid).once('value').then((snapshot) => {		
									
						var data=snapshot.val();
						
						//если на сервере нет таких данных
						if (data === null) {
													
							//если повтоно нету данных то выводим предупреждение
							if (repeat === 1)
								alert('Какая-то ошибка');
							
							//console.log(`Нашли данные в ЛХ но не нашли в ФБ, повторный локальный запрос...`);	

							
							//повторно запускаем локальный поиск						
							localStorage.clear();
							help_obj.local(1);	
								
							
						} else {						
							
							my_data.pic_url = data.pic_url;
							my_data.name = data.name;
							help_obj.process_results();
						}

					})	

				}


			},

			unknown: function () {

				game_platform="unknown";
				alert("Неизвестная платформа! Кто Вы?")

				//загружаем из локального хранилища
				help_obj.local();
			},

			process_results: function() {


				//отображаем итоговые данные
				//console.log(`Итоговые данные:\nПлатформа:${game_platform}\nимя:${my_data.name}\nid:${my_data.uid}\npic_url:${my_data.pic_url}`);

				//обновляем базовые данные в файербейс так могло что-то поменяться
				firebase.database().ref("players/"+my_data.uid+"/name").set(my_data.name);
				firebase.database().ref("players/"+my_data.uid+"/pic_url").set(my_data.pic_url);
				firebase.database().ref("players/"+my_data.uid+"/tm").set(firebase.database.ServerValue.TIMESTAMP);

				//вызываем коллбэк
				resolve("ok");
			},

			process : function () {

				objects.id_loup.x=20*Math.sin(game_tick*8)+90;
				objects.id_loup.y=20*Math.cos(game_tick*8)+110;
			}
		}

		help_obj.init();

	});	
	
}

function resize() {
    const vpw = window.innerWidth;  // Width of the viewport
    const vph = window.innerHeight; // Height of the viewport
    let nvw; // New game width
    let nvh; // New game height

    if (vph / vpw < M_HEIGHT / M_WIDTH) {
      nvh = vph;
      nvw = (nvh * M_WIDTH) / M_HEIGHT;
    } else {
      nvw = vpw;
      nvh = (nvw * M_HEIGHT) / M_WIDTH;
    }
    app.renderer.resize(nvw, nvh);
    app.stage.scale.set(nvw / M_WIDTH, nvh / M_HEIGHT);
}

function set_state(params) {

	if (params.state!==undefined)
		state=params.state;

	if (params.hidden!==undefined)
		h_state=+params.hidden;

	let small_opp_id="";
	if (opp_data.uid!==undefined)
		small_opp_id=opp_data.uid.substring(0,10);

	firebase.database().ref(room_name + "/" + my_data.uid).set({state:state, name:my_data.name, rating : my_data.rating, hidden:h_state, opp_id : small_opp_id});

}

function vis_change() {

	if (document.hidden === true)
		hidden_state_start = Date.now();
	
	set_state({hidden : document.hidden});
	
		
}

async function load_user_data() {
	
	try {
	
		//получаем данные об игроке из социальных сетей
		await auth();
			
		//устанавлием имя на карточки
		make_text(objects.id_name,my_data.name,150);
		make_text(objects.my_card_name,my_data.name,150);
			
		//ждем пока загрузится аватар
		let loader=new PIXI.Loader();
		loader.add("my_avatar", my_data.pic_url,{loadType: PIXI.LoaderResource.LOAD_TYPE.IMAGE, timeout: 5000});			
		await new Promise((resolve, reject)=> loader.load(resolve))
		

		objects.id_avatar.texture=objects.my_avatar.texture=loader.resources.my_avatar.texture;
		
		//получаем остальные данные об игроке
		let snapshot = await firebase.database().ref("players/"+my_data.uid).once('value');
		let data = snapshot.val();
		
		//делаем защиту от неопределенности
		data===null ?
			my_data.rating=1400 :
			my_data.rating = data.rating || 1400;
			
		data===null ?
			my_data.games = 0 :
			my_data.games = data.games || 0;

		//номер комнаты
		if (my_data.rating >= 1500)
			room_name= 'states2';			
		else
			room_name= 'states';
		
		//устанавливаем рейтинг в попап
		objects.id_rating.text=objects.my_card_rating.text=my_data.rating;

		//убираем лупу
		objects.id_loup.visible=false;

		//обновляем почтовый ящик
		firebase.database().ref("inbox/"+my_data.uid).set({sender:"-",message:"-",tm:"-",data:{x1:0,y1:0,x2:0,y2:0,board_state:0}});

		//подписываемся на новые сообщения
		firebase.database().ref("inbox/"+my_data.uid).on('value', (snapshot) => { process_new_message(snapshot.val());});

		//обновляем данные в файербейс так как могли поменяться имя или фото
		firebase.database().ref("players/"+my_data.uid).set({name:my_data.name, pic_url: my_data.pic_url, rating : my_data.rating, games : my_data.games, tm:firebase.database.ServerValue.TIMESTAMP});

		//устанавливаем мой статус в онлайн
		set_state({state : 'o'});

		//отключение от игры и удаление не нужного
		firebase.database().ref("inbox/"+my_data.uid).onDisconnect().remove();
		firebase.database().ref(room_name+"/"+my_data.uid).onDisconnect().remove();

		//это событие когда меняется видимость приложения
		document.addEventListener("visibilitychange", vis_change);

		//keep-alive сервис
		setInterval(function()	{keep_alive()}, 40000);

		//указываем что актвиность загрузки завершена
		activity_on=0;
		
		//ждем и убираем попап
		await new Promise((resolve, reject) => setTimeout(resolve, 1000));
		anim2.add(objects.id_cont,{y:[objects.id_cont.y,-180]}, false, 0.6,'easeInBack');	
		
	
	} catch (error) {		
		alert (error);		
	}
	
}

async function init_game_env() {
	
	
	//ждем когда загрузятся ресурсы
	await load_resources();

	//убираем загрузочные данные
	document.getElementById("m_bar").outerHTML = "";
	document.getElementById("m_progress").outerHTML = "";

	//короткое обращение к ресурсам
	gres=game_res.resources;

	//инициируем файербейс
	if (firebase.apps.length===0) {
		firebase.initializeApp({
			apiKey: "AIzaSyDhe74ztt7r4SlTpGsLuPSPvkfzjA4HdEE",
			authDomain: "m-chess.firebaseapp.com",
			databaseURL: "https://m-chess-default-rtdb.europe-west1.firebasedatabase.app",
			projectId: "m-chess",
			storageBucket: "m-chess.appspot.com",
			messagingSenderId: "243163949609",
			appId: "1:243163949609:web:2496059afb5d1da50c4a38",
			measurementId: "G-ETX732G8FJ"
		});
	}

	
	app = new PIXI.Application({width:M_WIDTH, height:M_HEIGHT,antialias:false,backgroundColor : 0x404040});
	document.body.appendChild(app.view);

	resize();
	window.addEventListener("resize", resize);

    //создаем спрайты и массивы спрайтов и запускаем первую часть кода
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)

        switch (obj_class) {
        case "sprite":
            objects[obj_name] = new PIXI.Sprite(game_res.resources[obj_name].texture);
            eval(load_list[i].code0);
            break;

        case "block":
            eval(load_list[i].code0);
            break;

        case "cont":
            eval(load_list[i].code0);
            break;

        case "array":
			var a_size=load_list[i].size;
			objects[obj_name]=[];
			for (var n=0;n<a_size;n++)
				eval(load_list[i].code0);
            break;
        }
    }

    //обрабатываем вторую часть кода в объектах
    for (var i = 0; i < load_list.length; i++) {
        const obj_class = load_list[i].class;
        const obj_name = load_list[i].name;
		console.log('Processing: ' + obj_name)
		
		
        switch (obj_class) {
        case "sprite":
            eval(load_list[i].code1);
            break;

        case "block":
            eval(load_list[i].code1);
            break;

        case "cont":	
			eval(load_list[i].code1);
            break;

        case "array":
			var a_size=load_list[i].size;
				for (var n=0;n<a_size;n++)
					eval(load_list[i].code1);	;
            break;
        }
    }
	
	//загружаем данные об игроке
	load_user_data();
	
	//контроль за присутсвием
	var connected_control = firebase.database().ref(".info/connected");
	connected_control.on("value", (snap) => {
	  if (snap.val() === true) {
		connected = 1;
	  } else {
		connected = 0;
	  }
	});
	
	//показыаем основное меню
	main_menu.activate();
	
	console.clear()

	//запускаем главный цикл
	main_loop();

}

async function load_resources() {


	
	//это нужно удалить потом
	/*document.body.innerHTML = "Привет!\nДобавляем в игру некоторые улучшения))\nЗайдите через 40 минут.";
	document.body.style.fontSize="24px";
	document.body.style.color = "red";
	return;*/


	let git_src="https://akukamil.github.io/chess/"
	//let git_src=""


	game_res=new PIXI.Loader();
	game_res.add("m2_font", git_src+"fonts/MS_Comic_Sans/font.fnt");


	game_res.add('receive_move',git_src+'sounds/receive_move.mp3');
	game_res.add('note',git_src+'sounds/note.mp3');
	game_res.add('receive_sticker',git_src+'sounds/receive_sticker.mp3');
	game_res.add('message',git_src+'sounds/message.mp3');
	game_res.add('lose',git_src+'sounds/lose.mp3');
	game_res.add('draw',git_src+'sounds/draw.mp3');
	game_res.add('eaten',git_src+'sounds/eaten.mp3');
	game_res.add('win',git_src+'sounds/win.mp3');
	game_res.add('click',git_src+'sounds/click.mp3');
	game_res.add('mini_dialog',git_src+'sounds/mini_dialog.mp3');
	game_res.add('pawn_replace_dialog',git_src+'sounds/pawn_replace_dialog.mp3');
	game_res.add('pawn_replace',git_src+'sounds/pawn_replace.mp3');
	game_res.add('close',git_src+'sounds/close.mp3');
	game_res.add('move',git_src+'sounds/move.mp3');
	game_res.add('locked',git_src+'sounds/locked.mp3');
	game_res.add('clock',git_src+'sounds/clock.mp3');
	game_res.add('keypress',git_src+'sounds/keypress.mp3');
	
	//добавляем фигуры отдельно
	opp_figs.forEach(n => {
		
		let fn = 'b' + n;
		game_res.add(fn, git_src+"pieces/"+fn+".png");
		
		fn = 'w' + n;
		game_res.add(fn, git_src+"pieces/"+fn+".png");
		
	})

    //добавляем из листа загрузки
    for (var i = 0; i < load_list.length; i++)
        if (load_list[i].class === "sprite" || load_list[i].class === "image" )
            game_res.add(load_list[i].name, git_src+"res/" + load_list[i].name + "." +  load_list[i].image_format);		


	//добавляем текстуры стикеров
	for (var i=0;i<16;i++)
		game_res.add("sticker_texture_"+i, git_src+"stickers/"+i+".png");

	game_res.onProgress.add(progress);
	function progress(loader, resource) {
		document.getElementById("m_bar").style.width =  Math.round(loader.progress)+"%";
	}
	

	
	await new Promise((resolve, reject)=> game_res.load(resolve))

}

function main_loop() {



	//глобальная функция
	g_process();

	game_tick+=0.016666666;
	anim2.process();

	requestAnimationFrame(main_loop);
}


